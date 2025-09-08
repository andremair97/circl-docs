export type LotItem = {
  id: string;
  name: string;
  category?: string;
  dailyPrice?: number; // in GBP
  deposit?: number; // in GBP
  locationCode: string; // e.g., "CP", "MO"
  locationName?: string;
  image?: string;
  nextAvailable?: string;
  link?: string;
  co2eSavedKg?: number;
};

export type LotQuery = {
  q?: string;
  location?: string;
};

// Raw response shape from Library of Things providers.
// Uses `unknown` for items to avoid assuming structure prior to transform.
export type LotResponse = { items: unknown[] };
