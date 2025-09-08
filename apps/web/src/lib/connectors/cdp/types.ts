export type CityEmission = {
  id: string;
  city: string;
  country?: string;
  year?: number;
  scope?: string;            // e.g., "City-wide", "Community"
  totalEmissionsTCO2e?: number;
  perCapitaTCO2e?: number;
  inventoryMethod?: string;
  sourceDataset?: string;    // Socrata dataset id
};

export type CorpScore = {
  id: string;                // company id or name slug
  company: string;
  year: number;
  theme: "climate" | "water" | "forests";
  score: string;             // e.g., A, A-, B, etc.
  country?: string;
  isin?: string;
  ticker?: string;
};
