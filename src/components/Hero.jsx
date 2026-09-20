import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Play, Sparkles, TrendingUp, Award, MessageCircle, 
  Zap, RotateCcw, Menu, ChevronDown, Mic, Bot, Briefcase, 
  Theater, BookOpen, Compass, BarChart2, Calendar, Palette 
} from 'lucide-react';
import './Hero.css';

export default function Hero({
  onStartPracticing,
  onExplorePractice,
  streak = 3,
  xp = 240,
  onOpenResetMenu,
  onOpenMenu,
  onNavigate
}) {
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const cornerMenuRef = useRef(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cornerMenuRef.current && !cornerMenuRef.current.contains(e.target)) {
        setMenuDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <section className="hero-section" id="home">
      {/* Top Left Corner Menu Option on Home Screen */}
      <div className="hero-corner-menu" id="hero-corner-menu" ref={cornerMenuRef}>
        <button
          type="button"
          className={`corner-menu-btn ${menuDropdownOpen ? 'active' : ''}`}
          onClick={() => setMenuDropdownOpen((prev) => !prev)}
          title="Menu & Study Options"
          aria-expanded={menuDropdownOpen}
          aria-label="Open Home Screen Menu"
          id="hero-corner-menu-trigger"
        >
          <div className="corner-menu-icon-box">
            <Menu size={14} className="corner-menu-icon" />
          </div>
          <span className="corner-menu-text">Menu</span>
          <ChevronDown size={12} className={`corner-menu-chevron ${menuDropdownOpen ? 'open' : ''}`} />
        </button>

        {/* Home Screen Corner Menu Dropdown Popover */}
        {menuDropdownOpen && (
          <div className="hero-corner-menu-dropdown animate-fade-in" role="menu">
            <div className="corner-menu-header">
              <div className="corner-menu-header-badge">
                <Sparkles size={12} />
                <span>Quick Navigation</span>
              </div>
              <span className="corner-menu-hint">Jump anywhere</span>
            </div>

            <div className="corner-menu-section-title">LEARNING MODULES</div>
            <div className="corner-menu-grid">
              <button 
                type="button" 
                className="corner-menu-item"
                onClick={() => { setMenuDropdownOpen(false); onNavigate?.('practice-studio'); }}
              >
                <Mic size={14} className="c-item-icon primary" />
                <div className="c-item-text">
                  <span className="c-item-title">Speaking Studio</span>
                  <span className="c-item-desc">Voice & AI Feedback</span>
                </div>
              </button>

              <button 
                type="button" 
                className="corner-menu-item"
                onClick={() => { setMenuDropdownOpen(false); onNavigate?.('ai-coach'); }}
              >
                <Bot size={14} className="c-item-icon indigo" />
                <div className="c-item-text">
                  <span className="c-item-title">AI Coach</span>
                  <span className="c-item-desc">Interactive Partner</span>
                </div>
              </button>

              <button 
                type="button" 
                className="corner-menu-item"
                onClick={() => { setMenuDropdownOpen(false); onNavigate?.('ai-interview'); }}
              >
                <Briefcase size={14} className="c-item-icon emerald" />
                <div className="c-item-text">
                  <span className="c-item-title">AI Interview</span>
                  <span className="c-item-desc">Job Simulation</span>
                </div>
              </button>

              <button 
                type="button" 
                className="corner-menu-item"
                onClick={() => { setMenuDropdownOpen(false); onNavigate?.('roleplay'); }}
              >
                <Theater size={14} className="c-item-icon purple" />
                <div className="c-item-text">
                  <span className="c-item-title">Roleplay</span>
                  <span className="c-item-desc">Real-World Scenarios</span>
                </div>
              </button>

              <button 
                type="button" 
                className="corner-menu-item"
                onClick={() => { setMenuDropdownOpen(false); onNavigate?.('vocabulary'); }}
              >
                <BookOpen size={14} className="c-item-icon amber" />
                <div className="c-item-text">
                  <span className="c-item-title">Vocabulary</span>
                  <span className="c-item-desc">Spoken Mastery</span>
                </div>
              </button>

              <button 
                type="button" 
                className="corner-menu-item"
                onClick={() => { setMenuDropdownOpen(false); onNavigate?.('challenges'); }}
              >
                <Zap size={14} className="c-item-icon amber" />
                <div className="c-item-text">
                  <span className="c-item-title">Daily Challenge</span>
                  <span className="c-item-desc">Streak Tasks</span>
                </div>
              </button>

              <button 
                type="button" 
                className="corner-menu-item"
                onClick={() => { setMenuDropdownOpen(false); onNavigate?.('learning-plan'); }}
              >
                <Compass size={14} className="c-item-icon blue" />
                <div className="c-item-text">
                  <span className="c-item-title">Learning Plan</span>
                  <span className="c-item-desc">Personalized Path</span>
                </div>
              </button>

              <button 
                type="button" 
                className="corner-menu-item"
                onClick={() => { setMenuDropdownOpen(false); onNavigate?.('progress'); }}
              >
                <BarChart2 size={14} className="c-item-icon green" />
                <div className="c-item-text">
                  <span className="c-item-title">Progress</span>
                  <span className="c-item-desc">Score & Analytics</span>
                </div>
              </button>
            </div>

            <div className="corner-menu-divider" />

            <div className="corner-menu-section-title">TOOLS & SETTINGS</div>
            <div className="corner-menu-tools-row">
              <button 
                type="button" 
                className="c-tool-btn"
                onClick={() => { setMenuDropdownOpen(false); onOpenMenu?.('timetable'); }}
                title="Study Timetable"
              >
                <Calendar size={13} />
                <span>Timetable</span>
              </button>

              <button 
                type="button" 
                className="c-tool-btn"
                onClick={() => { setMenuDropdownOpen(false); onOpenMenu?.('themes'); }}
                title="Themes & Appearance"
              >
                <Palette size={13} />
                <span>Themes</span>
              </button>

              <button 
                type="button" 
                className="c-tool-btn"
                onClick={() => { setMenuDropdownOpen(false); onOpenResetMenu?.(); }}
                title="Reset Streak / XP"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>

            <div className="corner-menu-footer">
              <button
                type="button"
                className="corner-menu-full-drawer-btn"
                onClick={() => { setMenuDropdownOpen(false); onOpenMenu?.('themes'); }}
              >
                <span>Open Full Study Center Drawer</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Redesigned Compact Corner Gamification Widget (XP & Quick Reset) */}
      <div className="hero-corner-gamification" id="hero-corner-stats">
        <div className="corner-stat-chip xp-chip" title={`${xp} Total XP`}>
          <Zap size={13} className="corner-bolt" />
          <div className="stat-text-group">
            <span className="stat-number">{xp}</span>
            <span className="stat-title">XP</span>
          </div>
        </div>

        <button
          type="button"
          className="corner-reset-btn"
          onClick={onOpenResetMenu}
          title="Reset Streak or XP in Menu Bar"
          aria-label="Reset Streak or XP in Menu Bar"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      <div className="hero-background-effects">
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
      </div>

      <div className="section-container hero-container">
        {/* Left Column: Content */}
        <div className="hero-content">
          <div className="section-badge hero-badge">
            <Sparkles size={16} className="badge-icon-sparkle" />
            <span>AI-Ready Communication Platform for Students</span>
          </div>

          <h1 className="hero-heading">
            Speak Better. <br />
            <span>Communicate Better.</span> <br />
            Grow Better.
          </h1>

          <p className="hero-subheading">
            Practice your communication skills every day and become more confident in English.
          </p>

          <div className="hero-actions">
            <button 
              id="hero-start-btn"
              className="btn btn-primary btn-lg"
              onClick={onStartPracticing}
            >
              <span>Start Practicing</span>
              <ArrowRight size={18} />
            </button>

            <button 
              id="hero-explore-btn"
              className="btn btn-secondary btn-lg"
              onClick={onExplorePractice}
            >
              <Play size={16} className="play-icon" />
              <span>Explore Practice</span>
            </button>
          </div>

          {/* Social Proof / Student Trust Metrics */}
          <div className="hero-trust-metrics">
            <div className="trust-avatars">
              <span className="avatar-chip avatar-1">🎓</span>
              <span className="avatar-chip avatar-2">🌟</span>
              <span className="avatar-chip avatar-3">🚀</span>
            </div>
            <div className="trust-text">
              <strong>10,000+ Students</strong>
              <span>building daily speaking confidence</span>
            </div>
          </div>
        </div>

        {/* Right Column: Custom Animated Communication Illustration */}
        <div className="hero-visual">
          <div className="illustration-wrapper">
            {/* Main Interactive Illustration Card */}
            <div className="illustration-art-card">
              <svg 
                className="illustration-svg" 
                viewBox="0 0 480 420" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Student practicing communication skills"
              >
                <defs>
                  <linearGradient id="artGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                  <linearGradient id="artGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.25)" />
                    <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                  </radialGradient>
                </defs>

                {/* Ambient Halo */}
                <circle cx="240" cy="210" r="170" fill="url(#haloGlow)" />

                {/* Audio Wave Concentric Rings */}
                <circle cx="240" cy="210" r="140" stroke="#E0E7FF" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="240" cy="210" r="105" stroke="#C7D2FE" strokeWidth="2" />
                <circle cx="240" cy="210" r="75" stroke="#818CF8" strokeWidth="2.5" opacity="0.6" />

                {/* Central Speaker Platform Base */}
                <ellipse cx="240" cy="330" rx="130" ry="24" fill="#EEF2FF" />
                <ellipse cx="240" cy="326" rx="100" ry="18" fill="#E0E7FF" />

                {/* Stylized Student Speaking Avatar */}
                {/* Body / Shoulders */}
                <path 
                  d="M175 320 C175 260, 205 240, 240 240 C275 240, 305 260, 305 320 Z" 
                  fill="url(#artGrad1)" 
                />
                
                {/* Collar Accent */}
                <path d="M225 240 L240 262 L255 240 Z" fill="#FFFFFF" opacity="0.9" />

                {/* Neck */}
                <rect x="230" y="215" width="20" height="28" rx="6" fill="#FCD34D" />

                {/* Head */}
                <circle cx="240" cy="180" r="38" fill="#FCD34D" />

                {/* Hair */}
                <path 
                  d="M202 180 C202 142, 278 142, 278 180 C278 152, 202 152, 202 180 Z" 
                  fill="#1E293B" 
                />
                <path d="M202 175 Q240 148 278 175 C278 160 265 145 240 145 C215 145 202 160 202 175 Z" fill="#0F172A" />

                {/* Modern Headset */}
                <path 
                  d="M204 180 C200 135, 280 135, 276 180" 
                  stroke="#334155" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  fill="none" 
                />
                <rect x="198" y="168" width="10" height="24" rx="5" fill="#4F46E5" />
                <rect x="272" y="168" width="10" height="24" rx="5" fill="#4F46E5" />

                {/* Headset Mic Boom */}
                <path d="M202 186 Q204 205 222 208" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <circle cx="224" cy="208" r="4" fill="#06B6D4" />

                {/* Friendly Face details */}
                {/* Eyes */}
                <circle cx="230" cy="178" r="3.5" fill="#1E293B" />
                <circle cx="250" cy="178" r="3.5" fill="#1E293B" />
                {/* Smile / Speaking Expression */}
                <path d="M232 192 Q240 200 248 192" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                {/* Radiating Speech Wave Bars */}
                <g className="speech-wave-bars">
                  <rect x="315" y="195" width="4" height="22" rx="2" fill="#4F46E5" className="wave-bar bar-1" />
                  <rect x="325" y="185" width="4" height="42" rx="2" fill="#7C3AED" className="wave-bar bar-2" />
                  <rect x="335" y="190" width="4" height="32" rx="2" fill="#06B6D4" className="wave-bar bar-3" />
                  <rect x="345" y="200" width="4" height="14" rx="2" fill="#10B981" className="wave-bar bar-4" />
                </g>
              </svg>

              {/* Floating Badge 1: Confidence Boost */}
              <div className="floating-badge badge-confidence animate-float">
                <div className="badge-icon-wrap emerald">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div className="badge-title">Confidence</div>
                  <div className="badge-value">+94% This Week</div>
                </div>
              </div>

              {/* Floating Badge 2: Fluency Prompt */}
              <div className="floating-badge badge-fluency">
                <div className="badge-icon-wrap indigo">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <div className="badge-title">Topic Sprint</div>
                  <div className="badge-value">60s Ready</div>
                </div>
              </div>

              {/* Floating Badge 3: Daily Challenge */}
              <div className="floating-badge badge-streak">
                <div className="badge-icon-wrap amber">
                  <Award size={16} />
                </div>
                <div>
                  <div className="badge-title">Daily Practice</div>
                  <div className="badge-value">Build Consistency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
