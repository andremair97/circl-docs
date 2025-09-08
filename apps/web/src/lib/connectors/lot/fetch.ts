import { LotItem, LotQuery } from './types';
import { fetchJsonFeed } from './providers/json';
import { fetchSample } from './providers/sample';

// Searches Library of Things items, preferring the JSON feed when available.
export async function searchLotItems(q: LotQuery): Promise<LotItem[]> {
  const fromJson = await fetchJsonFeed(q).catch(() => null);
  if (fromJson && fromJson.length) return fromJson;
  return fetchSample(q);
}
