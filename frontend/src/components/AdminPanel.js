// frontend/src/components/AdminPanel.js - Updated to use unified header
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from './AdminLogin';
import Header from './Header';
import './AdminPanel.css';

const AdminPanel = () => {
    const { isAdmin = false, isLoading = false, handleLoginSuccess = () => { } } = useAuth() || {};

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="admin-loading" data-testid="admin-loading">
                <div className="loading-spinner" data-testid="loading-spinner"></div>
                <p>Checking authentication...</p>
            </div>
        );
    }

    // Show login form if not authenticated
    if (!isAdmin) {
        return (
            <div className="admin-login-wrapper" data-testid="admin-login-wrapper">
                <AdminLogin onLogin={handleLoginSuccess} />
            </div>
        );
    }

    // Show admin interface if authenticated
    return (
        <div className="admin-panel" data-testid="admin-panel">
            {/* Header wrapper with test ID */}
            <Header centerTitle="Admin Panel" showNavigation={false} />

            <div className="admin-content" data-testid="admin-content">
                <div className="admin-dashboard" data-testid="admin-dashboard">
                    <h2>Dashboard</h2>
                    <p>Welcome to the admin panel. This is where you'll manage the application.</p>
                </div>

                <div className="admin-sections" data-testid="admin-sections">
                    <div className="admin-card" data-testid="team-management-card">
                        <h3>Team Management</h3>
                        <p>Manage team members, add new members, and update information.</p>
                        <button data-testid="team-management-button" disabled>Coming Soon</button>
                    </div>

                    <div className="admin-card" data-testid="content-management-card">
                        <h3>Content Management</h3>
                        <p>Update site content, news articles, and company information.</p>
                        <button data-testid="content-management-button" disabled>Coming Soon</button>
                    </div>

                    <div className="admin-card" data-testid="user-analytics-card">
                        <h3>User Analytics</h3>
                        <p>View site usage statistics and user behavior insights.</p>
                        <button data-testid="user-analytics-button" disabled>Coming Soon</button>
                    </div>

                    <div className="admin-card" data-testid="settings-card">
                        <h3>Settings</h3>
                        <p>Configure application settings and preferences.</p>
                        <button data-testid="settings-button" disabled>Coming Soon</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;