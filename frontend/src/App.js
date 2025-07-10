import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import License from './License'; // Import your License component
import './App.css'; // This was commented out in your HEAD, but seems used by incoming
import './style.css'; // From incoming
import logo from './knowit-logo.png'; // From incoming (assuming you prefer this over logo.svg for the main landing page)
import TeamPage from './TeamPage'; // From incoming

// Main Homepage Content Component
// This component now encapsulates the full landing page content,
// including the header, hero section, news, and footer.
function HomePageContent() {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleReadMoreClick = () => {
    navigate('/team'); // Navigate to the /team route
  };

  // NEW: Handler for your License button
  const handleLicenseClick = () => {
    navigate('/license'); // Navigate to your /license route
  };
  // --- Slideshow Logic (kept from incoming, if applicable) ---
  useEffect(() => {
    let slideIndex = 0;
    showSlides();

    function showSlides() {
      let i;
      let slides = document.getElementsByClassName("mySlides");
      let dots = document.getElementsByClassName("dot");
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;
      if (slideIndex > slides.length) { slideIndex = 1 }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      if (slides[slideIndex - 1]) { // Check if element exists before accessing
        slides[slideIndex - 1].style.display = "block";
      }
      if (dots[slideIndex - 1]) { // Check if element exists before accessing
        dots[slideIndex - 1].className += " active";
      }
      setTimeout(showSlides, 2000); // Change image every 2 seconds
    }
  }, []); // Empty dependency array means this runs once on mount


  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient-bg">
        <header className="hero-header-nav-container">
          <div className="app-logo-text">
            {/* Using the knowit-logo.png as per the incoming branch's design */}
            <img src={logo} alt="Knowit-logo" className="app-logo-image" />
          </div>
          <nav>
            <ul className="main-nav-list">
              <li><Link to="/" className="main-nav-link">Home</Link></li>
              <li><a href="#" className="main-nav-link">Services</a></li>
              <li><a href="#" className="main-nav-link">About</a></li>
              <li><a href="#" className="main-nav-link">Contact</a></li>
              {/* NEW: License link in the navigation bar */}
              <li><Link to="/license" className="main-nav-link">License</Link></li>
            </ul>
          </nav>
        </header>

        <main className="hero-main-content">
          <h1 className="hero-title">Shaping a better future with code</h1>
          <p className="hero-subtitle">We are a digitalization company that develops solutions and services.</p>
          {/* >>> START OF NEW CONTAINER FOR BUTTONS <<< */}
          <div className="homepage-buttons-container">
            <button className="hero-button" onClick={handleReadMoreClick}>
              Read more about our team
            </button>
            {/* NEW: License button next to "Read more about our team " */}
            <button
              className="hero-button" // Reusing hero-button class for styling consistency
              onClick={handleLicenseClick}
              // REMOVED: style={{ marginLeft: '10px' }} - We'll use CSS for spacing now
            >
              License
            </button>
          </div>
          {/* >>> END OF NEW CONTAINER FOR BUTTONS <<< */}
        </main>

        <div className="gradient-box">
          <div className="gradient-box-item">
            <h2 className="gradient-box-item-title">We create unique customer experiences</h2>
            <p>We are a digitalization company that develops solutions and services.</p>
          </div>
          <div className="gradient-box-item">
            <h2 className="gradient-box-item-title">Innovation through collaboration</h2>
            <p>We are a digitalization company that develops solutions and services.</p>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section-container">
        <div className="news-content-wrapper">
          <h2 className="news-heading">News</h2>
          <div className="news-grid-container">
            <a href="#" className="news-item-link group">
              <div>
                <p className="news-item-meta">2025-06-26 <span className="news-item-meta-bold">Summer Project 2025</span></p>
                <h3 className="news-item-title">Kristoffer, Sasan, Sakshi and Johanna is creating a landing page and automating a process, by using AI for everything.</h3>
              </div>
              <span className="news-item-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
            <a href="#" className="news-item-link group">
              <div>
                <p className="news-item-meta">2025-07-01 <span className="news-item-meta-bold">Summer Project 2025</span></p>
                <h3 className="news-item-title">The team request earlier vacation leave due to information overflow</h3>
              </div>
              <span className="news-item-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          </div>
          <a href="#" className="more-news-link">
            More news
            <span className="arrow-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-beige footer-section">
        <div className="container footer-container">
          {/* Main Footer Grid */}
          <div className="footer-main-grid">
            {/* Column 1: Become one of us */}
            <div className="become-one-of-us-column">
              <h3 className="become-one-of-us-heading">Become one of us</h3>
              <a href="#" className="become-one-of-us-link" aria-label="Hitta ditt nya jobb här">
                Hitta ditt nya jobb här
                <span className="arrow-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
            </div>

            {/* Column 2: CONTACT */}
            <div className="footer-column">
              <h4 className="footer-column-heading">CONTACT</h4>
              <ul>
                <li><p className="footer-text">Box 3390, SE-103 68 Stockholm</p></li>
                <li><p className="footer-text">Besök: Klarabergsgatan 60, Stockholm</p></li>
                <li><p className="footer-text">Tel: +46 10 279 70 00</p></li>
                <li><p className="footer-text">E-mail: <a href="mailto:info@knowit.se" className="footer-link">info@knowit.se</a></p></li>
              </ul>
            </div>

            {/* Column 3: ABOUT KNOWIT */}
            <div className="footer-column">
              <h4 className="footer-column-heading">ABOUT KNOWIT</h4>
              <ul>
                <li><a href="#" className="footer-link">Our history</a></li>
                <li><a href="#" className="footer-link">Our values</a></li>
                <li><a href="#" className="footer-link">Our employees</a></li>
                <li><a href="#" className="footer-link">Investor relations</a></li>
                <li><a href="#" className="footer-link">Career</a></li>
              </ul>
            </div>

            {/* Column 4: BUSINESS AREAS */}
            <div className="footer-column">
              <h4 className="footer-column-heading">BUSINESS AREAS</h4>
              <ul>
                <li><a href="#" className="footer-link">Knowit Experience</a></li>
                <li><a href="#" className="footer-link">Knowit Connectivity</a></li>
                <li><a href="#" className="footer-link">Knowit Solutions</a></li>
                <li><a href="#" className="footer-link">Knowit Insight</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer Links */}
          <div className="footer-bottom-row">
            <div className="footer-bottom-links-left">
              <a href="#" className="footer-bottom-link" aria-label="Cookie Policy">Cookie Policy</a>
              <a href="#" className="footer-bottom-link" aria-label="Processing of personal data">Hantering av personuppgifter</a>
              <a href="#" className="footer-bottom-link" aria-label="Whistleblower">Whistleblower</a>
              <span>© 2023 Knowit AB</span>
            </div>
            <div className="footer-bottom-links-right">
              <a href="https://www.linkedin.com/company/knowit/" className="footer-bottom-link" aria-label="LinkedIn">LinkedIn</a>
              <a href="https://www.facebook.com/weareknowit" className="footer-bottom-link" aria-label="Facebook">Facebook</a>
              <a href="https://www.instagram.com/weareknowit/" className="footer-bottom-link" aria-label="Instagram">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
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
    <Router> {/* Wrap your entire app in Router */}
      <div className="App">
        {/* Cookie Consent Modal */}
        {showCookieModal && (
          <div className="cookie-modal">
            <div className="cookie-content">
              <div className="cookie-modal-title">This website uses cookies</div> 
              <p>
                We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. We also share information about your use of our site with our social media, advertising and analytics partners.
              </p>
              <div className="cookie-preferences">
                <label>
                  <input
                    type="checkbox"
                    checked={functionalityCookies}
                    onChange={() => setFunctionalityCookies(!functionalityCookies)}
                  />
                  Functionality cookies
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={statisticsCookies}
                    onChange={() => setStatisticsCookies(!statisticsCookies)}
                  />
                  Statistics cookies
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={marketingCookies}
                    onChange={() => setMarketingCookies(!marketingCookies)}
                  />
                  Marketing cookies
                </label>
              </div>
              <button className="cookie-details-toggle" onClick={toggleDetails}>
                Show details
              </button>
              <div className="cookie-buttons">
                <button className="deny-all" onClick={denyAllCookies}>Deny all</button>
                <button className="accept-all" onClick={acceptAllCookies}>Accept all</button>
                <button className="save-preferences" onClick={savePreferences}>Save preferences</button>
              </div>
            </div>
          </div>
        )}

        {/* Define your routes here */}
        <Routes>
          <Route path="/" element={<HomePageContent />} /> {/* Home page route (now the full landing page) */}
          <Route path="/team" element={<TeamPage />} /> {/* Team page route from incoming */}
          <Route path="/license" element={<License />} /> {/* Your License page route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;