# C4: Containers

## Web App (Next.js)
- SSR for search and results pages
- Map & facets UI; four result tabs
- Pulls data from Public API

## Public API (Node/TypeScript)
- Endpoints: `/search`, `/products/{id}`, `/scores/{id}`, `/taxonomies`
- Auth (if needed for advanced features), rate limiting
- OpenAPI 3.1 contract

## Scoring Service
- Applies universal + overlay weights
- Produces **Circl Score** and breakdown
- Emits provenance requirements

## Provenance Service
- Normalizes `meta.sources[]`
- Validates licenses and retention
- Generates completeness and confidence metrics

## Ingestion Workers
- Pull/push connectors to data providers
- Normalize to internal schemas
- Schedule & backoff; dedupe; QA

## Data Stores
- Postgres (core product/entities, provenance)
- Search index (Typesense/Meilisearch)
- Object storage for artifacts/snapshots

## Observability
- Metrics (ingestion rates, scoring latency)
- Logs (structured)
- Traces (critical paths)

