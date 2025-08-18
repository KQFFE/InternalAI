import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-content-grid">
                <div className="footer-main-grid">
                    <div className="footer-careers-section" id="footer-careers">
                        <h2 className="careers-heading">Become one of us</h2>
                        <a href="https://www.knowit.se/karriar/lediga-jobb/" id="footer-careers-button" className="careers-link" target="_blank" rel="noopener noreferrer">
                            Hitta ditt nya jobb här
                            <svg viewBox="0 0 20 20" focusable="false" className="arrow-icon" aria-hidden="true"><path d="M10.6364 2.35791C13.5455 5.26782 16.6667 8.10115 20 10.8579C16.4848 13.787 13.3636 16.6203 10.6364 19.3579L8.90909 17.7211L13.0606 14.1603C13.9697 13.3754 14.899 12.6766 15.8485 12.064C14.6364 12.0257 13.4141 12.0066 12.1818 12.0066H0V9.70926H12.1818C13.4141 9.70926 14.596 9.78584 15.7273 9.93899L13.0606 7.58426L8.90909 3.99473L10.6364 2.35791Z" fill="currentColor"></path></svg>
                        </a>
                    </div>
                    <div className="footer-links-section">
                        <div className="footer-column" id="footer-contact">
                            <h3 className="footer-column-title">Kontakt</h3>
                            <address>
                                <p>Knowit AB</p>
                                <p><a href="tel:087006600" id="contact-phone">08 700 66 00</a><br /><a href="mailto:info@knowit.se" id="contact-email">info@knowit.se</a></p>
                                <p>Box 3383<br />103 68 Stockholm<br />Sverige</p>
                                <p>Besök oss: Sveavägen 20</p>
                            </address>
                        </div>
                        <div className="footer-column" id="footer-about">
                            <h3 className="footer-column-title">Om Knowit</h3>
                            <ul>
                                <li><a href="https://www.knowit.se/om-knowit/" id="about-history">Om oss</a></li>
                                <li><a href="https://www.knowit.se/om-knowit/hallbarhet/" id="about-values">Hållbarhet</a></li>
                                <li><a href="https://www.knowit.se/nyheter-press/" id="about-employees">Nyheter & press</a></li>
                                <li><a href="https://www.knowit.se/om-knowit/partners/" id="about-investors">Partners</a></li>
                            </ul>
                        </div>
                        <div className="footer-column" id="footer-business">
                            <h3 className="footer-column-title">Affärsområden</h3>
                            <ul>
                                <li><a href="https://www.knowit.se/om-knowit/solutions/" id="business-solutions">Knowit Solutions</a></li>
                                <li><a href="https://www.knowit.se/om-knowit/experience/" id="business-experience">Knowit Experience</a></li>
                                <li><a href="https://www.knowit.se/om-knowit/connectivity/" id="business-connectivity">Knowit Connectivity</a></li>
                                <li><a href="https://www.knowit.se/om-knowit/insight/" id="business-insight">Knowit Insight</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom-section">
                    <div className="footer-bottom-links">
                        <Link to="/cookie-policy" id="footer-cookies">Cookie policy</Link>
                        <a href="https://www.knowit.se/misc/hantering-av-personuppgifter/" id="footer-privacy" target="_blank" rel="noopener noreferrer">Hantering av personuppgifter</a>
                        <a href="https://knowit.whistlelink.com/" id="footer-whistleblower" target="_blank" rel="noopener noreferrer">Whistleblower</a>
                        <span id="footer-copyright">© {new Date().getFullYear()} Knowit AB</span>
                    </div>
                    <div className="footer-social-links">
                        <a href="https://www.linkedin.com/company/knowit" id="footer-linkedin" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" role="img">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/weareknowit" id="footer-facebook" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" role="img">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.888v1.112h3l-.238 3h-2.762v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z" />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/weareknowit/" id="footer-instagram" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" role="img">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;