import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, ArrowDown, Coffee, Briefcase, Globe, Send, Award } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Custom BenaLogo component pointing to the official logo.png
const BenaLogo = ({ size = 28, className = "" }) => (
  <img 
    src="/logo.png" 
    alt="BENA TECH" 
    className={className} 
    style={{ 
      height: `${size}px`, 
      objectFit: 'contain',
      display: 'inline-block'
    }} 
  />
);

const RocketSVG = ({ className = "", size = 64 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-orange)' }}>
    <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5" />
    <path d="M12 2C7.5 2 4 5.5 4 10c0 1.25.75 2.5 1.5 3.5l1.5-1.5C6.5 11 6 10 6 9c0-3.3 2.7-6 6-6 1 0 2 .5 3 1l1.5-1.5C14.5 2.75 13.25 2 12 2z" />
    <path d="M12 2c4.5 0 8 3.5 8 8 0 1.25-.75 2.5-1.5 3.5l-1.5-1.5c.5-1 1-2 1-3 0-3.3-2.7-6-6-6-1 0-2 .5-3 1L7.5 2.5C8.75 2.75 10 2 12 2z" />
    <path d="M9 15c.5.5 1.5 1 2.5 1H13c1 0 2-.5 2.5-1l-3.25-3.25L9 15z" />
    <path d="M15 9c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" fill="currentColor" />
  </svg>
);

const AbstractTechCircles = () => (
  <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {/* Outer dashed spinning ring */}
    <div className="spin-slow" style={{
      position: 'absolute',
      inset: 0,
      border: '2px dashed rgba(231,73,4,0.18)',
      borderRadius: '50%',
      pointerEvents: 'none'
    }}></div>
    {/* Middle reverse spin ring */}
    <div className="spin-slow-reverse" style={{
      position: 'absolute',
      inset: '25px',
      border: '1px solid rgba(255,255,255,0.04)',
      borderRadius: '50%',
      pointerEvents: 'none'
    }}></div>
    {/* Inner fast spin ring */}
    <div className="spin-medium" style={{
      position: 'absolute',
      inset: '50px',
      border: '2px dashed rgba(231,73,4,0.3)',
      borderRadius: '50%',
      pointerEvents: 'none'
    }}></div>
    {/* Core glowing orb */}
    <div className="pulse-glow" style={{
      position: 'absolute',
      inset: '70px',
      background: 'radial-gradient(circle, var(--primary-orange) 0%, transparent 75%)',
      borderRadius: '50%',
      filter: 'blur(3px)',
      opacity: 0.95
    }}></div>
  </div>
);

