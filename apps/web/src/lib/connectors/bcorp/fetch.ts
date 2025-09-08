import { BcorpCompany, BcorpLocalSample, BcorpSearchResponse } from "./types";
import { transformBcorpRecord } from "./transform";
import fs from "node:fs/promises";
import path from "node:path";

const UA = "circl-docs-ui";

// Attempts an Algolia search first; if that fails we fall back to a bundled
// sample so the page still renders on Vercel or offline environments.
export async function searchBcorp(q: string): Promise<BcorpCompany[]> {
  const appId = process.env.BCORP_ALGOLIA_APP_ID;
  const apiKey = process.env.BCORP_ALGOLIA_API_KEY;
  const index = process.env.BCORP_ALGOLIA_INDEX || "bcorp_directory";

  if (appId && apiKey && index) {
    try {
      const url = `https://${appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(index)}/query`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Algolia-Application-Id": appId,
          "X-Algolia-API-Key": apiKey,
          "Accept": "application/json",
          "User-Agent": UA,
        },
        body: JSON.stringify({ query: (q || "").toString(), hitsPerPage: 20, page: 0 }),
        next: { revalidate: 86400 }, // Cache to keep requests modest.
      });
      if (!res.ok) throw new Error(`Algolia ${res.status}`);
      const data = (await res.json()) as BcorpSearchResponse;
      const items = (data?.hits || []).map(transformBcorpRecord).filter(Boolean) as BcorpCompany[];
      if (items.length) return items; // Only return if we actually got data.
    } catch (_e) {
      // Swallow errors and continue to sample so the UI remains functional.
    }
  }

  // Fallback to bundled sample for deterministic rendering without external deps.
  const p = path.join(process.cwd(), "apps/web/public/connectors/bcorp/sample.json");
  const raw = await fs.readFile(p, "utf-8");
  const sample = JSON.parse(raw) as BcorpLocalSample;
  return (sample.companies || []).map(transformBcorpRecord).filter(Boolean) as BcorpCompany[];
}
