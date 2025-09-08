import { CorpScore } from "./types";
import { transformCorpRows } from "./corp_transform";
import fs from "node:fs/promises";
import path from "node:path";

// Extend RequestInit to include Next.js' optional `next` cache config.
type NextInit = RequestInit & { next?: { revalidate?: number } };

export async function getCorpScores(params: { company?: string; year?: number; theme?: string; limit?: number; }): Promise<CorpScore[]> {
  const base = process.env.CDP_CORP_BASE;
  const key = process.env.CDP_CORP_API_KEY;

  if (base && key) {
    const url = new URL("/scores", base);
    if (params.company) url.searchParams.set("company", params.company);
    if (params.year) url.searchParams.set("year", String(params.year));
    if (params.theme) url.searchParams.set("theme", String(params.theme));
    if (params.limit) url.searchParams.set("limit", String(params.limit));

    try {
      const res = await fetch(
        url.toString(),
        {
          headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
          next: { revalidate: 3600 }
        } as NextInit // allow Next.js-specific `next` cache option without `any`
      );
      if (res.ok) {
        const data = await res.json();
        const items = transformCorpRows(data);
        if (items.length) return items;
      }
    } catch { /* noop */ }
  }

  // Fallback
  const p = path.join(process.cwd(), "apps/web/public/connectors/cdp/sample-corporate.json");
  const raw = await fs.readFile(p, "utf-8");
  return transformCorpRows(JSON.parse(raw));
}
