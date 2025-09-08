import { OffProduct, OffRawProduct } from "./types";

// Convert raw OFF product to our narrow OffProduct, discarding unusable items.
// Accepts a loosely-typed raw product, enabling resilience against API changes.
export function transformOffProduct(p: OffRawProduct | null | undefined): OffProduct | null {
  if (!p) return null;
  const id = String(p.code || p._id || p.id || "").trim();
  const name = (p.product_name ?? "").trim();
  if (!id && !name) return null; // Require at least an id or name to render.

  const brands =
    Array.isArray(p.brands_tags) ? p.brands_tags :
    typeof p.brands === "string" ? p.brands.split(",").map((s: string) => s.trim()).filter(Boolean) :
    [];

  const labels = Array.isArray(p.labels_tags) ? p.labels_tags : [];
  const categories = Array.isArray(p.categories_tags_en) ? p.categories_tags_en : [];

  return {
    id: id || name,
    name,
    brands,
    image: p.image_front_url || undefined,
    nutriScore: p.nutriscore_grade || p.nutrition_grades || undefined,
    ecoScore: p.ecoscore_grade || undefined,
    novaGroup: Number.isFinite(p.nova_group) ? Number(p.nova_group) : undefined,
    labels,
    packaging: p.packaging || undefined,
    allergens: p.allergens || undefined,
    categories,
    quantity: p.quantity || undefined,
  };
}
