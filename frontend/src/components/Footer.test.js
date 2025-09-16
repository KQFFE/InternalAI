import { render, screen, fireEvent } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('should call openCookiePolicy when "Cookie policy" button is clicked', () => {
    const openCookiePolicy = jest.fn();
    render(<Footer openCookiePolicy={openCookiePolicy} />);
    fireEvent.click(screen.getByText(/Cookie policy/i));
    expect(openCookiePolicy).toHaveBeenCalled();
  });
});
