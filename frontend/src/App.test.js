import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders the main heading', () => {
    render(<App />);
    // Look for the main title using the new ID
    const headingElement = screen.getByRole('heading', { level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent('Shaping a better future with code');
});

test('renders the main heading with proper ID', () => {
    render(<App />);
    const headingElement = screen.getByRole('heading', { level: 1 });
    expect(headingElement).toHaveAttribute('id', 'main-heading');
});

test('renders the "Home" navigation link', () => {
    render(<App />);
    const homeLink = screen.getByRole('link', { name: /Home/i, current: 'page' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('id', 'nav-home');
});

test('renders the "News" section heading', () => {
    render(<App />);
    const newsHeading = screen.getByRole('heading', { name: /News/i });
    expect(newsHeading).toBeInTheDocument();
    expect(newsHeading).toHaveAttribute('id', 'news-heading');
});

test('renders team button with proper accessibility attributes', () => {
    render(<App />);
    const teamButton = screen.getByRole('button', { name: /Read more about our team/i });
    expect(teamButton).toBeInTheDocument();
    expect(teamButton).toHaveAttribute('id', 'team-button');
    expect(teamButton).toHaveAttribute('aria-label', 'Read more about our team');
});

test('renders license button with proper accessibility attributes', () => {
    render(<App />);
    const licenseButton = screen.getByRole('button', { name: /Knowit License Management/i });
    expect(licenseButton).toBeInTheDocument();
    expect(licenseButton).toHaveAttribute('id', 'license-button');
    expect(licenseButton).toHaveAttribute('aria-label', 'Access Knowit License Management system');
});

test('renders main logo with proper accessibility attributes', () => {
    render(<App />);
    const logo = screen.getByRole('img', { name: /Knowit company logo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('id', 'main-logo');
    expect(logo).toHaveAttribute('alt', 'Knowit company logo');
});

test('renders navigation with proper ARIA attributes', () => {
    render(<App />);
    const navigation = screen.getByRole('navigation', { name: /Main navigation/i });
    expect(navigation).toBeInTheDocument();
    expect(navigation).toHaveAttribute('aria-label', 'Main navigation');
});

test('renders company highlights section', () => {
    render(<App />);
    const highlightsSection = screen.getByLabelText(/Company highlights/i);
    expect(highlightsSection).toBeInTheDocument();
    expect(highlightsSection).toHaveAttribute('id', 'company-highlights');
});

test('renders gradient box titles with proper heading levels', () => {
    render(<App />);
    const customerTitle = screen.getByRole('heading', { name: /We create unique customer experiences/i });
    const innovationTitle = screen.getByRole('heading', { name: /Innovation through collaboration/i });

    expect(customerTitle).toBeInTheDocument();
    expect(innovationTitle).toBeInTheDocument();

    // Check they are h2 elements
    expect(customerTitle.tagName).toBe('H2');
    expect(innovationTitle.tagName).toBe('H2');
});

test('renders footer with proper semantic structure', () => {
    render(<App />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute('aria-label', 'Site footer');
});

test('renders contact information in address element', () => {
    render(<App />);
    // Use Testing Library methods instead of direct DOM access
    const footer = screen.getByRole('contentinfo');
    const address = within(footer).getByRole('group'); // or use getByTestId if you add data-testid="address"
    expect(address).toBeInTheDocument();
});

test('renders news section with proper structure', () => {
    render(<App />);
    const newsSection = screen.getByLabelText(/Latest news/i);
    expect(newsSection).toBeInTheDocument();
    expect(newsSection).toHaveAttribute('id', 'news-section');
});

test('renders proper heading hierarchy', () => {
    render(<App />);

    // Check h1 exists and is unique
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements).toHaveLength(1);

    // Check h2 elements exist
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    expect(h2Elements.length).toBeGreaterThan(0);

    // Check h3 elements exist
    const h3Elements = screen.getAllByRole('heading', { level: 3 });
    expect(h3Elements.length).toBeGreaterThan(0);
});

test('renders all navigation links with proper IDs', () => {
    render(<App />);

    // Get the main navigation container first
    const mainNav = screen.getByRole('navigation', { name: /Main navigation/i });

    // Links (actual navigation)
    const homeLink = within(mainNav).getByRole('link', { name: /Home/i });
    const teamLink = within(mainNav).getByRole('link', { name: /Team/i });
    const licenseLink = within(mainNav).getByRole('link', { name: /License/i }); // ← This should be link, not button

    // Buttons (functionality)
    const servicesButton = within(mainNav).getByRole('button', { name: /Services/i });
    const aboutButton = within(mainNav).getByRole('button', { name: /About/i });
    const contactButton = within(mainNav).getByRole('button', { name: /Contact/i });

    expect(homeLink).toHaveAttribute('id', 'nav-home');
    expect(servicesButton).toHaveAttribute('id', 'nav-services');
    expect(aboutButton).toHaveAttribute('id', 'nav-about');
    expect(teamLink).toHaveAttribute('id', 'nav-team');
    expect(licenseLink).toHaveAttribute('id', 'nav-license'); // ← Changed from button to link
    expect(contactButton).toHaveAttribute('id', 'nav-contact');
});

test('renders footer links with proper IDs', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /Follow us on LinkedIn/i })).toHaveAttribute('id', 'footer-linkedin');
    expect(screen.getByRole('link', { name: /Follow us on Facebook/i })).toHaveAttribute('id', 'footer-facebook');
    expect(screen.getByRole('link', { name: /Follow us on Instagram/i })).toHaveAttribute('id', 'footer-instagram');
});

