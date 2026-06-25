import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' }
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
          
          <Link to="/" style={{ zIndex: 1001, display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="BENA" style={{ height: '28px', objectFit: 'contain' }} />
          </Link>

          {/* Desktop Nav */}
          <div className="d-none d-md-flex" style={{ display: 'none', gap: '2.5rem', alignItems: 'center' }}>
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  style={{ 
                    fontWeight: 500, 
                    fontSize: '0.9rem', 
                    color: isActive ? 'var(--text-white)' : 'var(--text-grey)',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-white)'}
                  onMouseLeave={(e) => e.target.style.color = isActive ? 'var(--text-white)' : 'var(--text-grey)'}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link to="/booking" className="btn btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
              Book Meeting
            </Link>
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
