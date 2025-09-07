import { describe, it, expect } from 'vitest';
import { searchProducts } from '../../src/server/search';

// Ensures fixture adapters map and filter correctly.
describe('searchProducts', () => {
  it('filters by query and mode', async () => {
    const items = await searchProducts('battery', 'repair');
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].source).toBe('ifixit');
  });
});