const Story = () => {
  const pageRef = useRef(null);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);
  const rocketRef = useRef(null);

  // Scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1a. Animate Cover Section immediately on mount
      const coverReveals = document.querySelectorAll('#cover-section .animate-reveal');
      if (coverReveals.length > 0) {
        gsap.fromTo(coverReveals,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
        );
      }

      // 1b. Reveal animations for headers and content across other sections on scroll
      const sections = gsap.utils.toArray('.story-section').filter(sec => sec.id !== 'cover-section');
      sections.forEach((section) => {
        const reveals = section.querySelectorAll('.animate-reveal');
        if (reveals.length > 0) {
          gsap.fromTo(reveals, 
            { y: 40, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.8, 
              stagger: 0.15, 
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });

      // 2. Scroll-driven timeline line drawing
      if (timelineRef.current && lineRef.current) {
        gsap.fromTo(lineRef.current,
          { height: 0 },
          {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 55%',
              end: 'bottom 65%',
              scrub: true
            }
          }
        );
      }

      // 3. Staggered timeline node pops
      const nodes = gsap.utils.toArray('.timeline-node-item');
      nodes.forEach((node) => {
        gsap.fromTo(node.querySelector('.timeline-circle'),
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: node,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        gsap.fromTo(node.querySelector('.timeline-text'),
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // 4. Floating rocket lift-off effect
      if (rocketRef.current) {
        gsap.fromTo(rocketRef.current,
          { y: 85, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#chapter-4-section',
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="story-page" dir="rtl" style={{
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: 'Cairo, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* ==========================================
          DRIFTING ORBS BACKGROUND (STRIPE AESTHETIC)
          ========================================== */}
      <div className="glow-orb-drift-1" style={{
        position: 'absolute',
        width: '280px',
        height: '280px',
        top: '5%',
        right: '5%',
        background: 'radial-gradient(circle, rgba(231,73,4,0.07) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(30px)'
      }}></div>

      <div className="glow-orb-drift-2" style={{
        position: 'absolute',
        width: '320px',
        height: '320px',
        top: '30%',
        left: '2%',
        background: 'radial-gradient(circle, rgba(147,51,234,0.04) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(40px)'
      }}></div>

      <div className="glow-orb-drift-1" style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        bottom: '15%',
        right: '10%',
        background: 'radial-gradient(circle, rgba(231,73,4,0.05) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(35px)'
      }}></div>

      {/* Top Fixed Header */}
      <header style={{
        padding: '1rem 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
        pointerEvents: 'none'
      }}>
        <div />
        <div style={{ pointerEvents: 'auto' }}>
          <BenaLogo size={36} />
        </div>
      </header>

      {/* ==========================================
          VERTICAL SCROLL STORY SECTIONS
          ========================================== */}

      {/* 0. ACCEPTANCE CONGRATULATIONS LANDING PAGE */}
      <section id="cover-section" className="story-section" style={{ overflow: 'hidden', position: 'relative', textAlign: 'center' }}>
        {/* Confetti Background Particles */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
          {Array.from({ length: 32 }).map((_, idx) => {
            const colors = ['#e74904', '#FFD700', '#9333EA', '#3B82F6', '#10B981', '#FF6B6B'];
            const randomColor = colors[idx % colors.length];
            const randomLeft = `${(idx * 6.5) % 100}%`;
            const randomDelay = `${(idx * 0.22) % 5}s`;
            const randomDuration = `${4.5 + ((idx * 0.35) % 3.5)}s`;
            const randomSize = `${6 + (idx % 6)}px`;
            
            return (
              <div 
                key={idx}
                className="confetti-piece"
                style={{
                  left: randomLeft,
                  backgroundColor: randomColor,
                  width: randomSize,
                  height: randomSize,
                  animationDelay: randomDelay,
                  animationDuration: randomDuration,
                  borderRadius: idx % 2 === 0 ? '50%' : '2px'
                }}
              />
            );
          })}
        </div>

        <div className="glass-card animate-reveal" style={{ 
          maxWidth: '900px', 
          textAlign: 'center', 
          border: '1px solid rgba(231,73,4,0.3)',
          boxShadow: '0 30px 60px rgba(231,73,4,0.08), 0 0 40px rgba(231,73,4,0.04)',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div className="animate-float" style={{ fontSize: '3.5rem', marginBottom: '0.2rem' }}>
            🎉 🥳 🎉
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5.5vw, 3.4rem)', 
            fontWeight: 800, 
            margin: 0,
            background: 'linear-gradient(135deg, #FFD700 0%, #e74904 50%, #9333EA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.25
          }}>
            ألف مبروك القبول!
          </h1>
          <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--primary-orange)', borderRadius: '2px' }}></div>

          <p style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)', color: 'var(--text-white)', lineHeight: '1.8', margin: 0, fontWeight: 600 }}>
            بمناسبة قبولك وانضمامك لبرنامج التدريب في BENA TECH.
          </p>

          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', color: 'var(--text-grey)', lineHeight: '1.8', margin: 0 }}>
            نهنئك من القلب على اختيارك لتكون جزءاً من فريقنا. سعيدون جداً بشغفك وطموحك، ومتحمسون للعمل والتعلم والنمو معاً في هذه الرحلة.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 28px',
            background: 'rgba(255,215,0,0.08)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '100px',
            color: '#FFD700',
            fontSize: 'clamp(1.05rem, 3vw, 1.2rem)',
            fontWeight: 700,
            boxShadow: '0 10px 20px rgba(255,215,0,0.05)',
            margin: '0.5rem 0'
          }}>
            <span>✨ مرحبًا بك في الجيل الأول لـ BENA TECH ✨</span>
          </div>

          <div className="animate-float" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-grey)', fontSize: '0.85rem', marginTop: '1rem' }}>
            <span>اسحب للأسفل لتكتشف قصة عائلتك الجديدة</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(231,73,4,0.06)',
              border: '1px solid rgba(231,73,4,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '5px'
            }}>
              <ArrowDown size={16} style={{ color: 'var(--primary-orange)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* 1. COVER SECTION */}
      <section className="story-section" style={{ textAlign: 'center' }}>
        <div className="glass-card animate-reveal" style={{
          maxWidth: '850px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.2rem'
        }}>
          <h2 style={{
            fontSize: 'clamp(2.3rem, 7vw, 4rem)',
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            background: 'linear-gradient(135deg, #ffffff 0%, #a1a1a1 50%, #e74904 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            قصة BENA
          </h2>
          <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--primary-orange)', borderRadius: '2px' }}></div>
          
          <p style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)', color: 'var(--text-grey)', margin: 0, lineHeight: 1.6 }}>
            لكل شركة قصة بداية... خلنا نبدأ.
          </p>

          <span className="text-orange" style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', fontWeight: 600, letterSpacing: '0.02em' }}>
            »بسم الله رب البدايات.«
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.95 }}>
            <p style={{ fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontWeight: 700, margin: 0, color: 'var(--text-white)' }}>كان يا ما كان...</p>
            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: 'var(--text-grey)', margin: 0 }}>لا لا، مو قديم الزمان، قبل حوالي 5 شهور فقط. 😄</p>
          </div>
        </div>
      </section>

      {/* 2. HOW IT STARTED */}
      <section className="story-section">
        <div className="glass-card animate-reveal" style={{ maxWidth: '1000px' }}>
          <div className="story-grid two-cols-12-08">
            {/* Narrative Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, margin: 0 }}>كيف بدأت BENA؟</h2>
                <span style={{ fontSize: '1.3rem', color: 'var(--primary-orange)', fontWeight: 700 }}>01</span>
              </div>
              <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--primary-orange)' }}></div>
              
              <h3 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)', fontWeight: 700, color: 'var(--text-white)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                بدأت فكرة BENA.
              </h3>

              <p style={{ fontSize: 'clamp(1.05rem, 3vw, 1.2rem)', color: 'var(--text-grey)', lineHeight: '1.8', margin: 0 }}>
                بدأت بإيمان أن التقنية تقدر تصنع فرقًا كبيرًا وحقيقيًا في أي مجال.
              </p>

              <p style={{ fontSize: 'clamp(1.05rem, 3vw, 1.2rem)', color: 'var(--text-grey)', lineHeight: '1.8', margin: 0 }}>
                بدأنا، ولا زلنا، بدون مقر (ونقول: يا رب قريبًا).
              </p>

              <p style={{ fontSize: 'clamp(1.05rem, 3vw, 1.2rem)', color: 'var(--text-grey)', lineHeight: '1.8', margin: 0 }}>
                بدأنا ومعانا الإيمان بالله سبحانه وتعالى، والطموح، والرؤية، والرغبة في بناء شيء نفتخر فيه مستقبلاً بإذن الله.
              </p>
            </div>

            {/* Abstract Spinning Ring visualizer */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AbstractTechCircles />
            </div>
          </div>
        </div>
      </section>

      {/* 3. TIMELINE (FROM IDEA TO REALITY) */}
      <section className="story-section">
        <div className="glass-card animate-reveal" style={{ maxWidth: '1000px', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, margin: 0 }}>من فكرة إلى حقيقة</h2>
            <span style={{ fontSize: '1.3rem', color: 'var(--primary-orange)', fontWeight: 700 }}>02</span>
          </div>
          <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--primary-orange)', marginBottom: '1.5rem' }}></div>

          <p style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.25rem)', color: 'var(--text-grey)', margin: 0, lineHeight: 1.6 }}>
            يعني رحلتنا كانت من فكرة إلى خطوات بدأناها.
          </p>
          <p style={{ fontSize: 'clamp(1.05rem, 3vw, 1.2rem)', fontWeight: 600, color: 'var(--primary-orange)', margin: '1rem 0 2rem 0' }}>
            طيب، وش كانت الخطوات؟
          </p>

          {/* Timeline Components */}
          <div ref={timelineRef} className="timeline-container">
            <div className="timeline-line-track">
              <div ref={lineRef} style={{ width: '100%', height: 0, backgroundColor: 'var(--primary-orange)' }}></div>
            </div>

            {[
              { text: "أولاً: كوب V60 قوووووي! ☕", icon: Coffee },
              { text: "التخطيط لهيكل الشركة والبحث عن الامور القانونية.", icon: Briefcase },
              { text: "وبعدها إصدار السجل التجاري.", icon: Award },
              { text: "وأطلقنا موقعنا الرسمي.", icon: Globe },
              { text: "وفتحنا حساباتنا في منصات التواصل الاجتماعي.", icon: Send }
            ].map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="timeline-node-item">
                  
                  {/* Circle Indicator */}
                  <div className="timeline-circle" style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    border: '3px solid var(--primary-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-orange)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>

                  {/* Glassmorphic step card */}
                  <div className="timeline-text">
                    <IconComponent size={22} style={{ color: 'var(--primary-orange)', flexShrink: 0 }} />
                    <span style={{ fontSize: 'clamp(1rem, 3.2vw, 1.2rem)', color: 'var(--text-white)', fontWeight: 500, lineHeight: 1.4 }}>{step.text}</span>
                  </div>

                </div>
              );
            })}
          </div>

          <p style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', marginTop: '2.5rem', lineHeight: '1.7' }}>
            وهنا نقدر نقول: »BENA TECH أصبحت حقيقة... <span style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>يا رب لك الحمد</span>.«
          </p>
        </div>
      </section>

      {/* 4. HOW COMPANIES ARE BUILT */}
      <section className="story-section">
        <div className="glass-card animate-reveal" style={{ maxWidth: '1000px' }}>
          <div className="story-grid two-cols-11-09">
            {/* Narrative content right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, margin: 0 }}>كيف تُبنى الشركات؟</h2>
                <span style={{ fontSize: '1.3rem', color: 'var(--primary-orange)', fontWeight: 700 }}>03</span>
              </div>
              <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--primary-orange)' }}></div>

              <p style={{ fontSize: '1.2rem', color: 'var(--text-grey)', margin: 0, opacity: 0.8 }}>
                لكن خلنا نكون صريحين...
              </p>

              <h3 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 700, color: 'var(--primary-orange)', marginTop: '0.2rem' }}>
                الشركات ما تُبنى بالمؤسسين فقط.
              </h3>

              <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', color: 'var(--text-white)', lineHeight: '1.7', margin: 0 }}>
                تُبنى بأشخاص مؤمنين بالشركة. مؤمنين بالفكرة.
              </p>

              <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', color: 'var(--text-grey)', lineHeight: '1.7', margin: 0 }}>
                يسعون لتطوير أنفسهم، وفي نفس الوقت يسعون لتطوير الشركة.
              </p>
            </div>

            {/* Large Quote box left */}
            <div style={{
              padding: '2rem 1.5rem',
              background: 'rgba(231, 73, 4, 0.02)',
              borderRight: '4px solid var(--primary-orange)',
              borderLeft: '1px solid rgba(255,255,255,0.03)',
              borderTop: '1px solid rgba(255,255,255,0.03)',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '16px',
              textAlign: 'right',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <span style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '4rem', color: 'rgba(231,73,4,0.1)', fontFamily: 'Cairo', lineHeight: 0.1 }}>“</span>
              <p style={{
                fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)',
                fontWeight: 600,
                lineHeight: '1.8',
                color: 'var(--text-white)',
                margin: 0,
                position: 'relative',
                zIndex: 2
              }}>
                »لن تنال حتى <span style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>تستحق</span>،<br />
                ولن تستحق حتى <span style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>تسعى</span>.«
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HERE WE REACHED YOU */}
      <section id="chapter-4-section" className="story-section">
        <div className="glass-card animate-reveal" style={{ maxWidth: '1000px' }}>
          <div className="story-grid two-cols-12-08">
            {/* Narratives Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, margin: 0 }}>وهنا وصلنا إليك...</h2>
                <span style={{ fontSize: '1.3rem', color: 'var(--primary-orange)', fontWeight: 700 }}>04</span>
              </div>
              <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--primary-orange)' }}></div>

              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                {["يا مميز.", "يا قوي.", "يا مبدع."].map((badge, idx) => (
                  <span key={idx} style={{
                    padding: '8px 18px',
                    borderRadius: '100px',
                    background: idx === 2 ? 'rgba(231, 73, 4, 0.12)' : 'rgba(255,255,255,0.02)',
                    border: idx === 2 ? '1px solid var(--primary-orange)' : '1px solid var(--border-color)',
                    color: idx === 2 ? 'var(--primary-orange)' : 'var(--text-white)',
                    fontWeight: 700,
                    fontSize: 'clamp(0.95rem, 2.8vw, 1.15rem)',
                    boxShadow: idx === 2 ? '0 10px 20px rgba(231,73,4,0.05)' : 'none'
                  }}>
                    {badge}
                  </span>
                ))}
              </div>

              <p style={{ fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', color: 'var(--text-grey)', lineHeight: '1.8', margin: 0 }}>
                شفنا فيك الحماس، وشفنا فيك الشغف، ولسه متأكدين إننا بنشوف أكثر وأكثر.
              </p>

              <p style={{ fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', color: 'var(--text-grey)', lineHeight: '1.8', margin: 0 }}>
                لأننا مؤمنين إن كل إنسان عنده الكثير من المميزات، لكنها تظهر في الوقت المناسب.
              </p>

              <p style={{ fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', color: 'var(--text-grey)', lineHeight: '1.8', margin: 0 }}>
                وعشان كذا اخترناك... عشان نتميز أكثر مع بعض، إن شاء الله.
              </p>

              <div style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                fontWeight: 700,
                color: 'var(--primary-orange)',
                marginTop: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>فشد الحزام... وخلنا نقلع سوا إلى القمة. 🚀</span>
              </div>
            </div>

            {/* Floating Rocket columns with SVG exhaust effects */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              {/* Rocket aura background */}
              <div className="pulse-glow" style={{
                position: 'absolute',
                width: '160px',
                height: '160px',
                background: 'radial-gradient(circle, rgba(231,73,4,0.15) 0%, transparent 70%)',
                zIndex: 0,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}></div>

              <div ref={rocketRef} className="animate-float" style={{
                background: 'rgba(10, 10, 10, 0.4)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '50%',
                width: '150px',
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                zIndex: 2,
                backdropFilter: 'blur(10px)'
              }}>
                <RocketSVG size={70} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE FIRST GENERATION CLOSING */}
      <section className="story-section">
        <div className="glass-card animate-reveal" style={{ maxWidth: '1000px', textAlign: 'right' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            الجيل الأول
          </h2>
          <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--primary-orange)' }}></div>

          <p style={{ fontSize: 'clamp(1.1rem, 3.2vw, 1.25rem)', color: 'var(--text-grey)', lineHeight: '1.8', margin: '1.5rem 0 0 0' }}>
            يمكن إن BENA اليوم لا تزال في بدايتها...
          </p>

          <p style={{ fontSize: 'clamp(1.1rem, 3.2vw, 1.25rem)', color: 'var(--text-grey)', lineHeight: '1.8', margin: '1rem 0 0 0' }}>
            لكن بعد أيام، أو شهور، أو سنوات بإذن الله، لما تكبر وتصبح أكبر بكثير مما هي عليه اليوم...
          </p>

          <p style={{ fontSize: 'clamp(1.2rem, 3.8vw, 1.45rem)', color: 'var(--text-white)', lineHeight: '1.8', margin: '1.5rem 0' }}>
            بتقدر تلتفت وتقول بكل فخر:<br />
            »<span style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>كنت من الجيل الأول</span> في BENA TECH.«
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-orange)', letterSpacing: '0.05em' }}>
              JULY 2026 | THE FIRST GENERATION
            </div>
            <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <BenaLogo size={36} />
              <a 
                href="/bena_tech_training_agreement.pdf" 
                download="bena_tech_training_agreement.pdf"
                className="btn btn-primary"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  fontSize: '1.05rem', 
                  padding: '0.8rem 2.2rem',
                  textDecoration: 'none',
                  borderRadius: '100px',
                  boxShadow: '0 10px 25px rgba(231,73,4,0.15)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(231,73,4,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(231,73,4,0.15)';
                }}
              >
                <Download size={20} />
                <span>تحميل اتفاقية التدريب (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Story;
