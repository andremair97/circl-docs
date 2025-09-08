import { describe, expect, it } from 'vitest';
import { transformLotItem } from './transform';

// Minimal tests to ensure transformer behaviour stays predictable.
describe('transformLotItem', () => {
  it('maps basic fields and infers CO2e by category', () => {
    const raw = { id: 1, name: 'Drill', category: 'DIY', locationCode: 'CP' };
    const item = transformLotItem(raw);
    expect(item?.name).toBe('Drill');
    expect(item?.deposit).toBeUndefined();
    expect(item?.co2eSavedKg).toBe(30);
  });
});
