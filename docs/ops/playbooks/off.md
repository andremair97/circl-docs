# Playbook: Open Food Facts (OFF)

## Overview
Ingest **Open Food Facts** to enrich Circl product sustainability attributes.

## Access
- Public dumps: https://world.openfoodfacts.org/data  
- Formats: JSON/CSV; bulk dumps (products.*.json.gz)

## Mapping
- **Universal schema:** `/schemas/universal/product.json`  
- **Overlay schema (source-specific):** `/schemas/overlays/off/product.overlay.json`  
- **Examples:** `/examples/off/*.json`

+### Field mapping (minimal seed)
| OFF field            | Overlay field       | Universal target (example)            |
|----------------------|---------------------|---------------------------------------|
| `code`               | `code`              | `identifiers.barcode`                 |
| `product_name`       | `product_name`      | `title`                               |
| `brands`             | `brands`            | `brand.name`                          |
| `categories`         | `categories`        | `classification.categories[]`         |
| `quantity`           | `quantity`          | `packaging.net_quantity`              |
| `packaging`          | `packaging`         | `packaging.materials[]` (parsed)      |
| `ecoscore_grade`     | `ecoscore_grade`    | `scores.ecoscore.grade`               |
| `last_modified_t`    | `last_modified_t`   | `source.last_modified` (ISO8601)      |
| `_provenance.*`      | `_provenance.*`     | `provenance.*`                        |


## Provenance
Record: `source=OFF`, `fetched_at`, `file_sha256`, `record_id`, `transform_version`.

## Quality Checks
- Run **schema validation (2020-12)** for overlay & universal.
- **Provenance completeness check** (all required fields present).
- Deduplicate by `code` (barcode) + brand.

## Rate / Scheduling
- Prefer bulk nightly (UTC), avoid hammering APIs.

## ETL (use shared checklist)
1. Acquire dump → verify checksum
2. Extract → stream parse
3. Normalize → overlay map
4. Enrich → universal map
5. Validate → overlay & universal
6. Score hooks (if applicable)
7. Write → warehouse
8. Emit provenance + logs

> See `_etl-checklist.md` in this folder for a tick-box runbook.

