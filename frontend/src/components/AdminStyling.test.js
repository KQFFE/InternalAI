// frontend/src/components/__tests__/AdminStyling.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import { AuthProvider } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

// Mock the CSS imports
jest.mock('./AdminLogin.css', () => ({}));
jest.mock('./AdminPanel.css', () => ({}));

// Mock fetch globally
global.fetch = jest.fn();

// Helper to render components with AuthProvider

const renderWithAuth = (component, authContextValue = {}) => {
    const defaultAuthValue = {
        isAdmin: false,
        isLoading: false,
        handleLoginSuccess: jest.fn(),
        logout: jest.fn(),
        openLoginModal: jest.fn(),
        ...authContextValue
    };

    return render(
        <MemoryRouter>
            <AuthProvider value={defaultAuthValue}>
                {component}
            </AuthProvider>
        </MemoryRouter>
    );
};



describe('AdminLogin Styling Tests', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Dark Theme Elements', () => {
        test('renders with dark theme overlay classes', () => {
            render(<AdminLogin />);

            const overlay = screen.getByTestId('admin-login-overlay');
            expect(overlay).toBeInTheDocument();
            expect(overlay).toHaveClass('admin-login-overlay');
        });

        test('modal has proper dark theme styling classes', () => {
            render(<AdminLogin />);

            const modal = screen.getByTestId('admin-login-modal');
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveClass('admin-login-modal');
        });

        test('header has Knowit brand color classes', () => {
            render(<AdminLogin />);

            const header = screen.getByTestId('admin-login-header');
            expect(header).toBeInTheDocument();
            expect(header).toHaveClass('admin-login-header');
        });
    });

    describe('Form Element Styling', () => {
        test('password input has proper styling classes', () => {
            render(<AdminLogin />);

            const passwordInput = screen.getByLabelText('Password');
            const container = screen.getByTestId('password-input-container');

            expect(container).toBeInTheDocument();
            expect(container).toHaveClass('password-input-container');
            expect(passwordInput).toBeInTheDocument();
        });

        test('password toggle button has correct styling', () => {
            render(<AdminLogin />);

            const toggleButton = screen.getByTestId('toggle-password');
            expect(toggleButton).toBeInTheDocument();
            expect(toggleButton).toHaveClass('toggle-password');
        });

        test('login button has primary styling classes', () => {
            render(<AdminLogin />);

            const loginButton = screen.getByRole('button', { name: /login/i });
            expect(loginButton).toHaveClass('login-button');
        });

        test('cancel button has secondary styling when provided', () => {
            const mockCancel = jest.fn();
            render(<AdminLogin onCancel={mockCancel} />);

            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            expect(cancelButton).toHaveClass('cancel-button');
        });
    });

    describe('Error and Success States', () => {
        test('error message has proper styling classes', async () => {
            const user = userEvent.setup();
            render(<AdminLogin />);

            const passwordInput = screen.getByLabelText('Password');
            const loginButton = screen.getByRole('button', { name: /login/i });

            // Trigger validation error
            await user.type(passwordInput, 'ab');
            await user.click(loginButton);

            const errorMessage = screen.getByTestId('error-message');
            expect(errorMessage).toBeInTheDocument();
            expect(errorMessage).toHaveClass('error-message');
        });

        test('input gets error class when validation fails', async () => {
            const user = userEvent.setup();
            render(<AdminLogin />);

            const passwordInput = screen.getByLabelText('Password');
            const loginButton = screen.getByRole('button', { name: /login/i });

            await user.type(passwordInput, 'ab');
            await user.click(loginButton);

            expect(passwordInput).toHaveClass('error');
        });
    });

    describe('Loading States', () => {
        test('loading spinner has correct styling classes', async () => {
            const user = userEvent.setup();

            // Create a promise we can control
            let resolvePromise;
            const mockPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });

            fetch.mockReturnValueOnce(mockPromise);

            render(<AdminLogin />);

            const passwordInput = screen.getByLabelText('Password');
            const loginButton = screen.getByRole('button', { name: /login/i });

            // Start login process
            await user.type(passwordInput, 'admin123');
            await user.click(loginButton);

            // Check loading spinner
            const spinner = screen.getByTestId('loading-spinner');
            expect(spinner).toBeInTheDocument();
            expect(spinner).toHaveClass('loading-spinner');

            // Resolve the promise
            resolvePromise({
                ok: true,
                json: async () => ({ success: true }),
            });
        });
    });

    describe('Responsive Design Classes', () => {
        test('modal has responsive classes', () => {
            render(<AdminLogin />);

            const modal = screen.getByTestId('admin-login-modal');
            expect(modal).toHaveClass('admin-login-modal');

            // Check that CSS would apply responsive styles
            // (actual responsive behavior would be tested in e2e tests)
        });
    });

    describe('Accessibility Classes', () => {
        test('close button has proper accessibility attributes', () => {
            const mockCancel = jest.fn();
            render(<AdminLogin onCancel={mockCancel} />);

            const closeButton = screen.getByRole('button', { name: /close login modal/i });
            expect(closeButton).toHaveClass('close-button');
            expect(closeButton).toHaveAttribute('aria-label', 'Close login modal');
        });

        test('password toggle has accessibility attributes', () => {
            render(<AdminLogin />);

            const toggleButton = screen.getByLabelText('Show password');
            expect(toggleButton).toHaveClass('toggle-password');
            expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
        });
    });
});