test('renders contact links with proper accessibility', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /Call us at/i })).toHaveAttribute('id', 'contact-phone');
    expect(screen.getByRole('link', { name: /Send email to/i })).toHaveAttribute('id', 'contact-email');
});

test('renders all buttons with proper type attributes', () => {
    render(<App />);
    const teamButton = screen.getByRole('button', { name: /Read more about our team/i });
    const licenseButton = screen.getByRole('button', { name: /Knowit License Management/i });

    expect(teamButton).toHaveAttribute('type', 'button');
    expect(licenseButton).toHaveAttribute('type', 'button');
});

test('renders news items with proper semantic structure', () => {
    render(<App />);
    // Check that news items are properly structured as articles
    const newsItems = screen.getAllByRole('listitem');
    expect(newsItems.length).toBeGreaterThan(0);

    // Check that time elements have proper datetime attributes
    const timeElements = screen.getAllByRole('time');
    timeElements.forEach(timeElement => {
        expect(timeElement).toHaveAttribute('datetime');
    });
});

test('renders proper ARIA landmarks', () => {
    render(<App />);

    // Check for proper landmark roles
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer

    // Check specific navigation elements
    expect(screen.getByRole('navigation', { name: /Main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /About Knowit links/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /Business areas links/i })).toBeInTheDocument();
});

test('renders hero section with proper semantic structure', () => {
    render(<App />);

    // Check hero section has proper aria-label
    const heroSection = screen.getByLabelText(/Hero section/i);
    expect(heroSection).toBeInTheDocument();

    // Check main content area
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
});

test('renders copyright text with proper ID', () => {
    render(<App />);
    // Use Testing Library methods instead of direct DOM access
    const copyright = screen.getByText('© 2023 Knowit AB');
    expect(copyright).toBeInTheDocument();
    expect(copyright).toHaveAttribute('id', 'footer-copyright');
});

test('renders more news link with proper accessibility', () => {
    render(<App />);
    const moreNewsButton = screen.getByRole('button', { name: /View all news articles/i }); // ← Changed to button
    expect(moreNewsButton).toHaveAttribute('id', 'more-news-link');
    expect(moreNewsButton).toHaveAttribute('type', 'button');
    expect(moreNewsButton).toHaveAttribute('aria-label', 'View all news articles');
});

test('renders gradient box items with proper IDs', () => {
    render(<App />);
    const customerExperienceHighlight = screen.getByTestId('customer-experience-highlight');
    const innovationHighlight = screen.getByTestId('innovation-highlight');

    expect(customerExperienceHighlight).toBeInTheDocument();
    expect(customerExperienceHighlight).toHaveAttribute('id', 'customer-experience-highlight');
    expect(innovationHighlight).toBeInTheDocument();
    expect(innovationHighlight).toHaveAttribute('id', 'innovation-highlight');
});