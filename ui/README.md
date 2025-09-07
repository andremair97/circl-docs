# Circl UI

Mock-driven search interface used for prototyping.

## Development

Search suggestions and product results use in-repo seed data so no extra
configuration is required. Run the dev server or tests directly:

```bash
pnpm -C ui dev
pnpm -C ui test
```

## Theme and reusable states

This package uses Tailwind with a Circl theme:

- `primary` – brand green
- `bg`, `surface`, `soft-border` – background tokens
- `ok`, `warn`, `bad` – status colors

Available building blocks:

- `<Skeleton variant="rows|cards" />`
- `<EmptyState icon title description action?>`
- `<ErrorState title description onRetry?>`

See Storybook stories under `src/components/*.stories.tsx` for examples.
