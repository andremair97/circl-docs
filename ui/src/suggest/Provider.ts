export interface Suggestion {
  id: string;
  title: string;
}

export interface Provider {
  /**
   * Returns suggestions for a given query. Implementations may use the AbortSignal
   * to cancel in-flight requests when the user types quickly.
   */
  suggest(q: string, signal?: AbortSignal): Promise<Suggestion[]>;
}
