# Circl Cross-Platform Setup

Minimal monorepo scaffolding for web (Next.js) and mobile (Expo) apps.

## Prerequisites
- Node.js 20+
- pnpm 8+
- Python 3.11 (for docs/tests)

## Install
```bash
pnpm install
```

## Develop
Run web and mobile in parallel:
```bash
pnpm dev
```

## Build
```bash
pnpm build
```

## Lint
```bash
pnpm lint
```

## Test
Runs package tests and Python tests:
```bash
pnpm test
```

## Docs
Existing docs remain under `docs/`. Build them with:
```bash
pnpm docs:build
```
