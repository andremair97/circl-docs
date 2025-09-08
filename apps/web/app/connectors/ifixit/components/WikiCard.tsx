import { Card } from '@/src/components/ui/card';
import type { IfixitSuggestWiki } from '@/src/lib/connectors/ifixit/types';

// Renders an iFixit wiki/device page hit with summary when available.
export default function WikiCard({ wiki }: { wiki: IfixitSuggestWiki }) {
  const img = wiki.image?.standard || wiki.image?.medium || wiki.image?.large;
  return (
    <Card className="flex flex-col gap-2">
      {img && <img src={img} alt={wiki.title} className="h-40 w-full rounded object-cover" />}
      <h3 className="text-sm font-semibold">{wiki.display_title || wiki.title}</h3>
      {wiki.summary && <p className="text-xs text-gray-600">{wiki.summary}</p>}
      <a
        href={wiki.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline"
      >
        Open device page
      </a>
    </Card>
  );
}
