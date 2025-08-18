import React from 'react';
import { render, screen } from '../test-utils';
import TeamList from './TeamList';
import { useTeam } from '../hooks/useTeam';

// Mock the custom hook. This is the central part of testing components that use hooks.
jest.mock('../hooks/useTeam');

// Mock the child component to isolate the TeamList component's logic.
// We don't need to test the details of TeamMemberCard here.
jest.mock('./TeamMemberCard', () => {
    // The mock returns a simple div with the member's name and a test ID.
    return function MockedTeamMemberCard({ member }) {
        return <div data-testid="team-member-card">{member.name}</div>;
    };
});

describe('TeamList Component', () => {
    beforeEach(() => {
        // Clear mock history before each test
        useTeam.mockClear();
    });

    test('displays loading message when the useTeam hook is in a loading state', () => {
        // Arrange: Configure the mock hook to return a loading state.
        useTeam.mockReturnValue({
            team: [],
            loading: true,
            error: null,
        });

        // Act: Render the component.
        render(<TeamList />);

        // Assert: Check that the loading message is displayed.
        expect(screen.getByText('Loading team...')).toBeInTheDocument();
    });

    test('displays an error message when the useTeam hook returns an error', () => {
        // Arrange: Configure the mock hook to return an error.
        const mockError = new Error('Failed to fetch team data');
        useTeam.mockReturnValue({
            team: [],
            loading: false,
            error: mockError,
        });

        // Act
        render(<TeamList />);

        // Assert: Check that the error message is displayed.
        expect(screen.getByText(`Error: ${mockError.message}`)).toBeInTheDocument();
    });

    test('renders a list of team members when the useTeam hook returns data', () => {
        // Arrange: Configure the mock hook to return team data.
        const mockTeam = [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Smith' },
        ];
        useTeam.mockReturnValue({
            team: mockTeam,
            loading: false,
            error: null,
        });

        // Act
        render(<TeamList />);

        // Assert: Check that the correct number of member cards are rendered.
        const memberCards = screen.getAllByTestId('team-member-card');
        expect(memberCards).toHaveLength(2);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    test('displays an empty message when the useTeam hook returns no data', () => {
        // Arrange: Configure the mock hook to return an empty array.
        useTeam.mockReturnValue({
            team: [],
            loading: false,
            error: null,
        });

        // Act
        render(<TeamList />);

        // Assert: Check that the empty message is displayed.
        expect(screen.getByText('No team members to display.')).toBeInTheDocument();

        // And that no member cards are rendered.
        expect(screen.queryByTestId('team-member-card')).not.toBeInTheDocument();
    });
});