import TabToggle from "./components/TabToggle";
import CitySearchForm from "./components/CitySearchForm";
import CityCard from "./components/CityCard";
import CityTable from "./components/CityTable";
import CorpCard from "./components/CorpCard";
import { findCityEmissions } from "@/app/../src/lib/connectors/cdp/cities_fetch";
import { getCorpScores } from "@/app/../src/lib/connectors/cdp/corp_fetch";

export const revalidate = 3600;

export default async function CdpPage({ searchParams }: { searchParams: Record<string,string | undefined> }) {
  const tab = searchParams.tab ?? "cities";

  const city = searchParams.city ?? "London";
  const country = searchParams.country ?? "";
  const fromYear = Number(searchParams.from ?? 2018);
  const toYear = Number(searchParams.to ?? 2024);

  const cities = await findCityEmissions({ city, country, fromYear, toYear, limit: 24 });

  let corp: Awaited<ReturnType<typeof getCorpScores>> = [];
  if (tab === "corporate") {
    corp = await getCorpScores({ company: searchParams.company, year: Number(searchParams.year || 2024), theme: searchParams.theme });
  }

  return (
    <main className="container mx-auto max-w-5xl p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">CDP</h1>
        <p className="text-sm text-gray-600">
          Explore open city climate data from CDP’s Open Data Portal. Corporate scores appear if a licensed feed is configured.
        </p>
        <div className="flex items-center justify-between">
          <TabToggle />
        </div>
      </header>

      {tab === "cities" ? (
        <section className="space-y-4">
          <CitySearchForm />
          <div className="grid gap-3 md:grid-cols-2">
            {cities.map((c) => <CityCard key={c.id} item={c} />)}
          </div>
          <CityTable rows={cities} />
        </section>
      ) : (
        <section className="space-y-4">
          <div className="text-sm text-gray-600">
            {process.env.CDP_CORP_BASE ? "Licensed mode active (corporate scores)" : "Corporate scores not configured — showing sample data."}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {corp.map(s => <CorpCard key={s.id} s={s} />)}
          </div>
        </section>
      )}
    </main>
  );
}
