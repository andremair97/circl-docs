import { CityEmission } from "./types";

export function transformSocrataRowsToCityEmissions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[],
  dataset: string
): CityEmission[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r, idx) => {
    // Flexible mapping across common schemas
    const city = r.city || r.city_name || r.municipality || r.local_government || "";
    const country = r.country || r.country_name || r.nation || r.state_country || undefined;
    const year = Number(r.year || r.reporting_year || r.inventory_year || r.calendar_year || NaN);
    const total =
      num(r.total_emissions) ?? num(r.total_emissions_tco2e) ?? num(r.citywide_emissions) ??
      num(r.total_co2e) ?? num(r.total) ?? undefined;
    const perCap = num(r.per_capita_emissions) ?? num(r.per_capita_tco2e) ?? undefined;
    const scope = r.scope || r.inventory_scope || r.boundary || undefined;
    const method = r.inventory_method || r.methodology || r.protocol || undefined;

    return {
      id: String(r._id || r.id || `${dataset}-${idx}`),
      city: String(city || "").trim(),
      country: country ? String(country) : undefined,
      year: isFinite(year) ? year : undefined,
      totalEmissionsTCO2e: total,
      perCapitaTCO2e: perCap,
      scope,
      inventoryMethod: method,
      sourceDataset: dataset
    } as CityEmission;
  }).filter(x => x.city);
}

function num(v: unknown): number | undefined {
  const n = typeof v === "string" ? Number(v.replace(/,/g,"")) : typeof v === "number" ? v : NaN;
  return isFinite(n) ? n : undefined;
}
