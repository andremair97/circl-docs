import seeds from './localSeed.json';
import type { SuggestProvider, Suggestion } from './Provider';

// LocalSeedProvider performs in-memory filtering over a static seed list.
// Useful for demos or offline development.
export class LocalSeedProvider implements SuggestProvider {
  private readonly items: Suggestion[] = seeds;

  async suggest(q: string, _signal?: AbortSignal): Promise<Suggestion[]> {
    if (!q) return [];
    const qLower = q.toLowerCase();
    return this.items.filter((i) => i.title.toLowerCase().includes(qLower));
  }
}

