import SearchBar from "./components/SearchBar";
import { searchOffProducts } from "@/src/lib/connectors/off/fetch";
import { ResultCard } from "./components/ResultCard";
import { ResultTable } from "./components/ResultTable";

export const revalidate = 3600;

export default async function OffPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q ?? "oat milk";
  const items = await searchOffProducts(q);

  return (
    <main className="container mx-auto max-w-5xl p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Open Food Facts</h1>
        <p className="text-sm text-gray-600">Search consumer food products and view sustainability signals.</p>
        <SearchBar />
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Top results ({items.length})</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map(p => <ResultCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Table view</h2>
        <ResultTable items={items} />
      </section>
    </main>
  );
}
