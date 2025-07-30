// frontend/src/TeamPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TeamPage from './TeamPage';

// Mock fetch globally
global.fetch = jest.fn();

// Helper function to render component with router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

// Mock team data for testing
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
        active: false // This should be filtered out
    }
];

describe('TeamPage Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        // Mock console.log and console.error to avoid test output noise
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.log.mockRestore();
        console.error.mockRestore();
    });

    describe('Loading State', () => {
        test('displays loading state initially', () => {
            fetch.mockImplementation(() => new Promise(() => { })); // Never resolves
            renderWithRouter(<TeamPage />);

            // During loading, navigation should be visible but main content should not
            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.queryByText('Our Amazing Team')).not.toBeInTheDocument();
            expect(screen.queryByText('No active team members')).not.toBeInTheDocument();
        });

        test('renders navigation and logo during loading', () => {
            fetch.mockImplementation(() => new Promise(() => { }));
            renderWithRouter(<TeamPage />);

            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getByAltText('Knowit-logo')).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
        });
    });

    describe('Successful Data Loading', () => {
        test('renders team members after successful fetch', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            await waitFor(() => {
                expect(screen.getByText('Our Amazing Team')).toBeInTheDocument();
            });

            // Should only show active team members (2 out of 3)
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();

            // Check roles are displayed
            expect(screen.getByText('Senior Developer')).toBeInTheDocument();
            expect(screen.getByText('Product Manager')).toBeInTheDocument();
        });

        test('renders team member profile pictures with correct attributes', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            await waitFor(() => {
                expect(screen.getByText('Our Amazing Team')).toBeInTheDocument();
            });

            const johnImage = screen.getByAltText('John Doe');
            const janeImage = screen.getByAltText('Jane Smith');

            expect(johnImage).toHaveAttribute('src', '/img/john-doe.jpg');
            expect(johnImage).toHaveClass('member-profile-pic');
            expect(janeImage).toHaveAttribute('src', '/img/jane-smith.jpg');
            expect(janeImage).toHaveClass('member-profile-pic');
        });

        test('renders LinkedIn links when available', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            await waitFor(() => {
                expect(screen.getByText('Our Amazing Team')).toBeInTheDocument();
            });

            const linkedinLinks = screen.getAllByText('View LinkedIn Profile');
            expect(linkedinLinks).toHaveLength(2); // Only active members with LinkedIn

            linkedinLinks.forEach(link => {
                expect(link).toHaveAttribute('target', '_blank');
                expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            });
        });

        test('handles image loading errors with fallback', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            await waitFor(() => {
                expect(screen.getByText('Our Amazing Team')).toBeInTheDocument();
            });

            const profileImage = screen.getByAltText('John Doe');

            // Simulate image loading error
            fireEvent.error(profileImage);

            expect(profileImage).toHaveAttribute('src', '/img/placeholder.jpg');
        });
    });

    describe('Error State', () => {
        test('displays error message when fetch fails', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            renderWithRouter(<TeamPage />);

            await waitFor(() => {
                expect(screen.getByText(/Error: Failed to load team members/)).toBeInTheDocument();
            });

            expect(screen.queryByText('Meet Our Team')).not.toBeInTheDocument();
            expect(console.error).toHaveBeenCalledWith('Could not fetch team data: ', expect.any(Error));
        });

        test('displays error message when response is not ok', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404
            });

            renderWithRouter(<TeamPage />);

            await waitFor(() => {
                expect(screen.getByText(/Error: Failed to load team members/)).toBeInTheDocument();
            });
        });
    });

    describe('Empty State', () => {
        test('displays message when no active team members', async () => {
            const inactiveTeamData = [
                { ...mockTeamData[0], active: false },
                { ...mockTeamData[1], active: false }
            ];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => inactiveTeamData
            });

            renderWithRouter(<TeamPage />);

            await waitFor(() => {
                expect(screen.getByText('Our Amazing Team')).toBeInTheDocument();
            });

            expect(screen.getByText('No active team members to display at the moment.')).toBeInTheDocument();
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });
    });

    describe('Navigation Handlers', () => {
        test('calls handleServicesClick when Services button is clicked', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            const servicesButton = screen.getByRole('button', { name: /services/i });
            fireEvent.click(servicesButton);

            expect(console.log).toHaveBeenCalledWith('Services clicked');
        });

        test('calls handleAboutClick when About button is clicked', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            const aboutButton = screen.getByRole('button', { name: /about/i });
            fireEvent.click(aboutButton);

            expect(console.log).toHaveBeenCalledWith('About clicked');
        });

        test('calls handleContactClick when Contact button is clicked', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            const contactButton = screen.getByRole('button', { name: /contact/i });
            fireEvent.click(contactButton);

            expect(console.log).toHaveBeenCalledWith('Contact clicked');
        });
    });

    describe('Accessibility', () => {
        test('has proper navigation structure with ARIA attributes', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            const navigation = screen.getByRole('navigation');
            expect(navigation).toHaveAttribute('aria-label', 'Main navigation');
        });

        test('has proper heading hierarchy', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            await waitFor(() => {
                expect(screen.getByText('Our Amazing Team')).toBeInTheDocument();
            });

            const mainHeading = screen.getByRole('heading', { name: /our amazing team/i });
            expect(mainHeading.tagName).toBe('H1');

            const memberHeadings = screen.getAllByRole('heading', { name: /john doe|jane smith/i });
            memberHeadings.forEach(heading => {
                expect(heading.tagName).toBe('H2');
            });
        });

        test('logo link has proper attributes', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            const logoLink = screen.getByRole('link', { name: /knowit-logo/i });
            expect(logoLink).toHaveAttribute('href', '/');
        });
    });

    describe('Data Fetching', () => {
        test('fetches team data from correct endpoint', () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            expect(fetch).toHaveBeenCalledWith('/team.json');
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        test('filters only active team members', async () => {
            const mixedTeamData = [
                { name: 'Active Member', active: true, role: 'Developer', profilePicture: '/img/active.jpg' },
                { name: 'Inactive Member', active: false, role: 'Designer', profilePicture: '/img/inactive.jpg' }
            ];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mixedTeamData
            });

            renderWithRouter(<TeamPage />);

            await waitFor(() => {
                expect(screen.getByText('Active Member')).toBeInTheDocument();
            });

            expect(screen.queryByText('Inactive Member')).not.toBeInTheDocument();
        });
    });

    describe('Component Structure', () => {
        test('renders team page structure correctly', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            await waitFor(() => {
                expect(screen.getByText('Our Amazing Team')).toBeInTheDocument();
            });

            // Test structure by checking expected content is rendered
            expect(screen.getByText('Our Amazing Team')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('Senior Developer')).toBeInTheDocument();
            expect(screen.getByText('Product Manager')).toBeInTheDocument();
        });

        test('renders navigation buttons with correct styling', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTeamData
            });

            renderWithRouter(<TeamPage />);

            const navButtons = screen.getAllByRole('button');
            navButtons.forEach(button => {
                expect(button).toHaveClass('main-nav-link');
            });
        });
    });
});