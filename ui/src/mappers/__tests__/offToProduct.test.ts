import { describe, expect, it } from 'vitest';
import { offToProduct } from '../offToProduct';
import type { OffItem } from '../../adapters/offMock';

describe('offToProduct', () => {
  it('maps basic fields and eco badges', () => {
    const src: OffItem = {
      code: '1',
      product_name: 'Test',
      brands: 'Brand',
      image_url: 'img',
      ecoscore_grade: 'b',
      labels: 'en:organic',
    };
    const product = offToProduct(src);
    expect(product).toMatchObject({
      id: '1',
      title: 'Test',
      brand: 'Brand',
      image: 'img',
    });
    expect(product.badges).toContain('Eco-Score B');
    expect(product.badges).toContain('Organic');
  });
});

