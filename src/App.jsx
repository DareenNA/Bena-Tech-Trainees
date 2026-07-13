import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminResetPassword from './pages/AdminResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import { useLanguage } from './context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer style={{ padding: '6rem 0 4rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-grey)' }}>
      <div className="container">
        {/* Contact Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '5rem',
          maxWidth: '1200px',
          margin: '0 auto 5rem auto'
        }}>
          {/* Email Card */}
          <a href="mailto:info@bena-tech.com" className="footer-card">
            <span className="footer-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <span className="footer-label">{t('email_us')}</span>
            <span className="footer-value">info@bena-tech.com</span>
          </a>

          {/* WhatsApp Card */}
          <a href="https://wa.me/966502600558" target="_blank" rel="noopener noreferrer" className="footer-card">
            <span className="footer-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <span className="footer-label">{t('whatsapp')}</span>
            <span className="footer-value" dir="ltr">+966 50 260 0558</span>
          </a>

          {/* X Card */}
          <a href="https://x.com/bena_tech?s=11&t=gfGcupOvStZcN-39cfpEpQ" target="_blank" rel="noopener noreferrer" className="footer-card">
            <span className="footer-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </span>
            <span className="footer-label">{t('x_twitter')}</span>
            <span className="footer-value" dir="ltr">@bena_tech</span>
          </a>

          {/* LinkedIn Card */}
          <a href="https://www.linkedin.com/company/bena-tech/" target="_blank" rel="noopener noreferrer" className="footer-card">
            <span className="footer-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </span>
            <span className="footer-label">{t('linkedin')}</span>
            <span className="footer-value">Bena Tech</span>
          </a>

          {/* Location Card */}
          <a href="https://maps.google.com/?q=Saudi+Arabia+Jeddah" target="_blank" rel="noopener noreferrer" className="footer-card">
            <span className="footer-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <span className="footer-label">{t('location')}</span>
            <span className="footer-value">{t('location_val')}</span>
          </a>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>&copy; {new Date().getFullYear()} Bena Tech. {t('rights_reserved')}</p>
      </div>
    </footer>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main style={{ minHeight: '100vh', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/booking" replace />} />
          <Route path="/about" element={null} />
          <Route path="/services" element={null} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
