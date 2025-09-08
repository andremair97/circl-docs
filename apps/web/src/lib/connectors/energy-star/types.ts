export type EnergyStarCategory =
  | "Refrigerators"
  | "Dishwashers"
  | "Monitors";

export type EnergyStarProduct = {
  id: string;
  category: EnergyStarCategory;
  brand: string;
  model: string;
  variant?: string;
  productUrl?: string;
  certifiedDate?: string;    // ISO string
  annualKwh?: number;        // yearly energy use
  capacity?: string;         // e.g., "25 cu ft" or "15 place settings" or "27-inch"
  mostEfficient?: boolean;   // ENERGY STAR Most Efficient flag
  notes?: string;
};

export type EnergyStarSearchParams = {
  q?: string;                // text to match brand/model
  category?: EnergyStarCategory;
};

export type EnergyStarResponse = {
  items: EnergyStarProduct[];
};
