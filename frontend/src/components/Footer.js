import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-links">
                    <Link to="/cookie-policy" className="footer-link">Cookie Policy</Link>
                    <a href="https://www.knowit.se/om-webbplatsen/hantering-av-personuppgifter/" target="_blank" rel="noopener noreferrer" className="footer-link">Hantering av personuppgifter</a>
                    <Link to="/whistleblower" className="footer-link">Whistleblower</Link>
                </div>
                <div className="footer-social">
                    <a href="https://www.linkedin.com/company/knowit" target="_blank" rel="noopener noreferrer" id="footer-linkedin" aria-label="Follow us on LinkedIn" className="social-link">
                        LinkedIn
                    </a>
                    <a href="https://www.facebook.com/KnowitSverige" target="_blank" rel="noopener noreferrer" id="footer-facebook" aria-label="Follow us on Facebook" className="social-link">
                        Facebook
                    </a>
                    <a href="https://www.instagram.com/knowitnorge/" target="_blank" rel="noopener noreferrer" id="footer-instagram" aria-label="Follow us on Instagram" className="social-link">
                        Instagram
                    </a>
                </div>
                <div className="footer-copyright">
                    <p>© {new Date().getFullYear()} Knowit AB</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;