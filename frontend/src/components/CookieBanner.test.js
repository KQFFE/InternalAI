import { render, screen } from '../test-utils';
import userEvent from '@testing-library/user-event';
import CookieBanner from './CookieBanner';

// Mock the props that CookieBanner expects.
// The functionality of these props is not the focus of these tests.
const mockProps = {
    show: true,
    onAcceptAll: jest.fn(),
    onDeclineAll: jest.fn(),
    onSavePreferences: jest.fn(),
    functionalityCookies: false,
    setFunctionalityCookies: jest.fn(),
    statisticsCookies: false,
    setStatisticsCookies: jest.fn(),
    marketingCookies: false,
    setMarketingCookies: jest.fn(),
    showPolicy: false,
    setShowPolicy: jest.fn(),
};

const mockCookieInformation = {
    getConsent: () => ({
        cookies: [
            { name: 'optimizely-cookie', type: 'functional', service: 'Optimizely Service', purpose: 'A/B testing', privacyPolicy: 'https://www.optimizely.com/privacy', expiry: '1 year', provider: 'Optimizely Provider' },
            { name: 'hubspot-cookie', type: 'marketing', service: 'HubSpot Service', purpose: 'Marketing automation', privacyPolicy: 'https://legal.hubspot.com/privacy-policy', expiry: '1 year', provider: 'HubSpot Provider' },
        ],
    }),
    getCookieCategories: () => Promise.resolve([
        { name: 'necessary', label: 'Nödvändiga', description: 'Description 1', isMutable: false },
        { name: 'functional', label: 'Funktionella', description: 'Funktionella cookies gör det möjligt att spara uppgifter', isMutable: true },
        { name: 'statistic', label: 'Statistiska', description: 'Description 3', isMutable: true },
        { name: 'marketing', label: 'Marketing', description: 'Description 4', isMutable: true },
    ]),
};

describe('CookieBanner Category Behavior', () => {
    beforeEach(() => {
        window.CookieInformation = mockCookieInformation;
    });

    it('should collapse an expanded category when details are hidden and re-shown', async () => {
        const user = userEvent.setup();
        render(<CookieBanner {...mockProps} />);

        // 1. Show details
        const showDetailsButton = screen.getByRole('button', { name: /visa detaljer/i });
        await user.click(showDetailsButton);

        // 2. Expand a cookie category
        const functionalCategoryButton = await screen.findByRole('button', { name: /funktionella/i });
        await user.click(functionalCategoryButton);

        // Wait for the category to be expanded and check for content
        const categoryDescription = await screen.findByText(/Funktionella cookies gör det möjligt att spara uppgifter/i);
        expect(categoryDescription).toBeInTheDocument();
        
        const optimizelyService = await screen.findByText('Optimizely Service');
        expect(optimizelyService).toBeVisible();

        // 3. Hide details
        const hideDetailsButton = screen.getByRole('button', { name: /dölj detaljer/i });
        await user.click(hideDetailsButton);

        // Verify the details are hidden
        expect(optimizelyService).not.toBeVisible();

        // 4. Show details again
        const showDetailsAgainButton = screen.getByRole('button', { name: /visa detaljer/i });
        await user.click(showDetailsAgainButton);

        // 5. Every cookie category should be collapsed
        // The content of the previously expanded category should not be visible
        await screen.findByText('Optimizely Service');
    });

    it('should show cookie details when a category is expanded and collapse others', async () => {
        const user = userEvent.setup();
        render(<CookieBanner {...mockProps} />);

        // Show details
        const showDetailsButton = screen.getByRole('button', { name: /visa detaljer/i });
        await user.click(showDetailsButton);

        // Expand the 'Funktionella' category
        const functionalCategoryButton = await screen.findByRole('button', { name: /funktionella/i });
        await user.click(functionalCategoryButton);

        // Check that a cookie from that category is now visible
        const optimizelyService = await screen.findByText('Optimizely Service');
        expect(optimizelyService).toBeVisible();

        // Expand the 'Marketing' category, which should collapse 'Funktionella'
        const marketingCategoryButton = screen.getByRole('button', { name: /marketing/i });
        await user.click(marketingCategoryButton);

        // Check that 'Optimizely' is no longer visible
        await screen.findByText('Optimizely Service');

        // Check that a cookie from the 'Marketing' category is now visible
        const hubspotServices = await screen.findAllByText('HubSpot Service');
        expect(hubspotServices[0]).toBeVisible();
    });
});