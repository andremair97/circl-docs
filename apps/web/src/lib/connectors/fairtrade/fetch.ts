import fs from 'fs/promises';
import path from 'path';
import { FairtradeCollection, FairtradeEntity } from './types';
import { transformFairtrade } from './transform';

// Reads the bundled sample so the page works offline or when remote data fails.
async function loadSample(): Promise<FairtradeEntity[]> {
  const file = path.join(process.cwd(), 'public', 'connectors', 'fairtrade', 'sample.json');
  const json = await fs.readFile(file, 'utf-8');
  const data = JSON.parse(json) as FairtradeCollection;
  return data.items
    .map(transformFairtrade)
    .filter((e): e is FairtradeEntity => Boolean(e));
}

// Queries the Fairtrade dataset either from a remote export or the local sample.
export async function searchFairtrade(
  q: string,
  opts?: { country?: string; type?: 'Producer' | 'Trader' | 'Licensee' }
): Promise<FairtradeEntity[]> {
  const url = process.env.FAIRTRADE_JSON_URL;
  let items: FairtradeEntity[] | undefined;

  if (url) {
    try {
      const res = await fetch(
        url,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'circl-docs-ui',
          },
          next: { revalidate: 86400 },
        } as RequestInit & { next: { revalidate: number } }
      );
      if (res.ok) {
        const data = (await res.json()) as FairtradeCollection;
        items = data.items
          .map(transformFairtrade)
          .filter((e): e is FairtradeEntity => Boolean(e));
      }
    } catch {
      // silently fall back to the sample so the UI still renders
    }
  }

  if (!items || items.length === 0) items = await loadSample();

  const qLower = q.toLowerCase();
  return items.filter((e) => {
    const haystack = [e.name, e.id, e.country, ...e.categories]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesQ = haystack.includes(qLower);
    const matchesCountry = opts?.country
      ? e.country?.toLowerCase() === opts.country.toLowerCase()
      : true;
    const matchesType = opts?.type ? e.entityType === opts.type : true;
    return matchesQ && matchesCountry && matchesType;
  });
}
