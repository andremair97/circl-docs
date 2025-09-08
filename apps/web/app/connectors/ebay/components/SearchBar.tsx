"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

// Client search form to update the query string without reloading the page.
export default function SearchBar() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "refurbished laptop";
  const [q, setQ] = useState(initial);
  const [pending, startTransition] = useTransition();

  useEffect(() => { setQ(initial); }, [initial]);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); startTransition(() =>
        router.replace(`/connectors/ebay?q=${encodeURIComponent(q)}`)); }}
      className="flex gap-2 items-center w-full"
      aria-label="eBay search"
    >
      <input
        className="w-full px-3 py-2 rounded-md border"
        placeholder="Search eBay (e.g., refurbished laptop)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        name="q"
        aria-label="Search query"
      />
      <button type="submit" disabled={pending} className="px-4 py-2 rounded-md border shadow text-sm" aria-busy={pending}>
        {pending ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
