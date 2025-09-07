import { expect, it } from 'vitest';
import LocalSeedProvider from '../LocalSeedProvider';

it('filters suggestions by query', async () => {
  const provider = new LocalSeedProvider();
  const res = await provider.suggest('fair');
  expect(res[0].title).toMatch(/Fairphone/);
});

