# Library of Things UK Connector

This module houses an isolated connector for UK "Library of Things" style
catalogues. It intentionally ships without external dependencies and mirrors the
patterns used by other connectors in this repo.

Providers:

- **myTurn** – real provider with optional live HTTP (requires `MYTURN_BASE_URL`).
- **lot** – stub for the Library of Things platform using fixtures.
- **lendengine** – stub for Lend Engine deployments using fixtures.

See the `docs/connectors/libraryofthings_uk.md` page for details and CLI usage.
