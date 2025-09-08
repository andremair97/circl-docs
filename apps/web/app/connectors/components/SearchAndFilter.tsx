"use client";
import { useMemo, useState } from "react";
import type { ConnectorMeta } from "../_data/connectors";

// Client component handles search + tag filtering without server roundtrips.
export default function SearchAndFilter({ items, onFiltered }:{
  items: ConnectorMeta[];
  onFiltered: (xs: ConnectorMeta[]) => void;
}) {
  const allTags = useMemo(() => Array.from(new Set(items.flatMap(i => i.tags))).sort(), [items]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const apply = (query: string, tags: string[]) => {
    const qNorm = query.toLowerCase();
    const filtered = items.filter(i => {
      const text = (i.title + " " + i.summary + " " + i.tags.join(" ")).toLowerCase();
      const hitQ = !qNorm || text.includes(qNorm);
      const hitTags = tags.length === 0 || tags.every(t => i.tags.includes(t));
      return hitQ && hitTags;
    });
    onFiltered(filtered);
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <input
        value={q}
        onChange={(e)=>{ setQ(e.target.value); apply(e.target.value, selected); }}
        placeholder="Search connectors…"
        className="px-3 py-2 rounded-md border w-full md:w-96"
        aria-label="Search connectors"
      />
      <div className="flex gap-2 flex-wrap">
        {allTags.map(t => {
          const active = selected.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={()=>{
                const next = active ? selected.filter(x=>x!==t) : [...selected, t];
                setSelected(next); apply(q, next);
              }}
              className={`text-xs px-2 py-1 rounded-full border ${active ? "bg-gray-900 text-white" : "bg-gray-50"}`}
              aria-pressed={active}
            >
              {t}
            </button>
          );
        })}
        {selected.length > 0 && (
          <button
            type="button"
            onClick={()=>{ setSelected([]); apply(q, []); }}
            className="text-xs px-2 py-1 rounded-full border"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
