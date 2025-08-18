import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow', () => {
  // Helper to dismiss the cookie banner if it's visible
  const dismissCookieBanner = async (page) => {
    const acceptCookiesButton = page.getByTestId('accept-all-cookies');
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
      await expect(page.locator('#coiOverlay')).not.toBeAttached();
    }
  };

  test.beforeEach(async ({ page }) => {
    // Mock the initial status check to be not authenticated
    await page.route('/api/admin/status', async (route) => {
      await route.fulfill({ json: { isAuthenticated: false } });
    });
    await page.goto('/');
    await dismissCookieBanner(page);
  });

  test('should open the admin modal, log in, and see the logout button', async ({ page }) => {
    // Mock the login API call to return success
    await page.route('/api/admin/login', async (route) => {
      // We can check the request body if we want to test the password
      const requestBody = route.request().postDataJSON();
      expect(requestBody.password).toBe('correct-password');
      await route.fulfill({
        json: { success: true },
      });
    });

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
      await route.fulfill({ json: { isAuthenticated: true } });
    });

    // Mock the logout API call
    await page.route('/api/admin/logout', async (route) => {
      await route.fulfill({ status: 200 });
    });

    // Reload the page with the new mock
    await page.goto('/');
    await dismissCookieBanner(page);

    const logoutButton = page.getByTestId('admin-logout-button');
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    const adminButton = page.getByTestId('admin-login-button');
    await expect(adminButton).toBeVisible();
  });
});