import Filters from './components/Filters';
import SearchBar from './components/SearchBar';
import { searchLotItems } from '@/src/lib/connectors/lot/fetch';
import { ItemCard } from './components/ItemCard';
import { ItemTable } from './components/ItemTable';

export const revalidate = 3600;

export default async function LotPage({
  searchParams,
}: {
  searchParams: { q?: string; location?: string; view?: string };
}) {
  const q = searchParams?.q ?? 'drill';
  const location =
    searchParams?.location ?? process.env.LOT_DEFAULT_LOCATION ?? 'CP';
  const view = searchParams?.view ?? 'cards';
  const items = await searchLotItems({ q, location });

  return (
    <main className="container mx-auto max-w-5xl space-y-6 p-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Library of Things (UK)</h1>
        <p className="text-sm text-gray-600">
          Browse borrowable items by location and see sustainability signals.
        </p>
        <div className="flex flex-col gap-3">
          <Filters />
          <SearchBar />
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Top results ({items.length})</h2>
        {view === 'table' ? (
          <ItemTable items={items} />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((it) => (
              <ItemCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
