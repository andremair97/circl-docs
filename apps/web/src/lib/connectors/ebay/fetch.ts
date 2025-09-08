import { EbayItem, EbaySearchResponse } from "./types";
import { transformEbayItem } from "./transform";
import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_BASE = "https://api.ebay.com/buy/browse/v1";

// Queries the eBay Browse API, falling back to bundled sample data when offline
// or when credentials are missing. This keeps builds and previews deterministic.
export async function searchEbay(q: string): Promise<EbayItem[]> {
  const base = process.env.EBAY_BROWSE_BASE || DEFAULT_BASE;
  const market = process.env.EBAY_MARKETPLACE || "EBAY_GB";
  const token = process.env.EBAY_OAUTH_TOKEN;

  const url = new URL("/item_summary/search", base);
  if (q?.trim()) url.searchParams.set("q", q.trim());
  url.searchParams.set("limit", "20");

  async function readSample(): Promise<EbayItem[]> {
    // Use a small sample dataset so the UI always renders even without API access.
    const samplePath = path.join(process.cwd(), "public/connectors/ebay/sample.json");
    const raw = await fs.readFile(samplePath, "utf-8");
    const data = JSON.parse(raw) as EbaySearchResponse;
    return (data.itemSummaries || []).map(transformEbayItem).filter(Boolean) as EbayItem[];
  }

  try {
    if (!token) throw new Error("Missing EBAY_OAUTH_TOKEN");
    const res = await fetch(
      url.toString(),
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "circl-docs-ui",
          "Authorization": `Bearer ${token}`,
          "X-EBAY-C-MARKETPLACE-ID": market,
        },
        // Tell Next.js to revalidate server-side results every 30 minutes.
        // The cast preserves the `next` option while keeping strict TS happy.
        next: { revalidate: 1800 },
      } as RequestInit & { next: { revalidate: number } },
    );
    if (!res.ok) throw new Error(`eBay ${res.status}`);
    const data = (await res.json()) as EbaySearchResponse;
    const items = (data.itemSummaries || []).map(transformEbayItem).filter(Boolean) as EbayItem[];
    if (items.length) return items;
    return await readSample();
  } catch {
    return await readSample();
  }
}
