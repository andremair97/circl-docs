import { Badge } from './ui/badge';

// Displays the connector that supplied the item so provenance stays visible.
export default function SourceBadge({ source }: { source: string }) {
  return <Badge className="capitalize">{source}</Badge>;
}
