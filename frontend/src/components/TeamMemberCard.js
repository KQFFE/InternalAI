import PropTypes from 'prop-types';
// You can create a corresponding CSS file for component-specific styles
// import './TeamMemberCard.css';

function TeamMemberCard({ member }) {
  return (
    <div className="team-member-card">
      <img src={member.profilePicture} alt={`Profile of ${member.name}`} />
      <h2>{member.name}</h2>
      <p>{member.role}</p>
      <p>{member.description}</p>
    </div>
  );
}

TeamMemberCard.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.number, // Assuming ID might not always be present
    profilePicture: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default TeamMemberCard;