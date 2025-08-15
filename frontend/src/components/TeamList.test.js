import { render, screen } from '../test-utils';
import TeamList from './TeamList';
import * as useTeamHook from '../hooks/useTeam'; // Import as object to spy on 'useTeam'

const mockTeamData = [
    { id: 1, name: 'John Doe', role: 'Developer', profilePicture: 'john.jpg', description: '...' },
    { id: 2, name: 'Jane Smith', role: 'Designer', profilePicture: 'jane.jpg', description: '...' },
];

// Spy on the useTeam hook to control its return value in tests
const useTeamSpy = jest.spyOn(useTeamHook, 'useTeam');

describe('TeamList', () => {
    it('displays a loading message when the data is loading', () => {
        useTeamSpy.mockReturnValue({ team: [], loading: true, error: null });
        render(<TeamList />);
        expect(screen.getByText(/loading team.../i)).toBeInTheDocument();
    });

    it('displays an error message if fetching fails', () => {
        const mockError = new Error('Failed to fetch');
        useTeamSpy.mockReturnValue({ team: [], loading: false, error: mockError });
        render(<TeamList />);
        expect(screen.getByText(/error: failed to fetch/i)).toBeInTheDocument();
    });

    it('renders a list of team members on successful fetch', () => {
        useTeamSpy.mockReturnValue({ team: mockTeamData, loading: false, error: null });
        render(<TeamList />);
        
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Developer')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Designer')).toBeInTheDocument();
        
        // Check that the loading and error messages are not present
        expect(screen.queryByText(/loading team.../i)).not.toBeInTheDocument();
        expect(screen.queryByText(/error:/i)).not.toBeInTheDocument();
    });

    it('renders an empty state correctly if no team members are returned', () => {
        useTeamSpy.mockReturnValue({ team: [], loading: false, error: null });
        render(<TeamList />);
        
        // The component renders an empty div, so we check that no member names are present
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
});