export interface Suggestion {
  id: string;
  title: string;
  type: 'product' | 'company';
}

export interface SuggestProvider {
  /**
   * suggest returns possible completions for a query.
   * Implementations should respect the AbortSignal to allow
   * callers to cancel in-flight requests when queries change.
   */
  suggest(q: string, signal?: AbortSignal): Promise<Suggestion[]>;
}
