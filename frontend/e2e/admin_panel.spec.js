// frontend/e2e/admin_panel.spec.js
import { test, expect } from './test-fixtures.js';

// Centralized locators matching actual component structure
const LOCATORS = {
    // Authentication elements
    adminLoginWrapper: '[data-testid="admin-login-wrapper"]',
    adminLoginModal: '.admin-login-modal',
    loginButton: 'button[type="submit"]',
    passwordInput: '#admin-password',
    adminLoginButton: '[data-testid="admin-login-button"]',
    logoutButton: '[data-testid="admin-logout-button"]',

    // Admin panel elements (using actual class names from components)
    adminPanel: '.admin-panel',
    adminHeader: '.app-header', // Updated to match Header.js unified header
    adminContent: '[data-testid="admin-content"]',
    adminDashboard: '[data-testid="admin-dashboard"]',
    adminLoading: '[data-testid="admin-loading"]',
    adminSections: '.admin-sections',

    // Admin section cards
    teamManagementCard: '.admin-card',
    contentManagementCard: '.admin-card',
    settingsCard: '.admin-card',

    // Card content
    teamManagementHeading: 'h3:has-text("Team Management")',
    contentManagementHeading: 'h3:has-text("Content Management")',
    settingsHeading: 'h3:has-text("Settings")',

    // Generic elements
    loadingSpinner: '.loading-spinner',
    heading: 'h1',
    subheading: 'h2'
};

