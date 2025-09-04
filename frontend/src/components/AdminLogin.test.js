// frontend/src/components/AdminLogin.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock fetch globally before any imports
global.fetch = jest.fn();

// Mock the AuthContext completely to prevent any network calls
jest.mock('../context/AuthContext', () => ({
    AuthProvider: ({ children }) => children,
    useAuth: () => ({
        isAdmin: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        handleLoginSuccess: jest.fn()
    })
}));

// Import AdminLogin AFTER mocking dependencies
const AdminLogin = require('./AdminLogin').default;

describe('AdminLogin Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        // Suppress console errors for cleaner test output
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders login form correctly', () => {
        render(<AdminLogin />);

        expect(screen.getByText('Admin Login')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByText('Access restricted to authorized personnel only.')).toBeInTheDocument();
    });

    test('renders with cancel button when onCancel provided', () => {
        const mockCancel = jest.fn();
        render(<AdminLogin onCancel={mockCancel} />);

        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /close login modal/i })).toBeInTheDocument();
    });

    test('login button is disabled when password is empty', () => {
        render(<AdminLogin />);

        const loginButton = screen.getByRole('button', { name: /login/i });
        expect(loginButton).toBeDisabled();
    });

    test('login button is enabled when password is entered', async () => {
        const user = userEvent.setup();
        render(<AdminLogin />);

        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        expect(loginButton).toBeDisabled();

        await user.type(passwordInput, 'test');
        expect(loginButton).not.toBeDisabled();
    });

    test('validates minimum password length', async () => {
        const user = userEvent.setup();
        render(<AdminLogin />);

        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        await user.type(passwordInput, 'ab');
        await user.click(loginButton);

        expect(screen.getByText('Password must be at least 3 characters')).toBeInTheDocument();
        expect(fetch).not.toHaveBeenCalled();
    });

    test('calls login API with correct credentials', async () => {
        const user = userEvent.setup();
        const mockOnLogin = jest.fn();

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: 'Login successful' }),
        });

        render(<AdminLogin onLogin={mockOnLogin} />);

        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        await user.type(passwordInput, 'admin123');
        await user.click(loginButton);

        expect(fetch).toHaveBeenCalledWith('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ password: 'admin123' }),
        });

        await waitFor(() => {
            expect(mockOnLogin).toHaveBeenCalledWith({ success: true, message: 'Login successful' });
        });
    });

    test('displays error message on login failure', async () => {
        const user = userEvent.setup();

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid password' }),
        });

        render(<AdminLogin />);

        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        await user.type(passwordInput, 'wrongpassword');
        await user.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid password')).toBeInTheDocument();
        });

        expect(passwordInput.value).toBe('');
    });

    test('handles network errors gracefully', async () => {
        const user = userEvent.setup();

        fetch.mockRejectedValueOnce(new Error('Network error'));

        render(<AdminLogin />);

        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        await user.type(passwordInput, 'admin123');
        await user.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText('Network error. Please check your connection and try again.')).toBeInTheDocument();
        });

        expect(passwordInput.value).toBe('');
    });

    test('shows loading state during API call', async () => {
        const user = userEvent.setup();

        let resolvePromise;
        const mockPromise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        fetch.mockReturnValueOnce(mockPromise);

        render(<AdminLogin />);

        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        await user.type(passwordInput, 'admin123');
        await user.click(loginButton);

        expect(screen.getByText('Logging in...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
        expect(passwordInput).toBeDisabled();

        resolvePromise({
            ok: true,
            json: async () => ({ success: true }),
        });

        await waitFor(() => {
            expect(screen.queryByText('Logging in...')).not.toBeInTheDocument();
        });
    });

    test('toggles password visibility', async () => {
        const user = userEvent.setup();
        render(<AdminLogin />);

        const passwordInput = screen.getByLabelText('Password');
        const toggleButton = screen.getByLabelText('Show password');

        expect(passwordInput).toHaveAttribute('type', 'password');

        await user.click(toggleButton);
        expect(passwordInput).toHaveAttribute('type', 'text');
        expect(screen.getByLabelText('Hide password')).toBeInTheDocument();

        await user.click(screen.getByLabelText('Hide password'));
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('clears error when user starts typing', async () => {
        const user = userEvent.setup();
        render(<AdminLogin />);

        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        await user.type(passwordInput, 'ab');
        await user.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 3 characters')).toBeInTheDocument();
        });

        await user.type(passwordInput, 'c');
        expect(screen.queryByText('Password must be at least 3 characters')).not.toBeInTheDocument();
    });

    test('calls onCancel when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const mockCancel = jest.fn();

        render(<AdminLogin onCancel={mockCancel} />);

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        expect(mockCancel).toHaveBeenCalled();
    });

    test('calls onCancel when close button is clicked', async () => {
        const user = userEvent.setup();
        const mockCancel = jest.fn();

        render(<AdminLogin onCancel={mockCancel} />);

        const closeButton = screen.getByRole('button', { name: /close login modal/i });
        await user.click(closeButton);

        expect(mockCancel).toHaveBeenCalled();
    });

    test('disables form during loading state', async () => {
        const user = userEvent.setup();

        let resolvePromise;
        const mockPromise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        fetch.mockReturnValueOnce(mockPromise);

        const mockCancel = jest.fn();
        render(<AdminLogin onCancel={mockCancel} />);

        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        const closeButton = screen.getByRole('button', { name: /close login modal/i });
        const toggleButton = screen.getByLabelText('Show password');

        await user.type(passwordInput, 'admin123');
        await user.click(loginButton);

        expect(passwordInput).toBeDisabled();
        expect(loginButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();
        expect(closeButton).toBeDisabled();
        expect(toggleButton).toBeDisabled();

        resolvePromise({
            ok: true,
            json: async () => ({ success: true }),
        });

        await waitFor(() => {
            expect(screen.queryByText('Logging in...')).not.toBeInTheDocument();
        });
    });
});