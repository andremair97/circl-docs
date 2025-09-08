"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [pending, start] = useTransition();

  useEffect(() => setQ(initialQuery), [initialQuery]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const next = new URLSearchParams(params.toString());
        if (q?.trim()) next.set("q", q.trim());
        else next.delete("q");
        start(() => router.replace(`/connectors/ecolabels?${next.toString()}`));
      }}
      className="flex gap-2 items-center w-full"
      aria-label="Search certified products"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products, brands, or companies"
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
