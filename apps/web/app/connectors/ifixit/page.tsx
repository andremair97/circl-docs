import SearchBar from './components/SearchBar';
import GuideCard from './components/GuideCard';
import WikiCard from './components/WikiCard';
import { searchIfixit, getGuideDetail } from '@/src/lib/connectors/ifixit/fetch';
import type { IfixitGuideDetail } from '@/src/lib/connectors/ifixit/types';

export const revalidate = 3600;

// Server-rendered page showing iFixit search results and enrichment.
export default async function IfixitPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? 'iphone battery';
  const search = await searchIfixit(q);

  const guides = (
    await Promise.all(
      search.guides.slice(0, 10).map((g) => getGuideDetail(g.guideid)),
    )
  ).filter(Boolean) as IfixitGuideDetail[];
  const wikis = search.wikis.slice(0, 10);
  const empty = guides.length === 0 && wikis.length === 0;

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-4">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">iFixit</h1>
        <p className="text-gray-600">Repair guides and device wikis from iFixit.</p>
      </header>
      <SearchBar />
      {empty && <p className="text-sm text-gray-600">No results found.</p>}
      {guides.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Guides</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <GuideCard key={g.guideid} guide={g} />
            ))}
          </div>
        </section>
      )}
      {wikis.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Devices & Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wikis.map((w) => (
              <WikiCard key={w.url} wiki={w} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
