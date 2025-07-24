import { render, screen } from '@testing-library/react';
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
    const homeLink = screen.getByRole('link', { name: /Home/i });
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
    const address = screen.getByRole('group'); // address elements have group role
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
    expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute('id', 'nav-home');
    expect(screen.getByRole('link', { name: /Services/i })).toHaveAttribute('id', 'nav-services');
    expect(screen.getByRole('link', { name: /About/i })).toHaveAttribute('id', 'nav-about');
    expect(screen.getByRole('link', { name: /Team/i })).toHaveAttribute('id', 'nav-team');
    expect(screen.getByRole('link', { name: /License/i })).toHaveAttribute('id', 'nav-license');
    expect(screen.getByRole('link', { name: /Contact/i })).toHaveAttribute('id', 'nav-contact');
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
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
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
    const copyright = screen.getByText(/© 2023 Knowit AB/i);
    expect(copyright).toHaveAttribute('id', 'footer-copyright');
});

test('renders more news link with proper accessibility', () => {
    render(<App />);
    const moreNewsLink = screen.getByRole('link', { name: /View all news articles/i });
    expect(moreNewsLink).toHaveAttribute('id', 'more-news-link');
});

test('renders gradient box items with proper IDs', () => {
    render(<App />);
    // Find the heading, then check its parent container has the right ID
    const customerHeading = screen.getByRole('heading', { name: /We create unique customer experiences/i });
    const innovationHeading = screen.getByRole('heading', { name: /Innovation through collaboration/i });

    // Use container queries to find parent elements
    expect(customerHeading.parentElement).toHaveAttribute('id', 'customer-experience-highlight');
    expect(innovationHeading.parentElement).toHaveAttribute('id', 'innovation-highlight');
});