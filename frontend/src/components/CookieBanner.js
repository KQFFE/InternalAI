import { useState, useEffect, useRef } from 'react';
import '../cookie-banner.css';

// --- Start of data from user prompt ---
const cookieDefinitions = {
    'cloudflare-functional': { service: 'Cloudflare', purpose: 'Stödjer webbplatsens tekniska funktioner.', privacyPolicy: 'https://www.cloudflare.com/privacypolicy/', name: '__cf_bm' },
    'optimizely-functional': { service: 'Optimizely', purpose: 'Samlar in information om användarna och deras verksamhet på webbplatsen. Informationen används för att spåra och analysera användarbeteendet och att leverera målinriktad annonsering.', privacyPolicy: 'https://www.optimizely.com/privacy', name: 'EPiStateMarker' },
    'cloudflare-functional-clearance': { service: 'Cloudflare', purpose: 'Krävs för att webbplatsen ska fungera.', privacyPolicy: 'https://www.cloudflare.com/privacypolicy/', name: 'cf_clearance' },
    'azure-statistic': { service: 'Microsoft Azure', purpose: 'Samlar in information om användarna, som används för marknadsanalys och rapporteringsändamål.', privacyPolicy: 'https://www.microsoft.com/en-us/privacy/privacystatement' },
    'contentsquare-statistic': { service: 'ContentSquare', purpose: 'Samlar in information om användarna och deras verksamhet på webbplatsen. Informationen används för att spåra och analysera användarbeteendet och för att möta de enskilda användarnas behov.', privacyPolicy: 'https://contentsquare.com/privacy-center/privacy-policy/' },
    'google-analytics-statistic': { service: 'Google Analytics', purpose: 'Samlar in information om användarna och deras verksamhet på webbplatsen för analys och rapportering.', privacyPolicy: 'https://policies.google.com/technologies/partner-sites?hl=en' },
    'piwik-pro-statistic': { service: 'Piwik PRO', purpose: 'Samlar anonym information om användarna och deras aktivitet på webbplatsen för analys- och rapporteringsändamål.', privacyPolicy: 'https://piwik.pro/privacy-policy' },
    'vimeo-statistic': { service: 'Vimeo', purpose: 'Samlar in information om användarna och deras verksamhet på webbplatsen genom inbyggda videospelare för analys och rapporteringsändamål.', privacyPolicy: 'https://vimeo.com/privacy', name: 'vuid' },
    'contentsquare-statistic-root': { service: 'ContentSquare', purpose: 'Samlar information om användarna och deras verksamhet på webbplatsen. Används för att leverera personlig kundservice och innehåll.', privacyPolicy: 'https://contentsquare.com/privacy-center/privacy-policy/', name: '_cs_root-domain' },
    'contentsquare-statistic-same-site': { service: 'ContentSquare', purpose: 'Stöder funktionerna i ett "Content Management System" med inbyggd analys av användarbeteende.', privacyPolicy: 'https://contentsquare.com/privacy-center/privacy-policy/', name: '_cs_same_site' },
    'hubspot-marketing': { service: 'HubSpot', purpose: 'Samlar in information om användarna och deras verksamhet på webbplatsen. Informationen används för att spåra och analysera användarbeteendet och att leverera målinriktad annonsering.', privacyPolicy: 'https://legal.hubspot.com/privacy-policy' },
    'google-marketing': { service: 'Google', purpose: 'Stödjer integrationen av en tredjepartsplattform på webbplatsen för att leverera riktade annonser.', privacyPolicy: 'https://policies.google.com/technologies/partner-sites?hl=en' },
    'linkedin-marketing': { service: 'LinkedIn', purpose: 'Stödjer marknadsföring online genom att samla in information om användarna för att marknadsföra produkter via partners och andra plattformar.', privacyPolicy: 'https://www.linkedin.com/legal/privacy-policy' },
    'facebook-marketing': { service: 'Facebook', purpose: 'Identifierar webbläsare för att tillhandahålla reklam och webbplatsanalystjänster.', privacyPolicy: 'https://www.facebook.com/privacy/explanation', name: '_fbp' },
    'youtube-marketing': { service: 'Youtube, Google', purpose: 'Samlar in information om användarna och deras verksamhet på webbplatsen genom inbyggda videospelare med syfte att leverera riktade annonser.', privacyPolicy: 'https://policies.google.com/technologies/partner-sites?hl=en' },
    'youtube-marketing-metadata': { service: 'Youtube, Google', purpose: 'Samlar in information om användarna och deras verksamhet på webbplatsen. Informationen används för att spåra och analysera användarbeteendet, för att möta de enskilda användarnas behov och att leverera målinriktad annonsering.', privacyPolicy: 'https://policies.google.com/technologies/partner-sites?hl=en', name: 'VISITOR_PRIVACY_METADATA' },
    'youtube-marketing-rollout': { service: 'Youtube, Google', purpose: 'Stödjer integrationen av en tredjepartsplattform på webbplatsen.', privacyPolicy: 'https://policies.google.com/technologies/partner-sites?hl=en', name: '__Secure-ROLLOUT_TOKEN' },
    'youtube-marketing-visitor': { service: 'Youtube, Google', purpose: 'Samlar in information om användarna och deras verksamhet på webbplatsen genom inbyggda videospelare med syfte att leverera riktade annonser.', privacyPolicy: 'https://policies.google.com/technologies/partner-sites?hl=en', name: 'VISITOR_INFO1_LIVE' },
    'podbean-marketing': { service: 'Podbean', purpose: 'Samlar in information om användarna och deras verksamhet på webbplatsen genom webbinnehåll med syfte att leverera riktade annonser.', privacyPolicy: 'https://www.podbean.com/privacy', name: 'PBSECURESUSID' },
    'google-unclassified': { service: '', purpose: '', privacyPolicy: '', name: 'GCL_AW_P' },
};

