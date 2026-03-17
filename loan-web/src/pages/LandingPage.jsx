import { useState, useRef } from 'react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [careerForm, setCareerForm] = useState({
    name: '', email: '', phone: '', position: '', experience: '', message: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [careerSubmitted, setCareerSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handleCareerChange = (e) => {
    setCareerForm({ ...careerForm, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(file.type)) {
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
    }
  };

  const handleCareerSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, position, experience, message } = careerForm;
    const mailBody = `Career Application%0D%0A%0D%0AName: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0APosition: ${position}%0D%0AExperience: ${experience}%0D%0AMessage: ${message}%0D%0AResume: ${resumeFile ? resumeFile.name : 'Not attached (please attach via email)'}%0D%0A%0D%0ANote: Please attach your resume to this email.`;
    window.location.href = `mailto:manishmenariya2001@gmail.com?subject=Career Application - ${position}&body=${mailBody}`;
    setCareerSubmitted(true);
    setTimeout(() => setCareerSubmitted(false), 5000);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="landing">
      {/* ========== NAVBAR ========== */}
      <nav className="landing-nav">
        <div className="landing-container nav-inner">
          <a href="/" className="nav-brand">
            <span className="brand-text">Shree Ji <span className="brand-highlight">QuickFunds</span></span>
          </a>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
            <li><a onClick={() => scrollTo('hero')} className="nav-link-item active">Home</a></li>
            <li><a onClick={() => scrollTo('services')} className="nav-link-item">Services</a></li>
            <li><a onClick={() => scrollTo('how-we-work')} className="nav-link-item">How we work?</a></li>
            <li><a onClick={() => scrollTo('about')} className="nav-link-item">About Us</a></li>
            <li><a onClick={() => scrollTo('careers')} className="nav-link-item">Careers</a></li>
            <li>
              <a onClick={() => scrollTo('contact')} className="nav-cta-btn">Contact us</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section id="hero" className="hero-section">
        <div className="landing-container hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Quick and Easy<br />
              Loans for Your<br />
              Financial Needs.
            </h1>
            <p className="hero-description">
              Our loan services offer a hassle-free and streamlined borrowing
              experience, providing you with the funds you need in a timely
              manner to meet your financial requirements.
            </p>
            <a onClick={() => scrollTo('services')} className="hero-cta">Get started</a>
          </div>
          <div className="hero-image">
            <img src="/images/hero-bank.png" alt="Banking illustration" />
          </div>
        </div>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section id="services" className="services-section">
        <div className="landing-container">
          <h2 className="section-title">Our Services</h2>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <img src="/images/icon-project.png" alt="Project Loan" />
              </div>
              <h3>Project loan</h3>
              <p>Project Loan Services provide financing options for individuals & businesses to purchase a vehicle.</p>
              <a className="service-apply-btn" onClick={() => scrollTo('contact')}>Apply now</a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="/images/icon-personal.png" alt="Personal Loan" />
              </div>
              <h3>Personal loan</h3>
              <p>Personal loans provide borrowers with flexibility in how they use the funds.</p>
              <a className="service-apply-btn" onClick={() => scrollTo('contact')}>Apply now</a>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <img src="/images/icon-business.png" alt="Business Loan" />
              </div>
              <h3>Business loan</h3>
              <p>Business Loan Services provide financial assistance to businesses for various purposes.</p>
              <a className="service-apply-btn" onClick={() => scrollTo('contact')}>Apply now</a>
            </div>

            
          </div>

          <div className="services-more">
            <a onClick={() => scrollTo('contact')} className="view-more-btn">View more</a>
          </div>
        </div>
      </section>

      {/* ========== HOW WE WORK SECTION ========== */}
      <section id="how-we-work" className="how-section">
        <div className="landing-container">
          <h2 className="section-title">How we works ?</h2>
          <p className="section-subtitle">This is a process, how you can get loan for your self.</p>

          <div className="process-steps">
            {/* Step 1 */}
            <div className="process-step">
              <div className="step-image">
                <img src="/images/step-application.png" alt="Application Process" />
              </div>
              <div className="step-content">
                <div className="step-number">01</div>
                <h3>Application</h3>
                <p>
                  The borrower submits a loan application to the bank,
                  either in person, online, or through other channels.
                  The application includes personal and financial
                  information, such as income, employment history,
                  credit score, and the purpose of the loan.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="process-step reverse">
              <div className="step-content">
                <div className="step-number">02</div>
                <h3>Documentation and Verification</h3>
                <p>
                  The bank requests supporting documents from the borrower,
                  such as identification proof, income statements, bank
                  statements, and collateral details (if applicable). The bank
                  verifies the information provided to assess the borrower's
                  creditworthiness and eligibility for the loan.
                </p>
              </div>
              <div className="step-image">
                <img src="/images/step-documentation.png" alt="Documentation" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="process-step">
              <div className="step-image">
                <img src="/images/step-credit.png" alt="Credit Assessment" />
              </div>
              <div className="step-content">
                <div className="step-number">03</div>
                <h3>Credit Assessment</h3>
                <p>
                  The bank conducts a credit assessment to evaluate the
                  borrower's creditworthiness and ability to repay the loan. This
                  process involves analyzing the borrower's credit history,
                  income stability, debt-to-income ratio, and other factors.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="process-step reverse">
              <div className="step-content">
                <div className="step-number">04</div>
                <h3>Loan Approval</h3>
                <p>
                  If the borrower meets the bank's lending criteria and passes
                  the credit assessment, the loan is approved. The bank
                  determines the loan amount, interest rate, repayment term,
                  and any associated fees.
                </p>
              </div>
              <div className="step-image">
                <img src="/images/step-approval.png" alt="Loan Approval" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT SECTION ========== */}
      <section id="about" className="about-section">
        <div className="landing-container">
          <h2 className="section-title">About Us</h2>
          <div className="about-grid">
            <div className="about-content">
              <p>
                <strong>Shree Ji QuickFunds</strong> is a trusted financial services company
                dedicated to providing quick and hassle-free loan solutions. We understand
                that financial needs can arise unexpectedly, and our mission is to bridge
                the gap between your aspirations and financial reality.
              </p>
              <p>
                With years of experience in the lending industry, we have helped thousands
                of individuals and businesses achieve their financial goals. Our streamlined
                process ensures minimal paperwork and fast disbursement so you can focus on
                what truly matters.
              </p>
            </div>
            <div className="about-stats">
              <div className="about-stat-card">
                <h3>5000+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="about-stat-card">
                <h3>₹50Cr+</h3>
                <p>Loans Disbursed</p>
              </div>
              <div className="about-stat-card">
                <h3>10+</h3>
                <p>Years Experience</p>
              </div>
              <div className="about-stat-card">
                <h3>98%</h3>
                <p>Approval Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTACT SECTION ========== */}
      <section id="contact" className="contact-section">
        <div className="landing-container">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">Get in touch with us for any loan inquiries.</p>

          <div className="contact-grid">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your name" />
                </div>
                <div className="contact-form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="Enter your phone number" />
                </div>
              </div>
              <div className="contact-form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" />
              </div>
              <div className="contact-form-group">
                <label>Loan Type</label>
                <select>
                  <option value="">Select loan type</option>
                  <option>Personal Loan</option>
                  <option>Business Loan</option>
                  <option>Project Loan</option>
                  <option>Home Loan</option>
                  <option>Vehicle Loan</option>
                  <option>Education Loan</option>
                  <option>Gold Loan</option>
                </select>
              </div>
              <div className="contact-form-group">
                <label>Message</label>
                <textarea rows="4" placeholder="Tell us about your requirements"></textarea>
              </div>
              <button type="submit" className="contact-submit-btn">Send Message</button>
            </form>

            <div className="contact-info">
              <div className="contact-info-card">
                <div className="contact-info-icon">📍</div>
                <div>
                  <h4>Our Office</h4>
                  <p>533, 5th Floor, Mangalam Fun Square, Durga Nursery Road, Udaipur, Rajasthan</p>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon">📞</div>
                <div>
                  <h4>Call Us</h4>
                  <p>+91 88901 20514</p>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon">✉️</div>
                <div>
                  <h4>Email Us</h4>
                  <p>manishmenariya2001@gmail.com</p>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon">🕐</div>
                <div>
                  <h4>Working Hours</h4>
                  <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CAREERS SECTION ========== */}
      <section id="careers" className="careers-section">
        <div className="landing-container">
          <h2 className="section-title">Careers</h2>
          <p className="section-subtitle">Join our growing team and make a difference in people's financial lives.</p>

          <div className="careers-intro">
            <div className="careers-intro-content">
              <h3>Why Work With Us?</h3>
              <p>
                At <strong>Shree Ji QuickFunds</strong>, we believe our team is our greatest asset.
                We are a fast-growing financial services company based in Udaipur, Rajasthan, and
                we're always looking for talented, driven individuals who want to build a career
                in the financial industry.
              </p>
              
            </div>
          </div>

          <div className="careers-form-wrapper">
            <h3>Apply Now</h3>
            <p className="careers-form-desc">Fill out the form below and attach your resume. We'll get back to you soon!</p>

            {careerSubmitted && (
              <div className="career-success-msg">
                ✅ Your email client should open with the application details. Please attach your resume and send the email.
              </div>
            )}

            <form className="careers-form" onSubmit={handleCareerSubmit}>
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="career-name">Full Name *</label>
                  <input type="text" id="career-name" name="name" value={careerForm.name} onChange={handleCareerChange} placeholder="Enter your full name" required />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="career-email">Email Address *</label>
                  <input type="email" id="career-email" name="email" value={careerForm.email} onChange={handleCareerChange} placeholder="Enter your email" required />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="career-phone">Phone Number *</label>
                  <input type="tel" id="career-phone" name="phone" value={careerForm.phone} onChange={handleCareerChange} placeholder="Enter your phone number" required />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="career-position">Position Applied For *</label>
                  <select id="career-position" name="position" value={careerForm.position} onChange={handleCareerChange} required>
                    <option value="">Select a position</option>
                    <option>Loan Officer</option>
                    <option>Relationship Manager</option>
                    <option>Credit Analyst</option>
                    <option>Branch Manager</option>
                    <option>Marketing Executive</option>
                    <option>Customer Support</option>
                    <option>IT / Developer</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="career-experience">Years of Experience</label>
                <select id="career-experience" name="experience" value={careerForm.experience} onChange={handleCareerChange}>
                  <option value="">Select experience</option>
                  <option>Fresher (0 years)</option>
                  <option>1-2 years</option>
                  <option>3-5 years</option>
                  <option>5-10 years</option>
                  <option>10+ years</option>
                </select>
              </div>

              <div className="contact-form-group">
                <label htmlFor="career-resume">Upload Resume (PDF / DOCX only, max 5 MB) *</label>
                <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
                  <input
                    type="file"
                    id="career-resume"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeChange}
                    required
                    style={{ display: 'none' }}
                  />
                  {resumeFile ? (
                    <div className="file-selected">
                      <span className="file-icon">📄</span>
                      <div>
                        <p className="file-name">{resumeFile.name}</p>
                        <p className="file-size">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button type="button" className="file-remove" onClick={(e) => { e.stopPropagation(); setResumeFile(null); fileInputRef.current.value = ''; }}>✕</button>
                    </div>
                  ) : (
                    <div className="file-placeholder">
                      <span className="upload-icon">📁</span>
                      <p>Click to browse or drag & drop your resume</p>
                      <span className="file-types">PDF, DOC, DOCX — Max 5 MB</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="career-message">Cover Note (optional)</label>
                <textarea id="career-message" name="message" value={careerForm.message} onChange={handleCareerChange} rows="3" placeholder="Tell us why you'd be a great fit..."></textarea>
              </div>

              <button type="submit" className="contact-submit-btn career-submit-btn">Submit Application ✉️</button>
              <p className="career-note">Your default email app will open with the details pre-filled. Please attach your resume file and send.</p>
            </form>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="landing-footer">
        <div className="landing-container footer-inner">
          <div className="footer-brand">
            <span className="brand-text">Shree Ji <span className="brand-highlight">QuickFunds</span></span>
            <p className="footer-desc">Quick and easy loan solutions for all your financial needs.</p>
          </div>
          <div className="footer-links-group">
            <h4>Quick Links</h4>
            <a onClick={() => scrollTo('hero')}>Home</a>
            <a onClick={() => scrollTo('services')}>Services</a>
            <a onClick={() => scrollTo('how-we-work')}>How We Work</a>
            <a onClick={() => scrollTo('about')}>About Us</a>
            <a onClick={() => scrollTo('contact')}>Contact Us</a>
            <a onClick={() => scrollTo('careers')}>Careers</a>
          </div>
          <div className="footer-links-group">
            <h4>Services</h4>
            <a href="#">Personal Loan</a>
            <a href="#">Business Loan</a>
            <a href="#">Project Loan</a>
            <a href="#">Home Loan</a>
            <a href="#">Vehicle Loan</a>
          </div>
          <div className="footer-links-group">
            <h4>Contact</h4>
            <p>📍 533, 5th Floor, Mangalam Fun Square, Durga Nursery Road, Udaipur, Rajasthan</p>
            <p>📞 +91 88901 20514</p>
            <p>✉️ manishmenariya2001@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Shree Ji QuickFunds. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
