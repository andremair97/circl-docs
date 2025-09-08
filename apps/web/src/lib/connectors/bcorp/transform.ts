import { BcorpCompany } from "./types";

// Normalises records from Algolia or local samples into the shared
// BcorpCompany shape so the UI only deals with one format.
export function transformBcorpRecord(raw: any): BcorpCompany | null {
  if (!raw) return null;
  // Accept a variety of identifier fields as different feeds name them differently.
  const id = String(raw.objectID || raw.id || raw.slug || raw._id || "");
  const name = (raw.name || raw.companyName || "").toString().trim();
  if (!id && !name) return null; // Without an id or name the record is unusable.

  const industries = Array.isArray(raw.industries) ? raw.industries
    : typeof raw.industry === "string" ? [raw.industry] : [];

  const status = raw.status || raw.certificationStatus;
  const scoreNum = typeof raw.bImpactScore === "number" ? raw.bImpactScore
    : typeof raw.score === "number" ? raw.score : undefined;

  return {
    id: id || name,
    name,
    status: status,
    bImpactScore: scoreNum,
    industries,
    country: raw.country || raw.countryName,
    city: raw.city || raw.locality,
    employeesRange: raw.employeesRange || raw.size,
    certificationDate: raw.certificationDate || raw.certifiedOn,
    website: raw.website || raw.site || raw.url,
    logo: raw.logo || raw.logoUrl,
    description: raw.description || raw.summary || undefined,
  };
}
