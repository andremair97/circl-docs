# Connectors Hub – Manual Verification

Short checklist to validate the Connectors Hub page before release.

- `make ui-install`
- `make ui-build`
- Navigate to `/connectors` and ensure all listed connectors open their pages.
- Test search (e.g., `monitor`) and tag filters (e.g., `certification`).
- `mkdocs build --strict` for docs sanity.
