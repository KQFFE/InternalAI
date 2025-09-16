// frontend/src/components/Layout.js - Updated version
import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';
import Footer from './Footer';

function Layout({ openCookiePolicy }) {
    return (
        // This div provides the consistent background for all pages
        <div className="hero-gradient-bg font-sans text-gray-300 min-h-screen flex flex-col">
            <Header showNavigation={true} />

            {/* The Outlet component renders the active child route (e.g., HomePage or TeamPage) */}
            <div className="flex-grow">
                <Outlet />
            </div>
            <Footer openCookiePolicy={openCookiePolicy} />
        </div>
    );
}

export default Layout;