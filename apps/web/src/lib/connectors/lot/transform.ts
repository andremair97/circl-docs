import { LotItem } from './types';

// Demo kgCO2e saved estimates by category
const CO2E_BY_CATEGORY: Record<string, number> = {
  Cleaning: 45,
  DIY: 30,
  Gardening: 35,
  Events: 15,
};

// Normalises a raw Library of Things item into our internal shape.
// Tolerates missing data and infers a rough CO2e saved estimate.
export function transformLotItem(x: unknown): LotItem | null {
  if (!x || typeof x !== 'object') return null;
  const obj = x as Record<string, unknown>;
  const id = String(obj.id ?? obj.slug ?? obj.code ?? '');
  const name = (obj.name ?? obj.title ?? '').toString().trim();
  if (!id && !name) return null;

  const category = (obj.category ?? obj.group ?? undefined) as string | undefined;
  const co2e =
    typeof obj.co2eSavedKg === 'number'
      ? obj.co2eSavedKg
      : (category && CO2E_BY_CATEGORY[category]) || undefined;

  return {
    id: id || name,
    name,
    category,
    dailyPrice: typeof obj.dailyPrice === 'number' ? obj.dailyPrice : undefined,
    deposit: typeof obj.deposit === 'number' ? obj.deposit : undefined,
    locationCode: String(obj.locationCode ?? obj.location ?? 'XX'),
    locationName: obj.locationName as string | undefined,
    image: (obj.image ?? obj.imageUrl ?? undefined) as string | undefined,
    nextAvailable: obj.nextAvailable as string | undefined,
    link: (obj.link ?? obj.url ?? undefined) as string | undefined,
    co2eSavedKg: co2e,
  };
}
