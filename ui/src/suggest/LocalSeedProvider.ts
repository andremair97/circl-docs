import seed from './seed.json';
import type { Provider, Suggestion } from './Provider';

/**
 * LocalSeedProvider returns suggestions from a static JSON seed.
 * This keeps the UI decoupled from any remote service during prototyping.
 */
export class LocalSeedProvider implements Provider {
  private readonly items: Suggestion[];

  constructor(items: Suggestion[] = seed) {
    this.items = items;
  }

  async suggest(q: string, signal?: AbortSignal): Promise<Suggestion[]> {
    if (signal?.aborted) throw new DOMException('aborted', 'AbortError');
    const query = q.toLowerCase();
    return this.items.filter((i) => i.title.toLowerCase().includes(query));
  }
}