test.describe('Admin Panel E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        //await dismissCookieBanner(page);

        // Mock the admin team API to prevent errors, as the admin panel might fetch this
        await page.route('/api/admin/team', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    members: [],
                    count: 0,
                    timestamp: new Date().toISOString()
                })
            });
        });

        // Mock the admin login API
        await page.route('/api/admin/login', async route => {
            if (route.request().method() === 'POST') {
                const postData = route.request().postData();
                const data = JSON.parse(postData);

                // Use environment variable for password, fallback for CI/local consistency
                if (data.password === (process.env.ADMIN_PASSWORD || 'admin123')) {
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ success: true })
                    });
                } else {
                    await route.fulfill({
                        status: 401,
                        contentType: 'application/json',
                        body: JSON.stringify({ error: 'Invalid password' })
                    });
                }
            }
        });
    });

    test.describe('Unauthenticated Access', () => {
        test.beforeEach(async ({ page }) => {
            // Mock unauthenticated status
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: false })
                });
            });
        });

        test('should show login form for unauthenticated users', async ({ page }) => {
            await page.goto('/admin');

            // Wait for login wrapper to be visible
            await expect(page.locator(LOCATORS.adminLoginWrapper)).toBeVisible();

            // Verify login form elements
            await expect(page.getByText('Admin Login')).toBeVisible();
            await expect(page.locator(LOCATORS.passwordInput)).toBeVisible();
            await expect(page.locator(LOCATORS.loginButton)).toBeVisible();
        });

        test('should show loading state briefly', async ({ page }) => {
            // Add delay to status response to catch loading state
            await page.route('/api/admin/status', async (route) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: false })
                });
            });

            await page.goto('/admin');

            // Check for loading state
            try {
                await expect(page.locator(LOCATORS.adminLoading)).toBeVisible({ timeout: 2000 });
            } catch {
                // If loading too fast, verify we reach the login state
                await expect(page.locator(LOCATORS.adminLoginWrapper)).toBeVisible();
            }
        });

        test('successful login should show admin panel', async ({ page }) => {
            await page.goto('/admin');

            await expect(page.locator(LOCATORS.adminLoginWrapper)).toBeVisible();

            // Fill password and login
            await page.locator(LOCATORS.passwordInput).fill(process.env.ADMIN_PASSWORD || 'admin123');
            await page.locator(LOCATORS.loginButton).click();

            // Mock authenticated status for subsequent requests
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: true })
                });
            });

            // Should show admin panel after login
            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();
        });

        test('failed login should clear password field', async ({ page }) => {
            await page.goto('/admin');

            await expect(page.locator(LOCATORS.adminLoginWrapper)).toBeVisible();

            const passwordField = page.locator(LOCATORS.passwordInput);
            await passwordField.fill('wrongpassword');

            await expect(passwordField).toHaveValue('wrongpassword');
            await page.locator(LOCATORS.loginButton).click();

            // Password field should be cleared after failed attempt
            await expect(passwordField).toHaveValue('');
        });
    });

    test.describe('Authenticated Admin Panel', () => {
        test.beforeEach(async ({ page }) => {
            // Mock authenticated state for these tests
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: true })
                });
            });
        });

        test('should display admin panel interface when authenticated', async ({ page }) => {
            await page.goto('/admin');

            // Wait for admin panel to load
            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();

            // Verify admin panel structure using actual selectors
            await expect(page.locator(LOCATORS.adminHeader)).toBeVisible();
            await expect(page.locator(LOCATORS.adminContent)).toBeVisible();
            await expect(page.locator(LOCATORS.adminDashboard)).toBeVisible();

            // Verify headings
            await expect(page.getByRole('heading', { name: /admin panel/i })).toBeVisible();
            await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
        });


        test('should display logout button', async ({ page }) => {
            await page.goto('/admin');

            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();

            // Check for logout button
            await expect(page.locator(LOCATORS.logoutButton)).toBeVisible();
        });

        test('should display all admin section cards', async ({ page }) => {
            await page.goto('/admin');

            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();
            await expect(page.locator(LOCATORS.adminSections)).toBeVisible();

            // Use the specific locators
            await expect(page.locator(LOCATORS.teamManagementHeading)).toBeVisible();
            await expect(page.locator(LOCATORS.contentManagementHeading)).toBeVisible();
            await expect(page.locator(LOCATORS.settingsHeading)).toBeVisible();
        });

        test('should show correct button states for admin sections', async ({ page }) => {
            await page.goto('/admin');

            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();

            // Find buttons by text and check state
            const comingSoonButtons = page.getByRole('button', { name: 'Coming Soon' });

            // Check that there is at least one "Coming Soon" button
            await expect(comingSoonButtons.first()).toBeVisible();

            // All should be disabled
            const buttons = await comingSoonButtons.all(); // Playwright handles multiple elements
            for (const button of buttons) {
                await expect(button).toBeDisabled();
            }
        });

        test('logout functionality should work', async ({ page }) => {
            await page.goto('/admin');

            // Ensure authenticated state
            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();

            // Mock APIs
            await page.route('/api/admin/logout', route =>
                route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
            );
            await page.route('/api/admin/status', route =>
                route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ isAuthenticated: false }) })
            );

            // Click logout and wait for navigation
            const logoutResponse = page.waitForResponse(
                (res) => res.url().endsWith('/api/admin/logout') && res.status() === 200
            );
            await page.locator(LOCATORS.logoutButton).click();
            await logoutResponse;

            // After logout, the page should redirect to home.
            await page.waitForURL('**/');

            // Assert homepage is visible (snapshot shows "Admin" button there)
            await expect(page.getByRole('button', { name: 'Admin' })).toBeVisible();
        });

    });

    test.describe('Responsive Design', () => {
        test.beforeEach(async ({ page }) => {
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: true })
                });
            });
        });

        test('should be mobile responsive', async ({ page }) => {
            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/admin');

            // Admin panel should still be functional on mobile
            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();
            await expect(page.locator(LOCATORS.adminHeader)).toBeVisible();
            await expect(page.locator(LOCATORS.logoutButton)).toBeVisible();

            // Cards should still be visible
            await expect(page.getByText('Team Management')).toBeVisible();
        });

        test('should handle tablet viewport', async ({ page }) => {
            // Set tablet viewport
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/admin');

            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();
            await expect(page.locator(LOCATORS.adminDashboard)).toBeVisible();
        });
    });

    test.describe('Direct URL Access and State Persistence', () => {
        test('should work with direct URL access to unauthenticated admin', async ({ page }) => {
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: false })
                });
            });

            // Test that going directly to /admin works properly
            await page.goto('/admin');

            // Should show login form for unauthenticated user
            await expect(page.locator(LOCATORS.adminLoginWrapper)).toBeVisible();
        });

        test('should work with direct URL access to authenticated admin', async ({ page }) => {
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: true })
                });
            });

            await page.goto('/admin');

            // Should show admin panel for authenticated user
            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();
        });

        test('should maintain admin panel state on page refresh', async ({ page }) => {
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: true })
                });
            });

            await page.goto('/admin');
            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();

            // Refresh the page
            await page.reload();

            // Should still show admin panel after refresh
            await expect(page.locator(LOCATORS.adminPanel)).toBeVisible();
        });
    });

    test.describe('Error Handling', () => {
        test('should handle API errors gracefully', async ({ page }) => {
            // 1) Mock API error BEFORE navigation
            await page.route('/api/admin/status', route =>
                route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({ error: 'Internal server error' }),
                })
            );

            // 2) Go to /admin and wait for DOM to be ready
            await page.goto('/admin', { waitUntil: 'domcontentloaded' });

            // 3) Deterministic assertions (no races)
            //    - We expect to stay on /admin and show the login wrapper
            await expect(page).toHaveURL(/\/admin(?:\?|#|$)/);

            // Optional: tolerate a brief loading state if your UI shows one
            await page.locator(LOCATORS.adminLoading).waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });

            // Final state: login UI is visible
            await expect(page.locator(LOCATORS.adminLoginWrapper)).toBeVisible({ timeout: 10000 });
        });

        test('should handle slow network responses', async ({ page }) => {
            // Mock slow API response
            await page.route('/api/admin/status', async (route) => {
                await new Promise(resolve => setTimeout(resolve, 2000));
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: false })
                });
            });

            await page.goto('/admin');

            // Should eventually resolve to login form
            await expect(page.locator(LOCATORS.adminLoginWrapper)).toBeVisible({ timeout: 10000 });
        });
    });
});