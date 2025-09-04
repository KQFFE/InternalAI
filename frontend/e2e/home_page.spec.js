// frontend/e2e/home_page.spec.js
import { test, expect } from './test-fixtures.js';

/**
 * Centralized locators (aligned with admin_panel.spec.js style).
 * Prefer role-based queries and stable text where no data-testid exists.
 */
const LOCATORS = {
    // Header / Navigation
    adminButtonName: 'Admin',
    navServicesName: 'Services',
    navContactName: 'Contact',

    // Hero
    heroHeadingName: /shaping a better future with code/i,
    heroSubheadingText:
        'We are a digitalization company that develops solutions and services for a better tomorrow.',
    readMoreButton: '#team-button', // currently disabled in UI
    licenseButton: '#license-button',

    // News section
    newsRegionLabel: 'Latest news',
    newsHeadingName: 'News',

    // Footer
    footer: 'footer.site-footer',
    linkedinLinkName: 'Follow us on LinkedIn',
    linkedinHref: 'https://www.linkedin.com/company/knowit',
};

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
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

    // Skipped per request (button is currently disabled; re-enable when flow exists)
    test.skip('should navigate to the Team Page when "Read more" button is clicked', async ({ page }) => {
        const teamButton = page.locator(LOCATORS.readMoreButton);
        await teamButton.click();

        await expect(page).toHaveURL(/\/team\/?$/);
        const teamPageHeading = page.getByRole('heading', { name: 'Our Amazing Team' });
        await expect(teamPageHeading).toBeVisible();
    });

    // Already skipped in original spec until feature exists—keeping consistent behavior
    test.skip('should navigate to the License Page when "License Management" button is clicked', async ({ page }) => {
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

    test('should have a visible footer with social media links', async ({ page }) => {
        const footer = page.locator(LOCATORS.footer);
        await expect(footer).toBeVisible();

        const linkedinLink = page.getByRole('link', { name: LOCATORS.linkedinLinkName });
        await expect(linkedinLink).toHaveAttribute('href', LOCATORS.linkedinHref);
    });
});
