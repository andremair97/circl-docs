"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

export default function SearchBar() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "oat milk";
  const [q, setQ] = useState(initial);
  const [pending, start] = useTransition();

  useEffect(() => { setQ(initial); }, [initial]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(() => router.replace(`/connectors/off?q=${encodeURIComponent(q)}`));
      }}
      className="flex gap-2 items-center w-full"
      aria-label="Open Food Facts search"
    >
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Search Open Food Facts (e.g., oat milk)"
        className="input input-bordered w-full px-3 py-2 rounded-md border"
        name="q"
        aria-label="Search query"
      />
      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 rounded-md border shadow text-sm"
        aria-busy={pending}
      >
        {pending ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
