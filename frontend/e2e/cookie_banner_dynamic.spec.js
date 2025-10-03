import { test, expect } from './test-fixtures.js';

test.describe('Cookie Banner with Dynamic Data', () => {
  test('should display cookie information from dynamic script', async ({ page }) => {
    // Use addInitScript to inject the mock object before any page scripts run
    await page.addInitScript(`
      window.CookieInformation = {
        getConsent: () => ({
          cookies: [
            { type: 'necessary', service: 'Test Service', purpose: 'To test dynamic loading.', privacyPolicy: '#', expiry: 'Session', name: 'test_cookie_1', provider: 'Test Provider' },
            { type: 'functional', service: 'Another Service', purpose: 'Another test.', privacyPolicy: '#', expiry: '1 year', name: 'test_cookie_2', provider: 'Another Provider' },
          ]
        }),
        getCookieCategories: () => Promise.resolve([
          { name: 'necessary', label: 'Nödvändiga (Dynamisk)', description: 'Dynamiskt laddade nödvändiga cookies.', isMutable: false },
          { name: 'functional', label: 'Funktionella (Dynamisk)', description: 'Dynamiskt laddade funktionella cookies.', isMutable: true },
        ])
      };
    `);

    // 1. Go to the page first
    await page.goto('/');

    // 2. Now clear localStorage for the current page
    await page.evaluate(() => window.localStorage.clear());

    // 3. Reload the page so the CookieConsentProvider re-evaluates the storage
    await page.reload();

    // Wait for the banner to be visible
    const banner = page.locator('[data-testid="cookie-banner-container"]');
    await expect(banner).toBeVisible();

    // Check for the dynamically loaded category label
    await expect(page.getByText('Nödvändiga (Dynamisk)')).toBeVisible();
    await expect(page.getByText('Funktionella (Dynamisk)')).toBeVisible();

    // Open the details to check for the cookie
    await page.getByRole('button', { name: 'Visa detaljer' }).click();

    // Expand the necessary category to see the cookie details
    await page.getByRole('button', { name: 'Nödvändiga (Dynamisk)' }).click();

    // Check for the dynamically loaded cookie service and purpose
    await expect(page.getByText('Test Service', { exact: true })).toBeVisible();
    await expect(page.getByText('To test dynamic loading.')).toBeVisible();
  });
});