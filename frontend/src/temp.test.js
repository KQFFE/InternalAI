import React from 'react';
import { render, screen } from '@testing-library/react';

test('dummy test to check React import', () => {
  render(<div>Hello</div>);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});