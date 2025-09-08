import SearchBar from "./components/SearchBar";
import { searchEnergyStar } from "@/src/lib/connectors/energy-star/fetch";
import { ResultCard } from "./components/ResultCard";
import { ResultTable } from "./components/ResultTable";
import { EnergyStarCategory } from "@/src/lib/connectors/energy-star/types";

// Revalidate daily to balance freshness with provider limits.
export const revalidate = 86400;

/**
 * Server-rendered page displaying ENERGY STAR search results.
 */
export default async function EnergyStarPage({
  searchParams
}: { searchParams: { q?: string; category?: EnergyStarCategory } }) {
  const q = searchParams?.q ?? "";
  const category = (searchParams?.category as EnergyStarCategory) ?? "Refrigerators";
  const items = await searchEnergyStar({ q, category });

  return (
    <main className="container mx-auto max-w-5xl p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">ENERGY STAR</h1>
        <p className="text-sm text-gray-600">
          Search certified products and view efficiency signals (kWh/yr, Most Efficient, certification date).
        </p>
        <SearchBar />
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Top results ({items.length})</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map(item => <ResultCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Table view</h2>
        <ResultTable items={items} />
      </section>
    </main>
  );
}
