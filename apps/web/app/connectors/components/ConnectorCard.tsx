import Link from "next/link";
import TagPill from "./TagPill";
import type { ConnectorMeta } from "../_data/connectors";

// Card summarising a connector with tips and navigation link.
export default function ConnectorCard({ c }: { c: ConnectorMeta }) {
  return (
    <article className="rounded-2xl border p-4 flex gap-4">
      {c.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.icon} alt="" className="w-10 h-10 mt-1 opacity-80" />
      ) : <div className="w-10 h-10" />}
      <div className="flex-1 space-y-2">
        <header>
          <h3 className="text-lg font-semibold">{c.title}</h3>
          <p className="text-sm text-gray-600">{c.summary}</p>
        </header>
        <div className="flex flex-wrap gap-1">
          {c.tags.map(t => <TagPill key={t}>{t}</TagPill>)}
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer select-none">How to use</summary>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            {c.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
          {c.sample && <p className="mt-2 italic">Example: {c.sample}</p>}
        </details>
        <div className="pt-2">
          <Link
            href={c.route}
            className="inline-block px-3 py-1.5 rounded-md border shadow-sm text-sm"
          >
            Open {c.title}
          </Link>
        </div>
      </div>
    </article>
  );
}
