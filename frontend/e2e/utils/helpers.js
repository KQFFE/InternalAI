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
  // This locator is designed to be generic. It looks for a button
  // with text containing "Accept" or "Godkänn" (Swedish for Accept),
  // case-insensitively. This covers "Accept All" and "Godkänn alla".
  const acceptButton = page.getByRole('button', { name: /accept|godkänn/i });

  try {
    // Wait for the button to be visible, but with a short timeout.
    // If the banner doesn't appear (e.g., already dismissed, or not present
    // on the page), we don't want to fail the test.
    await acceptButton.waitFor({ state: 'visible', timeout: 3000 });

    // If the button is found, click it.
    await acceptButton.click();

    // Wait for the button to disappear to ensure the action is complete
    // and the page is ready for the next steps.
    await expect(acceptButton).not.toBeVisible({ timeout: 2000 });
  } catch (error) {
    // If the button is not found within the timeout, it's likely not on the page.
    // We can safely ignore the error and continue with the test.
    // A console.log can be useful for debugging if needed.
    // console.log('Cookie banner not found or already dismissed.');
  }
}