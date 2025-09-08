'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';

type Props = { defaultValue?: string };

// Controlled search input that syncs with the query string.
export default function SearchBar({ defaultValue = '' }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (q.trim()) next.set('q', q.trim());
    else next.delete('q');
    router.push(`/connectors/tco?${next.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2" aria-label="Search TCO products">
      <label htmlFor="tco-search" className="sr-only">
        Search TCO products
      </label>
      <input
        id="tco-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 rounded-md border px-3 py-2"
        placeholder="Search by brand, model, GTIN..."
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
