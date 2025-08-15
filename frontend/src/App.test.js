import { render, screen } from './test-utils';
import App from './App';
import userEvent from '@testing-library/user-event';

// Mock the fetch calls that our contexts will make.
// This allows us to test the integration without making real network requests.
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/admin/status')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ isAuthenticated: false }) });
    }
    if (url.includes('/team.json')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('App Routing', () => {
  it('should render the home page by default', async () => {
    render(<App />);
    // Use findBy to wait for any async operations in contexts to complete
    expect(await screen.findByRole('heading', { name: /shaping a better future with code/i })).toBeInTheDocument();
  });

  it('should navigate to the team page when the nav link is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('link', { name: /our team/i }));
    expect(await screen.findByRole('heading', { name: /our amazing team/i })).toBeInTheDocument();
  });

  it('should navigate to the license page when the button is clicked from the homepage', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: /knowit license management/i }));
    expect(await screen.findByRole('heading', { name: /license page/i })).toBeInTheDocument();
  });
});

describe('App Admin Authentication', () => {
  it('shows admin login modal when admin button is clicked', async () => {
    render(<App />);

    const adminButton = await screen.findByTestId('admin-login-button');
    await userEvent.click(adminButton);

    // The App component will now render the AdminLogin modal because the context state will update.
    // We don't need to mock the context here because we are testing the integration.
    expect(await screen.findByRole('heading', { name: /admin login/i })).toBeInTheDocument();
  });
});