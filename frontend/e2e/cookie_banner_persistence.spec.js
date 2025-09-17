import { test, expect } from '@playwright/test';

const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

const LOCATORS = {
  cookieBannerContainer: '[data-testid="cookie-banner-container"]',
  acceptAllCookiesButton: '[data-testid="accept-all-cookies"]',
};

test.describe('Cookie Banner Persistence', () => {
  test('should save "accept all" preferences and not show banner on subsequent visit', async ({ page }) => {
    await page.goto('/');

    // 1. Initially, the banner should be visible
    await expect(page.locator(LOCATORS.cookieBannerContainer)).toBeVisible();

    // 2. User accepts all cookies
    await page.locator(LOCATORS.acceptAllCookiesButton).click();

    // 3. Banner should disappear
    await expect(page.locator(LOCATORS.cookieBannerContainer)).not.toBeVisible();

    // 4. Verify that preferences are saved in localStorage
    const savedPrefs = await page.evaluate(
      (key) => localStorage.getItem(key),
      COOKIE_PREFERENCES_KEY
    );
    expect(JSON.parse(savedPrefs)).toEqual({
      functional: true,
      statistic: true,
      marketing: true,
    });

    // 5. Reload the page to simulate a subsequent visit
    await page.reload();

    // 6. On the new visit, the banner should NOT be visible
    await expect(page.locator(LOCATORS.cookieBannerContainer)).not.toBeVisible();

    // 7. (Optional but good) Verify the app has loaded with the correct state
    // This part depends on how your app uses the cookie state. For example,
    // you might check if a marketing script has been loaded.
    // For now, we'll re-check localStorage to ensure it's still there.
    const reloadedPrefs = await page.evaluate(
      (key) => localStorage.getItem(key),
      COOKIE_PREFERENCES_KEY
    );
    expect(JSON.parse(reloadedPrefs)).toEqual({
      functional: true,
      statistic: true,
      marketing: true,
    });
  });
});