import { useState, useRef, useEffect, useCallback } from 'react';
import '../landing.css';

/* ─────────────────────────────────────────────────────────────────────────────
   Scroll-animation CSS injected once — keeps landing.css untouched.
   .anim-on-scroll   → invisible + shifted down
   .anim-on-scroll.is-visible → fades+slides into place
───────────────────────────────────────────────────────────────────────────── */
const ANIM_STYLE = `
  .anim-on-scroll {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s cubic-bezier(0.4,0,0.2,1),
                transform 0.65s cubic-bezier(0.4,0,0.2,1);
  }
  .anim-on-scroll.anim-delay-1 { transition-delay: 0.10s; }
  .anim-on-scroll.anim-delay-2 { transition-delay: 0.20s; }
  .anim-on-scroll.anim-delay-3 { transition-delay: 0.30s; }
  .anim-on-scroll.anim-delay-4 { transition-delay: 0.40s; }
  .anim-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @keyframes heroSlideUp {
    from { opacity:0; transform:translateY(32px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes heroSlideRight {
    from { opacity:0; transform:translateX(-24px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes heroFadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes statFloat {
    0%,100% { transform:translateY(0) rotate(0deg); }
    50%     { transform:translateY(-8px) rotate(0.6deg); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .hero-content { animation: heroSlideRight 0.8s cubic-bezier(0.4,0,0.2,1) both; }
  .hero-image   { animation: heroFadeIn 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s both; }
  .hero-tag     { animation: heroSlideUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.05s both; }
  .hero-title   { animation: heroSlideUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.15s both; }
  .hero-description { animation: heroSlideUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.25s both; }
  .hero-actions { animation: heroSlideUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.35s both; }
  .hero-trust-bar { animation: heroSlideUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.45s both; }
  .hero-stat-card { animation: statFloat 5s ease-in-out infinite; }
  .hero-stat-card:nth-child(2) { animation-delay: -2.5s; }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Static data (avoids re-creating on every render)
───────────────────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'how-we-work', label: 'How It Works' },
  { id: 'about', label: 'About Us' },
  { id: 'careers', label: 'Careers' },
];

const SERVICES = [
  {
    img: '/images/Project-loan.webp',
    title: 'Project Loan',
    desc: 'Fund your construction or development projects with competitive rates and flexible repayment structures tailored to your timeline.',
  },
  {
    img: '/images/Business-loan.webp',
    title: 'Business Loan',
    desc: 'Accelerate growth with fast working capital, equipment financing, and expansion loans — minimal paperwork, maximum speed.',
  },
  {
    img: '/images/Home-loan.webp',
    title: 'Home Loan',
    desc: 'Make your dream home a reality with affordable interest rates, long tenures, and disbursals as fast as 48 hours.',
  },
  {
    img: '/images/Personal-loan.webp',
    title: 'Personal Loan',
    desc: 'Handle any personal expense — medical, travel, or wedding — with zero collateral and a quick fully-digital approval.',
  },
];

const STEPS = [
  {
    img: '/images/StepApplication.webp',
    num: '01',
    title: 'Submit Application',
    desc: 'Fill our simple online form in under 5 minutes. Basic personal and financial details are all we need — no branch visit required.',
    reverse: false,
  },
  {
    img: '/images/StepDocVerification.webp',
    num: '02',
    title: 'Document Verification',
    desc: 'Upload your ID, income proof, and bank statements digitally. Our experts verify everything within 24 hours via secure encrypted channels.',
    reverse: true,
  },
  {
    img: '/images/StepCredit.webp',
    num: '03',
    title: 'Credit Assessment',
    desc: 'We evaluate your credit profile using fair, transparent criteria — analyzing income stability, repayment capacity, and financial history.',
    reverse: false,
  },
  {
    img: '/images/StepLoanApproval.webp',
    num: '04',
    title: 'Loan Approved & Disbursed',
    desc: 'Funds are credited directly to your bank account. Your digital agreement is fully transparent with all terms, EMIs, and schedules.',
    reverse: true,
  },
];

const STATS = [
  { num: '5,000+', label: 'Happy Customers' },
  { num: '₹300Cr+', label: 'Loans Disbursed' },
  { num: '3+', label: 'Years Experience' },
  { num: '99.99%', label: 'Approval Rate' },
];

const CONTACT_INFO = [
  { icon: '📍', title: 'Our Office', detail: '533, 5th Floor, Mangalam Fun Square, Durga Nursery Road, Udaipur, Rajasthan' },
  { icon: '📞', title: 'Call Us', detail: '+91 8890120514, +91 6376650799' },
  { icon: '✉️', title: 'Email Us', detail: 'shreejiquickfunds6@gmail.com' },
  { icon: '🕐', title: 'Working Hours', detail: 'Mon – Sat: 9:00 AM – 6:00 PM' },
];

const LOAN_TYPES = ['Personal Loan', 'Business Loan', 'Project Loan', 'Home Loan', 'Vehicle Loan', 'Education Loan', 'Gold Loan'];

const POSITIONS = ['Loan Officer', 'Relationship Manager', 'Credit Analyst', 'Branch Manager', 'Marketing Executive', 'Customer Support', 'IT / Developer', 'Other'];

const EXPERIENCE_LEVELS = ['Fresher (0 years)', '1–2 years', '3–5 years', '5–10 years', '10+ years'];


/* ─────────────────────────────────────────────────────────────────────────────
   Reusable SVG arrow icon
───────────────────────────────────────────────────────────────────────────── */
const ArrowIcon = ({ size = 15, style }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ═════════════════════════════════════════════════════════════════════════════
   LANDING PAGE COMPONENT
═════════════════════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  /* ── UI State ── */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [navScrolled, setNavScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* ── Form State ── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [careerSubmitted, setCareerSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [contactForm, setContactForm] = useState({
    name: '', phone: '', email: '', loanType: '', message: '',
  });

  const [careerForm, setCareerForm] = useState({
    name: '', email: '', phone: '', position: '', experience: '', message: '',
  });

  const fileInputRef = useRef(null);

  /* ── Inject scroll-animation styles once ── */
  useEffect(() => {
    const tag = document.createElement('style');
    tag.innerHTML = ANIM_STYLE;
    tag.id = 'sjqf-anim-styles';
    if (!document.getElementById('sjqf-anim-styles')) document.head.appendChild(tag);
    return () => { const el = document.getElementById('sjqf-anim-styles'); if (el) el.remove(); };
  }, []);

  /* ── Scroll: nav shadow, progress bar, active section ── */
  useEffect(() => {
    const SECTION_IDS = ['hero', 'services', 'how-we-work', 'about', 'contact', 'careers'];

    const onScroll = () => {
      const y = window.scrollY;
      const maxY = document.documentElement.scrollHeight - window.innerHeight;

      setScrollProgress(maxY > 0 ? (y / maxY) * 100 : 0);
      setNavScrolled(y > 48);

      // Determine active section (check from bottom up)
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el && el.getBoundingClientRect().top <= 90) {
          setActiveSection(SECTION_IDS[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── IntersectionObserver: reveal .anim-on-scroll elements ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.anim-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Smooth scroll utility ── */
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // nav height offset
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  }, []);

  /* ── Form handlers ── */
  const handleContactChange = (e) =>
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCareerChange = (e) =>
    setCareerForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type)) {
      alert('Please upload a PDF or DOCX file only.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5 MB.');
      e.target.value = '';
      return;
    }
    setResumeFile(file);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const { name, phone, loanType } = contactForm;
    if (!name.trim() || !phone.trim() || !loanType) {
      alert('Please fill in Name, Phone Number, and Loan Type.');
      return;
    }
    const text =
      `🏦 New Loan Inquiry — Shree Ji QuickFunds\n\n` +
      `👤 Name: ${contactForm.name}\n` +
      `📞 Phone: ${contactForm.phone}\n` +
      `📧 Email: ${contactForm.email || 'Not provided'}\n` +
      `💰 Loan Type: ${contactForm.loanType}\n` +
      `📝 Message: ${contactForm.message || 'None'}`;
    window.open(
      `https://api.whatsapp.com/send?phone=918890120514&text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setContactForm({ name: '', phone: '', email: '', loanType: '', message: '' });
  };

  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!resumeFile) { alert('Please upload your resume.'); return; }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(careerForm).forEach(([k, v]) => formData.append(k, v));
      formData.append('resume', resumeFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/career`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setCareerSubmitted(true);
        setCareerForm({ name: '', email: '', phone: '', position: '', experience: '', message: '' });
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert('❌ Submission failed. Please try again or call us directly.');
      }
    } catch (err) {
      console.error('Career submit error:', err);
      alert('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ──────────────────────────────────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="landing">

      {/* ── Scroll Progress Bar ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          width: `${scrollProgress}%`,
          zIndex: 9999,
          pointerEvents: 'none',
          background: 'linear-gradient(90deg, #091e44 0%, #e8b84b 60%, #d4971f 100%)',
          transition: 'width 0.12s linear',
          boxShadow: '0 0 8px rgba(232,184,75,0.5)',
        }}
      />

      {/* ════════════════════════ NAVBAR ════════════════════════ */}
      <nav className={`landing-nav${navScrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="landing-container nav-inner">

          {/* Brand */}
          <a href="/" className="nav-brand" aria-label="Shree Ji QuickFunds — Home">
            <span className="brand-text">
              Shree Ji&nbsp;<span className="brand-highlight">QuickFunds</span>
            </span>
          </a>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="main-nav-links"
          >
            <span className={`hamburger${mobileMenuOpen ? ' open' : ''}`} aria-hidden="true" />
          </button>

          {/* Nav Links */}
          <ul
            id="main-nav-links"
            className={`nav-links${mobileMenuOpen ? ' show' : ''}`}
            role="menubar"
          >
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id} role="none">
                <a
                  role="menuitem"
                  tabIndex={0}
                  className={`nav-link-item${activeSection === id ? ' active' : ''}`}
                  onClick={() => scrollTo(id)}
                  onKeyDown={(e) => e.key === 'Enter' && scrollTo(id)}
                  aria-current={activeSection === id ? 'page' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
            <li role="none">
              <a
                role="menuitem"
                tabIndex={0}
                className="nav-cta-btn"
                onClick={() => scrollTo('contact')}
                onKeyDown={(e) => e.key === 'Enter' && scrollTo('contact')}
              >
                Get a Loan
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section id="hero" className="hero-section" aria-label="Hero — Quick loan solutions">
        <div className="landing-container hero-grid">

          {/* Left: copy */}
          <div className="hero-content">


            <h1 className="hero-title">
              Fast &amp; Reliable<br />
              <em>Financial Solutions</em><br />
              For Every Dream
            </h1>

            <p className="hero-description">
              From home ownership to business expansion — Shree Ji QuickFunds delivers
              instant approvals, transparent terms, and funds right when you need them most.
              No long queues. No hidden charges.
            </p>

            <div className="hero-actions">
              <button
                onClick={() => scrollTo('services')}
                className="hero-cta-primary"
                aria-label="Explore our loan products"
              >
                Explore Loans <ArrowIcon />
              </button>
              <button
                onClick={() => scrollTo('how-we-work')}
                className="hero-cta-secondary"
                aria-label="Learn how our loan process works"
              >
                How It Works
              </button>
            </div>

            <div className="hero-trust-bar" role="list" aria-label="Trust indicators">
              {[
                { icon: '✓', text: 'RBI Guidelines Compliant' },
                { icon: '✓', text: 'Bank-Grade Security' },
                { icon: '✓', text: 'Approval in 48 Hrs' },
              ].map(({ icon, text }) => (
                <div className="trust-item" key={text} role="listitem">
                  <span
                    style={{ color: '#059669', fontWeight: 700, fontSize: '1rem' }}
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: image + floating stat cards */}
          <div className="hero-image" aria-hidden="true">
            {/* <div
              className="hero-stat-card"
              style={{ position: 'absolute', top: '10%', right: '-4%', zIndex: 2 }}
            >
              <div className="stat-number">98%</div>
              <div className="stat-label">Approval Rate</div>
            </div> */}

            {/* <div
              className="hero-stat-card"
              style={{ position: 'absolute', bottom: '16%', left: '-6%', zIndex: 2 }}
            >
              <div className="stat-number">₹50Cr+</div>
              <div className="stat-label">Disbursed</div>
            </div> */}

            <img
              src="/home.png"
              alt="Premium banking and finance illustration"
              loading="eager"
              width={540}
              height={480}
              style={{ maxWidth: '100%', height: 'auto', maxHeight: 500, objectFit: 'contain', position: 'relative', zIndex: 1 }}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════ SERVICES ════════════════════════ */}
      <section id="services" className="services-section" aria-labelledby="services-heading">
        <div className="landing-container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-eyebrow" aria-hidden="true">What We Offer</span>
            <h2 className="section-title" id="services-heading">
              Our <em>Loan</em> Products
            </h2>
            <p className="section-subtitle">
              Flexible financing solutions crafted for every milestone — personal, professional, and beyond.
            </p>
          </div>

          <div className="services-grid" role="list">
            {SERVICES.map(({ img, title, desc }, i) => (
              <div
                className={`service-card anim-on-scroll anim-delay-${(i % 4) + 1}`}
                key={title}
                role="listitem"
              >
                <div className="service-image">
                  <img src={img} alt={`${title} illustration`} loading="lazy" width={400} height={190} />
                </div>
                <div className="service-content">
                  <h3>{title}</h3>
                  <p>{desc}</p>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ HOW WE WORK ════════════════════════ */}
      <section id="how-we-work" className="how-section" aria-labelledby="how-heading">
        <div className="landing-container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-eyebrow" aria-hidden="true">The Process</span>
            <h2 className="section-title" id="how-heading">
              How It <em>Works</em>
            </h2>
            <p className="section-subtitle">
              From application to disbursal in as little as 48 hours.
              Four transparent steps stand between you and your funds.
            </p>
          </div>

          <div className="process-steps">
            {STEPS.map(({ img, num, title, desc, reverse }) => (
              <div
                className={`process-step anim-on-scroll${reverse ? ' reverse' : ''}`}
                key={num}
              >
                {reverse ? (
                  <>
                    <div className="step-content">
                      <span className="step-number" aria-hidden="true">{num}</span>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                    <div className="step-image">
                      <img src={img} alt={`Step ${num}: ${title}`} loading="lazy" width={290} height={240} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="step-image">
                      <img src={img} alt={`Step ${num}: ${title}`} loading="lazy" width={290} height={240} />
                    </div>
                    <div className="step-content">
                      <span className="step-number" aria-hidden="true">{num}</span>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ ABOUT ════════════════════════ */}
      <section id="about" className="about-section" aria-labelledby="about-heading">
        <div className="landing-container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-eyebrow" aria-hidden="true">Who We Are</span>
            <h2 className="section-title" id="about-heading">
              About <em>Us</em>
            </h2>
          </div>

          <div className="about-grid">
            <div className="about-content anim-on-scroll">
              <p>
                <strong>Shree Ji QuickFunds</strong> is a trusted financial services company
                headquartered in Udaipur, Rajasthan, dedicated to delivering quick and
                hassle-free loan solutions to individuals and businesses of every scale.
              </p>
              <p>
                With over a decade of expertise in the lending industry, we have empowered
                thousands of customers to convert aspirations into achievements — be it a
                dream home, a thriving business, or navigating life's unexpected turns with
                confidence.
              </p>
              <p>
                Our technology-driven, people-first process ensures minimal documentation,
                lightning-fast approvals, and complete transparency at every step. We
                believe financial support should be accessible, fair, and genuinely human.
              </p>
              <button
                className="about-cta"
                onClick={() => scrollTo('contact')}
                aria-label="Talk to a loan expert"
              >
                Talk to an Expert <ArrowIcon />
              </button>
            </div>

            <div className="about-stats" role="list" aria-label="Key statistics">
              {STATS.map(({ num, label }, i) => (
                <div
                  className={`about-stat-card anim-on-scroll anim-delay-${i + 1}`}
                  key={label}
                  role="listitem"
                >
                  <h3>{num}</h3>
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ CONTACT ════════════════════════ */}
      <section id="contact" className="contact-section" aria-labelledby="contact-heading">
        <div className="landing-container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-eyebrow" aria-hidden="true">Reach Out</span>
            <h2 className="section-title" id="contact-heading">
              Contact <em>Us</em>
            </h2>
            <p className="section-subtitle">
              Ready to take the next step? Fill out the form and our team will reach out
              within 2 business hours via WhatsApp or call.
            </p>
          </div>

          <div className="contact-grid">
            {/* Contact Form */}
            <form
              className="contact-form anim-on-scroll"
              onSubmit={handleContactSubmit}
              noValidate
              aria-label="Loan inquiry form"
            >
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="cf-name">Full Name <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    id="cf-name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="cf-phone">Phone Number <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    id="cf-phone"
                    type="tel"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="cf-email">Email Address</label>
                <input
                  id="cf-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  autoComplete="email"
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="cf-loan">Loan Type <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span></label>
                <select
                  id="cf-loan"
                  name="loanType"
                  value={contactForm.loanType}
                  onChange={handleContactChange}
                  required
                >
                  <option value="">Select loan type</option>
                  {LOAN_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="contact-form-group">
                <label htmlFor="cf-msg">Message</label>
                <textarea
                  id="cf-msg"
                  rows={4}
                  name="message"
                  placeholder="Tell us your loan requirement, amount needed, timeline, etc."
                  value={contactForm.message}
                  onChange={handleContactChange}
                />
              </div>

              <button type="submit" className="contact-submit-btn" aria-label="Send inquiry via WhatsApp">
                Send via WhatsApp
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 6, flexShrink: 0 }} aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
            </form>

            {/* Contact Info Cards */}
            <div className="contact-info" role="list">
              {CONTACT_INFO.map(({ icon, title, detail }) => (
                <div className="contact-info-card anim-on-scroll" key={title} role="listitem">
                  <div className="contact-info-icon" aria-hidden="true">{icon}</div>
                  <div>
                    <h4>{title}</h4>
                    <p>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ CAREERS ════════════════════════ */}
      <section id="careers" className="careers-section" aria-labelledby="careers-heading">
        <div className="landing-container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-eyebrow" aria-hidden="true">Join The Team</span>
            <h2 className="section-title" id="careers-heading">
              Build Your <em>Career</em>
            </h2>
            <p className="section-subtitle">
              Join a fast-growing fintech company in Udaipur and make a real difference
              in people's financial lives every single day.
            </p>
          </div>

          {/* Why Work With Us */}
          <div className="careers-intro">
            <div className="careers-intro-content">
              <h3>Why Work With Us?</h3>
              <p>
                At <strong>Shree Ji QuickFunds</strong>, we invest in our people as much as we
                invest in our customers. Every role carries real impact, a clear growth path,
                and a culture built on trust, transparency, and shared success.
              </p>
            </div>
          </div>

          {/* Application Form */}
          <div className="careers-form-wrapper anim-on-scroll">
            <h3>Apply Now</h3>
            <p className="careers-form-desc">
              Fill out the form and attach your resume. We typically respond within 3 business days.
            </p>

            {careerSubmitted && (
              <div className="career-success-msg" role="alert">
                ✅ Application submitted successfully! We'll be in touch with you very soon.
              </div>
            )}

            <form
              className="careers-form"
              onSubmit={handleCareerSubmit}
              noValidate
              aria-label="Job application form"
            >
              {/* Row 1: Name + Email */}
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="cr-name">Full Name <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    id="cr-name"
                    type="text"
                    name="name"
                    value={careerForm.name}
                    onChange={handleCareerChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="cr-email">Email Address <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    id="cr-email"
                    type="email"
                    name="email"
                    value={careerForm.email}
                    onChange={handleCareerChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Phone + Position */}
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="cr-phone">Phone Number <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    id="cr-phone"
                    type="tel"
                    name="phone"
                    value={careerForm.phone}
                    onChange={handleCareerChange}
                    placeholder="+91 XXXXX XXXXX"
                    autoComplete="tel"
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="cr-pos">Position Applied For <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span></label>
                  <select
                    id="cr-pos"
                    name="position"
                    value={careerForm.position}
                    onChange={handleCareerChange}
                    required
                  >
                    <option value="">Select a position</option>
                    {POSITIONS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Experience */}
              <div className="contact-form-group">
                <label htmlFor="cr-exp">Years of Experience</label>
                <select
                  id="cr-exp"
                  name="experience"
                  value={careerForm.experience}
                  onChange={handleCareerChange}
                >
                  <option value="">Select experience level</option>
                  {EXPERIENCE_LEVELS.map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>

              {/* Resume Upload */}
              <div className="contact-form-group">
                <label htmlFor="cr-resume">
                  Resume / CV&nbsp;
                  <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
                  &nbsp;<span className="career-note">(PDF or DOCX · max 5 MB)</span>
                </label>
                <div
                  className="file-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  aria-label={resumeFile ? `Selected file: ${resumeFile.name}` : 'Click to upload resume'}
                >
                  <input
                    type="file"
                    id="cr-resume"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeChange}
                    style={{ display: 'none' }}
                  />

                  {resumeFile ? (
                    <div className="file-selected">
                      <span className="file-icon" aria-hidden="true">📄</span>
                      <div>
                        <p className="file-name">{resumeFile.name}</p>
                        <p className="file-size">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        type="button"
                        className="file-remove"
                        aria-label="Remove selected file"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="file-placeholder">
                      <span className="upload-icon" aria-hidden="true">📁</span>
                      <p>Click to browse or drag &amp; drop your resume</p>
                      <span className="file-types">PDF · DOC · DOCX — Max 5 MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Note */}
              <div className="contact-form-group">
                <label htmlFor="cr-msg">
                  Cover Note&nbsp;
                  <span style={{ color: 'var(--text-ghost, #a0b0c5)', fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  id="cr-msg"
                  name="message"
                  value={careerForm.message}
                  onChange={handleCareerChange}
                  rows={3}
                  placeholder="Tell us why you'd be a great fit for this role..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="contact-submit-btn career-submit-btn"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}
                    />
                    Submitting…
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer className="landing-footer" role="contentinfo">
        <div className="landing-container footer-inner">

          <div className="footer-brand">
            <span className="brand-text">
              Shree Ji&nbsp;<span className="brand-highlight">QuickFunds</span>
            </span>
            <p className="footer-desc">
              Empowering financial freedom through fast, transparent, and trusted loan
              solutions across Rajasthan — since 2024.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Quick Links</h4>
            {[
              ['hero', 'Home'],
              ['services', 'Services'],
              ['how-we-work', 'How It Works'],
              ['about', 'About Us'],
              ['contact', 'Contact Us'],
              ['careers', 'Careers'],
            ].map(([id, label]) => (
              <a
                key={id}
                onClick={() => scrollTo(id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && scrollTo(id)}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="footer-links-group">
            <h4>Loan Products</h4>
            {['Personal Loan', 'Business Loan', 'Project Loan', 'Home Loan', 'Vehicle Loan', 'Education Loan'].map((s) => (
              <a
                key={s}
                onClick={() => scrollTo('services')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && scrollTo('services')}
              >
                {s}
              </a>
            ))}
          </div>

          <div className="footer-links-group">
            <h4>Get In Touch</h4>
            <p>📍 533, 5th Floor, Mangalam Fun Square, Durga Nursery Road, Udaipur, Rajasthan</p>
            <p>📞 +91 8890120514, +91 6376650799</p>
            <p>✉️ shreejiquickfunds6@gmail.com</p>
            <p>🕐 Mon – Sat: 9:00 AM – 6:00 PM</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Shree Ji QuickFunds. All rights reserved. | Made with ♥ in Udaipur</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;