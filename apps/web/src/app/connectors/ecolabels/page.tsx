import ProviderTabs from "./components/ProviderTabs";
import SearchBar from "./components/SearchBar";
import ResultCard from "./components/ResultCard";
import ResultTable from "./components/ResultTable";
import { providers } from "@/app/../src/lib/connectors/ecolabels";
import { CertifiedProduct } from "@/app/../src/lib/connectors/ecolabels/types";

export const revalidate = 3600;

export default async function EcolabelsPage({
  searchParams,
}: {
  searchParams: { provider?: string; q?: string; country?: string; category?: string; page?: string };
}) {
  const providerKey = (searchParams?.provider as "EU_ECOLABEL" | "GREEN_SEAL") ?? "EU_ECOLABEL";
  const q = searchParams?.q ?? "";
  const country = searchParams?.country;
  const category = searchParams?.category;

  const searchFn = providers[providerKey];
  const items: CertifiedProduct[] = await searchFn({
    q,
    country: country || undefined,
    category: category || undefined,
    page: 1,
    pageSize: 25,
  });

  return (
    <main className="container mx-auto max-w-6xl p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Eco-labels (EU Ecolabel & Green Seal)</h1>
        <p className="text-sm text-gray-600">
          Browse certified products and normalize fields across providers.
        </p>
        <ProviderTabs current={providerKey} />
        <SearchBar initialQuery={q} />
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Results ({items.length})</h2>
        {items.length ? (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((p) => <ResultCard key={`${p.provider}-${p.id}`} p={p} />)}
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Table view</h3>
              <ResultTable items={items} />
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-600">No results yet. Try a different query.</div>
        )}
      </section>
    </main>
  );
}
