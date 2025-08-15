import { renderHook, act } from '@testing-library/react';
import { CookieConsentProvider, useCookieConsent } from './CookieConsentContext';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useCookieConsent Hook', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should show modal by default when no consent is stored', () => {
        const { result } = renderHook(() => useCookieConsent(), { wrapper: CookieConsentProvider });
        expect(result.current.showCookieModal).toBe(true);
    });

    it('should not show modal if consent is already stored', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        const { result } = renderHook(() => useCookieConsent(), { wrapper: CookieConsentProvider });
        expect(result.current.showCookieModal).toBe(false);
    });

    it('should handle acceptAllCookies correctly', () => {
        const { result } = renderHook(() => useCookieConsent(), { wrapper: CookieConsentProvider });

        act(() => {
            result.current.acceptAllCookies();
        });

        expect(result.current.showCookieModal).toBe(false);
        expect(localStorage.getItem('cookieConsent')).toBe('accepted');
        expect(localStorage.getItem('functionalityCookies')).toBe('true');
        expect(localStorage.getItem('statisticsCookies')).toBe('true');
        expect(localStorage.getItem('marketingCookies')).toBe('true');
    });

    it('should handle declineAllCookies correctly', () => {
        const { result } = renderHook(() => useCookieConsent(), { wrapper: CookieConsentProvider });

        act(() => {
            result.current.declineAllCookies();
        });

        expect(result.current.showCookieModal).toBe(false);
        expect(localStorage.getItem('cookieConsent')).toBe('denied');
        expect(localStorage.getItem('functionalityCookies')).toBe('false');
        expect(localStorage.getItem('statisticsCookies')).toBe('false');
        expect(localStorage.getItem('marketingCookies')).toBe('false');
    });

    it('should handle savePreferences correctly', () => {
        const { result } = renderHook(() => useCookieConsent(), { wrapper: CookieConsentProvider });

        // Simulate user checking some boxes
        act(() => {
            result.current.setFunctionalityCookies(true);
            result.current.setMarketingCookies(false);
            result.current.setStatisticsCookies(true);
        });

        act(() => {
            result.current.savePreferences();
        });

        expect(result.current.showCookieModal).toBe(false);
        expect(localStorage.getItem('cookieConsent')).toBe('custom');
        expect(localStorage.getItem('functionalityCookies')).toBe('true');
        expect(localStorage.getItem('statisticsCookies')).toBe('true');
        expect(localStorage.getItem('marketingCookies')).toBe('false');
    });
});