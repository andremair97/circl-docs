# Circl – Prompt Library

Reusable prompts for AI agents.

---

## a) Implement an Endpoint
**Goal:** Add endpoint from OpenAPI.  
**Inputs:** `/apis/*.yaml`, related schemas.  
**Deliverables:** TS handler + test + updated docs.  
**Acceptance:** Matches OpenAPI, passes validation.

---

## b) Add Data Source Ingestion
**Goal:** Ingest new source.  
**Inputs:** Source docs, `/docs/ops/520-provenance.md`.  
**Deliverables:** Playbook in `/docs/ingestion/`, schema overlay.  
**Acceptance:** Provenance captured, schema validated.

---

## c) Extend JSON Schema
**Goal:** Add fields/examples.  
**Inputs:** Target schema file.  
**Deliverables:** Updated schema + JSON examples in `/examples/`.  
**Acceptance:** Valid 2020-12, examples pass validation.

---

## d) Write ADR for Data Source
**Goal:** Record ingestion decision.  
**Inputs:** PRD, source details.  
**Deliverables:** ADR in `/docs/adr/`.  
**Acceptance:** Clear context, decision, alternatives, consequences.

