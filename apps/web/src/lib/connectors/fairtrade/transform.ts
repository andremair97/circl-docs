import { FairtradeEntity } from './types';

// Normalises arbitrary source records into the internal FairtradeEntity shape.
// We defensively read possible field variants because upstream exports are not stable.
export function transformFairtrade(record: unknown): FairtradeEntity | null {
  const r = record as Record<string, any>;

  const id = r.floid || r.licence || r.id || r.code || r.slug || r.name;
  const name = r.organisation || r.company || r.name;
  if (!id && !name) return null; // without an identifier the row cannot be referenced later

  const rawType = r.type || r.role || r.entityType;
  let entityType: FairtradeEntity['entityType'];
  if (rawType) {
    const t = String(rawType).toLowerCase();
    if (t.includes('producer')) entityType = 'Producer';
    else if (t.includes('trader')) entityType = 'Trader';
    else if (t.includes('licensee') || t.includes('licence')) entityType = 'Licensee';
    else entityType = 'Unknown';
  }

  const toKebab = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const rawCats = r.categories || r.products || r.product_groups || [];
  const categories: string[] = Array.isArray(rawCats)
    ? rawCats.map((c: any) => toKebab(String(c))).filter(Boolean)
    : [];

  return {
    id: String(id),
    name: String(name),
    country: r.country || r.countryName || r.country_code,
    entityType,
    categories,
    website: r.website || r.url,
    certificateStatus: r.status || 'unknown',
    licenceHolder: r.licensee || r.licence_holder,
  };
}
