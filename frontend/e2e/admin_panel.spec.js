// frontend/e2e/admin_panel.spec.js
import { dismissCookieBanner } from './utils/helpers.js';

const { test, expect } = require('@playwright/test');

test.describe('Admin Panel E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the admin status check to return unauthenticated initially
        await page.route('/api/admin/status', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ isAuthenticated: false })
            });
        });

        // Mock team.json to prevent errors
        await page.route('/team.json', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([])
            });
        });
    });

    test.describe('Admin Panel Navigation', () => {
        test('should navigate to admin panel and show login form', async ({ page }) => {
            await page.goto('/admin');

            // Should see the login form using proper selectors
            await expect(page.getByRole('heading', { name: /admin login/i })).toBeVisible();
            await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
            await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
        });

        test('should show loading state briefly', async ({ page }) => {
            await page.goto('/admin');

            // Check for loading or login state
            const loadingOrLogin = page.locator('[data-testid="admin-loading"], [data-testid="admin-login-wrapper"]');
            await expect(loadingOrLogin).toBeVisible();
        });

        test('admin route should not show main site navigation', async ({ page }) => {
            await page.goto('/admin');

            // Should not see main site navigation elements
            await expect(page.getByRole('link', { name: /home/i })).not.toBeVisible();
            await expect(page.getByRole('link', { name: /our team/i })).not.toBeVisible();
        });
    });

    test.describe('Admin Authentication Flow', () => {
        test('should show login form for unauthenticated users', async ({ page }) => {
            await page.goto('/admin');

            // Wait for login wrapper to be visible
            await expect(page.getByTestId('admin-login-wrapper')).toBeVisible();

            // Verify login form elements
            await expect(page.getByText('Admin Login')).toBeVisible();
            await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
            await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
            await expect(page.getByText('Access restricted to authorized personnel only.')).toBeVisible();
        });

        test('should handle successful login and show admin panel', async ({ page }) => {
            // Track authentication state
            let isAuthenticated = false;

            // Mock successful login response
            await page.route('/api/admin/login', async (route) => {
                const request = route.request();
                const postData = JSON.parse(request.postData());

                if (postData.password === 'admin123') {
                    isAuthenticated = true;
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ success: true, message: 'Logged in successfully' })
                    });
                } else {
                    await route.fulfill({
                        status: 401,
                        contentType: 'application/json',
                        body: JSON.stringify({ error: 'Invalid password' })
                    });
                }
            });

            // Update status check based on authentication state
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated })
                });
            });

            await page.goto('/admin');

            await dismissCookieBanner(page);

            // Enter correct password and login
            await page.getByRole('textbox', { name: /password/i }).fill('admin123');
            await page.getByRole('button', { name: /login/i }).click();

            // Wait for successful login and admin panel to appear
            await expect(page.getByTestId('admin-panel')).toBeVisible();
            await expect(page.getByRole('heading', { name: /admin panel/i })).toBeVisible();
            await expect(page.getByTestId('logout-button')).toBeVisible();
        });

        test('should handle failed login attempt', async ({ page }) => {
            // Mock failed login response
            await page.route('/api/admin/login', async (route) => {
                await route.fulfill({
                    status: 401,
                    contentType: 'application/json',
                    body: JSON.stringify({ error: 'Invalid password' })
                });
            });

            await page.goto('/admin');
            await dismissCookieBanner(page);

            // Enter wrong password
            await page.getByRole('textbox', { name: /password/i }).fill('wrongpassword');
            await page.getByRole('button', { name: /login/i }).click();

            // Should show error message and remain on login form
            await expect(page.getByText('Invalid password')).toBeVisible();
            await expect(page.getByTestId('admin-login-wrapper')).toBeVisible();
        });

        test('should clear password field after failed login', async ({ page }) => {
            await page.route('/api/admin/login', async (route) => {
                await route.fulfill({
                    status: 401,
                    contentType: 'application/json',
                    body: JSON.stringify({ error: 'Invalid password' })
                });
            });

            await page.goto('/admin');
            await dismissCookieBanner(page);

            const passwordField = await page.getByRole('textbox', { name: /password/i });
            await passwordField.fill('wrongpassword');

            // Verify password is entered
            await expect(passwordField).toHaveValue('wrongpassword');

            await page.getByRole('button', { name: /login/i }).click();

            // Password field should be cleared after failed attempt
            await expect(passwordField).toHaveValue('');
        });
    });

    test.describe('Admin Panel Interface', () => {
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
            await expect(page.getByTestId('admin-panel')).toBeVisible();

            // Verify admin panel structure using test IDs
            await expect(page.getByTestId('admin-header')).toBeVisible();
            await expect(page.getByTestId('admin-content')).toBeVisible();
            await expect(page.getByTestId('admin-dashboard')).toBeVisible();

            // Verify headings
            await expect(page.getByRole('heading', { name: /admin panel/i, level: 1 })).toBeVisible();
            await expect(page.getByRole('heading', { name: /dashboard/i, level: 2 })).toBeVisible();

            // Verify welcome message
            await expect(page.getByText('Welcome to the admin panel. This is where you\'ll manage the application.')).toBeVisible();
        });

        test('should display all admin section cards with correct test IDs', async ({ page }) => {
            await page.goto('/admin');

            await expect(page.getByTestId('admin-panel')).toBeVisible();

            // Check admin sections container
            await expect(page.getByTestId('admin-sections')).toBeVisible();

            // Check individual cards using test IDs
            await expect(page.getByTestId('team-management-card')).toBeVisible();
            await expect(page.getByTestId('content-management-card')).toBeVisible();
            await expect(page.getByTestId('settings-card')).toBeVisible();

            // Verify card content
            await expect(page.getByText('Team Management')).toBeVisible();
            await expect(page.getByText('Manage team members and their information.')).toBeVisible();

            await expect(page.getByText('Content Management')).toBeVisible();
            await expect(page.getByText('Update website content and pages.')).toBeVisible();

            await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
            await expect(page.getByText('Configure application settings.')).toBeVisible();
        });

        test('should show "Coming Soon" buttons as disabled', async ({ page }) => {
            await page.goto('/admin');

            await expect(page.getByTestId('admin-panel')).toBeVisible();

            // Check specific buttons using test IDs
            const teamButton = page.getByTestId('team-management-button');
            const contentButton = page.getByTestId('content-management-button');
            const settingsButton = page.getByTestId('settings-button');

            await expect(teamButton).toBeVisible();
            await expect(teamButton).toBeDisabled();
            await expect(teamButton).toHaveText('Coming Soon');

            await expect(contentButton).toBeVisible();
            await expect(contentButton).toBeDisabled();
            await expect(contentButton).toHaveText('Coming Soon');

            await expect(settingsButton).toBeVisible();
            await expect(settingsButton).toBeDisabled();
            await expect(settingsButton).toHaveText('Coming Soon');
        });

        test('should handle logout functionality', async ({ page }) => {
            // Track authentication state
            let isAuthenticated = true;

            // Mock logout endpoint
            await page.route('/api/admin/logout', async (route) => {
                isAuthenticated = false;
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true, message: 'Logged out successfully' })
                });
            });

            // Update status check based on authentication state
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated })
                });
            });

            await page.goto('/admin');
            await dismissCookieBanner(page);

            // Verify we're on admin panel
            await expect(page.getByTestId('admin-panel')).toBeVisible();

            // Click logout button using test ID
            await page.getByTestId('logout-button').click();

            // Should return to login form
            await expect(page.getByTestId('admin-login-wrapper')).toBeVisible();
            await expect(page.getByText('Admin Login')).toBeVisible();
        });
    });

    test.describe('Responsive Design', () => {
        test('should be mobile responsive', async ({ page }) => {
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: true })
                });
            });

            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/admin');

            // Admin panel should still be functional on mobile
            await expect(page.getByTestId('admin-panel')).toBeVisible();
            await expect(page.getByTestId('admin-header')).toBeVisible();
            await expect(page.getByTestId('logout-button')).toBeVisible();

            // Cards should still be visible
            await expect(page.getByTestId('team-management-card')).toBeVisible();
            await expect(page.getByTestId('content-management-card')).toBeVisible();
            await expect(page.getByTestId('settings-card')).toBeVisible();
        });

        test('should handle tablet viewport', async ({ page }) => {
            await page.route('/api/admin/status', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ isAuthenticated: true })
                });
            });

            // Set tablet viewport
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/admin');

            await expect(page.getByTestId('admin-panel')).toBeVisible();
            await expect(page.getByTestId('admin-dashboard')).toBeVisible();
        });
    });

    test.describe('Direct URL Access and State Persistence', () => {
        test('should work with direct URL access', async ({ page }) => {
            // Test that going directly to /admin works properly
            await page.goto('/admin');

            // Should show login form for unauthenticated user
            await expect(page.getByTestId('admin-login-wrapper')).toBeVisible();
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
            await expect(page.getByTestId('admin-panel')).toBeVisible();

            // Refresh the page
            await page.reload();

            // Should still show admin panel (due to mocked authenticated state)
            await expect(page.getByTestId('admin-panel')).toBeVisible();
        });
    });

    test.describe('Network Error Handling', () => {
        test('should handle network errors gracefully during status check', async ({ page }) => {
            // Mock network error for status check
            await page.route('/api/admin/status', async (route) => {
                await route.abort('failed');
            });

            await page.goto('/admin');

            // Should show login form when status check fails
            await expect(page.getByTestId('admin-login-wrapper')).toBeVisible();
        });

        test('should handle login API errors', async ({ page }) => {
            await page.route('/api/admin/login', async (route) => {
                await route.abort('failed');
            });

            await page.goto('/admin');
            await dismissCookieBanner(page);

            await page.getByRole('textbox', { name: /password/i }).fill('admin123');
            await page.getByRole('button', { name: /login/i }).click();

            // Should show network error message
            await expect(page.getByText(/network error/i)).toBeVisible();
        });
    });
});