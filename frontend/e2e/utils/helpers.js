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
  const acceptButton = page.getByRole('button', {
        name: /Godkänn alla|Accept All/i
    });

  try {
    await acceptButton.waitFor({ state: 'visible', timeout: 3000 });

    await acceptButton.click();

    await expect(acceptButton).not.toBeVisible({ timeout: 2000 });
  } catch (error) {
    // console.log('Cookie banner not found or already dismissed.');
  }
}