import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Minus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ExpandableRow = ({ title, desc }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '1.3rem', fontWeight: 500, color: isOpen ? 'var(--primary-orange)' : 'var(--text-white)', transition: 'color 0.3s' }}>{title}</h4>
        {isOpen ? <Minus size={20} className="text-orange" /> : <Plus size={20} className="text-grey" />}
      </div>
      <div style={{ 
        maxHeight: isOpen ? '150px' : '0', 
        overflow: 'hidden', 
        transition: 'max-height 0.4s ease, opacity 0.4s ease',
        opacity: isOpen ? 1 : 0,
        paddingTop: isOpen ? '1rem' : '0'
      }}>
        <p className="text-grey" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  );
};

const Services = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-up', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '10rem' }}>
      <div className="ambient-light"></div>
      
      <div className="container">
        <div className="reveal-up" style={{ marginBottom: '6rem' }}>
          <h1 className="display-1" style={{ marginBottom: '1.5rem' }}>Services</h1>
          <p className="text-grey" style={{ fontSize: '1.25rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Comprehensive foundations for complete digital operations. We don't just write code; we architect systems.
          </p>
        </div>

        {/* Services Bento Layout */}
        <div className="bento-grid reveal-up">
          
          {/* Web Development */}
          <div className="bento-card" style={{ gridColumn: 'span 12', padding: '4rem' }}>
             <div className="grid md:grid-cols-2 gap-3">
               <div>
                  <div className="bento-image-wrap" style={{ position: 'relative', height: '400px', borderRadius: '16px', marginBottom: '2rem', overflow: 'hidden' }}>
                  <img src="/assets/benatech_web_1200x600.png" alt="Web Architecture" style={{ opacity: 0.8 }} />
                  </div>
                  <h2 className="display-2" style={{ marginBottom: '1rem' }}>Web Development</h2>
                  <p className="text-grey" style={{ fontSize: '1.1rem' }}>Websites built to perform and endure.</p>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <ExpandableRow title="Informational Platform" desc="Clean, fast, and optimized for conversion and discovery." />
                  <ExpandableRow title="Basic Commerce" desc="Start selling online with a streamlined foundation." />
                  <ExpandableRow title="Advanced Architecture" desc="Custom features, integrations, and high scalability." />
               </div>
             </div>
          </div>

          {/* Automation */}
          <div className="bento-card" style={{ gridColumn: 'span 12', padding: '4rem' }}>
             <div className="grid md:grid-cols-2 gap-3" style={{ direction: 'rtl' }}>
               <div style={{ direction: 'ltr' }}>
                  <div className="bento-image-wrap" style={{ position: 'relative', height: '400px', borderRadius: '16px', marginBottom: '2rem', overflow: 'hidden' }}>
                  <img src="/assets/benatech_automation_1200x600.png" alt="Automation" style={{ opacity: 0.8 }} />
                  </div>
                  <h2 className="display-2" style={{ marginBottom: '1rem' }}>Business Automation</h2>
                  <p className="text-grey" style={{ fontSize: '1.1rem' }}>Eliminate repetition, unlock growth.</p>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', direction: 'ltr' }}>
                  <ExpandableRow title="Workflow Integration" desc="Connecting systems to save manual work and data entry." />
                  <ExpandableRow title="Data Pipelines" desc="CRM integrations, custom reports, and routing." />
                  <ExpandableRow title="Enterprise Architecture" desc="Large-scale enterprise systems and complete overhauls." />
               </div>
             </div>
          </div>

          {/* Mobile */}
          <div className="bento-card" style={{ gridColumn: 'span 12', padding: '4rem' }}>
             <div className="grid md:grid-cols-2 gap-3">
               <div>
                  <div className="bento-image-wrap" style={{ position: 'relative', height: '400px', borderRadius: '16px', marginBottom: '2rem', overflow: 'hidden' }}>
                  <img src="/assets/benatech_mobile_1200x600.png" alt="Mobile" style={{ opacity: 0.8 }} />
                  </div>
                  <h2 className="display-2" style={{ marginBottom: '1rem' }}>Mobile Systems</h2>
                  <p className="text-grey" style={{ fontSize: '1.1rem' }}>Native experiences people actually use.</p>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <ExpandableRow title="Web Applications" desc="Progressive web apps accessible anywhere, perfectly responsive." />
                  <ExpandableRow title="Native Experience" desc="Native iOS & Android development using modern frameworks." />
                  <ExpandableRow title="Full Ecosystem" desc="Mobile app coupled with a robust admin dashboard." />
               </div>
             </div>
          </div>

          {/* Enterprise Resource Planning */}
          <div className="bento-card" style={{ gridColumn: 'span 12', padding: '4rem' }}>
             <div className="grid md:grid-cols-2 gap-3" style={{ direction: 'rtl' }}>
               <div style={{ direction: 'ltr' }}>
                  <div className="bento-image-wrap" style={{ position: 'relative', height: '400px', borderRadius: '16px', marginBottom: '2rem', overflow: 'hidden' }}>
                  <img src="/assets/benatech_erp_1200x600.png" alt="ERP Integration" style={{ opacity: 0.8 }} />
                  </div>
                  <h2 className="display-2" style={{ marginBottom: '1rem' }}>Enterprise Resource Planning</h2>
                  <p className="text-grey" style={{ fontSize: '1.1rem' }}>Connected enterprise systems that streamline workflows.</p>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', direction: 'ltr' }}>
                  <ExpandableRow title="ERP Implementation & Customization" desc="Tailoring platforms (Odoo, ERPNext, SAP) to align with your proprietary business flows." />
                  <ExpandableRow title="Custom Module Development" desc="Creating bespoke modules, inventory trackers, reporting engines, and specific APIs." />
                  <ExpandableRow title="Data Migration & Maintenance" desc="Ensuring secure database migration, schema alignment, system integrity, and ongoing support." />
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Services;
