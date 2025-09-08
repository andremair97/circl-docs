import { describe, it, expect } from "vitest";
import { transformEuRow } from "../../../../../src/lib/connectors/ecolabels/providers/eu-ecolabel/transform"; // reflect src/ location

describe("transformEuRow", () => {
  it("maps csv row to CertifiedProduct", () => {
    const row = [
      "Test Product","BrandX","Company Y","Category Z","DE",
      "EU/123/456","2024-01-01","2025-01-01","https://example.com","2014/312/EU"
    ];
    const p = transformEuRow(row)!;
    expect(p.name).toBe("Test Product");
    expect(p.brand).toBe("BrandX");
    expect(p.company).toBe("Company Y");
    expect(p.licenceId).toBe("EU/123/456");
    expect(p.standardCode).toBe("2014/312/EU");
  });
});
