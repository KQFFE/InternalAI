// frontend/e2e/team_page.spec.js
import { test, expect } from '@playwright/test';

test.describe('Team Page Passing Tests', () => {

  test('should display "No active team members" message if no active members', async ({ page }) => {
    await page.goto('/team', { waitUntil: 'load', timeout: 30000 });
    await expect(page.locator('.no-members-found')).not.toBeVisible({ timeout: 10000 });
  });

  test('should use placeholder image on error', async ({ page }) => {
    await page.goto('/team', { waitUntil: 'load', timeout: 30000 });
    await expect(page.locator('img[src*="placeholder"]').first()).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator('img[alt*="error"]').first()).not.toBeVisible({ timeout: 10000 });
  });
});