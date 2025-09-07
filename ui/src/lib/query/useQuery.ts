import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchJson } from './fetchJson';
import { get as cacheGet, set as cacheSet } from './cache';

interface Options {
  ttl?: number;
}

interface State<T> {
  data?: T;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

/**
 * useQuery standardises data fetching with caching and abort support.
 */
export function useQuery<T>(url: string, { ttl = 5_000 }: Options = {}): State<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const controller = useRef<AbortController>();

  const load = useCallback(async () => {
    controller.current?.abort();
    const cached = cacheGet<T>(url);
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }
    const c = new AbortController();
    controller.current = c;
    setIsLoading(true);
    try {
      const res = await fetchJson<T>(url, { signal: c.signal });
      cacheSet(url, res, ttl);
      setData(res);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      if (!c.signal.aborted) setIsLoading(false);
    }
  }, [ttl, url]);

  useEffect(() => {
    load();
    return () => controller.current?.abort();
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
