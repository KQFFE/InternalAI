import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import License from './License'; // Import your License component
import './App.css'; // This was commented out in your HEAD, but seems used by incoming
import './style.css'; // From incoming
import logo from './knowit-logo.png'; // From incoming (assuming you prefer this over logo.svg for the main landing page)
import TeamPage from './TeamPage'; // From incoming

// Main Homepage Content Component with RESTORED Original Design
function HomePageContent() {
    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleReadMoreClick = () => {
        navigate('/team'); // Navigate to the /team route
    };

    const handleLicenseClick = () => {
        navigate('/license'); // Navigate to your /license route
    };

    return (
        <>
            {/* Hero Section with RESTORED Original Design */}
            <div className="hero-gradient-bg font-inter">
                {/* Header Section */}
                <header className="flex justify-between items-center p-6 md:p-10 container mx-auto">
                    <div className="text-2xl font-bold text-white">
                        <Link to="/">
                            <img src={logo} alt="Knowit-logo" className="h-8 w-auto" />
                        </Link>
                    </div>
                    <nav className="flex items-center space-x-6">
                        <Link to="/" className="text-white text-lg hover:underline">Home</Link>
                        <a href="#" className="text-white text-lg hover:underline">Services</a>
                        <a href="#" className="text-white text-lg hover:underline">About</a>
                        <Link to="/team" className="text-white text-lg hover:underline">Team</Link>
                        <Link to="/license" className="text-white text-lg hover:underline">License</Link>
                        <a href="#" className="text-white text-lg hover:underline">Contact</a>
                    </nav>
                </header>

                {/* RESTORED Hero Section with Original Content */}
                <main className="flex-grow flex flex-col justify-center items-center text-center p-6 md:p-10 container mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 max-w-4xl text-white">
                        Shaping a better future with code
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 max-w-2xl text-white opacity-90">
                        We are a digitalization company that develops solutions and services.
                    </p>
                    <div className="homepage-buttons-container">
                        <button
                            onClick={handleReadMoreClick}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                        >
                            Read more about our team
                        </button>
                        <button
                            onClick={handleLicenseClick}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                        >
                            License
                        </button>
                    </div>
                </main>
            </div>

            {/* RESTORED Middle Section: Two Cards */}
            <section className="bg-gray-100 text-gray-800 py-16 md:py-24 px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Card 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">We create unique customer experiences</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We are a digitalization company that develops solutions and services.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Innovation through collaboration</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We are a digitalization company that develops solutions and services.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* RESTORED News Section */}
            <section className="bg-yellow-100 text-gray-800 py-16 md:py-24 px-6 font-inter">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-semibold mb-12">News</h2>

                    {/* News Links */}
                    <div className="grid grid-cols-1 gap-8 mb-16">
                        <a href="#" className="flex justify-between items-center border-b border-gray-400 pb-4 group">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">2025-06-26 <span className="font-bold">Summer Project 2025</span></p>
                                <p className="text-xl font-medium">Kristoffer, Sasan, Sakshi and Johanna is creating a landing page and automating a process, by using AI for everything.</p>
                            </div>
                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </a>
                        <a href="#" className="flex justify-between items-center border-b border-gray-400 pb-4 group">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">2025-07-01 <span className="font-bold">Summer Project 2025</span></p>
                                <p className="text-xl font-medium">The team request earlier vacation leave due to information overflow</p>
                            </div>
                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </a>
                    </div>

                    <a href="#" className="flex items-center space-x-2 text-gray-800 font-semibold text-lg group mb-24">
                        More news
                        <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">→</span>
                    </a>
                </div>
            </section>

            {/* RESTORED Footer Section */}
            <section className="bg-orange-200 text-gray-800 py-16 md:py-24 px-6 font-inter">
                <div className="container mx-auto">
                    {/* Footer Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div>
                            <h3 className="text-4xl font-bold mb-8 transform -rotate-6 origin-bottom-left max-w-xs leading-none">
                                Become one of us
                            </h3>
                            <button
                                onClick={handleReadMoreClick}
                                className="flex items-center space-x-2 text-gray-800 font-semibold text-lg group hover:underline"
                            >
                                Hitta ditt nya jobb här
                                <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </button>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">CONTACT</h4>
                            <ul className="space-y-2 text-sm">
                                <li>Box 3390, SE-103 68 Stockholm</li>
                                <li>Besök: Mäster Samuelsgatan 60, Stockholm</li>
                                <li><a href="tel:+46102797000" className="hover:underline">Tel: +46 10 279 70 00</a></li>
                                <li><a href="mailto:info@knowit.se" className="hover:underline">E-mail: info@knowit.se</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">ABOUT KNOWIT</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:underline">Our history</a></li>
                                <li><a href="#" className="hover:underline">Our values</a></li>
                                <li><a href="#" className="hover:underline">Our employees</a></li>
                                <li><a href="#" className="hover:underline">Investor relations</a></li>
                                <li><a href="#" className="hover:underline">Career</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">BUSINESS AREAS</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:underline">Knowit Experience</a></li>
                                <li><a href="#" className="hover:underline">Knowit Connectivity</a></li>
                                <li><a href="#" className="hover:underline">Knowit Solutions</a></li>
                                <li><a href="#" className="hover:underline">Knowit Insight</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Footer Links */}
                    <div className="flex flex-wrap justify-between items-center text-sm text-gray-800">
                        <div className="flex flex-wrap space-x-4 mb-4 md:mb-0">
                            <a href="#" className="hover:underline">Cookie Policy</a>
                            <a href="#" className="hover:underline">Hantering av personuppgifter</a>
                            <a href="#" className="hover:underline">Whistleblower</a>
                            <span>© 2023 Knowit AB</span>
                        </div>
                        <div className="flex flex-wrap space-x-4">
                            <a href="#" className="hover:underline">LinkedIn</a>
                            <a href="#" className="hover:underline">Facebook</a>
                            <a href="#" className="hover:underline">Instagram</a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function App() {
    // --- Cookie Consent State and Logic (kept from incoming) ---
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
                {/* Cookie Consent Modal */}
                {showCookieModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                        <div className="bg-gray-800 text-white p-8 rounded-xl max-w-md mx-4 shadow-2xl">
                            <h2 className="text-xl font-semibold mb-4">We use cookies</h2>
                            <p className="text-gray-300 text-sm mb-4">
                                InternalAI uses cookies for analytical purposes to improve your user experience.
                                Information about you will not be stored, for that we use a tool that is adapted to only collect anonymous information.
                                You decide for yourself if you want to allow "All cookies".
                            </p>
                            <p className="text-gray-300 text-sm mb-4">
                                By clicking "Accept all" you agree to our use of all cookies.
                            </p>
                            <a href="#" className="text-blue-400 text-sm hover:underline block mb-4">
                                Read more about our cookies
                            </a>

                            <div className="cookie-preferences mb-4 bg-gray-700 p-4 rounded-lg">
                                <label className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        disabled
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Necessary (Always on)</span>
                                </label>
                                <label className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={functionalityCookies}
                                        onChange={() => setFunctionalityCookies(!functionalityCookies)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Functionality</span>
                                </label>
                                <label className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={statisticsCookies}
                                        onChange={() => setStatisticsCookies(!statisticsCookies)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Statistics</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={marketingCookies}
                                        onChange={() => setMarketingCookies(!marketingCookies)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Marketing</span>
                                </label>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors"
                                    onClick={denyAllCookies}
                                >
                                    DENY ALL
                                </button>
                                <button
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition-colors"
                                    onClick={acceptAllCookies}
                                >
                                    ACCEPT ALL
                                </button>
                            </div>
                            <button
                                className="w-full mt-2 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                                onClick={savePreferences}
                            >
                                Save preferences
                            </button>
                        </div>
                    </div>
                )}

                {/* Define your routes here */}
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