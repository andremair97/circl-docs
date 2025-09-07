import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ResultCard from '../components/ResultCard';
import Skeleton from '../components/Skeleton';
import { useQuery } from '../lib/query/useQuery';
import { SearchItem } from '../types';

interface SearchResponse {
  items: SearchItem[];
}

// Results page reads query from URL and displays matching cards.
export default function Results() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { data, error, isLoading, refetch } = useQuery<SearchResponse>(
    '/mocks/search.sample.json'
  );

  if (isLoading) return <Skeleton variant="cards" count={3} />;
  if (error) return <ErrorState onRetry={refetch} />;

  const results = (data?.items || []).filter((i) =>
    i.title.toLowerCase().includes(q.toLowerCase())
  );
  if (results.length === 0)
    return (
      <EmptyState
        icon={<Search />}
        title="No results"
        description="Try a different search term."
        action={<a href="/" className="text-primary underline">Go back</a>}
      />
    );

  return (
    <div>
      {results.map((item) => (
        <ResultCard key={item.id} item={item} />
      ))}
    </div>
  );
}
