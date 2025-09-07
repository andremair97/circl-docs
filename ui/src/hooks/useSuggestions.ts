import { useEffect, useState } from 'react';
import type { SuggestionProvider, Suggestion } from '../suggest/Provider';

// Generic hook that delegates suggestion fetching to a provider. It mirrors
// the signature of the previous mock search hook but is source agnostic.
export default function useSuggestions(
  provider: SuggestionProvider,
  query: string
) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    provider
      .suggest(query, ctrl.signal)
      .then((s) => {
        setSuggestions(s);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [query, provider]);

  return { suggestions, loading, error };
}