const expandCookies = (cookies) => {
    return cookies.flatMap(cookie => {
        if (cookie.providers) {
            const { providers, ...rest } = cookie;
            return providers.map(provider => ({
                ...rest,
                provider,
            }));
        }
        return cookie;
    });
};

const necessaryCookiesCompact = [
    { service: 'Cookie Information', purpose: 'Stödjer webbplatsens tekniska funktioner.', privacyPolicy: 'https://cookieinformation.com/cookie-and-privacy-policy/', expiry: 'ett år', name: 'CookieInformationConfig', provider: 'policy.app.cookieinformation.com' },
    { service: 'Microsoft Azure', purpose: 'Krävs för att webbplatsen ska fungera.', privacyPolicy: 'https://www.microsoft.com/en-us/privacy/privacystatement', expiry: 'Session', name: 'ARRAffinity', provider: '.www.knowit.se' },
    { service: 'Microsoft Azure', purpose: 'Krävs för att webbplatsen ska fungera.', privacyPolicy: 'https://www.microsoft.com/en-us/privacy/privacystatement', expiry: 'Session', name: 'ARRAffinitySameSite', provider: '.www.knowit.se' },
    { cookieKey: 'cloudflare-functional', expiry: 'Session', providers: ['.hsforms.com', '.info.knowit.se', '.hubspot.com', '.vimeo.com', '.blogg.knowit.se'] },
    { service: 'Cookie Information', purpose: 'Used to share consent across domains.', privacyPolicy: 'https://cookieinformation.com/cookie-and-privacy-policy/', expiry: 'ett år', name: 'CookieInformationConsent_xxx', provider: 'policy.app.cookieinformation.com' },
    { service: 'Cookie Information', purpose: 'Stödjer webbplatsens tekniska funktioner.', privacyPolicy: 'https://cookieinformation.com/cookie-and-privacy-policy/', expiry: 'ett år', name: 'CookieInformationConsent', providers: ['www.knowit.se', 'blogg.knowit.se'] },
    { cookieKey: 'piwik-pro-statistic', expiry: '30 minuter', name: '_pk_sesxxx', provider: '.knowit.se' },
    { cookieKey: 'piwik-pro-statistic', expiry: '30 minuter', name: '_pk_idxxx', provider: '.knowit.se' },
    { service: 'Microsoft, ASP.NET', purpose: 'Samlar in information om webbplatsen och dess innehåll för rapportering och säkerhetsändamål.', privacyPolicy: 'https://www.microsoft.com/en-us/privacy/privacystatement', expiry: 'Session', name: '.AspNetCore.Antiforgeryxxx', provider: 'www.knowit.se' },
];

