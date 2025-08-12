import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import License from './License';
import TeamPage from './TeamPage';
import CookieBanner from './CookieBanner';

function HomePageContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const handleReadMoreClick = () => {
        navigate('/team');
    };

    const handleLicenseClick = () => {
        navigate('/license');
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-gradient-bg font-inter" aria-label="Hero section">
                {/* Header Section */}
                <header
                    className="flex justify-between items-center p-6 md:p-10 container mx-auto"
                    role="banner"
                    aria-label="Main navigation header"
                >
                    <div className="text-2xl font-bold text-white">
                        <Link to="/" aria-label="Go to homepage">
                            <img
                                src="/knowit-logo.png"
                                alt="Knowit company logo"
                                className={`app-logo-image h-8 w-auto ${isHomePage ? 'logo-white' : ''}`}
                                id="main-logo"
                            />
                        </Link>
                    </div>
                    <nav className="main-nav-list flex items-center space-x-6" role="navigation" aria-label="Main navigation">
                        <Link to="/services" className="main-nav-link text-white text-lg hover:underline" id="nav-services" aria-label="Services page">Services</Link>
                        <Link to="/about" className="main-nav-link text-white text-lg hover:underline" id="nav-about" aria-label="About us page">About</Link>
                        <Link to="/team" className="main-nav-link text-white text-lg hover:underline" id="nav-team" aria-label="Our team page">Team</Link>
                        <Link to="/license" className="main-nav-link text-white text-lg hover:underline" id="nav-license" aria-label="License information">License</Link>
                        <Link to="/contact" className="main-nav-link text-white text-lg hover:underline" id="nav-contact" aria-label="Contact us">Contact</Link>
                    </nav>
                </header>

                {/* Hero Main Content */}
                <main className="flex-grow flex flex-col justify-center items-center text-center p-6 md:p-10 container mx-auto" role="main">
                    <h1 className="hero-title text-4xl md:text-6xl font-bold leading-tight mb-8 max-w-4xl text-white" id="main-heading">
                        Shaping a better future with code
                    </h1>
                    <p className="hero-subtitle text-xl md:text-2xl mb-12 max-w-2xl text-white opacity-90" id="main-subtitle">
                        We are a digitalization company that develops solutions and services.
                    </p>
                    <div className="homepage-buttons-container" role="group" aria-label="Main action buttons">
                        <button
                            onClick={handleReadMoreClick}
                            className="hero-button bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                            id="team-button"
                            aria-label="Read more about our team"
                            type="button"
                        >
                            Read more about our team
                        </button>
                        <button
                            onClick={handleLicenseClick}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                            id="license-button"
                            aria-label="Access Knowit License Management system"
                            type="button"
                        >
                            Knowit License Management
                        </button>
                    </div>
                </main>

                {/* Gradient Box at the bottom of hero section */}
                <section className="gradient-box mx-4 md:mx-8 mb-8" aria-label="Company highlights" id="company-highlights">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
                        {/* Box 1 */}
                        <div className="gradient-box-item" id="customer-experience-highlight" data-testid="customer-experience-highlight">
                            <h2 className="gradient-box-title text-xl md:text-2xl font-semibold mb-4 text-white">
                                We create unique customer experiences
                            </h2>
                            <p className="gradient-box-text text-white opacity-80 leading-relaxed">
                                We are a digitalization company that develops solutions and services.
                            </p>
                        </div>

                        {/* Box 2 */}
                        <div className="gradient-box-item" id="innovation-highlight" data-testid="innovation-highlight">
                            <h2 className="gradient-box-title text-xl md:text-2xl font-semibold mb-4 text-white">
                                Innovation through collaboration
                            </h2>
                            <p className="gradient-box-text text-white opacity-80 leading-relaxed">
                                We are a digitalization company that develops solutions and services.
                            </p>
                        </div>
                    </div>
                </section>
            </section>

            {/* News Section */}
            <section className="bg-yellow-100 text-gray-800 py-16 md:py-24 px-6 font-inter" aria-label="Latest news" id="news-section">
                <div className="container mx-auto">
                    <h2 className="news-heading text-3xl font-semibold mb-12" id="news-heading">News</h2>

                    {/* News Links */}
                    <div className="grid grid-cols-1 gap-8 mb-16" role="list" aria-label="News articles">
                        <article className="news-item-link flex justify-between items-center border-b border-gray-400 pb-4 group" role="listitem">
                            <button
                                onClick={() => {}}
                                className="flex-grow text-left bg-transparent border-none cursor-pointer"
                                id="news-item-1"
                                aria-label="Read article about Summer Project 2025 from June 26"
                            >
                                <div>
                                    <p className="news-item-meta text-gray-600 text-sm mb-1">
                                        <time dateTime="2025-06-26">2025-06-26</time>
                                        <span className="news-item-meta-bold font-bold"> Summer Project 2025</span>
                                    </p>
                                    <h3 className="news-item-title text-xl font-medium">
                                        Kristoffer, Sasan, Sakshi and Johanna is creating a landing page and automating a process, by using AI for everything.
                                    </h3>
                                </div>
                            </button>
                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true">→</span>
                        </article>

                        <article className="news-item-link flex justify-between items-center border-b border-gray-400 pb-4 group" role="listitem">
                            <button
                                onClick={() => console.log('News item 2 clicked')}
                                className="flex-grow text-left bg-transparent border-none cursor-pointer"
                                id="news-item-2"
                                aria-label="Read article about Summer Project 2025 from July 1"
                            >
                                <div>
                                    <p className="news-item-meta text-gray-600 text-sm mb-1">
                                        <time dateTime="2025-07-01">2025-07-01</time>
                                        <span className="news-item-meta-bold font-bold"> Summer Project 2025</span>
                                    </p>
                                    <h3 className="news-item-title text-xl font-medium">
                                        The team request earlier vacation leave due to information overflow
                                    </h3>
                                </div>
                            </button>
                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true">→</span>
                        </article>
                    </div>

                    <button
                        onClick={() => console.log('More news clicked')}
                        className="more-news-link flex items-center space-x-2 text-gray-800 font-semibold text-lg group mb-24 bg-transparent border-none cursor-pointer"
                        id="more-news-link"
                        aria-label="View all news articles"
                        type="button"
                    >
                        More news
                        <span className="text-2xl group-hover:rotate-90 transition-transform duration-300" aria-hidden="true">→</span>
                    </button>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-orange-200 text-gray-800 py-16 md:py-24 px-6 font-inter" role="contentinfo" aria-label="Site footer">
                <div className="container mx-auto">
                    {/* Footer Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div id="footer-careers">
                            <h3 className="become-one-of-us-heading text-4xl font-bold mb-8 transform -rotate-6 origin-bottom-left max-w-xs leading-none">
                                Become one of us
                            </h3>
                            <button // This remains a button as it likely triggers an action, not a route change.
                                onClick={() => { /* Add career functionality here */ }}
                                className="flex items-center space-x-2 text-gray-800 font-semibold text-lg group hover:underline bg-transparent border-none cursor-pointer"
                                id="footer-careers-button"
                                aria-label="Find your new job at Knowit"
                                type="button"
                            >
                                Hitta ditt nya jobb här
                                <span className="transform transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                            </button>
                        </div>

                        <div id="footer-contact">
                            <h4 className="footer-column-heading font-bold text-lg mb-4">CONTACT</h4>
                            <address className="not-italic">
                                <ul className="space-y-2 text-sm">
                                    <li className="footer-text">Box 3390, SE-103 68 Stockholm</li>
                                    <li>Besök: Mäster Samuelsgatan 60, Stockholm</li>
                                    <li><a href="tel:+46102797000" className="hover:underline" id="contact-phone" aria-label="Call us at +46 10 279 70 00">Tel: +46 10 279 70 00</a></li>
                                    <li><a href="mailto:info@knowit.se" className="hover:underline" id="contact-email" aria-label="Send email to info@knowit.se">E-mail: info@knowit.se</a></li>
                                </ul>
                            </address>
                        </div>

                        <div id="footer-about">
                            <h4 className="footer-column-heading font-bold text-lg mb-4">ABOUT KNOWIT</h4>
                            <nav aria-label="About Knowit links">
                                <ul className="space-y-2 text-sm">
                                    <li><a href="https://www.knowit.se/om-oss/var-historia/" className="hover:underline" id="about-history" aria-label="Learn about our history">Our history</a></li>
                                    <li><a href="https://www.knowit.se/om-oss/varden/" className="hover:underline" id="about-values" aria-label="Learn about our values">Our values</a></li>
                                    <li><a href="https://www.knowit.se/om-oss/medarbetare/" className="hover:underline" id="about-employees" aria-label="Meet our employees">Our employees</a></li>
                                    <li><a href="https://www.knowit.se/investerare/" className="hover:underline" id="about-investors" aria-label="Investor relations information">Investor relations</a></li>
                                    <li><a href="https://www.knowit.se/karriar/" className="hover:underline" id="about-career" aria-label="Career opportunities">Career</a></li>
                                </ul>
                            </nav>
                        </div>

                        <div id="footer-business">
                            <h4 className="footer-column-heading font-bold text-lg mb-4">BUSINESS AREAS</h4>
                            <nav aria-label="Business areas links">
                                <ul className="space-y-2 text-sm">
                                    <li><a href="https://www.knowit.se/tjanster/experience/" className="hover:underline" id="business-experience" aria-label="Learn about Knowit Experience">Knowit Experience</a></li>
                                    <li><a href="https://www.knowit.se/tjanster/connectivity/" className="hover:underline" id="business-connectivity" aria-label="Learn about Knowit Connectivity">Knowit Connectivity</a></li>
                                    <li><a href="https://www.knowit.se/tjanster/solutions/" className="hover:underline" id="business-solutions" aria-label="Learn about Knowit Solutions">Knowit Solutions</a></li>
                                    <li><a href="https://www.knowit.se/tjanster/insight/" className="hover:underline" id="business-insight" aria-label="Learn about Knowit Insight">Knowit Insight</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    {/* Bottom Footer Links */}
                    <div className="footer-bottom-row flex flex-wrap justify-between items-center text-sm text-gray-800">
                        <div className="flex flex-wrap space-x-4 mb-4 md:mb-0">
                            <a href="https://www.knowit.se/cookies/" className="hover:underline" id="footer-cookies" aria-label="Read our cookie policy">Cookie Policy</a>
                            <a href="https://www.knowit.se/hantering-av-personuppgifter/" className="hover:underline" id="footer-privacy" aria-label="Read about handling of personal data">Hantering av personuppgifter</a>
                            <a href="https://www.knowit.se/whistleblower/" className="hover:underline" id="footer-whistleblower" aria-label="Whistleblower information">Whistleblower</a>
                            <span id="footer-copyright">© 2023 Knowit AB</span>
                        </div>
                        <div className="flex flex-wrap space-x-4">
                            <a href="https://www.linkedin.com/company/knowit/" className="hover:underline" id="footer-linkedin" aria-label="Follow us on LinkedIn">LinkedIn</a>
                            <a href="https://www.facebook.com/weareknowit" className="hover:underline" id="footer-facebook" aria-label="Follow us on Facebook">Facebook</a>
                            <a href="https://www.instagram.com/weareknowit/" className="hover:underline" id="footer-instagram" aria-label="Follow us on Instagram">Instagram</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

