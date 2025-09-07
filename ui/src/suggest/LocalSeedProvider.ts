import seeds from './localSeed.json';
import type { SuggestionProvider, Suggestion } from './Provider';

// LocalSeedProvider performs in-memory filtering over a static seed list.
// Useful for demos or offline development.
// Exported as default so SearchBar can instantiate without named import clutter.
export default class LocalSeedProvider implements SuggestionProvider {
  private readonly items: Suggestion[] = seeds;

  async suggest(q: string, _signal?: AbortSignal): Promise<Suggestion[]> {
    if (!q) return [];
    const qLower = q.toLowerCase();
    return this.items.filter((i) => i.title.toLowerCase().includes(qLower));
  }
}