const functionalCookiesCompact = [
    { cookieKey: 'cloudflare-functional', expiry: '29 minuter', providers: ['.info.knowit.se', '.hsforms.com', '.hs-analytics.net', '.hsappstatic.net', '.hs-scripts.com', '.hubspot.com', '.hs-banner.com'] },
    { cookieKey: 'cloudflare-functional', expiry: '4 minuter', provider: '.vimeo.com' },
    { cookieKey: 'optimizely-functional', expiry: 'Session', provider: 'www.knowit.se' },
    { cookieKey: 'cloudflare-functional', expiry: '24 minuter', provider: '.hsforms.net' },
    { cookieKey: 'cloudflare-functional', expiry: '26 minuter', provider: '.hubspot.net' },
    { cookieKey: 'cloudflare-functional', expiry: 'några sekunder', providers: ['.twitter.com', '.hsstatic.net', '.hubspotvideo.com'] },
    { cookieKey: 'cloudflare-functional', expiry: '17 minuter', providers: ['.hubspotusercontent-eu1.net', '.blogg.knowit.se', '.hubspotusercontent-na1.net'] },
    { cookieKey: 'cloudflare-functional-clearance', expiry: 'ett år', provider: '.podbean.com' },
];

const statisticCookiesCompact = [
    { cookieKey: 'azure-statistic', expiry: 'ett år', name: 'ai_user', provider: 'www.knowit.se' },
    { cookieKey: 'azure-statistic', expiry: '30 minuter', name: 'ai_session', provider: 'www.knowit.se' },
    { cookieKey: 'contentsquare-statistic', expiry: 'ett år', name: '_cs_id', providers: ['.knowit.se', '.blogg.knowit.se'] },
    { cookieKey: 'contentsquare-statistic', expiry: 'ett år', name: '_cs_c', provider: '.knowit.se' },
    { cookieKey: 'google-analytics-statistic', expiry: 'ett år', name: '_ga', provider: '.knowit.se' },
    { cookieKey: 'piwik-pro-statistic', expiry: '30 minuter', name: '_pk_sesxxx', provider: '.knowit.se' },
    { cookieKey: 'google-analytics-statistic', expiry: 'ett år', name: '_ga_xxx', providers: ['.knowit.se', 'blogg.knowit.se', '.blogg.knowit.se'] },
    { cookieKey: 'piwik-pro-statistic', expiry: 'ett år', name: '_pk_idxxx', provider: '.knowit.se' },
    { cookieKey: 'contentsquare-statistic', expiry: '30 minuter', name: '_cs_s', provider: '.knowit.se' },
    { cookieKey: 'vimeo-statistic', expiry: 'ett år', provider: '.vimeo.com' },
    { cookieKey: 'contentsquare-statistic', expiry: 'några sekunder', name: '_cs_s', provider: '.blogg.knowit.se' },
    { cookieKey: 'contentsquare-statistic-root', expiry: 'Session', provider: '.knowit.se' },
    { cookieKey: 'contentsquare-statistic-same-site', expiry: 'Session', provider: 'blogg.knowit.se' },
];

const marketingCookiesCompact = [
    { cookieKey: 'hubspot-marketing', expiry: '6 månader', name: '__hstc', provider: '.knowit.se' },
    { cookieKey: 'hubspot-marketing', expiry: '6 månader', name: 'hubspotutk', provider: '.knowit.se' },
    { cookieKey: 'google-marketing', expiry: '3 månader', name: '_gcl_au', provider: '.knowit.se' },
    { cookieKey: 'linkedin-marketing', expiry: '6 månader', name: 'li_gc', provider: '.linkedin.com' },
    { cookieKey: 'facebook-marketing', expiry: '3 månader', provider: '.knowit.se' },
    { cookieKey: 'hubspot-marketing', expiry: 'Session', name: '__hssrc', provider: '.knowit.se' },
    { cookieKey: 'hubspot-marketing', expiry: '30 minuter', name: '__hssc', provider: '.knowit.se' },
    { cookieKey: 'linkedin-marketing', expiry: 'ett år', name: 'bcookie', provider: '.linkedin.com' },
    { cookieKey: 'linkedin-marketing', expiry: 'en dag', name: 'lidc', provider: '.linkedin.com' },
    { cookieKey: 'youtube-marketing', expiry: 'Session', name: 'YSC', provider: '.youtube.com' },
    { cookieKey: 'youtube-marketing-metadata', expiry: '6 månader', provider: '.youtube.com' },
    { cookieKey: 'youtube-marketing-rollout', expiry: '6 månader', provider: '.youtube.com' },
    { cookieKey: 'youtube-marketing-visitor', expiry: '6 månader', provider: '.youtube.com' },
    { cookieKey: 'podbean-marketing', expiry: 'Session', provider: '.podbean.com' },
    { cookieKey: 'google-marketing', expiry: '3 månader', name: '_gcl_aw', provider: '.knowit.se' },
];

