import React, { useState, useEffect } from 'react';
import './cookie-banner.css';

// --- Cookie Banner Component ---
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

    useEffect(() => {
        if (show) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        // Cleanup function to ensure the class is removed when the component unmounts
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [show]); // This effect runs whenever the `show` prop changes

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
            <div role="dialog" tabIndex="-1" aria-modal="true" id="coi-banner-wrapper" className="coi-banner__wrapper"
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
                                    <button tabIndex="0" aria-label="Spara inställningar" id="savePreferencesButton" className="coi-banner__decline" onClick={onSavePreferences}>Spara inställningar</button>
                                ) : (
                                    <button tabIndex="0" aria-label="Neka alla" id="declineButton" className="coi-banner__decline" onClick={onDeclineAll}>Neka alla</button>
                                )}
                                <button tabIndex="0" aria-label="Godkänn alla" className="coi-banner__accept" onClick={onAcceptAll}>Godkänn alla</button>
                            </div>
                            <div className="coi-toggle-group">
                                {!showDetails ? (
                                    <button tabIndex="0" id="show_details" aria-label="Visa detaljer" onClick={() => setShowDetails(true)}>Visa detaljer</button>
                                ) : (
                                    <button tabIndex="0" id="hide_details" aria-label="Dölj detaljer" onClick={() => setShowDetails(false)}>Dölj detaljer</button>
                                )}
                            </div>
                        </div>

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

                        {showDetails && (
                            <div className="coi-consent-banner__categories-wrapper" aria-label="Policy för kakor" id="coiConsentBannerCategoriesWrapper" aria-hidden="false" tabIndex="-1">
                                <div className="coi-consent-banner__category-container">
                                    <div className="coi-consent-banner__category-controls">
                                        <button
                                            tabIndex="0"
                                            aria-controls="description-container-cookie_cat_necessary"
                                            aria-expanded={openCategory === 'necessary'}
                                            onClick={() => toggleCategory('necessary')}
                                            className="coi-consent-banner__category-name"
                                            id="coi-category-necessary"
                                        >
                                            <div aria-hidden="true" className={`ci-arrow ${openCategory === 'necessary' ? 'open' : ''}`}></div>
                                            <span className="coi-category-title" id="coi-category-title-necessary">Nödvändiga</span>
                                        </button>
                                        <h3 aria-labelledby="coi-category-title-necessary" aria-label="Nödvändiga">Nödvändiga</h3>
                                        <div className="coi-consent-banner__category-description">
                                            Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av i våra system.
                                        </div>
                                    </div>
                                    <div className="coi-consent-banner__description-container" id="description-container-cookie_cat_necessary" aria-hidden={openCategory !== 'necessary'} style={{ display: openCategory === 'necessary' ? 'block' : 'none' }}>
                                        {/* Här kan du lägga till information om nödvändiga cookies som används på din webbplats */}
                                    </div>
                                </div>
                                {/* Repeat for other categories: Functional, Statistic, Marketing */}
                            </div>
                        )}
                    </div>
                ) : (
                    <div id="coiPage-3" className="coi-banner__page">
                        <div className="coi-banner__cookiedeclaration">
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