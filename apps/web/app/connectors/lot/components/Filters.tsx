'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

const DEFAULTS = {
  location: process.env.NEXT_PUBLIC_LOT_DEFAULT_LOCATION ?? 'CP',
};

const LOCATIONS = [
  { code: 'CP', name: 'Crystal Palace' },
  { code: 'MO', name: 'Morden' },
  { code: 'DL', name: 'Dalston' },
  { code: 'DW', name: 'Dulwich' },
];

export default function Filters() {
  const params = useSearchParams();
  const router = useRouter();
  const [location, setLocation] = useState(
    params.get('location') ?? DEFAULTS.location,
  );
  const [view, setView] = useState(params.get('view') ?? 'cards');
  const [pending, start] = useTransition();

  useEffect(() => {
    setLocation(params.get('location') ?? DEFAULTS.location);
    setView(params.get('view') ?? 'cards');
  }, [params]);

  function update(next: Partial<{ location: string; view: string }>) {
    const q = new URLSearchParams(params.toString());
    if (next.location) q.set('location', next.location);
    if (next.view) q.set('view', next.view);
    start(() => router.replace(`/connectors/lot?${q.toString()}`));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="text-sm">Location</label>
      <select
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          update({ location: e.target.value });
        }}
        className="rounded border px-2 py-1"
        aria-label="Select location"
      >
        {LOCATIONS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>

      <div
        className="ml-auto flex items-center gap-1"
        role="group"
        aria-label="View toggle"
      >
        <button
          className={`rounded border px-2 py-1 ${
            view === 'cards' ? 'bg-gray-100' : ''
          }`}
          onClick={() => {
            setView('cards');
            update({ view: 'cards' });
          }}
          disabled={pending}
        >
          Cards
        </button>
        <button
          className={`rounded border px-2 py-1 ${
            view === 'table' ? 'bg-gray-100' : ''
          }`}
          onClick={() => {
            setView('table');
            update({ view: 'table' });
          }}
          disabled={pending}
        >
          Table
        </button>
      </div>
    </div>
  );
}
