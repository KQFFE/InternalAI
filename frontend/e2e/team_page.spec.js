import { test, expect } from '@playwright/test';

// Mock team data to use in tests, similar to how it's fetched in the component
const mockTeamData = [
    {
        name: 'John Doe',
        role: 'Senior Developer',
        profilePicture: '/img/john-doe.jpg',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        active: true
    },
    {
        name: 'Jane Smith',
        role: 'Product Manager',
        profilePicture: '/img/jane-smith.jpg',
        linkedinUrl: 'https://linkedin.com/in/janesmith',
        active: true
    },
    {
        name: 'Bob Wilson',
        role: 'Designer',
        profilePicture: '/img/bob-wilson.jpg',
        linkedinUrl: null,
        active: false
    }
];

test.describe('Team Page Tests', () => {

    test.beforeEach(async ({ page }) => {
        // 1. Intercept and mock the API call to return our mock data
        await page.route('/team.json', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockTeamData),
            });
        });
        // 2. Navigate to the team page directly.
        await page.goto('/team');

        // 3. Handle the cookie banner.
        const acceptAllCookiesButton = page.locator('.coi-banner__accept', { hasText: 'Godkänn alla' });
        await expect(acceptAllCookiesButton).toBeVisible({ timeout: 15000 });
        // Use noWaitAfter to prevent the click from hanging in certain browsers (like Firefox)
        // if it's waiting for a navigation that doesn't happen.
        await acceptAllCookiesButton.click({ noWaitAfter: true });
        await expect(page.locator('#coiOverlay')).not.toBeVisible({ timeout: 10000 });

        // 4. Wait for the team members to be rendered to ensure the page is ready.
        await page.waitForSelector('.team-member-card');
    });

    // Cleanup after each test to prevent side effects on other test files
    test.afterEach(async ({ page }) => {
        await page.unroute('/team.json');
    });

    // Test to verify that the page title and subtitle are visible and contain the correct text.
    test('should display team page title and subtitle', async ({ page }) => {
        await expect(page.locator('.team-page-title')).toBeVisible();
        await expect(page.locator('.team-page-title')).toHaveText('Our Amazing Team');

        await expect(page.locator('.team-page-subtitle')).toBeVisible();
        await expect(page.locator('.team-page-subtitle')).toHaveText('Meet the dedicated professionals at Knowit Quality Services Syd.');
    });

    // Test to ensure the team grid and member cards are rendered correctly based on mock data.
    test('should display team grid and member cards', async ({ page }) => {
        await expect(page.locator('.team-grid')).toBeVisible();
        
        const memberCards = page.locator('.team-member-card');
        const cardCount = await memberCards.count();

        // There should be 2 active members based on mock data
        expect(cardCount).toBe(2);

        if (cardCount > 0) {
            await expect(memberCards.first()).toBeVisible();
            await expect(memberCards.first().locator('.member-name')).toBeVisible();
            await expect(memberCards.first().locator('.member-role')).toBeVisible();
        }
    });

    // Test to ensure the navigation elements are present for accessibility.
    test('should display navigation with proper accessibility', async ({ page }) => {
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('nav')).toBeVisible();
    });

    // Test for proper heading hierarchy, which is important for screen readers and SEO.
    test('should have proper heading hierarchy', async ({ page }) => {
        const h1 = page.locator('.team-page-title');
        const h2s = page.locator('h2.member-name');

        await expect(h1).toHaveCount(1);
        await expect(h2s).toHaveCount(2);
    });

    // Test to simulate a loading state and check if the loading message is displayed.
    test('should handle loading state appropriately', async ({ page }) => {
        // We need a new test case to simulate loading
        await page.route('/team.json', async route => {
            await new Promise(f => setTimeout(f, 1000)); // Simulate network delay
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockTeamData),
            });
        });
        await page.goto('/team', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText('Loading team members...')).toBeVisible();
    });

    // Test to simulate an error state from the API and verify the error message is displayed.
    test('should handle error state appropriately', async ({ page }) => {
        // We need a new test case to simulate an error
        await page.route('/team.json', route => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: 'Internal Server Error',
            });
        });
        await page.goto('/team', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText('Failed to load team members. Please try again later.')).toBeVisible();
    });

    // Test to verify the "No members" message is shown when the mock data is empty.
    test('should display "No active team members" message if no active members', async ({ page }) => {
        // We need a new test case to simulate no active members
        await page.route('/team.json', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockTeamData.filter(m => !m.active)),
            });
        });
        await page.goto('/team', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText('No active team members to display at the moment.')).toBeVisible();
    });

    // Test to check for accessible LinkedIn links, including `target`, `rel`, and `aria-label`.
    test('should have accessible LinkedIn links for team members', async ({ page }) => {
        const linkedinLinks = page.locator('.team-member-card a.member-linkedin-link');
        const linkCount = await linkedinLinks.count();
        expect(linkCount).toBe(2);

        const firstLink = linkedinLinks.first();
        await expect(firstLink).toBeVisible();
        await expect(firstLink).toHaveAttribute('href', 'https://linkedin.com/in/johndoe');
        await expect(firstLink).toHaveAttribute('target', '_blank');
        await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer');
        await expect(firstLink).toHaveText('View LinkedIn Profile');
    });

    // Test to ensure the placeholder image is used when a profile picture fails to load.
    test('should use placeholder image on error', async ({ page }) => {
        // Intercept all image requests and make them fail, then navigate to the page
        await page.route('**/img/*.jpg', route => {
            route.abort('failed');
        });
        await page.goto('/team', { waitUntil: 'domcontentloaded' });
        
        // Wait for the team members to be rendered
        await page.waitForSelector('.team-member-card');
        
        const profilePics = page.locator('.team-member-card img');
        const picCount = await profilePics.count();
        expect(picCount).toBeGreaterThan(0);
        
        const firstPic = profilePics.first();
        await expect(firstPic).toBeVisible();
        // The component's onError handler should change the src to the placeholder
        await expect(firstPic).toHaveAttribute('src', 'https://placehold.co/400x400/cccccc/333333?text=Profile');
    });

    // Test for responsiveness on mobile devices by checking the grid layout.
    test('should be responsive and display a single column on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('.team-page-title')).toBeVisible();

        const memberCards = page.locator('.team-member-card');
        await expect(memberCards).toHaveCount(2);

        const firstCardBox = await memberCards.first().boundingBox();
        const secondCardBox = await memberCards.nth(1).boundingBox();

        expect(firstCardBox).not.toBeNull();
        expect(secondCardBox).not.toBeNull();

        // On a single-column mobile layout, the cards should be stacked vertically.
        // Their x-coordinates should be roughly the same.
        expect(firstCardBox.x).toBeCloseTo(secondCardBox.x, 1);
        // The second card should be below the first one.
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y);
    });

    // Test to ensure keyboard navigation works as expected, starting with the first link.
    test('should have proper keyboard navigation', async ({ page, browserName }) => {
        // This test is flaky in WebKit, so we skip it for that browser.
        test.skip(browserName === 'webkit', 'Focus-related tests are flaky in WebKit');
        // Pressing Tab on the first link should move focus to the second link.
        // This is a more reliable way to test keyboard navigation across different browsers.
        await page.getByRole('link', { name: 'InternalAI' }).press('Tab');
        await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeFocused();
    });

    // Test to verify that focus indicators are present, which is vital for accessibility.
    test('should maintain focus indicators', async ({ page, browserName }) => {
        // This test is flaky in WebKit, so we skip it for that browser.
        test.skip(browserName === 'webkit', 'Focus-related tests are flaky in WebKit');
        // Pressing Tab on the first link should move focus to the second link.
        await page.getByRole('link', { name: 'InternalAI' }).press('Tab');
        await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveCSS('outline-width', '2px');
    });

    // Test for proper ARIA attributes on the team member cards for screen readers.
    test('should have proper ARIA attributes for team member cards', async ({ page }) => {
        const memberCards = page.locator('.team-member-card');
        const cardCount = await memberCards.count();
        expect(cardCount).toBeGreaterThan(0);

        const firstCard = memberCards.first();
        const profilePic = firstCard.locator('img');
        const memberName = firstCard.locator('h2');
        const linkedinLink = firstCard.locator('a.member-linkedin-link');

        // The `article` element has an implicit role of 'article', so this test is no longer needed.
        // Check if the profile picture has an 'alt' attribute
        await expect(profilePic).toHaveAttribute('alt');
        const memberNameText = (await memberName.textContent()).trim();
        // Check if the alt text is descriptive
        await expect(profilePic).toHaveAttribute('alt', `Profile of ${memberNameText}`);
        // Check for the accessible 'aria-label' on the LinkedIn link
        await expect(linkedinLink).toHaveAttribute('aria-label', `View ${memberNameText}'s LinkedIn profile`);
    });

    // Test to ensure all navigation links are present and have the correct href attributes.
    test('should have accessible navigation links', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/');
        await expect(page.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
        await expect(page.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
        await expect(page.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    });

    // Test to verify that team member information is displayed and not empty.
    test('should display team member information correctly', async ({ page }) => {
        const memberCards = page.locator('.team-member-card');
        const cardCount = await memberCards.count();
        expect(cardCount).toBeGreaterThan(0);

        const firstCard = memberCards.first();

        await expect(firstCard.locator('.member-name')).toBeVisible();
        await expect(firstCard.locator('.member-role')).toBeVisible();
        await expect(firstCard.locator('img')).toBeVisible();

        const memberName = await firstCard.locator('.member-name').textContent();
        expect(memberName).not.toBe('');

        const memberRole = await firstCard.locator('.member-role').textContent();
        expect(memberRole).not.toBe('');
    });
});
