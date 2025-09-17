import { renderHook, act } from '@testing-library/react';
import { CookieConsentProvider, useCookieConsent } from './CookieConsentContext';

const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

describe('useCookieConsent Hook', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    const wrapper = ({ children }) => <CookieConsentProvider>{children}</CookieConsentProvider>;

    test('should show the modal by default when no preferences are saved', () => {
        const { result } = renderHook(() => useCookieConsent(), { wrapper });
        expect(result.current.showCookieModal).toBe(true);
    });

    test('should not show the modal if preferences are already saved', () => {
        // Pre-populate localStorage
        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify({ functional: true, statistic: false, marketing: false }));

        const { result } = renderHook(() => useCookieConsent(), { wrapper });

        // The hook should read from localStorage and hide the modal
        expect(result.current.showCookieModal).toBe(false);
        // And correctly set the initial state
        expect(result.current.functionalityCookies).toBe(true);
        expect(result.current.statisticsCookies).toBe(false);
    });

    test('should handle acceptAllCookies correctly', () => {
        const { result } = renderHook(() => useCookieConsent(), { wrapper });

        act(() => {
            result.current.acceptAllCookies();
        });

        expect(result.current.showCookieModal).toBe(false);
        const savedPrefs = JSON.parse(localStorage.getItem(COOKIE_PREFERENCES_KEY));
        expect(savedPrefs).toEqual({
            functional: true,
            statistic: true,
            marketing: true,
        });
    });

    test('should handle declineAllCookies correctly', () => {
        const { result } = renderHook(() => useCookieConsent(), { wrapper });

        act(() => {
            result.current.declineAllCookies();
        });

        expect(result.current.showCookieModal).toBe(false);
        const savedPrefs = JSON.parse(localStorage.getItem(COOKIE_PREFERENCES_KEY));
        expect(savedPrefs).toEqual({
            functional: false,
            statistic: false,
            marketing: false,
        });
    });

    test('should handle savePreferences correctly', () => {
        const { result } = renderHook(() => useCookieConsent(), { wrapper });

        // Simulate user toggling some preferences
        act(() => {
            result.current.setFunctionalityCookies(true);
            result.current.setStatisticsCookies(false);
            result.current.setMarketingCookies(true);
        });

        // Save the custom preferences
        act(() => {
            result.current.savePreferences();
        });

        expect(result.current.showCookieModal).toBe(false);
        const savedPrefs = JSON.parse(localStorage.getItem(COOKIE_PREFERENCES_KEY));
        expect(savedPrefs).toEqual({
            functional: true,
            statistic: false,
            marketing: true,
        });
    });
});