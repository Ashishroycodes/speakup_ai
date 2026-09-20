import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Home,
  Bot,
  Briefcase,
  Theater,
  BookOpen,
  BarChart2,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Zap,
  Compass,
  User,
  Users,
  Edit3,
  LogIn,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const PRIMARY_NAV_ITEMS = [
  { id: 'home', label: 'Home', fullLabel: 'Home', icon: Home },
  { id: 'practice', label: 'Practice', fullLabel: 'Speaking Practice', icon: Mic },
  { id: 'ai-coach', label: 'AI Coach', fullLabel: 'AI Coach', icon: Bot, isAi: true },
  { id: 'ai-interview', label: 'Interview', fullLabel: 'AI Interview', icon: Briefcase, isAi: true },
  { id: 'roleplay', label: 'Roleplay', fullLabel: 'AI Roleplay', icon: Theater, isAi: true },
  { id: 'vocabulary', label: 'Vocabulary', fullLabel: 'Spoken Vocabulary', icon: BookOpen },
  { id: 'challenges', label: 'Challenges', fullLabel: 'Daily Challenges', icon: Zap },
  { id: 'learning-plan', label: 'Plan', fullLabel: 'Learning Plan', icon: Compass },
  { id: 'progress', label: 'Progress', fullLabel: 'Progress & Stats', icon: BarChart2 }
];

