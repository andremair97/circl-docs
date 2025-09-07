# Universal Schema v1

`schemas/universal/*.v1.json` defines the frozen baseline contracts shared across
connectors and the UI.

## Versioning

- `v1` is immutable; only additive, backward-compatible fields may appear in `v1.x` files.
- Breaking changes require a new schema file with a bumped version (e.g., `search-result.v1.1.json`) plus corresponding docs and OpenAPI updates.
