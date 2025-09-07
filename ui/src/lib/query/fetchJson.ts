export interface FetchOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

const normalizeError = (err: unknown): Error =>
  err instanceof Error ? err : new Error(String(err));

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * fetchJson wraps fetch with timeout, retries and consistent errors.
 */
export async function fetchJson<T>(
  url: string,
  { signal, timeoutMs = 5000 }: FetchOptions = {}
): Promise<T> {
  let attempt = 0;
  let lastError: Error = new Error('unknown');

  while (attempt < 3) {
    attempt++;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    if (signal) {
      if (signal.aborted) {
        clearTimeout(timeout);
        throw new DOMException('aborted', 'AbortError');
      }
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    } catch (err) {
      lastError = normalizeError(err);
      if (controller.signal.aborted && signal?.aborted) throw lastError;
      if (attempt >= 3) throw lastError;
      await sleep(100 * 2 ** (attempt - 1));
    }
  }

  throw lastError;
}
