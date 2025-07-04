// e2e/home_page.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Home Page (Landing Page) tests', () => {

  // Test 1: Verify the cookie consent modal on initial load
  test('should display the cookie consent modal on first visit', async ({ page }) => {
    // It's okay to clear on about:blank as it's just clearing the browser's storage for that ephemeral page.
    await page.evaluate(() => localStorage.clear()); 
    await page.goto('/'); // Navigate to the homepage

    // Expect the cookie modal to be visible
    const cookieModal = page.locator('.cookie-modal');
    await expect(cookieModal).toBeVisible();

    // Check for key elements within the modal
    await expect(cookieModal.locator('.cookie-modal-title')).toHaveText('This website uses cookies');
    await expect(cookieModal.getByRole('button', { name: 'Accept all' })).toBeVisible();
    await expect(cookieModal.getByRole('button', { name: 'Deny all' })).toBeVisible();
    await expect(cookieModal.getByRole('button', { name: 'Save preferences' })).toBeVisible();
    await expect(cookieModal.getByRole('button', { name: 'Show details' })).toBeVisible();
  });

  // Test 2: Verify that accepting cookies hides the modal
  test('should hide cookie modal after accepting all cookies', async ({ page }) => {
    await page.evaluate(() => localStorage.clear()); // Ensure fresh state
    await page.goto('/');

    const cookieModal = page.locator('.cookie-modal');
    await expect(cookieModal).toBeVisible();

    await page.getByRole('button', { name: 'Accept all' }).click();

    // Expect the modal to be hidden
    await expect(cookieModal).toBeHidden();

    // Optionally, verify local storage state
    const consent = await page.evaluate(() => localStorage.getItem('cookieConsent'));
    expect(consent).toBe('accepted');
  });

  // Test 3: Verify that denying cookies hides the modal
  test('should hide cookie modal after denying all cookies', async ({ page }) => {
    await page.evaluate(() => localStorage.clear()); // Ensure fresh state
    await page.goto('/');

    const cookieModal = page.locator('.cookie-modal');
    await expect(cookieModal).toBeVisible();

    await page.getByRole('button', { name: 'Deny all' }).click();

    // Expect the modal to be hidden
    await expect(cookieModal).toBeHidden();

    // Optionally, verify local storage state
    const consent = await page.evaluate(() => localStorage.getItem('cookieConsent'));
    expect(consent).toBe('denied');
  });

  // Test 4: Verify saving preferences hides the modal
  test('should hide cookie modal after saving preferences', async ({ page }) => {
    await page.evaluate(() => localStorage.clear()); // Ensure fresh state
    await page.goto('/');

    const cookieModal = page.locator('.cookie-modal');
    await expect(cookieModal).toBeVisible();

    // Interact with some checkboxes if needed for a more thorough test, e.g.:
    // await cookieModal.getByLabel('Statistics cookies').check();

    await page.getByRole('button', { name: 'Save preferences' }).click();

    await expect(cookieModal).toBeHidden();
    const consent = await page.evaluate(() => localStorage.getItem('cookieConsent'));
    expect(consent).toBe('custom');
  });

  // Test 5: Verify modal does not appear if consent already given
  test('should NOT display the cookie consent modal if consent already given', async ({ page }) => {
    // Navigate to the page first to establish the origin
    await page.goto('/');
    
    // Then, set a mock consent in local storage
    await page.evaluate(() => {
      localStorage.setItem('cookieConsent', 'accepted');
      localStorage.setItem('functionalityCookies', 'true');
      localStorage.setItem('statisticsCookies', 'true');
      localStorage.setItem('marketingCookies', 'true');
    });
    
    // Reload the page to ensure the app's useEffect picks up the localStorage change
    await page.reload(); 

    // Expect the cookie modal to NOT be visible
    await expect(page.locator('.cookie-modal')).toBeHidden();
  });

  // --- Main Page Content Tests (assuming cookie modal is dismissed or not present) ---

  // Before each test in this block, ensure cookies are accepted or state is clean
  test.beforeEach(async ({ page }) => {
    // FIX START: Modified this beforeEach block
    // 1. Navigate to your application's base URL
    await page.goto('/');

    // 2. Check if the cookie modal is visible and dismiss it
    const cookieModal = page.locator('.cookie-modal');
    if (await cookieModal.isVisible()) {
      await page.getByRole('button', { name: 'Accept all' }).click();
      // Wait for the modal to be hidden after clicking "Accept all"
      await expect(cookieModal).toBeHidden({ timeout: 15000 }); // Increased timeout for robustness
    }
    // FIX END
  });

  test('should display the main hero section title', async ({ page }) => {
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-title')).toHaveText('Shaping a better future with code');
  });

  test('should display the main hero section subtitle', async ({ page }) => {
    await expect(page.locator('.hero-subtitle')).toBeVisible();
    await expect(page.locator('.hero-subtitle')).toHaveText('We are a digitalization company that develops solutions and services.');
  });

  test('should display the Knowit logo', async ({ page }) => {
    const logo = page.locator('.app-logo-image');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', 'knowit-logo.png');
    await expect(logo).toHaveAttribute('alt', 'Knowit-logo');
  });

  test('should contain main navigation links and Home link should be active/correct', async ({ page }) => {
    await expect(page.locator('.main-nav-list')).toBeVisible();
    await expect(page.locator('.main-nav-link:has-text("Home")')).toBeVisible();
    await expect(page.locator('.main-nav-link:has-text("Services")')).toBeVisible();
    await expect(page.locator('.main-nav-link:has-text("About")')).toBeVisible();
    await expect(page.locator('.main-nav-link:has-text("Contact")')).toBeVisible();

    // Verify the "Home" link navigates to '/'
    await page.locator('.main-nav-link:has-text("Home")').click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate to /team page when "Read more about our team" button is clicked', async ({ page }) => {
    await page.locator('.hero-button:has-text("Read more about our team")').click();
    await expect(page).toHaveURL('/team');
    // This line was already correct based on previous feedback
    await expect(page.locator('h1')).toHaveText('Our Amazing Team'); // Assuming TeamPage has an H1 with this text
  });

  test('should display news section heading and at least two news items', async ({ page }) => {
    await expect(page.locator('.news-heading')).toBeVisible();
    await expect(page.locator('.news-heading')).toHaveText('News');
    await expect(page.locator('.news-item-link')).toHaveCount(2); // Expecting exactly 2 news items
  });

  test('news items should have correct dates and titles', async ({ page }) => {
    // Check first news item
    const firstNewsItem = page.locator('.news-item-link').nth(0);
    await expect(firstNewsItem.locator('.news-item-meta')).toContainText('2025-06-26');
    await expect(firstNewsItem.locator('.news-item-meta-bold')).toHaveText('Summer Project 2025');
    await expect(firstNewsItem.locator('.news-item-title')).toContainText('Kristoffer, Sasan, Sakshi and Johanna is creating a landing page and automating a process, by using AI for everything.');

    // Check second news item
    const secondNewsItem = page.locator('.news-item-link').nth(1);
    await expect(secondNewsItem.locator('.news-item-meta')).toContainText('2025-07-01');
    await expect(secondNewsItem.locator('.news-item-meta-bold')).toHaveText('Summer Project 2025');
    await expect(secondNewsItem.locator('.news-item-title')).toContainText('The team request earlier vacation leave due to information overflow');
  });

  test('should display "More news" link in the news section', async ({ page }) => {
    const moreNewsLink = page.locator('.more-news-link');
    await expect(moreNewsLink).toBeVisible();
    await expect(moreNewsLink).toHaveText(/More news/); // Using regex for "More news" to allow for potential whitespace
    await expect(moreNewsLink).toHaveAttribute('href', '#'); // Check if it's a placeholder link
  });

  test('should display footer content with contact information', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('.become-one-of-us-heading')).toHaveText('Become one of us');
    await expect(footer.locator('.footer-column-heading:has-text("CONTACT")')).toBeVisible();
    await expect(footer.locator('.footer-text:has-text("Box 3390, SE-103 68 Stockholm")')).toBeVisible();
    await expect(footer.locator('a[href="mailto:info@knowit.se"]')).toBeVisible();
  });

  test('should display footer bottom links and copyright', async ({ page }) => {
    const footerBottomRow = page.locator('.footer-bottom-row');
    await expect(footerBottomRow).toBeVisible();
    await expect(footerBottomRow.locator('a[aria-label="Cookie Policy"]')).toBeVisible();
    await expect(footerBottomRow.locator('a[aria-label="LinkedIn"]')).toBeVisible();
    await expect(footerBottomRow.locator('span:has-text("© 2023 Knowit AB")')).toBeVisible(); // Check for copyright text
  });

  test('footer social media links should point to correct URLs', async ({ page }) => {
    await expect(page.locator('a[aria-label="LinkedIn"]')).toHaveAttribute('href', 'https://www.linkedin.com/company/knowit/');
    await expect(page.locator('a[aria-label="Facebook"]')).toHaveAttribute('href', 'https://www.facebook.com/weareknowit');
    await expect(page.locator('a[aria-label="Instagram"]')).toHaveAttribute('href', 'https://www.instagram.com/weareknowit/');
  });

});