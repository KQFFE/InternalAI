﻿import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow', () => {
  // Helper to dismiss the cookie banner if it's visible
  const dismissCookieBanner = async (page) => {
    const acceptCookiesButton = page.getByTestId('accept-all-cookies');
    try {
      // Use a timeout to wait for the banner to appear, as it might have animations.
      // This is more robust than a simple isVisible() check which does not wait.
      await acceptCookiesButton.click({ timeout: 5000 });
      await expect(page.locator('#coiOverlay')).not.toBeAttached();
    } catch (e) {
      // If the button is not found or not visible after the timeout,
      // we assume the banner is not there and continue with the test.
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

  test('should show an error for an incorrect password', async ({ page }) => {
    // Mock the login API to return failure
    await page.route('/api/admin/login', async (route) => {
      const requestBody = route.request().postDataJSON();
      expect(requestBody.password).toBe('wrong-password');
      await route.fulfill({
        status: 401, // Unauthorized
        json: { success: false, error: 'Invalid password' },
      });
    });

    // Click the Admin button
    await page.getByTestId('admin-login-button').click();

    // Verify the modal is open
    const modalHeading = page.getByRole('heading', { name: 'Admin Login' });
    await expect(modalHeading).toBeVisible();

    // Fill in the wrong password and click login
    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await passwordInput.fill('wrong-password');
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    // Verify the error message is shown
    await expect(page.locator('.error-message')).toHaveText('Invalid password');

    // Verify the password input is cleared
    await expect(passwordInput).toHaveValue('');

    // Verify the modal is still open
    await expect(modalHeading).toBeVisible();
  });

  test('should show a client-side validation error for a short password', async ({ page }) => {
    // Click the Admin button
    await page.getByTestId('admin-login-button').click();

    // Verify the modal is open
    const modalHeading = page.getByRole('heading', { name: 'Admin Login' });
    await expect(modalHeading).toBeVisible();

    // Fill in a short password and click login
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    // Verify the validation error message is shown
    await expect(page.locator('.error-message')).toHaveText('Password must be at least 3 characters');
    
    // Verify the modal is still open
    await expect(modalHeading).toBeVisible();
  });

  test('should handle password visibility toggle', async ({ page }) => {
    // Click the Admin button
    await page.getByTestId('admin-login-button').click();
    
    // Wait for modal to be visible
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();

    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    const showPasswordButton = page.getByRole('button', { name: 'Show password' });

    // Initially, it should be a password input
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to show password
    await showPasswordButton.click();

    // It should now be a text input
    await expect(passwordInput).toHaveAttribute('type', 'text');
    const hidePasswordButton = page.getByRole('button', { name: 'Hide password' });
    await expect(hidePasswordButton).toBeVisible();

    // Click toggle again to hide password
    await hidePasswordButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should allow canceling the login modal with the Cancel button', async ({ page }) => {
    // Click the Admin button
    await page.getByTestId('admin-login-button').click();

    // Verify the modal is open
    const modalHeading = page.getByRole('heading', { name: 'Admin Login' });
    await expect(modalHeading).toBeVisible();

    // Click the cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify the modal is closed
    await expect(modalHeading).not.toBeVisible();
  });

  test('should allow closing the login modal with the close button', async ({ page }) => {
    await page.getByTestId('admin-login-button').click();
    const modalHeading = page.getByRole('heading', { name: 'Admin Login' });
    await expect(modalHeading).toBeVisible();

    // Click the close button (the '×')
    await page.getByRole('button', { name: 'Close login modal' }).click();

    // Verify the modal is closed
    await expect(modalHeading).not.toBeVisible();
  });
});