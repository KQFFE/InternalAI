import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

// Mock localStorage to simulate browser behavior in the test environment
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key) {
      delete store[key];
    },
    getAll: function () {
      return store;
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App Component', () => {
  it('renders main heading', () => {
    render(<App />);
    const mainHeading = screen.getByRole('heading', { name: /Shaping a better future with code/i });
    expect(mainHeading).toBeInTheDocument();
  });

  it('renders main subheading', () => {
    render(<App />);
    const subheadings = screen.getAllByText(/We are a digitalization company that develops solutions and services/i);
    // Assuming the main subheading is the first one found
    expect(subheadings[0]).toBeInTheDocument();
  });

  it('renders "Read more about our team" button', () => {
    render(<App />);
    const teamButton = screen.getByRole('button', { name: /Read more about our team/i });
    expect(teamButton).toBeInTheDocument();
  });

  it('renders "Knowit License Management" button', () => {
    render(<App />);
    const licenseButton = screen.getByRole('button', { name: /Knowit License Management/i });
    expect(licenseButton).toBeInTheDocument();
  });

  it('renders company highlight boxes', () => {
    render(<App />);
    const customerExperienceHighlight = screen.getByTestId('customer-experience-highlight');
    const innovationHighlight = screen.getByTestId('innovation-highlight');
    expect(customerExperienceHighlight).toBeInTheDocument();
    expect(innovationHighlight).toBeInTheDocument();
  });

  it('renders news section with heading', () => {
    render(<App />);
    const newsHeading = screen.getByRole('heading', { name: /News/i });
    expect(newsHeading).toBeInTheDocument();
  });

  it('renders the news items', () => {
    render(<App />);
    const newsItem1 = screen.getByText(/Kristoffer, Sasan, Sakshi and Johanna is creating a landing page/i);
    const newsItem2 = screen.getByText(/The team request earlier vacation leave/i);
    expect(newsItem1).toBeInTheDocument();
    expect(newsItem2).toBeInTheDocument();
  });

  it('renders "More news" link', () => {
    render(<App />);
    const moreNewsLink = screen.getByText(/More news/i);
    expect(moreNewsLink).toBeInTheDocument();
  });

  it('renders "Become one of us" section', () => {
    render(<App />);
    const careersHeading = screen.getByRole('heading', { name: /Become one of us/i });
    expect(careersHeading).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /Cookie Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/Hantering av personuppgifter/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Whistleblower/i })).toBeInTheDocument();
    expect(screen.getByText('© 2023 Knowit AB')).toBeInTheDocument();
  });

  it('renders footer social media links with correct attributes', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /Follow us on LinkedIn/i })).toHaveAttribute('id', 'footer-linkedin');
    expect(screen.getByRole('link', { name: /Follow us on Facebook/i })).toHaveAttribute('id', 'footer-facebook');
    expect(screen.getByRole('link', { name: /Follow us on Instagram/i })).toHaveAttribute('id', 'footer-instagram');
  });
});