function App() {
    // Cookie Consent State and Logic
    const [showCookieModal, setShowCookieModal] = useState(false);
    const [functionalityCookies, setFunctionalityCookies] = useState(false);
    const [statisticsCookies, setStatisticsCookies] = useState(false);
    const [marketingCookies, setMarketingCookies] = useState(false);

    useEffect(() => {
        const hasConsent = localStorage.getItem('cookieConsent');
        if (!hasConsent) {
            setShowCookieModal(true);
        } else {
            setFunctionalityCookies(localStorage.getItem('functionalityCookies') === 'true');
            setStatisticsCookies(localStorage.getItem('statisticsCookies') === 'true');
            setMarketingCookies(localStorage.getItem('marketingCookies') === 'true');
            setShowCookieModal(false);
        }
    }, []);

    const acceptAllCookies = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('functionalityCookies', 'true');
        localStorage.setItem('statisticsCookies', 'true');
        localStorage.setItem('marketingCookies', 'true');
        setShowCookieModal(false);
    };

    const denyAllCookies = () => {
        localStorage.setItem('cookieConsent', 'denied');
        localStorage.setItem('functionalityCookies', 'false');
        localStorage.setItem('statisticsCookies', 'false');
        localStorage.setItem('marketingCookies', 'false');
        setShowCookieModal(false);
    };

    const savePreferences = () => {
        localStorage.setItem('cookieConsent', 'custom');
        localStorage.setItem('functionalityCookies', functionalityCookies.toString());
        localStorage.setItem('statisticsCookies', statisticsCookies.toString());
        localStorage.setItem('marketingCookies', marketingCookies.toString());
        setShowCookieModal(false);
    };

    return (
        <Router>
            <div className="App font-inter">
                {/* Cookie Consent Banner */}
                <CookieBanner
                    show={showCookieModal}
                    onAcceptAll={acceptAllCookies}
                    onDeclineAll={denyAllCookies}
                    onSavePreferences={savePreferences}
                    functionalityCookies={functionalityCookies}
                    setFunctionalityCookies={setFunctionalityCookies}
                    statisticsCookies={statisticsCookies}
                    setStatisticsCookies={setStatisticsCookies}
                    marketingCookies={marketingCookies}
                    setMarketingCookies={setMarketingCookies}
                />
                {/* Everything else remains as before */}
                <Routes>
                    <Route path="/" element={<HomePageContent />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/license" element={<License />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
