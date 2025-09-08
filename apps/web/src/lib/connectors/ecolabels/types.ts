export type EcolabelProvider = "EU_ECOLABEL" | "GREEN_SEAL";

export type CertifiedProduct = {
  id: string;
  provider: EcolabelProvider;
  name: string;
  brand?: string;
  company?: string;
  category?: string;
  country?: string;
  standardCode?: string;   // e.g., GS-37 or EU decision/product group code
  licenceId?: string;      // licence/registration number
  validFrom?: string;      // ISO date
  validTo?: string;        // ISO date
  url?: string;            // source/details link
};

export type SearchParamsInput = {
  q?: string;              // free-text query
  country?: string;
  category?: string;
  page?: number;
  pageSize?: number;
};

export type ProviderSearchFn = (params: SearchParamsInput) => Promise<CertifiedProduct[]>;
