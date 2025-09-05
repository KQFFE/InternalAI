import { useState, useEffect, useRef } from 'react';
import '../cookie-banner.css';


const CookieCategory = ({ name, label, description, isOpen, onToggle, children }) => {
    return (
        <div className="coi-consent-banner__category-container">
            <div className="coi-consent-banner__category-controls">
                <button
                    tabIndex="0"
                    aria-controls={`description-container-cookie_cat_${name}`}
                    aria-expanded={isOpen}
                    onClick={onToggle}
                    className="coi-consent-banner__category-name"
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
            >
                {children}
            </div>
        </div>
    );
};

function CookieBanner({
    show,
    onAcceptAll,
    onDeclineAll,
    onSavePreferences,
    functionalityCookies,
    setFunctionalityCookies,
    statisticsCookies,
    setStatisticsCookies,
    marketingCookies,
    setMarketingCookies,
}) {
    const [showDetails, setShowDetails] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const [preferencesChanged, setPreferencesChanged] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);
    const bannerRef = useRef(null);
    const policyHeadlineRef = useRef(null); // Ref for the policy headline

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

    const handlePreferenceChange = (setter, value) => {
        setter(!value);
        setPreferencesChanged(true);
    };

    const toggleCategory = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    }

    // Show the "Save" button if preferences have been changed and at least one optional category is selected.
    const showSaveButton = preferencesChanged && (functionalityCookies || statisticsCookies || marketingCookies);

    return (
        <div id="coiOverlay" role="banner" aria-hidden="false" className="coi-overlay">
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
                                    <button data-testid="save-cookie-preferences" tabIndex="0" aria-label="Spara inställningar" id="savePreferencesButton" className="coi-banner__decline" onClick={onSavePreferences}>Spara inställningar</button>
                                ) : (
                                    <button data-testid="decline-all-cookies" tabIndex="0" aria-label="Neka alla" id="declineButton" className="coi-banner__decline" onClick={onDeclineAll}>Neka alla</button>
                                )}
                                <button data-testid="accept-all-cookies" tabIndex="0" aria-label="Godkänn alla" className="coi-banner__accept" onClick={onAcceptAll}>Godkänn alla</button>
                            </div>
                            <div className="coi-toggle-group">
                                {!showDetails ? (
                                    <button tabIndex="0" id="show_details" aria-label="Visa detaljer" onClick={() => setShowDetails(true)}>Visa detaljer</button>
                                ) : (
                                    <button tabIndex="0" id="hide_details" aria-label="Dölj detaljer" onClick={() => setShowDetails(false)}>Dölj detaljer</button>
                                )}
                            </div>
                        </div>

                        {showDetails && (
                            <div className="coi-consent-banner__categories-wrapper" aria-label="Policy för kakor" id="coiConsentBannerCategoriesWrapper" aria-hidden="false" tabIndex="-1">
                                <CookieCategory
                                    name="necessary"
                                    label="Nödvändiga"
                                    description="Nödvändiga cookies hjälper dig att göra en hemsida användbar, genom att aktivera grundläggande funktioner såsom sidnavigering åtkomst till säkra områden på hemsidan. Hemsidan kan inte fungera optimalt utan dessa cookies."
                                    isOpen={openCategory === 'necessary'}
                                    onToggle={() => toggleCategory('necessary')}
                                >
                                    {/* Details for Necessary cookies would go here if they could be expanded */}
                                </CookieCategory>
                                <CookieCategory
                                    name="functional"
                                    label="Funktionella"
                                    description="Funktionella cookies gör det möjligt att spara uppgifter som ändrar hemsidans utseende eller funktioner. T.ex ditt föredragna språk eller de region som du befinner dig i."
                                    isOpen={openCategory === 'functional'}
                                    onToggle={() => toggleCategory('functional')}
                                >
                                    {/* Details for Functional cookies */}
                                </CookieCategory>
                                <CookieCategory
                                    name="statistic"
                                    label="Statistiska"
                                    description="Statistiska cookies hjälper hemsidans ägare att förstå hur besökare interagerar med hemsidan, genom att samla in och rapportera uppgifter."
                                    isOpen={openCategory === 'statistic'}
                                    onToggle={() => toggleCategory('statistic')}
                                >
                                    {/* Details for Statistic cookies */}
                                </CookieCategory>
                                <CookieCategory
                                    name="marketing"
                                    label="Marketing"
                                    description="Marketingcookies används för att spåra besökare gränsöverskridande på hemsidor. Avsikten är att visa annonser som är relevanta och engagerande för den enskilda användaren och därmed vara mer värdefulla för utgivare och tredjepartsannonsörer."
                                    isOpen={openCategory === 'marketing'}
                                    onToggle={() => toggleCategory('marketing')}
                                >
                                    {/* Details for Marketing cookies */}
                                </CookieCategory>
                            </div>
                        )}

                        <div className="coi-banner-consent-group">
                            <div className="coi-banner-consent-field">
                                <div className="coi-consent-banner__switch-container" id="switch-cookie_cat_necessary">
                                    <label htmlFor="cookie_cat_necessary" className="coi-checkboxes" title="Nödvändiga cookies hjälper dig att göra en hemsida användbar, genom att aktivera grundläggande funktioner såsom sidnavigering åtkomst till säkra områden på hemsidan. Hemsidan kan inte fungera optimalt utan dessa cookies.">
                                        <span className="coi-checkboxes-text">Nödvändiga</span>
                                        <div className="coi-checkboxes-switch">
                                            <input className="coi__checkbox" tabIndex="-1" data-index="-1" name="cookie_cat_necessary" id="cookie_cat_necessary" type="checkbox" disabled checked />
                                            <span className="checkbox-toggle"></span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="coi-banner-consent-field">
                                <div className="coi-consent-banner__switch-container" id="switch-cookie_cat_functional">
                                    <label htmlFor="cookie_cat_functional" className="coi-checkboxes" title="Funktionella cookies gör det möjligt att spara uppgifter som ändrar hemsidans utseende eller funktioner. T.ex ditt föredragna språk eller de region som du befinner dig i.">
                                        <span className="coi-checkboxes-text">Funktionella</span>
                                        <div className="coi-checkboxes-switch">
                                            <input className="coi__checkbox" tabIndex="0" data-index="0" name="cookie_cat_functional" id="cookie_cat_functional" type="checkbox" checked={functionalityCookies} onChange={() => handlePreferenceChange(setFunctionalityCookies, functionalityCookies)} />
                                            <span className="checkbox-toggle"></span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="coi-banner-consent-field">
                                <div className="coi-consent-banner__switch-container" id="switch-cookie_cat_statistic">
                                    <label htmlFor="cookie_cat_statistic" className="coi-checkboxes" title="Statistiska cookies hjälper hemsidans ägare att förstå hur besökare interagerar med hemsidan, genom att samla in och rapportera uppgifter.">
                                        <span className="coi-checkboxes-text">Statistiska</span>
                                        <div className="coi-checkboxes-switch">
                                            <input className="coi__checkbox" tabIndex="0" data-index="0" name="cookie_cat_statistic" id="cookie_cat_statistic" type="checkbox" checked={statisticsCookies} onChange={() => handlePreferenceChange(setStatisticsCookies, statisticsCookies)} />
                                            <span className="checkbox-toggle"></span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="coi-banner-consent-field">
                                <div className="coi-consent-banner__switch-container" id="switch-cookie_cat_marketing">
                                    <label htmlFor="cookie_cat_marketing" className="coi-checkboxes" title="Marketingcookies används för att spåra besökare gränsöverskridande på hemsidor. Avsikten är att visa annonser som är relevanta och engagerande för den enskilda användaren och därmed vara mer värdefulla för utgivare och tredjepartsannonsörer.">
                                        <span className="coi-checkboxes-text">Marketing</span>
                                        <div className="coi-checkboxes-switch">
                                            <input className="coi__checkbox" tabIndex="0" data-index="0" name="cookie_cat_marketing" id="cookie_cat_marketing" type="checkbox" checked={marketingCookies} onChange={() => handlePreferenceChange(setMarketingCookies, marketingCookies)} />
                                            <span className="checkbox-toggle"></span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div id="coiPage-3" className="coi-banner__page">
                        <div className="coi-banner__cookiedeclaration">
                            <h2 ref={policyHeadlineRef} tabIndex="-1" className="coi-banner__headline" id="coiPolicyHeadline">Policy för kakor</h2>
                            {/* Header and policy text */}
                        </div>
                        <div className="coi-banner__page-footer" role="navigation" aria-label="third-menu">
                            <button tabIndex="0" aria-label="Inställningar" className="coi-banner__lastpage" onClick={() => setShowPolicy(false)}>Inställningar</button>
                            <button tabIndex="0" aria-label="Godkänn alla button" className="coi-banner__accept" onClick={onAcceptAll}>Godkänn alla</button>
                        </div>
                        <div className="cookiedeclaration_wrapper">
                            {/* Full policy details */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


export default CookieBanner;