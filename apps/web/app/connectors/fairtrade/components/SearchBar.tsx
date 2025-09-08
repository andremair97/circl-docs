'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';

// Client-side search form to update the querystring without a full page reload.
export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get('q') ?? 'coffee');
  const [country, setCountry] = useState(params.get('country') ?? '');
  const [type, setType] = useState(params.get('type') ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const search = new URLSearchParams();
    if (q) search.set('q', q);
    if (country) search.set('country', country);
    if (type) search.set('type', type);
    router.replace(`?${search.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 min-w-[8rem] rounded border px-3 py-2"
        placeholder="Search organisations..."
        aria-label="Search term"
      />
      <input
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="w-40 rounded border px-3 py-2"
        placeholder="Country"
        aria-label="Country filter"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-40 rounded border px-3 py-2"
        aria-label="Type filter"
      >
        <option value="">All types</option>
        <option value="Producer">Producer</option>
        <option value="Trader">Trader</option>
        <option value="Licensee">Licensee</option>
      </select>
      <Button type="submit">Search</Button>
    </form>
  );
}
