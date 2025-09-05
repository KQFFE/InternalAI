// frontend/src/components/HomePageContent.js - Updated to remove team button navigation
import { useNavigate } from 'react-router-dom';
import './HomePageContent.css';

function HomePageContent() {
    const navigate = useNavigate();

    return (
        <main id="main-content" tabIndex={-1}>
            <div className="container mx-auto px-6">
                <section className="hero-section">
                    <div className="hero-text">
                        <h1 id="main-heading" tabIndex="-1">Shaping a better future with code</h1>
                        <p id="main-subtitle">We are a digitalization company that develops solutions and services for a better tomorrow.</p>
                    </div>
                    <div className="hero-buttons">
                        {/* Disabled team button - no longer navigates */}
                        <button
                            className="hero-button hero-button-disabled"
                            id="team-button"
                            data-testid="team-button"
                            disabled
                            title="Login as admin to access team information"
                        >
                            Read more about our team
                        </button>
                        <button onClick={() => navigate('/license')} className="hero-button" id="license-button" data-testid="license-button">Knowit License Management</button>
                    </div>
                </section>
            </div>

            <div className="container mx-auto px-6 py-12">
                <section className="highlights-section" id="company-highlights">
                    <div className="highlight-box" data-testid="customer-experience-highlight">
                        <h2>Customer Experience</h2>
                        <p>Creating seamless and engaging user journeys.</p>
                    </div>
                    <div className="highlight-box" data-testid="innovation-highlight">
                        <h2>Innovation</h2>
                        <p>Driving progress with cutting-edge technology.</p>
                    </div>
                </section>
            </div>

            <div className="news-section-background">
                <div className="container mx-auto px-6 py-12">
                    <section className="news-section" id="news-section" aria-label="Latest news">
                        <h2 id="news-heading">News</h2>
                        <div className="news-grid">
                            <a href="/news/story-1" className="news-item" id="news-item-1" data-testid="news-item-1">
                                <div className="news-item-content">
                                    <div className="news-item-meta">
                                        <span className="news-item-date">2024-10-26</span>
                                        <span className="news-item-category">Project Update</span>
                                    </div>
                                    <h3 className="news-item-headline">Kristoffer, Sasan, Sakshi and Johanna are creating a landing page</h3>
                                </div>
                                <div className="news-item-arrow">
                                    <span>&rarr;</span>
                                </div>
                            </a>
                            <a href="/news/story-2" className="news-item" id="news-item-2" data-testid="news-item-2">
                                <div className="news-item-content">
                                    <div className="news-item-meta">
                                        <span className="news-item-date">2024-10-25</span>
                                        <span className="news-item-category">HR News</span>
                                    </div>
                                    <h3 className="news-item-headline">The team requests earlier vacation leave</h3>
                                </div>
                                <div className="news-item-arrow">
                                    <span>&rarr;</span>
                                </div>
                            </a>
                        </div>
                        <button className="more-news-link" id="more-news-link" data-testid="more-news-button">More news</button>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default HomePageContent;