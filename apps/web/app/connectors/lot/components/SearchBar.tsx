'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export default function SearchBar() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get('q') ?? 'drill';
  const [q, setQ] = useState(initial);
  const [pending, start] = useTransition();

  useEffect(() => {
    setQ(initial);
  }, [initial]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const sp = new URLSearchParams(params.toString());
        sp.set('q', q);
        start(() => router.replace(`/connectors/lot?${sp.toString()}`));
      }}
      className="flex w-full items-center gap-2"
      aria-label="Search Library of Things items"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search items (e.g., drill, pressure washer)"
        className="input input-bordered w-full rounded-md border px-3 py-2"
        name="q"
        aria-label="Search query"
      />
      <button
        type="submit"
        className="rounded-md border px-4 py-2 text-sm shadow"
        disabled={pending}
      >
        {pending ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
