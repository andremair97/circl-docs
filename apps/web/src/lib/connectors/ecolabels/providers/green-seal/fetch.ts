import { CertifiedProduct, SearchParamsInput } from "../../types";
import { transformGsJson } from "./transform";
import fs from "node:fs/promises";
import path from "node:path";

export async function searchGreenSeal(params: SearchParamsInput): Promise<CertifiedProduct[]> {
  const base = process.env.GREEN_SEAL_API_BASE;
  const key  = process.env.GREEN_SEAL_API_KEY;
  const q = params.q?.trim() ?? "";

  if (base && key) {
    try {
      const url = new URL("/search", base);     // adjust path if different; we just append /search
      if (q) url.searchParams.set("q", q);
      if (params.category) url.searchParams.set("category", params.category!);
      if (params.country) url.searchParams.set("country", params.country!);
      if (params.page) url.searchParams.set("page", String(params.page));
      if (params.pageSize) url.searchParams.set("pageSize", String(params.pageSize));
      url.searchParams.set("apikey", key);

      const res = await fetch(url.toString(), {
        headers: { "Accept": "application/json", "User-Agent": "circl-docs-ui" },
        next: { revalidate: 3600 },
      });
      if (!res.ok) throw new Error(`GREEN_SEAL ${res.status}`);
      const data = await res.json();
      const items = transformGsJson(data);
      if (items.length) return items;
    } catch (_e) { /* fall back to sample */ }
  }

  const samplePath = path.join(process.cwd(), "apps/web/public/connectors/ecolabels/greenseal-sample.json");
  const sampleRaw = await fs.readFile(samplePath, "utf-8");
  return transformGsJson(JSON.parse(sampleRaw));
}
