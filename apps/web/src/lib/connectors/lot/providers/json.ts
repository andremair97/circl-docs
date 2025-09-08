import { LotItem, LotQuery, LotResponse } from '../types';
import { transformLotItem } from '../transform';

const REVALIDATE = 3600;

// Attempts to fetch from an external JSON feed; returns null on error/empty.
export async function fetchJsonFeed(q: LotQuery): Promise<LotItem[] | null> {
  const base = process.env.LOT_FEED_URL;
  if (!base) return null;
  const url = new URL(base);
  if (q.q) url.searchParams.set('q', q.q);
  if (q.location) url.searchParams.set('location', q.location);

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'circl-docs-ui',
    },
    next: { revalidate: REVALIDATE },
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const data = (await res.json()) as LotResponse;
  const items = (data.items ?? [])
    .map(transformLotItem)
    .filter(Boolean) as LotItem[];
  return items.length ? items : null;
}
