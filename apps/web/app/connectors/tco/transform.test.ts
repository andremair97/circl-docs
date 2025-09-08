import { describe, it, expect } from 'vitest';
import { transformTcoRecord } from '../../../src/lib/connectors/tco/transform'; // path updated after connector move

describe('transformTcoRecord', () => {
  it('maps json-ld styled record', () => {
    const rec = {
      '@id': 'https://example.com/gtin/12345',
      '@type': 'Display',
      brand: { name: 'Brand' },
      model: 'ModelX',
      certificateNumber: 'C123',
    };
    const product = transformTcoRecord(rec);
    expect(product).toMatchObject({ id: '12345', brand: 'Brand', model: 'ModelX', certificateNumber: 'C123' });
  });

  it('tolerates GTIN-only shape', () => {
    const product = transformTcoRecord({ gtin: '987654321' });
    expect(product).toMatchObject({ id: '987654321', gtin: '987654321' });
  });

  it('preserves certificate number', () => {
    const product = transformTcoRecord({ certificate_number: 'XYZ' });
    expect(product?.certificateNumber).toBe('XYZ');
  });
});
