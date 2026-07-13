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
    <footer style={{ padding: '6rem 0 4rem 0', borderTop: '1px solid var(--border-color)', color: 'var(--text-grey)', fontSize: '0.9rem' }}>
      <div className="container footer-grid">
        
        {/* Left column: Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
          <img src="/logo.png" alt="Bena Tech" style={{ height: '24px', objectFit: 'contain' }} />
          <p style={{ lineHeight: 1.6, color: 'var(--text-grey)', maxWidth: '280px' }}>
            {t('hero_subtitle')}
          </p>
          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
            &copy; {new Date().getFullYear()} Bena Tech. {t('rights_reserved')}
          </p>
        </div>

        {/* Column 1: Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' }}>
          <h4 style={{ color: 'var(--text-white)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{t('email_us')}</h4>
          <a href="mailto:info@bena-tech.com" style={{ color: 'var(--text-grey)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-grey)'}>
            info@bena-tech.com
          </a>
          <h4 style={{ color: 'var(--text-white)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em', marginTop: '0.5rem' }}>{t('whatsapp')}</h4>
          <a href="https://wa.me/966502600558" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-grey)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-grey)'} dir="ltr">
            +966 50 260 0558
          </a>
        </div>

        {/* Column 2: Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' }}>
          <h4 style={{ color: 'var(--text-white)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{t('location')}</h4>
          <a href="https://maps.google.com/?q=Saudi+Arabia+Jeddah" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-grey)', textDecoration: 'none', transition: 'color 0.2s', lineHeight: 1.5 }} onMouseEnter={(e) => e.target.style.color = 'var(--text-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-grey)'}>
            {t('location_val')}
          </a>
        </div>

        {/* Column 3: Socials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' }}>
          <h4 style={{ color: 'var(--text-white)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{t('x_twitter')}</h4>
          <a href="https://x.com/bena_tech?s=11&t=gfGcupOvStZcN-39cfpEpQ" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-grey)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-grey)'} dir="ltr">
            @bena_tech
          </a>
          <h4 style={{ color: 'var(--text-white)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em', marginTop: '0.5rem' }}>{t('linkedin')}</h4>
          <a href="https://www.linkedin.com/company/bena-tech/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-grey)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-grey)'}>
            Bena Tech
          </a>
        </div>

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
