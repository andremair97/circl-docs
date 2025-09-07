import type { OffMockItem } from '../adapters/offMock';

export interface Product {
  id: string;
  title: string;
  brand: string;
  image?: string;
  badges: string[];
  metrics: Record<string, unknown>;
}

/**
 * offToProduct maps an OFF product to the UI's Product shape.
 * It intentionally keeps transformation logic pure for easy testing.
 */
export function offToProduct(src: OffMockItem): Product {
  const badges: string[] = [];
  if (src.ecoscore_grade) {
    badges.push(`Eco-Score ${src.ecoscore_grade.toUpperCase()}`);
  }
  if (src.labels_tags?.some((l) => l.includes('organic'))) {
    badges.push('Organic');
  }
  return {
    id: src.id,
    title: src.product_name,
    brand: src.brands,
    image: src.image_url,
    badges,
    metrics: {},
  };
}

export default offToProduct;
