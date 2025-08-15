import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';
import Footer from './Footer';

function Layout() {
    const { isAdmin, isLoading, openLoginModal, logout } = useAuth();

    return (
        // This div provides the consistent background for all pages
        <div className="hero-gradient-bg font-sans text-gray-300 min-h-screen flex flex-col">
            <header
                className="flex justify-between items-center p-6 md:p-10 container mx-auto"
                role="banner"
                aria-label="Main navigation header"
            >
                {/* Main branding/logo link */}
                <div className="text-2xl font-bold">
                    <Link to="/" aria-label="Go to homepage">
                        <img
                            src="/knowit-logo.png"
                            alt="Knowit company logo"
                            className="app-logo-image h-8 w-auto logo-white"
                            id="main-logo"
                        />
                    </Link>
                </div>
                <div className="flex items-center space-x-8">
                    {/* Navigation links */}
                    <nav className="flex items-center space-x-6" role="navigation" aria-label="Main navigation">
                        <Link
                            to="/team" id="nav-team"
                            className="main-nav-link text-white text-lg hover:underline"
                        >
                            Our Team
                        </Link>
                        <Link
                            to="/services" id="nav-services"
                            className="main-nav-link text-white text-lg hover:underline"
                        >
                            Services
                        </Link>
                        <Link
                            to="/contact" id="nav-contact"
                            className="main-nav-link text-white text-lg hover:underline"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Admin Auth Section */}
                    <div className="admin-auth-section">
                        {!isLoading && (
                            isAdmin ? (
                                <button data-testid="admin-logout-button" onClick={logout} className="admin-button logout-button">
                                    Logout
                                </button>
                            ) : (
                                <button data-testid="admin-login-button" onClick={openLoginModal} className="admin-button login-button">
                                    Admin
                                </button>
                            )
                        )}
                    </div>
                </div>
            </header>

            {/* The Outlet component renders the active child route (e.g., HomePage or TeamPage) */}
            <div className="flex-grow">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default Layout;