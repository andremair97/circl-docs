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
export function transformLotItem(x: any): LotItem | null {
  if (!x) return null;
  const id = String(x.id ?? x.slug ?? x.code ?? '');
  const name = (x.name ?? x.title ?? '').trim();
  if (!id && !name) return null;

  const category = x.category ?? x.group ?? undefined;
  const co2e =
    typeof x.co2eSavedKg === 'number'
      ? x.co2eSavedKg
      : (category && CO2E_BY_CATEGORY[category]) || undefined;

  return {
    id: id || name,
    name,
    category,
    dailyPrice: typeof x.dailyPrice === 'number' ? x.dailyPrice : undefined,
    deposit: typeof x.deposit === 'number' ? x.deposit : undefined,
    locationCode: String(x.locationCode ?? x.location ?? 'XX'),
    locationName: x.locationName ?? undefined,
    image: x.image ?? x.imageUrl ?? undefined,
    nextAvailable: x.nextAvailable ?? undefined,
    link: x.link ?? x.url ?? undefined,
    co2eSavedKg: co2e,
  };
}
