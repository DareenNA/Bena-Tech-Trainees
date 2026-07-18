import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download, Award, Coffee, FileText, CheckCircle, Rocket, Globe, ChevronDown, User, Briefcase, Hash, Sparkles, Zap, Lightbulb } from 'lucide-react';
import gsap from 'gsap';

const Story = () => {
  const { t, language } = useLanguage();
  const [showCelebration, setShowCelebration] = useState(true);
  const [confettiPieces, setConfettiPieces] = useState([]);
  
  useEffect(() => {
    const pieces = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 8 + 6,
      color: ['#e74904', '#ffb020', '#ff7e40', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 7)],
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
      shape: Math.random() > 0.5 ? '50%' : '2px'
    }));
    setConfettiPieces(pieces);
  }, []);
  
  // Scroll progress indicator hook
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.pageYOffset / totalHeight) * 100;
        const progressEl = document.getElementById('scroll-progress');
        if (progressEl) progressEl.style.width = `${progress}%`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    employeeId: 'BENA-1'
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    position: ''
  });

  // Handle inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Run scroll-reveal animations on load
  useEffect(() => {
    // Reveal header
    gsap.fromTo('.reveal-header', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    
    // Stagger reveal sections on scroll
    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach((section) => {
      gsap.fromTo(section.querySelectorAll('.reveal-el'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, []);

  // Generate agreement and trigger direct PDF download
  const downloadAgreement = () => {
    const today = new Date().toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const logoUrl = window.location.origin + '/logo.png';

    const agreementHtml = `
      <div style="font-family: 'Cairo', sans-serif; background-color: #000000; color: #ffffff; direction: rtl; text-align: right;">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&family=Outfit:wght@800;900&display=swap');
          
          .print-page {
            box-sizing: border-box;
            width: 210mm;
            height: 297mm;
            padding: 22mm 20mm;
            margin: 0 auto;
            position: relative;
            background-color: #000000 !important;
            color: #ffffff !important;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            page-break-after: always;
          }

          /* Header Styling */
          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #1a1a1a;
            padding-bottom: 15px;
            font-size: 12px;
            color: #888;
            font-weight: 400;
          }

          /* Footer Styling */
          .page-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #1a1a1a;
            padding-top: 15px;
            font-size: 11px;
            color: #666;
          }

          /* Cover Page Elements */
          .cover-logo-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-top: 60px;
          }
          .cover-logo {
            height: 38px;
            width: auto;
          }
          .cover-line {
            width: 48px;
            height: 3px;
            background-color: #e74904;
            margin-top: 15px;
          }
          .cover-title {
            font-size: 48px;
            font-weight: 800;
            color: #ffffff;
            text-align: right;
            margin-top: 80px;
            margin-bottom: 60px;
            letter-spacing: -0.01em;
          }

          .cover-fields {
            display: flex;
            flex-direction: column;
            gap: 25px;
            max-width: 580px;
            width: 100%;
            margin-right: 0;
            margin-left: auto;
          }
          .cover-field-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
          }
          .cover-field-line {
            border-bottom: 1px solid #2a2a2a;
            width: 65%;
            margin-bottom: 4px;
          }
          .cover-field-label {
            text-align: right;
          }
          .cover-field-label-ar {
            font-size: 14px;
            font-weight: 700;
            color: #ffffff;
          }
          .cover-field-label-en {
            font-size: 10px;
            color: #666;
            margin-top: 2px;
          }

          .cover-quote {
            text-align: center;
            margin-top: 80px;
            font-size: 15px;
            color: #b3b3b3;
            font-style: italic;
            font-weight: 300;
          }

          /* Page 2 & 3 content structure */
          .section-block {
            display: flex;
            gap: 25px;
            margin-bottom: 22px;
            position: relative;
          }
          .section-num {
            font-family: 'Outfit', sans-serif;
            font-size: 16px;
            font-weight: 900;
            color: #e74904;
            width: 30px;
            text-align: right;
            flex-shrink: 0;
            margin-top: 3px;
          }
          .section-content {
            flex-grow: 1;
            text-align: right;
          }
          .section-title {
            font-size: 15px;
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 8px 0;
          }
          .section-text {
            font-size: 12.5px;
            color: #b3b3b3;
            line-height: 1.7;
            margin: 0;
            font-weight: 300;
          }

          .grid-fields {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px 35px;
            margin-top: 15px;
          }
          .grid-field-item {
            text-align: right;
          }
          .grid-field-label {
            font-size: 12px;
            color: #888;
            margin-bottom: 6px;
          }
          .grid-field-underline {
            border-bottom: 1px solid #222;
            height: 22px;
          }

          .bullet-list {
            margin: 8px 0 0 0;
            padding: 0;
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .bullet-item {
            font-size: 12.5px;
            color: #b3b3b3;
            line-height: 1.7;
            display: flex;
            gap: 8px;
            align-items: flex-start;
          }
          .bullet-prefix {
            color: #e74904;
            flex-shrink: 0;
          }

          /* Page 3 Signatures */
          .signatures-title {
            font-size: 15px;
            font-weight: 800;
            color: #ffffff;
            margin-top: 30px;
            margin-bottom: 20px;
            text-align: right;
            border-bottom: 1px solid #1a1a1a;
            padding-bottom: 10px;
          }
          .signatures-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .sig-column {
            text-align: right;
          }
          .sig-party-title {
            font-size: 13px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 20px;
          }
          .sig-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 15px;
            font-size: 12px;
            color: #888;
          }
          .sig-line {
            border-bottom: 1px solid #222;
            width: 75%;
            margin-bottom: 3px;
            height: 20px;
          }
        </style>

        <!-- PAGE 1: COVER PAGE -->
        <div class="print-page">
          <!-- Page Header -->
          <div class="page-header">
            <div>2026</div>
            <div>CONFIDENTIAL | سري</div>
          </div>

          <!-- Cover Content -->
          <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
            <div class="cover-logo-section">
              <img src="${logoUrl}" class="cover-logo" alt="BENA" />
              <div class="cover-line"></div>
            </div>

            <div class="cover-title">اتفاقية تدريب</div>

            <div class="cover-fields">
              <!-- Row 1 -->
              <div class="cover-field-row">
                <div class="cover-field-line"></div>
                <div class="cover-field-label">
                  <div class="cover-field-label-ar">الرقم الوظيفي</div>
                  <div class="cover-field-label-en">EMPLOYEE ID</div>
                </div>
              </div>
              <!-- Row 2 -->
              <div class="cover-field-row">
                <div class="cover-field-line"></div>
                <div class="cover-field-label">
                  <div class="cover-field-label-ar">اسم المتدرب</div>
                  <div class="cover-field-label-en">INTERN NAME</div>
                </div>
              </div>
              <!-- Row 3 -->
              <div class="cover-field-row">
                <div class="cover-field-line"></div>
                <div class="cover-field-label">
                  <div class="cover-field-label-ar">المسمى التدريبي</div>
                  <div class="cover-field-label-en">POSITION</div>
                </div>
              </div>
              <!-- Row 4 -->
              <div class="cover-field-row">
                <div class="cover-field-line"></div>
                <div class="cover-field-label">
                  <div class="cover-field-label-ar">تاريخ البدء</div>
                  <div class="cover-field-label-en">START DATE</div>
                </div>
              </div>
              <!-- Row 5 -->
              <div class="cover-field-row">
                <div class="cover-field-line"></div>
                <div class="cover-field-label">
                  <div class="cover-field-label-ar">تاريخ الانتهاء</div>
                  <div class="cover-field-label-en">END DATE</div>
                </div>
              </div>
            </div>

            <div class="cover-quote">
              «أنت لا تنضم إلى BENA TECH، بل تساهم في بنائها.»
            </div>
          </div>

          <!-- Page Footer -->
          <div class="page-footer">
            <div style="font-family: 'Outfit', sans-serif;">3 / 1</div>
            <div>BENA TECH | Confidential | bena-tech.com</div>
          </div>
        </div>


        <!-- PAGE 2: TERMS PAGE 1 -->
        <div class="print-page">
          <!-- Page Header -->
          <div class="page-header">
            <div>اتفاقية تدريب • سري | Confidential</div>
            <img src="${logoUrl}" style="height: 18px; width: auto;" />
          </div>

          <!-- Terms Content Page 1 -->
          <div style="flex-grow: 1; padding: 25px 0;">
            <!-- Section 01 -->
            <div class="section-block">
              <div class="section-num">01</div>
              <div class="section-content">
                <h4 class="section-title">الطرف الأول</h4>
                <p class="section-text">شركة بينا تيك – BENA TECH، ويشار إليها فيما بعد بـ»الشركة«.</p>
              </div>
            </div>

            <!-- Section 02 -->
            <div class="section-block">
              <div class="section-num">02</div>
              <div class="section-content">
                <h4 class="section-title">ثانياً: الطرف الثاني</h4>
                <div class="grid-fields">
                  <div>
                    <div class="grid-field-label">اسم المتدرب</div>
                    <div class="grid-field-underline"></div>
                  </div>
                  <div>
                    <div class="grid-field-label">رقم الهوية</div>
                    <div class="grid-field-underline"></div>
                  </div>
                  <div>
                    <div class="grid-field-label">الجنسية</div>
                    <div class="grid-field-underline"></div>
                  </div>
                  <div>
                    <div class="grid-field-label">التخصص</div>
                    <div class="grid-field-underline"></div>
                  </div>
                  <div>
                    <div class="grid-field-label">المسمى التدريبي</div>
                    <div class="grid-field-underline"></div>
                  </div>
                  <div>
                    <div class="grid-field-label">البريد الإلكتروني</div>
                    <div class="grid-field-underline"></div>
                  </div>
                  <div>
                    <div class="grid-field-label">رقم الجوال</div>
                    <div class="grid-field-underline"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 03 -->
            <div class="section-block">
              <div class="section-num">03</div>
              <div class="section-content">
                <h4 class="section-title">موضوع الاتفاقية</h4>
                <p class="section-text">
                  تنظّم هذه الاتفاقية العلاقة التدريبية بين الطرفين، حيث يلتحق الطرف الثاني ببرنامج تدريبي لدى الطرف الأول بهدف اكتساب المهارات والخبرات العملية في مجال تخصصه، وفق الشروط والأحكام الواردة في هذه الاتفاقية.
                </p>
              </div>
            </div>

            <!-- Section 04 -->
            <div class="section-block">
              <div class="section-num">04</div>
              <div class="section-content">
                <h4 class="section-title">مدة التدريب</h4>
                <p class="section-text">
                  تبدأ مدة التدريب من التاريخ الموضح في الاتفاقية وتنتهي بانتهاء المدة المتفق عليها، ويجوز تمديدها أو تعديلها باتفاق كتابي بين الطرفين.
                </p>
              </div>
            </div>

            <!-- Section 05 -->
            <div class="section-block">
              <div class="section-num">05</div>
              <div class="section-content">
                <h4 class="section-title">طبيعة التدريب</h4>
                <ul class="bullet-list">
                  <li class="bullet-item"><span class="bullet-prefix">—</span> يُنفّذ التدريب عن بُعد بشكل كامل.</li>
                  <li class="bullet-item"><span class="bullet-prefix">—</span> التدريب بنظام الدوام الكامل.</li>
                  <li class="bullet-item"><span class="bullet-prefix">—</span> يُتّفق على عدد ساعات التدريب بين الطرفين.</li>
                  <li class="bullet-item"><span class="bullet-prefix">—</span> يهدف التدريب إلى اكتساب الخبرة العملية.</li>
                  <li class="bullet-item"><span class="bullet-prefix">—</span> لا يترتب على هذه الاتفاقية أي التزام مالي على أيّ من الطرفين.</li>
                  <li class="bullet-item"><span class="bullet-prefix">—</span> لا تُعد هذه الاتفاقية ضماناً أو وعيداً بالتوظيف بعد انتهاء التدريب.</li>
                </ul>
              </div>
            </div>

            <!-- Section 06 -->
            <div class="section-block">
              <div class="section-num">06</div>
              <div class="section-content">
                <h4 class="section-title">التزامات المتدرب</h4>
                <ul class="bullet-list">
                  <li class="bullet-item"><span class="bullet-prefix">—</span> الالتزام بالمواعيد المحددة للمهام والتسليمات.</li>
                  <li class="bullet-item"><span class="bullet-prefix">—</span> حضور الاجتماعات الدورية المقررة.</li>
                  <li class="bullet-item"><span class="bullet-prefix">—</span> الالتزام بالسلوك المهني والاحترافية في التعامل.</li>
                  <li class="bullet-item"><span class="bullet-prefix">—</span> عدم تمثيل الشركة أو التحدث باسمها دون إذن كتابي مسبق.</li>
                  <li class="bullet-item"><span class="bullet-prefix">—</span> استخدام أدوات الشركة وأنظمتها للأغراض المهنية فقط.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Page Footer -->
          <div class="page-footer">
            <div style="font-family: 'Outfit', sans-serif;">3 / 2</div>
            <div>BENA TECH | Confidential | bena-tech.com</div>
          </div>
        </div>


        <!-- PAGE 3: TERMS PAGE 2 -->
        <div class="print-page">
          <!-- Page Header -->
          <div class="page-header">
            <div>اتفاقية تدريب • سري | Confidential</div>
            <div style="font-family: 'Outfit', sans-serif; font-weight: 800; color: #fff; font-size: 14px; letter-spacing: -0.01em;">BENA.TECH</div>
          </div>

          <!-- Terms Content Page 2 -->
          <div style="flex-grow: 1; padding: 25px 0;">
            <!-- Section 07 -->
            <div class="section-block">
              <div class="section-num">07</div>
              <div class="section-content">
                <h4 class="section-title">السرية وعدم الإفصاح</h4>
                <p class="section-text">
                  يلتزم المتدرب بالمحافظة على سرية جميع المعلومات التي يطّلع عليها خلال فترة التدريب وعدم الإفصاح عنها لأي طرف ثالث، ويشمل ذلك على سبيل المثال الـ حصر: بيانات العملاء، والعقود، والمشاريع، والمستندات، والمعلومات المالية. ويستمر هذا الالتزام حتى بعد انتهاء الاتفاقية.
                </p>
              </div>
            </div>

            <!-- Section 08 -->
            <div class="section-block">
              <div class="section-num">08</div>
              <div class="section-content">
                <h4 class="section-title">الملكية الفكرية</h4>
                <p class="section-text">
                  تؤول إلى الشركة ملكية جميع الأعمال المنتجة خلال فترة التدريب، بما في ذلك: التصاميم، والمحتوى، والأكواد البرمجية، والبرومبتات، وخطط العمل، والمستندات، ولا يحق للمتدرب استخدامها أو نشرها أو الاستفادة منها دون موافقة خطية مسبقة من الشركة.
                </p>
              </div>
            </div>

            <!-- Section 09 -->
            <div class="section-block">
              <div class="section-num">09</div>
              <div class="section-content">
                <h4 class="section-title">الحسابات والأصول الرقمية</h4>
                <p class="section-text">
                  تظل جميع الحسابات والأصول الرقمية ملكاً للشركة، ويلتزم المتدرب بتسليم صلاحيات الوصول كاملة عند انتهاء الاتفاقية، ويشمل ذلك: Google Workspace، وGitHub، والبريد الإلكتروني الرسمي، وحسابات التواصل الاجتماعي، وأدوات إدارة المشاريع.
                </p>
              </div>
            </div>

            <!-- Section 10 -->
            <div class="section-block">
              <div class="section-num">10</div>
              <div class="section-content">
                <h4 class="section-title">حماية البيانات</h4>
                <p class="section-text">
                  يلتزم المتدرب بالتعامل مع البيانات الشخصية وبيانات العملاء وفق الأنظمة المعمول بها في المملكة العربية السعودية، وعدم نسخها أو نقلها خارج أنظمة الشركة المعتمدة.
                </p>
              </div>
            </div>

            <!-- Section 11 -->
            <div class="section-block">
              <div class="section-num">11</div>
              <div class="section-content">
                <h4 class="section-title">التقييم وشهادة التدريب</h4>
                <p class="section-text">
                  يخضع المتدرب لتقييم دوري لأدائه، ويحصل عند إتمام فترة التدريب بنجاح على شهادة تدريب معتمدة من الشركة.
                </p>
              </div>
            </div>

            <!-- Section 12 -->
            <div class="section-block">
              <div class="section-num">12</div>
              <div class="section-content">
                <h4 class="section-title">إنهاء الاتفاقية</h4>
                <p class="section-text">
                  يجوز لأي من الطرفين إنهاء هذه الاتفاقية بإشعار كتابي مسبق مدته سبعة (7) أيام. ويحق للشركة الإنهاء الفوري في حال الإخلال بالتزامات السرية، أو إساءة استخدام أصول الشركة، أو تكرار عدم الالتزام بالتوجيهات.
                </p>
              </div>
            </div>

            <!-- Section 13 -->
            <div class="section-block">
              <div class="section-num">13</div>
              <div class="section-content">
                <h4 class="section-title">الأنظمة المعمول بها</h4>
                <p class="section-text">
                  تخضع هذه الاتفاقية وتُفسّر وفقاً للأنظمة واللوائح المعمول بها في المملكة العربية السعودية.
                </p>
              </div>
            </div>

            <!-- Section 14 -->
            <div class="section-block">
              <div class="section-num">14</div>
              <div class="section-content">
                <h4 class="section-title">الإقرار</h4>
                <p class="section-text">
                  يقر الطرف الثاني بأنه قرأ هذه الاتفاقية وفهم جميع بنودها ووافق عليها.
                </p>
              </div>
            </div>

            <!-- SIGNATURES SECTION -->
            <div class="signatures-title">التوقيعات</div>
            <div class="signatures-grid">
              <!-- First Party -->
              <div class="sig-column">
                <div class="sig-party-title">الطرف الأول: شركة BENA TECH</div>
                <div class="sig-row">
                  <div>الاسم</div>
                  <div class="sig-line"></div>
                </div>
                <div class="sig-row">
                  <div>التوقيع</div>
                  <div class="sig-line"></div>
                </div>
                <div class="sig-row">
                  <div>التاريخ</div>
                  <div class="sig-line"></div>
                </div>
              </div>
              <!-- Second Party -->
              <div class="sig-column">
                <div class="sig-party-title">الطرف الثاني: المتدرب/المتدربة</div>
                <div class="sig-row">
                  <div>الاسم</div>
                  <div class="sig-line"></div>
                </div>
                <div class="sig-row">
                  <div>التوقيع</div>
                  <div class="sig-line"></div>
                </div>
                <div class="sig-row">
                  <div>التاريخ</div>
                  <div class="sig-line"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Page Footer -->
          <div class="page-footer">
            <div style="font-family: 'Outfit', sans-serif;">3 / 3</div>
            <div>BENA TECH | Confidential | bena-tech.com</div>
          </div>
        </div>
      </div>
    `;

    // Create temporary hidden container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.backgroundColor = '#000000';
    tempContainer.innerHTML = agreementHtml;
    document.body.appendChild(tempContainer);

    const runDownload = () => {
      const opt = {
        margin:       0,
        filename:     'Bena_Tech_Training_Agreement.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#000000' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css'] }
      };
      
      window.html2pdf()
        .from(tempContainer)
        .set(opt)
        .save()
        .then(() => {
          document.body.removeChild(tempContainer);
        });
    };

    if (window.html2pdf) {
      runDownload();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = runDownload;
      document.head.appendChild(script);
    }
  };

  return (
    <div className="bg-grid" style={{ 
      background: '#040404', 
      color: '#fff', 
      minHeight: '100vh', 
      fontFamily: "'Cairo', sans-serif",
      position: 'relative'
    }} dir="rtl">
      
      {/* Impressive glowing scroll progress indicator */}
      <div id="scroll-progress" style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        height: '4px', 
        background: 'linear-gradient(90deg, var(--primary-orange), #ff6c2f)', 
        width: '0%', 
        zIndex: 99999, 
        boxShadow: '0 0 10px var(--primary-orange)',
        transition: 'width 0.1s ease' 
      }}></div>
      
      {/* Celebration Party Acceptance Overlay */}
      {showCelebration && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(4, 4, 4, 0.94)',
          backdropFilter: 'blur(25px)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          {/* Conic Halo Rotating Glow */}
          <div className="halo-glow"></div>
          {/* Floating Spheres in Background */}
          <div className="floating-sphere-1"></div>
          <div className="floating-sphere-2"></div>
          {/* Confetti pieces */}
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                left: `${piece.left}%`,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                borderRadius: piece.shape
              }}
            />
          ))}

          {/* Celebration Card */}
          <div className="celebration-card">


            {/* Acceptance Message */}
            <h1 style={{
              fontSize: 'clamp(2.3rem, 5vw, 3.5rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.35,
              margin: 0,
              textShadow: '0 4px 20px rgba(255, 255, 255, 0.15)'
            }}>
              مبروك قبولك في برنامج تدريب <span style={{ 
                background: 'linear-gradient(90deg, #ffb020 0%, var(--primary-orange) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>Bena Tech</span>
            </h1>

            <p style={{
              fontSize: '1.25rem',
              color: 'var(--text-grey)',
              lineHeight: 1.8,
              margin: 0,
              fontWeight: 300,
              maxWidth: '480px'
            }}>
              أهلاً بك في الجيل الأول من صناع المستقبل. نستحق سعيك، وتستحق ريادتنا.
            </p>

            {/* Action button to enter page with Shimmer Effect */}
            <button
              onClick={() => setShowCelebration(false)}
              className="btn shimmer-button"
              style={{
                fontSize: '1.2rem',
                padding: '1.25rem 4rem',
                gap: '12px',
                color: 'white',
                fontWeight: 800,
                border: 'none',
                borderRadius: '100px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 20px 40px rgba(231, 73, 4, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: 'scale(1)',
                position: 'relative',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(231, 73, 4, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(231, 73, 4, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)';
              }}
            >
              <span>ابدأ الرحلة 🚀</span>
            </button>
          </div>
        </div>
      )}

      {/* CSS Styles injection */}
      <style>{`
        /* Futuristic grid overlay */
        .bg-grid {
          background-image: 
            linear-gradient(rgba(231, 73, 4, 0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(231, 73, 4, 0.012) 1px, transparent 1px);
          background-size: 60px 60px;
          background-position: center;
        }

        /* Drifting ambient light blobs */
        @keyframes drift-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.1); }
        }
        @keyframes drift-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -40px) scale(1.08); }
        }
        @keyframes drift-blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -20px) scale(1.05); }
        }

        .glow-blob-1 {
          position: absolute; top: 5%; right: 10%; width: 45vw; height: 45vw;
          background: radial-gradient(circle, rgba(231, 73, 4, 0.09) 0%, rgba(0,0,0,0) 70%);
          pointer-events: none; z-index: 1; filter: blur(60px);
          animation: drift-blob-1 25s infinite ease-in-out;
        }
        .glow-blob-2 {
          position: absolute; top: 40%; left: 5%; width: 40vw; height: 40vw;
          background: radial-gradient(circle, rgba(231, 73, 4, 0.06) 0%, rgba(0,0,0,0) 70%);
          pointer-events: none; z-index: 1; filter: blur(70px);
          animation: drift-blob-2 30s infinite ease-in-out;
        }
        .glow-blob-3 {
          position: absolute; bottom: 10%; right: 15%; width: 35vw; height: 35vw;
          background: radial-gradient(circle, rgba(231, 73, 4, 0.07) 0%, rgba(0,0,0,0) 70%);
          pointer-events: none; z-index: 1; filter: blur(50px);
          animation: drift-blob-3 22s infinite ease-in-out;
        }

        /* Slide header/footer hover */
        .reveal-header a:hover {
          color: white !important;
          transform: translateY(-1px);
        }

        /* Stepper hover effect */
        .step-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .step-card:hover {
          transform: translateY(-5px);
          border-color: rgba(231, 73, 4, 0.4);
          background: rgba(231, 73, 4, 0.02);
          box-shadow: 0 15px 30px rgba(231, 73, 4, 0.05);
        }

        /* Welcome section cards */
        .card-momayaz, .card-qawi, .card-mobde {
          flex: 1;
          min-width: 180px;
          padding: 2.2rem 1.5rem;
          border-radius: 24px;
          text-align: center;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .card-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.2rem;
          position: relative;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .card-momayaz {
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.01) 0%, rgba(20, 20, 20, 0.4) 100%);
          border: 1px solid rgba(245, 158, 11, 0.12);
        }
        .card-momayaz .card-icon-wrapper {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
        .card-momayaz:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(245, 158, 11, 0.5);
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.03) 0%, rgba(20, 20, 20, 0.6) 100%);
          box-shadow: 0 30px 60px rgba(245, 158, 11, 0.08);
        }
        .card-momayaz:hover .card-icon-wrapper {
          transform: scale(1.15) rotate(12deg);
          background: rgba(245, 158, 11, 0.15);
        }

        .card-qawi {
          background: linear-gradient(180deg, rgba(231, 73, 4, 0.02) 0%, rgba(20, 20, 20, 0.4) 100%);
          border: 1px solid rgba(231, 73, 4, 0.18);
        }
        .card-qawi .card-icon-wrapper {
          background: rgba(231, 73, 4, 0.08);
          border: 1px solid rgba(231, 73, 4, 0.2);
          color: var(--primary-orange);
        }
        .card-qawi:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: var(--primary-orange);
          background: linear-gradient(180deg, rgba(231, 73, 4, 0.05) 0%, rgba(20, 20, 20, 0.6) 100%);
          box-shadow: 0 30px 60px rgba(231, 73, 4, 0.12);
        }
        .card-qawi:hover .card-icon-wrapper {
          transform: scale(1.15) rotate(-12deg);
          background: rgba(231, 73, 4, 0.15);
        }

        .card-mobde {
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.01) 0%, rgba(20, 20, 20, 0.4) 100%);
          border: 1px solid rgba(139, 92, 246, 0.12);
        }
        .card-mobde .card-icon-wrapper {
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.2);
          color: #a78bfa;
        }
        .card-mobde:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(139, 92, 246, 0.5);
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(20, 20, 20, 0.6) 100%);
          box-shadow: 0 30px 60px rgba(139, 92, 246, 0.08);
        }
        .card-mobde:hover .card-icon-wrapper {
          transform: scale(1.15) rotate(12deg);
          background: rgba(139, 92, 246, 0.15);
        }

        /* Timeline text card styles with glowing border and subtle reflection */
        .step-card-text {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.005) 100%);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 1.4rem 2.4rem;
          border-radius: 24px;
          flex-grow: 1;
          text-align: right;
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .step-card-text::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 100% 0%, rgba(231, 73, 4, 0.08) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .step-card-text:hover::before {
          opacity: 1;
        }
        .step-card-text:hover {
          transform: translateY(-5px) translateX(-5px);
          border-color: rgba(231, 73, 4, 0.35);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(231, 73, 4, 0.06);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.008) 100%) !important;
        }

        /* Stepper Glowing Neon Line */
        .stepper-neon-line {
          position: absolute;
          right: 21px;
          top: 22px;
          bottom: 22px;
          width: 2px;
          background: linear-gradient(to bottom, var(--primary-orange), rgba(231,73,4,0.3) 50%, rgba(255,255,255,0.01) 100%);
          box-shadow: 0 0 10px rgba(231, 73, 4, 0.5);
          z-index: 0;
        }

        /* Glassmorphic input styles */
        .glass-input {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 1.3rem;
          border-radius: 16px;
          color: white;
          font-size: 1.1rem;
          outline: none;
          textAlign: right;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(10px);
        }
        .glass-input:focus {
          border-color: var(--primary-orange);
          background: rgba(231, 73, 4, 0.02);
          box-shadow: 0 0 20px rgba(231, 73, 4, 0.15);
        }

        /* Bouncing animations */
        @keyframes bounce-arrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bounce-rocket {
          0%, 100% { transform: translateY(0) rotate(-45deg); }
          50% { transform: translateY(-10px) rotate(-45deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(231, 73, 4, 0.2); }
          50% { box-shadow: 0 0 35px rgba(231, 73, 4, 0.45); }
        }

        .pulse-button {
          animation: glow-pulse 3s infinite;
        }

        .scroll-section {
          position: relative;
          z-index: 2;
        }

        /* Celebration modal and confetti animations */
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes scale-up-fade {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .confetti-piece {
          position: absolute;
          top: -20px;
          animation-name: confetti-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          pointer-events: none;
        }

        /* Responsive styling for hero and celebration cards */
        .hero-card {
          background: linear-gradient(180deg, rgba(25, 25, 25, 0.45) 0%, rgba(10, 10, 10, 0.8) 100%);
          padding: 3.5rem 4.5rem;
          border-radius: 32px;
          border: 1px solid rgba(231, 73, 4, 0.22);
          margin-bottom: 4.5rem;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 40px rgba(231, 73, 4, 0.05);
          backdrop-filter: blur(30px);
          position: relative;
          overflow: hidden;
        }
        
        .celebration-card {
          background: linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(5, 5, 5, 0.98) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 36px;
          padding: 4rem 3.5rem;
          max-width: 680px;
          width: 90%;
          text-align: center;
          box-shadow: 0 50px 100px rgba(0,0,0,0.85), 0 0 50px rgba(231, 73, 4, 0.05), inset 0 1px 0 rgba(255,255,255,0.05);
          backdrop-filter: blur(40px);
          position: relative;
          z-index: 10000;
          animation: scale-up-fade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
        }

        /* Halo Conic Glow Rotation */
        @keyframes rotate-halo {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .halo-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: conic-gradient(from 0deg, transparent, rgba(231, 73, 4, 0.15), transparent, rgba(139, 92, 246, 0.1), transparent);
          border-radius: 50%;
          filter: blur(45px);
          animation: rotate-halo 15s infinite linear;
          pointer-events: none;
          z-index: 1;
        }

        /* Floating Sphere Keyframes */
        @keyframes float-sphere-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-sphere-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-180deg); }
        }
        .floating-sphere-1 {
          position: absolute;
          top: 20%;
          left: 15%;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(231, 73, 4, 0.12), transparent);
          filter: blur(10px);
          animation: float-sphere-1 8s infinite ease-in-out;
          pointer-events: none;
        }
        .floating-sphere-2 {
          position: absolute;
          bottom: 25%;
          right: 12%;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.08), transparent);
          filter: blur(15px);
          animation: float-sphere-2 10s infinite ease-in-out;
          pointer-events: none;
        }

        /* Shimmer Button Effect */
        @keyframes button-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-button {
          background: linear-gradient(120deg, #e74904 30%, #ff9e74 50%, #e74904 70%);
          background-size: 200% 100%;
          animation: button-shimmer 3s infinite linear;
        }

        .rocket-banner {
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          background: linear-gradient(90deg, rgba(231, 73, 4, 0.12) 0%, rgba(20, 20, 20, 0.5) 100%);
          border: 1px solid rgba(231, 73, 4, 0.3);
          padding: 1.2rem 2.8rem;
          border-radius: 100px;
          color: var(--primary-orange);
          font-size: 1.6rem;
          font-weight: 800;
          box-shadow: 0 20px 40px rgba(231, 73, 4, 0.05);
          transition: all 0.3s ease;
        }

        .download-card {
          background: linear-gradient(180deg, rgba(20, 20, 20, 0.6) 0%, rgba(10, 10, 10, 0.85) 100%);
          border: 1px solid rgba(231, 73, 4, 0.25);
          border-radius: 36px;
          padding: 4.5rem 3.5rem;
          box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 50px rgba(231, 73, 4, 0.08);
          backdrop-filter: blur(30px);
          max-width: 750px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }

        .quote-card {
          background: linear-gradient(135deg, rgba(231, 73, 4, 0.12) 0%, rgba(20, 20, 20, 0.8) 100%);
          padding: 3rem 3.5rem;
          border-radius: 24px;
          border: 1px solid rgba(231, 73, 4, 0.25);
          text-align: center;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          /* Force general typography down to phone friendly ultra-compact sizes */
          h1 {
            font-size: 1.8rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
          h3 {
            font-size: 1.3rem !important;
          }
          .display-1 {
            font-size: 2.1rem !important;
          }
          .display-2 {
            font-size: 1.4rem !important;
          }

          /* General text scaling override (Ultra-compact 14px equivalent) */
          p, span, li, button, a {
            font-size: 0.88rem !important;
          }

          .hero-card {
            padding: 1.8rem 1.2rem !important;
            border-radius: 20px !important;
            margin-bottom: 2.5rem !important;
          }
          .hero-card h3 {
            font-size: 1.35rem !important;
          }
          .hero-card p {
            font-size: 0.85rem !important;
            line-height: 1.5 !important;
          }

          .celebration-card {
            padding: 2.2rem 1.2rem !important;
            border-radius: 24px !important;
            gap: 1.5rem !important;
            width: 94% !important;
          }
          .celebration-card h1 {
            font-size: 1.35rem !important;
            line-height: 1.35 !important;
          }
          .celebration-card p {
            font-size: 0.85rem !important;
            line-height: 1.5 !important;
          }
          .celebration-card button {
            padding: 0.8rem 2rem !important;
          }
          .celebration-card button span {
            font-size: 0.95rem !important;
          }

          /* Hero text sizes */
          .scroll-section p[style*="font-size: 1.65"] {
            font-size: 1.05rem !important;
            line-height: 1.5 !important;
            margin-bottom: 2rem !important;
          }

          /* Step welcome cards */
          .card-momayaz, .card-qawi, .card-mobde {
            padding: 1.3rem 1rem !important;
            min-width: 120px !important;
            border-radius: 16px !important;
          }
          .card-icon-wrapper {
            width: 34px !important;
            height: 34px !important;
            margin-bottom: 0.6rem !important;
            border-radius: 10px !important;
          }
          .card-icon-wrapper svg {
            width: 14px !important;
            height: 14px !important;
          }
          .card-momayaz span, .card-qawi span, .card-mobde span {
            font-size: 0.98rem !important;
          }

          /* Stepper timeline list */
          .scroll-section div[style*="flex-direction: column"][style*="gap: 3.5rem"] {
            gap: 1.2rem !important;
          }
          .scroll-section div[style*="display: flex"][style*="align-items: center"][style*="gap: 2.5rem"] {
            gap: 0.8rem !important;
          }
          .scroll-section div[style*="width: 44px"][style*="height: 44px"] {
            width: 28px !important;
            height: 28px !important;
            font-size: 0.75rem !important;
          }
          .step-card-text {
            padding: 0.7rem 1rem !important;
            border-radius: 12px !important;
          }
          .step-card-text span {
            font-size: 0.86rem !important;
            line-height: 1.4 !important;
          }

          /* Quote Card */
          .quote-card {
            padding: 1.6rem 1.2rem !important;
            border-radius: 16px !important;
          }
          .quote-card p {
            font-size: 1.15rem !important;
            line-height: 1.45 !important;
          }

          /* Rocket banner (pill) */
          .rocket-banner {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 1rem 0.8rem !important;
            border-radius: 16px !important;
            gap: 0.6rem !important;
          }
          .rocket-banner span {
            font-size: 0.9rem !important;
            line-height: 1.35 !important;
          }

          /* Download card */
          .download-card {
            padding: 1.8rem 1.2rem !important;
            border-radius: 24px !important;
          }
          .download-card h2 {
            font-size: 1.5rem !important;
            margin-bottom: 1.2rem !important;
          }
          .download-card h3 {
            font-size: 1.15rem !important;
            line-height: 1.35 !important;
          }
          .download-card a {
            padding: 0.9rem 2rem !important;
            width: 100% !important;
          }
          .download-card a span {
            font-size: 0.92rem !important;
          }

          /* Section paddings override */
          .scroll-section {
            padding: 45px 1rem !important;
            min-height: auto !important;
          }
          /* Reduce header top padding on mobile */
          .scroll-section:first-of-type {
            padding-top: 90px !important;
          }

          /* Footer modifications */
          footer {
            padding: 2.5rem 1rem 1.5rem 1rem !important;
          }
        }
      `}</style>

      {/* Decorative Light Blobs */}
      <div className="glow-blob-1"></div>
      <div className="glow-blob-2"></div>
      <div className="glow-blob-3"></div>

      {/* Header */}
      <header className="reveal-header" style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
        background: 'rgba(4, 4, 4, 0.75)',
        backdropFilter: 'blur(25px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        padding: '1.4rem 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="/logo.png" alt="BENA TECH" style={{ height: '24px', objectFit: 'contain' }} />
          <a 
            href="https://bena-tech.com/about" 
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              fontSize: '0.85rem', 
              color: 'var(--text-grey)', 
              fontWeight: 600, 
              letterSpacing: '0.05em',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '6px 16px',
              borderRadius: '100px',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'var(--primary-orange)';
              e.currentTarget.style.background = 'rgba(231, 73, 4, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-grey)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Globe size={13} />
            <span>الموقع الرسمي</span>
          </a>
        </div>
      </header>

      {/* Hero / Cover Section */}
      <section className="scroll-section" style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '140px 2rem 60px 2rem', textAlign: 'center', position: 'relative'
      }}>
        {/* Background glow right behind the hero text */}
        <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(231,73,4,0.06) 0%, transparent 70%)', top: '35%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 1 }}></div>

        <div className="reveal-el" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <h1 className="display-1" style={{
            fontSize: 'clamp(3.8rem, 9vw, 6.5rem)', 
            fontWeight: 900, 
            marginBottom: '1.5rem',
            background: 'linear-gradient(180deg, #FFFFFF 30%, #a1a1a1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            textShadow: '0 0 80px rgba(255, 255, 255, 0.05)'
          }}>
            قصة BENA
          </h1>

          {/* Upgraded glowing line separator */}
          <div style={{ 
            width: '60px', 
            height: '3px', 
            background: 'linear-gradient(90deg, transparent, var(--primary-orange), transparent)', 
            boxShadow: '0 0 10px var(--primary-orange)',
            marginBottom: '2.5rem' 
          }}></div>
          
          <p style={{ fontSize: '1.65rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3.5rem', fontWeight: 300, maxWidth: '600px', lineHeight: 1.6, letterSpacing: '0.01em' }}>
            لكل شركة قصة بداية... خلنا نبدأ.
          </p>
          
          {/* Card with quote background, glowing border and shadow */}
          <div className="hero-card">
            {/* Absolute positioned huge quotes in the card background */}
            <div style={{ 
              position: 'absolute', 
              top: '-30px', 
              left: '25px', 
              fontSize: '11rem', 
              fontFamily: 'Georgia, serif', 
              color: 'rgba(231, 73, 4, 0.07)', 
              lineHeight: 1, 
              userSelect: 'none', 
              pointerEvents: 'none', 
              zIndex: 1 
            }}>
              ”
            </div>
            
            <p style={{ fontSize: '1.55rem', color: 'var(--primary-orange)', fontStyle: 'italic', fontWeight: 700, marginBottom: '1.5rem', position: 'relative', zIndex: 2, textShadow: '0 0 20px rgba(231, 73, 4, 0.15)' }}>
              «بسم الله رب البدايات.»
            </p>
            <h3 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem', color: '#fff', position: 'relative', zIndex: 2, letterSpacing: '-0.01em' }}>
              كان يا ما كان...
            </h3>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-grey)', fontWeight: 400, position: 'relative', zIndex: 2, margin: 0 }}>
              لا لا، مو قديم الزمان، قبل حوالي 5 شهور فقط. 😊
            </p>
          </div>
          
          <button 
            onClick={() => document.getElementById('how-started').scrollIntoView({ behavior: 'smooth' })}
            style={{ background: 'none', border: 'none', color: 'var(--text-grey)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease', position: 'relative', zIndex: 2 }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-grey)'}
          >
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase' }}>اسحب لأسفل لمتابعة القصة</span>
            <ChevronDown size={22} style={{ animation: 'bounce-arrow 2s infinite', color: 'var(--primary-orange)' }} />
          </button>
        </div>
      </section>

      {/* Section 1: How started */}
      <section id="how-started" className="scroll-section" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '120px 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.03)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal-el">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
              <span style={{ 
                color: 'var(--primary-orange)', 
                fontSize: '0.9rem', 
                fontWeight: 800,
                background: 'rgba(231, 73, 4, 0.08)',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '1px solid rgba(231, 73, 4, 0.2)'
              }}>01</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>كيف بدأت BENA؟</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem', marginTop: '3.5rem' }}>
              <h3 style={{ fontSize: '2.1rem', color: 'var(--text-white)', fontWeight: 700, borderLeft: '3px solid var(--primary-orange)', paddingLeft: '20px', lineHeight: 1.4 }}>
                بدأت فكرة BENA.
              </h3>
              <p style={{ fontSize: '1.45rem', color: 'var(--text-grey)', lineHeight: 1.8, fontWeight: 300 }}>
                بدأت بإيمان أن التقنية تقدر تصنع فرقاً كبيراً وحقيقياً في أي مجال.
              </p>
              <p style={{ fontSize: '1.45rem', color: 'var(--text-grey)', lineHeight: 1.8, fontWeight: 300 }}>
                بدأنا، ولا زلنا، بدون مقر (ونقول: يا رب قريباً).
              </p>
              
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(231, 73, 4, 0.06) 0%, rgba(20, 20, 20, 0.2) 100%)', 
                borderRight: '4px solid var(--primary-orange)', 
                padding: '2.2rem', 
                borderRadius: '8px 24px 24px 8px', 
                marginTop: '1.5rem',
                borderTop: '1px solid rgba(231, 73, 4, 0.1)',
                borderBottom: '1px solid rgba(231, 73, 4, 0.1)',
                borderLeft: '1px solid rgba(231, 73, 4, 0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(5px)'
              }}>
                <p style={{ fontSize: '1.35rem', color: '#fff', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                  بدأنا ومعانا الإيمان بالله سبحانه وتعالى، والطموح، والرؤية، والرغبة في بناء شيء نفتخر فيه مستقبلاً بإذن الله.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Converting idea */}
      <section className="scroll-section" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '120px 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.03)'
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="reveal-el">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
              <span style={{ 
                color: 'var(--primary-orange)', 
                fontSize: '0.9rem', 
                fontWeight: 800,
                background: 'rgba(231, 73, 4, 0.08)',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '1px solid rgba(231, 73, 4, 0.2)'
              }}>02</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>من فكرة إلى حقيقة</h2>
            </div>
            
            <p style={{ fontSize: '1.45rem', color: 'var(--text-grey)', marginTop: '2.5rem', marginBottom: '0.5rem', fontWeight: 300 }}>
              يعني رحلتنا كانت من فكرة إلى خطوات بدأناها.
            </p>
            <h3 style={{ fontSize: '1.7rem', color: 'var(--text-white)', marginBottom: '3.5rem', fontWeight: 700 }}>
              طيب، وش كانت الخطوات؟
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', gap: '4rem', marginTop: '3.5rem', marginBottom: '4.5rem' }}>
              <div className="stepper-neon-line"></div>

              {/* Step 1 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--primary-orange)',
                  background: 'rgba(231, 73, 4, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-orange)',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  1
                </div>
                <div className="step-card-text">
                  <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff' }}>
                    أولاً: كوب V60 قوووووي! ☕
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--primary-orange)',
                  background: 'rgba(231, 73, 4, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-orange)',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div className="step-card-text">
                  <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff' }}>
                    بنينا هيكل الشركة وخلصنا الامور القانونية
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--primary-orange)',
                  background: 'rgba(231, 73, 4, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-orange)',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  3
                </div>
                <div className="step-card-text">
                  <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff' }}>
                    اطلقنا موقعنا
                  </span>
                </div>
              </div>

              {/* Step 4 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--primary-orange)',
                  background: 'rgba(231, 73, 4, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-orange)',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  4
                </div>
                <div className="step-card-text">
                  <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff' }}>
                    وفتحنا حساباتنا في منصات التواصل الاجتماعي.
                  </span>
                </div>
              </div>
            </div>

            <div style={{ 
              textAlign: 'center', 
              background: 'linear-gradient(90deg, rgba(231,73,4,0.08) 0%, rgba(20,20,20,0.5) 100%)', 
              borderRight: '4px solid var(--primary-orange)', 
              borderLeft: '1px solid rgba(255,255,255,0.03)', 
              borderTop: '1px solid rgba(255,255,255,0.03)', 
              borderBottom: '1px solid rgba(255,255,255,0.03)', 
              padding: '2rem', 
              borderRadius: '8px 20px 20px 8px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(5px)'
            }}>
              <p style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
                وهنا نقدر نقول: <span style={{ color: 'var(--primary-orange)' }}>»BENA TECH أصبحت حقيقة... يا رب لك الحمد.«</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How companies built */}
      <section className="scroll-section" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '120px 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.03)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal-el">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
              <span style={{ 
                color: 'var(--primary-orange)', 
                fontSize: '0.9rem', 
                fontWeight: 800,
                background: 'rgba(231, 73, 4, 0.08)',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '1px solid rgba(231, 73, 4, 0.2)'
              }}>03</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>كيف تُبنى الشركات؟</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem', marginTop: '3.5rem', marginBottom: '4rem' }}>
              <p style={{ fontSize: '1.5rem', color: 'var(--text-grey)', fontWeight: 300 }}>لكن خلنا نكون صريحين...</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-white)', lineHeight: 1.3 }}>
                الشركات ما تُبنى بالمؤسسين فقط.
              </h3>
              <p style={{ fontSize: '1.55rem', color: 'var(--text-grey)', lineHeight: 1.8, fontWeight: 300 }}>
                تُبنى بأشخاص مؤمنين بالشركة. مؤمنين بالفكرة.
              </p>
              <p style={{ fontSize: '1.45rem', color: 'var(--text-grey)', lineHeight: 1.8, fontWeight: 300 }}>
                يسعون لتطوير أنفسهم، وفي نفس الوقت يسعون لتطوير الشركة.
              </p>
            </div>

            <div className="quote-card">
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 10% 20%, rgba(231, 73, 4, 0.05) 0%, transparent 50%)', pointerEvents: 'none' }}></div>
              <div style={{ 
                position: 'absolute', 
                top: '-20px', 
                left: '30px', 
                fontSize: '12rem', 
                fontFamily: 'Georgia, serif', 
                color: 'rgba(231, 73, 4, 0.1)', 
                lineHeight: 1, 
                userSelect: 'none', 
                pointerEvents: 'none', 
                zIndex: 1 
              }}>
                ”
              </div>
              <p style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.6, position: 'relative', zIndex: 2 }}>
                »لن تنال حتى تستحق،<br />ولن تستحق حتى تسعى.«
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: We reached you */}
      <section className="scroll-section" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '120px 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.03)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal-el">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
              <span style={{ 
                color: 'var(--primary-orange)', 
                fontSize: '0.9rem', 
                fontWeight: 800,
                background: 'rgba(231, 73, 4, 0.08)',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '1px solid rgba(231, 73, 4, 0.2)'
              }}>04</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>وهنا وصلنا إليك...</h2>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
              <div className="card-momayaz">
                <div style={{ position: 'absolute', bottom: '-12px', left: '-5px', fontSize: '5.5rem', fontWeight: 900, color: 'rgba(245, 158, 11, 0.03)', zIndex: 1, userSelect: 'none', pointerEvents: 'none', fontFamily: "'Outfit', sans-serif" }}>01</div>
                <div className="card-icon-wrapper" style={{ zIndex: 2 }}>
                  <Sparkles size={20} />
                </div>
                <span style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-white)', display: 'block', letterSpacing: '-0.02em', position: 'relative', zIndex: 2 }}>يا مميز.</span>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-grey)', marginTop: '0.6rem', marginBottom: 0, fontWeight: 400, position: 'relative', zIndex: 2 }}>حضور فريد وشغف استثنائي</p>
              </div>
              <div className="card-qawi">
                <div style={{ position: 'absolute', bottom: '-12px', left: '-5px', fontSize: '5.5rem', fontWeight: 900, color: 'rgba(231, 73, 4, 0.03)', zIndex: 1, userSelect: 'none', pointerEvents: 'none', fontFamily: "'Outfit', sans-serif" }}>02</div>
                <div className="card-icon-wrapper" style={{ zIndex: 2 }}>
                  <Zap size={20} />
                </div>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-orange)', display: 'block', letterSpacing: '-0.02em', position: 'relative', zIndex: 2 }}>يا قوي.</span>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '0.6rem', marginBottom: 0, fontWeight: 500, position: 'relative', zIndex: 2 }}>إصرار وعزيمة تصنع الفارق</p>
              </div>
              <div className="card-mobde">
                <div style={{ position: 'absolute', bottom: '-12px', left: '-5px', fontSize: '5.5rem', fontWeight: 900, color: 'rgba(139, 92, 246, 0.03)', zIndex: 1, userSelect: 'none', pointerEvents: 'none', fontFamily: "'Outfit', sans-serif" }}>03</div>
                <div className="card-icon-wrapper" style={{ zIndex: 2 }}>
                  <Lightbulb size={20} />
                </div>
                <span style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-white)', display: 'block', letterSpacing: '-0.02em', position: 'relative', zIndex: 2 }}>يا مبدع.</span>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-grey)', marginTop: '0.6rem', marginBottom: 0, fontWeight: 400, position: 'relative', zIndex: 2 }}>أفكار مبتكرة تبني المستقبل</p>
              </div>
            </div>

            <div style={{ 
              borderRight: '3px dashed rgba(231, 73, 4, 0.4)', 
              paddingRight: '2rem', 
              margin: '4rem 0', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.8rem', 
              color: 'var(--text-grey)', 
              fontSize: '1.45rem', 
              lineHeight: 1.8, 
              fontWeight: 300,
              textAlign: 'right'
            }}>
              <p style={{ margin: 0 }}>شفنا فيك الحماس، وشفنا فيك الشغف، ولسه متأكدين إننا بنشوف أكثر وأكثر.</p>
              <p style={{ margin: 0 }}>لأننا مؤمنين إن كل إنسان عنده الكثير من المميزات، لكنها تظهر في الوقت المناسب.</p>
              <p style={{ color: 'var(--text-white)', fontWeight: 700, margin: 0 }}>وعشان كذا اخترناك... عشان نتميز أكثر مع بعض، إن شاء الله.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4.5rem', width: '100%' }}>
              <div className="rocket-banner" style={{
              }}>
                <div style={{ 
                  background: 'rgba(231, 73, 4, 0.2)', 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Rocket className="rocket-icon" size={22} style={{ animation: 'bounce-rocket 2s infinite', transform: 'rotate(-45deg)', color: 'var(--primary-orange)' }} />
                </div>
                <span>فشد الحزام... وخلنا نقلع سوا إلى القمة!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: First Generation / Download */}
      <section className="scroll-section" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '120px 2rem 160px 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.03)'
      }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div className="reveal-el">
            <div className="download-card">
              {/* Background abstract radial glow inside card */}
              <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(231,73,4,0.08) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 2 }}>
                <img src="/logo.png" alt="BENA TECH" style={{ height: '35px', objectFit: 'contain' }} />
              </div>

              <h2 className="display-2" style={{ marginBottom: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', position: 'relative', zIndex: 2 }}>
                الجيل الأول
              </h2>

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '2.2rem', 
                color: 'var(--text-grey)', 
                fontSize: '1.5rem', 
                lineHeight: 1.9,
                fontWeight: 300,
                position: 'relative',
                zIndex: 2
              }}>
                <p style={{ textAlign: 'center', margin: 0 }}>يمكن إن BENA اليوم لا تزال في بدايتها...</p>
                <p style={{ textAlign: 'center', margin: 0 }}>لكن بعد أيام، أو شهور، أو سنوات بإذن الله، لما تكبر وتصبح أكبر بكثير مما هي عليه اليوم...</p>
                <p style={{ textAlign: 'center', margin: 0 }}>بتقدر تلتفت وتقول بكل فخر:</p>
                
                <h3 style={{ 
                  fontSize: '2.8rem', 
                  color: '#fff', 
                  fontWeight: 900, 
                  marginTop: '1.5rem', 
                  textAlign: 'center',
                  textShadow: '0 0 45px rgba(231, 73, 4, 0.35)',
                  lineHeight: 1.4,
                  margin: 0
                }}>
                  «كنت من الجيل الأول في <span style={{ color: 'var(--primary-orange)' }}>BENA TECH</span>.»
                </h3>
              </div>

              {/* Space + Divider line */}
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '4rem 0 3rem 0', position: 'relative', zIndex: 2 }}></div>

              {/* Agreement Download Button pointing directly to PDF asset */}
              <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                <a 
                  href="/Bena_Tech_Training_Agreement.pdf"
                  download="Bena_Tech_Training_Agreement.pdf"
                  className="btn pulse-button"
                  style={{ 
                    fontSize: '1.3rem', 
                    padding: '1.4rem 4rem', 
                    gap: '12px', 
                    background: 'linear-gradient(90deg, var(--primary-orange) 0%, #ff6c2f 100%)',
                    color: 'white',
                    fontWeight: 800,
                    border: 'none',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: 'scale(1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Download size={22} />
                  <span>تحميل اتفاقية التدريب</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        padding: '5rem 2rem 4rem 2rem',
        background: '#040404',
        position: 'relative',
        zIndex: 10
      }} dir="ltr">
        <div className="container" style={{ 
          maxWidth: '1200px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '3rem',
          textAlign: 'left'
        }}>
          {/* Logo Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <img src="/logo.png" alt="BENA" style={{ height: '24px', width: 'fit-content', objectFit: 'contain' }} />
            <p style={{ color: 'var(--text-grey)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '280px', margin: 0 }}>
              From first idea to scaled operation. We build high-performance systems designed to endure.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
              <span style={{ 
                border: '1px solid rgba(231, 73, 4, 0.3)', 
                color: 'var(--primary-orange)', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '0.75rem',
                fontWeight: 700,
                background: 'rgba(231, 73, 4, 0.05)',
                letterSpacing: '0.05em'
              }}>C.R.</span>
              <span style={{ color: 'var(--text-grey)', fontSize: '0.9rem' }}>7054745042</span>
            </div>
            <p style={{ color: '#555', fontSize: '0.85rem', marginTop: '1.5rem', margin: 0 }}>
              &copy; 2026 Bena Tech. All rights reserved.
            </p>
          </div>

          {/* Email / Whatsapp Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.6rem' }}>EMAIL US</h4>
              <a href="mailto:info@bena-tech.com" style={{ color: 'var(--text-grey)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-grey)'}>
                info@bena-tech.com
              </a>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.6rem' }}>WHATSAPP</h4>
              <a href="https://wa.me/966502600558" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-grey)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-grey)'}>
                +966 50 260 0558
              </a>
            </div>
          </div>

          {/* Location Column */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.6rem' }}>LOCATION</h4>
            <p style={{ color: 'var(--text-grey)', fontSize: '0.95rem', margin: 0 }}>
              Saudi Arabia, Jeddah
            </p>
          </div>

          {/* Socials Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.6rem' }}>X (TWITTER)</h4>
              <a href="https://x.com/bena_tech?s=11&t=gfGcupOvStZcN-39cfpEpQ" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-grey)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-grey)'}>
                @bena_tech
              </a>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.6rem' }}>LINKEDIN</h4>
              <a href="https://www.linkedin.com/company/bena-tech/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-grey)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-grey)'}>
                Bena Tech
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Story;
