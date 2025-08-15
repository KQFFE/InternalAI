import React from 'react';
import { useTeam } from '../hooks/useTeam';
import TeamMemberCard from './TeamMemberCard';
// You can create a corresponding CSS file for component-specific styles
// import './TeamList.css';

function TeamList({ activeOnly = false }) {
  const { team, loading, error } = useTeam({ activeOnly });

  if (loading) {
    return <div>Loading team...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
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