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
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between" role="navigation" aria-label="Main navigation">
                    {/* Main branding/logo link */}
                    <div className="text-2xl font-bold text-gray-800">
                        <Link to="/" className="text-gray-800 hover:text-blue-600 transition-colors duration-300">
                            InternalAI
                        </Link>
                    </div>
                    {/* Navigation links */}
                    <div className="flex space-x-6">
                        <Link
                            to="/"
                            className="main-nav-link text-gray-600 hover:text-blue-500 font-semibold focus:outline focus:outline-2 focus:outline-blue-500 rounded-md p-2 transition-colors duration-200"
                        >
                            Home
                        </Link>
                        <Link
                            to="/services"
                            className="main-nav-link text-gray-600 hover:text-blue-500 font-semibold focus:outline focus:outline-2 focus:outline-blue-500 rounded-md p-2 transition-colors duration-200"
                        >
                            Services
                        </Link>
                        <Link
                            to="/about"
                            className="main-nav-link text-gray-600 hover:text-blue-500 font-semibold focus:outline focus:outline-2 focus:outline-blue-500 rounded-md p-2 transition-colors duration-200"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="main-nav-link text-gray-600 hover:text-blue-500 font-semibold focus:outline focus:outline-2 focus:outline-blue-500 rounded-md p-2 transition-colors duration-200"
                        >
                            Contact
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight team-page-title">
                        Our Amazing Team
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 team-page-subtitle">
                        Meet the dedicated professionals at Knowit Quality Services Syd.
                    </p>
                </div>

                {/* Team member grid */}
                <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.length > 0 ? (
                        teamMembers.map((member, index) => (
                            <article
                                key={member.name}
                                className="team-member-card bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center"
                                aria-labelledby={`member-name-${index}`}
                            >
                                <img
                                    src={member.profilePicture}
                                    alt={`Profile picture of ${member.name}`}
                                    className="member-profile-pic w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500 shadow-md"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/cccccc/333333?text=Profile" }}
                                />
                                <h2 id={`member-name-${index}`} className="member-name text-xl font-bold text-gray-800 mb-1">
                                    {member.name}
                                </h2>
                                <p className="member-role text-md text-blue-600 font-medium">
                                    {member.role}
                                </p>
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
                        ))
                    ) : (
                        <p className="text-gray-500 italic text-center col-span-full" role="alert">
                            No active team members to display at the moment.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TeamPage;
