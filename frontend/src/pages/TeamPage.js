import React, { useState, useEffect } from 'react';
import './TeamPage.css';

// Main TeamPage component
function TeamPage() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const response = await fetch('/api/team');
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                const result = await response.json();

                if (result.status === 'success') {
                    setTeamMembers(result.data);
                } else {
                    throw new Error(result.message || 'An unknown API error occurred');
                }
            } catch (err) {
                console.error("Could not fetch team data: ", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, []);

    if (loading) {
        return <div
            className="loading"
            data-testid="loading-indicator"
            aria-live="polite"
            aria-label="Loading team members"
        >Loading team members...</div>;
    }

    if (error) {
        return <div className="error-message" data-testid="error-message">Error: {error}</div>;
    }

    return (
        <main className="team-page-container">
            <div className="team-page-header">
                <h1 id="team-page-title" className="team-page-title">Our Amazing Team</h1>
                <p id="team-page-subtitle" className="team-page-subtitle">Meet the dedicated professionals at Knowit Quality Services Syd.</p>
            </div>

            <div className="team-grid-container">
                <div className="team-grid" data-testid="team-grid">
                    {teamMembers.length > 0 ? (
                        teamMembers.map((member, index) => (
                            <article
                                key={member.id || index}
                                className="team-member-card"
                                aria-labelledby={`member-name-${index}`}
                                data-testid="team-member-card"
                            >
                                <img
                                    src={member.profilePicture}
                                    alt={member.name}
                                    className="member-photo"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/img/fallback-knowit.png'; }} 
                                />
                                <div className="member-text-content">
                                    <div className="name-role-wrapper">
                                        <h2 id={`member-name-${index}`} className="member-name">{member.name}</h2>
                                        <p className="member-role">{member.role}</p>
                                    </div>
                                </div>
                                {member.linkedinUrl && (
                                    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="member-linkedin-link" aria-label={`View ${member.name}'s LinkedIn profile`}>View LinkedIn Profile</a>
                                )}
                            </article>
                        ))
                    ) : (
                        <p className="no-members-found" role="alert" data-testid="no-members-message">No active team members to display at the moment.</p>
                    )}
                </div>
            </div>
        </main>
    );
}

export default TeamPage;