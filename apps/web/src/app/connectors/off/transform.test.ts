import { describe, expect, it } from 'vitest';
import { transformOffProduct } from '../../../lib/connectors/off/transform';

// Basic sanity checks to ensure field mapping and resilience.
describe('transformOffProduct', () => {
  it('maps fields from raw OFF product', () => {
    const raw = {
      code: '1',
      product_name: 'Test',
      brands: 'BrandOne, BrandTwo',
      labels_tags: ['organic'],
      categories_tags_en: ['cat'],
    };
    const p = transformOffProduct(raw);
    expect(p).toEqual({
      id: '1',
      name: 'Test',
      brands: ['BrandOne', 'BrandTwo'],
      image: undefined,
      nutriScore: undefined,
      ecoScore: undefined,
      novaGroup: undefined,
      labels: ['organic'],
      packaging: undefined,
      allergens: undefined,
      categories: ['cat'],
      quantity: undefined,
    });
  });

  it('returns null when id and name are missing', () => {
    expect(transformOffProduct({})).toBeNull();
  });
});
