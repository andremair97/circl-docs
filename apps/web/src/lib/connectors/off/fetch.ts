import { OffProduct, OffSearchResponse } from "./types";
import { transformOffProduct } from "./transform";
import fs from "node:fs/promises";
import path from "node:path";

// Default OFF base if env var not provided.
const DEFAULT_BASE = "https://world.openfoodfacts.org";

// Search OFF for products. Falls back to bundled sample data on error or empty results.
export async function searchOffProducts(q: string): Promise<OffProduct[]> {
  const base = process.env.OFF_API_BASE || DEFAULT_BASE;
  const url = new URL("/api/v2/search", base);
  const fields = [
    "product_name","brands","nutriscore_grade","ecoscore_grade","ecoscore_score",
    "nova_group","labels_tags","packaging","allergens","code","image_front_url",
    "countries_tags_en","categories_tags_en","quantity","nutrition_grades","brands_tags"
  ].join(",");
  url.searchParams.set("fields", fields);
  url.searchParams.set("page_size", "20");
  url.searchParams.set("sort_by", "popularity_key");
  url.searchParams.set("lang", "en");
  if (q?.trim()) url.searchParams.set("search_terms", q.trim());

  try {
    // Cast fetch options so TypeScript accepts Next.js-specific `next` cache hint.
    const res = await fetch(
      url.toString(),
      {
        headers: { "Accept": "application/json", "User-Agent": "circl-docs-ui" },
        next: { revalidate: 3600 },
      } as unknown as RequestInit
    );
    if (!res.ok) throw new Error(`OFF ${res.status}`);
    const data = (await res.json()) as OffSearchResponse;
    const items = (data?.products || []).map(transformOffProduct).filter(Boolean) as OffProduct[];
    if (items.length) return items;
    // Fallthrough to sample if empty
  } catch (_e) {
    // ignore and use sample
  }

  const samplePath = path.join(process.cwd(), "apps/web/public/connectors/off/sample.json");
  const sampleRaw = await fs.readFile(samplePath, "utf-8");
  const sample = JSON.parse(sampleRaw) as OffSearchResponse;
  return (sample.products || []).map(transformOffProduct).filter(Boolean) as OffProduct[];
}
