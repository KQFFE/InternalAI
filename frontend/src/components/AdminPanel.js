import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from './AdminLogin';
import './AdminPanel.css';

const AdminPanel = () => {
    //const { isAdmin, isLoading, handleLoginSuccess, logout } = useAuth();
    const { isAdmin = false, isLoading = false, handleLoginSuccess = () => { }, logout = () => { } } = useAuth() || {};
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
            <header className="admin-header" data-testid="admin-header">
                <h1>Admin Panel</h1>
                <div className="admin-actions" data-testid="admin-actions">
                    <button
                        onClick={logout}
                        className="logout-button"
                        type="button"
                        data-testid="logout-button"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="admin-content" data-testid="admin-content">
                <div className="admin-dashboard" data-testid="admin-dashboard">
                    <h2>Dashboard</h2>
                    <p>Welcome to the admin panel. This is where you'll manage the application.</p>

                    {/* Placeholder for future admin functionality */}
                    <div className="admin-sections" data-testid="admin-sections">
                        <div className="admin-card" data-testid="team-management-card">
                            <h3>Team Management</h3>
                            <p>Manage team members and their information.</p>
                            <button disabled data-testid="team-management-button">Coming Soon</button>
                        </div>

                        <div className="admin-card" data-testid="content-management-card">
                            <h3>Content Management</h3>
                            <p>Update website content and pages.</p>
                            <button disabled data-testid="content-management-button">Coming Soon</button>
                        </div>

                        <div className="admin-card" data-testid="settings-card">
                            <h3>Settings</h3>
                            <p>Configure application settings.</p>
                            <button disabled data-testid="settings-button">Coming Soon</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;