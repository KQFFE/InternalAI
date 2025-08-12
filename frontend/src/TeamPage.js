import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TeamPage.css'; // Import the new CSS file for specific styles

// Main TeamPage component
function TeamPage() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to fetch team data from a JSON file
    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const response = await fetch('/team.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Filter for active team members
                const activeTeam = data.filter(member => member.active);
                setTeamMembers(activeTeam);
            } catch (error) {
                console.error("Could not fetch team data: ", error);
                setError("Failed to load team members. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, []);

    // Display a loading message while fetching data
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl font-semibold text-gray-700">Loading team members...</p>
            </div>
        );
    }

    // Display an error message if the fetch failed
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl font-semibold text-red-500">{error}</p>
            </div>
        );
    }

    // Render the main team page content
    return (
        <div className="hero-gradient-bg font-sans text-gray-300">
            <header
                className="flex justify-between items-center p-6 md:p-10 container mx-auto"
                role="banner"
                aria-label="Main navigation header"
            >
                {/* Main branding/logo link */}
                <div className="text-2xl font-bold">
                    <Link to="/" aria-label="Go to homepage">
                        <img
                            src="/knowit-logo.png"
                            alt="Knowit company logo"
                            className="app-logo-image h-8 w-auto logo-white"
                            id="main-logo"
                        />
                    </Link>
                </div>
                {/* Navigation links */}
                <nav className="flex items-center space-x-6" role="navigation" aria-label="Main navigation">
                    <Link
                        to="/services"
                        className="main-nav-link text-white text-lg hover:underline"
                    >
                        Services
                    </Link>
                    <Link
                        to="/about"
                        className="main-nav-link text-white text-lg hover:underline"
                    >
                        About
                    </Link>
                    <Link
                        to="/contact"
                        className="main-nav-link text-white text-lg hover:underline"
                    >
                        Contact
                    </Link>
                </nav>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight team-page-title">
                        Our Amazing Team
                    </h1>
                    <p className="mt-4 text-xl text-gray-400 team-page-subtitle">
                        Meet the dedicated professionals at Knowit Quality Services Syd.
                    </p>
                </div>

                {/* Team member grid */}
                <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.length > 0 ? (
                        teamMembers.map((member, index) => (
                            <article
                                key={member.name}
                                className="team-member-card bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center"
                                aria-labelledby={`member-name-${index}`}
                            >
                                <img
                                    src={member.profilePicture}
                                    alt={`Profile of ${member.name}`}
                                    className="member-profile-pic w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-400 shadow-md"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/cccccc/333333?text=Profile" }}
                                />
                                <h2 id={`member-name-${index}`} className="member-name text-xl font-bold text-white mb-1">
                                    {member.name}
                                </h2>
                                <p className="member-role text-md text-blue-400 font-medium">
                                    {member.role}
                                </p>
                                {member.linkedinUrl && (
                                    <a
                                        href={member.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="member-linkedin-link inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                        aria-label={`View ${member.name}'s LinkedIn profile`}
                                    >
                                        View LinkedIn Profile
                                    </a>
                                )}
                            </article>
                        ))
                    ) : (
                        <p className="text-gray-400 italic text-center col-span-full" role="alert">
                            No active team members to display at the moment.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TeamPage;
