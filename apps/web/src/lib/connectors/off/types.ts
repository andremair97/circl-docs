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
export type OffSearchResponse = { products: any[] };
