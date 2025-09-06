# Threat Model (Draft)

## Data & Licensing
- **Risk**: Using data beyond license terms
- **Mitigation**: Store license metadata; enforce in API/UI; automated checks

## Privacy
- **Risk**: Location misuse or unintended retention
- **Mitigation**: Minimize precision; TTLs; explicit consent; anonymize analytics

## Scraping Ethics/Robustness
- **Risk**: Blocking or legal issues
- **Mitigation**: Prefer official APIs; respect robots and rate limits; cache

## Integrity
- **Risk**: Score manipulation via bad inputs
- **Mitigation**: Source confidence, outlier detection, provenance coverage rules

## Availability
- **Risk**: Provider outages
- **Mitigation**: Caching, fallback providers, circuit breakers

## Supply Chain
- **Risk**: Dependency vulnerabilities
- **Mitigation**: Pin versions, SCA scans, signed artifacts

