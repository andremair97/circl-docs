// Suggestion types and provider interface for pluggable search suggestions.
// This keeps the SearchBar decoupled from the suggestion source so we can
// swap in remote APIs later.

export interface Suggestion {
  id: string;
  title: string;
  /**
   * Type hints the target results page. When a suggestion is selected the
   * SearchBar can route to `/results?type=${type}&q=${title}`.
   */
  type: 'product' | 'company';
}

export interface SuggestionProvider {
  /**
   * Returns suggestions for the given query. Implementations may use network
   * calls so an optional AbortSignal allows the caller to cancel stale
   * requests.
   */
  suggest(q: string, signal?: AbortSignal): Promise<Suggestion[]>;
}

