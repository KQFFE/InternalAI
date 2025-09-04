// frontend/src/components/Header.js - Reusable header component
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header({ centerTitle = null, showNavigation = true }) {
    const { isAdmin, isLoading, openLoginModal, logout } = useAuth();

    return (
        <header
            className="app-header"
            role="banner"
            aria-label="Main navigation header"
        >
            {/* Main branding/logo link - always on left */}
            <div className="header-logo" data-testid="header-logo">
                <Link to="/" aria-label="Go to homepage">
                    <img
                        src="/knowit-logo.png"
                        alt="Knowit company logo"
                        className="app-logo-image h-8 w-auto logo-white"
                        id="main-logo"
                    />
                </Link>
            </div>

            {/* Center title (for admin pages) or flexible space */}
            <div className="header-center" data-testid="header-center">
                {centerTitle && (
                    <h1 className="header-center-title">{centerTitle}</h1>
                )}
            </div>

            {/* Right side - Navigation and auth */}
            <div className="header-right" data-testid="header-right">
                {/* Navigation links - only show if enabled */}
                {showNavigation && (
                    <nav className="header-nav" role="navigation" aria-label="Main navigation">
                        {/* Our Team - only show when authenticated */}
                        {!isLoading && isAdmin && (
                            <Link
                                to="/team"
                                id="nav-team"
                                className="header-nav-link"
                                data-testid="team-nav"
                            >
                                Our Team
                            </Link>
                        )}
                        <Link
                            to="/services"
                            id="nav-services"
                            className="header-nav-link"
                        >
                            Services
                        </Link>
                        <Link
                            to="/contact"
                            id="nav-contact"
                            className="header-nav-link"
                        >
                            Contact
                        </Link>

                        {/* Admin Panel Navigation - only show when authenticated */}
                        {!isLoading && isAdmin && (
                            <Link
                                to="/admin"
                                id="nav-admin-panel"
                                className="header-nav-link"
                                data-testid="admin-panel-nav"
                            >
                                Admin Panel
                            </Link>
                        )}
                    </nav>
                )}

                {/* Admin Auth Section */}
                <div className="header-auth">
                    {!isLoading && (
                        isAdmin ? (
                            <button
                                type="button"
                                data-testid="admin-logout-button"
                                onClick={logout}
                                className="admin-button logout-button"
                            >
                                Logout
                            </button>
                        ) : (
                                <button
                                    type="button"
                                    data-testid="admin-login-button"
                                    onClick={openLoginModal}
                                    className="admin-button login-button"
                            >
                                Admin
                            </button>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;