/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';

const COOKIE_BANNER_LOCATORS = {
    heading: 'Vi använder cookies',
    descriptionText: 'Knowit.se använder cookies för att analysera trafiken på vår webbplats.',
    denyAllButton: 'Neka alla',
    acceptAllButton: /Godkänn alla|Accept All/i,
    showDetailsButton: 'Visa detaljer',
    readMoreButton: 'Läs mer om cookies',
    detailsContainer: '#coiConsentBannerCategoriesWrapper',
    necessaryCategoryHeading: 'Nödvändiga',
    necessaryCheckbox: '#cookie_cat_necessary',
    hideDetailsButton: 'Dölj detaljer',
    policyHeading: 'Policy för kakor',
    settingsButton: 'Inställningar',
    cookieBannerContainer: '[data-testid="cookie-banner-container"]',
    acceptAllCookiesTestId: '[data-testid="accept-all-cookies"]',
    declineAllCookiesTestId: '[data-testid="decline-all-cookies"]',
    functionalCookieCheckbox: '#cookie_cat_functional',
    saveCookiePreferencesTestId: '[data-testid="save-cookie-preferences"]',
    functionalCategoryButton: /funktionella/i,
    marketingCategoryButton: /marketing/i,
    categoryDescription: /Funktionella cookies gör det möjligt att spara uppgifter/i,
    optimizelyService: 'Optimizely',
    hubspotService: 'HubSpot',
    cookieInfoLink: 'Cookie Information',
    statisticsToggle: '#cookie_cat_statistic',
    marketingToggle: '#cookie_cat_marketing',
    banner: '#coi-banner-wrapper',
};

test.describe('Cookie Banner Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should trap focus within the cookie banner', async ({ page }) => {
    const cookieInfoLink = page.getByRole('link', { name: 'Cookie Information' });
    const declineButton = page.getByTestId('decline-all-cookies');
    const acceptButton = page.getByTestId('accept-all-cookies');
    const showDetailsButton = page.getByRole('button', { name: 'Visa detaljer' });
    const functionalityToggle = page.locator(COOKIE_BANNER_LOCATORS.functionalCookieCheckbox);
    const statisticsToggle = page.locator(COOKIE_BANNER_LOCATORS.statisticsToggle);
    const marketingToggle = page.locator(COOKIE_BANNER_LOCATORS.marketingToggle);

    await expect(declineButton).toBeFocused();

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

    await page.keyboard.press('Tab');
    await expect(cookieInfoLink).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(marketingToggle).toBeFocused();
  });

  test('should not close when the Escape key is pressed', async ({ page }) => {
    const banner = page.locator(COOKIE_BANNER_LOCATORS.banner);
    await expect(banner).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(banner).toBeVisible();
  });
});

