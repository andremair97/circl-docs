import type { OffItem } from '../adapters/offMock';
import type { Product } from '../types/Product';

// offToProduct normalises an OFF item to our internal Product shape. This keeps
// data mapping separate from presentation logic.
export function offToProduct(src: OffItem): Product {
  const badges: string[] = [];
  if (src.ecoscore_grade) {
    badges.push(`Eco-Score ${src.ecoscore_grade.toUpperCase()}`);
  }
  if (src.labels?.includes('en:organic')) badges.push('Organic');

  return {
    id: src.code,
    title: src.product_name,
    brand: src.brands,
    image: src.image_url || undefined,
    badges,
    metrics: {},
  };
}

