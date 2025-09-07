'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';

// Simple search bar used on the landing page.
export default function SearchBar() {
  const [q, setQ] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirects to the results page so the server can process the query.
    if (q.trim()) router.push(`/results?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 rounded-md border px-3 py-2"
        placeholder="Search products..."
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