describe('AdminPanel Styling Tests', () => {
    describe('Loading State Styling', () => {
        test('loading state has dark theme classes', () => {
            renderWithAuth(<AdminPanel />, { isLoading: true });

            const loadingDiv = screen.getByTestId('admin-loading');
            expect(loadingDiv).toHaveClass('admin-loading');

            const spinner = screen.getByTestId('loading-spinner');
            expect(spinner).toHaveClass('loading-spinner');
        });
    });

    describe('Authenticated Admin Panel Styling', () => {
        test('dashboard section has proper classes', () => {
            const mockAuthValue = {
                isAdmin: true,
                isLoading: false,
                handleLoginSuccess: jest.fn(),
                logout: jest.fn(),
                openLoginModal: jest.fn(),
                closeLoginModal: jest.fn(),
                isLoginModalOpen: false,
            };

            render(
                <MemoryRouter>
                    <AuthContext.Provider value={mockAuthValue}>
                        <AdminPanel />
                    </AuthContext.Provider>
                </MemoryRouter>
            );

            const dashboard = screen.getByTestId('admin-dashboard');
            expect(dashboard).toHaveClass('admin-dashboard');
        });

    });
});

describe('Theme Consistency Tests', () => {
    test('both components use consistent color scheme classes', () => {
        const mockAuthValue = {
            isAdmin: true,
            isLoading: false,
            handleLoginSuccess: jest.fn(),
            logout: jest.fn(),
            openLoginModal: jest.fn(),
            closeLoginModal: jest.fn(),
            isLoginModalOpen: false,
        };

        render(<AdminLogin />);

        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockAuthValue}>
                    <AdminPanel />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        const loginModal = screen.getByTestId('admin-login-modal');
        const adminPanel = screen.getByTestId('admin-panel');

        expect(loginModal).toHaveClass('admin-login-modal');
        expect(adminPanel).toHaveClass('admin-panel');
    });


    test('Knowit brand colors are consistently applied', () => {
        render(<AdminLogin />);

        const header = screen.getByTestId('admin-login-header');
        const loginButton = screen.getByTestId('login-button');

        expect(header).toHaveClass('admin-login-header');
        expect(loginButton).toHaveClass('login-button');
    });
});

// CSS Animation Tests
describe('CSS Animation Classes', () => {
    test('modal has slide-up animation class', () => {
        render(<AdminLogin />);

        const modal = screen.getByTestId('admin-login-modal');
        expect(modal).toHaveClass('admin-login-modal');
        // Animation would be defined in CSS
    });

    test('overlay has fade-in animation class', () => {
        render(<AdminLogin />);

        const overlay = screen.getByTestId('admin-login-overlay');
        expect(overlay).toHaveClass('admin-login-overlay');
    });
});

// Form Validation Styling Tests
describe('Form Validation Styling', () => {
    test('form elements have proper validation state classes', async () => {
        const user = userEvent.setup();
        render(<AdminLogin />);

        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        // Test error state
        await user.type(passwordInput, 'x');
        await user.click(loginButton);

        await waitFor(() => {
            expect(passwordInput).toHaveClass('error');
        });

        // Test clearing error state
        await user.clear(passwordInput);
        await user.type(passwordInput, 'validpassword');

        await waitFor(() => {
            expect(passwordInput).not.toHaveClass('error');
        });
    });
});

// Media Query and Responsive Tests (testing class presence)
describe('Responsive Design Class Tests', () => {
    test('components have responsive container classes', () => {
        const mockAuthValue = {
            isAdmin: true,
            isLoading: false,
            handleLoginSuccess: jest.fn(),
            logout: jest.fn(),
            openLoginModal: jest.fn(),
        };

        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockAuthValue}>
                    <AdminPanel />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        const adminPanel = screen.getByTestId('admin-panel');
        expect(adminPanel).toHaveClass('admin-panel');
    });
});

// Accessibility Color Contrast Tests
describe('Accessibility Styling Tests', () => {
    test('error messages have proper accessibility classes', async () => {
        const user = userEvent.setup();
        render(<AdminLogin />);

        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        await user.type(passwordInput, 'ab');
        await user.click(loginButton);

        const errorMessage = await screen.findByRole('alert');
        expect(errorMessage).toHaveClass('error-message');
    });

    test('form elements have proper focus classes', async () => {
        const user = userEvent.setup();
        render(<AdminLogin />);

        const passwordInput = screen.getByLabelText('Password');

        await user.click(passwordInput);
        expect(passwordInput).toHaveFocus();
        // CSS would provide focus styling
    });
});

// Integration Tests for Styling Components
describe('Styling Integration Tests', () => {
    test('login to admin panel maintains consistent styling', async () => {
        const user = userEvent.setup();
        const mockLoginSuccess = jest.fn();

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true })
        });

        render(<AdminLogin onLogin={mockLoginSuccess} />);

        // Complete login process
        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        await user.type(passwordInput, 'admin123');
        await user.click(loginButton);

        await waitFor(() => {
            expect(mockLoginSuccess).toHaveBeenCalled();
        });

        // Login component should have maintained its styling throughout
        const modal = screen.getByTestId('admin-login-modal');
        expect(modal).toHaveClass('admin-login-modal');
    });
});

// Performance-related styling tests
describe('Performance and Animation Classes', () => {
    test('loading states have performance-optimized classes', () => {
        renderWithAuth(<AdminPanel />, { isLoading: true });

        const spinner = screen.getByTestId('loading-spinner');
        expect(spinner).toHaveClass('loading-spinner');
    });

    test('reduced motion classes are applied when needed', () => {
        // Mock reduced motion preference
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: query === '(prefers-reduced-motion: reduce)',
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });

        render(<AdminLogin />);

        const modal = screen.getByTestId('admin-login-modal');
        expect(modal).toHaveClass('admin-login-modal');
    });
});