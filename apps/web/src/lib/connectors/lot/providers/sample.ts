import fs from 'node:fs/promises';
import path from 'node:path';
import { LotItem, LotQuery, LotResponse } from '../types';
import { transformLotItem } from '../transform';

// Reads bundled sample data deterministically.
export async function fetchSample(q: LotQuery): Promise<LotItem[]> {
  const p = path.join(
    process.cwd(),
    'apps/web/public/connectors/lot/sample.json',
  );
  const raw = await fs.readFile(p, 'utf-8');
  const data = JSON.parse(raw) as LotResponse;
  let items = (data.items ?? [])
    .map(transformLotItem)
    .filter(Boolean) as LotItem[];

  if (q.location) items = items.filter((i) => i.locationCode === q.location);
  if (q.q?.trim()) {
    const s = q.q.trim().toLowerCase();
    items = items.filter((i) => i.name.toLowerCase().includes(s));
  }
  return items;
}