const unclassifiedCookiesCompact = [
    { cookieKey: 'google-unclassified', expiry: '3 månader', provider: '.googleadservices.com' },
];

const staticCookieCategories = [
    {
        name: 'necessary',
        label: 'Nödvändiga',
        description: 'Nödvändiga cookies hjälper dig att göra en hemsida användbar, genom att aktivera grundläggande funktioner såsom sidnavigering åtkomst till säkra områden på hemsidan. Hemsidan kan inte fungera optimalt utan dessa cookies.',
        isMutable: false,
        cookies: expandCookies(necessaryCookiesCompact)
    },
    {
        name: 'functional',
        label: 'Funktionella',
        description: 'Funktionella cookies gör det möjligt att spara uppgifter som ändrar hemsidans utseende eller funktioner. T.ex ditt föredragna språk eller de region som du befinner dig i.',
        isMutable: true,
        cookies: expandCookies(functionalCookiesCompact)
    },
    {
        name: 'statistic',
        label: 'Statistiska',
        description: 'Statistiska cookies hjälper hemsidans ägare att förstå hur besökare interagerar med hemsidan, genom att samla in och rapportera uppgifter.',
        isMutable: true,
        cookies: expandCookies(statisticCookiesCompact)
    },
    {
        name: 'marketing',
        label: 'Marketing',
        description: 'Marketing cookies används för att spåra besökare gränsöverskridande på hemsidor. Avsikten är att visa annonser som är relevanta och engagerande för den enskilda användaren och därmed vara mer värdefulla för utgivare och tredjepartsannonsörer.',
        isMutable: true,
        cookies: expandCookies(marketingCookiesCompact)
    },
    {
        name: 'unclassified',
        label: 'Oklassificerade',
        description: 'Oklassificerade cookies håller vi på att klassificera tillsammans med leverantörerna av leverantörerna av dessa cookies.',
        isMutable: false,
        cookies: expandCookies(unclassifiedCookiesCompact)
    },
];
// --- End of data from user prompt ---

