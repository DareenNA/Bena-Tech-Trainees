import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('about'), path: 'https://bena-tech.com/about', external: true },
    { name: t('services'), path: 'https://bena-tech.com/services', external: true }
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        padding: '1rem 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <a href="https://bena-tech.com/about" style={{ zIndex: 1001, display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="BENA" style={{ height: '28px', objectFit: 'contain' }} />
          </a>

          {/* Desktop Nav */}
          <div className="d-none d-md-flex" style={{ display: 'none', gap: '2.5rem', alignItems: 'center' }}>
            {navLinks.map((item) => {
              const style = { 
                fontWeight: 500, 
                fontSize: '0.9rem', 
                color: 'var(--text-grey)',
                transition: 'color 0.2s',
                textDecoration: 'none'
              };
              
              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    style={style}
                    onMouseEnter={(e) => e.target.style.color = 'var(--text-white)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-grey)'}
                  >
                    {item.name}
                  </a>
                );
              }

              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  style={{ 
                    ...style,
                    color: isActive ? 'var(--text-white)' : 'var(--text-grey)'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-white)'}
                  onMouseLeave={(e) => e.target.style.color = isActive ? 'var(--text-white)' : 'var(--text-grey)'}
                >
                  {item.name}
                </Link>
              );
            })}
            
            <Link to="/booking" className="btn btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
              {t('book_meeting')}
            </Link>

            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage} 
              className="btn-lang"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.5rem 0.8rem',
                fontSize: '0.85rem'
              }}
            >
              <Globe size={15} />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="d-md-none" 
            style={{ display: 'block', background: 'none', border: 'none', color: 'var(--text-white)', zIndex: 1001, cursor: 'pointer' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 999,
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2.5rem',
        transition: 'all 0.3s ease',
      }}>
        {navLinks.map((item) => (
          <a
            key={item.name}
            href={item.path}
            style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: 'var(--text-white)',
              textDecoration: 'none'
            }}
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </a>
        ))}
        <Link 
          to="/booking" 
          className="btn btn-secondary" 
          style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}
          onClick={() => setIsOpen(false)}
        >
          {t('book_meeting')}
        </Link>
        
        {/* Mobile Language Toggle */}
        <button 
          onClick={() => { toggleLanguage(); setIsOpen(false); }} 
          className="btn-lang"
          style={{ fontSize: '1rem', padding: '0.6rem 1.2rem' }}
        >
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .d-none { display: none !important; }
          .d-md-flex { display: flex !important; }
          .d-md-none { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
