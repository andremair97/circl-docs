import { test, expect } from "vitest";
import { mapProviderRecordToProduct } from "./transform";

test("maps minimal provider record", () => {
  const p = mapProviderRecordToProduct({ brand_name: "CoolCo", model_number: "X1", annual_kwh: "123" }, "Refrigerators");
  expect(p?.brand).toBe("CoolCo");
  expect(p?.model).toBe("X1");
  expect(p?.annualKwh).toBe(123);
  expect(p?.category).toBe("Refrigerators");
});
