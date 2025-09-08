import ConnectorCard from "./components/ConnectorCard";
import SearchAndFilter from "./components/SearchAndFilter";
import { CONNECTORS, type ConnectorMeta } from "./_data/connectors";

export const metadata = {
  title: "Connectors",
  description: "Explore sustainability data sources integrated into Circl."
};
export const revalidate = 3600;

// Server component renders connector hub; client filter keeps UX responsive.
export default async function ConnectorsHub() {
  const items: ConnectorMeta[] = CONNECTORS;
  return (
    <main className="container mx-auto max-w-6xl p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Connectors</h1>
        <p className="text-sm text-gray-600">
          Browse all data sources. Click a connector to open its page. Expand “How to use” for tips and sample queries.
        </p>
      </header>

      <SearchAndFilter
        items={items}
        onFiltered={() => { /* client handles filtering */ }}
      />

      {/* Initial list rendered for non-JS / SEO; SearchAndFilter will adjust client-side */}
      <section className="grid gap-4 md:grid-cols-2">
        {items.map(c => <ConnectorCard key={c.slug} c={c} />)}
      </section>
    </main>
  );
}
