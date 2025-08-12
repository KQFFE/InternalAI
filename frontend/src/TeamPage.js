// frontend/src/TeamPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './TeamPage.css';

function TeamPage() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Handler functions for navigation
    const handleServicesClick = () => {
        console.log('Services clicked');
        // Add services functionality here
    };

    const handleAboutClick = () => {
        console.log('About clicked');
        // Add about functionality here
    };

    const handleContactClick = () => {
        console.log('Contact clicked');
        // Add contact functionality here
    };

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
        return (
            <div className="team-page-wrapper"> {/* Add a wrapper for the header */}
                <header className="hero-header-nav-container">
                    <div className="app-logo-text">
                        <Link to="/"> {/* Link logo back to home */}
                            <img src="knowit-logo.png" alt="Knowit-logo" className="app-logo-image" />
                        </Link>
                    </div>
                    <nav className="main-nav-list flex items-center space-x-6"
                        role="navigation"
                        aria-label="Main navigation">
                        <ul className="main-nav-list">
                            <li><Link to="/" className="main-nav-link">Home</Link></li>
                            <li><button onClick={handleServicesClick} className="main-nav-link bg-transparent border-none cursor-pointer">Services</button></li>
                            <li><button onClick={handleAboutClick} className="main-nav-link bg-transparent border-none cursor-pointer">About</button></li>
                            <li><button onClick={handleContactClick} className="main-nav-link bg-transparent border-none cursor-pointer">Contact</button></li>
                        </ul>
                    </nav>
                </header>
                <div className="team-container loading">Loading team data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="team-page-wrapper"> {/* Add a wrapper for the header */}
                <header className="hero-header-nav-container">
                    <div className="app-logo-text">
                        <Link to="/"> {/* Link logo back to home */}
                            <img src="knowit-logo.png" alt="Knowit-logo" className="app-logo-image" />
                        </Link>
                    </div>
                    <nav>
                        <ul className="main-nav-list">
                            <li><Link to="/" className="main-nav-link">Home</Link></li>
                            <li><button onClick={handleServicesClick} className="main-nav-link bg-transparent border-none cursor-pointer">Services</button></li>
                            <li><button onClick={handleAboutClick} className="main-nav-link bg-transparent border-none cursor-pointer">About</button></li>
                            <li><button onClick={handleContactClick} className="main-nav-link bg-transparent border-none cursor-pointer">Contact</button></li>
                        </ul>
                    </nav>
                </header>
                <div className="team-container error">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="team-page-wrapper"> {/* New wrapper div for consistent layout */}
            <header className="hero-header-nav-container">
                <div className="app-logo-text">
                    {/* Use Link to navigate back to the home page when the logo is clicked */}
                    <Link to="/">
                        <img src="knowit-logo.png" alt="Knowit-logo" className="app-logo-image" />
                    </Link>
                </div>
                <nav>
                    <ul className="main-nav-list">
                        <li><Link to="/" className="main-nav-link">Home</Link></li>
                        <li><button onClick={handleServicesClick} className="main-nav-link bg-transparent border-none cursor-pointer">Services</button></li>
                        <li><button onClick={handleAboutClick} className="main-nav-link bg-transparent border-none cursor-pointer">About</button></li>
                        <li><button onClick={handleContactClick} className="main-nav-link bg-transparent border-none cursor-pointer">Contact</button></li>
                    </ul>
                </nav>
            </header>

            <div className="team-page-content"> {/* Wrap main content in a new div */}
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
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/img/placeholder.jpg" }} // Fallback for missing images
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
        </div>
    );
}

export default TeamPage;