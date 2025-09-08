import { describe, it, expect } from "vitest";
import { transformEbayItem } from "./transform";

// Basic smoke tests to ensure the transformer handles common shapes.
describe("transformEbayItem", () => {
  it("maps core fields", () => {
    const item = transformEbayItem({
      itemId: "123",
      title: "Refurb Laptop",
      price: { value: "100", currency: "GBP" },
      shippingOptions: [{ localPickup: true }],
      returnTerms: { returnsAccepted: true, returnWithin: "30_DAYS" },
    });
    expect(item).toEqual(expect.objectContaining({
      id: "123",
      title: "Refurb Laptop",
      pickupEligible: true,
      freeReturns: true,
    }));
  });

  it("returns null for empty input", () => {
    expect(transformEbayItem({})).toBeNull();
  });
});
