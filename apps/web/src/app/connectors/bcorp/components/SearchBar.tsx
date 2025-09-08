"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

// Client component: user typing should update the URL without a full reload.
export default function SearchBar() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "coffee";
  const [q, setQ] = useState(initial);
  const [pending, start] = useTransition();

  // Reflect external query param changes back into the input field.
  useEffect(() => { setQ(initial); }, [initial]);

  return (
    <form
      aria-label="B Corp Directory search"
      className="flex gap-2 items-center w-full"
      onSubmit={(e) => {
        e.preventDefault();
        start(() => router.replace(`/connectors/bcorp?q=${encodeURIComponent(q)}`));
      }}
    >
      <input
        name="q"
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Search B Corps (e.g., coffee, fashion, software)"
        className="input input-bordered w-full px-3 py-2 rounded-md border"
        aria-label="Search query"
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
