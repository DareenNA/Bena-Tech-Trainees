import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    about: 'About',
    services: 'Services',
    book_meeting: 'Book Meeting',
    book_meeting_btn: 'Book a Meeting',
    our_services_btn: 'Our Services',

    // Booking Page - Left Pane
    book_meeting_title: 'Book a meeting.',
    book_meeting_desc: "Schedule a technical alignment with our architecture team. We don't do sales pitches, we architect solutions.",
    duration: 'Duration',
    duration_val: '2 Hours',
    email_us: 'Email us',
    whatsapp: 'WhatsApp',
    x_twitter: 'X (Twitter)',
    linkedin: 'LinkedIn',
    location: 'Location',
    location_val: 'Saudi Arabia, Jeddah',

    // Booking Page - Right Pane
    booking_confirmed: 'Booking Confirmed.',
    booking_confirmed_desc: 'Your meeting has been locked in for {date} at {time}. A Google Calendar invitation has been queued for your inbox.',
    schedule_another: 'Schedule Another Meeting',
    client_details: 'Client Details',
    first_name: 'First Name',
    last_name: 'Last Name',
    work_email: 'Work Email',
    additional_guests: 'Additional Guests',
    add_guest: '+ Add Guest',
    guest_name: 'Guest Name',
    guest_email: 'Guest Email',
    select_interest: 'Select Primary Interest...',
    web_dev: 'Web Development',
    business_auto: 'Business Automation',
    mobile_systems: 'Mobile Systems',
    erp: 'Enterprise Resource Planning',
    select_availability: 'Select Availability',
    loading_sessions: 'Loading open sessions...',
    no_dates_published: 'No available dates published at the moment. Please contact us directly at info@bena-tech.com.',
    confirm_schedule: 'Confirm Schedule',
    initiating: 'Initiating...',

    // Footer
    rights_reserved: 'All rights reserved.',

    // Home / Landing (Optional, but included for completeness)
    hero_title: 'We architect the digital infrastructure your business stands on.',
    hero_subtitle: 'From first idea to scaled operation. We build high-performance systems designed to endure.',
    philosophy_title: 'Our Philosophy',
    philosophy_quote: '"The standard agency model is broken. We exist to build enduring systems, not disposable MVPs."',
    mission: 'Mission',
    mission_desc: 'To engineer scalable digital foundations that empower businesses to operate efficiently and grow without technical constraints.',
    vision: 'Vision',
    vision_desc: 'To be the premier digital infrastructure partner in the Middle East, setting the standard for robust, enduring technology solutions.',
    why_benatech: 'Why Bena Tech.',
    why_1_title: 'Launch is the beginning',
    why_1_desc: 'We build systems designed to scale over years, anticipating future bottlenecks.',
    why_2_title: 'Technical depth',
    why_2_desc: 'We understand how web, mobile, and automation interact to build cohesive ecosystems.',
    why_3_title: 'End-to-end partnership',
    why_3_desc: 'We guide you through strategy, architecture, development, and scaled operation.',
    why_4_title: 'Globally minded',
    why_4_desc: 'Deeply rooted in local market understanding, employing world-class engineering.',
    our_expertise: 'Our Expertise.',
    expertise_subtitle: 'Comprehensive solutions for digital operations.',
    web_arch: 'Web Architecture',
    web_arch_desc: 'High-performance platforms and scalable commerce systems.',
    mobile_apps: 'Mobile Apps',
    mobile_apps_desc: 'Native experiences that users actually want to use.',
    bus_automation: 'Business Automation',
    bus_automation_desc: 'Eliminate manual friction. We connect your tools and build custom pipelines to unlock growth.',
    erp_desc: 'Tailoring enterprise platforms to align with your business flows.',
  },
  ar: {
    // Navbar
    about: 'عن الشركة',
    services: 'خدماتنا',
    book_meeting: 'حجز اجتماع',
    book_meeting_btn: 'احجز اجتماعاً',
    our_services_btn: 'خدماتنا',

    // Booking Page - Left Pane
    book_meeting_title: 'حجز اجتماع.',
    book_meeting_desc: 'جدول اجتماعاً للمواءمة الفنية مع فريق هندسة البرمجيات لدينا. نحن لا نقدم عروض مبيعات، بل نصمم حلولاً فنية.',
    duration: 'المدة',
    duration_val: 'ساعتان',
    email_us: 'راسلنا',
    whatsapp: 'واتساب',
    x_twitter: 'منصة X',
    linkedin: 'لينكد إن',
    location: 'الموقع',
    location_val: 'المملكة العربية السعودية، جدة',

    // Booking Page - Right Pane
    booking_confirmed: 'تم تأكيد الحجز.',
    booking_confirmed_desc: 'تم حجز موعدك بنجاح في {date} الساعة {time}. تم إرسال دعوة تقويم Google إلى بريدك الإلكتروني.',
    schedule_another: 'جدول اجتماعاً آخر',
    client_details: 'تفاصيل العميل',
    first_name: 'الاسم الأول',
    last_name: 'اسم العائلة',
    work_email: 'البريد الإلكتروني للعمل',
    additional_guests: 'ضيوف إضافيون',
    add_guest: '+ إضافة ضيف',
    guest_name: 'اسم الضيف',
    guest_email: 'البريد الإلكتروني للضيف',
    select_interest: 'اختر الاهتمام الرئيسي...',
    web_dev: 'تطوير الويب',
    business_auto: 'أتمتة الأعمال',
    mobile_systems: 'أنظمة الهاتف المحمول',
    erp: 'تخطيط موارد المؤسسات (ERP)',
    select_availability: 'اختر الموعد المتاح',
    loading_sessions: 'جاري تحميل الجلسات المتاحة...',
    no_dates_published: 'لا توجد مواعيد متاحة حالياً. يرجى التواصل معنا مباشرة عبر info@bena-tech.com.',
    confirm_schedule: 'تأكيد الحجز',
    initiating: 'جاري التأكيد...',

    // Footer
    rights_reserved: 'جميع الحقوق محفوظة.',

    // Home / Landing (Optional)
    hero_title: 'نحن نصمم البنية التحتية الرقمية التي ترتكز عليها أعمالك.',
    hero_subtitle: 'من الفكرة الأولى إلى التشغيل الموسع. نبني أنظمة عالية الأداء مصممة لتستمر.',
    philosophy_title: 'فلسفتنا',
    philosophy_quote: '"نموذج الوكالات التقليدي معيب. نحن متواجدون لبناء أنظمة مستدامة، وليس منتجات أولية قابلة للاستبدال."',
    mission: 'الرسالة',
    mission_desc: 'هندسة قواعد رقمية قابلة للتوسع تمكن الشركات من العمل بكفاءة والنمو دون قيود تقنية.',
    vision: 'الرؤية',
    vision_desc: 'أن نكون الشريك الرائد للبنية التحتية الرقمية في الشرق الأوسط، لنضع معايير الحلول التقنية القوية والمستدامة.',
    why_benatech: 'لماذا بينا تك.',
    why_1_title: 'الإطلاق هو البداية',
    why_1_desc: 'نبني أنظمة مصممة للتوسع عبر السنين، ونتوقع عقبات النمو المستقبلية.',
    why_2_title: 'العمق التقني',
    why_2_desc: 'نفهم كيف تتفاعل تطبيقات الويب، الهواتف المحمولة، والأتمتة لبناء أنظمة متكاملة.',
    why_3_title: 'شراكة متكاملة',
    why_3_desc: 'نرافقك عبر الإستراتيجية، والتصميم المعماري، والتطوير، والتشغيل الموسع.',
    why_4_title: 'رؤية عالمية',
    why_4_desc: 'جذورنا عميقة في فهم السوق المحلي، ونطبق هندسة برمجيات بمستويات عالمية.',
    our_expertise: 'خبراتنا.',
    expertise_subtitle: 'حلول شاملة للعمليات الرقمية.',
    web_arch: 'بنية الويب المعمارية',
    web_arch_desc: 'منصات عالية الأداء وأنظمة تجارة قابلة للتوسع.',
    mobile_apps: 'تطبيقات الهاتف المحمول',
    mobile_apps_desc: 'تجارب أصلية يرغب المستخدمون فعلياً في استخدامها.',
    bus_automation: 'أتمتة الأعمال',
    bus_automation_desc: 'تخلص من الاحتكاك اليدوي. نربط أدواتك ونبني مسارات مخصصة لتحرير النمو.',
    erp_desc: 'تطويع المنصات المؤسسية لتتوافق مع تدفقات أعمالك.',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const match = document.cookie.match(/(?:^|; )language=([^;]*)/);
    const cookieLang = match ? match[1] : null;
    return cookieLang || localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Write cookie for subdomain sharing (works for both bena-tech.com and bookingg.bena-tech.com)
    const hostname = window.location.hostname;
    if (hostname.includes('bena-tech.com')) {
      document.cookie = `language=${language}; path=/; domain=.bena-tech.com; max-age=31536000; SameSite=Lax; Secure`;
    } else {
      document.cookie = `language=${language}; path=/; max-age=31536000; SameSite=Lax`;
    }

    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key, replacements = {}) => {
    let text = translations[language]?.[key] || translations['en']?.[key] || key;
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
