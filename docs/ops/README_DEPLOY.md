# Cloudflare Pages Deployment

This guide covers deploying the `apps/web` Next.js app to Cloudflare Pages with an optional Zero Trust gate.

## Build Configuration

In the monorepo root run:

```bash
pnpm -w install
pnpm --filter @circl/web build
pnpm --filter @circl/web cf:build
```

The Cloudflare adapter outputs to `.vercel/output/static`. Set the Pages project build output directory to this path and use `pnpm --filter @circl/web build` as the build command.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `APP_BASIC_AUTH` | Enable Basic Auth when set to `1` |
| `APP_BASIC_USER` | Username for Basic Auth |
| `APP_BASIC_PASS` | Password for Basic Auth |

## Zero Trust Gate

Protect preview or production deployments by enabling Cloudflare Zero Trust and toggling `APP_BASIC_AUTH`. Assign access policies for teams or users who may bypass the gate.

## Cut-over / Rollback

1. Deploy to a new Pages project and verify via `pnpm cf:preview`.
2. Update DNS to point to the Pages domain when ready.
3. To rollback, restore the previous DNS record or redeploy the prior Vercel build.

