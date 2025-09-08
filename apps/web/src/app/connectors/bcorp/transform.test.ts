// Use relative import to avoid relying on test-time path alias resolution.
import { expect, test } from "vitest";
import { transformBcorpRecord } from "../../../lib/connectors/bcorp/transform";

// Basic smoke test to ensure transform handles partial records without throwing.
test("transform tolerates sparse input", () => {
  const out = transformBcorpRecord({ name: "Test Co", objectID: "x1", bImpactScore: 99 });
  expect(out?.name).toBe("Test Co");
  expect(out?.bImpactScore).toBe(99);
});
