import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the initial status check to be not authenticated
    await page.route('/api/admin/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ isAuthenticated: false }),
      });
    });
    await page.goto('/');
    // Accept cookies if the banner is visible to not interfere with tests
    const acceptCookiesButton = page.getByTestId('accept-all-cookies');
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
      await expect(page.locator('#coiOverlay')).not.toBeAttached();
    }
  });

  test('should open the admin modal, log in, and see the logout button', async ({ page }) => {
    // Mock the login API call to return success
    await page.route('/api/admin/login', async (route) => {
      // We can check the request body if we want to test the password
      const requestBody = route.request().postDataJSON();
      expect(requestBody.password).toBe('correct-password');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Mock the status check after login to return authenticated
    await page.route('/api/admin/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ isAuthenticated: true }),
      });
    }, { times: 1 }); // Only mock the next status call

    // 1. Click the Admin button
    const adminButton = page.getByTestId('admin-login-button');
    await expect(adminButton).toBeVisible();
    await adminButton.click();

    // 2. Verify the modal is open
    const modalHeading = page.getByRole('heading', { name: 'Admin Login' });
    await expect(modalHeading).toBeVisible();

    // 3. Fill in the password and click login
    await page.getByRole('textbox', { name: 'Password' }).fill('correct-password');
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    // 4. Verify the modal is closed and the logout button is visible
    await expect(modalHeading).not.toBeVisible();
    const logoutButton = page.getByTestId('admin-logout-button');
    await expect(logoutButton).toBeVisible();
  });

  test('should be able to log out', async ({ page }) => {
    // Set initial state to logged in for this test
    await page.route('/api/admin/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ isAuthenticated: true }),
      });
    });

    // Mock the logout API call
    await page.route('/api/admin/logout', async (route) => {
      await route.fulfill({ status: 200 });
    });

    // Reload the page with the new mock
    await page.goto('/');

    // The page has reloaded, so we must dismiss the cookie banner again
    const acceptCookiesButton = page.getByTestId('accept-all-cookies');
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
      await expect(page.locator('#coiOverlay')).not.toBeAttached();
    }

    const logoutButton = page.getByTestId('admin-logout-button');
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    const adminButton = page.getByTestId('admin-login-button');
    await expect(adminButton).toBeVisible();
  });
});