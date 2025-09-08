import { describe, it, expect } from 'vitest';
import { transformFairtrade } from '../../../src/lib/connectors/fairtrade/transform'; // update path post-move

describe('transformFairtrade', () => {
  it('maps differing field names', () => {
    const raw = {
      floid: '123',
      organisation: 'Test Org',
      countryName: 'Peru',
      role: 'Producer',
      products: ['Green Coffee Beans'],
    };
    const res = transformFairtrade(raw);
    expect(res).toMatchObject({
      id: '123',
      name: 'Test Org',
      country: 'Peru',
      entityType: 'Producer',
      categories: ['green-coffee-beans'],
    });
  });

  it('normalises categories', () => {
    const res = transformFairtrade({
      id: '1',
      name: 'T',
      categories: ['Herbal Infusions'],
    });
    expect(res!.categories).toEqual(['herbal-infusions']);
  });

  it('drops rows without id and name', () => {
    const res = transformFairtrade({});
    expect(res).toBeNull();
  });
});
