import { BcorpCompany } from "./types";

// Normalises records from Algolia or local samples into the shared
// BcorpCompany shape so the UI only deals with one format.
export function transformBcorpRecord(raw: unknown): BcorpCompany | null {
  if (typeof raw !== "object" || raw === null) return null;

  // Treat the incoming record as a generic key/value map. We avoid `any`
  // so ESLint's `no-explicit-any` rule stays happy, but still allow flexible
  // property access for various source shapes.
  const r = raw as Record<string, unknown>;

  // Accept a variety of identifier fields as different feeds name them differently.
  const id = String(r.objectID || r.id || r.slug || (r as { _id?: unknown })._id || "");
  const name = String(r.name || r.companyName || "").trim();
  if (!id && !name) return null; // Without an id or name the record is unusable.

  const industries = Array.isArray(r.industries)
    ? (r.industries as unknown[]).map((i) => String(i))
    : typeof r.industry === "string"
      ? [r.industry]
      : [];

  const status = (r.status || r.certificationStatus) as string | undefined;
  const scoreVal = r.bImpactScore ?? r.score;
  const scoreNum = typeof scoreVal === "number" ? scoreVal : undefined;

  return {
    id: id || name,
    name,
    status,
    bImpactScore: scoreNum,
    industries,
    country: (r.country || r.countryName) as string | undefined,
    city: (r.city || r.locality) as string | undefined,
    employeesRange: (r.employeesRange || r.size) as string | undefined,
    certificationDate: (r.certificationDate || r.certifiedOn) as string | undefined,
    website: (r.website || r.site || r.url) as string | undefined,
    logo: (r.logo || r.logoUrl) as string | undefined,
    description: (r.description || r.summary) as string | undefined,
  };
}
