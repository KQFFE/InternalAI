import { test, expect } from '@playwright/test';

test.describe('Cookie Banner Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page to trigger the cookie banner
    await page.goto('/');
  });

  test('should trap focus within the cookie banner', async ({ page }) => {
    // 1. Define the focusable elements in the banner
    const cookieInfoLink = page.getByRole('link', { name: 'Cookie Information' });
    const declineButton = page.getByTestId('decline-all-cookies');
    const acceptButton = page.getByTestId('accept-all-cookies');
    const showDetailsButton = page.getByRole('button', { name: 'Visa detaljer' });
    const functionalityToggle = page.locator('#cookie_cat_functional');
    const statisticsToggle = page.locator('#cookie_cat_statistic');
    const marketingToggle = page.locator('#cookie_cat_marketing');

    // 2. Verify initial focus is on the first primary action button (Decline button)
    // This is due to our specific logic in CookieBanner.js
    await expect(declineButton).toBeFocused();

    // 3. Test forward tabbing (Tab key) through the main interactive elements
    await page.keyboard.press('Tab');
    await expect(acceptButton).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(showDetailsButton).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(functionalityToggle).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(statisticsToggle).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(marketingToggle).toBeFocused();

    // 4. Test forward wrap-around. The focus trap sends focus to the *very first*
    // focusable element in the DOM, which is the "Cookie Information" link.
    await page.keyboard.press('Tab');
    await expect(cookieInfoLink).toBeFocused();

    // 5. Test backward wrap-around from the first element (the link) to the last (marketing toggle)
    await page.keyboard.press('Shift+Tab');
    await expect(marketingToggle).toBeFocused();
  });

  test('should not close when the Escape key is pressed', async ({ page }) => {
    const banner = page.locator('#coi-banner-wrapper');
    await expect(banner).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(banner).toBeVisible();
  });
});