test.describe('Cookie Banner Content and Functionality', () => {
  test('should display the correct initial content', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: COOKIE_BANNER_LOCATORS.heading })).toBeVisible();
    await expect(page.getByText(COOKIE_BANNER_LOCATORS.descriptionText)).toBeVisible();
    await expect(page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.denyAllButton })).toBeVisible();
    await expect(page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.acceptAllButton })).toBeVisible();
    await expect(page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.showDetailsButton })).toBeVisible();
    await expect(page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.readMoreButton })).toBeVisible();
  });

  test('should show and hide details', async ({ page }) => {
    await page.goto('/');
    const showDetailsButton = page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.showDetailsButton });
    await showDetailsButton.click();

    const detailsContainer = page.locator(COOKIE_BANNER_LOCATORS.detailsContainer);
    await expect(detailsContainer).toBeVisible();

    await expect(page.getByRole('heading', { name: COOKIE_BANNER_LOCATORS.necessaryCategoryHeading })).toBeVisible();

    const necessaryCheckbox = page.locator(COOKIE_BANNER_LOCATORS.necessaryCheckbox);
    await expect(necessaryCheckbox).toBeChecked();
    await expect(necessaryCheckbox).toBeDisabled();

    await page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.hideDetailsButton }).click();
    await expect(detailsContainer).not.toBeVisible();
  });

  test('should show and hide cookie policy', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.readMoreButton }).click();
    await expect(page.getByRole('heading', { name: COOKIE_BANNER_LOCATORS.policyHeading })).toBeVisible();
    await expect(page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.settingsButton })).toBeVisible();
    await expect(page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.acceptAllButton })).toBeVisible();

    await page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.settingsButton }).click();
    await expect(page.getByRole('heading', { name: COOKIE_BANNER_LOCATORS.heading })).toBeVisible();
  });

  test('should handle cookie preferences', async ({ page }) => {
    await page.addInitScript(() => {
      window.playwrightCallbacks = {
        onAcceptAll: () => fetch('/test-callback/onAcceptAll'),
        onDeclineAll: () => fetch('/test-callback/onDeclineAll'),
        onSavePreferences: () => fetch('/test-callback/onSavePreferences'),
      };
    });

    await page.goto('/');
    await expect(page.locator(COOKIE_BANNER_LOCATORS.cookieBannerContainer)).toBeVisible();
    await Promise.all([
      page.waitForRequest(req => req.url().includes('/test-callback/onAcceptAll')),
      page.locator(COOKIE_BANNER_LOCATORS.acceptAllCookiesTestId).click(),
    ]);

    await page.goto('/');
    await expect(page.locator(COOKIE_BANNER_LOCATORS.cookieBannerContainer)).toBeVisible();
    await Promise.all([
      page.waitForRequest(req => req.url().includes('/test-callback/onDeclineAll')),
      page.locator(COOKIE_BANNER_LOCATORS.declineAllCookiesTestId).click(),
    ]);

    await page.goto('/');
    await expect(page.locator(COOKIE_BANNER_LOCATORS.cookieBannerContainer)).toBeVisible();
    await page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.showDetailsButton }).click();

    await page.locator(COOKIE_BANNER_LOCATORS.functionalCookieCheckbox).click();
    await expect(page.locator(COOKIE_BANNER_LOCATORS.saveCookiePreferencesTestId)).toBeVisible();

    await Promise.all([
      page.waitForRequest(req => req.url().includes('/test-callback/onSavePreferences')),
      page.locator(COOKIE_BANNER_LOCATORS.saveCookiePreferencesTestId).click(),
    ]);
  });

  test('should collapse expanded category when details are hidden and re-shown', async ({ page }) => {
    await page.goto('/');
    const showDetailsButton = page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.showDetailsButton });
    await showDetailsButton.click();

    const functionalCategoryButton = page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.functionalCategoryButton });
    await functionalCategoryButton.click();

    const categoryDescription = page.getByText(COOKIE_BANNER_LOCATORS.categoryDescription);
    await expect(categoryDescription).toBeVisible();
    
    const optimizelyService = page.getByText(COOKIE_BANNER_LOCATORS.optimizelyService, { exact: true });
    await expect(optimizelyService).toBeVisible();

    const hideDetailsButton = page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.hideDetailsButton });
    await hideDetailsButton.click();

    await expect(optimizelyService).not.toBeVisible();

    const showDetailsAgainButton = page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.showDetailsButton });
    await showDetailsAgainButton.click();

    await expect(page.getByText(COOKIE_BANNER_LOCATORS.optimizelyService, { exact: true })).not.toBeVisible();
  });

  test('should show cookie details when a category is expanded and collapse others', async ({ page }) => {
    await page.goto('/');
    const showDetailsButton = page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.showDetailsButton });
    await showDetailsButton.click();

    const functionalCategoryButton = page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.functionalCategoryButton });
    await functionalCategoryButton.click();

    const optimizelyService = page.getByText(COOKIE_BANNER_LOCATORS.optimizelyService, { exact: true });
    await expect(optimizelyService).toBeVisible();

    const marketingCategoryButton = page.getByRole('button', { name: COOKIE_BANNER_LOCATORS.marketingCategoryButton });
    await marketingCategoryButton.click();

    await expect(optimizelyService).not.toBeVisible();

    const hubspotService = page.getByText(COOKIE_BANNER_LOCATORS.hubspotService, { exact: true });
    await expect(hubspotService.first()).toBeVisible();
  });
});

const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

test.describe('Cookie Banner Persistence', () => {
  test('should save "accept all" preferences and not show banner on subsequent visit', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator(COOKIE_BANNER_LOCATORS.cookieBannerContainer)).toBeVisible();

    await page.locator(COOKIE_BANNER_LOCATORS.acceptAllCookiesTestId).click();

    await expect(page.locator(COOKIE_BANNER_LOCATORS.cookieBannerContainer)).not.toBeVisible();

    const savedPrefs = await page.evaluate(
      (key) => localStorage.getItem(key),
      COOKIE_PREFERENCES_KEY
    );
    expect(JSON.parse(savedPrefs)).toEqual({
      functional: true,
      statistic: true,
      marketing: true,
    });

    await page.reload();

    await expect(page.locator(COOKIE_BANNER_LOCATORS.cookieBannerContainer)).not.toBeVisible();

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