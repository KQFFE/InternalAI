// frontend/src/components/AdminPanel.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminPanel from './AdminPanel';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn()
}));

// Mock fetch globally for AdminLogin component
global.fetch = jest.fn();

const renderWithRouter = (component) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    );
};

describe('AdminPanel Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        useAuth.mockClear();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Loading State', () => {
        test('displays loading spinner when checking authentication', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: true,
                handleLoginSuccess: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<AdminPanel />);

            expect(screen.getByTestId('admin-loading')).toBeInTheDocument();
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
            expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
        });
    });

    describe('Unauthenticated State', () => {
        test('shows login form when user is not authenticated', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                handleLoginSuccess: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<AdminPanel />);

            expect(screen.getByTestId('admin-login-wrapper')).toBeInTheDocument();
            expect(screen.getByText('Admin Login')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
        });
    });

    describe('Authenticated State', () => {
        const mockAuthenticatedUser = {
            isAdmin: true,
            isLoading: false,
            handleLoginSuccess: jest.fn(),
            logout: jest.fn()
        };

        test('renders admin panel when user is authenticated', () => {
            useAuth.mockReturnValue(mockAuthenticatedUser);

            renderWithRouter(<AdminPanel />);

            expect(screen.getByTestId('admin-panel')).toBeInTheDocument();
            expect(screen.getByTestId('admin-content')).toBeInTheDocument();
            expect(screen.getByText('Admin Panel')).toBeInTheDocument();
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
        });


        test('renders all admin section cards with correct test ids', () => {
            useAuth.mockReturnValue(mockAuthenticatedUser);

            renderWithRouter(<AdminPanel />);

            expect(screen.getByTestId('admin-sections')).toBeInTheDocument();
            expect(screen.getByTestId('team-management-card')).toBeInTheDocument();
            expect(screen.getByTestId('content-management-card')).toBeInTheDocument();
            expect(screen.getByTestId('settings-card')).toBeInTheDocument();
        });

        test('all admin section buttons are disabled and show "Coming Soon"', () => {
            useAuth.mockReturnValue(mockAuthenticatedUser);

            renderWithRouter(<AdminPanel />);

            const teamButton = screen.getByTestId('team-management-button');
            const contentButton = screen.getByTestId('content-management-button');
            const settingsButton = screen.getByTestId('settings-button');

            expect(teamButton).toBeDisabled();
            expect(teamButton).toHaveTextContent('Coming Soon');
            expect(contentButton).toBeDisabled();
            expect(contentButton).toHaveTextContent('Coming Soon');
            expect(settingsButton).toBeDisabled();
            expect(settingsButton).toHaveTextContent('Coming Soon');
        });

        test('displays correct content for each card', () => {
            useAuth.mockReturnValue(mockAuthenticatedUser);

            renderWithRouter(<AdminPanel />);

            // Team Management card
            expect(screen.getByText('Team Management')).toBeInTheDocument();
            expect(screen.getByText((content, element) =>
                content.includes('Manage team members') &&
                element.tagName.toLowerCase() === 'p'
            )).toBeInTheDocument();

            // Content Management card
            expect(screen.getByText('Content Management')).toBeInTheDocument();
            expect(screen.getByText('Update site content, news articles, and company information.')).toBeInTheDocument();

            // Settings card
            expect(screen.getByText('Settings')).toBeInTheDocument();
            expect(screen.getByText('Configure application settings and preferences.')).toBeInTheDocument();
        });

        test('dashboard has correct welcome message', () => {
            useAuth.mockReturnValue(mockAuthenticatedUser);

            renderWithRouter(<AdminPanel />);

            expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
            expect(screen.getByText('Welcome to the admin panel. This is where you\'ll manage the application.')).toBeInTheDocument();
        });
    });

    describe('Authentication State Transitions', () => {
        test('transitions from loading to unauthenticated', () => {
            const { rerender } = renderWithRouter(<AdminPanel />);

            // Start with loading state
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: true,
                handleLoginSuccess: jest.fn(),
                logout: jest.fn()
            });

            rerender(<AdminPanel />);
            expect(screen.getByTestId('admin-loading')).toBeInTheDocument();

            // Transition to unauthenticated
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                handleLoginSuccess: jest.fn(),
                logout: jest.fn()
            });

            rerender(<AdminPanel />);
            expect(screen.getByTestId('admin-login-wrapper')).toBeInTheDocument();
            expect(screen.queryByTestId('admin-loading')).not.toBeInTheDocument();
        });

        test('transitions from unauthenticated to authenticated', () => {
            const { rerender } = renderWithRouter(<AdminPanel />);

            // Start with unauthenticated state
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                handleLoginSuccess: jest.fn(),
                logout: jest.fn()
            });

            rerender(<AdminPanel />);
            expect(screen.getByTestId('admin-login-wrapper')).toBeInTheDocument();

            // Transition to authenticated
            useAuth.mockReturnValue({
                isAdmin: true,
                isLoading: false,
                handleLoginSuccess: jest.fn(),
                logout: jest.fn()
            });


            rerender(
                <MemoryRouter>
                    <AdminPanel />
                </MemoryRouter>
            );

            expect(screen.getByTestId('admin-panel')).toBeInTheDocument();
            expect(screen.queryByTestId('admin-login-wrapper')).not.toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        test('has proper heading hierarchy when authenticated', () => {
            useAuth.mockReturnValue({
                isAdmin: true,
                isLoading: false,
                handleLoginSuccess: jest.fn(),
                logout: jest.fn()
            });

            renderWithRouter(<AdminPanel />);

            const h1 = screen.getByRole('heading', { level: 1 });
            expect(h1).toHaveTextContent('Admin Panel');

            const h2 = screen.getByRole('heading', { level: 2 });
            expect(h2).toHaveTextContent('Dashboard');

            const h3Elements = screen.getAllByRole('heading', { level: 3 });
            expect(h3Elements).toHaveLength(4);
            expect(h3Elements[0]).toHaveTextContent('Team Management');
            expect(h3Elements[1]).toHaveTextContent('Content Management');
            expect(h3Elements[2]).toHaveTextContent('User Analytics');
            expect(h3Elements[3]).toHaveTextContent('Settings');
        });

    });

    describe('Edge Cases', () => {
        test('handles missing auth functions gracefully', () => {
            useAuth.mockReturnValue({
                isAdmin: false,
                isLoading: false,
                handleLoginSuccess: undefined,
                logout: undefined
            });

            expect(() => renderWithRouter(<AdminPanel />)).not.toThrow();
        });

        test('handles null auth context values', () => {
            useAuth.mockReturnValue({
                isAdmin: null,
                isLoading: null,
                handleLoginSuccess: null,
                logout: null
            });

            expect(() => renderWithRouter(<AdminPanel />)).not.toThrow();
        });

        test('handles empty auth context gracefully', () => {
            useAuth.mockReturnValue({
                isAdmin: undefined,
                isLoading: undefined,
                handleLoginSuccess: undefined,
                logout: undefined
            });

            expect(() => renderWithRouter(<AdminPanel />)).not.toThrow();
        });
    });
});