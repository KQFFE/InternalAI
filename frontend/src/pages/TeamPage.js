import React from 'react';
import TeamList from '../components/TeamList';
import '../TeamPage.css'; // Import the new CSS file for specific styles

// Main TeamPage component
function TeamPage() {
    // Render the main team page content
    // The header and overall page background is now handled by the shared Layout.js component.
    return (
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
    );
}

export default TeamPage;
