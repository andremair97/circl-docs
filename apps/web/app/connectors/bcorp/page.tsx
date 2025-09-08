import SearchBar from "./components/SearchBar";
import { searchBcorp } from "@/src/lib/connectors/bcorp/fetch"; // use workspace alias for clearer resolution
import { ResultCard } from "./components/ResultCard";
import { ResultTable } from "./components/ResultTable";

// Cache results for a day to avoid hammering upstream APIs.
export const revalidate = 86400;

// Server component: fetches data on the server so secrets remain safe.
export default async function BcorpPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q ?? "coffee";
  const items = await searchBcorp(q);

  return (
    <main className="container mx-auto max-w-5xl p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">B\u00a0Corp Directory</h1>
        <p className="text-sm text-gray-600">
          Search certified B Corps and view certification status, B Impact Score, industries, and more.
        </p>
        <SearchBar />
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Top results ({items.length})</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((c) => <ResultCard key={c.id} c={c} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Table view</h2>
        <ResultTable items={items} />
      </section>
    </main>
  );
}
