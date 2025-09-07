import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ResultCard from '../components/ResultCard';
import Skeleton from '../components/Skeleton';
import useMockSearch from '../hooks/useMockSearch';

// Results page reads query from URL and displays matching cards.
export default function Results() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { results, loading, error } = useMockSearch(q);

  if (loading) return <Skeleton variant="cards" count={3} />;
  if (error) return <ErrorState onRetry={() => location.reload()} />;
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
