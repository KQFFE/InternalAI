import { test, expect } from './test-fixtures.js';

// Centralized locators for better maintainability and readability
const LOCATORS = {
    // Hero Section
    heroHeadingName: /shaping a better future with code/i,
    heroSubheadingText: 'We are a digitalization company that develops solutions and services for a better tomorrow.',
    teamButton: 'button[data-testid="team-button"]', // More specific selector
    licenseButton: 'button[data-testid="license-button"]', // More specific selector

    // Highlights Section
    customerExperienceHighlight: '[data-testid="customer-experience-highlight"]',
    innovationHighlight: '[data-testid="innovation-highlight"]',

    // News Section
    newsRegionLabel: 'Latest news',
    newsHeadingName: 'News',
    newsItem1: '[data-testid="news-item-1"]',
    newsItem2: '[data-testid="news-item-2"]',
    moreNewsButton: '[data-testid="more-news-button"]',

    // Footer
    footer: 'footer',
    linkedinLinkName: 'Follow us on LinkedIn',
    linkedinHref: 'https://www.linkedin.com/company/knowit', // Updated to match the footer link
};

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Cookie banner is handled automatically by the test fixture
    });

    test('should display the main hero content', async ({ page }) => {
        await expect(page).toHaveTitle(/InternalAI/i);

        const heroHeading = page.getByRole('heading', {
            level: 1,
            name: LOCATORS.heroHeadingName,
        });
        await expect(heroHeading).toBeVisible();

        const heroSubheading = page.getByText(LOCATORS.heroSubheadingText);
        await expect(heroSubheading).toBeVisible();
    });

    test('should have a disabled team button with the correct tooltip', async ({ page }) => {
        const teamButton = page.locator(LOCATORS.teamButton);
        // The button should be disabled as per HomePageContent.js
        await expect(teamButton).toBeDisabled();
        // Verify the tooltip that explains why it's disabled
        await expect(teamButton).toHaveAttribute('title', 'Login as admin to access team information');
    });

    test('should navigate to the License Page when "License Management" button is clicked', async ({ page }) => {
        const licenseButton = page.locator(LOCATORS.licenseButton);
        await licenseButton.click();
        await expect(page).toHaveURL(/\/license\/?$/);
        const licensePageHeading = page.getByRole('heading', { name: 'License Page' });
        await expect(licensePageHeading).toBeVisible();
    });

    test('should have a visible news section', async ({ page }) => {
        const newsSection = page.getByRole('region', { name: LOCATORS.newsRegionLabel });
        await expect(newsSection).toBeVisible();

        const newsHeading = page.getByRole('heading', { name: LOCATORS.newsHeadingName });
        await expect(newsHeading).toHaveText(LOCATORS.newsHeadingName);
    });

    test('should display news items and a "More news" button', async ({ page }) => {
        // Verify that the news items are visible and have the correct links (as they are anchor tags)
        await expect(page.locator(LOCATORS.newsItem1)).toBeVisible();
        await expect(page.locator(LOCATORS.newsItem1)).toHaveAttribute('href', /news\/story-1/);
        await expect(page.locator(LOCATORS.newsItem2)).toBeVisible();
        await expect(page.locator(LOCATORS.newsItem2)).toHaveAttribute('href', /news\/story-2/);
        await expect(page.locator(LOCATORS.moreNewsButton)).toBeVisible();
    });

    test('should have a visible footer with social media links', async ({ page }) => {
        const footer = page.locator(LOCATORS.footer).first(); // Use .first() if multiple footers exist
        await expect(footer).toBeVisible();

        const linkedinLink = page.getByRole('link', { name: LOCATORS.linkedinLinkName });
        await expect(linkedinLink).toHaveAttribute('href', LOCATORS.linkedinHref);
    });
});
