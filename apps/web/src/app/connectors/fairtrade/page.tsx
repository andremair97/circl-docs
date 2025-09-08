import SearchBar from './components/SearchBar';
import { searchFairtrade } from '@/src/lib/connectors/fairtrade/fetch';
import { ResultCard } from './components/ResultCard';
import { ResultTable } from './components/ResultTable';

export const revalidate = 86400;

export default async function FairtradePage({
  searchParams,
}: {
  searchParams: { q?: string; country?: string; type?: string };
}) {
  const q = searchParams?.q ?? 'coffee';
  const country = searchParams?.country || undefined;
  const type = (searchParams?.type as any) || undefined;

  const items = await searchFairtrade(q, { country, type });

  return (
    <main className="container mx-auto max-w-5xl p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Fairtrade Product Finder</h1>
        <p className="text-sm text-gray-600">
          Search Fairtrade-certified organisations (licensees, producers, traders).
        </p>
        <SearchBar />
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Top results ({items.length})</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((e) => (
            <ResultCard key={e.id} e={e} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Table view</h2>
        <ResultTable items={items} />
      </section>
    </main>
  );
}
