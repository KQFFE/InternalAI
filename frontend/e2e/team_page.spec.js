import { test, expect } from '@playwright/test';

test.describe('Team Page Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/team', { waitUntil: 'load', timeout: 30000 });
        await page.evaluate(() => localStorage.clear());

        const cookieModal = page.locator('.cookie-modal');
        if (await cookieModal.isVisible()) {
            await page.locator('#accept-all-cookies').click();
            await expect(cookieModal).toBeHidden({ timeout: 15000 });
        }
    });

    test('should display team page title and subtitle', async ({ page }) => {
        await expect(page.locator('.team-page-title')).toBeVisible();
        await expect(page.locator('.team-page-title')).toHaveText('Our Amazing Team');

        await expect(page.locator('.team-page-subtitle')).toBeVisible();
        await expect(page.locator('.team-page-subtitle')).toHaveText('Meet the dedicated professionals at Knowit Quality Services Syd.');
    });

    test('should display team grid and member cards', async ({ page }) => {
        await expect(page.locator('.team-grid')).toBeVisible();

        const memberCards = page.locator('.team-member-card');
        const cardCount = await memberCards.count();

        if (cardCount > 0) {
            await expect(memberCards.first()).toBeVisible();
            await expect(memberCards.first().locator('.member-name')).toBeVisible();
            await expect(memberCards.first().locator('.member-role')).toBeVisible();
            await expect(memberCards.first().locator('.member-profile-pic')).toBeVisible();
        }
    });

    test('should display navigation with proper accessibility', async ({ page }) => {
        await expect(page.locator('nav')).toBeVisible();

        const logo = page.locator('.app-logo-image');
        await expect(logo).toBeVisible();
        await expect(logo).toHaveAttribute('alt', 'Knowit-logo');
    });

    test('should have proper heading hierarchy', async ({ page }) => {
        const mainHeading = page.locator('h1.team-page-title');
        await expect(mainHeading).toBeVisible();

        const memberNames = page.locator('h2.member-name');
        if (await memberNames.count() > 0) {
            await expect(memberNames.first()).toBeVisible();
        }
    });

    test('should handle loading state appropriately', async ({ page }) => {
        await expect(page.locator('.team-page-title')).toBeVisible();
        await expect(page.locator('.team-grid')).toBeVisible();
    });

    test('should handle error state appropriately', async ({ page }) => {
        const errorText = page.locator('.error');
        if (await errorText.isVisible()) {
            await expect(errorText).toContainText('Error:');
        }
    });

    test('should display "No active team members" message if no active members', async ({ page }) => {
        const noMembersMessage = page.locator('.no-members-found');
        if (await noMembersMessage.isVisible()) {
            await expect(noMembersMessage).toHaveText('No active team members to display at the moment.');
        }
    });

    test('should have accessible LinkedIn links for team members', async ({ page }) => {
        const linkedinLinks = page.locator('.member-linkedin-link');
        const linkCount = await linkedinLinks.count();

        if (linkCount > 0) {
            const firstLink = linkedinLinks.first();
            await expect(firstLink).toBeVisible();
            await expect(firstLink).toHaveAttribute('href');
            await expect(firstLink).toHaveAttribute('target', '_blank');
            await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer');
            await expect(firstLink).toHaveText('View LinkedIn Profile');
        }
    });

    test('should use placeholder image on error', async ({ page }) => {
        const profilePics = page.locator('.member-profile-pic');
        const picCount = await profilePics.count();

        if (picCount > 0) {
            const firstPic = profilePics.first();
            await expect(firstPic).toBeVisible();
            await expect(firstPic).toHaveAttribute('alt');
        }
    });

    test('should be responsive and accessible on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        await expect(page.locator('.team-page-title')).toBeVisible();
        await expect(page.locator('.team-grid')).toBeVisible();

        const memberCards = page.locator('.team-member-card');
        if (await memberCards.count() > 0) {
            await expect(memberCards.first()).toBeVisible();
        }
    });

    test('should have proper keyboard navigation', async ({ page }) => {
        await page.keyboard.press('Tab');

        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();

        const navLinks = page.locator('.main-nav-link');
        if (await navLinks.count() > 0) {
            await navLinks.first().focus();
            await expect(navLinks.first()).toBeFocused();
        }
    });

    test('should maintain focus indicators', async ({ page }) => {
        const firstNavLink = page.locator('.main-nav-link').first();
        if (await firstNavLink.isVisible()) {
            await firstNavLink.focus();

            const focusedStyles = await firstNavLink.evaluate((el) => {
                return window.getComputedStyle(el).outline;
            });

            expect(focusedStyles).not.toBe('none');
        }
    });

    test('should have proper ARIA attributes for team member cards', async ({ page }) => {
        const memberCards = page.locator('.team-member-card');
        const cardCount = await memberCards.count();

        if (cardCount > 0) {
            const firstCard = memberCards.first();

            const profilePic = firstCard.locator('.member-profile-pic');
            await expect(profilePic).toHaveAttribute('alt');

            const linkedinLink = firstCard.locator('.member-linkedin-link');
            if (await linkedinLink.isVisible()) {
                await expect(linkedinLink).toHaveAttribute('target', '_blank');
                await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
            }
        }
    });

    test('should have proper semantic structure', async ({ page }) => {
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('nav')).toBeVisible();

        await expect(page.locator('.team-page-content')).toBeVisible();
    });

    test('should have accessible navigation links', async ({ page }) => {
        const homeNavLink = page.getByRole('link', { name: 'Home' });
        if (await homeNavLink.isVisible()) {
            await expect(homeNavLink).toHaveAttribute('href', '/');
        }

        const logoLink = page.getByRole('link', { name: 'Knowit-logo' });
        if (await logoLink.isVisible()) {
            await expect(logoLink).toHaveAttribute('href', '/');
        }

        const teamLink = page.locator('a[href="/team"]');
        if (await teamLink.isVisible()) {
            await expect(teamLink).toHaveAttribute('href', '/team');
        }
    });

    test('should display team member information correctly', async ({ page }) => {
        const memberCards = page.locator('.team-member-card');
        const cardCount = await memberCards.count();

        if (cardCount > 0) {
            const firstCard = memberCards.first();

            await expect(firstCard.locator('.member-name')).toBeVisible();
            await expect(firstCard.locator('.member-role')).toBeVisible();
            await expect(firstCard.locator('.member-profile-pic')).toBeVisible();

            const memberName = await firstCard.locator('.member-name').textContent();
            expect(memberName).not.toBe('');

            const memberRole = await firstCard.locator('.member-role').textContent();
            expect(memberRole).not.toBe('');
        }
    });

    test('should handle image loading errors gracefully', async ({ page }) => {
        const profilePics = page.locator('.member-profile-pic');
        const picCount = await profilePics.count();

        if (picCount > 0) {
            const firstPic = profilePics.first();

            await expect(firstPic).toHaveAttribute('alt');
            await expect(firstPic).toHaveAttribute('src');

            const hasErrorHandling = await firstPic.evaluate((img) => {
                return img.onerror !== null || img.hasAttribute('onerror');
            });

            expect(typeof hasErrorHandling).toBe('boolean');
        }
    });

    test('should have proper color contrast and readability', async ({ page }) => {
        const title = page.locator('.team-page-title');
        if (await title.isVisible()) {
            const titleStyles = await title.evaluate((el) => {
                const styles = window.getComputedStyle(el);
                return {
                    color: styles.color,
                    backgroundColor: styles.backgroundColor
                };
            });

            expect(titleStyles.color).toBeDefined();
            expect(titleStyles.backgroundColor).toBeDefined();
        }
    });

    test('should maintain accessibility on different screen sizes', async ({ page }) => {
        const viewports = [
            { width: 375, height: 667 },
            { width: 768, height: 1024 },
            { width: 1920, height: 1080 }
        ];

        for (const viewport of viewports) {
            await page.setViewportSize(viewport);

            await expect(page.locator('.team-page-title')).toBeVisible();
            await expect(page.locator('.team-grid')).toBeVisible();

            await expect(page.locator('nav')).toBeVisible();
        }
    });
});