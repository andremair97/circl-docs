import fs from "node:fs/promises";
import path from "node:path";
import { PROVIDERS } from "./providers";
import {
  EnergyStarCategory,
  EnergyStarProduct,
  EnergyStarResponse,
  EnergyStarSearchParams,
} from "./types";
import { mapProviderRecordToProduct } from "./transform";

const DEFAULT_CATEGORIES: EnergyStarCategory[] = ["Refrigerators","Dishwashers","Monitors"];

async function readSample(): Promise<EnergyStarProduct[]> {
  // Read bundled fallback data so the connector works without env configuration.
  const p = path.join(process.cwd(), "public/connectors/energy-star/sample.json");
  const raw = await fs.readFile(p, "utf-8");
  const json = JSON.parse(raw) as EnergyStarResponse;
  return json.items ?? [];
}

async function fetchCategory(category: EnergyStarCategory): Promise<EnergyStarProduct[]> {
  const envName = PROVIDERS[category].envUrl;
  const url = process.env[envName];

  // No provider configured → skip remote and let caller fall through to sample.
  if (!url) return [];

  const headers: Record<string, string> = {
    "Accept": "application/json",
    "User-Agent": "circl-docs-ui",
  };
  if (process.env.ENERGY_STAR_API_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.ENERGY_STAR_API_TOKEN}`;
  }

  const res = await fetch(
    url,
    { headers, next: { revalidate: 86400 } } as RequestInit & { next: { revalidate: number } }
  );
  if (!res.ok) throw new Error(`${category} provider ${res.status}`);
  const data = await res.json();

  const dataObj = data as { results?: unknown[] };
  const items = Array.isArray(data) ? data : (Array.isArray(dataObj.results) ? dataObj.results : []);
  return items
    .map((r: unknown) => mapProviderRecordToProduct(r, category))
    .filter(Boolean) as EnergyStarProduct[];
}

/** High-level search with optional text and category filter. */
export async function searchEnergyStar(params: EnergyStarSearchParams = {}): Promise<EnergyStarProduct[]> {
  const categoryList = params.category ? [params.category] : DEFAULT_CATEGORIES;

  let collected: EnergyStarProduct[] = [];
  try {
    // Try remote providers (if any envs set)
    const perCat = await Promise.all(categoryList.map(fetchCategory));
    collected = perCat.flat();
  } catch (_e) {
    // ignore and fall back
  }

  if (!collected.length) {
    // Fallback to sample
    collected = await readSample();
    // If a category was chosen, filter sample to it
    if (params.category) collected = collected.filter(i => i.category === params.category);
  }

  // Text filter (brand/model contains q)
  const q = params.q?.trim().toLowerCase();
  if (q) {
    collected = collected.filter(i =>
      i.brand.toLowerCase().includes(q) || i.model.toLowerCase().includes(q)
    );
  }

  // Stable-ish ordering: Most Efficient first, then lowest annual kWh, then brand/model
  collected.sort((a, b) => {
    const me = (b.mostEfficient ? 1 : 0) - (a.mostEfficient ? 1 : 0);
    if (me !== 0) return me;
    const ak = (a.annualKwh ?? Number.POSITIVE_INFINITY) - (b.annualKwh ?? Number.POSITIVE_INFINITY);
    if (ak !== 0) return ak;
    return (a.brand + a.model).localeCompare(b.brand + b.model);
  });

  return collected;
}
