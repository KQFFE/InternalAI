import React from 'react';
// Use the custom render from test-utils which includes Router and other providers
import { render, screen } from '../test-utils';
import TeamPage from './TeamPage';

// Mock the TeamList component to isolate TeamPage tests
jest.mock('../components/TeamList', () => {
    // The mock returns a simple div with a test ID so we can find it.
    // The props it receives (like activeOnly) can also be tested.
    return function MockedTeamList({ activeOnly }) {
        return <div data-testid="mock-team-list" data-active-only={String(activeOnly)}></div>;
    };
});

describe('TeamPage Component', () => {
    test('renders the main heading and subtitle', () => {
        render(<TeamPage />);
        
        // Check for the H1 title
        expect(screen.getByRole('heading', { name: /our amazing team/i, level: 1 })).toBeInTheDocument();
        
        // Check for the subtitle paragraph
        expect(screen.getByText(/meet the dedicated professionals/i)).toBeInTheDocument();
    });

    test('renders the TeamList component and passes activeOnly prop', () => {
        render(<TeamPage />);

        // Check that our mocked TeamList is rendered
        const mockedTeamList = screen.getByTestId('mock-team-list');
        expect(mockedTeamList).toBeInTheDocument();

        // Check that the activeOnly prop was passed correctly
        expect(mockedTeamList).toHaveAttribute('data-active-only', 'true');
    });
});