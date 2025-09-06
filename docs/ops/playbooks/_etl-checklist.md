# ETL Checklist (Shared)

- [ ] **Inputs fixed:** source URL(s), version/timestamp captured
- [ ] **Integrity:** checksum/size verified and logged
- [ ] **Parser:** streaming where possible; memory bounded
- [ ] **Normalization:** trim/locale/units harmonized
- [ ] **Overlay mapping:** create/update `/schemas/overlays/<source>/*.json`
- [ ] **Universal mapping:** ensure compatibility with `/schemas/universal/*.json`
- [ ] **Validation:** ajv (2020-12) passes for overlay & universal; failing records quarantined
- [ ] **Provenance:** source, transform version, record ids, timings captured
- [ ] **Idempotency:** re-runs produce the same outputs
- [ ] **Observability:** row counts, error rates, durations emitted
- [ ] **Storage/Partitioning:** documented and applied
- [ ] **Backfill plan:** initial historic import + incremental
- [ ] **Rollback plan:** how to revert this batch cleanly
- [ ] **Docs:** update playbook + examples; link PRs and ADR (if needed)

