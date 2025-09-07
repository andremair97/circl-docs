import { Card } from './ui/card';
import ProvenanceDialog from './ProvenanceDialog';
import SourceBadge from './SourceBadge';
import { Badge } from './ui/badge';
import { Product } from '../types/universal';

// Displays a single product result with provenance and eco badges.
export default function ProductCard({ item }: { item: Product }) {
  return (
    <Card className="flex flex-col gap-2">
      {item.image && <img src={item.image} alt={item.title} className="h-40 w-full rounded object-cover" />}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{item.title}</h3>
        <SourceBadge source={item.source} />
      </div>
      <p className="text-sm text-gray-600">{item.summary}</p>
      {item.badges && item.badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.badges.map((b) => (
            <Badge key={b}>{b}</Badge>
          ))}
        </div>
      )}
      <ProvenanceDialog item={item} />
    </Card>
  );
}
