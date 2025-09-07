import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import { search as offSearch, OffItem } from '../adapters/offMock';
import { offToProduct } from '../mappers/offToProduct';
import type { Product } from '../types/Product';

// Results page reads query and type to decide which adapter to use.
export default function Results() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type');
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (type !== 'product') return;
    const ctrl = new AbortController();
    setLoading(true);
    offSearch(q, ctrl.signal)
      .then((res: OffItem[]) => {
        setItems(res.map(offToProduct));
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [q, type]);

  if (loading) return <Skeleton variant="cards" count={6} />;
  if (error) return <ErrorState onRetry={() => location.reload()} />;
  if (type !== 'product')
    return (
      <EmptyState title="Unsupported" description="Only product search implemented" />
    );
  if (items.length === 0)
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
      <button className="mt-4 rounded border border-soft-border px-4 py-2">
        Load more
      </button>
    </div>
  );
}
