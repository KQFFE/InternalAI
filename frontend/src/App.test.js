import { render, screen } from './test-utils';
import App from './App';
import userEvent from '@testing-library/user-event';
import * as AuthContext from './context/AuthContext';

// Helper to create a standard mock fetch response
const createMockResponse = (body) => {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
};

// Mock the fetch calls that our contexts will make.
// This allows us to test the integration without making real network requests.
beforeEach(() => {
  // Use jest.spyOn for consistency and reliable restoration.
  jest.spyOn(global, 'fetch').mockImplementation((url) => {
    const urlString = url.toString();
    if (urlString.endsWith('/api/admin/status')) return createMockResponse({ isAuthenticated: false });
    if (urlString.endsWith('/api/team')) return createMockResponse({ status: 'success', data: [{ id: 1, name: 'Mock Member', role: 'Tester', active: true }] });
    return createMockResponse({}); // Default mock for any other unhandled fetch calls
  });
});

afterEach(() => {
  // jest.restoreAllMocks() will automatically restore the original fetch.
  jest.restoreAllMocks();
  // Clear local storage to prevent state from leaking between tests
  localStorage.clear();
});

describe('App Routing', () => {

  it('should render the home page by default', async () => {
    const user = userEvent.setup();
    render(<App />);

    // First, dismiss the cookie banner which hides the main content by default.
    const declineCookiesButton = await screen.findByRole('button', { name: /neka alla/i });
    await user.click(declineCookiesButton);

    // Use findBy to wait for any async operations in contexts to complete
    expect(await screen.findByRole('heading', { name: /shaping a better future with code/i })).toBeInTheDocument();
  });

  it('should navigate to the team page when the nav link is clicked', async () => {
    // Mock the AuthContext to simulate an authenticated admin user
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
        isAdmin: true,
        isLoading: false,
        logout: jest.fn(),
        openLoginModal: jest.fn(),
        handleLoginSuccess: jest.fn()
    });

    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('link', { name: /our team/i }));
    expect(await screen.findByRole('heading', { name: /our amazing team/i })).toBeInTheDocument();
  });
});

describe('App Admin Authentication', () => {
  it('shows admin login modal when admin button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Dismiss the cookie banner to make main content accessible
    const declineCookiesButton = await screen.findByRole('button', { name: /neka alla/i });
    await user.click(declineCookiesButton);

    const adminButton = await screen.findByTestId('admin-login-button');
    await user.click(adminButton);

    // The App component will now render the AdminLogin modal because the context state will update.
    // We don't need to mock the context here because we are testing the integration.
    expect(await screen.findByRole('heading', { name: /admin login/i })).toBeInTheDocument();
  });
});