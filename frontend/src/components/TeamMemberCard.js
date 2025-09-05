import PropTypes from 'prop-types';

function TeamMemberCard({ member }) {
  // Fallback to a placeholder image if the original image fails to load.
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/400x400/cccccc/333333?text=Profile";
  };

  return (
    // Use an `article` for semantic HTML, as this is a self-contained piece of content.
    <article
      className="team-member-card bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105"
      aria-labelledby={`member-name-${member.id || member.name}`}
    >
      <img
        src={member.profilePicture}
        alt={member.name}
        className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-500"
        onError={handleImageError}
      />
      <h2 id={`member-name-${member.id || member.name}`} className="member-name text-xl font-bold text-gray-800 mb-1">
        {member.name}
      </h2>
      <p className="member-role text-md text-blue-600 font-medium">
        {member.role}
      </p>
      {/* Conditionally render the LinkedIn link if the URL exists */}
      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="member-linkedin-link mt-4 text-blue-500 hover:text-blue-700 font-semibold"
          aria-label={`View ${member.name}'s LinkedIn profile`}
        >
          View LinkedIn Profile
        </a>
      )}
    </article>
  );
}

TeamMemberCard.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.number,
    profilePicture: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    linkedinUrl: PropTypes.string, // linkedinUrl is optional
  }).isRequired,
};

export default TeamMemberCard;