// --- NEW TEST SUITE FOR COOKIE BANNER ---
describe('CookieBanner', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the cookie banner when no consent is given', async () => {
    render(<App />);
    const cookieBanner = await screen.findByText(/Vi använder cookies/i);
    expect(cookieBanner).toBeInTheDocument();
  });

  it('accepts all cookies and hides the banner', async () => {
    render(<App />);
    const acceptAllButton = screen.getByRole('button', { name: /Godkänn alla/i });
    fireEvent.click(acceptAllButton);

    await waitFor(() => expect(screen.queryByRole('dialog', { name: /Vi använder cookies/i })).not.toBeInTheDocument());

    expect(localStorage.getItem('cookieConsent')).toBe('accepted');
    expect(localStorage.getItem('functionalityCookies')).toBe('true');
    expect(localStorage.getItem('statisticsCookies')).toBe('true');
    expect(localStorage.getItem('marketingCookies')).toBe('true');
  });

  it('declines all cookies and hides the banner', async () => {
    render(<App />);
    const declineAllButton = screen.getByRole('button', { name: /Neka alla/i });
    fireEvent.click(declineAllButton);

    await waitFor(() => expect(screen.queryByRole('dialog', { name: /Vi använder cookies/i })).not.toBeInTheDocument());

    expect(localStorage.getItem('cookieConsent')).toBe('denied');
    expect(localStorage.getItem('functionalityCookies')).toBe('false');
    expect(localStorage.getItem('statisticsCookies')).toBe('false');
    expect(localStorage.getItem('marketingCookies')).toBe('false');
  });

  it('saves preferences and hides the banner', async () => {
    render(<App />);
    const statisticsCheckbox = screen.getByRole('checkbox', { name: /Statistiska/i });
    fireEvent.click(statisticsCheckbox);

    const savePreferencesButton = screen.getByRole('button', { name: /Spara inställningar/i });
    fireEvent.click(savePreferencesButton);

    await waitFor(() => expect(screen.queryByRole('dialog', { name: /Vi använder cookies/i })).not.toBeInTheDocument());

    expect(localStorage.getItem('cookieConsent')).toBe('custom');
    expect(localStorage.getItem('functionalityCookies')).toBe('false');
    expect(localStorage.getItem('statisticsCookies')).toBe('true');
    expect(localStorage.getItem('marketingCookies')).toBe('false');
  });

  it('does not render the cookie banner if consent is already given', async () => {
    localStorage.setItem('cookieConsent', 'accepted');
    render(<App />);

    const cookieBanner = screen.queryByRole('dialog', { name: /Vi använder cookies/i });
    expect(cookieBanner).not.toBeInTheDocument();
  });

  it('shows and hides the details section', async () => {
    render(<App />);
    // Details are initially hidden
    expect(screen.queryByRole('heading', { name: /Nödvändiga/i })).not.toBeInTheDocument();

    const showDetailsButton = screen.getByRole('button', { name: /Visa detaljer/i });
    fireEvent.click(showDetailsButton);

    // Details are now visible
    expect(await screen.findByRole('heading', { name: /Nödvändiga/i })).toBeInTheDocument();

    const hideDetailsButton = screen.getByRole('button', { name: /Dölj detaljer/i });
    fireEvent.click(hideDetailsButton);

    // Details are hidden again
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Nödvändiga/i })).not.toBeInTheDocument();
    });
  });

  it('navigates to the policy page and back', async () => {
    render(<App />);

    // Go to policy page
    const policyButton = screen.getByRole('button', { name: /Läs mer om cookies/i });
    fireEvent.click(policyButton);

    expect(await screen.findByRole('heading', { name: /Policy för kakor/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Vi använder cookies/i })).not.toBeInTheDocument();

    // Go back to settings
    const settingsButton = screen.getByRole('button', { name: /Inställningar/i });
    fireEvent.click(settingsButton);

    expect(await screen.findByRole('heading', { name: /Vi använder cookies/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Policy för kakor/i })).not.toBeInTheDocument();
  });

  it('adds and removes "modal-open" class from body', async () => {
    render(<App />);
    expect(document.body).toHaveClass('modal-open');

    const acceptAllButton = screen.getAllByRole('button', { name: /Godkänn alla/i })[0];
    fireEvent.click(acceptAllButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Vi använder cookies/i })).not.toBeInTheDocument();
    });

    expect(document.body).not.toHaveClass('modal-open');
  });

  it('expands and collapses a cookie category detail', async () => {
    render(<App />);

    // Show details first
    const showDetailsButton = screen.getByRole('button', { name: /Visa detaljer/i });
    fireEvent.click(showDetailsButton);

    // Find the button to expand the "Nödvändiga" category
    const necessaryCategoryButton = await screen.findByRole('button', { name: /Nödvändiga/i });

    // The description container should be hidden initially
    const descriptionContainer = screen.getByTestId('description-container-necessary');
    expect(descriptionContainer).not.toBeVisible();

    // Click to expand
    fireEvent.click(necessaryCategoryButton);

    // Now it should be visible
    await waitFor(() => {
      expect(descriptionContainer).toBeVisible();
    });

    // Click again to collapse
    fireEvent.click(necessaryCategoryButton);

    await waitFor(() => {
      expect(descriptionContainer).not.toBeVisible();
    });
  });
});

