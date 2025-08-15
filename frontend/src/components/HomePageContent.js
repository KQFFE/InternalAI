import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePageContent.css';

function HomePageContent() {
    const navigate = useNavigate();

    return (
        <>
            {/* Hero Section */}
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

            {/* Highlights Section, inheriting gradient from Layout */}
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

            {/* News Section with its own background */}
            <div className="news-section-background">
                <div className="container mx-auto px-6 py-12">
                    {/* News Section */}
                    <section className="news-section" id="news-section">
                        <h2 id="news-heading">News</h2>
                        <div className="news-grid">
                            <article className="news-item">
                                <h4>Kristoffer, Sasan, Sakshi and Johanna is creating a landing page</h4>
                                <p>The team is working hard on the new project.</p>
                                <a href="#news1" className="news-item-link" id="news-item-1">Read more</a>
                            </article>
                            <article className="news-item">
                                <h4>The team request earlier vacation leave</h4>
                                <p>Summer is coming and the team wants to enjoy it.</p>
                                <a href="#news2" className="news-item-link" id="news-item-2">Read more</a>
                            </article>
                        </div>
                        <a href="#more-news" className="more-news-link" id="more-news-link">More news</a>
                    </section>
                </div>
            </div>
        </>
    );
}

export default HomePageContent;