// e2e/home_page.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Home Page (Landing Page) tests', () => {

    // Test 1: Verify the cookie consent modal on initial load
    test('should display the cookie consent modal on first visit', async ({ page }) => {
        await page.evaluate(() => localStorage.clear());
        await page.goto('/');

        // Expect the cookie modal to be visible
        const cookieModal = page.locator('.cookie-modal');
        await expect(cookieModal).toBeVisible();

        // Check for key elements within the modal using new IDs
        await expect(cookieModal.locator('#cookie-modal-title')).toHaveText('We use cookies');
        await expect(cookieModal.locator('#accept-all-cookies')).toBeVisible();
        await expect(cookieModal.locator('#deny-all-cookies')).toBeVisible();
        await expect(cookieModal.locator('#save-cookie-preferences')).toBeVisible();
        await expect(cookieModal.locator('#show-cookie-details')).toBeVisible();
    });

    // Test 2: Verify that accepting cookies hides the modal
    test('should hide cookie modal after accepting all cookies', async ({ page }) => {
        await page.evaluate(() => localStorage.clear());
        await page.goto('/');

        const cookieModal = page.locator('.cookie-modal');
        await expect(cookieModal).toBeVisible();

        await page.locator('#accept-all-cookies').click();

        await expect(cookieModal).toBeHidden();

        const consent = await page.evaluate(() => localStorage.getItem('cookieConsent'));
        expect(consent).toBe('accepted');
    });

    // Test 3: Verify that denying cookies hides the modal
    test('should hide cookie modal after denying all cookies', async ({ page }) => {
        await page.evaluate(() => localStorage.clear());
        await page.goto('/');

        const cookieModal = page.locator('.cookie-modal');
        await expect(cookieModal).toBeVisible();

        await page.locator('#deny-all-cookies').click();

        await expect(cookieModal).toBeHidden();

        const consent = await page.evaluate(() => localStorage.getItem('cookieConsent'));
        expect(consent).toBe('denied');
    });

    // Test 4: Verify saving preferences hides the modal
    test('should hide cookie modal after saving preferences', async ({ page }) => {
        await page.evaluate(() => localStorage.clear());
        await page.goto('/');

        const cookieModal = page.locator('.cookie-modal');
        await expect(cookieModal).toBeVisible();

        // Interact with some checkboxes
        await page.locator('#statistics-cookies').check();

        await page.locator('#save-cookie-preferences').click();

        await expect(cookieModal).toBeHidden();
        const consent = await page.evaluate(() => localStorage.getItem('cookieConsent'));
        expect(consent).toBe('custom');
    });

    // Test 5: Verify modal does not appear if consent already given
    test('should NOT display the cookie consent modal if consent already given', async ({ page }) => {
        await page.goto('/');

        await page.evaluate(() => {
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('functionalityCookies', 'true');
            localStorage.setItem('statisticsCookies', 'true');
            localStorage.setItem('marketingCookies', 'true');
        });

        await page.reload();

        await expect(page.locator('.cookie-modal')).toBeHidden();
    });

    // Before each test in this block, ensure cookies are accepted
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        const cookieModal = page.locator('.cookie-modal');
        if (await cookieModal.isVisible()) {
            await page.locator('#accept-all-cookies').click();
            await expect(cookieModal).toBeHidden({ timeout: 15000 });
        }
    });

    test('should display the main hero section title', async ({ page }) => {
        await expect(page.locator('#main-heading')).toBeVisible();
        await expect(page.locator('#main-heading')).toHaveText('Shaping a better future with code');
    });

    test('should display the main hero section subtitle', async ({ page }) => {
        await expect(page.locator('#main-subtitle')).toBeVisible();
        await expect(page.locator('#main-subtitle')).toHaveText('We are a digitalization company that develops solutions and services.');
    });

    test('should display the Knowit logo', async ({ page }) => {
        const logo = page.locator('#main-logo');
        await expect(logo).toBeVisible();
        await expect(logo).toHaveAttribute('src', '/knowit-logo.png');
        await expect(logo).toHaveAttribute('alt', 'Knowit company logo');
    });

    test('should contain main navigation links and Home link should be active/correct', async ({ page }) => {
        // More robust cookie modal handling
        const cookieModal = page.locator('.cookie-modal');
        if (await cookieModal.isVisible()) {
            await page.locator('#accept-all-cookies').click();
            // Wait for modal to be actually removed from DOM
            await expect(cookieModal).toBeHidden({ timeout: 15000 });
        }

        // Wait for navigation to be ready
        await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();

        // Test navigation links
        await expect(page.locator('#nav-home')).toBeVisible();
        await expect(page.locator('#nav-services')).toBeVisible();
        await expect(page.locator('#nav-about')).toBeVisible();
        await expect(page.locator('#nav-contact')).toBeVisible();

        // Since we're already on the home page, just verify we stay on home
        await page.locator('#nav-home').click();
        await expect(page).toHaveURL('/');
    });

    test('should navigate to /team page when team button is clicked', async ({ page }) => {
        // Use the existing dismissCookieModal function
        await dismissCookieModal(page);

        // Wait for the team button to be clickable
        await expect(page.locator('#team-button')).toBeVisible();

        // Now click the team button
        await page.locator('#team-button').click();
        await expect(page).toHaveURL('/team');
        await expect(page.locator('h1')).toHaveText('Our Amazing Team');
    });

    async function dismissCookieModal(page) {
        const cookieModal = page.locator('.cookie-modal');
        if (await cookieModal.isVisible()) {
            await page.locator('#accept-all-cookies').click();
            await expect(cookieModal).toBeHidden({ timeout: 15000 });
        }
    }

    test('should navigate to /license page when license button is clicked', async ({ page }) => {
        await dismissCookieModal(page);
        await page.locator('#license-button').click();
        await expect(page).toHaveURL('/license');
    });

    test('should display company highlights section', async ({ page }) => {
        await expect(page.locator('#company-highlights')).toBeVisible();
        await expect(page.locator('#customer-experience-highlight')).toBeVisible();
        await expect(page.locator('#innovation-highlight')).toBeVisible();
    });

    test('should display gradient box titles correctly', async ({ page }) => {
        const customerTitle = page.locator('#customer-experience-highlight .gradient-box-title');
        const innovationTitle = page.locator('#innovation-highlight .gradient-box-title');

        await expect(customerTitle).toHaveText('We create unique customer experiences');
        await expect(innovationTitle).toHaveText('Innovation through collaboration');
    });

    test('should display news section heading and news items', async ({ page }) => {
        await expect(page.locator('#news-heading')).toBeVisible();
        await expect(page.locator('#news-heading')).toHaveText('News');
        await expect(page.locator('#news-item-1')).toBeVisible();
        await expect(page.locator('#news-item-2')).toBeVisible();
    });

    test('news items should have correct dates and titles', async ({ page }) => {
        // Check first news item
        const firstNewsItem = page.locator('#news-item-1');
        await expect(firstNewsItem.locator('time')).toHaveAttribute('datetime', '2025-06-26');
        await expect(firstNewsItem.locator('.news-item-meta-bold')).toHaveText(' Summer Project 2025');
        await expect(firstNewsItem.locator('.news-item-title')).toContainText('Kristoffer, Sasan, Sakshi and Johanna is creating a landing page and automating a process, by using AI for everything.');

        // Check second news item
        const secondNewsItem = page.locator('#news-item-2');
        await expect(secondNewsItem.locator('time')).toHaveAttribute('datetime', '2025-07-01');
        await expect(secondNewsItem.locator('.news-item-meta-bold')).toHaveText(' Summer Project 2025');
        await expect(secondNewsItem.locator('.news-item-title')).toContainText('The team request earlier vacation leave due to information overflow');
    });

    test('should display "More news" link in the news section', async ({ page }) => {
        const moreNewsLink = page.locator('#more-news-link');
        await expect(moreNewsLink).toBeVisible();
        await expect(moreNewsLink).toHaveText(/More news/);
        await expect(moreNewsLink).toHaveAttribute('type', 'button');
        await expect(moreNewsLink).toHaveAttribute('aria-label', 'View all news articles')
    });

    test('should display footer content with contact information', async ({ page }) => {
        const footer = page.locator('footer[role="contentinfo"]');
        await expect(footer).toBeVisible();
        await expect(footer.locator('.become-one-of-us-heading')).toHaveText('Become one of us');
        await expect(footer.locator('.footer-column-heading:has-text("CONTACT")')).toBeVisible();
        await expect(footer.locator('text=Box 3390, SE-103 68 Stockholm')).toBeVisible();
        await expect(footer.locator('#contact-email')).toBeVisible();
    });

    test('should display footer bottom links and copyright', async ({ page }) => {
        const footerBottomRow = page.locator('.footer-bottom-row');
        await expect(footerBottomRow).toBeVisible();
        await expect(footerBottomRow.locator('#footer-cookies')).toBeVisible();
        await expect(footerBottomRow.locator('#footer-linkedin')).toBeVisible();
        await expect(footerBottomRow.locator('#footer-copyright')).toHaveText('© 2023 Knowit AB');
    });

    test('footer social media links should point to correct URLs', async ({ page }) => {
        await expect(page.locator('#footer-linkedin')).toHaveAttribute('href', 'https://www.linkedin.com/company/knowit/');
        await expect(page.locator('#footer-facebook')).toHaveAttribute('href', 'https://www.facebook.com/weareknowit');
        await expect(page.locator('#footer-instagram')).toHaveAttribute('href', 'https://www.instagram.com/weareknowit/');
    });

    test('should have proper accessibility attributes', async ({ page }) => {
        // Check main navigation has proper aria-label
        await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();

        // Check main button has proper aria-label
        await expect(page.locator('#team-button')).toHaveAttribute('aria-label', 'Read more about our team');

        // Check footer has proper role
        await expect(page.locator('footer[role="contentinfo"]')).toBeVisible();

        // Check contact information is in address element
        await expect(page.locator('#footer-contact address')).toBeVisible();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
        // Check main heading is h1
        await expect(page.locator('h1#main-heading')).toBeVisible();

        // Check gradient box titles are h2
        await expect(page.locator('#customer-experience-highlight h2.gradient-box-title')).toBeVisible();
        await expect(page.locator('#innovation-highlight h2.gradient-box-title')).toBeVisible();

        // Check news heading is h2
        await expect(page.locator('h2#news-heading')).toBeVisible();

        // Check news item titles are h3
        await expect(page.locator('#news-item-1 h3.news-item-title')).toBeVisible();
        await expect(page.locator('#news-item-2 h3.news-item-title')).toBeVisible();
    });

});