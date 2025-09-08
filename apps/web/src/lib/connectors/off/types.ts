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
// Raw OFF product payload (subset used by our transformer). Keeping this explicit
// avoids `any` and documents which fields we rely on from the API.
export interface OffRawProduct {
  code?: string | number;
  _id?: string | number;
  id?: string | number;
  product_name?: string;
  brands?: string;
  brands_tags?: string[];
  nutriscore_grade?: string;
  nutrition_grades?: string;
  ecoscore_grade?: string;
  ecoscore_score?: number;
  nova_group?: number;
  labels_tags?: string[];
  packaging?: string;
  allergens?: string;
  image_front_url?: string;
  countries_tags_en?: string[];
  categories_tags_en?: string[];
  quantity?: string;
}

export type OffSearchResponse = { products: OffRawProduct[] };