export default function Navbar({
  onNavigate,
  activeSection = 'home',
  onOpenMenu,
  theme = 'dark',
  onToggleTheme
}) {
  const { 
    user, 
    role, 
    openAuthModal, 
    openProfileModal, 
    logout, 
    isTeacher 
  } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const moreRef = useRef(null);
  const userMenuRef = useRef(null);

  // Elevation on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close "More" and "User" dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id) => {
    setMobileDrawerOpen(false);
    setMoreDropdownOpen(false);
    setUserDropdownOpen(false);
    if (onNavigate) {
      onNavigate(id);
    }
  };

  const handleMenuClick = () => {
    // If on mobile/tablet screen (<900px), toggle mobile slide-in drawer
    if (window.innerWidth < 900) {
      setMobileDrawerOpen((prev) => !prev);
    } else if (onOpenMenu) {
      // On desktop, open the Tools & Timetable Drawer
      onOpenMenu();
    }
  };

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* ===================================================================
            1. LEFT: Brand Block (Guaranteed Unclipped & Never Squeezed)
            =================================================================== */}
        <div className="navbar-brand-block">
          <a
            href="#home"
            className="brand-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            id="brand-logo"
            aria-label="SpeakUp AI Studio Home"
          >
            <div className="brand-logo-mark">
              <Mic size={18} className="brand-logo-icon" />
              <span className="brand-logo-glow" />
            </div>

            <div className="brand-info-col">
              <span className="brand-title-text">
                Speak<span>Up</span>
              </span>
              <span className="brand-subtitle-badge">
                <span className="brand-live-dot" />
                AI STUDIO
              </span>
            </div>
          </a>
        </div>

        {/* ===================================================================
            2. CENTER: Primary Learning Navigation Categories Deck
            =================================================================== */}
        <nav className="navbar-deck-nav" aria-label="Main Learning Navigation">
          <div className="navbar-deck-track">
            {PRIMARY_NAV_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              // Mark secondary items for intelligent responsive collapsing (index >= 5: Vocab, Challenges, Learning Plan, Progress)
              const isSecondaryItem = index >= 5;
              // Show subtle category divider between logical groups:
              // Index 2: Between Core (Home, Practice) and AI Suite (AI Coach, Interview, Roleplay)
              // Index 5: Between AI Suite and Study (Vocabulary, Challenges, Plan)
              // Index 8: Between Study and Analytics (Progress)
              const showDividerBefore = index === 2 || index === 5 || index === 8;

              return (
                <React.Fragment key={item.id}>
                  {showDividerBefore && (
                    <span 
                      className={`deck-track-divider ${isSecondaryItem ? 'deck-item-secondary' : ''}`} 
                      aria-hidden="true" 
                    />
                  )}
                  <button
                    id={`nav-link-${item.id}`}
                    className={`deck-nav-btn ${isSecondaryItem ? 'deck-item-secondary' : ''} ${
                      isActive ? 'is-active' : ''
                    }`}
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    title={item.fullLabel || item.label}
                  >
                    <Icon className="deck-btn-icon" size={14} />
                    <span className="deck-btn-text">{item.label}</span>
                    {item.isAi && <span className="deck-ai-chip">AI</span>}
                  </button>
                </React.Fragment>
              );
            })}

            {/* Intelligent "More ▾" collapse for medium screens */}
            <div className="deck-more-container" ref={moreRef}>
              {(() => {
                const secondaryItems = PRIMARY_NAV_ITEMS.slice(5);
                const isSecondaryActive = secondaryItems.some((item) => item.id === activeSection);
                return (
                  <>
                    <button
                      type="button"
                      className={`deck-nav-btn deck-more-trigger ${isSecondaryActive ? 'is-active' : ''}`}
                      onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                      aria-expanded={moreDropdownOpen}
                      aria-label="More learning categories"
                    >
                      <span>More</span>
                      <ChevronDown size={13} className={`more-arrow ${moreDropdownOpen ? 'open' : ''}`} />
                    </button>

                    {moreDropdownOpen && (
                      <div className="deck-more-dropdown-popover">
                        <div className="more-dropdown-header">
                          <span>More Categories</span>
                        </div>
                        {secondaryItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeSection === item.id;
                          return (
                            <button
                              key={item.id}
                              className={`more-dropdown-item ${isActive ? 'is-active' : ''}`}
                              onClick={() => handleNavClick(item.id)}
                            >
                              <Icon size={15} />
                              <span>{item.fullLabel || item.label}</span>
                              {isActive && <span className="dropdown-active-dot" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </nav>

        {/* ===================================================================
            3. RIGHT: Secondary Utilities (Theme, Auth & Menu)
            =================================================================== */}
        <div className="navbar-utilities-cluster">
          {/* Educator Portal Quick Jump (if teacher) */}
          {isTeacher && (
            <button
              type="button"
              className={`nav-teacher-portal-btn ${activeSection === 'teacher-portal' ? 'active' : ''}`}
              onClick={() => handleNavClick('teacher-portal')}
              title="Open Educator Portal"
            >
              <GraduationCap size={15} />
              <span className="teacher-btn-label">Teacher Portal</span>
            </button>
          )}

          {/* User Account / Sign In */}
          {user ? (
            <div className="nav-user-menu-container" ref={userMenuRef}>
              <button
                type="button"
                className={`nav-user-chip-btn ${userDropdownOpen ? 'active' : ''}`}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-label="User profile and account settings"
              >
                <div className="nav-user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="nav-user-firstname">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={13} className={`user-arrow ${userDropdownOpen ? 'open' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="nav-user-dropdown-popover">
                  <div className="user-dropdown-header">
                    <div className="dropdown-avatar-circle">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="dropdown-user-details">
                      <p className="dropdown-user-name">{user.name}</p>
                      <p className="dropdown-user-email">{user.email}</p>
                      <span className="dropdown-role-tag">
                        {role === 'teacher' ? '👨‍🏫 Educator' : '🎓 Student'}
                      </span>
                    </div>
                  </div>

                  <div className="dropdown-menu-actions">
                    {isTeacher && (
                      <button
                        className="dropdown-menu-item highlight"
                        onClick={() => handleNavClick('teacher-portal')}
                      >
                        <GraduationCap size={15} />
                        <span>Teacher Dashboard</span>
                      </button>
                    )}
                    <button
                      className="dropdown-menu-item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('profile');
                      }}
                    >
                      <User size={15} />
                      <span>My Profile</span>
                    </button>
                    <button
                      className="dropdown-menu-item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openProfileModal();
                      }}
                    >
                      <Edit3 size={15} />
                      <span>Edit Academic Info</span>
                    </button>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-menu-item logout"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="nav-signin-trigger-btn"
              onClick={() => openAuthModal('login')}
              aria-label="Sign In to SpeakUp"
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}

          {/* Theme Switcher Button */}
          <button
            type="button"
            className="nav-util-icon-btn nav-theme-toggle"
            onClick={onToggleTheme}
            title="Change Theme"
            aria-label="Change Theme"
            id="navbar-theme-toggle"
          >
            {theme === 'light' ? (
              <Moon size={16} className="theme-toggle-icon" />
            ) : (
              <Sun size={16} className="theme-toggle-icon" />
            )}
          </button>

          {/* Mobile-Only Hamburger Toggle (<940px) */}
          <button
            type="button"
            className="nav-mobile-toggle-btn"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open Navigation Menu"
            title="Open Menu"
            id="navbar-mobile-toggle"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* ===================================================================
          4. MOBILE SLIDE-IN NAVIGATION DRAWER (<900px)
          =================================================================== */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileDrawerOpen(false)}>
          <div className="mobile-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="mobile-drawer-top">
              <div className="brand-info-col" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="brand-title-text" style={{ fontSize: '1.25rem' }}>
                  Speak<span>Up</span>
                </span>
                <span className="brand-subtitle-badge">
                  <span className="brand-live-dot" /> AI STUDIO
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="nav-util-icon-btn"
                  onClick={onToggleTheme}
                  title="Change Theme"
                  aria-label="Change Theme"
                >
                  {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
                </button>
                <button
                  type="button"
                  className="drawer-close-btn"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Mobile User Profile or Sign-in Box */}
            <div className="mobile-user-status-card">
              {user ? (
                <div className="mobile-user-logged-in">
                  <div className="mobile-user-info-row">
                    <div className="nav-user-avatar large">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="mobile-user-name">{user.name}</div>
                      <div className="mobile-user-role-badge">
                        {role === 'teacher' ? '👨‍🏫 Educator' : '🎓 Student'}
                      </div>
                    </div>
                  </div>
                  <div className="mobile-user-actions-row">
                    {isTeacher && (
                      <button
                        className="mobile-btn-profile highlight"
                        onClick={() => handleNavClick('teacher-portal')}
                      >
                        <GraduationCap size={15} />
                        <span>Teacher Portal</span>
                      </button>
                    )}
                    <button
                      className="mobile-btn-profile"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        handleNavClick('profile');
                      }}
                    >
                      <User size={15} />
                      <span>My Profile</span>
                    </button>
                    <button
                      className="mobile-btn-logout"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="mobile-signin-btn"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    openAuthModal('login');
                  }}
                >
                  <LogIn size={16} />
                  <span>Sign In / Student Portal</span>
                </button>
              )}
            </div>

            {/* Mobile Navigation List */}
            <div className="mobile-nav-stack">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    className={`mobile-nav-row ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <div className="mobile-row-content">
                      <Icon size={18} className="mobile-row-icon" />
                      <span className="mobile-row-label">{item.fullLabel || item.label}</span>
                      {item.isAi && <span className="deck-ai-chip">AI</span>}
                    </div>
                    {isActive && <span className="mobile-active-pip" />}
                  </button>
                );
              })}

              {/* User Directory in Mobile Nav Stack */}
              <button
                id="mobile-nav-user-portal"
                className={`mobile-nav-row ${activeSection === 'user-portal' ? 'is-active' : ''}`}
                onClick={() => handleNavClick('user-portal')}
              >
                <div className="mobile-row-content">
                  <Users size={18} className="mobile-row-icon" />
                  <span className="mobile-row-label">User Directory</span>
                  <span className="deck-ai-chip" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.4)' }}>PORTAL</span>
                </div>
                {activeSection === 'user-portal' && <span className="mobile-active-pip" />}
              </button>
            </div>

            {/* Secondary Tools & Settings CTA */}
            <div className="drawer-footer-actions">
              <button
                type="button"
                className="drawer-tools-hub-btn"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  if (onOpenMenu) onOpenMenu();
                }}
              >
                <span>Open Timetable, Tools & Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
