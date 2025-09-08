export type TcoProduct = {
  id: string;                 // gtin || certificateNumber || slug
  productType?: string;       // e.g., "Display", "Notebook"
  brand?: string;
  model?: string;
  generation?: string;        // e.g., "Gen 10"
  certificateNumber?: string; // e.g., D1025050157
  certifiedSince?: string;    // ISO date
  validUntil?: string;        // ISO date
  gtin?: string;
  detailUrl?: string;         // Product Finder detail
  certificateUrl?: string;    // PDF if known
};

export type TcoApiTokenResponse = { result?: string; token?: string; validUntil?: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TcoGtinRecord = any;     // API payload is not guaranteed; treat defensively
export type TcoSearchResponse = { items: TcoProduct[] };
