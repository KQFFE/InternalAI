// frontend/src/TeamPage.js
import React, { useState, useEffect } from 'react';
import './TeamPage.css'; // Create this CSS file for specific team page styles

function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/team.json') // Assumes team.json is in your frontend/public folder
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const activeTeam = data.filter(member => member.active);
        setTeamMembers(activeTeam);
      })
      .catch(error => {
        console.error("Could not fetch team data: ", error);
        setError("Failed to load team members. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="team-container loading">Loading team data...</div>;
  }

  if (error) {
    return <div className="team-container error">Error: {error}</div>;
  }

  return (
    <div className="team-page-container">
      <h1 className="team-page-title">Our Amazing Team</h1>
      <p className="team-page-subtitle">Meet the dedicated professionals at Knowit Quality Services Syd.</p>
      
      <div className="team-grid">
        {teamMembers.length > 0 ? (
          teamMembers.map((member, index) => (
            <div key={index} className="team-member-card">
              <img 
                src={member.profilePicture} 
                alt={member.name} 
                className="member-profile-pic" 
                onError={(e) => { e.target.onerror = null; e.target.src="/img/placeholder.jpg" }} // Fallback for missing images
              />
              <h2 className="member-name">{member.name}</h2>
              <p className="member-role">{member.role}</p>
              {member.linkedinUrl && (
                <a 
                  href={member.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="member-linkedin-link"
                >
                  View LinkedIn Profile
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="no-members-found">No active team members to display at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default TeamPage;