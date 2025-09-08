import { CertifiedProduct } from "../../types";

export function transformGsJson(data: unknown): CertifiedProduct[] {
  const maybe = data as { items?: unknown };
  const items: Record<string, unknown>[] = Array.isArray(maybe.items)
    ? (maybe.items as Record<string, unknown>[])
    : Array.isArray(data)
    ? (data as Record<string, unknown>[])
    : [];

  return items
    .map(
      (p): CertifiedProduct => ({
        id: String(
          p["certificateNumber"] ?? p["id"] ?? p["productId"] ?? Math.random()
        ),
        provider: "GREEN_SEAL",
        name: String(p["productName"] ?? p["name"] ?? ""),
        brand: p["brand"] ? String(p["brand"]) : undefined,
        company:
          p["companyName"]
            ? String(p["companyName"])
            : p["manufacturer"]
            ? String(p["manufacturer"])
            : undefined,
        category:
          p["category"]
            ? String(p["category"])
            : p["standardCategory"]
            ? String(p["standardCategory"])
            : undefined,
        country: p["country"] ? String(p["country"]) : undefined,
        standardCode:
          p["standardCode"]
            ? String(p["standardCode"])
            : p["standard"]
            ? String(p["standard"])
            : undefined, // e.g., "GS-37"
        licenceId: p["certificateNumber"] ? String(p["certificateNumber"]) : undefined,
        validFrom: p["issueDate"] ? String(p["issueDate"]) : undefined,
        validTo: p["expirationDate"] ? String(p["expirationDate"]) : undefined,
        url:
          p["url"]
            ? String(p["url"])
            : p["detailsUrl"]
            ? String(p["detailsUrl"])
            : undefined,
      })
    )
    .filter((x) => x.name || x.company);
}
