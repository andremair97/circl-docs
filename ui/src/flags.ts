// Feature flags for the UI.
// `VITE_ENABLE_MOCK_SEARCH=true` enables fetching mock search data.
export const ENABLE_MOCK_SEARCH =
  import.meta.env.VITE_ENABLE_MOCK_SEARCH === 'true';
