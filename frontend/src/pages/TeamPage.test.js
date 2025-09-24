// Use the custom render from test-utils which includes Router and other providers
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamPage from './TeamPage';

describe('TeamPage Component', () => {
  // Mock successful fetch response before each test
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        status: 'success',
        data: [
          { id: 1, name: 'John Doe', role: 'Developer', active: true },
          { id: 2, name: 'Jane Smith', role: 'Designer', active: true },
        ],
      }),
    });
  });

  afterEach(() => {
    // Restore the original fetch implementation
    global.fetch.mockRestore();
  });

  test('renders the main heading and subtitle after data fetching', async () => {
    render(<TeamPage />);

    // Use findBy* queries to wait for the element to appear after the loading state.
    const heading = await screen.findByRole('heading', { name: /our amazing team/i });
    expect(heading).toBeInTheDocument();

    const subtitle = await screen.findByText(/meet the dedicated professionals/i);
    expect(subtitle).toBeInTheDocument();
  });

  test('displays team members after successful fetch', async () => {
    render(<TeamPage />);

    // Wait for a team member's name to appear
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  test('displays a loading message with accessibility attributes', () => {
    // Temporarily override the mock to not resolve immediately
    global.fetch.mockImplementationOnce(() => new Promise(() => {}));
    render(<TeamPage />);
    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
    expect(loadingIndicator).toHaveAttribute('aria-live', 'polite');
    expect(loadingIndicator).toHaveAttribute('aria-label', 'Loading team members');
  });

  test('displays an error message if the fetch fails', async () => {
    // Temporarily mock console.error to silence the expected error message
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock a failed fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<TeamPage />);

    // Wait for the error message to appear
    expect(await screen.findByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText(/error: network response was not ok/i)).toBeInTheDocument();

    // Restore the original console.error implementation
    consoleErrorSpy.mockRestore();
  });

  test('displays a message when no team members are returned', async () => {
    // Mock a successful fetch with an empty data array
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'success', data: [] }),
      })
    );

    render(<TeamPage />);

    // Wait for the "no members" message
    expect(await screen.findByTestId('no-members-message')).toBeInTheDocument();
  });
});