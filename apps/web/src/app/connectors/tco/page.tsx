import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import ResultCard from './components/ResultCard';
import ResultTable from './components/ResultTable';
import { searchTcoProducts } from '@/src/lib/connectors/tco/fetch';

export const revalidate = 86400;

interface Props {
  searchParams: { q?: string; type?: string };
}

// Server-rendered page listing TCO Certified products.
export default async function TcoPage({ searchParams }: Props) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const type = typeof searchParams.type === 'string' ? searchParams.type : undefined;
  const items = await searchTcoProducts(q, type && type !== 'All' ? type : undefined);

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">TCO Certified Products</h1>
      <SearchBar defaultValue={q ?? ''} />
      <Filters selected={type ?? 'All'} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <ResultCard key={item.id} item={item} />
        ))}
      </div>
      <ResultTable items={items} />
    </main>
  );
}
