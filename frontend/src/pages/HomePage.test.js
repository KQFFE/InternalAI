import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'jest-axe';
import HomePage from './HomePage';

it('should have no accessibility violations on the home page', async () => {
  // Render the component
  const { container } = render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

  // Run axe on the rendered HTML
  const results = await axe(container);

  // Assert that there are no violations
  expect(results).toHaveNoViolations();
});