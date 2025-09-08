import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import type { IfixitGuideDetail } from '@/src/lib/connectors/ifixit/types';

// Displays an enriched repair guide with basic repairability signals.
export default function GuideCard({ guide }: { guide: IfixitGuideDetail }) {
  const img = guide.image?.standard || guide.image?.medium || guide.image?.large;
  return (
    <Card className="flex flex-col gap-2">
      {img && <img src={img} alt={guide.title} className="h-40 w-full rounded object-cover" />}
      <h3 className="text-sm font-semibold">{guide.title}</h3>
      {guide.category && <p className="text-xs text-gray-600">{guide.category}</p>}
      <div className="flex flex-wrap gap-1">
        {guide.difficulty && <Badge>Difficulty: {guide.difficulty}</Badge>}
        {guide.time_required && <Badge>{guide.time_required}</Badge>}
        <Badge>Steps: {guide.stepsCount}</Badge>
        <Badge>Parts: {guide.partsCount}</Badge>
        <Badge>Tools: {guide.toolsCount}</Badge>
      </div>
      <a
        href={guide.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline"
      >
        View on iFixit
      </a>
    </Card>
  );
}
