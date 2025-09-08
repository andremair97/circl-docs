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

export type LotResponse = { items: any[] };
