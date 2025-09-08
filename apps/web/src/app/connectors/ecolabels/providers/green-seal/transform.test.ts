import { describe, it, expect } from "vitest";
import { transformGsJson } from "../../../../../lib/connectors/ecolabels/providers/green-seal/transform";

describe("transformGsJson", () => {
  it("maps json item to CertifiedProduct", () => {
    const data = {
      items: [
        {
          certificateNumber: "GS37-2024-00123",
          productName: "Cleaner",
          brand: "Brand",
          companyName: "Co",
          category: "Cleaning",
          country: "US",
          standardCode: "GS-37",
          issueDate: "2024-05-01",
          expirationDate: "2027-05-01",
          url: "https://example.com"
        }
      ]
    };
    const items = transformGsJson(data);
    expect(items[0].licenceId).toBe("GS37-2024-00123");
    expect(items[0].standardCode).toBe("GS-37");
  });
});
