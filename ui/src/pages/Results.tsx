import { useSearchParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';
import useMockSearch from '../hooks/useMockSearch';

// Results page reads query from URL and displays matching cards.
export default function Results() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { results, loading, error } = useMockSearch(q);

  if (loading) return <Loader />;
  if (error) return <ErrorState />;

  return (
    <div>
      {results.map((item) => (
        <ResultCard key={item.id} item={item} />
      ))}
    </div>
  );
}
