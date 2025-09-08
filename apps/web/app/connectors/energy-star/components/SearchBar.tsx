"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const CATEGORIES = ["Refrigerators","Dishwashers","Monitors"] as const;

/**
 * Lightweight search bar to push query/category into the route.
 * Keeps the page server-rendered while giving client-side feedback.
 */
export default function SearchBar() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQ = params.get("q") ?? "";
  const initialCat = (params.get("category") ?? "Refrigerators") as (typeof CATEGORIES)[number];

  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(initialCat);
  const [pending, start] = useTransition();

  // Sync local state when URL params change.
  useEffect(() => { setQ(initialQ); }, [initialQ]);
  useEffect(() => { setCategory(initialCat); }, [initialCat]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const usp = new URLSearchParams();
        if (q.trim()) usp.set("q", q.trim());
        usp.set("category", category);
        // Transition to avoid blocking the UI while server renders.
        start(() => router.replace(`/connectors/energy-star?${usp.toString()}`));
      }}
      className="flex flex-col md:flex-row gap-2 items-stretch md:items-center w-full"
      aria-label="ENERGY STAR search"
    >
      <label className="sr-only" htmlFor="q">Search by brand or model</label>
      <input
        id="q"
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Search by brand or model (e.g., Bosch, VX27Q)"
        className="input input-bordered w-full px-3 py-2 rounded-md border"
        name="q"
      />
      <label className="sr-only" htmlFor="category">Category</label>
      <select
        id="category"
        value={category}
        onChange={(e)=>setCategory(e.target.value as (typeof CATEGORIES)[number])}
        className="px-3 py-2 rounded-md border"
        name="category"
      >
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
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
