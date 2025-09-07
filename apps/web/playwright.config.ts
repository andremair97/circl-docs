import { defineConfig } from '@playwright/test';

// Spins up the Next.js dev server before running smoke tests.
export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'pnpm --filter @circl/web dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});
