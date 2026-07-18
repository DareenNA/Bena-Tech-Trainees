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

    // Contact / Socials
    email_us: 'Email us',
    whatsapp: 'WhatsApp',
    x_twitter: 'X (Twitter)',
    linkedin: 'LinkedIn',
    location: 'Location',
    location_val: 'Saudi Arabia, Jeddah',
    cr_number: 'C.R.',

    // Footer
    rights_reserved: 'All rights reserved.',

    // Home / Landing
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
    erp: 'Enterprise Resource Planning',
    erp_desc: 'Tailoring enterprise platforms to align with your business flows.',

    // Services Page
    services_title: 'Services',
    services_subtitle: 'Comprehensive foundations for complete digital operations. We don\'t just write code; we architect systems.',
    web_dev_title: 'Web Development',
    web_dev_subtitle: 'Websites built to perform and endure.',
    info_platform: 'Informational Platform',
    info_platform_desc: 'Clean, fast, and optimized for conversion and discovery.',
    basic_commerce: 'Basic Commerce',
    basic_commerce_desc: 'Start selling online with a streamlined foundation.',
    adv_architecture: 'Advanced Architecture',
    adv_architecture_desc: 'Custom features, integrations, and high scalability.',
    bus_auto_subtitle: 'Eliminate repetition, unlock growth.',
    workflow_int: 'Workflow Integration',
    workflow_int_desc: 'Connecting systems to save manual work and data entry.',
    data_pipelines: 'Data Pipelines',
    data_pipelines_desc: 'CRM integrations, custom reports, and routing.',
    ent_architecture: 'Enterprise Architecture',
    ent_architecture_desc: 'Large-scale enterprise systems and complete overhauls.',
    mobile_sys: 'Mobile Systems',
    mobile_sys_subtitle: 'Native experiences people actually use.',
    web_apps: 'Web Applications',
    web_apps_desc: 'Progressive web apps accessible anywhere, perfectly responsive.',
    native_exp: 'Native Experience',
    native_exp_desc: 'Native iOS & Android development using modern frameworks.',
    full_ecosystem: 'Full Ecosystem',
    full_ecosystem_desc: 'Mobile app coupled with a robust admin dashboard.',
    erp_subtitle: 'Connected enterprise systems that streamline workflows.',
    erp_impl: 'ERP Implementation & Customization',
    erp_impl_desc: 'Tailoring enterprise platforms to align with your proprietary business flows.',
    custom_module: 'Custom Module Development',
    custom_module_desc: 'Creating bespoke modules, inventory trackers, reporting engines, and specific APIs.',
    data_migration: 'Data Migration & Maintenance',
    data_migration_desc: 'Ensuring secure database migration, schema alignment, system integrity, and ongoing support.',
    
    // Onboarding Story
    story_menu: 'BENA Story',
    story_title: 'BENA Story',
    story_intro_1: 'Every company has a beginning story... Let us begin.',
    story_intro_2: '»In the name of God, Lord of beginnings.«',
    story_intro_3: 'Once upon a time...',
    story_intro_4: 'No, no, not long ago, just about 5 months ago. 😊',
    story_q1: 'How did BENA start?',
    story_q1_p1: 'The BENA idea started.',
    story_q1_p2: 'It started with a belief that technology can make a big and real difference in any field.',
    story_q1_p3: 'We started, and we still are, without a headquarters (and we say: O Lord, soon!).',
    story_q1_p4: 'We started with faith in God Almighty, ambition, vision, and the desire to build something we will be proud of in the future, God willing.',
    story_q2: 'From idea to reality',
    story_q2_p1: 'Meaning our journey was from an idea to steps we initiated.',
    story_q2_p2: 'So, what were the steps?',
    story_q2_step1: 'First: A very strong V60 cup! ☕',
    story_q2_step2: 'We built the company structure and finished the legal matters.',
    story_q2_step3: 'We launched our website.',
    story_q2_step4: 'And we opened our accounts on social media platforms.',
    story_q2_p3: 'And here we can say: »BENA TECH became a reality... Praise be to God.«',
    story_q3: 'How are companies built?',
    story_q3_p1: 'But let us be honest...',
    story_q3_p2: 'Companies are not built by founders only.',
    story_q3_p3: 'They are built by people who believe in the company. Who believe in the idea.',
    story_q3_p4: 'They strive to develop themselves, and at the same time strive to develop the company.',
    story_q3_quote: '»You will not attain until you deserve, and you will not deserve until you strive.«',
    story_q4: 'And here we reached you...',
    story_q4_title1: 'O distinguished one.',
    story_q4_title2: 'O strong one.',
    story_q4_title3: 'O creative one.',
    story_q4_p1: 'We saw the enthusiasm in you, and we saw the passion in you, and we are still sure that we will see more and more.',
    story_q4_p2: 'Because we believe that every human being has many advantages, but they appear at the right time.',
    story_q4_p3: 'And that is why we chose you... to excel more together, God willing.',
    story_q4_p4: 'So fasten your seatbelt... and let us take off together to the top. 🚀',
    story_q5_title: 'Welcome to BENA TECH',
    story_q5_name: 'Name',
    story_q5_position: 'Training Title / Position',
    story_q5_id: 'Employee ID',
    story_q5_status: 'Member of the First Generation of BENA TECH',
    story_q6_title: 'The First Generation',
    story_q6_p1: 'Maybe BENA today is still in its beginnings...',
    story_q6_p2: 'But after days, months, or years, God willing, when it grows and becomes much larger than it is today...',
    story_q6_p3: 'You will be able to look back and say with all pride:',
    story_q6_p4: '»I was of the First Generation in BENA TECH.«',
    story_q6_download: 'Download Training Agreement'
  },
  ar: {
    // Navbar
    about: 'عن الشركة',
    services: 'خدماتنا',
    book_meeting: 'حجز اجتماع',
    book_meeting_btn: 'احجز اجتماعاً',
    our_services_btn: 'خدماتنا',

    // Contact / Socials
    email_us: 'راسلنا',
    whatsapp: 'واتساب',
    x_twitter: 'منصة X',
    linkedin: 'لينكد إن',
    location: 'الموقع',
    location_val: 'المملكة العربية السعودية، جدة',
    cr_number: 'سجل تجاري',

    // Footer
    rights_reserved: 'جميع الحقوق محفوظة.',

    // Home / Landing
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
    mobile_apps: 'تطبيقات الهاتف المحمول', // Note: mobile apps translation below fixes typo
    mobile_apps_desc: 'تجارب أصلية يرغب المستخدمون فعلياً في استخدامها.',
    bus_automation: 'أتمتة الأعمال',
    bus_automation_desc: 'تخلص من الاحتكاك اليدوي. نربط أدواتك ونبني مسارات مخصصة لتحرير النمو.',
    erp: 'تخطيط موارد المؤسسات (ERP)',
    erp_desc: 'تطويع المنصات المؤسسية لتتوافق مع تدفقات أعمالك.',

    // Services Page
    services_title: 'الخدمات',
    services_subtitle: 'أسس شاملة لعمليات رقمية متكاملة. نحن لا نكتفي بكتابة الكود؛ بل نصمم الأنظمة البرمجية.',
    web_dev_title: 'تطوير الويب',
    web_dev_subtitle: 'مواقع ويب مصممة للأداء والاستدامة.',
    info_platform: 'منصات تعريفية',
    info_platform_desc: 'نظيفة، سريعة، ومحسنة لتسهيل التحويل والظهور.',
    basic_commerce: 'تجارة إلكترونية مبسطة',
    basic_commerce_desc: 'ابدأ البيع عبر الإنترنت بأسس عمل مبسطة.',
    adv_architecture: 'بنية معمارية متقدمة',
    adv_architecture_desc: 'ميزات مخصصة، وتكامل بين الأنظمة، وقابلية توسع عالية.',
    bus_auto_subtitle: 'تخلص من التكرار وحرّر النمو.',
    workflow_int: 'تكامل سير العمل',
    workflow_int_desc: 'ربط الأنظمة لتوفير العمل اليدوي وإدخال البيانات.',
    data_pipelines: 'مسارات البيانات',
    data_pipelines_desc: 'تكامل إدارة علاقات العملاء (CRM)، تقارير مخصصة، وتوجيه البيانات.',
    ent_architecture: 'بنية المؤسسات المعمارية',
    ent_architecture_desc: 'أنظمة مؤسسية واسعة النطاق وإعادة هيكلة برمجية شاملة.',
    mobile_sys: 'أنظمة الهاتف المحمول',
    mobile_sys_subtitle: 'تجارب أصلية يرغب الناس فعلياً في استخدامها.',
    web_apps: 'تطبيقات الويب',
    web_apps_desc: 'تطبيقات ويب تقدمية يمكن الوصول إليها من أي مكان، وتستجيب للشاشات بامتياز.',
    native_exp: 'تجربة أصلية',
    native_exp_desc: 'تطوير أصيل لنظامي iOS وAndroid باستخدام أطر عمل حديثة.',
    full_ecosystem: 'منظومة متكاملة',
    full_ecosystem_desc: 'تطبيق هاتف محمول مقترن بلوحة تحكم إدارية قوية.',
    erp_subtitle: 'أنظمة مؤسسية مترابطة تسهل تدفقات العمل.',
    erp_impl: 'تطبيق وتطويع نظام الـ ERP',
    erp_impl_desc: 'تطويع المنصات المؤسسية لتتوافق مع تدفقات أعمالك الخاصة.',
    custom_module: 'تطوير وحدات مخصصة',
    custom_module_desc: 'إنشاء وحدات برمجية مخصصة، وتتبع المخزون، ومحركات التقارير، وواجهات برمجة التطبيقات الخاصة.',
    data_migration: 'نقل البيانات والصيانة',
    data_migration_desc: 'ضمان نقل قواعد البيانات بأمان، ومحاذاة المخططات، وسلامة النظام، والدعم المستمر.',
    
    // Onboarding Story
    story_menu: 'قصة BENA',
    story_title: 'قصة BENA',
    story_intro_1: 'لكل شركة قصة بداية... خلنا نبدأ.',
    story_intro_2: '»بسم الله رب البدايات.«',
    story_intro_3: 'كان يا ما كان...',
    story_intro_4: 'لا لا، مو قديم الزمان، قبل حوالي 5 شهور فقط. 😊',
    story_q1: 'كيف بدأت BENA؟',
    story_q1_p1: 'بدأت فكرة BENA.',
    story_q1_p2: 'بدأت بإيمان أن التقنية تقدر تصنع فرقاً كبيراً وحقيقياً في أي مجال.',
    story_q1_p3: 'بدأنا، ولا زلنا، بدون مقر (ونقول: يا رب قريباً).',
    story_q1_p4: 'بدأنا ومعانا الإيمان بالله سبحانه وتعالى، والطموح، والرؤية، والرغبة في بناء شيء نفتخر فيه مستقبلاً بإذن الله.',
    story_q2: 'من فكرة إلى حقيقة',
    story_q2_p1: 'يعني رحلتنا كانت من فكرة إلى خطوات بدأناها.',
    story_q2_p2: 'طيب، وش كانت الخطوات؟',
    story_q2_step1: 'أولاً: كوب V60 قوووووي! ☕',
    story_q2_step2: 'بنينا هيكل الشركة وخلصنا الامور القانونية',
    story_q2_step3: 'اطلقنا موقعنا',
    story_q2_step4: 'وفتحنا حساباتنا في منصات التواصل الاجتماعي.',
    story_q2_p3: 'وهنا نقدر نقول: »BENA TECH أصبحت حقيقة... يا رب لك الحمد.«',
    story_q3: 'كيف تُبنى الشركات؟',
    story_q3_p1: 'لكن خلنا نكون صريحين...',
    story_q3_p2: 'الشركات ما تُبنى بالمؤسسين فقط.',
    story_q3_p3: 'تُبنى بأشخاص مؤمنين بالشركة. مؤمنين بالفكرة.',
    story_q3_p4: 'يسعون لتطوير أنفسهم، وفي نفس الوقت يسعون لتطوير الشركة.',
    story_q3_quote: '»لن تنال حتى تستحق، ولن تستحق حتى تسعى.«',
    story_q4: 'وهنا وصلنا إليك...',
    story_q4_title1: 'يا مميز.',
    story_q4_title2: 'يا قوي.',
    story_q4_title3: 'يا مبدع.',
    story_q4_p1: 'شفنا فيك الحماس، وشفنا فيك الشغف، ولسه متأكدين إننا بنشوف أكثر وأكثر.',
    story_q4_p2: 'لأننا مؤمنين إن كل إنسان عنده الكثير من المميزات، لكنها تظهر في الوقت المناسب.',
    story_q4_p3: 'وعشان كذا اخترناك... عشان نتميز أكثر مع بعض، إن شاء الله.',
    story_q4_p4: 'فشد الحزام... وخلنا نقلع سوا إلى القمة. 🚀',
    story_q5_title: 'مرحباً بك في BENA TECH',
    story_q5_name: 'الاسم',
    story_q5_position: 'المسمى التدريبي',
    story_q5_id: 'الرقم الوظيفي',
    story_q5_status: 'عضو من الجيل الأول لـ BENA TECH',
    story_q6_title: 'الجيل الأول',
    story_q6_p1: 'يمكن إن BENA اليوم لا تزال في بدايتها...',
    story_q6_p2: 'لكن بعد أيام، أو شهور، أو سنوات بإذن الله، لما تكبر وتصبح أكبر بكثير مما هي عليه اليوم...',
    story_q6_p3: 'بتقدر تلتفت وتقول بكل فخر:',
    story_q6_p4: '«كنت من الجيل الأول في BENA TECH.»',
    story_q6_download: 'تحميل اتفاقية التدريب'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const match = document.cookie.match(/(?:^|; )language=([^;]*)/);
    const cookieLang = match ? match[1] : null;
    return cookieLang || localStorage.getItem('language') || 'ar';
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
