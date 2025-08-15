import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const footerClassName = `site-footer ${isHomePage ? 'site-footer--homepage' : ''}`;

    return (
        <footer className={footerClassName}>
            <div className="footer-content-grid">
                <div className="footer-main-grid">
                    <div className="footer-careers-section">
                        <h2 className="careers-heading">Become one of us</h2>
                        <a href="https://www.knowit.se/karriar/lediga-jobb/" className="careers-link" target="_blank" rel="noopener noreferrer">
                            Hitta ditt nya jobb här
                            <svg viewBox="0 0 20 20" focusable="false" className="arrow-icon" aria-hidden="true"><path d="M10.6364 2.35791C13.5455 5.26782 16.6667 8.10115 20 10.8579C16.4848 13.787 13.3636 16.6203 10.6364 19.3579L8.90909 17.7211L13.0606 14.1603C13.9697 13.3754 14.899 12.6766 15.8485 12.064C14.6364 12.0257 13.4141 12.0066 12.1818 12.0066H0V9.70926H12.1818C13.4141 9.70926 14.596 9.78584 15.7273 9.93899L13.0606 7.58426L8.90909 3.99473L10.6364 2.35791Z" fill="currentColor"></path></svg>
                        </a>
                    </div>
                    <div className="footer-links-section">
                        <div className="footer-column">
                            <h3 className="footer-column-title">Kontakt</h3>
                            <address>
                                <p>Knowit AB</p>
                                <p><a href="tel:087006600">08 700 66 00</a><br /><a href="mailto:info@knowit.se">info@knowit.se</a></p>
                                <p>Box 3383<br />103 68 Stockholm<br />Sverige</p>
                                <p>Besök oss: Sveavägen 20</p>
                            </address>
                        </div>
                        <div className="footer-column">
                            <h3 className="footer-column-title">Om Knowit</h3>
                            <ul>
                                <li><a href="https://www.knowit.se/om-knowit/">Om oss</a></li>
                                <li><a href="https://www.knowit.se/om-knowit/hallbarhet/">Hållbarhet</a></li>
                                <li><a href="https://www.knowit.se/nyheter-press/">Nyheter & press</a></li>
                                <li><a href="https://www.knowit.se/om-knowit/partners/">Partners</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3 className="footer-column-title">Affärsområden</h3>
                            <ul>
                                <li><a href="https://www.knowit.se/om-knowit/solutions/">Knowit Solutions</a></li>
                                <li><a href="https://www.knowit.se/om-knowit/experience/">Knowit Experience</a></li>
                                <li><a href="https://www.knowit.se/om-knowit/connectivity/">Knowit Connectivity</a></li>
                                <li><a href="https://www.knowit.se/om-knowit/insight/">Knowit Insight</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom-section">
                    <div className="footer-bottom-links">
                        <Link to="/cookie-policy">Cookie policy</Link>
                        <a href="https://www.knowit.se/misc/hantering-av-personuppgifter/" target="_blank" rel="noopener noreferrer">Hantering av personuppgifter</a>
                        <a href="https://knowit.whistlelink.com/" target="_blank" rel="noopener noreferrer">Whistleblower</a>
                        <span>© {new Date().getFullYear()} Knowit AB</span>
                    </div>
                    <div className="footer-social-links">
                        <a href="https://www.linkedin.com/company/knowit" target="_blank" rel="noopener noreferrer">Linkedin</a>
                        <a href="https://www.facebook.com/weareknowit" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="https://www.instagram.com/weareknowit/" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;