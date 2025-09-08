import SearchBar from "./components/SearchBar";
import { searchEbay } from "@/src/lib/connectors/ebay/fetch";
import { ResultCard } from "./components/ResultCard";
import { ResultTable } from "./components/ResultTable";

// Cache results for 30 minutes to balance freshness with API limits.
export const revalidate = 1800;

export default async function EbayPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q ?? "refurbished laptop";
  const items = await searchEbay(q);

  return (
    <main className="container mx-auto max-w-5xl p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">eBay</h1>
        <p className="text-sm text-gray-600">Search listings and surface sustainability-relevant filters.</p>
        <SearchBar />
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Top results ({items.length})</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map(i => <ResultCard key={i.id} i={i} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Table view</h2>
        <ResultTable items={items} />
      </section>
    </main>
  );
}
