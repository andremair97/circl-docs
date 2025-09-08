"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

// Simple search input that updates the query param without full page reload.
export default function SearchBar() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "oat milk";
  const [q, setQ] = useState(initial);
  const [pending, start] = useTransition();

  // Keep input in sync when external navigation changes the query.
  useEffect(() => {
    setQ(initial);
  }, [initial]);

  return (
    <form
      aria-label="Open Food Facts search"
      className="flex gap-2 items-center w-full"
      onSubmit={(e) => {
        e.preventDefault();
        start(() => router.replace(`/connectors/off?q=${encodeURIComponent(q)}`));
      }}
    >
      <input
        name="q"
        aria-label="Search query"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Open Food Facts (e.g., oat milk)"
        className="w-full px-3 py-2 rounded-md border"
      />
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="px-4 py-2 rounded-md border shadow text-sm"
      >
        {pending ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
