import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '../useQuery';
import { clear as clearCache } from '../cache';

describe('useQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    clearCache();
  });

  it('returns cached data on subsequent calls', async () => {
    const fetchSpy = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ v: 1 }) })
    );
    vi.stubGlobal('fetch', fetchSpy);

    const { result, rerender } = renderHook(() => useQuery<{ v: number }>('/data'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.v).toBe(1);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    rerender();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
