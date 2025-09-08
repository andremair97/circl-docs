import { describe, it, expect } from "vitest";
import { transformOffProduct } from "../../../lib/connectors/off/transform";

// Ensure transformer extracts core fields and tolerates missing data.
describe("transformOffProduct", () => {
  it("maps basic fields and handles null", () => {
    const raw = {
      code: "1",
      product_name: "Item",
      brands: "Brand1, Brand2",
      labels_tags: ["l1"],
      categories_tags_en: ["cat"],
      nova_group: 2,
    };
    const p = transformOffProduct(raw)!;
    expect(p.id).toBe("1");
    expect(p.name).toBe("Item");
    expect(p.brands).toEqual(["Brand1", "Brand2"]);
    expect(p.labels).toEqual(["l1"]);
    expect(p.categories).toEqual(["cat"]);
    expect(p.novaGroup).toBe(2);

    expect(transformOffProduct(null as any)).toBeNull();
  });
});
