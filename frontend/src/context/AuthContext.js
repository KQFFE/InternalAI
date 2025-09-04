// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export { AuthContext };
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Check if the user is already authenticated on page load
    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/status');
            if (response.ok) {
                const data = await response.json();
                setIsAdmin(data.isAuthenticated);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsAdmin(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);

    const handleLoginSuccess = () => {
        setIsAdmin(true);
        closeLoginModal();
    };

    const logout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsAdmin(false);
            // Always navigate to home page after logout
            navigate('/');
        }
    };

    const value = {
        isAdmin,
        isLoginModalOpen,
        isLoading,
        handleLoginSuccess,
        logout,
        openLoginModal,
        closeLoginModal
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};