import { useEffect, useRef, useState } from 'react';
import { ENABLE_MOCK_SEARCH } from '../flags';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  source: string;
}

interface SearchResponse {
  items: SearchItem[];
}

// useMockSearch fetches mock data once and performs client-side filtering with debounce.
export default function useMockSearch(query: string) {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const dataset = useRef<SearchItem[] | null>(null);
  const timer = useRef<number>();

  useEffect(() => {
    if (!ENABLE_MOCK_SEARCH) return;
    if (!query) {
      setResults([]);
      return;
    }

    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        if (!dataset.current) {
          const res = await fetch('/mocks/search.sample.json');
          const json: SearchResponse = await res.json();
          dataset.current = json.items;
        }
        const q = query.toLowerCase();
        const filtered = dataset.current!.filter((i) =>
          i.title.toLowerCase().includes(q)
        );
        setResults(filtered);
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  return { results, loading, error };
}
