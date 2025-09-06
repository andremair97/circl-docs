# Provenance Standard

Every record must include `meta.sources[]`:
- `source_id`, `name`, `url`, `method` (`api|scrape|manual`)
- `license`, `fields[]`, `retrieved_at` (ISO 8601)
- `marketplace_locale` (optional)
- `confidence` [0..1]

## Rules
- Surface clickable sources in UI
- Record license & usage notes
- Keep fetch snapshots when allowed

