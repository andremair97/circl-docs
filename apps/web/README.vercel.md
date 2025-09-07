# Vercel deployment

Framework: Next.js
Root Directory (Vercel): apps/web
Install Command: pnpm install
Build Command: pnpm build
Output:

Security:
- Enable "Vercel Authentication" → Standard Protection (Preview Deployments).
- Team members only (keep team = just the owner).
- Disable shareable links.
- Optional fallback: set PREVIEW_AUTH_USER and PREVIEW_AUTH_PASS for Preview environment to activate middleware.

Faster builds (optional) — Ignored Build Step:
```
CHANGED=$(git diff --name-only "$VERCEL_GIT_PREVIOUS_SHA..$VERCEL_GIT_COMMIT_SHA" 2>/dev/null || true)
echo "$CHANGED" | egrep -q '^(apps/web/|packages/ui/|packages/utils/|packages/schemas/)' && exit 1 || { echo "Skip apps/web"; exit 0; }
```

One-time Vercel env for the middleware (only if you enable it):

PREVIEW_AUTH_USER = <your_username>
PREVIEW_AUTH_PASS = <your_password>

Leave them unset in Production so live site stays public.
