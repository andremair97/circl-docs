import { offToProduct } from '../offToProduct';
import type { OffMockItem } from '../../adapters/offMock';

describe('offToProduct', () => {
  it('maps fields and badges correctly', () => {
    const src: OffMockItem = {
      id: '1',
      product_name: 'Organic Apple',
      brands: 'Green Farms',
      image_url: 'img.jpg',
      ecoscore_grade: 'a',
      labels_tags: ['en:organic']
    };
    const res = offToProduct(src);
    expect(res).toEqual({
      id: '1',
      title: 'Organic Apple',
      brand: 'Green Farms',
      image: 'img.jpg',
      badges: ['Eco-Score A', 'Organic'],
      metrics: {}
    });
  });

  it('handles missing optional data', () => {
    const src: OffMockItem = {
      id: '2',
      product_name: 'Plain Bread',
      brands: 'Baker',
    };
    const res = offToProduct(src);
    expect(res.image).toBeUndefined();
    expect(res.badges).toHaveLength(0);
  });
});
