import { useTeamData } from '../hooks/useTeamData';

// These are example components you might have in your `src/components/` folder.
// import TeamGrid from '../components/TeamGrid';
// import Spinner from '../components/Spinner';
// import ErrorMessage from '../components/ErrorMessage';

const HomePage = () => {
  const { team, loading, error } = useTeamData();

  if (loading) {
    return <div>Loading team...</div>; // Replace with <Spinner />
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Replace with <ErrorMessage />
  }

  return (
    <div className="home-page">
      <h1>Our Team</h1>
      {/* This would be your component to display the team members */}
      {/* <TeamGrid members={team} /> */}
      <pre>{JSON.stringify(team, null, 2)}</pre>
    </div>
  );
};

export default HomePage;