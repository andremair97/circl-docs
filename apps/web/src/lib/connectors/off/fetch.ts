import { OffProduct, OffSearchResponse } from "./types";
import { transformOffProduct } from "./transform";
import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_BASE = "https://world.openfoodfacts.org";

// Fetch products from OFF with a graceful fallback to bundled sample data.
export async function searchOffProducts(q: string): Promise<OffProduct[]> {
  const base = process.env.OFF_API_BASE || DEFAULT_BASE;
  const url = new URL("/api/v2/search", base);

  const fields = [
    "product_name","brands","brands_tags","nutriscore_grade","nutrition_grades",
    "ecoscore_grade","ecoscore_score","nova_group","labels_tags","packaging",
    "allergens","code","image_front_url","countries_tags_en","categories_tags_en",
    "quantity"
  ].join(",");

  url.searchParams.set("fields", fields);
  url.searchParams.set("page_size", "20");
  url.searchParams.set("sort_by", "popularity_key");
  url.searchParams.set("lang", "en");
  if (q?.trim()) url.searchParams.set("search_terms", q.trim());

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json", "User-Agent": "circl-docs-ui" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`OFF ${res.status}`);
    const data = (await res.json()) as OffSearchResponse;
    const items = (data?.products || [])
      .map(transformOffProduct)
      .filter(Boolean) as OffProduct[];
    if (items.length) return items;
  } catch {
    // If the network call fails or returns empty, fall through to sample.
  }

  // Fallback: static sample ensures the page always renders
  const samplePath = path.join(process.cwd(), "apps/web/public/connectors/off/sample.json");
  const sampleRaw = await fs.readFile(samplePath, "utf-8");
  const sample = JSON.parse(sampleRaw) as OffSearchResponse;
  return (sample.products || [])
    .map(transformOffProduct)
    .filter(Boolean) as OffProduct[];
}
