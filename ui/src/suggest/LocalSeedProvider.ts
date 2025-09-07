import type { SuggestProvider, Suggestion } from './Provider';
import dataset from './seed.json';

/**
 * LocalSeedProvider offers simple client-side suggestion lookup
 * against a small static dataset. This keeps initial plumbing
 * self-contained while allowing the SearchBar to swap providers
 * later without code changes.
 */
export class LocalSeedProvider implements SuggestProvider {
  async suggest(q: string, signal?: AbortSignal): Promise<Suggestion[]> {
    const query = q.trim().toLowerCase();
    if (!query) return [];

    // Simulate async work so cancellation logic can be exercised.
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, 50);
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('aborted', 'AbortError'));
      });
    });

    return dataset.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }
}

export default LocalSeedProvider;
