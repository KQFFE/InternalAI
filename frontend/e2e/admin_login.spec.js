﻿import { test, expect } from './test-fixtures.js';

// Centralized locators for easier maintenance
const LOCATORS = {
  adminLoginButton: '[data-testid="admin-login-button"]',
  logoutButton: '[data-testid="admin-logout-button"]',
  modal: '[data-testid="admin-login-modal"]',
  modalHeading: 'heading[name="Admin Login"]',
  passwordInput: 'textbox[name="Password"]',
  loginSubmitButton: 'button[name="Login"][exact=true]',
  cancelButton: 'button[name="Cancel"]',
  closeModalButton: 'button[name="Close login modal"]',
  togglePasswordButton: 'button[aria-label*="password"]',
  errorMessage: '.error-message',
  // For focus trapping, use more specific test-ids
  passwordInputById: '[data-testid="admin-password-input"]',
  togglePasswordById: '[data-testid="toggle-password-visibility-button"]',
  loginSubmitById: '[data-testid="login-button"]',
  cancelButtonById: '[data-testid="cancel-button"]',
};

test.describe('Admin Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the initial status check to be not authenticated
    await page.route('/api/admin/status', async (route) => {
      await route.fulfill({ json: { isAuthenticated: false } });
    });
    await page.goto('/'); // Cookie banner is handled by the test fixture
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
    const adminButton = page.locator(LOCATORS.adminLoginButton);
    await expect(adminButton).toBeVisible();
    await adminButton.click();

    // 2. Verify the modal is open
    const modalHeading = page.getByRole(LOCATORS.modalHeading.split('[')[0], { name: 'Admin Login' });
    await expect(modalHeading).toBeVisible();

    // 3. Fill in the password and click login
    await page.getByRole(LOCATORS.passwordInput.split('[')[0], { name: 'Password' }).fill('correct-password');
    await page.getByRole(LOCATORS.loginSubmitButton.split('[')[0], { name: 'Login', exact: true }).click();

    // 4. Verify the modal is closed and the logout button is visible
    await expect(modalHeading).not.toBeVisible();
    const logoutButton = page.locator(LOCATORS.logoutButton);
    await expect(logoutButton).toBeVisible();
  });

  test('should be able to log out', async ({ page }) => {
    // Unroute the handler from beforeEach to override the initial state
    await page.unroute('/api/admin/status');

    // Set initial state to logged in for this test
    await page.route('/api/admin/status', async (route) => {
      await route.fulfill({ json: { isAuthenticated: true } });
    });

    // Mock the logout API call
    await page.route('/api/admin/logout', async (route) => {
      await route.fulfill({ status: 200 });
    });

    // Reload the page with the new mock
    await page.goto('/'); // Fixture handles cookie banner

    const logoutButton = page.locator(LOCATORS.logoutButton);
    await expect(logoutButton).toBeVisible();

    // Atomically click and wait for the network request to ensure UI updates
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/admin/logout')),
      logoutButton.click(),
    ]);

    const adminButton = page.locator(LOCATORS.adminLoginButton);
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
    await page.locator(LOCATORS.adminLoginButton).click();

    // Verify the modal is open
    const modalHeading = page.getByRole(LOCATORS.modalHeading.split('[')[0], { name: 'Admin Login' });
    await expect(modalHeading).toBeVisible();

    // Fill in the wrong password and click login
    const passwordInput = page.getByRole(LOCATORS.passwordInput.split('[')[0], { name: 'Password' });
    await passwordInput.fill('wrong-password');
    await page.getByRole(LOCATORS.loginSubmitButton.split('[')[0], { name: 'Login', exact: true }).click();

    // Verify the error message is shown
    await expect(page.locator(LOCATORS.errorMessage)).toHaveText('Invalid password');

    // Verify the password input is cleared
    await expect(passwordInput).toHaveValue('');

    // Verify the modal is still open
    await expect(modalHeading).toBeVisible();
  });

  test('should show a client-side validation error for a short password', async ({ page }) => {
    // Click the Admin button
    await page.locator(LOCATORS.adminLoginButton).click();

    // Verify the modal is open
    const modalHeading = page.getByRole(LOCATORS.modalHeading.split('[')[0], { name: 'Admin Login' });
    await expect(modalHeading).toBeVisible();

    // Fill in a short password and click login
    await page.getByRole(LOCATORS.passwordInput.split('[')[0], { name: 'Password' }).fill('a');
    await page.getByRole(LOCATORS.loginSubmitButton.split('[')[0], { name: 'Login', exact: true }).click();

    // Verify the validation error message is shown
    await expect(page.locator(LOCATORS.errorMessage)).toHaveText('Password must be at least 3 characters');
    
    // Verify the modal is still open
    await expect(modalHeading).toBeVisible();
  });

  test('should handle password visibility toggle', async ({ page }) => {
    // Click the Admin button
    await page.locator(LOCATORS.adminLoginButton).click();
    
    // Wait for modal to be visible
    await expect(page.getByRole(LOCATORS.modalHeading.split('[')[0], { name: 'Admin Login' })).toBeVisible();

    const passwordInput = page.getByRole(LOCATORS.passwordInput.split('[')[0], { name: 'Password' });
    const showPasswordButton = page.locator(LOCATORS.togglePasswordButton);

    // Initially, it should be a password input
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to show password
    await showPasswordButton.click();

    // It should now be a text input
    await expect(passwordInput).toHaveAttribute('type', 'text');
    const hidePasswordButton = page.locator(LOCATORS.togglePasswordButton);
    await expect(hidePasswordButton).toBeVisible();

    // Click toggle again to hide password
    await hidePasswordButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should allow canceling the login modal with the Cancel button', async ({ page }) => {
    // Click the Admin button
    await page.locator(LOCATORS.adminLoginButton).click();

    // Verify the modal is open
    const modalHeading = page.getByRole(LOCATORS.modalHeading.split('[')[0], { name: 'Admin Login' });
    await expect(modalHeading).toBeVisible();

    // Click the cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify the modal is closed
    await expect(modalHeading).not.toBeVisible();
  });

  test('should allow closing the login modal with the close button', async ({ page }) => {
    await page.getByRole('button', { name: 'Admin' }).click();
    const modalHeading = page.getByRole(LOCATORS.modalHeading.split('[')[0], { name: 'Admin Login' });
    await expect(modalHeading).toBeVisible();

    // Click the close button (the '×')
    await page.getByRole('button', { name: 'Close login modal' }).click();

    // Verify the modal is closed
    await expect(modalHeading).not.toBeVisible();
  });

  test('should trap focus within the modal', async ({ page }) => {
    // 1. Click the Admin button to open the modal
    const adminButton = page.locator(LOCATORS.adminLoginButton);
    await adminButton.click();

    // 2. Verify the modal is open and the first element (close button) has focus
    const modal = page.locator(LOCATORS.modal);
    const closeButton = page.getByRole('button', { name: 'Close login modal' });
    await expect(modal).toBeVisible();
    await expect(closeButton).toBeFocused();

    // 3. Tab to the password input and check focus
    await page.keyboard.press('Tab');
    const passwordInput = page.locator(LOCATORS.passwordInputById);
    await expect(passwordInput).toBeFocused();

    // 4. Fill the password to enable the login button
    await passwordInput.fill('a-valid-password');

    // 5. Tab through the rest of the elements
    await page.keyboard.press('Tab');
    await expect(page.locator(LOCATORS.togglePasswordById)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator(LOCATORS.loginSubmitById)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator(LOCATORS.cancelButtonById)).toBeFocused();

    // 6. Test forward wrap-around from the last element to the first
    await page.keyboard.press('Tab');
    await expect(closeButton).toBeFocused();

    // 7. Test backward wrap-around from the first element to the last
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator(LOCATORS.cancelButtonById)).toBeFocused();
  });
});