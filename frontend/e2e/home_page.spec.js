import { test, expect } from '@playwright/test';

test.describe('Home Page (Landing Page) tests', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the home page first. This is crucial for localStorage access.
    await page.goto('/');

    // 2. Clear localStorage and cookies for a clean state.
    await page.evaluate(() => window.localStorage.clear());
    await page.context().clearCookies();

    // 3. Reload the page to ensure the cookie banner reappears after clearing localStorage.
    await page.reload();

    // 4. Explicitly wait for the cookie banner to be visible and accept all cookies.
    const acceptAllCookiesButton = page.locator('.coi-banner__accept', { hasText: 'Godkänn alla' });
    await expect(acceptAllCookiesButton).toBeVisible({ timeout: 15000 }); // Increased timeout for banner visibility
    await acceptAllCookiesButton.click();

    // 5. Wait for the cookie banner to disappear to ensure it's no longer intercepting clicks.
    await expect(page.locator('#coiOverlay')).not.toBeVisible({ timeout: 10000 });
  });

  test('should contain page title and hero section content', async ({ page }) => {
    // Update the expected title to match the actual title from your application.
    await expect(page).toHaveTitle('InternalAI - Building the Future with AI');

    // Assertions for main heading and subheading
    await expect(page.locator('#main-heading')).toContainText('Shaping a better future with code');
    await expect(page.locator('#main-subtitle')).toContainText('We are a digitalization company that develops solutions and services.');
  });

  test('should contain main navigation links and Home link should be active/correct', async ({ page }) => {
    // Target all main navigation links and buttons within the 'main-nav-list' class.
    // Both <Link> (rendering as <a>) and <button> elements have the 'main-nav-link' class.
    const mainNavLinks = page.locator('nav.main-nav-list .main-nav-link');
    await expect(mainNavLinks).toHaveCount(6); // Now it should correctly find all 6 elements.

    await expect(page.locator('nav.main-nav-list a[href="/"]')).toHaveText('Home');
    await expect(page.locator('nav.main-nav-list a[href="/team"]')).toHaveText('Team');
    await expect(page.locator('nav.main-nav-list a[href="/license"]')).toHaveText('License');
  });

  test('should navigate to /team page when team button is clicked', async ({ page }) => {
    await page.locator('#team-button').click();
    await expect(page).toHaveURL('http://localhost:3000/team');
  });

  test('should navigate to /license page when license button is clicked', async ({ page }) => {
    await page.locator('#license-button').click();
    await expect(page).toHaveURL('http://localhost:3000/license');
  });
});
