import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import TeamList from './TeamList';

// Mock fetch globally
global.fetch = jest.fn();

// Helper to mock fetch requests.
const mockFetch = (teamDataOutcome) => {
    global.fetch.mockImplementation((url) => {
        if (url.includes('/api/team')) {
            if (teamDataOutcome instanceof Error) {
                return Promise.reject(teamDataOutcome);
            }
            if (teamDataOutcome && teamDataOutcome.ok === false) {
                return Promise.resolve({
                    ok: false,
                    status: teamDataOutcome.status,
                    json: () => Promise.resolve({ status: 'error', message: 'Server error' }),
                });
            }
            // The mock should return ALL data. The component is responsible for filtering.
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    status: 'success',
                    data: teamDataOutcome, // Pass the raw, unfiltered data
                    count: Array.isArray(teamDataOutcome) ? teamDataOutcome.length : 0,
                }),
            });
        }
        return Promise.reject(new Error(`Unhandled fetch request in test: ${url}`));
    });
};

// Mock team data for testing
const mockTeamData = [
    { name: 'John Doe', role: 'Senior Developer', profilePicture: '/img/john-doe.jpg', linkedinUrl: 'https://linkedin.com/in/johndoe', active: true },
    { name: 'Jane Smith', role: 'Product Manager', profilePicture: '/img/jane-smith.jpg', linkedinUrl: 'https://linkedin.com/in/janesmith', active: true },
    { name: 'Bob Wilson', role: 'Designer', profilePicture: '/img/bob-wilson.jpg', linkedinUrl: null, active: false }
];

describe('TeamList Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    test('fetches team data from /api/team on mount', async () => {
        mockFetch(mockTeamData);
        render(<TeamList activeOnly={true} />);
        await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/team'));
    });

    test('displays loading message initially', () => {
        // Mock a fetch that never resolves
        global.fetch.mockImplementation(() => new Promise(() => {}));
        render(<TeamList activeOnly={true} />);
        expect(screen.getByText('Loading team members...')).toBeInTheDocument();
    });

    test('renders only active team members when activeOnly is true', async () => {
        mockFetch(mockTeamData);
        render(<TeamList activeOnly={true} />);
        expect(await screen.findByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
    });

    test('renders all team members when activeOnly is false', async () => {
        mockFetch(mockTeamData);
        render(<TeamList activeOnly={false} />);
        expect(await screen.findByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    test('displays error message on fetch network error', async () => {
        mockFetch(new Error('Network Failure'));
        render(<TeamList activeOnly={true} />);
        const errorMessage = await screen.findByText("Failed to load team members. Please try again later.");
        expect(errorMessage).toBeInTheDocument();
        expect(console.error).toHaveBeenCalledWith("Could not fetch team data: ", expect.any(Error));
    });

    test('displays error message when response is not ok', async () => {
        mockFetch({ ok: false, status: 500 });
        render(<TeamList activeOnly={true} />);
        const errorMessage = await screen.findByText("Failed to load team members. Please try again later.");
        expect(errorMessage).toBeInTheDocument();
    });

    test('displays message when no active team members are returned', async () => {
        mockFetch([]); // API returns an empty array
        render(<TeamList activeOnly={true} />);
        const emptyMessage = await screen.findByText('No active team members to display at the moment.');
        expect(emptyMessage).toBeInTheDocument();
    });

    test('handles image loading errors with a fallback', async () => {
        mockFetch(mockTeamData);
        render(<TeamList activeOnly={true} />);
        const profileImage = await screen.findByAltText('Profile of John Doe');
        fireEvent.error(profileImage);
        expect(profileImage).toHaveAttribute('src', 'https://placehold.co/400x400/cccccc/333333?text=Profile');
    });
});