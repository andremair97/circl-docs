'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/src/components/ui/button';

// Input bar for querying the iFixit API. Lives client-side so users can change
// the query without a full page reload; actual fetching remains server-side.
export default function SearchBar() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    startTransition(() => {
      router.replace(`/connectors/ifixit?q=${encodeURIComponent(query || '')}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2" role="search">
      <label htmlFor="ifixit-search" className="sr-only">
        Search iFixit
      </label>
      <input
        id="ifixit-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 rounded-md border px-3 py-2"
        placeholder="Search iFixit..."
      />
      <Button type="submit" disabled={pending}>Search</Button>
    </form>
  );
}
