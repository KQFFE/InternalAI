import React from 'react';
import { Link } from 'react-router-dom';
import TeamList from '../components/TeamList';
import './TeamPage.css'; // Import the new CSS file for specific styles

// Main TeamPage component
function TeamPage() {
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
                <TeamList activeOnly={true} />
            </main>
        </div>
    );
}

export default TeamPage;
