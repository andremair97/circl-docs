// Canonical product type used across UI components.
export interface Product {
  id: string;
  title: string;
  brand: string;
  image?: string;
  badges: string[];
  metrics: Record<string, string | number>;
}

