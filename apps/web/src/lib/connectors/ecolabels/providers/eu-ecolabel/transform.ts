import { CertifiedProduct } from "../../types";

// Accept flexible field names since CSV/API schemas may vary across portals.
const FIELD_MAP = {
  name: ["ProductName", "Product", "Name"],
  brand: ["Brand"],
  company: ["Company", "LicenceHolder", "Manufacturer", "Supplier"],
  category: ["ProductGroup", "Category"],
  country: ["Country", "MemberState"],
  licenceId: ["LicenceNumber", "LicenseNumber", "RegistrationNumber"],
  validFrom: ["ValidFrom", "IssueDate", "StartDate"],
  validTo: ["ValidTo", "ExpiryDate", "EndDate"],
  url: ["URL", "Link"],
  standardCode: ["Decision", "DecisionNumber", "StandardCode"],
};

export function transformEuRow(row: string[]): CertifiedProduct | null {
  // Expect a header-less small sample, or derive from first row in CSV path code if needed
  // For sample.csv we use a fixed column order:
  // ProductName,Brand,Company,Category,Country,LicenceNumber,ValidFrom,ValidTo,URL,Decision
  const [
    name, brand, company, category, country,
    licenceId, validFrom, validTo, url, standardCode
  ] = row;

  if (!(name || company)) return null;

  return {
    id: `${licenceId ?? name}-${company ?? ""}`.replace(/\s+/g, "_"),
    provider: "EU_ECOLABEL",
    name,
    brand: empty(brand),
    company: empty(company),
    category: empty(category),
    country: empty(country),
    licenceId: empty(licenceId),
    validFrom: empty(validFrom),
    validTo: empty(validTo),
    url: empty(url),
    standardCode: empty(standardCode),
  };
}

export function transformEuJson(data: any): CertifiedProduct[] {
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return items.map((p: any) => ({
    id: String(p.licenceId ?? p.id ?? p.registrationNumber ?? p.name ?? Math.random()),
    provider: "EU_ECOLABEL",
    name: first(p, FIELD_MAP.name) ?? "",
    brand: first(p, FIELD_MAP.brand),
    company: first(p, FIELD_MAP.company),
    category: first(p, FIELD_MAP.category),
    country: first(p, FIELD_MAP.country),
    licenceId: first(p, FIELD_MAP.licenceId),
    validFrom: first(p, FIELD_MAP.validFrom),
    validTo: first(p, FIELD_MAP.validTo),
    url: first(p, FIELD_MAP.url),
    standardCode: first(p, FIELD_MAP.standardCode),
  })).filter((x: CertifiedProduct) => x.name || x.company);
}

function first(obj: any, keys: string[]) {
  for (const k of keys) {
    if (obj?.[k] != null && String(obj[k]).trim() !== "") return String(obj[k]);
  }
  return undefined;
}
function empty(s?: string) { return s && s.length ? s : undefined; }
