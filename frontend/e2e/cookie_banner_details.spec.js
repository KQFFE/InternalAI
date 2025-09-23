import { test, expect } from '@playwright/test';

const LOCATORS = {
  heading: 'heading[name="Vi använder cookies"]',
  descriptionText: 'text=Knowit.se använder cookies för att analysera trafiken på vår webbplats.',
  denyAllButton: 'button[name="Neka alla"]',
  acceptAllButton: 'button[name="Godkänn alla"]',
  showDetailsButton: 'button[name="Visa detaljer"]',
  readMoreButton: 'button[name="Läs mer om cookies"]',
  detailsContainer: '#coiConsentBannerCategoriesWrapper',
  necessaryCategoryHeading: 'heading[name="Nödvändiga"]',
  necessaryCheckbox: '#cookie_cat_necessary',
  hideDetailsButton: 'button[name="Dölj detaljer"]',
  policyHeading: 'heading[name="Policy för kakor"]',
  settingsButton: 'button[name="Inställningar"]',
  cookieBannerContainer: '[data-testid="cookie-banner-container"]',
  acceptAllCookiesTestId: '[data-testid="accept-all-cookies"]',
  declineAllCookiesTestId: '[data-testid="decline-all-cookies"]',
  functionalCookieCheckbox: '#cookie_cat_functional',
  saveCookiePreferencesTestId: '[data-testid="save-cookie-preferences"]',
};

test.describe('Cookie Banner Content and Functionality', () => {  
  test('should display the correct initial content', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole(LOCATORS.heading.split('[')[0], { name: 'Vi använder cookies' })).toBeVisible();
    await expect(page.getByText('Knowit.se använder cookies för att analysera trafiken på vår webbplats.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Neka alla' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Godkänn alla' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Visa detaljer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Läs mer om cookies' })).toBeVisible();
  });

  test('should show and hide details', async ({ page }) => {
    await page.goto('/');
    const showDetailsButton = page.getByRole('button', { name: 'Visa detaljer' });
    await showDetailsButton.click();

    // Verify the details container is now visible
    const detailsContainer = page.locator(LOCATORS.detailsContainer);
    await expect(detailsContainer).toBeVisible();

    // Verify a category heading is visible within the details
    await expect(page.getByRole(LOCATORS.necessaryCategoryHeading.split('[')[0], { name: 'Nödvändiga' })).toBeVisible();

    const necessaryCheckbox = page.locator(LOCATORS.necessaryCheckbox);
    await expect(necessaryCheckbox).toBeChecked();
    await expect(necessaryCheckbox).toBeDisabled();

    await page.getByRole('button', { name: 'Dölj detaljer' }).click();
    await expect(detailsContainer).not.toBeVisible();
  });

  test('should show and hide cookie policy', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Läs mer om cookies' }).click();
    await expect(page.getByRole(LOCATORS.policyHeading.split('[')[0], { name: 'Policy för kakor' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Inställningar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Godkänn alla' })).toBeVisible();

    await page.getByRole('button', { name: 'Inställningar' }).click();
    await expect(page.getByRole(LOCATORS.heading.split('[')[0], { name: 'Vi använder cookies' })).toBeVisible();
  });

  test('should handle cookie preferences', async ({ page }) => {
    // Use an init script to create a communication bridge. This script runs *before*
    // any page scripts, guaranteeing that `window.playwrightCallbacks` exists
    // when the React component mounts.
    // Instead of console.log, we use fetch to a unique URL, which is more reliable to wait for.
    await page.addInitScript(() => {
      window.playwrightCallbacks = {
        onAcceptAll: () => fetch('/test-callback/onAcceptAll'),
        onDeclineAll: () => fetch('/test-callback/onDeclineAll'),
        onSavePreferences: () => fetch('/test-callback/onSavePreferences'),
      };
    });

    // --- Test Accept All ---
    await page.goto('/');
    await expect(page.locator(LOCATORS.cookieBannerContainer)).toBeVisible();
    await Promise.all([
      page.waitForRequest(req => req.url().includes('/test-callback/onAcceptAll')),
      page.locator(LOCATORS.acceptAllCookiesTestId).click(),
    ]);

    // --- Test Decline All ---
    await page.goto('/');
    await expect(page.locator(LOCATORS.cookieBannerContainer)).toBeVisible();
    await Promise.all([
      page.waitForRequest(req => req.url().includes('/test-callback/onDeclineAll')),
      page.locator(LOCATORS.declineAllCookiesTestId).click(),
    ]);

    // --- Test Save Preferences ---
    await page.goto('/');
    await expect(page.locator(LOCATORS.cookieBannerContainer)).toBeVisible();
    await page.getByRole('button', { name: 'Visa detaljer' }).click();

    await page.locator(LOCATORS.functionalCookieCheckbox).click();
    await expect(page.locator(LOCATORS.saveCookiePreferencesTestId)).toBeVisible();

    await Promise.all([
      page.waitForRequest(req => req.url().includes('/test-callback/onSavePreferences')),
      page.locator(LOCATORS.saveCookiePreferencesTestId).click(),
    ]);
  });

  test('should collapse expanded category when details are hidden and re-shown', async ({ page }) => {
    await page.goto('/');
    const showDetailsButton = page.getByRole('button', { name: 'Visa detaljer' });
    await showDetailsButton.click();

    // Expand a cookie category
    const functionalCategoryButton = page.getByRole('button', { name: /funktionella/i });
    await functionalCategoryButton.click();

    // Check for category content
    const categoryDescription = page.getByText(/Funktionella cookies gör det möjligt att spara uppgifter/i);
    await expect(categoryDescription).toBeVisible();
    
    const optimizelyService = page.getByText('Optimizely', { exact: true });
    await expect(optimizelyService).toBeVisible();

    // Hide details
    const hideDetailsButton = page.getByRole('button', { name: 'Dölj detaljer' });
    await hideDetailsButton.click();

    // Verify the details are hidden
    await expect(optimizelyService).not.toBeVisible();

    // Show details again
    const showDetailsAgainButton = page.getByRole('button', { name: 'Visa detaljer' });
    await showDetailsAgainButton.click();

    // The content of the previously expanded category should not be visible
    await expect(page.getByText('Optimizely', { exact: true })).not.toBeVisible();
  });

  test('should show cookie details when a category is expanded and collapse others', async ({ page }) => {
    await page.goto('/');
    const showDetailsButton = page.getByRole('button', { name: 'Visa detaljer' });
    await showDetailsButton.click();

    // Expand the 'Funktionella' category
    const functionalCategoryButton = page.getByRole('button', { name: /funktionella/i });
    await functionalCategoryButton.click();

    // Check that a cookie from that category is now visible
    const optimizelyService = page.getByText('Optimizely', { exact: true });
    await expect(optimizelyService).toBeVisible();

    // Expand the 'Marketing' category, which should collapse 'Funktionella'
    const marketingCategoryButton = page.getByRole('button', { name: /marketing/i });
    await marketingCategoryButton.click();

    // Check that 'Optimizely' is no longer visible
    await expect(optimizelyService).not.toBeVisible();

    // Check that a cookie from the 'Marketing' category is now visible
    const hubspotService = page.getByText('HubSpot', { exact: true });
    await expect(hubspotService.first()).toBeVisible();
  });
});