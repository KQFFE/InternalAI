// frontend/e2e/admin_login.spec.js
import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
    test.beforeEach(async ({ page }) => {
        // 1. Navigate to the home page first. This is crucial for localStorage access.
        await page.goto('/');

        // 2. Clear localStorage and cookies for a clean state.
        await page.evaluate(() => window.localStorage.clear());
        await page.context().clearCookies();

        // 3. Reload the page to ensure the cookie banner reappears after clearing localStorage.
        await page.reload();

        // 4. Explicitly wait for the cookie banner to be visible and accept all cookies.
        const acceptAllCookiesButton = page.locator('.coi-banner__accept', { hasText: 'Godkänn alla' });
        await expect(acceptAllCookiesButton).toBeVisible({ timeout: 15000 }); // Increased timeout for banner visibility
        await acceptAllCookiesButton.click();

        // 5. Wait for the cookie banner to disappear to ensure it's no longer intercepting clicks.
        await expect(page.locator('#coiOverlay')).not.toBeVisible({ timeout: 10000 });
    });

    test('should show admin button in top-right corner', async ({ page }) => {
        await page.waitForSelector('button:text("Admin")', { state: 'visible' });
        const adminButton = page.locator('button:text("Admin")');
        await expect(adminButton).toBeVisible();
    });

    test('should open and close admin login modal', async ({ page }) => {
        await page.locator('[data-testid="admin-login-button"]').click();

        await expect(page.locator('text=Admin Login')).toBeVisible();
        await expect(page.locator('input[placeholder="Enter admin password"]')).toBeVisible();

        await page.click('button[aria-label="Close login modal"]');

        await expect(page.locator('text=Admin Login')).not.toBeVisible();
    });

    test('should successfully authenticate admin user', async ({ page }) => {
        // Click admin button
        await page.locator('[data-testid="admin-login-button"]').click();

        // Wait for modal and fill password
        await page.waitForSelector('input[placeholder="Enter admin password"]', { state: 'visible' });
        await page.fill('input[placeholder="Enter admin password"]', 'admin123');
        await page.click('button:text("Login")');

        // Should show admin mode
        await expect(page.locator('text=Admin Mode')).toBeVisible();
        await expect(page.locator('button:text("Logout")')).toBeVisible();

        // Login modal should be gone
        await expect(page.locator('h2:text("Admin Login")')).not.toBeVisible();
    });

    test('should show error for wrong password', async ({ page }) => {
        // Click admin button
        await page.locator('[data-testid="admin-login-button"]').click();

        // Enter wrong password
        await page.waitForSelector('input[placeholder="Enter admin password"]', { state: 'visible' });
        await page.fill('input[placeholder="Enter admin password"]', 'wrongpassword');
        await page.click('button:text("Login")');

        // Should show error
        await expect(page.locator('text=Invalid password')).toBeVisible();

        // Password field should be cleared
        const passwordInput = page.locator('input[placeholder="Enter admin password"]');
        await expect(passwordInput).toHaveValue('');
    });

    test('should validate password requirements', async ({ page }) => {
        // Click admin button
        await page.locator('[data-testid="admin-login-button"]').click();

        // Try short password
        await page.waitForSelector('input[placeholder="Enter admin password"]', { state: 'visible' });
        await page.fill('input[placeholder="Enter admin password"]', 'ab');
        await page.click('button:text("Login")');

        // Should show validation error
        await expect(page.locator('text=Password must be at least 3 characters')).toBeVisible();
    });

    test('should successfully logout', async ({ page }) => {
        // Login first
        await page.locator('[data-testid="admin-login-button"]').click();
        await page.waitForSelector('input[placeholder="Enter admin password"]', { state: 'visible' });
        await page.fill('input[placeholder="Enter admin password"]', 'admin123');
        await page.click('button:text("Login")');

        // Wait for admin mode
        await expect(page.locator('text=Admin Mode')).toBeVisible();

        // Logout
        await page.click('button:text("Logout")');

        // Should return to normal state
        await expect(page.locator('button:text("Admin")')).toBeVisible();
        await expect(page.locator('text=Admin Mode')).not.toBeVisible();
    });

    test('should handle password visibility toggle', async ({ page }) => {
        // Click admin button
        await page.locator('[data-testid="admin-login-button"]').click();

        await page.waitForSelector('input[placeholder="Enter admin password"]', { state: 'visible' });
        const passwordInput = page.locator('input[placeholder="Enter admin password"]');
        const toggleButton = page.locator('button:text("👁️‍🗨️")');

        // Initially password type
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Fill some text
        await page.fill('input[placeholder="Enter admin password"]', 'test123');

        // Toggle visibility
        await toggleButton.click();

        // Should be text type now
        await expect(passwordInput).toHaveAttribute('type', 'text');

        // Toggle back
        await page.click('button:text("👁️")');
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should cancel login with Cancel button', async ({ page }) => {
        // Click admin button
        await page.locator('[data-testid="admin-login-button"]').click();

        // Modal should be visible
        await page.waitForSelector('h2:text("Admin Login")', { state: 'visible' });
        await expect(page.locator('h2:text("Admin Login")')).toBeVisible();

        // Click cancel
        await page.click('button:text("Cancel")');

        // Modal should close
        await expect(page.locator('h2:text("Admin Login")')).not.toBeVisible();
        await expect(page.locator('button:text("Admin")')).toBeVisible();
    });
});