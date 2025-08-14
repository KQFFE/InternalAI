import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import License from './License';
import TeamPage from './TeamPage';
import AdminLogin from './components/AdminLogin';


// --- Cookie Banner Component ---
function CookieBanner({
    show,
    onAcceptAll,
    onDeclineAll,
    onSavePreferences, // This prop is no longer used directly by a button, but kept for completeness if other logic depends on it.
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
                                <div role="tablist" className="coi-consent-banner__category-container">
                                    <div className="coi-consent-banner__category-controls">
                                        <button tabIndex="0" aria-controls="description-container-cookie_cat_necessary" aria-expanded={openCategory === 'necessary'} onClick={() => toggleCategory('necessary')} className="coi-consent-banner__category-name">
                                            <div aria-hidden="true" className={`ci-arrow ${openCategory === 'necessary' ? 'open' : ''}`}></div>
                                            <h3 aria-label="Nödvändiga">Nödvändiga</h3>
                                        </button>
                                        <div className="coi-consent-banner__category-description">Nödvändiga cookies hjälper dig att göra en hemsida användbar, genom att aktivera grundläggande funktioner såsom sidnavigering åtkomst till säkra områden på hemsidan. Hemsidan kan inte fungera optimalt utan dessa cookies.</div>
                                    </div>
                                    <div className="coi-consent-banner__description-container" id="description-container-cookie_cat_necessary" aria-hidden={openCategory !== 'necessary'} style={{ display: openCategory === 'necessary' ? 'block' : 'none' }}>
                                        <div role="table" aria-label="Nödvändiga Cookies" className="coi-consent-banner__found-cookies">
                                            <div role="rowgroup" className="coi-consent-banner__cookie-details">
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Tjänst:</span><span role="cell" className="cookie-details__detail-content">Microsoft Azure</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Syfte:</span><span role="cell" className="cookie-details__detail-content">Krävs för att webbplatsen ska fungera.</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Integritetspolicy:</span><span role="cell" className="cookie-details__detail-content"><a title="Integritetspolicy" rel="noopener noreferrer" tabIndex="-1" target="_blank" href="https://www.microsoft.com/en-us/privacy/privacystatement">Microsoft Azure - Integritetspolicy</a></span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Utgångstid:</span><span role="cell" className="cookie-details__detail-content">Session</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Namn:</span><span role="cell" className="cookie-details__detail-content">ARRAffinitySameSite</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Leverantör:</span><span role="cell" className="cookie-details__detail-content">.www.knowit.se</span></div>
                                            </div>
                                            <div role="rowgroup" className="coi-consent-banner__cookie-details">
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Tjänst:</span><span role="cell" className="cookie-details__detail-content">Cookie Information</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Syfte:</span><span role="cell" className="cookie-details__detail-content">Used to share consent across domains.</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Integritetspolicy:</span><span role="cell" className="cookie-details__detail-content"><a title="Integritetspolicy" rel="noopener noreferrer" tabIndex="-1" target="_blank" href="https://cookieinformation.com/cookie-and-privacy-policy/">Cookie Information - Integritetspolicy</a></span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Utgångstid:</span><span role="cell" className="cookie-details__detail-content">ett år</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Namn:</span><span role="cell" className="cookie-details__detail-content">CookieInformationConsent_xxx</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Leverantör:</span><span role="cell" className="cookie-details__detail-content">policy.app.cookieinformation.com</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div role="tablist" className="coi-consent-banner__category-container">
                                    <div className="coi-consent-banner__category-controls">
                                        <button tabIndex="0" aria-controls="description-container-cookie_cat_functional" aria-expanded={openCategory === 'functional'} onClick={() => toggleCategory('functional')} className="coi-consent-banner__category-name">
                                            <div aria-hidden="true" className={`ci-arrow ${openCategory === 'functional' ? 'open' : ''}`}></div>
                                            <h3 aria-label="Funktionella">Funktionella</h3>
                                        </button>
                                        <div className="coi-consent-banner__category-description">Funktionella cookies gör det möjligt att spara uppgifter som ändrar hemsidans utseende eller funktioner. T.ex ditt föredragna språk eller de region som du befinner dig i.</div>
                                    </div>
                                    <div className="coi-consent-banner__description-container" id="description-container-cookie_cat_functional" aria-hidden={openCategory !== 'functional'} style={{ display: openCategory === 'functional' ? 'block' : 'none' }}>
                                        <div role="table" aria-label="Funktionella Cookies" className="coi-consent-banner__found-cookies">
                                            <div role="rowgroup" className="coi-consent-banner__cookie-details">
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Tjänst:</span><span role="cell" className="cookie-details__detail-content">Cloudflare</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Syfte:</span><span role="cell" className="cookie-details__detail-content">Stödjer webbplatsens tekniska funktioner.</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Integritetspolicy:</span><span role="cell" className="cookie-details__detail-content"><a title="Integritetspolicy" rel="noopener noreferrer" tabIndex="-1" target="_blank" href="https://www.cloudflare.com/privacypolicy/">Cloudflare - Integritetspolicy</a></span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Utgångstid:</span><span role="cell" className="cookie-details__detail-content">29 minuter</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Namn:</span><span role="cell" className="cookie-details__detail-content">__cf_bm</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Leverantör:</span><span role="cell" className="cookie-details__detail-content">.hubspot.com</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div role="tablist" className="coi-consent-banner__category-container">
                                    <div className="coi-consent-banner__category-controls">
                                        <button tabIndex="0" aria-controls="description-container-cookie_cat_statistic" aria-expanded={openCategory === 'statistic'} onClick={() => toggleCategory('statistic')} className="coi-consent-banner__category-name">
                                            <div aria-hidden="true" className={`ci-arrow ${openCategory === 'statistic' ? 'open' : ''}`}></div>
                                            <h3 aria-label="Statistiska">Statistiska</h3>
                                        </button>
                                        <div className="coi-consent-banner__category-description">Statistiska cookies hjälper hemsidans ägare att förstå hur besökare interagerar med hemsidan, genom att samla in och rapportera uppgifter.</div>
                                    </div>
                                    <div className="coi-consent-banner__description-container" id="description-container-cookie_cat_statistic" aria-hidden={openCategory !== 'statistic'} style={{ display: openCategory === 'statistic' ? 'block' : 'none' }}>
                                        <div role="table" aria-label="Statistiska Cookies" className="coi-consent-banner__found-cookies">
                                            <div role="rowgroup" className="coi-consent-banner__cookie-details">
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Tjänst:</span><span role="cell" className="cookie-details__detail-content">Google Analytics</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Syfte:</span><span role="cell" className="cookie-details__detail-content">Samlar in information om användarna och deras verksamhet på webbplatsen för analys och rapportering.</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Integritetspolicy:</span><span role="cell" className="cookie-details__detail-content"><a title="Integritetspolicy" rel="noopener noreferrer" tabIndex="-1" target="_blank" href="https://policies.google.com/technologies/partner-sites?hl=en">Google Analytics - Integritetspolicy</a></span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Utgångstid:</span><span role="cell" className="cookie-details__detail-content">ett år</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Namn:</span><span role="cell" className="cookie-details__detail-content">_ga</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Leverantör:</span><span role="cell" className="cookie-details__detail-content">.knowit.se</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div role="tablist" className="coi-consent-banner__category-container">
                                    <div className="coi-consent-banner__category-controls">
                                        <button tabIndex="0" aria-controls="description-container-cookie_cat_marketing" aria-expanded={openCategory === 'marketing'} onClick={() => toggleCategory('marketing')} className="coi-consent-banner__category-name">
                                            <div aria-hidden="true" className={`ci-arrow ${openCategory === 'marketing' ? 'open' : ''}`}></div>
                                            <h3 aria-label="Marketing">Marketing</h3>
                                        </button>
                                        <div className="coi-consent-banner__category-description">Marketingcookies används för att spåra besökare gränsöverskridande på hemsidor. Avsikten är att visa annonser som är relevanta och engagerande för den enskilda användaren och därmed vara mer värdefulla för utgivare och tredjepartsannonsörer.</div>
                                    </div>
                                    <div className="coi-consent-banner__description-container" id="description-container-cookie_cat_marketing" aria-hidden={openCategory !== 'marketing'} style={{ display: openCategory === 'marketing' ? 'block' : 'none' }}>
                                        <div role="table" aria-label="Marketing Cookies" className="coi-consent-banner__found-cookies">
                                            <div role="rowgroup" className="coi-consent-banner__cookie-details">
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Tjänst:</span><span role="cell" className="cookie-details__detail-content">Youtube, Google</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Syfte:</span><span role="cell" className="cookie-details__detail-content">Samlar in information om användarna och deras verksamhet på webbplatsen genom inbyggda videospelare med syfte att leverera riktade annonser.</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Integritetspolicy:</span><span role="cell" className="cookie-details__detail-content"><a title="Integritetspolicy" rel="noopener noreferrer" tabIndex="-1" target="_blank" href="https://policies.google.com/technologies/partner-sites?hl=en">Youtube, Google - Integritetspolicy</a></span></div>
                                                {/* Corrected the incomplete span tag below */}
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Utgångstid:</span><span role="cell" className="cookie-details__detail-content">Session</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Namn:</span><span role="cell" className="cookie-details__detail-content">VISITOR_INFO1_LIVE</span></div>
                                                <div role="row" className="cookie-details__detail-container"><span role="cell" className="cookie-details__detail-title">Leverantör:</span><span role="cell" className="cookie-details__detail-content">youtube.com</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div id="coiPage-3" className="coi-banner__page">
                        <div className="coi-banner__cookiedeclaration">
                            <div className="coi-banner__header">
                                <img src="/knowit-logo.png" alt="logo" className="coi-banner__logo" />
                                <span className="coi-banner__branding">
                                    powered by: <a className="coi-external-link" href="https://cookieinformation.com/" target="_blank" rel="noopener noreferrer">Cookie Information</a>
                                </span>
                            </div>
                            <div className="coi-banner__text">
                                <h2 className="coi-banner__headline">Policy för kakor</h2>
                                <div className="coi-banner__maintext">
                                    <strong className="top-column__bold-text">Ditt samtycke gäller för följande domäner:</strong>
                                    <span className="top-column__website-domains">knowit.se, blogg.knowit.se, info.knowit.se</span>
                                    <strong className="top-column__bold-text">Policyn för kakor senast uppdaterad 29.07.2025</strong>
                                </div>
                            </div>
                        </div>
                        <div className="coi-banner__page-footer" role="navigation" aria-label="third-menu">
                            <button tabIndex="0" aria-label="Inställningar" className="coi-banner__lastpage" onClick={() => setShowPolicy(false)}>Inställningar</button>
                            <button tabIndex="0" aria-label="Godkänn alla button" className="coi-banner__accept" onClick={onAcceptAll}>Godkänn alla</button>
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
                                <p>Du kan när som helt neka alla kakor och/eller tredjepartskakor helt och hållet genom att ändra inställningarna i din webbläsare i din dator, surfplatta eller smartmobil. Var inställningarna finns beror på vilken webbläsare du använder. Du bör dock vara medveten om att om du nekar alla kakor och/eller tredjepartskakor kommer det finnas funktioner och tjänster som du inte kommer kunna använda på webbplatsen (eftersom de är beroende av kakor).<br />
                                    <a rel="noopener noreferrer" href="https://tools.google.com/dlpage/gaoptout" target="_blank">Du kan välja bort kakor från Google Analytics här</a>.
                                </p>
                                <h2>Hur gör jag för att ta bort kakor?</h2>
                                <p>Det är lätt att radera kakor som du tidigare godkänt. Tillvägagångssättet beror på vilken webbläsare (Chrome, Firefox, Safari, etc.) och vilken enhet du använder (smartmobil, surfplatta, PC, Mac). <br /> Ofta finns verktyg för borttagning under inställningar – Sekretess och säkerhet – men det kan variera mellan olika webbläsare.  Ange vilken enhet/webbläsare du använder (klicka på den länk som stämmer):</p>
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
                                    <li><a rel="noopener noreferrer" href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DAndroid&amp;hl=en" target="_blank">Chrome, Android</a></li>
                                </ul><p></p>
                                <h2>Ändra ditt samtycke</h2>
                                <p>Du kan ändra ditt samtycke genom att antingen radera kakor från din webbläsare eller ändra ditt ursprungliga val genom att klicka på länken nedanför:</p>
                                <a className="coi-renew-link" href="#!" onClick={(e) => { e.preventDefault(); if (window.CookieConsent) { window.CookieConsent.renew(); } }}>Klicka här för att ändra ditt samtycke</a>
                                <p>OBS: Om du använder mer än en webbläsare måste du radera kakorna i alla.</p>
                                <h2>Har du några frågor?</h2>
                                <p>Ta gärna kontakt med oss om du har några kommentarer eller frågor gällande vår information och/eller behandling av personuppgifter.
                                    Vår policy för kakor uppdateras en gång i månaden av <a href="https://cookieinformation.com/" target="_blank" rel="noopener noreferrer">Cookie Information</a>. Om du har några frågor om vår policy för kakor är du välkommen att <a href="https://cookieinformation.com/" target="_blank" rel="noopener noreferrer">kontakta Cookie Information på deras webbplats</a></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
// --- End Cookie Banner Component ---

function HomePageContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const handleReadMoreClick = () => {
        navigate('/team');
    };

    const handleLicenseClick = () => {
        navigate('/license');
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-gradient-bg font-inter" aria-label="Hero section">
                {/* Header Section */}
                <header
                    className="flex justify-between items-center p-6 md:p-10 container mx-auto"
                    role="banner"
                    aria-label="Main navigation header"
                >
                    <div className="text-2xl font-bold text-white">
                        <Link to="/" aria-label="Go to homepage">
                            <img
                                src="/knowit-logo.png"
                                alt="Knowit company logo"
                                className={`app-logo-image h-8 w-auto ${isHomePage ? 'logo-white' : ''}`}
                                id="main-logo"
                            />
                        </Link>
                    </div>
                    <nav className="main-nav-list flex items-center space-x-6" role="navigation" aria-label="Main navigation">
                        <Link to="/services" className="main-nav-link text-white text-lg hover:underline" id="nav-services" aria-label="Services page">Services</Link>
                        <Link to="/about" className="main-nav-link text-white text-lg hover:underline" id="nav-about" aria-label="About us page">About</Link>
                        <Link to="/team" className="main-nav-link text-white text-lg hover:underline" id="nav-team" aria-label="Our team page">Team</Link>
                        <Link to="/license" className="main-nav-link text-white text-lg hover:underline" id="nav-license" aria-label="License information">License</Link>
                        <Link to="/contact" className="main-nav-link text-white text-lg hover:underline" id="nav-contact" aria-label="Contact us">Contact</Link>
                    </nav>
                </header>

                {/* Hero Main Content */}
                <main className="flex-grow flex flex-col justify-center items-center text-center p-6 md:p-10 container mx-auto" role="main">
                    <h1 className="hero-title text-4xl md:text-6xl font-bold leading-tight mb-8 max-w-4xl text-white" id="main-heading">
                        Shaping a better future with code
                    </h1>
                    <p className="hero-subtitle text-xl md:text-2xl mb-12 max-w-2xl text-white opacity-90" id="main-subtitle">
                        We are a digitalization company that develops solutions and services.
                    </p>
                    <div className="homepage-buttons-container" role="group" aria-label="Main action buttons">
                        <button
                            onClick={handleReadMoreClick}
                            className="hero-button bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                            id="team-button"
                            aria-label="Read more about our team"
                            type="button"
                        >
                            Read more about our team
                        </button>
                        <button
                            onClick={handleLicenseClick}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                            id="license-button"
                            aria-label="Access Knowit License Management system"
                            type="button"
                        >
                            Knowit License Management
                        </button>
                    </div>
                </main>

                {/* Gradient Box at the bottom of hero section */}
                <section className="gradient-box mx-4 md:mx-8 mb-8" aria-label="Company highlights" id="company-highlights">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
                        {/* Box 1 */}
                        <div className="gradient-box-item" id="customer-experience-highlight" data-testid="customer-experience-highlight">
                            <h2 className="gradient-box-title text-xl md:text-2xl font-semibold mb-4 text-white">
                                We create unique customer experiences
                            </h2>
                            <p className="gradient-box-text text-white opacity-80 leading-relaxed">
                                We are a digitalization company that develops solutions and services.
                            </p>
                        </div>

                        {/* Box 2 */}
                        <div className="gradient-box-item" id="innovation-highlight" data-testid="innovation-highlight">
                            <h2 className="gradient-box-title text-xl md:text-2xl font-semibold mb-4 text-white">
                                Innovation through collaboration
                            </h2>
                            <p className="gradient-box-text text-white opacity-80 leading-relaxed">
                                We are a digitalization company that develops solutions and services.
                            </p>
                        </div>
                    </div>
                </section>
            </section>

            {/* News Section */}
            <section className="bg-yellow-100 text-gray-800 py-16 md:py-24 px-6 font-inter" aria-label="Latest news" id="news-section">
                <div className="container mx-auto">
                    <h2 className="news-heading text-3xl font-semibold mb-12" id="news-heading">News</h2>

                    {/* News Links */}
                    <div className="grid grid-cols-1 gap-8 mb-16" role="list" aria-label="News articles">
                        <article className="news-item-link flex justify-between items-center border-b border-gray-400 pb-4 group" role="listitem">
                            <button
                                onClick={() => {}}
                                className="flex-grow text-left bg-transparent border-none cursor-pointer"
                                id="news-item-1"
                                aria-label="Read article about Summer Project 2025 from June 26"
                            >
                                <div>
                                    <p className="news-item-meta text-gray-600 text-sm mb-1">
                                        <time dateTime="2025-06-26">2025-06-26</time>
                                        <span className="news-item-meta-bold font-bold"> Summer Project 2025</span>
                                    </p>
                                    <h3 className="news-item-title text-xl font-medium">
                                        Kristoffer, Sasan, Sakshi and Johanna is creating a landing page and automating a process, by using AI for everything.
                                    </h3>
                                </div>
                            </button>
                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true">→</span>
                        </article>

                        <article className="news-item-link flex justify-between items-center border-b border-gray-400 pb-4 group" role="listitem">
                            <button
                                onClick={() => console.log('News item 2 clicked')}
                                className="flex-grow text-left bg-transparent border-none cursor-pointer"
                                id="news-item-2"
                                aria-label="Read article about Summer Project 2025 from July 1"
                            >
                                <div>
                                    <p className="news-item-meta text-gray-600 text-sm mb-1">
                                        <time dateTime="2025-07-01">2025-07-01</time>
                                        <span className="news-item-meta-bold font-bold"> Summer Project 2025</span>
                                    </p>
                                    <h3 className="news-item-title text-xl font-medium">
                                        The team request earlier vacation leave due to information overflow
                                    </h3>
                                </div>
                            </button>
                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true">→</span>
                        </article>
                    </div>

                    <button
                        onClick={() => console.log('More news clicked')}
                        className="more-news-link flex items-center space-x-2 text-gray-800 font-semibold text-lg group mb-24 bg-transparent border-none cursor-pointer"
                        id="more-news-link"
                        aria-label="View all news articles"
                        type="button"
                    >
                        More news
                        <span className="text-2xl group-hover:rotate-90 transition-transform duration-300" aria-hidden="true">→</span>
                    </button>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-orange-200 text-gray-800 py-16 md:py-24 px-6 font-inter" role="contentinfo" aria-label="Site footer">
                <div className="container mx-auto">
                    {/* Footer Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div id="footer-careers">
                            <h3 className="become-one-of-us-heading text-4xl font-bold mb-8 transform -rotate-6 origin-bottom-left max-w-xs leading-none">
                                Become one of us
                            </h3>
                            <button // This remains a button as it likely triggers an action, not a route change.
                                onClick={() => { /* Add career functionality here */ }}
                                className="flex items-center space-x-2 text-gray-800 font-semibold text-lg group hover:underline bg-transparent border-none cursor-pointer"
                                id="footer-careers-button"
                                aria-label="Find your new job at Knowit"
                                type="button"
                            >
                                Hitta ditt nya jobb här
                                <span className="transform transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                            </button>
                        </div>

                        <div id="footer-contact">
                            <h4 className="footer-column-heading font-bold text-lg mb-4">CONTACT</h4>
                            <address className="not-italic">
                                <ul className="space-y-2 text-sm">
                                    <li className="footer-text">Box 3390, SE-103 68 Stockholm</li>
                                    <li>Besök: Mäster Samuelsgatan 60, Stockholm</li>
                                    <li><a href="tel:+46102797000" className="hover:underline" id="contact-phone" aria-label="Call us at +46 10 279 70 00">Tel: +46 10 279 70 00</a></li>
                                    <li><a href="mailto:info@knowit.se" className="hover:underline" id="contact-email" aria-label="Send email to info@knowit.se">E-mail: info@knowit.se</a></li>
                                </ul>
                            </address>
                        </div>

                        <div id="footer-about">
                            <h4 className="footer-column-heading font-bold text-lg mb-4">ABOUT KNOWIT</h4>
                            <nav aria-label="About Knowit links">
                                <ul className="space-y-2 text-sm">
                                    <li><a href="https://www.knowit.se/om-oss/var-historia/" className="hover:underline" id="about-history" aria-label="Learn about our history">Our history</a></li>
                                    <li><a href="https://www.knowit.se/om-oss/varden/" className="hover:underline" id="about-values" aria-label="Learn about our values">Our values</a></li>
                                    <li><a href="https://www.knowit.se/om-oss/medarbetare/" className="hover:underline" id="about-employees" aria-label="Meet our employees">Our employees</a></li>
                                    <li><a href="https://www.knowit.se/investerare/" className="hover:underline" id="about-investors" aria-label="Investor relations information">Investor relations</a></li>
                                    <li><a href="https://www.knowit.se/karriar/" className="hover:underline" id="about-career" aria-label="Career opportunities">Career</a></li>
                                </ul>
                            </nav>
                        </div>

                        <div id="footer-business">
                            <h4 className="footer-column-heading font-bold text-lg mb-4">BUSINESS AREAS</h4>
                            <nav aria-label="Business areas links">
                                <ul className="space-y-2 text-sm">
                                    <li><a href="https://www.knowit.se/tjanster/experience/" className="hover:underline" id="business-experience" aria-label="Learn about Knowit Experience">Knowit Experience</a></li>
                                    <li><a href="https://www.knowit.se/tjanster/connectivity/" className="hover:underline" id="business-connectivity" aria-label="Learn about Knowit Connectivity">Knowit Connectivity</a></li>
                                    <li><a href="https://www.knowit.se/tjanster/solutions/" className="hover:underline" id="business-solutions" aria-label="Learn about Knowit Solutions">Knowit Solutions</a></li>
                                    <li><a href="https://www.knowit.se/tjanster/insight/" className="hover:underline" id="business-insight" aria-label="Learn about Knowit Insight">Knowit Insight</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    {/* Bottom Footer Links */}
                    <div className="footer-bottom-row flex flex-wrap justify-between items-center text-sm text-gray-800">
                        <div className="flex flex-wrap space-x-4 mb-4 md:mb-0">
                            <a href="https://www.knowit.se/cookies/" className="hover:underline" id="footer-cookies" aria-label="Read our cookie policy">Cookie Policy</a>
                            <a href="https://www.knowit.se/hantering-av-personuppgifter/" className="hover:underline" id="footer-privacy" aria-label="Read about handling of personal data">Hantering av personuppgifter</a>
                            <a href="https://www.knowit.se/whistleblower/" className="hover:underline" id="footer-whistleblower" aria-label="Whistleblower information">Whistleblower</a>
                            <span id="footer-copyright">© 2023 Knowit AB</span>
                        </div>
                        <div className="flex flex-wrap space-x-4">
                            <a href="https://www.linkedin.com/company/knowit/" className="hover:underline" id="footer-linkedin" aria-label="Follow us on LinkedIn">LinkedIn</a>
                            <a href="https://www.facebook.com/weareknowit" className="hover:underline" id="footer-facebook" aria-label="Follow us on Facebook">Facebook</a>
                            <a href="https://www.instagram.com/weareknowit/" className="hover:underline" id="footer-instagram" aria-label="Follow us on Instagram">Instagram</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

function App() {
    // Cookie Consent State and Logic
    const [showCookieModal, setShowCookieModal] = useState(false);
    const [functionalityCookies, setFunctionalityCookies] = useState(false);
    const [statisticsCookies, setStatisticsCookies] = useState(false);
    const [marketingCookies, setMarketingCookies] = useState(false);

    // Admin Authentication State
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

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
        setShowCookieModal(false);
    };

    const denyAllCookies = () => {
        localStorage.setItem('cookieConsent', 'denied');
        localStorage.setItem('functionalityCookies', 'false');
        localStorage.setItem('statisticsCookies', 'false');
        localStorage.setItem('marketingCookies', 'false');
        setShowCookieModal(false);
    };

    const savePreferences = () => {
        localStorage.setItem('cookieConsent', 'custom');
        localStorage.setItem('functionalityCookies', functionalityCookies.toString());
        localStorage.setItem('statisticsCookies', statisticsCookies.toString());
        localStorage.setItem('marketingCookies', marketingCookies.toString());
        setShowCookieModal(false);
    };

    // Admin Authentication Handlers
    const handleShowAdminLogin = () => {
        setShowAdminLogin(true);
    };

    const handleAdminLogin = (loginData) => {
        console.log('Admin login successful:', loginData);
        setIsAdminAuthenticated(true);
        setShowAdminLogin(false);
    };

    const handleCancelAdminLogin = () => {
        setShowAdminLogin(false);
    };

    const handleAdminLogout = async () => {
        try {
            const response = await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setIsAdminAuthenticated(false);
                console.log('Admin logged out successfully');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <Router>
            <div className="App font-inter">
                {/* Admin Button - Top Right Corner */}
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    {isAdminAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{
                                fontSize: '12px',
                                color: '#10b981',
                                fontWeight: '500',
                                padding: '4px 8px',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '4px'
                            }}>
                                Admin Mode
                            </span>
                            <button
                                onClick={handleAdminLogout}
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleShowAdminLogin}
                            style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#4f46e5'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
                        >
                            Admin
                        </button>
                    )}
                </div>

                {/* Cookie Consent Banner */}
                <CookieBanner
                    show={showCookieModal}
                    onAcceptAll={acceptAllCookies}
                    onDeclineAll={denyAllCookies}
                    onSavePreferences={savePreferences}
                    functionalityCookies={functionalityCookies}
                    setFunctionalityCookies={setFunctionalityCookies}
                    statisticsCookies={statisticsCookies}
                    setStatisticsCookies={setStatisticsCookies}
                    marketingCookies={marketingCookies}
                    setMarketingCookies={setMarketingCookies}
                />

                {/* Everything else remains as before */}
                <Routes>
                    <Route path="/" element={<HomePageContent />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/license" element={<License />} />
                </Routes>

                {/* Admin Login Modal */}
                {showAdminLogin && (
                    <AdminLogin
                        onLogin={handleAdminLogin}
                        onCancel={handleCancelAdminLogin}
                    />
                )}
            </div>
        </Router>
    );
}

export default App;
