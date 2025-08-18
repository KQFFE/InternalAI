import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TeamPage from './pages/TeamPage';
import Layout from './components/Layout';
import License from './pages/License';
import CookieBanner from './components/CookieBanner';
import AdminLogin from './components/AdminLogin';
import { useAuth } from './context/AuthContext';
import { useCookieConsent } from './context/CookieConsentContext';

function App() {
  const { isLoginModalOpen, handleLoginSuccess, closeLoginModal } = useAuth();
  const {
    showCookieModal,
    acceptAllCookies,
    declineAllCookies,
    savePreferences,
    functionalityCookies,
    setFunctionalityCookies,
    statisticsCookies,
    setStatisticsCookies,
    marketingCookies,
    setMarketingCookies,
  } = useCookieConsent();

  return (
    <>
      <CookieBanner
        show={showCookieModal}
        onAcceptAll={acceptAllCookies}
        onDeclineAll={declineAllCookies}
        onSavePreferences={savePreferences}
        functionalityCookies={functionalityCookies}
        setFunctionalityCookies={setFunctionalityCookies}
        statisticsCookies={statisticsCookies}
        setStatisticsCookies={setStatisticsCookies}
        marketingCookies={marketingCookies}
        setMarketingCookies={setMarketingCookies}
      />
      {isLoginModalOpen && (
        <AdminLogin onLogin={handleLoginSuccess} onCancel={closeLoginModal} />
      )}
      {/* The Layout component now wraps your page routes */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/license" element={<License />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;