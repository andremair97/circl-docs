# C4: System Context

Circl helps people make sustainable consumption choices by unifying results across:
- **Repair** (local shops/guides)
- **Used** (marketplaces)
- **Borrow** (libraries/rentals)
- **Buy-it-for-Life** (durable new)

## Primary Actors
- **End User**: searches by need (e.g., “drill”), optionally shares location.
- **Data Providers**: marketplaces, repair networks, certification bodies.
- **Admin/Operators**: manage ingestion, scoring, compliance.

## External Systems
- Marketplaces (FB Marketplace, eBay, Vinted)
- Repair directories (iFixit/Open Repair, local stores)
- Borrow networks (Tool Libraries, Library of Things)
- Certification datasets (EU Ecolabel, B-Corp, CDP)
- Geocoding/Places (for local results)

## High-Level Responsibilities
- Search/resolve category → return 4-tab blended results
- Compute **Circl Score** with provenance links
- Respect licenses, rate limits, and local privacy constraints

## Quality Attributes
- Accessibility, transparency, observability, compliance, performance (SSR where applicable)

