import { test, expect } from '@playwright/test';

// Basic smoke test to ensure search flow doesn't crash.
test('user can search and see results page', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder="Search products..."]', 'drill');
  await page.click('text=Search');
  await expect(page).toHaveURL(/results/);
  // Either results grid or empty state should be visible.
  const hasCard = await page.locator('div.grid > div').first().isVisible().catch(() => false);
  const hasEmpty = await page.getByText('No results').isVisible().catch(() => false);
  expect(hasCard || hasEmpty).toBe(true);
});