describe('HomePageContent interactions for function coverage', () => {
  beforeEach(() => {
    // Ensure a clean slate for navigation tests
    window.history.pushState({}, 'Home', '/');
  });

  it('handles clicks on news and footer buttons', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    render(<App />);

    // These buttons have empty or console.log handlers. Clicking them covers the function call.
    fireEvent.click(screen.getByRole('button', { name: /Read article about Summer Project 2025 from June 26/i }));
    fireEvent.click(screen.getByRole('button', { name: /Read article about Summer Project 2025 from July 1/i }));
    expect(consoleSpy).toHaveBeenCalledWith('News item 2 clicked');

    fireEvent.click(screen.getByRole('button', { name: /View all news articles/i }));
    expect(consoleSpy).toHaveBeenCalledWith('More news clicked');

    fireEvent.click(screen.getByRole('button', { name: /Find your new job at Knowit/i }));
    // No assertion needed for the empty handler, just ensuring it's clicked without error.

    consoleSpy.mockRestore();
  });

  it('navigates to team and license pages from hero buttons', async () => {
    // Mock fetch for team.json to prevent errors when navigating to the team page
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ name: 'Test Member', role: 'Tester', active: true, profilePicture: 'test.jpg' }]),
      })
    );

    render(<App />);

    // 1. Test navigation to Team Page
    fireEvent.click(screen.getByRole('button', { name: /Read more about our team/i }));

    // Assert that we navigated to the team page
    expect(await screen.findByRole('heading', { name: /Our Amazing Team/i })).toBeInTheDocument();

    // 2. Navigate back home to test the other button
    fireEvent.click(screen.getByRole('link', { name: /Go to homepage/i }));

    // Assert we are back on the home page
    expect(await screen.findByRole('heading', { name: /Shaping a better future with code/i })).toBeInTheDocument();

    // 3. Test navigation to License Page
    fireEvent.click(screen.getByRole('button', { name: /Knowit License Management/i }));

    // Assert that we navigated to the license page
    expect(await screen.findByRole('heading', { name: /License Page/i })).toBeInTheDocument();

    // Clean up mock
    fetchSpy.mockRestore();
  });

  it('navigates using header links and logo', async () => {
    // Mock fetch for team.json to prevent errors when navigating to the team page
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ name: 'Test Member', role: 'Tester', active: true, profilePicture: 'test.jpg' }]),
      })
    );

    render(<App />);

    // 1. Navigate to Team Page using header link from the homepage
    fireEvent.click(screen.getByRole('link', { name: /Our team page/i }));
    expect(await screen.findByRole('heading', { name: /Our Amazing Team/i })).toBeInTheDocument();

    // 2. Navigate back home using the logo link on the Team Page
    fireEvent.click(screen.getByRole('link', { name: /Go to homepage/i }));
    expect(await screen.findByRole('heading', { name: /Shaping a better future with code/i })).toBeInTheDocument();

    // 3. NOW on the homepage, click the logo again to cover line 35 in App.js
    fireEvent.click(screen.getByRole('link', { name: /Go to homepage/i }));
    expect(await screen.findByRole('heading', { name: /Shaping a better future with code/i })).toBeInTheDocument();

    // 4. Navigate to License Page using header link from the homepage
    fireEvent.click(screen.getByRole('link', { name: /License information/i }));
    expect(await screen.findByRole('heading', { name: /License Page/i })).toBeInTheDocument();

    // Clean up mock
    fetchSpy.mockRestore();
  });
});

describe('CookieBanner interactions for function coverage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows changing multiple preferences and saving', async () => {
    render(<App />);
    expect(screen.getByText(/Vi använder cookies/i)).toBeInTheDocument();

    // Find the "Funktionella" and "Marketing" toggles and click them
    const functionalToggle = screen.getByLabelText(/Funktionella/i);
    const marketingToggle = screen.getByLabelText(/Marketing/i);

    await userEvent.click(functionalToggle);
    await userEvent.click(marketingToggle);

    const saveButton = screen.getByRole('button', { name: /Spara inställningar/i });
    await userEvent.click(saveButton);

    expect(localStorage.getItem('cookieConsent')).toBe('custom');
    expect(localStorage.getItem('functionalityCookies')).toBe('true');
    expect(localStorage.getItem('marketingCookies')).toBe('true');
  });
});

