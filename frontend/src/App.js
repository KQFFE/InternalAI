import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import License from './License'; // Import your License component
import './App.css'; // This was commented out in your HEAD, but seems used by incoming
import './style.css'; // From incoming
import logo from './knowit-logo.png'; // From incoming (assuming you prefer this over logo.svg for the main landing page)
import TeamPage from './TeamPage'; // From incoming

// Main Homepage Content Component with Updated Design
function HomePageContent() {
    const navigate = useNavigate(); // Hook to programmatically navigate
    const [slideIndex, setSlideIndex] = useState(1);

    const handleReadMoreClick = () => {
        navigate('/team'); // Navigate to the /team route
    };

    const handleLicenseClick = () => {
        navigate('/license'); // Navigate to your /license route
    };

    // Slideshow Logic
    useEffect(() => {
        showSlides(slideIndex);
    }, [slideIndex]);

    const plusSlides = (n) => {
        let newIndex = slideIndex + n;
        const slides = document.getElementsByClassName("mySlides");
        if (newIndex > slides.length) { newIndex = 1; }
        if (newIndex < 1) { newIndex = slides.length; }
        setSlideIndex(newIndex);
    };

    const showSlides = (n) => {
        const slides = document.getElementsByClassName("mySlides");
        for (let i = 0; i < slides.length; i++) {
            if (slides[i]) {
                slides[i].style.display = "none";
            }
        }
        if (slides[n - 1]) {
            slides[n - 1].style.display = "grid";
        }
    };

    return (
        <>
            {/* Hero Section with Updated Design */}
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
                        <Link to="/team" className="text-white text-lg hover:underline">Team</Link>
                        <Link to="/license" className="text-white text-lg hover:underline">License</Link>
                        <a href="#" className="text-white text-lg hover:underline">Contact</a>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex-grow flex flex-col justify-center items-start p-6 md:p-10 container mx-auto">
                    <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-8 max-w-3xl text-white">
                        Building the future takes a whole set of digitalization skills. Welcome to our world.
                    </h1>
                    <div className="flex flex-wrap gap-4 mb-16">
                        <button
                            onClick={handleReadMoreClick}
                            className="text-white text-lg flex items-center space-x-2 group hover:underline"
                        >
                            Our Team
                            <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </button>
                        <button
                            onClick={handleLicenseClick}
                            className="text-white text-lg flex items-center space-x-2 group hover:underline"
                        >
                            License
                            <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </button>
                        <a href="#" className="text-white text-lg flex items-center space-x-2 group hover:underline">
                            Career
                            <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </a>
                    </div>

                    {/* Gradient Box */}
                    <div className="gradient-box relative w-full mb-8 flex items-end p-4 bg-gradient-to-r from-purple-800 to-blue-800 rounded-lg">
                        <p className="text-white text-sm opacity-80">
                            Design inspired by the Nordic sky above Knowit, Malmö ©
                        </p>
                        <div className="absolute bottom-4 right-4 flex items-center space-x-4 text-white text-sm">
                            <span>15°C</span>
                            <span>1.2 m/s</span>
                            <span>07:12</span>
                        </div>
                    </div>
                </main>
            </div>

            {/* Middle Section: Slideshow */}
            <section className="bg-yellow-100 text-gray-800 py-16 md:py-24 px-6">
                <div className="container mx-auto">
                    {/* Slider Navigation */}
                    <div className="flex justify-center items-center pb-6 md:pb-10 space-x-4 mb-8">
                        <span className="text-gray-800 text-lg">0{slideIndex} / 03</span>
                        <button
                            type="button"
                            className="text-gray-800 text-2xl hover:text-blue-600 transition-colors"
                            onClick={() => plusSlides(-1)}
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            className="text-gray-800 text-2xl hover:text-blue-600 transition-colors"
                            onClick={() => plusSlides(1)}
                        >
                            →
                        </button>
                    </div>

                    <div className="slideshow-container mb-16">
                        {/* Slide 1 */}
                        <div className="mySlides fade grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-xl shadow-lg">
                            <div className="flex flex-col items-center justify-center p-4">
                                <img
                                    src="https://placehold.co/200x100/eeeeee/333333?text=InternalAI+Logo"
                                    alt="InternalAI Project Logo"
                                    className="mb-4 max-w-full h-auto"
                                />
                            </div>
                            <div className="text-gray-800">
                                <h3 className="text-2xl font-semibold mb-4">InternalAI Summer Project 2025</h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Our team is creating a comprehensive landing page and automating processes using AI
                                    for everything. This project showcases modern full-stack development with React,
                                    Flask, and Azure deployment, all powered by AI assistance for maximum efficiency.
                                </p>
                                <button
                                    onClick={handleReadMoreClick}
                                    className="text-blue-600 flex items-center space-x-2 group hover:underline"
                                >
                                    Meet our team
                                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </button>
                            </div>
                        </div>

                        {/* Slide 2 */}
                        <div className="mySlides fade grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-xl shadow-lg">
                            <div className="flex flex-col items-center justify-center p-4">
                                <img
                                    src="https://placehold.co/200x100/eeeeee/333333?text=AI+Innovation"
                                    alt="AI Innovation"
                                    className="mb-4 max-w-full h-auto"
                                />
                            </div>
                            <div className="text-gray-800">
                                <h3 className="text-2xl font-semibold mb-4">AI-Powered Development</h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Experience the future of software development where AI assists in every step,
                                    from code generation to deployment automation, making development faster and more efficient.
                                </p>
                                <a href="#" className="text-blue-600 flex items-center space-x-2 group hover:underline">
                                    Learn more
                                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </a>
                            </div>
                        </div>

                        {/* Slide 3 */}
                        <div className="mySlides fade grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-xl shadow-lg">
                            <div className="flex flex-col items-center justify-center p-4">
                                <img
                                    src="https://placehold.co/200x100/eeeeee/333333?text=Full+Stack"
                                    alt="Full Stack Development"
                                    className="mb-4 max-w-full h-auto"
                                />
                            </div>
                            <div className="text-gray-800">
                                <h3 className="text-2xl font-semibold mb-4">Modern Full-Stack Architecture</h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Built with React frontend, Flask backend, and Azure cloud deployment.
                                    A complete modern web application showcasing best practices in full-stack development.
                                </p>
                                <button
                                    onClick={handleLicenseClick}
                                    className="text-blue-600 flex items-center space-x-2 group hover:underline"
                                >
                                    View license
                                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Video Section */}
                    <div className="video-container rounded-xl overflow-hidden shadow-lg bg-gray-200 p-8 text-center">
                        <h3 className="text-2xl font-semibold mb-4">Project Demo</h3>
                        <p className="text-gray-600 mb-4">Watch our team demonstrate the InternalAI project capabilities</p>
                        <div className="bg-gray-300 rounded-lg p-8">
                            <p className="text-gray-500">Demo video coming soon...</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Section with Updated Design */}
            <section className="bg-orange-200 text-gray-800 py-16 md:py-24 px-6 font-inter">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-semibold mb-12">News</h2>

                    {/* News Links */}
                    <div className="grid grid-cols-1 gap-8 mb-16">
                        <a href="#" className="flex justify-between items-center border-b border-gray-800 pb-4 group">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">2025-06-26 <span className="font-bold">Summer Project 2025</span></p>
                                <p className="text-xl font-medium">Kristoffer, Sasan, Sakshi and Johanna are creating a landing page and automating a process, using AI for everything.</p>
                            </div>
                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </a>
                        <a href="#" className="flex justify-between items-center border-b border-gray-800 pb-4 group">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">2025-07-01 <span className="font-bold">Summer Project 2025</span></p>
                                <p className="text-xl font-medium">The team requests earlier vacation leave due to information overflow</p>
                            </div>
                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </a>
                        <a href="#" className="flex justify-between items-center border-b border-gray-800 pb-4 group">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">2025-07-10 <span className="font-bold">Project Update</span></p>
                                <p className="text-xl font-medium">Full-stack deployment pipeline successfully configured with Azure CI/CD</p>
                            </div>
                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </a>
                    </div>

                    <a href="#" className="flex items-center space-x-2 text-gray-800 font-semibold text-lg group mb-24">
                        More news
                        <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
                    </a>

                    {/* Footer Columns with Updated Design */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div>
                            <h3 className="text-5xl font-bold mb-8 transform -rotate-6 origin-bottom-left max-w-xs leading-none">
                                Become one of us
                            </h3>
                            <button
                                onClick={handleReadMoreClick}
                                className="flex items-center space-x-2 text-gray-800 font-semibold text-lg group hover:underline"
                            >
                                Join our team
                                <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </button>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">CONTACT</h4>
                            <ul className="space-y-2 text-sm">
                                <li>InternalAI Team</li>
                                <li><a href="tel:+4670090000" className="hover:underline">+46 700 900 00</a></li>
                                <li><a href="mailto:info@internalai.se" className="hover:underline">info@internalai.se</a></li>
                                <li>Knowit Quality Services Syd</li>
                                <li>Malmö, Sweden</li>
                                <li><a href="#" className="hover:underline">Visit us</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">ABOUT PROJECT</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/team" className="hover:underline">Our Team</Link></li>
                                <li><a href="#" className="hover:underline">Technology Stack</a></li>
                                <li><a href="#" className="hover:underline">Project Goals</a></li>
                                <li><Link to="/license" className="hover:underline">License</Link></li>
                                <li><a href="#" className="hover:underline">Documentation</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">TECHNOLOGIES</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:underline">React Frontend</a></li>
                                <li><a href="#" className="hover:underline">Flask Backend</a></li>
                                <li><a href="#" className="hover:underline">Azure Deployment</a></li>
                                <li><a href="#" className="hover:underline">AI Integration</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Footer Links */}
                    <div className="flex flex-wrap justify-between items-center text-sm text-gray-800">
                        <div className="flex flex-wrap space-x-4 mb-4 md:mb-0">
                            <a href="#" className="hover:underline">Cookie Policy</a>
                            <a href="#" className="hover:underline">Privacy Policy</a>
                            <a href="#" className="hover:underline">Terms of Service</a>
                            <span>© 2025 InternalAI Team</span>
                        </div>
                        <div className="flex flex-wrap space-x-4">
                            <a href="#" className="hover:underline">LinkedIn</a>
                            <a href="#" className="hover:underline">GitHub</a>
                            <a href="#" className="hover:underline">Contact</a>
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

    const toggleDetails = () => {
        console.log("Toggle cookie details");
    };

    return (
        <Router>
            <div className="App font-inter">
                {/* Cookie Consent Modal with Updated Design */}
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