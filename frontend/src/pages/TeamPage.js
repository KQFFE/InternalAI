import TeamList from '../components/TeamList';
import './TeamPage.css'; // Correct path for co-located styles

// Main TeamPage component
function TeamPage() {
    // Render the main team page content
    return (
        <div className="team-page-container">
            <header className="team-page-header">
                <h1 className="team-page-title">
                    Our Amazing Team
                </h1>
                <p className="team-page-subtitle">
                    Meet the dedicated professionals at Knowit Quality Services Syd.
                </p>
            </header>
            
            <main className="team-grid-container"><TeamList activeOnly={true} /></main>
        </div>
    );
}

export default TeamPage;
