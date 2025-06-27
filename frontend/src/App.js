// import './fonts/BagossStandard.woff'; This is the font knowit is using for logo, but downloading from knowit.se corrupts it or something.
import React, { useState, useEffect } from 'react'; // Import useState and useEffect hooks
import './App.css'; // You might want to keep or replace this with your styles.css
import './style.css'; // Make sure you moved your style.css here and are importing it

function App() {
  // --- Cookie Consent State and Logic ---
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [functionalityCookies, setFunctionalityCookies] = useState(false);
  const [statisticsCookies, setStatisticsCookies] = useState(false);
  const [marketingCookies, setMarketingCookies] = useState(false);

  useEffect(() => {
    // Check local storage on component mount
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowCookieModal(true);
    } else {
      // Load saved preferences if consent given
      setFunctionalityCookies(localStorage.getItem('functionalityCookies') === 'true');
      setStatisticsCookies(localStorage.getItem('statisticsCookies') === 'true');
      setMarketingCookies(localStorage.getItem('marketingCookies') === 'true');
    }
  }, []); // Empty dependency array means this runs once on mount

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
    // Implement toggle logic if needed, or remove if not used
    console.log("Toggle cookie details");
  };

  // --- Slideshow Logic (if applicable, ensure it's still needed/used) ---
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
    <div className="App">
      {/* Cookie Consent Modal */}
      {showCookieModal && (
        <div className="cookie-modal">
          <div className="cookie-content">
            {/* Changed to div to avoid breaking heading order if rendered before main H1 */}
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

      {/* Hero Section */}
      <section className="hero-gradient-bg">
        <header className="hero-header-nav-container"> {/* Replaced px-4 py-6 flex justify-between items-center */}
          <div className="app-logo-text">
            <img src="knowit-logo.png" alt="Knowit-logo" className="app-logo-image" />
          </div>
          <nav>
            <ul className="main-nav-list"> {/* Replaced flex space-x-6 */}
              <li><a href="#" className="main-nav-link">Services</a></li> {/* Replaced text-white hover:underline */}
              <li><a href="#" className="main-nav-link">About</a></li> {/* Replaced text-white hover:underline */}
              <li><a href="#" className="main-nav-link">Contact</a></li> {/* Replaced text-white hover:underline */}
            </ul>
          </nav>
        </header>

        <main className="hero-main-content"> {/* Replaced flex flex-col items-center justify-center text-center px-4 py-16 */}
          <h1 className="hero-title">Shaping a better future with code</h1> {/* Replaced text-5xl font-extrabold mb-4 */}
          <p className="hero-subtitle">We are a digitalization company that develops solutions and services.</p> {/* Replaced text-xl mb-8 */}
          <button className="hero-button"> {/* Replaced bg-light-blue-link text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 */}
            Read more about our team
          </button>
        </main>

        <div className="gradient-box">
          <div className="gradient-box-item">
            {/* Changed from h3 to h2 for correct heading hierarchy */}
            <h2 className="gradient-box-item-title">We create unique customer experiences</h2>
            <p>We are a digitalization company that develops solutions and services.</p>
          </div>
          <div className="gradient-box-item">
            {/* Changed from h3 to h2 for correct heading hierarchy */}
            <h2 className="gradient-box-item-title">Innovation through collaboration</h2>
            <p>We are a digitalization company that develops solutions and services.</p>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section-container"> {/* Replaced bg-beige py-16 px-4 text-darkblue */}
        <div className="news-content-wrapper"> {/* Replaced max-w-screen-xl mx-auto */}
          <h2 className="news-heading">News</h2>
          <div className="news-grid-container"> {/* Replaced grid grid-cols-1 gap-8 mb-16 */}
            <a href="#" className="news-item-link group"> {/* Retained group for arrow hover, but other classes are custom */}
              <div>
                <p className="news-item-meta">2025-06-26 <span className="news-item-meta-bold">Summer Project 2025</span></p> {/* Replaced text-sm font-semibold */}
                <h3 className="news-item-title">Kristoffer, Sasan, Sakshi and Johanna is creating a landing page and automating a process, by using AI for everything.</h3> {/* Replaced text-xl font-semibold mt-1 */}
              </div>
              <span className="news-item-arrow"> {/* Replaced transform transition-transform duration-300 group-hover:translate-x-1 */}
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
      <footer className="bg-beige footer-section"> {/* Added footer-section for overall footer styling */}
        <div className="container footer-container"> {/* Removed mx-auto, px-4 */}
          {/* Main Footer Grid */}
          <div className="footer-main-grid"> {/* Replaced grid/cols with custom class */}
            {/* Column 1: Become one of us */}
            <div className="become-one-of-us-column">
              <h3 className="become-one-of-us-heading">Become one of us</h3>
              <a href="#" className="become-one-of-us-link" aria-label="Hitta ditt nya jobb här"> {/* Changed classes */}
                Hitta ditt nya jobb här
                <span className="arrow-icon"> {/* Changed classes */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
            </div>

            {/* Column 2: CONTACT */}
            <div className="footer-column"> {/* Added custom class */}
              <h4 className="footer-column-heading">CONTACT</h4> {/* Added custom class */}
              <ul>
                <li><p className="footer-text">Box 3390, SE-103 68 Stockholm</p></li>
                <li><p className="footer-text">Besök: Klarabergsgatan 60, Stockholm</p></li>
                <li><p className="footer-text">Tel: +46 10 279 70 00</p></li>
                <li><p className="footer-text">E-mail: <a href="mailto:info@knowit.se" className="footer-link">info@knowit.se</a></p></li>
              </ul>
            </div>

            {/* Column 3: ABOUT KNOWIT */}
            <div className="footer-column"> {/* Added custom class */}
              <h4 className="footer-column-heading">ABOUT KNOWIT</h4> {/* Added custom class */}
              <ul>
                <li><a href="#" className="footer-link">Our history</a></li>
                <li><a href="#" className="footer-link">Our values</a></li>
                <li><a href="#" className="footer-link">Our employees</a></li>
                <li><a href="#" className="footer-link">Investor relations</a></li>
                <li><a href="#" className="footer-link">Career</a></li>
              </ul>
            </div>

            {/* Column 4: BUSINESS AREAS */}
            <div className="footer-column"> {/* Added custom class */}
              <h4 className="footer-column-heading">BUSINESS AREAS</h4> {/* Added custom class */}
              <ul>
                <li><a href="#" className="footer-link">Knowit Experience</a></li>
                <li><a href="#" className="footer-link">Knowit Connectivity</a></li>
                <li><a href="#" className="footer-link">Knowit Solutions</a></li>
                <li><a href="#" className="footer-link">Knowit Insight</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer Links */}
          <div className="footer-bottom-row"> {/* Replaced flex/justify/items/text/mt/pt/border-t with custom class */}
            <div className="footer-bottom-links-left"> {/* Replaced flex/flex-wrap/space-x-4/mb-4/md:mb-0 */}
              <a href="#" className="footer-bottom-link" aria-label="Cookie Policy">Cookie Policy</a>
              <a href="#" className="footer-bottom-link" aria-label="Processing of personal data">Hantering av personuppgifter</a>
              <a href="#" className="footer-bottom-link" aria-label="Whistleblower">Whistleblower</a>
              <span>© 2023 Knowit AB</span>
            </div>
            <div className="footer-bottom-links-right"> {/* Replaced flex/flex-wrap/space-x-4 */}
              <a href="https://www.linkedin.com/company/knowit/" className="footer-bottom-link" aria-label="LinkedIn">LinkedIn</a>
              <a href="https://www.facebook.com/weareknowit" className="footer-bottom-link" aria-label="Facebook">Facebook</a>
              <a href="https://www.instagram.com/weareknowit/" className="footer-bottom-link" aria-label="Instagram">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;