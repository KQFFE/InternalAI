import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Accept cookies if the banner is visible to not interfere with tests
    const acceptCookiesButton = page.getByTestId('accept-all-cookies');
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
      // Wait for the entire overlay to be detached from the DOM.
      await expect(page.locator('#coiOverlay')).not.toBeAttached();
    }
  });

  test('should display the main hero content', async ({ page }) => {
    await expect(page).toHaveTitle(/InternalAI/);
    const heading = page.getByRole('heading', { name: 'Shaping a better future with code' });
    await expect(heading).toHaveText('Shaping a better future with code');
    const subheading = page.getByText('We are a digitalization company that develops solutions and services for a better tomorrow.');
    await expect(subheading).toBeVisible();
  });

  test('should navigate to the Team Page when "Read more" button is clicked', async ({ page }) => {
    const teamButton = page.getByRole('button', { name: 'Read more about our team' });
    await teamButton.click();
    await expect(page).toHaveURL('/team');
    const teamPageHeading = page.getByRole('heading', { name: 'Our Amazing Team' });
    await expect(teamPageHeading).toBeVisible();
  });

  test('should navigate to the License Page when "License Management" button is clicked', async ({ page }) => {
    const licenseButton = page.getByRole('button', { name: 'Knowit License Management' });
    await licenseButton.click();
    await expect(page).toHaveURL('/license');
    const licensePageHeading = page.getByRole('heading', { name: 'License Page' });
    await expect(licensePageHeading).toBeVisible();
  });

  test('should have a visible news section', async ({ page }) => {
    const newsSection = page.getByRole('region', { name: 'Latest news' }); // Assuming you add aria-label="Latest news" to the section
    await expect(newsSection).toBeVisible();
    const newsHeading = page.getByRole('heading', { name: 'News' });
    await expect(newsHeading).toHaveText('News');
  });

  test('should have a visible footer with social media links', async ({ page }) => {
    const footer = page.locator('footer.site-footer');
    await expect(footer).toBeVisible();
    const linkedinLink = page.getByRole('link', { name: 'Follow us on LinkedIn' });
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/company/knowit');
  });
});