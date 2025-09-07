'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PathwayTabs, { Mode } from '@/src/components/PathwayTabs';
import ProductCard from '@/src/components/ProductCard';
import { Product } from '@/src/types/universal';

export default function ResultsClient() {
  const params = useSearchParams();
  const q = params.get('q') || '';
  const [mode, setMode] = useState<Mode>('borrow');
  const [items, setItems] = useState<Product[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    if (!q) return;
    const controller = new AbortController();
    setStatus('loading');
    // Fetch results for the current pathway and query.
    fetch(`/api/search?q=${encodeURIComponent(q)}&mode=${mode}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setStatus('idle');
      })
      .catch(() => setStatus('error'));
    return () => controller.abort();
  }, [q, mode]);

  return (
    <main className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Results for "{q}"</h2>
      <PathwayTabs mode={mode} onModeChange={setMode} />
      {status === 'loading' && <p>Loading…</p>}
      {status === 'error' && <p className="text-red-600">Error loading results.</p>}
      {status === 'idle' && items.length === 0 && <p>No results.</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
