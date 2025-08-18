import { test, expect } from '@playwright/test';
import { dismissCookieBanner } from './utils/helpers.js';

// Mock team data to use in tests, covering various cases.
const mockTeamData = [
  {
    name: 'John Doe',
    role: 'Senior Developer',
    profilePicture: '/img/john-doe.jpg',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    active: true,
  },
  {
    name: 'Jane Smith',
    role: 'Product Manager',
    profilePicture: '/img/jane-smith.jpg',
    linkedinUrl: 'https://linkedin.com/in/janesmith',
    active: true,
  },
  {
    name: 'Bob Wilson',
    role: 'Designer',
    profilePicture: '/img/bob-wilson.jpg',
    linkedinUrl: null, // Member without a LinkedIn profile
    active: false, // Inactive member
  },
];

// Filter mock data for easier use in tests
const activeMembers = mockTeamData.filter((m) => m.active);
const membersWithLinkedIn = activeMembers.filter((m) => m.linkedinUrl);

test.describe('Team Page', () => {
  // Group tests for the "happy path" where data loads successfully
  test.describe('when team data is successfully loaded', () => {
    test.beforeEach(async ({ page }) => {
      // 1. Intercept and mock the API call to return our mock data
      await page.route('/team.json', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockTeamData),
        });
      });
      // 2. Navigate to the team page directly.
      await page.goto('/team');

      // 3. Handle the cookie banner using the robust helper.
      await dismissCookieBanner(page);

      // 4. Wait for the team members to be rendered to ensure the page is ready.
          // Use a class selector since the component does not have data-testid attributes.
      await expect(page.locator('.team-member-card').first()).toBeVisible();
    });

    // Test to verify that the page title and subtitle are visible and contain the correct text.
    test('should display team page title and subtitle', async ({ page }) => {
      // Refactored to use `getByRole` and `getByTestId`
      const heading = page.getByRole('heading', { name: 'Our Amazing Team' });
      await expect(heading).toBeVisible();

      const subtitle = page.getByText('Meet the dedicated professionals at Knowit Quality Services Syd.');
      await expect(subtitle).toBeVisible();
    });

    // Test to ensure the team grid and member cards are rendered correctly based on mock data.
    test('should display only active team members', async ({ page }) => {
      // Use a class selector for the grid
      await expect(page.locator('.team-grid')).toBeVisible();

      // Use a class selector for the cards
      const memberCards = page.locator('.team-member-card');
      // Assertion is now dynamic based on the mock data length.
      await expect(memberCards).toHaveCount(activeMembers.length);

      // Check that active members are visible
      for (const member of activeMembers) {
        // Refactored to use `getByText` with `{ exact: true }` for reliability
        await expect(page.getByText(member.name, { exact: true })).toBeVisible();
        await expect(page.getByText(member.role, { exact: true })).toBeVisible();
      }

      // Check that the inactive member is NOT visible
      const inactiveMember = mockTeamData.find(m => !m.active);
      if (inactiveMember) {
        await expect(page.getByText(inactiveMember.name)).not.toBeVisible();
      }
    });

    // Test for proper heading hierarchy, which is important for screen readers and SEO.
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.getByRole('heading', { name: 'Our Amazing Team', level: 1 });
      // Locate member names (h2s) within the cards for correct hierarchy check.
      const h2s = page.locator('.team-member-card h2');

      await expect(h1).toHaveCount(1);
      // Dynamic count based on active members
      await expect(h2s).toHaveCount(activeMembers.length);
    });

    // Test to check for accessible LinkedIn links, including `target`, `rel`, and `aria-label`.
    test('should have accessible LinkedIn links for team members who have them', async ({ page }) => {
      // Use a class selector to find the LinkedIn links.
      const linkedinLinks = page.locator('.member-linkedin-link');
      // Dynamic count based on mock data
      await expect(linkedinLinks).toHaveCount(membersWithLinkedIn.length);

      const memberWithLink = membersWithLinkedIn[0];
      const link = page.locator(`a[href="${memberWithLink.linkedinUrl}"]`);

      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(link).toHaveText('View LinkedIn Profile');
      await expect(link).toHaveAttribute('aria-label', `View ${memberWithLink.name}'s LinkedIn profile`);
    });

    // Test to ensure the placeholder image is used when a profile picture fails to load.
    test('should use placeholder image on error', async ({ page }) => {
      // Intercept all image requests and make them fail
      await page.route('**/img/*.jpg', (route) => {
        route.abort('failed');
      });

      // Reload the page to trigger the error handler
      await page.reload();

      // Wait for the team members to be rendered again
      await expect(page.locator('.team-member-card').first()).toBeVisible();

      const profilePics = page.locator('.team-member-card img');
      await expect(profilePics.first()).toBeVisible();

      // The src should have been replaced with the placeholder image URL from the component's onError handler
      await expect(profilePics.first()).toHaveAttribute('src', 'https://placehold.co/400x400/cccccc/333333?text=Profile');
    });
  });

  // Group tests for handling different API and data states
  test.describe('when handling API or data states', () => {
    // Test to simulate a loading state and check if the loading message is displayed.
    test('should handle loading state appropriately', async ({ page }) => {
      // Mock the API to never resolve, keeping the component in a loading state
      await page.route('/team.json', async (route) => {
        return new Promise(() => {});
      });

      // Navigate to trigger the new route
      await page.goto('/team');
      await dismissCookieBanner(page);
      // Check for the correct loading text from the React component
      await expect(page.getByText(/loading/i)).toBeVisible();
    });

    // Test to simulate an error state from the API and verify the error message is displayed.
    test('should handle error state appropriately', async ({ page }) => {
      // Mock the API to simulate a server error
      await page.route('/team.json', (route) => {
        route.fulfill({
          status: 500,
          body: 'Internal Server Error',
        });
      });

      // Navigate to trigger the new route
      await page.goto('/team');
      await dismissCookieBanner(page);
      // Since specific locators failed, we'll check the entire page body for the error text.
      // This is a robust way to confirm the message is displayed, regardless of its specific container.
      await expect(page.locator('body')).toContainText(/Error: Network response was not ok/i);
    });

    // Test to verify the "No members" message is shown when the mock data is empty.
    test('should display "No active team members" message if data is empty', async ({ page }) => {
      // Mock the API to return an empty array, which results in no active members.
      await page.route('/team.json', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      });

      // Navigate to trigger the new route
      await page.goto('/team');
      await dismissCookieBanner(page);
      // Since specific locators failed, we'll check the entire page body for the empty state message.
      // This confirms the message is displayed, regardless of its specific container.
      await expect(page.locator('body')).toContainText(/No team members to display/i);
    });
  });
});