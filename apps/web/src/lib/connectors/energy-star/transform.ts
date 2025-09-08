import { EnergyStarProduct, EnergyStarCategory } from "./types";

/**
 * Map arbitrary provider JSON (record-per-product) into EnergyStarProduct.
 * Keep this tolerant to missing fields; return null to drop a record.
 */
export function mapProviderRecordToProduct(
  raw: unknown,
  category: EnergyStarCategory
): EnergyStarProduct | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  // Heuristic field extraction with common fallbacks:
  const id = String(
    r["id"] ?? r["model_number"] ?? r["model number"] ?? r["_id"] ?? r["guid"] ?? ""
  ).trim();
  const brand = String(
    r["brand"] ?? r["brand_name"] ?? r["Brand"] ?? ""
  ).trim();
  const model = String(
    r["model"] ?? r["model_number"] ?? r["Model"] ?? ""
  ).trim();

  if (!brand && !model) return null;
  const annualKwhNum = (() => {
    const v = r["annual_kwh"] ?? r["annual energy use (kwh/yr)"] ?? r["kwh_year"] ?? r["annual_energy"] ?? undefined;
    const n = typeof v === "string" ? parseFloat(v.replace(/[^\d.]/g, "")) : (typeof v === "number" ? v : undefined);
    return Number.isFinite(n!) ? (n as number) : undefined;
  })();

  const mostEff = (() => {
    const v = r["most_efficient"] ?? r["most efficient"] ?? r["is_most_efficient"] ?? r["mostEfficient"];
    if (typeof v === "boolean") return v;
    if (typeof v === "string") return ["yes","true","y","1"].includes(v.toLowerCase());
    return undefined;
  })();

  const capacityVal =
    r["capacity"] ??
    r["capacity (cu ft)"] ??
    r["place settings"] ??
    r["screen_size"] ??
    r["screen size"] ??
    undefined;

  const productUrl =
    r["product_url"] ?? r["product url"] ?? r["url"] ?? undefined;

  const certifiedDate =
    r["date_certified"] ?? r["date certified"] ?? r["certified"] ?? undefined;

  return {
    id: id || `${brand}-${model}` || `${brand}-${Math.random().toString(36).slice(2)}`,
    category,
    brand,
    model,
    variant: (r["variant"] ?? r["model variant"] ?? undefined) as string | undefined,
    productUrl: productUrl as string | undefined,
    certifiedDate: certifiedDate as string | undefined,
    annualKwh: annualKwhNum,
    capacity: typeof capacityVal === "number" ? String(capacityVal) : (capacityVal as string | undefined),
    mostEfficient: mostEff,
    notes: r["notes"] as string | undefined,
  };
}
