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

## Connectors Hub Auto-Discovery

/connectors attempts to read apps/web/app/connectors/*/page.tsx at runtime on Node.

If it can’t (e.g., edge runtime or path change), it falls back to the static catalog in lib/connectorCatalog.ts.

To add a new connector page, create apps/web/app/connectors/<slug>/page.tsx. Title/description can be added in the catalog (optional).

Runtime note — ensure no file in this chain opts into edge runtime. Do not add export const runtime = 'edge' to page.tsx or this lib. No changes required if you never set edge.