describe('Admin Authentication Integration', () => {
    beforeEach(() => {
        localStorage.clear();
        // Mock fetch for admin API calls
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('renders admin button when not authenticated', () => {
        render(<App />);
        const adminButton = screen.getByRole('button', { name: /Admin/i });
        expect(adminButton).toBeInTheDocument();
    });

    it('shows admin login modal when admin button is clicked', async () => {
        render(<App />);

        const adminButton = screen.getByRole('button', { name: /Admin/i });
        fireEvent.click(adminButton);

        expect(await screen.findByText('Admin Login')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('handles successful admin login', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: 'Login successful' })
        });

        render(<App />);

        // Open login modal
        fireEvent.click(screen.getByRole('button', { name: /Admin/i }));

        // Fill password and submit
        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(passwordInput, { target: { value: 'admin123' } });
        fireEvent.click(loginButton);

        // Check that admin mode appears
        expect(await screen.findByText('Admin Mode')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
        expect(screen.queryByText('Admin Login')).not.toBeInTheDocument();
    });

    it('handles admin login cancellation', async () => {
        render(<App />);

        // Open login modal
        fireEvent.click(screen.getByRole('button', { name: /Admin/i }));
        expect(screen.getByText('Admin Login')).toBeInTheDocument();

        // Cancel login
        const cancelButton = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(cancelButton);

        // Modal should close
        expect(screen.queryByText('Admin Login')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Admin/i })).toBeInTheDocument();
    });

    it('handles successful admin logout', async () => {
        global.fetch
            .mockResolvedValueOnce({ // Login
                ok: true,
                json: async () => ({ success: true, message: 'Login successful' })
            })
            .mockResolvedValueOnce({ // Logout
                ok: true,
                json: async () => ({ success: true })
            });

        render(<App />);

        // Login first
        fireEvent.click(screen.getByRole('button', { name: /Admin/i }));
        const passwordInput = screen.getByLabelText('Password');
        fireEvent.change(passwordInput, { target: { value: 'admin123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        await screen.findByText('Admin Mode');

        // Now logout
        const logoutButton = screen.getByRole('button', { name: /Logout/i });
        fireEvent.click(logoutButton);

        // FIX: Use a findBy* query for the element you expect to appear.
        // This implicitly handles the waiting and assertion.
        const adminButton = await screen.findByRole('button', { name: /Admin/i });
        expect(adminButton).toBeInTheDocument();

        // For the element that is expected to disappear, a queryBy* is still correct.
        expect(screen.queryByText('Admin Mode')).not.toBeInTheDocument();
    });

    it('handles failed admin logout where response is not ok', async () => {
        global.fetch
            .mockResolvedValueOnce({ // Login
                ok: true,
                json: async () => ({ success: true, message: 'Login successful' })
            })
            .mockResolvedValueOnce({ // Logout fails
                ok: false,
                status: 500,
            });

        render(<App />);

        // Login first
        fireEvent.click(screen.getByRole('button', { name: /Admin/i }));
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));
        await screen.findByText('Admin Mode');

        // Attempt logout
        fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

        // Wait for the fetch call to complete
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

        // The UI should not change because the `if (response.ok)` block is skipped
        expect(screen.getByText('Admin Mode')).toBeInTheDocument();
    });

    it('handles admin logout error gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        global.fetch
            .mockResolvedValueOnce({ // Login
                ok: true,
                json: async () => ({ success: true, message: 'Login successful' })
            })
            .mockRejectedValueOnce(new Error('Network error')); // Logout error

        render(<App />);

        // Login first
        fireEvent.click(screen.getByRole('button', { name: /Admin/i }));
        const passwordInput = screen.getByLabelText('Password');
        fireEvent.change(passwordInput, { target: { value: 'admin123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        await screen.findByText('Admin Mode');

        // Logout with error
        const logoutButton = screen.getByRole('button', { name: /Logout/i });
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('closes login modal when clicking X button', async () => {
        render(<App />);

        // Open login modal
        fireEvent.click(screen.getByRole('button', { name: /Admin/i }));
        expect(screen.getByText('Admin Login')).toBeInTheDocument();

        // Close with X button
        const closeButton = screen.getByRole('button', { name: /Close login modal/i });
        fireEvent.click(closeButton);

        expect(screen.queryByText('Admin Login')).not.toBeInTheDocument();
    });

    it('handles admin button hover effects', () => {
        render(<App />);

        const adminButton = screen.getByRole('button', { name: /Admin/i });

        // Test mouse over
        fireEvent.mouseOver(adminButton);
        expect(adminButton.style.backgroundColor).toBe('rgb(79, 70, 229)'); // #4f46e5

        // Test mouse out
        fireEvent.mouseOut(adminButton);
        expect(adminButton.style.backgroundColor).toBe('rgb(99, 102, 241)'); // #6366f1
    });

    it('handles logout button hover effects', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: 'Login successful' })
        });

        render(<App />);

        // Login first to show logout button
        fireEvent.click(screen.getByRole('button', { name: /Admin/i }));
        const passwordInput = screen.getByLabelText('Password');
        fireEvent.change(passwordInput, { target: { value: 'admin123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        const logoutButton = await screen.findByRole('button', { name: /Logout/i });

        // Test mouse over
        fireEvent.mouseOver(logoutButton);
        expect(logoutButton.style.backgroundColor).toBe('rgb(220, 38, 38)'); // #dc2626

        // Test mouse out  
        fireEvent.mouseOut(logoutButton);
        expect(logoutButton.style.backgroundColor).toBe('rgb(239, 68, 68)'); // #ef4444
    });
});

describe('HomePageContent branch coverage', () => {
    it('applies correct logo class based on the current route', async () => {
        // Mock fetch for team.json to prevent errors when navigating to the team page
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{ name: 'Test Member', role: 'Tester', active: true, profilePicture: 'test.jpg' }]),
            })
        );

        render(<App />);

        // On the homepage, the logo should have the 'logo-white' class
        const logo = screen.getByRole('img', { name: /Knowit company logo/i });
        expect(logo).toHaveClass('logo-white');

        // Navigate to the team page
        fireEvent.click(screen.getByRole('link', { name: /Our team page/i }));
        await screen.findByRole('heading', { name: /Our Amazing Team/i });

        // On the team page, the logo should not have the 'logo-white' class
        const logoOnTeamPage = screen.getByRole('img', { name: /Knowit company logo/i });
        expect(logoOnTeamPage).not.toHaveClass('logo-white');
    });
});