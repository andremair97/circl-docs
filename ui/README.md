# Circl UI

Mock-driven search interface used for prototyping.

Mock suggestions come from `src/suggest/seed.json` and results from
`public/mocks/search.sample.json`.

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
