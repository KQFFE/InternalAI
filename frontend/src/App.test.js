import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main heading', () => {
  render(<App />);
  // Look for the main title on the page
  const headingElement = screen.getByText(/Shaping a better future with code/i);
  expect(headingElement).toBeInTheDocument();
});

// You might want to add more tests later, for example:
test('renders the "Home" navigation link', () => {
  render(<App />);
  const homeLink = screen.getByRole('link', { name: /Home/i });
  expect(homeLink).toBeInTheDocument();
});

test('renders the "News" section heading', () => {
  render(<App />);
  const newsHeading = screen.getByRole('heading', { name: /News/i });
  expect(newsHeading).toBeInTheDocument();
});