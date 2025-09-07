# Circl Web

## How to run locally

```bash
pnpm install
pnpm --filter @circl/web dev
```

To create a production build:

```bash
pnpm --filter @circl/web build
```

## Fixtures vs live data

By default the app serves results from static JSON fixtures so development stays
fast and deterministic. Set `NEXT_PUBLIC_USE_FIXTURES=false` to switch to live
connectors once they are available.

## Screenshot

<!-- Placeholder for future screenshots -->
