import { SearchItem } from '../hooks/useMockSearch';

// ResultCard renders a single search result with its data source.
export default function ResultCard({ item }: { item: SearchItem }) {
  return (
    <div
      data-testid="result-card"
      className="my-2 rounded border border-soft-border bg-surface p-4"
    >
      <h3 className="font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-700">{item.description}</p>
      <span className="mt-2 inline-block rounded bg-bg px-2 py-1 text-xs text-gray-600">
        Data source: {item.source}
      </span>
    </div>
  );
}
