# C4: Components (Public API + Services)

## API Gateway/Router
- Validates requests, authN/Z, rate-limit

## Search Component
- Query → index adapters (typesense/meilisearch)
- Faceting + tab aggregations
- Location handling & distance ranking

## Product Component
- Product CRUD (internal); public GET
- Enrichments (brand, category mapping)

## Scoring Component
- Universal + overlay weights
- Category modifiers
- Outputs score + explanation

## Provenance Component
- Validates `meta.sources[]`
- Enforces dataset license rules
- Surfacing links & confidence

## Taxonomy Mapper
- Spine (Amazon/Google/GS1 cross-walk)
- Category overlays (Food, Fashion, Electronics…)

## Integration Connectors
- Marketplaces, repair, borrow networks, cert datasets
- Rate-limited schedulers & error handling

