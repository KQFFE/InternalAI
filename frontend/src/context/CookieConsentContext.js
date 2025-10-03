import React, { createContext, useState, useContext, useEffect } from 'react';

const CookieConsentContext = createContext(null);

const COOKIE_PREFERENCES_KEY = 'cookie_preferences'; // Define the key

export const useCookieConsent = () => useContext(CookieConsentContext);

export const CookieConsentProvider = ({ children }) => {
    const [showCookieModal, setShowCookieModal] = useState(false);
    const [showPolicyView, setShowPolicyView] = useState(false);
    const [functionalityCookies, setFunctionalityCookies] = useState(false);
    const [statisticsCookies, setStatisticsCookies] = useState(false);
    const [marketingCookies, setMarketingCookies] = useState(false);

    useEffect(() => {
        const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY); // Use the key
        if (savedPrefs) {
            try {
                const { functional, statistic, marketing } = JSON.parse(savedPrefs);
                setFunctionalityCookies(functional);
                setStatisticsCookies(statistic);
                setMarketingCookies(marketing);
                setShowCookieModal(false); // Preferences exist, so don't show the modal
            } catch (e) {
                console.error("Failed to parse cookie preferences from localStorage", e);
                setShowCookieModal(true); // Show modal if parsing fails
            }
        } else {
            setShowCookieModal(true); // No preferences found, show the modal
        }
    }, []);

    const persistPreferences = (prefs) => {
        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs)); // Use the key and stringify
        setShowCookieModal(false);

        // Inform the Cookie Information service about the user's consent
        if (window.CookieInformation) {
            window.CookieInformation.submitConsent(
                prefs.functional,
                prefs.statistic,
                prefs.marketing
            );
        }
    };

    const acceptAllCookies = () => {
        setFunctionalityCookies(true);
        setStatisticsCookies(true);
        setMarketingCookies(true);
        persistPreferences({
            functional: true,
            statistic: true,
            marketing: true,
        });
    };

    const declineAllCookies = () => {
        setFunctionalityCookies(false);
        setStatisticsCookies(false);
        setMarketingCookies(false);
        persistPreferences({
            functional: false,
            statistic: false,
            marketing: false,
        });
    };

    const savePreferences = () => {
        persistPreferences({
            functional: functionalityCookies,
            statistic: statisticsCookies,
            marketing: marketingCookies,
        });
    };

    const openCookiePolicy = () => {
        setShowCookieModal(true);
        setShowPolicyView(true);
    };

    const value = { showCookieModal, showPolicyView, setShowPolicyView, functionalityCookies, setFunctionalityCookies, statisticsCookies, setStatisticsCookies, marketingCookies, setMarketingCookies, acceptAllCookies, declineAllCookies, savePreferences, openCookiePolicy };

    return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
};