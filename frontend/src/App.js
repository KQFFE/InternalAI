import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TeamPage from './pages/TeamPage';
import Layout from './components/Layout';
import License from './pages/License';
import CookieBanner from './components/CookieBanner';
import AdminLogin from './components/AdminLogin';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoginModalOpen, handleLoginSuccess, closeLoginModal } = useAuth();

  return (
    <Router>
      <CookieBanner />
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
    </Router>
  );
}

export default App;