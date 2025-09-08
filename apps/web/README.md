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

## Password protection

Set `PROTECT_ENABLED=true` and define `PROTECT_PASSWORD`, `PROTECT_SECRET` in Vercel Project → Settings → Environment Variables (Preview/Prod as desired).

To disable globally, set `PROTECT_ENABLED=false`.

Optional: enable Vercel Deployment Protection in Project → Settings → Deployment Protection for dashboard-level gating.

