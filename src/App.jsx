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
    <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-grey)' }}>
      <div className="container">
        <p style={{ fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} Bena Tech. {t('rights_reserved')}</p>
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
