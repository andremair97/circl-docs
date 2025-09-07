import { describe, it, expect, vi } from 'vitest';
import { fetchJson } from '../fetchJson';

describe('fetchJson', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('retries up to 3 times before succeeding', async () => {
    vi.useFakeTimers();
    const fetchSpy = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({ ok: true }) });
    vi.stubGlobal('fetch', fetchSpy);
    const promise = fetchJson<{ ok: boolean }>('/');
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toEqual({ ok: true });
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it('throws on external abort', async () => {
    const controller = new AbortController();
    vi.stubGlobal(
      'fetch',
      vi.fn((_, init: any) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError'))
          );
        })
      )
    );
    const p = fetchJson('/', { signal: controller.signal });
    controller.abort();
    await expect(p).rejects.toThrow(/AbortError/);
  });
});
