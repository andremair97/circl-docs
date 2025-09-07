// Shared product shape used across connectors. Having a single interface keeps
// components simple and makes future connector swaps type-safe.
export interface Product {
  id: string;
  title: string;
  summary: string;
  image?: string;
  source: string;
  url: string;
  fetched_at: string;
  badges?: string[];
}
