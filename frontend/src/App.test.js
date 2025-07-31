import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

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
});