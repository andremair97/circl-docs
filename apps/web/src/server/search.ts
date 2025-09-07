import fs from 'fs/promises';
import path from 'path';
import { Product } from '../types/universal';
import { Mode } from '../components/PathwayTabs';

// Map API modes to fixture connectors.
const modeMap: Record<Mode, string> = {
  borrow: 'lot',
  repair: 'ifixit',
  used: 'ebay',
  bfl: 'off',
};

// Adapters translate raw fixture shapes into the universal product interface.
// Each connector exposes a slightly different shape; using `unknown` keeps the
// mapping flexible while still enforcing a typed result.
const adapters: Record<string, (item: unknown) => Product> = {
  off: (item) => {
    const o = item as {
      id: string;
      product_name: string;
      ingredients_text: string;
      image_url?: string;
      url: string;
      fetched_at: string;
    };
    return {
      id: o.id,
      title: o.product_name,
      summary: o.ingredients_text,
      image: o.image_url,
      source: 'off',
      url: o.url,
      fetched_at: o.fetched_at,
    };
  },
  ifixit: (item) => {
    const i = item as {
      id: string;
      title: string;
      summary: string;
      image?: string;
      url: string;
      fetched_at: string;
    };
    return {
      id: i.id,
      title: i.title,
      summary: i.summary,
      image: i.image,
      source: 'ifixit',
      url: i.url,
      fetched_at: i.fetched_at,
    };
  },
  ebay: (item) => {
    const e = item as {
      id: string;
      title: string;
      summary: string;
      image?: string;
      url: string;
      fetched_at: string;
    };
    return {
      id: e.id,
      title: e.title,
      summary: e.summary,
      image: e.image,
      source: 'ebay',
      url: e.url,
      fetched_at: e.fetched_at,
    };
  },
  lot: (item) => {
    const l = item as {
      id: string;
      title: string;
      summary: string;
      image?: string;
      url: string;
      fetched_at: string;
    };
    return {
      id: l.id,
      title: l.title,
      summary: l.summary,
      image: l.image,
      source: 'lot',
      url: l.url,
      fetched_at: l.fetched_at,
    };
  },
};

async function loadFixture(connector: string) {
  // process.cwd() resolves to the web app root in both Next.js and test runs.
  const file = path.join(process.cwd(), 'fixtures', `${connector}.json`);
  const json = await fs.readFile(file, 'utf-8');
  return JSON.parse(json);
}

// Returns products matching query via case-insensitive substring match.
export async function searchProducts(q: string, mode: Mode): Promise<Product[]> {
  const connector = modeMap[mode];
  const raw = await loadFixture(connector);
  const map = adapters[connector];
  return raw
    .map(map)
    .filter((p: Product) =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.summary.toLowerCase().includes(q.toLowerCase()),
    );
}
