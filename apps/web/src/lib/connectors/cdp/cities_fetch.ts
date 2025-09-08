import { CityEmission } from "./types";
import { transformSocrataRowsToCityEmissions } from "./cities_transform";
import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_HOST = "https://data.cdp.net";

async function discoverEmissionsDataset(host: string): Promise<string | null> {
  // Use Socrata Discovery API to find a dataset likely containing citywide emissions.
  // Example endpoint (server-side only):
  // https://api.us.socrata.com/api/catalog/v1?domains=data.cdp.net&only=datasets&q=emissions%20inventory&limit=5
  const discoveryUrl = new URL("https://api.us.socrata.com/api/catalog/v1");
  discoveryUrl.searchParams.set("domains", host.replace(/^https?:\/\//, ""));
  discoveryUrl.searchParams.set("search_context", host.replace(/^https?:\/\//, ""));
  discoveryUrl.searchParams.set("only", "datasets");
  discoveryUrl.searchParams.set("q", "emissions inventory");
  discoveryUrl.searchParams.set("limit", "5");

  const res = await fetch(discoveryUrl.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const data = await res.json();
  // Heuristic: pick the first dataset whose columns include a likely total emissions field.
  const datasets = data?.results || [];
  for (const d of datasets) {
    const id = d?.resource?.id;
    const cols: string[] = (d?.resource?.columns_field_name || []).map((s: string) => s.toLowerCase());
    if (id && cols.some(c => /total.*emission|city.*emission|tco2e/.test(c))) return id;
  }
  return datasets?.[0]?.resource?.id ?? null;
}

export async function findCityEmissions(params: { city?: string; country?: string; fromYear?: number; toYear?: number; limit?: number; }): Promise<CityEmission[]> {
  const host = process.env.CDP_SOCRATA_HOST || DEFAULT_HOST;
  const appToken = process.env.CDP_SODA_APP_TOKEN;
  const dataset = await discoverEmissionsDataset(host);

  if (dataset) {
    // Build a permissive SoQL query; we select broad fields and let the transformer normalize.
    const soda = new URL(`${host}/resource/${dataset}.json`);
    const limit = String(params.limit ?? 50);
    soda.searchParams.set("$limit", limit);

    const where: string[] = [];
    if (params.city) where.push(`upper(city) like upper('${params.city.replace(/'/g,"''")}%')`);
    if (params.country) where.push(`upper(country) like upper('${params.country.replace(/'/g,"''")}%')`);
    if (params.fromYear && params.toYear) where.push(`year between ${params.fromYear} and ${params.toYear}`);
    if (where.length) soda.searchParams.set("$where", where.join(" AND "));

    const headers: Record<string,string> = { "Accept": "application/json" };
    if (appToken) headers["X-App-Token"] = appToken;

    try {
      const res = await fetch(soda.toString(), { headers, next: { revalidate: 3600 } });
      if (res.ok) {
        const rows = await res.json();
        const items = transformSocrataRowsToCityEmissions(rows, dataset);
        if (items.length) return items;
      }
    } catch { /* noop */ }
  }

  // Fallback to sample if discovery or query fails
  const p = path.join(process.cwd(), "apps/web/public/connectors/cdp/sample-cities.json");
  const raw = await fs.readFile(p, "utf-8");
  const sample = JSON.parse(raw);
  return transformSocrataRowsToCityEmissions(sample, "sample");
}
