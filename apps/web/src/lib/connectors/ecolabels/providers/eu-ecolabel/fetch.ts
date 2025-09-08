import { CertifiedProduct, SearchParamsInput } from "../../types";
import { transformEuRow, transformEuJson } from "./transform";
import fs from "node:fs/promises";
import path from "node:path";

export async function searchEuEcolabel(params: SearchParamsInput): Promise<CertifiedProduct[]> {
  const q = params.q?.trim().toLowerCase() ?? "";
  const apiUrl = process.env.EU_ECOLABEL_API_URL;
  const csvUrl = process.env.EU_ECOLABEL_CSV_URL;

  // 1) JSON API path
  if (apiUrl) {
    try {
      const url = new URL(apiUrl);
      if (q) url.searchParams.set("q", q);
      if (params.country) url.searchParams.set("country", params.country);
      if (params.category) url.searchParams.set("category", params.category);
      if (params.page) url.searchParams.set("page", String(params.page));
      if (params.pageSize) url.searchParams.set("pageSize", String(params.pageSize));

      const res = await fetch(url.toString(), {
        headers: { "Accept": "application/json", "User-Agent": "circl-docs-ui" },
        next: { revalidate: 3600 },
      });
      if (!res.ok) throw new Error(`EU_ECOLABEL API ${res.status}`);
      const data = await res.json();
      const items = transformEuJson(data);
      const filtered = q
        ? items.filter(i =>
            i.name.toLowerCase().includes(q) ||
            (i.brand ?? "").toLowerCase().includes(q) ||
            (i.company ?? "").toLowerCase().includes(q)
          )
        : items;
      if (filtered.length) return filtered;
    } catch (_) { /* fall back to CSV or sample */ }
  }

  // 2) CSV path
  if (csvUrl) {
    try {
      const res = await fetch(csvUrl, {
        headers: { "Accept": "text/csv", "User-Agent": "circl-docs-ui" },
        next: { revalidate: 3600 },
      });
      if (!res.ok) throw new Error(`EU_ECOLABEL CSV ${res.status}`);
      const text = await res.text();
      const rows = parseCsv(text);          // implement simple CSV parser in this file
      const items = rows.map(transformEuRow).filter(Boolean) as CertifiedProduct[];
      const filtered = q
        ? items.filter(i =>
            i.name.toLowerCase().includes(q) ||
            (i.brand ?? "").toLowerCase().includes(q) ||
            (i.company ?? "").toLowerCase().includes(q)
          )
        : items;
      // basic pagination
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 25;
      const start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    } catch (_) { /* fall back to sample */ }
  }

  // 3) Sample fallback
  const samplePath = path.join(process.cwd(), "apps/web/public/connectors/ecolabels/eu-sample.csv");
  const sampleRaw = await fs.readFile(samplePath, "utf-8");
  const rows = parseCsv(sampleRaw);
  const items = rows.map(transformEuRow).filter(Boolean) as CertifiedProduct[];
  return items;

  // naive CSV parser (no quotes/escapes complexity; sample kept simple)
  function parseCsv(csv: string): string[][] {
    return csv
      .trim()
      .split(/\r?\n/)
      .map((line) => line.split(",").map((s) => s.trim()));
  }
}
