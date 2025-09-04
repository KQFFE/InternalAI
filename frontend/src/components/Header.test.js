// frontend/src/components/__tests__/Header.test.js
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn()
}));

const renderWithRouter = (component) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    );
};

describe('Header Component', () => {
    beforeEach(() => {
        useAuth.mockClear();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Basic Rendering', () => {
        test('renders header with logo and navigation elements', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            expect(screen.getByRole('banner')).toBeInTheDocument();
            expect(screen.getByAltText('Knowit company logo')).toBeInTheDocument();
            expect(screen.getByRole('navigation')).toBeInTheDocument();
        });

        test('renders with center title when provided', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header centerTitle="Admin Panel" />);

            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Admin Panel');
            expect(screen.getByText('Admin Panel')).toHaveClass('header-center-title');
        });

        test('renders without center title by default', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
        });
    });

    describe('Navigation Links', () => {
        test('shows default navigation links when showNavigation is true', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header showNavigation={true} />);

            expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
        });

        test('hides navigation links when showNavigation is false', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header showNavigation={false} />);

            expect(screen.queryByRole('link', { name: /services/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /contact/i })).not.toBeInTheDocument();
        });

        test('shows Our Team link only when user is authenticated admin', () => {
            useAuth.mockReturnValue({
                isAdmin: true,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header showNavigation={true} />);

            expect(screen.getByTestId('team-nav')).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /our team/i })).toBeInTheDocument();
        });

        test('hides Our Team link when user is not authenticated', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header showNavigation={true} />);

            expect(screen.queryByTestId('team-nav')).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /our team/i })).not.toBeInTheDocument();
        });

        test('shows Admin Panel link only when user is authenticated admin', () => {
            useAuth.mockReturnValue({
                isAdmin: true,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header showNavigation={true} />);

            expect(screen.getByTestId('admin-panel-nav')).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /admin panel/i })).toBeInTheDocument();
        });

        test('hides Admin Panel link when user is not authenticated', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header showNavigation={true} />);

            expect(screen.queryByTestId('admin-panel-nav')).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /admin panel/i })).not.toBeInTheDocument();
        });

        test('hides admin-specific links during loading state', () => {
            useAuth.mockReturnValue({
                isAdmin: true,
                isLoading: true,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header showNavigation={true} />);

            expect(screen.queryByTestId('team-nav')).not.toBeInTheDocument();
            expect(screen.queryByTestId('admin-panel-nav')).not.toBeInTheDocument();
        });
    });

    describe('Authentication Buttons', () => {
        test('shows admin login button when user is not authenticated', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            const loginButton = screen.getByTestId('admin-login-button');
            expect(loginButton).toBeInTheDocument();
            expect(loginButton).toHaveTextContent('Admin');
            expect(loginButton).toHaveClass('admin-button', 'login-button');
        });

        test('shows logout button when user is authenticated admin', () => {
            useAuth.mockReturnValue({
                isAdmin: true,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            const logoutButton = screen.getByTestId('admin-logout-button');
            expect(logoutButton).toBeInTheDocument();
            expect(logoutButton).toHaveTextContent('Logout');
            expect(logoutButton).toHaveClass('admin-button', 'logout-button');
        });

        test('hides both auth buttons during loading state', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: true,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            expect(screen.queryByTestId('admin-login-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('admin-logout-button')).not.toBeInTheDocument();
        });

        test('calls openLoginModal when admin login button is clicked', async () => {
            const user = userEvent.setup();
            const mockOpenLoginModal = jest.fn();

            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: mockOpenLoginModal,
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            const loginButton = screen.getByTestId('admin-login-button');
            await user.click(loginButton);

            expect(mockOpenLoginModal).toHaveBeenCalledTimes(1);
        });

        test('calls logout when logout button is clicked', async () => {
            const user = userEvent.setup();
            const mockLogout = jest.fn();

            useAuth.mockReturnValue({
                isAdmin: true,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: mockLogout
            });

            renderWithRouter(<Header />);

            const logoutButton = screen.getByTestId('admin-logout-button');
            await user.click(logoutButton);

            expect(mockLogout).toHaveBeenCalledTimes(1);
        });
    });

    describe('Logo and Branding', () => {
        test('logo links to homepage', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            const logoLink = screen.getByLabelText('Go to homepage');
            expect(logoLink).toHaveAttribute('href', '/');
            expect(screen.getByTestId('header-logo')).toBeInTheDocument();
        });

        test('logo has proper accessibility attributes', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            const logo = screen.getByAltText('Knowit company logo');
            expect(logo).toHaveAttribute('alt', 'Knowit company logo');
            expect(logo).toHaveClass('app-logo-image');
        });
    });

    describe('Accessibility', () => {
        test('header has proper ARIA attributes', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            const header = screen.getByRole('banner');
            expect(header).toHaveAttribute('aria-label', 'Main navigation header');

            const nav = screen.getByRole('navigation');
            expect(nav).toHaveAttribute('aria-label', 'Main navigation');
        });

        test('navigation links have proper IDs for identification', () => {
            useAuth.mockReturnValue({
                isAdmin: true,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header showNavigation={true} />);

            expect(screen.getByRole('link', { name: /our team/i })).toHaveAttribute('id', 'nav-team');
            expect(screen.getByRole('link', { name: /services/i })).toHaveAttribute('id', 'nav-services');
            expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('id', 'nav-contact');
            expect(screen.getByRole('link', { name: /admin panel/i })).toHaveAttribute('id', 'nav-admin-panel');
        });

        test('auth buttons have proper attributes', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            const loginButton = screen.getByTestId('admin-login-button');
            expect(loginButton).toHaveAttribute('type', 'button');
        });
    });

    describe('Responsive and Layout', () => {
        test('renders all layout sections', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header centerTitle="Test Title" />);

            expect(screen.getByRole('banner')).toBeInTheDocument();

            // Check for header sections by their expected classes
            const header = screen.getByRole('banner');
            const logo = within(header).getByTestId('header-logo');
            const center = within(header).getByTestId('header-center');
            const right = within(header).getByTestId('header-right');
            expect(logo).toBeInTheDocument();
            expect(center).toBeInTheDocument();
            expect(right).toBeInTheDocument();

        });

        test('center section is empty when no centerTitle provided', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header />);

            const centerSection = screen.getByTestId('header-center');
            expect(centerSection).toBeInTheDocument();
            expect(centerSection).toBeEmptyDOMElement();
        });
    });

    describe('Edge Cases', () => {
        test('handles missing auth functions gracefully', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: undefined,
                logout: undefined
            });

            expect(() => renderWithRouter(<Header />)).not.toThrow();
        });

        test('handles null auth context values', () => {
            useAuth.mockReturnValue({
                isAdmin: null,
                isLoading: null,
                openLoginModal: null,
                logout: null
            });

            expect(() => renderWithRouter(<Header />)).not.toThrow();
        });

        test('handles undefined auth context gracefully', () => {
            useAuth.mockReturnValue({
                isAdmin: undefined,
                isLoading: undefined,
                openLoginModal: undefined,
                logout: undefined
            });

            expect(() => renderWithRouter(<Header />)).not.toThrow();
        });

        test('works with both showNavigation boolean values', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            // Test with true
            const { rerender } = renderWithRouter(<Header showNavigation={true} />);
            expect(screen.getByRole('navigation')).toBeInTheDocument();

            // Test with false
            rerender(
                <MemoryRouter>
                    <Header showNavigation={false} />
                </MemoryRouter>
            );
            expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
        });
    });

    describe('Authentication State Transitions', () => {
        test('transitions from unauthenticated to authenticated state', () => {

            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            const { rerender } = renderWithRouter(<Header showNavigation={true} />);

            // Start unauthenticated
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            rerender(
                <MemoryRouter>
                    <Header showNavigation={true} />
                </MemoryRouter>
            );

            expect(screen.getByTestId('admin-login-button')).toBeInTheDocument();
            expect(screen.queryByTestId('team-nav')).not.toBeInTheDocument();

            // Transition to authenticated
            useAuth.mockReturnValue({
                isAdmin: true,
                isLoading: false,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            rerender(
                <MemoryRouter>
                    <Header showNavigation={true} />
                </MemoryRouter>
            );

            expect(screen.getByTestId('admin-logout-button')).toBeInTheDocument();
            expect(screen.getByTestId('team-nav')).toBeInTheDocument();
            expect(screen.queryByTestId('admin-login-button')).not.toBeInTheDocument();
        });

        test('handles loading state properly', () => {
            useAuth.mockReturnValue({
                isAdmin: true,
                isLoading: true,
                openLoginModal: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<Header showNavigation={true} />);

            // During loading, admin-specific elements should be hidden
            expect(screen.queryByTestId('admin-logout-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('admin-login-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('team-nav')).not.toBeInTheDocument();
            expect(screen.queryByTestId('admin-panel-nav')).not.toBeInTheDocument();

            // But regular navigation should still show
            expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
        });
    });
});