import { useTeam } from '../hooks/useTeam';
import TeamMemberCard from './TeamMemberCard';

function TeamList({ activeOnly = false }) {
  const { team, loading, error } = useTeam({ activeOnly });

  if (loading) {
    return <div>Loading team...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (team.length === 0) {
    return <p className="text-gray-400 italic text-center col-span-full">No team members to display.</p>;
  }

  return (
    <div className="team-grid">
      {team.map(member => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}

export default TeamList;