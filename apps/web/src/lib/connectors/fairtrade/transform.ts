import { FairtradeEntity } from './types';

// Normalises arbitrary source records into the internal FairtradeEntity shape.
// We defensively read possible field variants because upstream exports are not stable.
export function transformFairtrade(record: unknown): FairtradeEntity | null {
  // `record` can come in many shapes; coerce to an indexable object while
  // keeping values as `unknown` so downstream reads stay type-safe.
  const r = record as Record<string, unknown>;

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
    ? rawCats.map((c) => toKebab(String(c))).filter(Boolean)
    : [];

  const country = [r.country, r.countryName, r.country_code].find(
    (c): c is string => typeof c === 'string'
  );
  const website = [r.website, r.url].find(
    (w): w is string => typeof w === 'string'
  );
  const certificateStatus =
    typeof r.status === 'string' ? (r.status as FairtradeEntity['certificateStatus']) : 'unknown';
  const licenceHolder = [r.licensee, r.licence_holder].find(
    (l): l is string => typeof l === 'string'
  );

  return {
    id: String(id),
    name: String(name),
    country,
    entityType,
    categories,
    website,
    certificateStatus,
    licenceHolder,
  };
}
