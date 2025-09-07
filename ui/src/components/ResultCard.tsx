import { SearchItem } from '../hooks/useMockSearch';

// ResultCard renders a single search result with its data source.
export default function ResultCard({ item }: { item: SearchItem }) {
  return (
    <div
      data-testid="result-card"
      style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem 0' }}
    >
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <span
        style={{
          background: '#e0f2f1',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
        }}
      >
        Data source: {item.source}
      </span>
    </div>
  );
}
