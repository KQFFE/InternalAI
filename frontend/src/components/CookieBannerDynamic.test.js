import { render, screen, within } from '../test-utils';
import userEvent from '@testing-library/user-event';
import CookieBanner from './CookieBanner';

// Mock the props that CookieBanner expects.
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

// Mock the CookieInformation API
const mockCookieInformation = {
    getConsent: () => ({
        cookies: [
            { name: 'cookie1', type: 'necessary', service: 'Service 1', purpose: 'Purpose 1', privacyPolicy: 'Privacy Policy 1', expiry: 'Expiry 1', provider: 'Provider 1' },
            { name: 'cookie2', type: 'functional', service: 'Service 2', purpose: 'Purpose 2', privacyPolicy: 'Privacy Policy 2', expiry: 'Expiry 2', provider: 'Provider 2' },
            { name: 'cookie3', type: 'statistic', service: 'Service 3', purpose: 'Purpose 3', privacyPolicy: 'Privacy Policy 3', expiry: 'Expiry 3', provider: 'Provider 3' },
            { name: 'cookie4', type: 'marketing', service: 'Service 4', purpose: 'Purpose 4', privacyPolicy: 'Privacy Policy 4', expiry: 'Expiry 4', provider: 'Provider 4' },
            { name: 'cookie5', type: 'unclassified', service: 'Service 5', purpose: 'Purpose 5', privacyPolicy: 'Privacy Policy 5', expiry: 'Expiry 5', provider: 'Provider 5' },
        ],
    }),
    getCookieCategories: () => Promise.resolve([
        { name: 'necessary', label: 'Nödvändiga', description: 'Description 1', isMutable: false },
        { name: 'functional', label: 'Funktionella', description: 'Description 2', isMutable: true },
        { name: 'statistic', label: 'Statistiska', description: 'Description 3', isMutable: true },
        { name: 'marketing', label: 'Marketing', description: 'Description 4', isMutable: true },
        { name: 'unclassified', label: 'Oklassificerade', description: 'Description 5', isMutable: false },
    ]),
};

describe('CookieBanner Dynamic Data Loading', () => {
    beforeEach(() => {
        window.CookieInformation = mockCookieInformation;
    });

    it('should load cookie categories dynamically', async () => {
        const user = userEvent.setup();
        render(<CookieBanner {...mockProps} />);

        // Show details to ensure all categories are rendered
        const showDetailsButton = screen.getByRole('button', { name: /visa detaljer/i });
        await user.click(showDetailsButton);

        // Wait for the categories to be loaded
        const categoriesWrapper = await screen.findByLabelText('Policy för kakor');
        expect(within(categoriesWrapper).getByText('Nödvändiga')).toBeInTheDocument();
        expect(within(categoriesWrapper).getByText('Funktionella')).toBeInTheDocument();
        expect(within(categoriesWrapper).getByText('Statistiska')).toBeInTheDocument();
        expect(within(categoriesWrapper).getByText('Marketing')).toBeInTheDocument();
        expect(within(categoriesWrapper).getByText('Oklassificerade')).toBeInTheDocument();
    });

    it('should load cookies for each category dynamically', async () => {
        const user = userEvent.setup();
        render(<CookieBanner {...mockProps} />);

        // Show details
        const showDetailsButton = screen.getByRole('button', { name: /visa detaljer/i });
        await user.click(showDetailsButton);

        // Expand the 'Funktionella' category
        const functionalCategoryButton = screen.getByRole('button', { name: /funktionella/i });
        await user.click(functionalCategoryButton);

        // Wait for the cookie to be loaded
        expect(await screen.findByText('Service 2')).toBeInTheDocument();
    });

    it('should display cookie details correctly', async () => {
        const user = userEvent.setup();
        render(<CookieBanner {...mockProps} />);

        // Show details
        const showDetailsButton = screen.getByRole('button', { name: /visa detaljer/i });
        await user.click(showDetailsButton);

        // Expand the 'Funktionella' category
        const functionalCategoryButton = screen.getByRole('button', { name: /funktionella/i });
        await user.click(functionalCategoryButton);

        // Find the container for the category details
        const categoryDetails = await screen.findByTestId('description-container-functional');

        // Find all cookie containers within that category
        const cookieContainers = within(categoryDetails).getAllByRole('rowgroup');

        // We expect only one functional cookie based on the mock data
        expect(cookieContainers).toHaveLength(1);

        // Assert on the content of that one cookie
        const cookieContainer = cookieContainers[0];
        expect(within(cookieContainer).getByText('Tjänst:')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('Service 2')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('Syfte:')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('Purpose 2')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('Integritetspolicy:')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('Service 2 - Integritetspolicy')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('Utgångstid:')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('Expiry 2')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('Namn:')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('cookie2')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('Leverantör:')).toBeInTheDocument();
        expect(within(cookieContainer).getByText('Provider 2')).toBeInTheDocument();
    });
});