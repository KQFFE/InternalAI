import React, { createContext, useState, useContext, useEffect } from 'react';

const CookieConsentContext = createContext(null);

export const useCookieConsent = () => useContext(CookieConsentContext);

export const CookieConsentProvider = ({ children }) => {
    const [showCookieModal, setShowCookieModal] = useState(false);
    const [showPolicyView, setShowPolicyView] = useState(false);
    const [functionalityCookies, setFunctionalityCookies] = useState(false);
    const [statisticsCookies, setStatisticsCookies] = useState(false);
    const [marketingCookies, setMarketingCookies] = useState(false);

    useEffect(() => {
        const hasConsent = localStorage.getItem('cookieConsent');
        if (!hasConsent) {
            setShowCookieModal(true);
        } else {
            setFunctionalityCookies(localStorage.getItem('functionalityCookies') === 'true');
            setStatisticsCookies(localStorage.getItem('statisticsCookies') === 'true');
            setMarketingCookies(localStorage.getItem('marketingCookies') === 'true');
            setShowCookieModal(false);
        }
    }, []);

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

    const declineAllCookies = () => {
        localStorage.setItem('cookieConsent', 'denied');
        localStorage.setItem('functionalityCookies', 'false');
        localStorage.setItem('statisticsCookies', 'false');
        localStorage.setItem('marketingCookies', 'false');
        setFunctionalityCookies(false);
        setStatisticsCookies(false);
        setMarketingCookies(false);
        setShowCookieModal(false);
    };

    const savePreferences = () => {
        localStorage.setItem('cookieConsent', 'custom');
        localStorage.setItem('functionalityCookies', functionalityCookies.toString());
        localStorage.setItem('statisticsCookies', statisticsCookies.toString());
        localStorage.setItem('marketingCookies', marketingCookies.toString());
        setShowCookieModal(false);
    };

    const openCookiePolicy = () => {
        setShowCookieModal(true);
        setShowPolicyView(true);
    };

    const value = { showCookieModal, showPolicyView, setShowPolicyView, functionalityCookies, setFunctionalityCookies, statisticsCookies, setStatisticsCookies, marketingCookies, setMarketingCookies, acceptAllCookies, declineAllCookies, savePreferences, openCookiePolicy };

    return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
};