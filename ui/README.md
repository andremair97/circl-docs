# Circl UI

Mock-driven search interface used for prototyping.

## Mock search feature flag

The mock search is disabled by default. Enable it by setting the environment variable before running development or tests:

```bash
VITE_ENABLE_MOCK_SEARCH=true pnpm -C ui dev
VITE_ENABLE_MOCK_SEARCH=true pnpm -C ui test
```

Mock results are served from `public/mocks/search.sample.json`.
