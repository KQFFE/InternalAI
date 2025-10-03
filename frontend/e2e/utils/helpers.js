import { expect } from '@playwright/test';

/**
 * A helper function to dismiss a cookie banner if it appears.
 * It waits for a short period to see if the banner shows up,
 * then clicks a button with text like "Accept" and waits for it to disappear.
 * This makes tests more robust by handling the banner in a centralized way.
 *
 * @param {import('@playwright/test').Page} page The Playwright page object.
 */
export async function dismissCookieBanner(page) {
  const acceptButton = page.locator('[data-testid="accept-all-cookies"]');

  try {
    await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
    await acceptButton.click();
    await expect(acceptButton).not.toBeVisible({ timeout: 2000 });
  } catch (error) {
    // The banner might not appear on every page load, so we catch the error.
    // If the test fails later due to an overlay, this catch block might be the cause.
    // For now, we assume it's okay if the banner is not found.
    console.log('Cookie banner not found or already dismissed.');
  }
}