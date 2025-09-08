import fs from 'node:fs/promises';
import path from 'node:path';
import { TcoProduct, TcoSearchResponse } from './types';
import { transformTcoRecord } from './transform';

const DEFAULT_BASE = 'https://api.tcocertified.com';

async function fetchToken(): Promise<string | null> {
  const user = process.env.TCO_API_USER;
  const key = process.env.TCO_API_KEY;
  const base = process.env.TCO_API_BASE || DEFAULT_BASE;
  if (!user || !key) return null;
  try {
    const init: RequestInit & { next: { revalidate: number } } = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ username: user, password: key }),
      next: { revalidate: 86400 },
    };
    const res = await fetch(`${base}/token`, init);
    if (!res.ok) return null;
    const data = (await res.json()) as { token?: string };
    return data.token || null;
  } catch {
    return null;
  }
}

async function fetchGtinList(token: string | null, productType?: string): Promise<TcoProduct[]> {
  const base = process.env.TCO_API_BASE || DEFAULT_BASE;
  try {
    const url = new URL(`${base}/generic/gtin`);
    url.searchParams.set('page', '1');
    if (productType) url.searchParams.set('product_type', productType);
    if (process.env.TCO_API_USE_JSONLD === 'true') url.searchParams.set('jsonld', 'true');
    const init: RequestInit & { next: { revalidate: number } } = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? { 'X-Auth-Token': `Bearer ${token}` } : {}),
      },
      next: { revalidate: 86400 },
    };
    const res = await fetch(url.toString(), init);
    if (!res.ok) return [];
    const data: unknown = await res.json();
    const record = (data as Record<string, unknown>) || {};
    const list = Array.isArray(data)
      ? data
      : (record.items as unknown[]) ||
        (record.results as unknown[]) ||
        (record.data as unknown[]) ||
        [];
    return (list as unknown[])
      .map((r) => transformTcoRecord(r))
      .filter((p): p is TcoProduct => p !== null);
  } catch {
    return [];
  }
}

async function loadSample(productType?: string): Promise<TcoProduct[]> {
  try {
    const samplePath = path.join(process.cwd(), 'public/connectors/tco/sample.json');
    const raw = await fs.readFile(samplePath, 'utf8');
    const data = JSON.parse(raw) as TcoSearchResponse;
    let items = Array.isArray(data.items) ? data.items : [];
    if (productType) {
      const type = productType.toLowerCase();
      items = items.filter((i) => i.productType?.toLowerCase() === type);
    }
    return items;
  } catch {
    return [];
  }
}

export async function searchTcoProducts(q: string | undefined, productType?: string): Promise<TcoProduct[]> {
  let items: TcoProduct[] = [];
  const token = await fetchToken();
  if (token) {
    items = await fetchGtinList(token, productType);
  }
  if (!token || items.length === 0) {
    items = await loadSample(productType);
  }
  if (q) {
    const qLower = q.toLowerCase();
    items = items.filter((i) =>
      [i.brand, i.model, i.gtin, i.certificateNumber].some((f) =>
        f?.toLowerCase().includes(qLower)
      )
    );
  }
  return items;
}