const CookieDetails = ({ cookies }) => {
    if (!cookies || cookies.length === 0) {
        return null;
    }
    return (
        <div role="table" aria-label="Cookie-information" className="coi-consent-banner__found-cookies">
            {cookies.map((cookie, index) => {
                const cookieInfo = cookie.cookieKey ? cookieDefinitions[cookie.cookieKey] : cookie;
                const service = cookieInfo.service;
                const purpose = cookieInfo.purpose;
                const privacyPolicy = cookieInfo.privacyPolicy;
                const expiry = cookie.expiry || cookieInfo.expiry;
                const name = cookie.name || cookieInfo.name;
                const provider = cookie.provider || cookieInfo.provider;

                return (
                    <div role="rowgroup" className="coi-consent-banner__cookie-details" key={index}>
                        <div role="row" className="cookie-details__detail-container cookie-details__detail-container-data-processor-name">
                            <span role="cell" className="cookie-details__detail-title">Tjänst:</span>
                            <span role="cell" className="cookie-details__detail-content">{service}</span>
                        </div>
                        <div role="row" className="cookie-details__detail-container cookie-details__detail-container-purpose">
                            <span role="cell" className="cookie-details__detail-title">Syfte:</span>
                            <span role="cell" className="cookie-details__detail-content">{purpose}</span>
                        </div>
                        <div role="row" className="cookie-details__detail-container cookie-details__detail-container-data-processor-privacy-policy">
                            <span role="cell" className="cookie-details__detail-title">Integritetspolicy:</span>
                            <span role="cell" className="cookie-details__detail-content"><a title="Integritetspolicy" rel="noopener noreferrer" tabIndex="0" target="_blank" href={privacyPolicy}>{service} - Integritetspolicy</a></span>
                        </div>
                        <div role="row" className="cookie-details__detail-container cookie-details__detail-container-expiry">
                            <span role="cell" className="cookie-details__detail-title">Utgångstid:</span>
                            <span role="cell" className="cookie-details__detail-content">{expiry}</span>
                        </div>
                        <div role="row" className="cookie-details__detail-container cookie-details__detail-container-name">
                            <span role="cell" className="cookie-details__detail-title">Namn:</span>
                            <span role="cell" className="cookie-details__detail-content">{name}</span>
                        </div>
                        <div role="row" className="cookie-details__detail-container cookie-details__detail-container-provider">
                            <span role="cell" className="cookie-details__detail-title">Leverantör:</span>
                            <span role="cell" className="cookie-details__detail-content">{provider}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


const CookieCategory = ({ name, label, description, isOpen, onToggle, cookies }) => {
    const headingId = `coi-category-heading-${name}`;
    return (
        <div className="coi-consent-banner__category-container">
            <div className="coi-consent-banner__category-controls">
                <button
                    tabIndex="0"
                    aria-controls={`description-container-cookie_cat_${name}`}
                    aria-expanded={isOpen}
                    onClick={onToggle}
                    className="coi-consent-banner__category-name"
                    id={headingId}
                >
                    <div aria-hidden="true" className={`ci-arrow ${isOpen ? 'open' : ''}`}></div>
                    <h3 aria-label={label}>{label}</h3>
                </button>
                <div className="coi-consent-banner__category-description">{description}</div>
            </div>
            <div
                data-testid={`description-container-${name}`}
                className="coi-consent-banner__description-container"
                id={`description-container-cookie_cat_${name}`}
                aria-hidden={!isOpen}
                style={{ display: isOpen ? 'block' : 'none' }}
                aria-labelledby={headingId}
            >
                <CookieDetails cookies={cookies} />
            </div>
        </div>
    );
};

function CookieBanner({
    show,
    onAcceptAll: onAcceptAllProp,
    onDeclineAll: onDeclineAllProp,
    onSavePreferences: onSavePreferencesProp,
    functionalityCookies,
    setFunctionalityCookies,
    statisticsCookies,
    setStatisticsCookies,
    marketingCookies,
    setMarketingCookies,
    showPolicy,
    setShowPolicy,
}) {
    const [showDetails, setShowDetails] = useState(false);
    const [preferencesChanged, setPreferencesChanged] = useState(false);
    const [cookieCategories, setCookieCategories] = useState(staticCookieCategories);
    const [openCategory, setOpenCategory] = useState(null);
    const bannerRef = useRef(null);
    const policyHeadlineRef = useRef(null); // Ref for the policy headline

    useEffect(() => {
        const fetchCookieData = async () => {
            if (window.CookieInformation && typeof window.CookieInformation.getConsent === 'function' && typeof window.CookieInformation.getCookieCategories === 'function') {
                try {
                    const consent = window.CookieInformation.getConsent();
                    const categoriesFromApi = await window.CookieInformation.getCookieCategories();

                    if (consent && categoriesFromApi && Array.isArray(categoriesFromApi)) {
                        const updatedCategories = categoriesFromApi.map(apiCategory => {
                            const cookiesForCategory = consent.cookies.filter(cookie => cookie.type.toLowerCase() === apiCategory.name.toLowerCase());
                            return {
                                name: apiCategory.name,
                                label: apiCategory.label,
                                description: apiCategory.description,
                                isMutable: apiCategory.isMutable !== false,
                                cookies: cookiesForCategory,
                            };
                        });
                        setCookieCategories(updatedCategories);
                    }
                } catch (error) {
                    console.error("Failed to fetch dynamic cookie information, using static data as fallback:", error);
                }
            }
        };

        fetchCookieData();
    }, []);

    useEffect(() => {
        if (!show) {
            return; // Do nothing if the banner is not shown
        }

        // --- Setup logic when banner is shown ---
        document.body.classList.add('modal-open');
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.setAttribute('aria-hidden', 'true');
        }

        // Focus management when the banner appears or its view changes
        if (showPolicy) {
            // When policy view is active, focus its headline
            policyHeadlineRef.current?.focus();
        } else {
            // When main consent view is active, focus the first action button
            const firstButton = bannerRef.current?.querySelector(
                '.coi-button-group button:not([disabled])'
            );
            firstButton?.focus();
        }

        // Trap focus within the modal for keyboard users.
        const handleFocusTrap = (event) => {
            if (event.key === 'Tab' && bannerRef.current) {
                const focusableElements = bannerRef.current.querySelectorAll(
                    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        };
        document.addEventListener('keydown', handleFocusTrap);

        // --- Cleanup logic ---
        return () => {
            document.body.classList.remove('modal-open');
            if (mainContent) {
                mainContent.removeAttribute('aria-hidden');
            }
            document.removeEventListener('keydown', handleFocusTrap);

            // Return focus to a logical element on the page after the banner closes.
            const mainHeading = document.getElementById('main-heading');
            mainHeading?.focus();
        };
    }, [show, showPolicy]);

    if (!show) return null;

    // In a test environment (like Playwright), window.playwright will be true.
    // This allows the test to directly trigger the exposed functions without prop drilling.
    // We check for a specific callbacks object installed by the test's init script.
    const isTestEnv = !!window.playwrightCallbacks;
    const onAcceptAll = isTestEnv ? window.playwrightCallbacks.onAcceptAll : onAcceptAllProp;
    const onDeclineAll = isTestEnv ? window.playwrightCallbacks.onDeclineAll : onDeclineAllProp;
    const onSavePreferences = isTestEnv ? window.playwrightCallbacks.onSavePreferences : onSavePreferencesProp;

    const categoryStates = {
        necessary: { value: true, setter: () => {} }, // Always true and not changeable
        functional: { value: functionalityCookies, setter: setFunctionalityCookies },
        statistic: { value: statisticsCookies, setter: setStatisticsCookies },
        marketing: { value: marketingCookies, setter: setMarketingCookies },
    };

    const handlePreferenceChange = (setter, value) => {
        setter(!value);
        setPreferencesChanged(true);
    };

    const toggleCategory = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    }

    const handleHideDetails = () => {
        setShowDetails(false);
        setOpenCategory(null);
    };

    // Show the "Save" button if preferences have been changed and at least one optional category is selected.
    const showSaveButton = preferencesChanged && (functionalityCookies || statisticsCookies || marketingCookies);

    return (
        <div id="coiOverlay" role="banner" aria-hidden="false" className="coi-overlay" data-testid="cookie-banner-container">
            <div ref={bannerRef} role="dialog" tabIndex="-1" aria-modal="true" id="coi-banner-wrapper" className="coi-banner__wrapper"
                aria-describedby="coiBannerHeadline" aria-labelledby="coi-banner-wrapper_label" lang="sv" dir="ltr" aria-hidden="false">
                {!showPolicy ? (
                    <div id="coiPage-1" className="coi-banner__page">
                        <div className="coi-banner__summary">
                            <div className="coi-banner__header">
                                <img src="/knowit-logo.png" alt="logo" className="coi-banner__logo" />
                                <span className="coi-banner__branding">
                                    powered by: <a className="coi-external-link" href="https://cookieinformation.com/" target="_blank" rel="noopener noreferrer">Cookie Information</a>
                                </span>
                            </div>
                            <div className="coi-banner__text">
                                <h2 className="coi-banner__headline" id="coiBannerHeadline">Vi använder cookies</h2>
                                <div className="coi-banner__maintext" id="coi-banner-wrapper_label">
                                    <p>
                                        Knowit.se använder cookies för att analysera trafiken på vår webbplats. Informationen delas även med tredjepart för att vi ska kunna erbjuda dig ett anpassat innehåll. Önskar du inte detta kan du välja att klicka i ”Neka alla”.
                                    </p>
                                    <p>
                                        Genom att klicka ”Godkänn alla” ger du ditt samtycke till samtliga syften.
                                    </p>
                                    <p>
                                        Du kan när som helst ta tillbaka ditt samtycke genom att klicka på ikonen i det nedre vänstra hörnet på sidan.
                                    </p>
                                    <button type="button" className="coi-banner__policy" onClick={() => setShowPolicy(true)}>
                                        Läs mer om cookies
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="coi-banner__page-footer" role="navigation" aria-label="menu">
                            <div className="coi-button-group">
                                {showSaveButton ? (
                                    <button data-testid="save-cookie-preferences" tabIndex="0" aria-label="Spara inställningar" id="savePreferencesButton" className="coi-banner__decline" onClick={() => onSavePreferences()}>Spara inställningar</button>
                                ) : (
                                    <button data-testid="decline-all-cookies" tabIndex="0" aria-label="Neka alla" id="declineButton" className="coi-banner__decline" onClick={() => onDeclineAll()}>Neka alla</button>
                                )}
                                <button data-testid="accept-all-cookies" tabIndex="0" aria-label="Godkänn alla" className="coi-banner__accept" onClick={() => onAcceptAll()}>Godkänn alla</button>
                            </div>
                        </div>
                        
                        <div className="coi-toggle-group">
                            {!showDetails ? (
                                <button tabIndex="0" id="show_details" aria-label="Visa detaljer" onClick={() => setShowDetails(true)}>Visa detaljer</button>
                            ) : (
                                <button tabIndex="0" id="hide_details" aria-label="Dölj detaljer" onClick={handleHideDetails}>Dölj detaljer</button>
                            )}
                        </div>

                        {showDetails && (
                            <div className="coi-consent-banner__categories-wrapper" aria-label="Policy för kakor" id="coiConsentBannerCategoriesWrapper" aria-hidden="false" tabIndex="-1">
                                {cookieCategories.map(cat => (
                                    <CookieCategory
                                        key={cat.name}
                                        name={cat.name}
                                        label={cat.label}
                                        description={cat.description}
                                        isOpen={openCategory === cat.name}
                                        onToggle={() => toggleCategory(cat.name)}
                                        cookies={cat.cookies}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="coi-banner-consent-group">
                            {cookieCategories.filter(c => c.name !== 'unclassified').map(cat => {
                                const categoryState = categoryStates[cat.name];
                                if (!categoryState) return null;

                                return (
                                    <div className="coi-banner-consent-field" key={cat.name}>
                                        <div className="coi-consent-banner__switch-container" id={`switch-cookie_cat_${cat.name}`}>
                                            <label htmlFor={`cookie_cat_${cat.name}`} className="coi-checkboxes" title={cat.description}>
                                                <span className="coi-checkboxes-text">{cat.label}</span>
                                                <div className="coi-checkboxes-switch">
                                                    <input
                                                        className="coi__checkbox"
                                                        tabIndex={cat.isMutable ? 0 : -1}
                                                        name={`cookie_cat_${cat.name}`}
                                                        id={`cookie_cat_${cat.name}`}
                                                        type="checkbox"
                                                        disabled={!cat.isMutable}
                                                        checked={categoryState.value}
                                                        onChange={() => handlePreferenceChange(categoryState.setter, categoryState.value)}
                                                    />
                                                    <span className="checkbox-toggle"></span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div id="coiPage-3" className="coi-banner__page">
                        <div className="coi-banner__cookiedeclaration">
                            <div className="coi-banner__header">
                                <img src="https://www.knowit.se/globalassets/logotype-svart.png" alt="logo" style={{width: '140px'}} />
                                <span className="coi-banner__branding">powered by: <a className="coi-external-link" href="https://cookieinformation.com/" target="_blank" rel="noopener noreferrer">Cookie Information</a></span>
                            </div>
                            <div className="coi-banner__text">
                                <h2 ref={policyHeadlineRef} tabIndex="-1" className="coi-banner__headline" id="coiPolicyHeadline">Policy för kakor</h2>
                                <div className="coi-banner__maintext">
                                    <strong className="top-column__bold-text">Ditt samtycke gäller för följande domäner:</strong>
                                    <span className="top-column__website-domains">info.knowit.se, knowit.se, blogg.knowit.se</span>
                                    <strong className="top-column__bold-text">Policyn för kakor senast uppdaterad 12.09.2025</strong>
                                </div>
                            </div>
                        </div>
                        <div className="coi-banner__page-footer" role="navigation" aria-label="third-menu">
                            <div className="coi-button-group">
                                <button tabIndex="0" onClick={() => setShowPolicy(false)} aria-label="Inställningar" className="coi-banner__lastpage activeTab">Inställningar</button>
                                <button tabIndex="0" onClick={onAcceptAll} aria-label="Godkänn alla button" className="coi-banner__accept">Godkänn alla</button>
                            </div>
                        </div>
                        <div className="cookiedeclaration_wrapper">
                            <div className="bottom-column__why-cookies">
                                <h2>Var är en kaka (cookie)?</h2>
                                <p>En kaka eller cookie är en liten datafil som lagras i din dator, surfplatta eller smartmobil. En kaka är inte ett program som kan innehålla skadlig programvara eller virus.</p>
                                <h2>Hur webbplatsen använder kakor</h2>
                                <p>Vissa kakor utför nödvändiga funktioner på webbplatsen. Kakor hjälper oss också förstå varför du besöker webbplatsen, så vi kontinuerligt kan optimera och målinrikta webbplatsen efter dina specifika behov och intressen. Kakor kommer t.ex. ihåg varor som lagts i en varukorg, om du har besökt webbplatsen tidigare, om du är inloggad och det språk och den valuta du föredrar att se på webbplatsen. Vi använder också kakor för att specifikt inrikta våra annonser mot dig på andra webbplatser. Oftast använder vi kakor som en del av vår tjänst för att visa dig innehåll som är så relevant för dig som möjligt.</p>
                                <p>Du kan se de specifika tjänster som lagrar kakor och varför de gör det under de olika kategorierna:</p>
                                <ol className="coi-purpose-list">
                                    <li>Funktionella</li>
                                    <li>Statistiska</li>
                                    <li>Marketing</li>
                                </ol>
                                <h2>Hur länge lagras kakor?</h2>
                                <p>Tiden som en kaka lagras i dina enheter och webbläsare varierar. En kakas livslängd beräknas utifrån ditt senaste besök på webbplatsen. När en kakas livslängd löper ut raderas den automatiskt. Alla våra kakors livslängd uppges i vår policy för kakor.</p>
                                <h2>Hur du nekar eller tar bort kakor</h2>
                                <p>Du kan när som helst neka alla kakor och/eller tredjepartskakor helt och hållet genom att ändra inställningarna i din webbläsare i din dator, surfplatta eller smartmobil. Var inställningarna finns beror på vilken webbläsare du använder. Du bör dock vara medveten om att om du nekar alla kakor och/eller tredjepartskakor kommer det finnas funktioner och tjänster som du inte kommer kunna använda på webbplatsen (eftersom de är beroende av kakor).<br />
                                    <a rel="noopener noreferrer" href="https://tools.google.com/dlpage/gaoptout" target="_blank">Du kan välja bort kakor från Google Analytics här</a>.
                                </p>
                                <h2>Hur gör jag för att ta bort kakor?</h2>
                                <p>Det är lätt att radera kakor som du tidigare godkänt. Tillvägagångssättet beror på vilken webbläsare (Chrome, Firefox, Safari, etc.) och vilken enhet du använder (smartmobil, surfplatta, PC, Mac). <br /> Ofta finns verktyg för borttagning under inställningar – Sekretess och säkerhet – men det kan variera mellan olika webbläsare. Ange vilken enhet/webbläsare du använder (klicka på den länk som stämmer):</p>
                                <ul>
                                    <li><a rel="noopener noreferrer" href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies#ie=ie-11" target="_blank">Internet Explorer</a></li>
                                    <li><a rel="noopener noreferrer" href="https://support.microsoft.com/en-us/help/4027947/microsoft-edge-delete-cookies" target="_blank">Microsoft Edge</a></li>
                                    <li><a rel="noopener noreferrer" href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" target="_blank">Mozilla Firefox</a></li>
                                    <li><a rel="noopener noreferrer" href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank">Google Chrome</a></li>
                                    <li><a rel="noopener noreferrer" href="https://help.opera.com/en/latest/web-preferences/#cookies" target="_blank">Opera</a></li>
                                    <li><a rel="noopener noreferrer" href="https://support.apple.com/en-us/HT201265" target="_blank">Safari</a></li>
                                    <li><a rel="noopener noreferrer" href="https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html" target="_blank">Flash cookies</a></li>
                                    <li><a rel="noopener noreferrer" href="https://support.apple.com/en-us/HT1677" target="_blank">Apple</a></li>
                                    <li><a rel="noopener noreferrer" href="https://timeread.hubpages.com/hub/How-to-delete-internet-cookies-on-your-Droid-or-any-Android-device" target="_blank">Android</a></li>
                                    <li><a rel="noopener noreferrer" href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DAndroid&hl=en" target="_blank">Chrome, Android</a></li>
                                </ul>
                                <p></p>
                                <h2>Ändra ditt samtycke</h2>
                                <p>Du kan ändra ditt samtycke genom att antingen radera kakor från din webbläsare eller ändra ditt ursprungliga val genom att klicka på länken nedanför:</p>
                                <button
                                    className="coi-banner__policy coi-renew-link"
                                    onClick={() => {
                                        if (window.CookieConsent) {
                                            window.CookieConsent.renew();
                                        }
                                    }}
                                >
                                    Klicka här för att ändra ditt samtycke
                                </button>
                                <p>OBS: Om du använder mer än en webbläsare måste du radera kakorna i alla.</p>
                                <h2>Har du några frågor?</h2>
                                <p>Ta gärna kontakt med oss om du har några kommentarer eller frågor gällande vår information och/ou behandling av personuppgifter. Vår policy för kakor uppdateras en gång i månaden av <a href="https://cookieinformation.com/" target="_blank" rel="noopener noreferrer">Cookie Information</a>. Om du har några frågor om vår policy för kakor är du välkommen att <a href="https://cookieinformation.com/" target="_blank" rel="noopener noreferrer">kontakta Cookie Information på deras webbplats</a></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


export default CookieBanner;
