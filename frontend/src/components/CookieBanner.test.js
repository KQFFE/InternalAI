import { render, screen, fireEvent } from '@testing-library/react';
import CookieBanner from './CookieBanner';

describe('CookieBanner', () => {
  const defaultProps = {
    show: true,
    onAcceptAll: jest.fn(),
    onDeclineAll: jest.fn(),
    onSavePreferences: jest.fn(),
    functionalityCookies: false,
    setFunctionalityCookies: jest.fn(),
    statisticsCookies: false,
    setStatisticsCookies: jest.fn(),
    marketingCookies: false,
    setMarketingCookies: jest.fn(),
    showPolicy: false,
    setShowPolicy: jest.fn(),
  };

  it('should not be visible when show is false', () => {
    render(<CookieBanner {...defaultProps} show={false} />);
    expect(screen.queryByText(/Vi använder cookies/i)).not.toBeInTheDocument();
  });

  it('should be visible when show is true', () => {
    render(<CookieBanner {...defaultProps} show={true} />);
    expect(screen.getByText(/Vi använder cookies/i)).toBeInTheDocument();
  });

  it('should show policy view when "Läs mer om cookies" is clicked', () => {
    const { rerender } = render(<CookieBanner {...defaultProps} />);

    fireEvent.click(screen.getByText(/Läs mer om cookies/i));
    expect(defaultProps.setShowPolicy).toHaveBeenCalledWith(true);

    // Re-render with the new showPolicy prop to check if the view changes
    rerender(<CookieBanner {...defaultProps} showPolicy={true} />);
    expect(screen.getByRole('heading', { name: /Policy för kakor/i, level: 2 })).toBeInTheDocument();
  });
});