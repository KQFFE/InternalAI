import { test, expect } from '@playwright/test';

const mockTeamData = [
  {
    id: 1,
    name: 'Sasan Salari',
    role: 'The Boss',
    description: 'The big boss',
    profilePicture: '/img/sasan.jpg',
    active: true,
  },
  {
    id: 2,
    name: 'Sakshi Gupta',
    role: 'The Other Boss',
    description: 'The other big boss',
    profilePicture: '/img/sakshi.jpg',
    active: true,
  },
  {
    id: 3,
    name: 'Inactive Member',
    role: 'On Vacation',
    description: 'Not here.',
    profilePicture: '/img/inactive.jpg',
    active: false,
  },
];

test.describe('Team Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API response for /team.json before navigating
    await page.route('/team.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockTeamData),
      });
    });

    await page.goto('/team');
  });

  test('should display the team page heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Our Amazing Team' });
    await expect(heading).toBeVisible();
  });

  test('should display only active team members', async ({ page }) => {
    // Check that active members are visible
    await expect(page.getByText('Sasan Salari')).toBeVisible();
    await expect(page.getByText('The Boss')).toBeVisible();
    await expect(page.getByText('Sakshi Gupta')).toBeVisible();
    await expect(page.getByText('The Other Boss')).toBeVisible();

    // Check that the inactive member is NOT visible
    await expect(page.getByText('Inactive Member')).not.toBeVisible();
  });
});