# Circl Context Pack (drop-in for ChatGPT/Codex)

Start here:

- Vision → docs/vision/010-product-vision.md
- MVP PRD → docs/product/100-mvp-prd.md
- Data Standard → docs/data/300-data-standard.md
- Provenance Standard → docs/data/310-provenance-standard.md
- Scoring Spec → docs/data/330-scoring-spec.md
- API Overview → docs/apis/400-api-overview.md
- OpenAPI root → openapi/circl.openapi.yaml
- JSON Schemas → /schemas

Conventions:

- Code in TypeScript/Node/Next.js, JSON Schema 2020-12, OpenAPI 3.1
- Always update docs + ADRs when changing behavior or decisions
- Never edit `PROJECT_CHANGELOG.md` directly; add `changelog/<PR>-<slug>.md` and let CI compile.
  CI guards reject direct edits without a fragment or `skip-changelog` label.
