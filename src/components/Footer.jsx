import React from 'react';
import { Mic, Sparkles, ArrowUp } from 'lucide-react';
import './Footer.css';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="section-container footer-container">
        <div className="footer-top-row">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="brand-logo footer-logo">
              <div className="logo-icon-wrapper footer-icon-wrapper">
                <Mic className="logo-icon" size={20} />
              </div>
              <div className="brand-text">
                <span className="brand-name">Speak<span>Up</span></span>
                <span className="brand-tagline">COMMUNICATE WITH CONFIDENCE</span>
              </div>
            </div>
            <p className="footer-tagline-text">
              The modern communication practice platform empowering students to speak confidently, think clearly, and excel in English.
            </p>
            <div className="footer-ai-badge">
              <Sparkles size={14} />
              <span>Version 1.0 • Built for rapid student fluency</span>
            </div>
          </div>

          {/* Nav Quick Links */}
          <div className="footer-links-col">
            <h5 className="footer-col-heading">Navigation</h5>
            <ul className="footer-links-list">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a></li>
              <li><a href="#practice" onClick={(e) => { e.preventDefault(); onNavigate('practice'); }}>Practice Dashboard</a></li>
              <li><a href="#practice-studio" onClick={(e) => { e.preventDefault(); onNavigate('practice-studio'); }}>Speaking Practice Studio</a></li>
              <li><a href="#challenges" onClick={(e) => { e.preventDefault(); onNavigate('challenges'); }}>Daily Challenge</a></li>
              <li><a href="#progress" onClick={(e) => { e.preventDefault(); onNavigate('progress'); }}>Progress Tracker</a></li>
              <li><a href="#profile" onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}>Student Profile</a></li>
            </ul>
          </div>

          {/* Student Tips */}
          <div className="footer-tips-col">
            <h5 className="footer-col-heading">Daily Speaking Tip</h5>
            <div className="footer-tip-card">
              <p className="tip-quote">
                "Don't worry about being perfect. Focus on rhythm, expressing one idea at a time, and maintaining a steady pace."
              </p>
              <span className="tip-author">— SpeakUp Coach Note</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} SpeakUp. Designed for student excellence and fluent communication.
          </p>
          <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top of page">
            <span>Back to top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
