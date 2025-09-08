import { FairtradeEntity } from '@/src/lib/connectors/fairtrade/types';
import { Badge } from '@/src/components/ui/badge';

// Card view to highlight key organisation details at a glance.
export function ResultCard({ e }: { e: FairtradeEntity }) {
  const shown = e.categories.slice(0, 4);
  const extra = e.categories.length - shown.length;

  return (
    <article className="space-y-2 rounded border p-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{e.name}</h3>
        {e.website && (
          <a
            href={e.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline"
          >
            Website
          </a>
        )}
      </div>
      {e.country && <p className="text-sm text-gray-600">{e.country}</p>}
      <div className="flex flex-wrap gap-2 text-xs">
        {e.entityType && <Badge>{e.entityType}</Badge>}
        {e.certificateStatus && <Badge>{e.certificateStatus}</Badge>}
      </div>
      <div className="flex flex-wrap gap-1 text-xs">
        {shown.map((c) => (
          <span key={c} className="rounded bg-gray-200 px-2 py-0.5">
            {c}
          </span>
        ))}
        {extra > 0 && (
          <span className="rounded bg-gray-200 px-2 py-0.5">+{extra} more</span>
        )}
      </div>
    </article>
  );
}
