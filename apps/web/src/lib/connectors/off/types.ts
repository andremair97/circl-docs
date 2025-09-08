// Local representation of a subset of Open Food Facts product fields.
// Narrow types keep the UI payload lean and easier to reason about.
export type OffProduct = {
  id: string;
  name: string;
  brands: string[];
  image?: string;
  nutriScore?: string; // a-e
  ecoScore?: string;   // a-e
  novaGroup?: number;  // 1-4
  labels: string[];
  packaging?: string;
  allergens?: string;
  categories: string[];
  quantity?: string;
};

// Minimal response shape we care about from OFF search endpoint.
export type OffSearchResponse = { products: any[] };
