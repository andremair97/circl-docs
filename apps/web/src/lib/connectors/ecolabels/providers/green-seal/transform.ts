import { CertifiedProduct } from "../../types";

export function transformGsJson(data: any): CertifiedProduct[] {
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return items.map((p: any) => ({
    id: String(p.certificateNumber ?? p.id ?? p.productId ?? Math.random()),
    provider: "GREEN_SEAL",
    name: p.productName ?? p.name ?? "",
    brand: p.brand ?? undefined,
    company: p.companyName ?? p.manufacturer ?? undefined,
    category: p.category ?? p.standardCategory ?? undefined,
    country: p.country ?? undefined,
    standardCode: p.standardCode ?? p.standard ?? undefined, // e.g., "GS-37"
    licenceId: p.certificateNumber ?? undefined,
    validFrom: p.issueDate ?? undefined,
    validTo: p.expirationDate ?? undefined,
    url: p.url ?? p.detailsUrl ?? undefined,
  })).filter((x: CertifiedProduct) => x.name || x.company);
}
