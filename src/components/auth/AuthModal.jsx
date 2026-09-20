import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  Mail, 
  Lock, 
  User, 
  School, 
  BookOpen, 
  Calendar, 
  Target, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  KeyRound,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import './AuthModal.css';

const PRIMARY_GOALS = [
  'Improve English Speaking',
  'Interview Preparation',
  'Placement Preparation',
  'Professional Communication',
  'Vocabulary',
  'Grammar',
  'Fluency',
  'Presentation Skills'
];

export default function AuthModal({ isEntranceGate = false, onContinueAsGuest }) {
  const { 
    authModalOpen, 
    closeAuthModal, 
    authModalMode, 
    authModalRole, 
    resetTokenParam, 
    login, 
    register 
  } = useAuth();

  const [activeRole, setActiveRole] = useState(authModalRole || 'student'); // 'student' | 'teacher'
  const [mode, setMode] = useState(authModalMode || 'login'); // 'login' | 'register' | 'forgot' | 'reset'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('1st Year');
  const [primaryGoal, setPrimaryGoal] = useState('Improve English Speaking');
  const [resetToken, setResetToken] = useState(resetTokenParam || '');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [devResetTokenLink, setDevResetTokenLink] = useState('');

  // Sync props when modal opens
  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalMode || 'login');
      setActiveRole(authModalRole || 'student');
      setErrorMessage('');
      setSuccessMessage('');
      if (resetTokenParam) {
        setResetToken(resetTokenParam);
        setMode('reset');
      }
    }
  }, [authModalOpen, authModalMode, authModalRole, resetTokenParam]);

  if (!authModalOpen && !isEntranceGate) return null;

  // Live password validation
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  // Quick Demo Logins
  const handleQuickDemo = (roleType) => {
    if (roleType === 'student') {
      setEmail('student@speakup.edu');
      setPassword('Student@123');
      setActiveRole('student');
      setMode('login');
    } else {
      setEmail('teacher@speakup.edu');
      setPassword('Teacher@123');
      setActiveRole('teacher');
      setMode('login');
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await login({ email, password, role: activeRole });
        if (!res.success) {
          setErrorMessage(res.message);
        }
      } else if (mode === 'register') {
        const res = await register({
          name,
          email,
          password,
          confirmPassword,
          college,
          course,
          year,
          primaryGoal
        });
        if (!res.success) {
          setErrorMessage(res.message);
        }
      } else if (mode === 'forgot') {
        const res = await authService.forgotPassword(email);
        if (res.success) {
          setSuccessMessage(res.message);
          if (res.devResetToken) {
            setDevResetTokenLink(res.devResetToken);
          }
        } else {
          setErrorMessage(res.message);
        }
      } else if (mode === 'reset') {
        const res = await authService.resetPassword({
          token: resetToken,
          newPassword: password,
          confirmPassword
        });
        if (res.success) {
          setSuccessMessage(res.message);
          setTimeout(() => {
            setMode('login');
            setPassword('');
            setConfirmPassword('');
          }, 2000);
        } else {
          setErrorMessage(res.message);
        }
      }
    } catch {
      setErrorMessage('Network error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const windowContent = (
    <div className={`auth-modal-window ${isEntranceGate ? 'auth-gate-window' : ''}`} onClick={(e) => e.stopPropagation()}>
      {!isEntranceGate && (
        <button 
          className="auth-modal-close-btn" 
          onClick={closeAuthModal} 
          aria-label="Close authentication modal"
        >
          <X size={18} />
        </button>
      )}

        {/* -------------------------------------------------------------
            LEFT PANEL: Animated Communication Journey Path (Req 17)
            ------------------------------------------------------------- */}
        <div className="auth-panel-left">
          <div>
            <div className="auth-left-brand">
              <div className="auth-brand-logo">
                <Mic size={20} />
              </div>
              <h3 className="auth-brand-title">Speak<span>Up</span></h3>
            </div>

            <div className="auth-journey-path-container">
              <div className="auth-journey-path-line" />

              <div className="auth-path-checkpoint">
                <div className="auth-checkpoint-node">💬</div>
                <div className="auth-checkpoint-text">
                  <h5>Speak</h5>
                  <p>Express thoughts spontaneously with confidence</p>
                </div>
              </div>

              <div className="auth-path-checkpoint">
                <div className="auth-checkpoint-node">📚</div>
                <div className="auth-checkpoint-text">
                  <h5>Learn</h5>
                  <p>Acquire high-impact spoken vocabulary</p>
                </div>
              </div>

              <div className="auth-path-checkpoint">
                <div className="auth-checkpoint-node">🧠</div>
                <div className="auth-checkpoint-text">
                  <h5>Practice</h5>
                  <p>Interactive AI roleplays & interview drills</p>
                </div>
              </div>

              <div className="auth-path-checkpoint">
                <div className="auth-checkpoint-node">🎯</div>
                <div className="auth-checkpoint-text">
                  <h5>Improve</h5>
                  <p>Adaptive personalized feedback & grammar fixes</p>
                </div>
              </div>

              <div className="auth-path-checkpoint">
                <div className="auth-checkpoint-node">🏆</div>
                <div className="auth-checkpoint-text">
                  <h5>Grow</h5>
                  <p>Master placement, academic & professional talk</p>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-left-footer">
            "Build better communication. One practice at a time."
          </div>
        </div>

        {/* -------------------------------------------------------------
            RIGHT PANEL: Role Selector & Auth Forms
            ------------------------------------------------------------- */}
        <div className="auth-panel-right">
          {/* Header */}
          <div className="auth-form-header">
            <h2 className="auth-heading">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Student Account'}
              {mode === 'forgot' && 'Reset Your Password'}
              {mode === 'reset' && 'Create New Password'}
            </h2>
            <p className="auth-subheading">
              {mode === 'login' && 'Sign in to access your personalized practice studio and progress.'}
              {mode === 'register' && 'Start your AI communication journey in seconds.'}
              {mode === 'forgot' && "Enter your registered email and we'll help you regain access."}
              {mode === 'reset' && 'Enter and confirm your new secure password below.'}
            </p>
          </div>

          {/* Student vs Teacher Role Switcher (for Login mode) */}
          {mode === 'login' && (
            <div className="auth-role-tabs">
              <button
                type="button"
                className={`auth-role-tab ${activeRole === 'student' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRole('student');
                  setErrorMessage('');
                }}
              >
                <GraduationCap size={16} />
                <span>Student Login</span>
              </button>
              <button
                type="button"
                className={`auth-role-tab ${activeRole === 'teacher' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRole('teacher');
                  setErrorMessage('');
                }}
              >
                <School size={16} />
                <span>Teacher Login</span>
              </button>
            </div>
          )}

          {/* Alerts */}
          {errorMessage && (
            <div className="auth-alert-box error">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert-box success">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Dev Shortcut button if devResetTokenLink is set */}
          {devResetTokenLink && (
            <div className="mb-4 text-center">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setResetToken(devResetTokenLink);
                  setMode('reset');
                }}
              >
                <KeyRound size={14} />
                <span>Enter New Password Now (Dev Shortcut)</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* ---------------- REGISTRATION FORM ---------------- */}
            {mode === 'register' && (
              <>
                <div className="auth-field-group">
                  <label className="auth-field-label">Full Name</label>
                  <div className="auth-field-input-wrapper">
                    <User size={16} className="auth-field-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="e.g. Ashish Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-grid">
                  <div className="auth-field-group">
                    <label className="auth-field-label">College / University</label>
                    <div className="auth-field-input-wrapper">
                      <School size={16} className="auth-field-icon" />
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="e.g. IIT Delhi"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="auth-field-group">
                    <label className="auth-field-label">Course / Degree</label>
                    <div className="auth-field-input-wrapper">
                      <BookOpen size={16} className="auth-field-icon" />
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="e.g. B.Tech CSE"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="auth-form-grid">
                  <div className="auth-field-group">
                    <label className="auth-field-label">Current Academic Year</label>
                    <div className="auth-field-input-wrapper">
                      <Calendar size={16} className="auth-field-icon" />
                      <select
                        className="auth-select"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  <div className="auth-field-group">
                    <label className="auth-field-label">Primary Goal</label>
                    <div className="auth-field-input-wrapper">
                      <Target size={16} className="auth-field-icon" />
                      <select
                        className="auth-select"
                        value={primaryGoal}
                        onChange={(e) => setPrimaryGoal(e.target.value)}
                      >
                        {PRIMARY_GOALS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ---------------- COMMON EMAIL / IDENTIFIER FIELD (Login, Register, Forgot) ---------------- */}
            {mode !== 'reset' && (
              <div className="auth-field-group">
                <label className="auth-field-label">
                  {mode === 'login' 
                    ? (activeRole === 'student' ? 'Student Name or Email Address' : 'Email Address or Name')
                    : 'Email Address'}
                </label>
                <div className="auth-field-input-wrapper">
                  {mode === 'login' && email.length > 0 && !email.includes('@') ? (
                    <User size={16} className="auth-field-icon" />
                  ) : (
                    <Mail size={16} className="auth-field-icon" />
                  )}
                  <input
                    type={mode === 'login' ? 'text' : 'email'}
                    className="auth-input"
                    placeholder={
                      activeRole === 'teacher'
                        ? 'teacher@speakup.edu or Dr. Priya Mukherjee'
                        : mode === 'login'
                        ? 'Enter name (e.g. Ashish Kumar) or email'
                        : 'e.g. ashish.kumar@example.com'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete={mode === 'login' ? 'username' : 'email'}
                  />
                </div>
                {mode === 'login' && (
                  <span className="auth-field-hint">
                    💡 Sign in with your registered <strong>email</strong> or <strong>name</strong> (e.g. Ashish Kumar).
                  </span>
                )}
              </div>
            )}

            {/* ---------------- PASSWORD FIELD (Login, Register, Reset) ---------------- */}
            {mode !== 'forgot' && (
              <div className="auth-field-group">
                <label className="auth-field-label">
                  <span>{mode === 'reset' ? 'New Password' : 'Password'}</span>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="auth-link-btn"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage('');
                      }}
                    >
                      Forgot Password?
                    </button>
                  )}
                </label>
                <div className="auth-field-input-wrapper">
                  <Lock size={16} className="auth-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength checklist for register and reset */}
                {(mode === 'register' || mode === 'reset') && password && (
                  <div className="password-criteria-list">
                    <span className={`password-criterion ${hasMinLength ? 'valid' : ''}`}>
                      {hasMinLength ? '✓' : '•'} 8+ characters
                    </span>
                    <span className={`password-criterion ${hasUpper ? 'valid' : ''}`}>
                      {hasUpper ? '✓' : '•'} Uppercase letter
                    </span>
                    <span className={`password-criterion ${hasLower ? 'valid' : ''}`}>
                      {hasLower ? '✓' : '•'} Lowercase letter
                    </span>
                    <span className={`password-criterion ${hasNumber ? 'valid' : ''}`}>
                      {hasNumber ? '✓' : '•'} Number (0-9)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- CONFIRM PASSWORD FIELD (Register, Reset) ---------------- */}
            {(mode === 'register' || mode === 'reset') && (
              <div className="auth-field-group">
                <label className="auth-field-label">Confirm Password</label>
                <div className="auth-field-input-wrapper">
                  <Lock size={16} className="auth-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>
                    {mode === 'login' && (activeRole === 'teacher' ? 'Sign In as Teacher' : 'Sign In as Student')}
                    {mode === 'register' && 'Create Student Account'}
                    {mode === 'forgot' && 'Send Reset Instructions'}
                    {mode === 'reset' && 'Reset Password'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Mode switch links */}
          <div className="auth-form-footer-links">
            {mode === 'login' && activeRole === 'student' && (
              <>
                <span>Don't have an account?</span>
                <button
                  type="button"
                  className="auth-link-btn font-bold"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                >
                  Create Student Account
                </button>
              </>
            )}

            {mode === 'register' && (
              <>
                <span>Already have an account?</span>
                <button
                  type="button"
                  className="auth-link-btn font-bold"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                >
                  Sign In
                </button>
              </>
            )}

            {(mode === 'forgot' || mode === 'reset') && (
              <div className="w-full text-center">
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>

          {/* Pre-seeded demo account quick pills */}
          {mode === 'login' && (
            <div className="demo-accounts-pill-bar">
              <span className="demo-bar-label">⚡ Quick Demo Sign In</span>
              <div className="demo-buttons-row">
                <button
                  type="button"
                  className="demo-login-chip"
                  onClick={() => handleQuickDemo('student')}
                  title="Login as Ashish Kumar (Student)"
                >
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Student (Ashish Kumar)</span>
                </button>
                <button
                  type="button"
                  className="demo-login-chip"
                  onClick={() => handleQuickDemo('teacher')}
                  title="Login as Dr. Priya Mukherjee (Teacher)"
                >
                  <School size={14} className="text-indigo-400" />
                  <span>Teacher (Dr. Priya)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );

  if (isEntranceGate) {
    return (
      <div className="auth-gate-screen">
        {/* Brand Banner */}
        <div className="auth-gate-brand-banner">
          <div className="brand-link">
            <div className="brand-logo-mark">
              <Mic size={20} className="brand-logo-icon" />
              <span className="brand-logo-glow" />
            </div>
            <div className="brand-info-col" style={{ textAlign: 'left' }}>
              <span className="brand-title-text" style={{ fontSize: '1.65rem' }}>
                Speak<span>Up</span>
              </span>
              <span className="brand-subtitle-badge">
                <span className="brand-live-dot" /> AI STUDIO
              </span>
            </div>
          </div>
          <p className="auth-gate-tagline">
            Sign in or create your student account to enter your personalized AI communication practice studio.
          </p>
        </div>

        {/* Auth Window */}
        {windowContent}

        {/* Optional Guest Access Bar */}
        {onContinueAsGuest && (
          <div className="auth-gate-footer-bar">
            <button 
              type="button" 
              className="auth-gate-guest-btn"
              onClick={onContinueAsGuest}
            >
              <span>Just want to take a quick look?</span>
              <strong>Explore Website as Guest →</strong>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="auth-modal-backdrop" onClick={closeAuthModal}>
      {windowContent}
    </div>
  );
}
