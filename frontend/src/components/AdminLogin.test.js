// frontend/src/components/AdminLogin.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLogin from './AdminLogin';

// Mock fetch globally
global.fetch = jest.fn();

describe('AdminLogin Component', () => {
  let consoleSpy;

  beforeEach(() => {
      fetch.mockClear();
      // Mock console.error to suppress expected error logs in tests
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
      jest.resetAllMocks();
      consoleSpy.mockRestore();
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

  test('prevents submission when password is empty', () => {
    render(<AdminLogin />);

    const loginButton = screen.getByRole('button', { name: /login/i });

    // Button should be disabled when password is empty - this IS the validation
    expect(loginButton).toBeDisabled();

    // No form submission should be possible
    expect(fetch).not.toHaveBeenCalled();
  });

  test('validates minimum password length', async () => {
    const user = userEvent.setup();
    render(<AdminLogin />);
    
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    // Enter short password
    await user.type(passwordInput, 'ab');
    await user.click(loginButton);
    
    expect(screen.getByText('Password must be at least 3 characters')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  test('clears error when user starts typing', async () => {
    const user = userEvent.setup();
    render(<AdminLogin />);

    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    // Enter short password to trigger validation error (button will be enabled)
    await user.type(passwordInput, 'ab');
    await user.click(loginButton);

    // Should show minimum length error
    await waitFor(() => {
        expect(screen.getByText('Password must be at least 3 characters')).toBeInTheDocument();
    });

    // Start typing more - error should clear
    await user.type(passwordInput, 'c');
    expect(screen.queryByText('Password must be at least 3 characters')).not.toBeInTheDocument();
  });

  test('clears error when user starts typing after network error', async () => {
    const user = userEvent.setup();

    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<AdminLogin />);

    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    // Enter valid password and submit to trigger network error
    await user.type(passwordInput, 'admin123');
    await user.click(loginButton);

    // Wait for network error
    await waitFor(() => {
        expect(screen.getByText('Network error. Please check your connection and try again.')).toBeInTheDocument();
    });

    // Start typing - error should clear
    await user.clear(passwordInput);
    await user.type(passwordInput, 'a');
    expect(screen.queryByText('Network error. Please check your connection and try again.')).not.toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<AdminLogin />);
    
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('Show password');
    
    // Initially password type
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    
    // Click toggle again
    await user.click(screen.getByLabelText('Hide password'));
    expect(passwordInput).toHaveAttribute('type', 'password');
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
    
    // Enter valid password and submit
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
    
    // Wait for success callback
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({ success: true, message: 'Login successful' });
    });
  });

  test('shows loading state during API call', async () => {
    const user = userEvent.setup();
    
    // Create a promise that we can resolve later
    let resolvePromise;
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    fetch.mockReturnValueOnce(mockPromise);
    
    render(<AdminLogin />);
    
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    // Enter password and submit
    await user.type(passwordInput, 'admin123');
    await user.click(loginButton);
    
    // Check loading state
    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    
    // Resolve the promise
    resolvePromise({
      ok: true,
      json: async () => ({ success: true }),
    });
    
    // Wait for loading to clear
    await waitFor(() => {
      expect(screen.queryByText('Logging in...')).not.toBeInTheDocument();
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
    
    // Enter password and submit
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid password')).toBeInTheDocument();
    });
    
    // Password field should be cleared
    expect(passwordInput.value).toBe('');
  });

  test('clears password field on failed attempts', async () => {
    const user = userEvent.setup();
    
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid password' }),
    });
    
    render(<AdminLogin />);
    
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    // Enter password and submit
    await user.type(passwordInput, 'wrongpassword');
    expect(passwordInput.value).toBe('wrongpassword');
    
    await user.click(loginButton);
    
    // Wait for response and check password is cleared
    await waitFor(() => {
      expect(passwordInput.value).toBe('');
    });
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
    
    // Password should be cleared
    expect(passwordInput.value).toBe('');
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
    // Change this line to be more specific:
    const loginButton = screen.getByRole('button', { name: 'Login' }); // Exact match instead of regex
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const closeButton = screen.getByRole('button', { name: /close login modal/i });
    const toggleButton = screen.getByLabelText('Show password');

    // Start login
    await user.type(passwordInput, 'admin123');
    await user.click(loginButton);

    // All form elements should be disabled during loading
    expect(passwordInput).toBeDisabled();
    expect(loginButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(closeButton).toBeDisabled();
    expect(toggleButton).toBeDisabled();

    // Resolve promise
    resolvePromise({
        ok: true,
        json: async () => ({ success: true }),
    });

    // Wait for loading to complete
    await waitFor(() => {
        expect(screen.queryByText('Logging in...')).not.toBeInTheDocument();
    });
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
});