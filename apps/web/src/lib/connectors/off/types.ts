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

// Minimal raw product shape returned by the OFF API that we transform.
// Optional fields reflect inconsistent data coming from the service.
export type OffRawProduct = {
  code?: string | number;
  _id?: string | number;
  id?: string | number;
  product_name?: string;
  brands_tags?: string[];
  brands?: string;
  nutriscore_grade?: string;
  nutrition_grades?: string;
  ecoscore_grade?: string;
  nova_group?: number;
  labels_tags?: string[];
  packaging?: string;
  allergens?: string;
  image_front_url?: string;
  categories_tags_en?: string[];
  quantity?: string;
};

// Minimal response shape we care about from OFF search endpoint.
export type OffSearchResponse = { products: OffRawProduct[] };
