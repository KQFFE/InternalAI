import { render, screen } from '../test-utils';
import TeamPage from './TeamPage';

// Mock the child component to isolate the test to what TeamPage itself renders.
jest.mock('../components/TeamList', () => () => <div>Mocked TeamList</div>);

describe('TeamPage', () => {
  it('renders the main heading and subtitle', () => {
    render(<TeamPage />);
    expect(screen.getByRole('heading', { name: /our amazing team/i })).toBeInTheDocument();
    expect(screen.getByText(/meet the dedicated professionals/i)).toBeInTheDocument();
  });

  it('renders the TeamList component', () => {
    render(<TeamPage />);
    expect(screen.getByText('Mocked TeamList')).toBeInTheDocument();
  });
});