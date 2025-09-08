import { CorpScore } from "./types";

export function transformCorpRows(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[]
): CorpScore[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r, i) => ({
    id: String(r.id || r.company || i),
    company: r.company ?? "",
    year: Number(r.year ?? r.reporting_year ?? new Date().getFullYear()),
    theme: (String(r.theme || "climate").toLowerCase() as CorpScore["theme"]),
    score: String(r.score || r.grade || "-").toUpperCase(),
    country: r.country ?? r.hq_country ?? undefined,
    isin: r.isin ?? undefined,
    ticker: r.ticker ?? undefined,
  })).filter(x => x.company);
}
