import { useNavigate } from 'react-router-dom';
import './HomePageContent.css';

function HomePageContent() {
    const navigate = useNavigate();

    return (
        <>
            <div className="container mx-auto px-6">
                <section className="hero-section">
                    <div className="hero-text">
                        <h1 id="main-heading">Shaping a better future with code</h1>
                        <p id="main-subtitle">We are a digitalization company that develops solutions and services for a better tomorrow.</p>
                    </div>
                    <div className="hero-buttons">
                        <button onClick={() => navigate('/team')} className="hero-button" id="team-button">Read more about our team</button>
                        <button onClick={() => navigate('/license')} className="hero-button" id="license-button">Knowit License Management</button>
                    </div>
                </section>
            </div>

            <div className="container mx-auto px-6 py-12">
                <section className="highlights-section" id="company-highlights">
                    <div className="highlight-box" data-testid="customer-experience-highlight">
                        <h3>Customer Experience</h3>
                        <p>Creating seamless and engaging user journeys.</p>
                    </div>
                    <div className="highlight-box" data-testid="innovation-highlight">
                        <h3>Innovation</h3>
                        <p>Driving progress with cutting-edge technology.</p>
                    </div>
                </section>
            </div>

            <div className="news-section-background">
                <div className="container mx-auto px-6 py-12">
                    <section className="news-section" id="news-section" aria-label="Latest news">
                        <h2 id="news-heading">News</h2>
                        <div className="news-grid">
                            <a href="/news/story-1" className="news-item" id="news-item-1">
                                <div className="news-item-content">
                                    <div className="news-item-meta">
                                        <span className="news-item-date">2024-10-26</span>
                                        <span className="news-item-category">Project Update</span>
                                    </div>
                                    <h4 className="news-item-headline">Kristoffer, Sasan, Sakshi and Johanna are creating a landing page</h4>
                                </div>
                                <div className="news-item-arrow">
                                    <span>&rarr;</span>
                                </div>
                            </a>
                            <a href="/news/story-2" className="news-item" id="news-item-2">
                                <div className="news-item-content">
                                    <div className="news-item-meta">
                                        <span className="news-item-date">2024-10-25</span>
                                        <span className="news-item-category">HR News</span>
                                    </div>
                                    <h4 className="news-item-headline">The team requests earlier vacation leave</h4>
                                </div>
                                <div className="news-item-arrow">
                                    <span>&rarr;</span>
                                </div>
                            </a>
                        </div>
                        <a href="#more-news" className="more-news-link" id="more-news-link">More news</a>
                    </section>
                </div>
            </div>
        </>
    );
}

export default HomePageContent;