import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useEffect(() => {
    // Ultra-smooth Apple-style reveals
    gsap.fromTo('.reveal-up', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 },
      "<0.1"
    );
  }, []);

  return (
    <div>
      <div className="ambient-light"></div>

      {/* Hero Section */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '160px', position: 'relative' }}>
        <div className="container" style={{ textAlign: 'center', zIndex: 2 }}>

          <h1 className="display-1 reveal-up" style={{ marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto 1.5rem auto' }}>
            We architect the digital infrastructure your business stands on.
          </h1>
          
          <p className="reveal-up" style={{ fontSize: '1.25rem', color: 'var(--text-grey)', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
            From first idea to scaled operation. We build high-performance systems designed to endure.
          </p>
          
          <div className="reveal-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/booking" className="btn btn-primary">Book a Meeting</Link>
            <Link to="/services" className="btn btn-secondary">Our Services</Link>
          </div>
        </div>

        {/* Hero 3D Render */}
        <div className="reveal-up hero-image-container" style={{ width: '100%', maxWidth: '1400px', margin: '4rem auto 0 auto', padding: '0 2rem', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: '0 2rem',
            background: 'linear-gradient(to top, #000 0%, transparent 40%)',
            zIndex: 1
          }}></div>
          <img 
            src="/assets/hero_3d.png" 
            alt="Abstract Architecture" 
            style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '24px', border: '1px solid var(--border-color)' }}
          />
        </div>
      </section>

      {/* About Section (Merged from About Page) */}
      <section id="about" style={{ padding: '8rem 0' }}>
        <div className="container">
          <div className="reveal-up" style={{ marginBottom: '6rem', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Our Philosophy</h2>
            <p className="display-2" style={{ lineHeight: 1.3 }}>
              "The standard agency model is broken. We exist to build <span className="text-orange">enduring systems</span>, not disposable MVPs."
            </p>
          </div>

          {/* Mission & Vision Bento */}
          <div className="bento-grid reveal-up" style={{ marginBottom: '6rem' }}>
            <div className="bento-card" style={{ gridColumn: 'span 6', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="bento-content">
                <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-white)' }}>Mission</h3>
                <p className="text-grey" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                  To engineer scalable digital foundations that empower businesses to operate efficiently and grow without technical constraints.
                </p>
              </div>
            </div>
            
            <div className="bento-card" style={{ gridColumn: 'span 6', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="bento-content">
                <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-white)' }}>Vision</h3>
                <p className="text-grey" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                  To be the premier digital infrastructure partner in the Middle East, setting the standard for robust, enduring technology solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Why Bena Tech Grid */}
          <div className="reveal-up" style={{ marginBottom: '3rem' }}>
            <h2 className="display-2" style={{ marginBottom: '1rem' }}>Why Bena Tech.</h2>
          </div>

          <div className="bento-grid reveal-up">
            {[
              { title: "Launch is the beginning", desc: "We build systems designed to scale over years, anticipating future bottlenecks." },
              { title: "Technical depth", desc: "We understand how web, mobile, and automation interact to build cohesive ecosystems." },
              { title: "End-to-end partnership", desc: "We guide you through strategy, architecture, development, and scaled operation." },
              { title: "Globally minded", desc: "Deeply rooted in local market understanding, employing world-class engineering." }
            ].map((item, i) => (
              <div key={i} className="bento-card" style={{ gridColumn: 'span 6', padding: '3rem' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--border-color)', lineHeight: '0.8', letterSpacing: '-0.05em', marginBottom: '2rem' }}>
                  0{i + 1}
                </div>
                <div className="bento-content">
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--text-white)' }}>{item.title}</h3>
                  <p className="text-grey" style={{ fontSize: '1.1rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Services Section */}
      <section style={{ padding: '8rem 0' }}>
        <div className="container">
          <div className="reveal-up" style={{ marginBottom: '4rem' }}>
            <h2 className="display-2" style={{ marginBottom: '1rem' }}>Our Expertise.</h2>
            <p className="text-grey" style={{ fontSize: '1.2rem' }}>Comprehensive solutions for digital operations.</p>
          </div>

          <div className="bento-grid reveal-up">
            
            {/* Bento 1: Web */}
            <div className="bento-card" style={{ gridColumn: 'span 7', minHeight: '400px' }}>
              <div className="bento-image-wrap">
                <img src="/assets/bento_1.png" alt="Web Development" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)' }}></div>
              </div>
              <div className="bento-content">
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Web Architecture</h3>
                <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', maxWidth: '300px' }}>High-performance platforms and scalable commerce systems.</p>
              </div>
            </div>

            {/* Bento 2: Mobile */}
            <div className="bento-card" style={{ gridColumn: 'span 5', minHeight: '400px' }}>
              <div className="bento-image-wrap">
                <img src="/assets/benatech_mobile_1200x600.png" alt="Mobile Apps" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)' }}></div>
              </div>
              <div className="bento-content" style={{ justifyContent: 'flex-end' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Mobile Apps</h3>
                <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem' }}>Native experiences that users actually want to use.</p>
              </div>
            </div>

            {/* Bento 3: Automation */}
            <div className="bento-card" style={{ gridColumn: 'span 6', minHeight: '400px' }}>
              <div className="bento-image-wrap">
                <img src="/assets/bento_2.png" alt="Automation" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)' }}></div>
              </div>
              <div className="bento-content" style={{ justifyContent: 'flex-end' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Business Automation</h3>
                <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem' }}>Eliminate manual friction. We connect your tools and build custom pipelines to unlock growth.</p>
              </div>
            </div>

            {/* Bento 4: ERP */}
            <div className="bento-card" style={{ gridColumn: 'span 6', minHeight: '400px' }}>
              <div className="bento-image-wrap">
                <img src="/assets/benatech_erp_1200x600.png" alt="ERP Integration" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)' }}></div>
              </div>
              <div className="bento-content" style={{ justifyContent: 'flex-end' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Enterprise Resource Planning</h3>
                <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem' }}>Tailoring platforms (Odoo, ERPNext) to align with your business flows.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '4rem 0 5rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div>
            <p style={{ color: 'var(--text-grey)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Email us</p>
            <a href="mailto:info@bena-tech.com" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-white)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary-orange)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-white)'}>
              info@bena-tech.com
            </a>
          </div>

          <div>
            <p style={{ color: 'var(--text-grey)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>WhatsApp</p>
            <a href="https://wa.me/966502600558" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-white)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary-orange)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-white)'}>
              +966 50 260 0558
            </a>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
