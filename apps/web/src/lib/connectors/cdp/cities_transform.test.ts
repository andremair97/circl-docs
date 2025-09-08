import { describe, expect, it } from "vitest";
import { transformSocrataRowsToCityEmissions } from "./cities_transform";

// Ensures variant Socrata field names map correctly to CityEmission
// so the UI remains robust to schema drift.
describe("transformSocrataRowsToCityEmissions", () => {
  it("maps variant field names", () => {
    const rows = [
      { city_name: "London", country_name: "United Kingdom", reporting_year: "2021", total_emissions: "123", per_capita_emissions: "3.2" }
    ];
    const res = transformSocrataRowsToCityEmissions(rows, "sample");
    expect(res[0]).toMatchObject({
      city: "London",
      country: "United Kingdom",
      year: 2021,
      totalEmissionsTCO2e: 123,
      perCapitaTCO2e: 3.2,
      sourceDataset: "sample"
    });
  });
});
