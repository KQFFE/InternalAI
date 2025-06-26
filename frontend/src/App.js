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
    setFunctionalityCookies(true);
    setStatisticsCookies(true);
    setMarketingCookies(true);
    setShowCookieModal(false);
  };

  const denyAllCookies = () => {
    localStorage.setItem('cookieConsent', 'denied');
    localStorage.setItem('functionalityCookies', 'false');
    localStorage.setItem('statisticsCookies', 'false');
    localStorage.setItem('marketingCookies', 'false');
    setFunctionalityCookies(false);
    setStatisticsCookies(false);
    setMarketingCookies(false);
    setShowCookieModal(false);
  };

  const [showCookieDetails, setShowCookieDetails] = useState(false);
  const toggleCookiePreferences = () => {
    setShowCookieDetails(!showCookieDetails);
  };

  // --- Slideshow State and Logic ---
  const [slideIndex, setSlideIndex] = useState(1); // Start with the first slide

  useEffect(() => {
    // This useEffect will run whenever slideIndex changes
    // It's the React way to handle side effects like showing/hiding slides
    const slides = document.getElementsByClassName("mySlides"); // Using getElementsByClassName for direct DOM manipulation temporarily,
                                                            // but ideally, this would be done by mapping through an array of slide data and conditionally rendering classes.
    if (slides.length === 0) return; // Prevent error if slides are not yet rendered

    // Loop logic similar to your original JS
    let newIndex = slideIndex;
    if (newIndex > slides.length) { newIndex = 1; }
    if (newIndex < 1) { newIndex = slides.length; }

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    // Show the current slide
    if (slides[newIndex - 1]) {
      slides[newIndex - 1].style.display = "grid"; // Or 'block', depending on your CSS
    }
    setSlideIndex(newIndex); // Ensure slideIndex is within bounds after corrections
  }, [slideIndex]); // Rerun effect when slideIndex changes

  const plusSlides = (n) => {
    setSlideIndex(prevIndex => prevIndex + n);
  };

  // const currentSlide = (n) => { // You might not need this if not using dot indicators
  //   setSlideIndex(n);
  // };

  return (
    <div className="App">
      {/* Cookie Consent Modal */}
      {showCookieModal && (
        <div id="cookieConsentModal" className="cookie-modal"> {/* Removed 'hidden' class, controlled by state */}
          <div className="cookie-content" role="dialog" aria-modal="true" aria-labelledby="cookieConsentTitle" aria-describedby="cookieConsentDescription">
            <h2 id="cookieConsentTitle">We use cookies</h2>
            <p id="cookieConsentDescription">
              Knowit uses cookies for analytical purposes to improve your user experience.
              Information about you will not be stored, for that we use a tool that is adapted to only collect anonymous information.
              You decide for yourself if you want to allow "All cookies".
            </p>
            <p>
              By clicking "Accept all" you agree to our use of all cookies.
            </p>
            <p>
              You can read more and withdraw your consent at any time by clicking the cookie icon at the bottom left of the page.
            </p>
            <a href="#" className="text-lightblue text-sm hover:underline block mb-4" aria-label="Read more about our cookies">Read more about our cookies</a>

            <div className="cookie-buttons flex space-x-4 mb-4">
              <button type="button" className="deny-all flex-1" onClick={denyAllCookies} aria-label="Deny all cookies">DENY ALL</button>
              <button type="button" className="accept-all flex-1" onClick={acceptAllCookies} aria-label="Accept all cookies">ACCEPT ALL</button>
            </div>
            <button type="button" className="cookie-details-toggle text-lightblue hover:underline" onClick={toggleCookiePreferences} aria-expanded={showCookieDetails} aria-controls="cookiePreferences">
              {showCookieDetails ? 'Hide details' : 'Show details'} {/* Text changes based on state */}
            </button>

            {showCookieDetails && ( // Conditionally render details
              <div id="cookiePreferences" className="cookie-preferences">
                <label htmlFor="necessary-cookies"> {/* htmlFor instead of for */}
                  <input type="checkbox" id="necessary-cookies" checked disabled aria-checked="true" readOnly /> {/* readOnly for controlled inputs */}
                  <span>Necessary (Always on)</span>
                </label>
                <label htmlFor="functionality-cookies">
                  <input
                    type="checkbox"
                    id="functionality-cookies"
                    checked={functionalityCookies} // Controlled by state
                    onChange={(e) => {
                      setFunctionalityCookies(e.target.checked);
                      localStorage.setItem('functionalityCookies', e.target.checked);
                    }}
                    aria-checked={functionalityCookies}
                  />
                  <span>Functionality</span>
                </label>
                <label htmlFor="statistics-cookies">
                  <input
                    type="checkbox"
                    id="statistics-cookies"
                    checked={statisticsCookies}
                    onChange={(e) => {
                      setStatisticsCookies(e.target.checked);
                      localStorage.setItem('statisticsCookies', e.target.checked);
                    }}
                    aria-checked={statisticsCookies}
                  />
                  <span>Statistics</span>
                </label>
                <label htmlFor="marketing-cookies">
                  <input
                    type="checkbox"
                    id="marketing-cookies"
                    checked={marketingCookies}
                    onChange={(e) => {
                      setMarketingCookies(e.target.checked);
                      localStorage.setItem('marketingCookies', e.target.checked);
                    }}
                    aria-checked={marketingCookies}
                  />
                  <span>Marketing</span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="hero-gradient-bg font-inter">
        {/* Header Section */}
        <header className="flex justify-between items-center p-6 md:p-10 container mx-auto">
          <div className="text-2xl font-bold">knowit</div>
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-white text-lg" aria-label="Search">Sök</a>
            <a href="#" className="text-white text-lg" aria-label="Menu">Meny ☰</a>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col justify-center items-start p-6 md:p-10 container mx-auto">
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-8 max-w-3xl">
            Building the future takes a whole set of digitalization skills. Welcome to our world.
          </h1>
          <div className="flex flex-wrap gap-4 mb-16">
            <a href="#" className="text-white text-lg flex items-center space-x-2 group" aria-label="Our offering">
              Vårt erbjudande
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a href="#" className="text-white text-lg flex items-center space-x-2 group" aria-label="Customers">
              Kunder
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a href="#" className="text-white text-lg flex items-center space-x-2 group" aria-label="Career">
              Karriär
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Placeholder for image/slideshow from the image */}
          <div className="gradient-box relative w-full mb-8 flex items-end p-4">
            <p className="text-white text-sm opacity-80" aria-label="Design inspired by the Nordic sky above Knowit, Örebro">
              Design inspired by the Nordic sky above Knowit, Örebro ©
            </p>
            <div className="absolute bottom-4 right-4 flex items-center space-x-4 text-white text-sm">
              <span aria-label="Temperature 15 degrees Celsius">15°C</span>
              <span aria-label="Wind speed 1.2 meters per second">1.2 m/s</span>
              <span aria-label="Time 07:12">07:12</span>
            </div>
          </div>
        </main>
      </div>

      {/* Middle Section: Slideshow and YouTube Clip */}
      <section className="bg-beige text-darkblue py-16 md:py-24 px-6">
        <div className="container mx-auto">
          {/* Slider Navigation */}
          <div className="flex justify-center items-center pb-6 md:pb-10 space-x-4 mb-8">
            <span className="text-darkblue text-lg">{slideIndex} / 03</span> {/* Dynamically show slide number */}
            <button type="button" className="text-darkblue text-2xl" onClick={() => plusSlides(-1)} aria-label="Previous slide">←</button>
            <button type="button" className="text-darkblue text-2xl" onClick={() => plusSlides(1)} aria-label="Next slide">→</button>
          </div>

          <div className="slideshow-container mb-16">
            {/* Slide 1 */}
            <div className="mySlides fade grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-xl shadow-lg"
                 style={{ display: slideIndex === 1 ? 'grid' : 'none' }}> {/* Controlled by React state */}
              <div className="flex flex-col items-center justify-center p-4">
                <img src="https://placehold.co/200x100/eeeeee/333333?text=Knowit+Insicon+Logo" alt="Knowit Insicon Logo" className="mb-4 max-w-full h-auto" />
              </div>
              <div className="text-darkblue">
                <h3 className="text-2xl font-semibold mb-4">Knowit acquires consulting and software company Insicon</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Knowit AB has acquired 100 percent of the Swedish company Insicon, which offers a comprehensive business system
                  for the insurance industry in combination with consulting services in the European
                  market. Insicon has a total of 50 employees and
                  market functions in Sweden, as well as a larger development and support unit in Serbia.
                  The acquisition of Insicon means that Knowit gains a strong position in fintech with a
                  platform-based consulting business adapted to customers in the banking, finance,
                  and insurance segment.
                </p>
                <a href="#" className="text-lightblue flex items-center space-x-2 group hover:underline" aria-label="Read more about Insicon acquisition">
                  Read more
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>

            {/* Slide 2 (Placeholder) */}
            <div className="mySlides fade grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-xl shadow-lg"
                 style={{ display: slideIndex === 2 ? 'grid' : 'none' }}> {/* Controlled by React state */}
              <div className="flex flex-col items-center justify-center p-4">
                <img src="https://placehold.co/200x100/eeeeee/333333?text=Placeholder+Image+2" alt="Placeholder image for slide 2" className="mb-4 max-w-full h-auto" />
              </div>
              <div className="text-darkblue">
                <h3 className="text-2xl font-semibold mb-4">Another exciting update from Knowit!</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Details about another significant event or achievement by Knowit. This section would typically contain
                  information about a new project, partnership, or innovation.
                </p>
                <a href="#" className="text-lightblue flex items-center space-x-2 group hover:underline" aria-label="Learn more about this update">
                  Learn more
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>

            {/* Slide 3 (Placeholder) */}
            <div className="mySlides fade grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-xl shadow-lg"
                 style={{ display: slideIndex === 3 ? 'grid' : 'none' }}> {/* Controlled by React state */}
              <div className="flex flex-col items-center justify-center p-4">
                <img src="https://placehold.co/200x100/eeeeee/333333?text=Placeholder+Image+3" alt="Placeholder image for slide 3" className="mb-4 max-w-full h-auto" />
              </div>
              <div className="text-darkblue">
                <h3 className="text-2xl font-semibold mb-4">Innovating for a digital future</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Discover how Knowit is driving innovation and shaping the digital landscape with cutting-edge
                  solutions and expert insights.
                </p>
                <a href="#" className="text-lightblue flex items-center space-x-2 group hover:underline" aria-label="Explore our innovations">
                  Explore more
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="video-container rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=cT2GgQYcEwS4_WpB"
              title="YouTube video player"
              frameBorder="0" // frameborder becomes frameBorder
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin" // referrerpolicy becomes referrerPolicy
              allowFullScreen // allowfullscreen becomes allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Bottom Section: News and Footer */}
      <footer className="bg-lightorange text-darkblue py-16 md:py-24 px-6 font-inter">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-12">News</h2>

          {/* News Links */}
          <div className="grid grid-cols-1 gap-8 mb-16">
            <a href="#" className="flex justify-between items-center border-b border-darkblue pb-4 group" aria-label="News: Innovation Norway chooses Knowit to modernize its banking platform">
              <div>
                <p className="text-graytext text-sm mb-1">2025-06-25 <span className="font-bold">Press release</span></p>
                <p className="text-xl font-medium">Innovation Norway chooses Knowit to modernize its banking platform</p>
              </div>
              <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>
            <a href="#" className="flex justify-between items-center border-b border-darkblue pb-4 group" aria-label="News: Knowit acquires consulting and software company Insicon">
              <div>
                <p className="text-graytext text-sm mb-1">2025-06-20 <span className="font-bold">Pressmeddelande</span></p>
                <p className="text-xl font-medium">Knowit acquires consulting and software company Insicon</p>
              </div>
              <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>
            <a href="#" className="flex justify-between items-center border-b border-darkblue pb-4 group" aria-label="News: Knowit acquires consulting firm Milso and further strengthens its position in the defense sector">
              <div>
                <p className="text-graytext text-sm mb-1">2025-06-10 <span className="font-bold">Pressmeddelande</span></p>
                <p className="text-xl font-medium">Knowit acquires consulting firm Milso and further strengthens its position in the defense sector</p>
              </div>
              <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>
          </div>

          <a href="#" className="flex items-center space-x-2 text-darkblue font-semibold text-lg group mb-24" aria-label="View more news">
            Fler nyheter
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
          </a>

          {/* Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <h3 className="text-5xl font-bold mb-8 transform -rotate-6 origin-bottom-left max-w-xs leading-none">Become one of us</h3>
              <a href="#" className="flex items-center space-x-2 text-darkblue font-semibold text-lg group hover:underline" aria-label="Find your new job here">
                Hitta ditt nya jobb här
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">CONTACT</h4>
              <ul className="space-y-2 text-sm">
                <li>Knowit AB</li>
                <li><a href="tel:+4670090000" className="hover:underline" aria-label="Call Knowit: +46 700 900 00">+46 700 900 00</a></li>
                <li><a href="mailto:info@knowit.se" className="hover:underline" aria-label="Email Knowit: info@knowit.se">info@knowit.se</a></li>
                <li>Box 3383</li>
                <li>103 68 Stockholm</li>
                <li>Sverige</li>
                <li><a href="#" className="hover:underline" aria-label="Visit us: See all 20 offices">Besök oss: Se alla 20</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">ABOUT KNOWIT</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline" aria-label="About us">Om oss</a></li>
                <li><a href="#" className="hover:underline" aria-label="Sustainability">Hållbarhet</a></li>
                <li><a href="#" className="hover:underline" aria-label="News & press">Nyheter & press</a></li>
                <li><a href="#" className="hover:underline" aria-label="Partners">Partners</a></li>
                <li><a href="#" className="hover:underline" aria-label="Knowit Business Portal">Knowit Business Portal</a></li>
                <li><a href="#" className="hover:underline" aria-label="Framework agreements">Ramavtal</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">BUSINESS AREAS</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline" aria-label="Knowit Experience">Knowit Experience</a></li>
                <li><a href="#" className="hover:underline" aria-label="Knowit Connectivity">Knowit Connectivity</a></li>
                <li><a href="#" className="hover:underline" aria-label="Knowit Solutions">Knowit Solutions</a></li>
                <li><a href="#" className="hover:underline" aria-label="Knowit Insight">Knowit Insight</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer Links */}
          <div className="flex flex-wrap justify-between items-center text-sm text-darkblue">
            <div className="flex flex-wrap space-x-4 mb-4 md:mb-0">
              <a href="#" className="hover:underline" aria-label="Cookie Policy">Cookie Policy</a>
              <a href="#" className="hover:underline" aria-label="Processing of personal data">Hantering av personuppgifter</a>
              <a href="#" className="hover:underline" aria-label="Whistleblower">Whistleblower</a>
              <span>© 2023 Knowit AB</span>
            </div>
            <div className="flex flex-wrap space-x-4">
              <a href="#" className="hover:underline" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" className="hover:underline" aria-label="Facebook">Facebook</a>
              <a href="#" className="hover:underline" aria-label="Instagram">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;