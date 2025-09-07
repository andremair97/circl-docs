import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ResultCard from '../components/ResultCard';
import Skeleton from '../components/Skeleton';
import ProductCard from '../components/ProductCard';
import useMockSearch from '../hooks/useMockSearch';
import searchOffMock from '../adapters/offMock';
import { offToProduct, type Product } from '../mappers/offToProduct';

// Results page reads query/type and displays matching cards.
export default function Results() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState<Error | null>(null);

  useEffect(() => {
    if (type !== 'product') return;
    if (!q) {
      setProducts([]);
      return;
    }
    setLoadingProducts(true);
    searchOffMock(q)
      .then((items) => {
        setProducts(items.map(offToProduct));
        setErrorProducts(null);
      })
      .catch((err) => setErrorProducts(err as Error))
      .finally(() => setLoadingProducts(false));
  }, [q, type]);

  if (type === 'product') {
    if (loadingProducts) return <Skeleton variant="cards" count={3} />;
    if (errorProducts) return <ErrorState onRetry={() => location.reload()} />;
    if (products.length === 0)
      return (
        <EmptyState
          icon={<Search />}
          title="No results"
          description="Try a different search term."
          action={<a href="/" className="text-primary underline">Go back</a>}
        />
      );
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        <button
          className="col-span-full rounded border border-soft-border px-4 py-2 text-sm text-gray-700"
          disabled
        >
          Load more
        </button>
      </div>
    );
  }

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
