import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  Mail,
  School,
  BookOpen,
  Calendar,
  Target,
  Award,
  Flame,
  CheckCircle2,
  AlertCircle,
  Building2,
  Briefcase,
  Shield,
  KeyRound,
  ArrowLeft,
  ArrowUp,
  LogIn,
  RefreshCw,
  Edit3,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import './ProfileView.css';

export default function ProfileView({ onNavigate, isSection = true, id = 'profile' }) {
  const { user, profile: authProfile, role, updateProfile, refreshProfile, logout, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'security'
  const [isExpanded, setIsExpanded] = useState(!isSection);
  const [profileData, setProfileData] = useState(authProfile);
  const [userData, setUserData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-expand profile details if navigated to via custom event or external trigger
  useEffect(() => {
    const handleOpenDetails = () => setIsExpanded(true);
    window.addEventListener('open-profile-details', handleOpenDetails);
    return () => window.removeEventListener('open-profile-details', handleOpenDetails);
  }, []);

  // Editable Form Fields
  const [name, setName] = useState(user?.name || '');
  const [institution, setInstitution] = useState(authProfile?.institution || '');
  const [course, setCourse] = useState(authProfile?.course || '');
  const [year, setYear] = useState(authProfile?.year || '');
  const [primaryGoal, setPrimaryGoal] = useState(authProfile?.primary_goal || authProfile?.primaryGoal || '');
  const [department, setDepartment] = useState(authProfile?.department || '');
  const [designation, setDesignation] = useState(authProfile?.designation || '');

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Security / Password Change Fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);

  // Fetch only the authenticated user's details from active session
  const fetchActiveProfile = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await authService.getProfile();
      if (res.success && res.user) {
        setUserData(res.user);
        setProfileData(res.profile);
        setName(res.user.name || '');
        if (res.profile) {
          setInstitution(res.profile.institution || '');
          setCourse(res.profile.course || '');
          setYear(res.profile.year || '');
          setPrimaryGoal(res.profile.primary_goal || res.profile.primaryGoal || '');
          setDepartment(res.profile.department || '');
          setDesignation(res.profile.designation || '');
        }
      } else {
        setError(res.message || 'Could not load active session profile.');
      }
    } catch (err) {
      console.error('fetchActiveProfile error:', err);
      setError('Connection error while fetching profile details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveProfile();
  }, [fetchActiveProfile]);

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    const payload = role === 'student' ? {
      name,
      institution,
      course,
      year,
      primaryGoal
    } : {
      name,
      institution,
      department,
      designation
    };

    try {
      const res = await updateProfile(payload);
      if (res.success) {
        setSaveStatus({ type: 'success', text: 'Profile updated successfully!' });
        if (refreshProfile) await refreshProfile();
        await fetchActiveProfile();
        setTimeout(() => {
          setActiveTab('overview');
          setSaveStatus(null);
        }, 1200);
      } else {
        setSaveStatus({ type: 'error', text: res.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', text: err.message || 'Network error updating profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (res.success) {
        setPasswordStatus({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', text: res.message || 'Failed to change password.' });
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', text: err.message || 'Error communicating with server.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Active user representation
  const activeUser = userData || user;
  const activeProfile = profileData || authProfile;

  if (!activeUser) {
    if (!isSection) {
      return (
        <div className="profile-view-wrapper">
          <div className="profile-view-container">
            <div className="profile-nav-bar">
              <button
                type="button"
                className="profile-back-btn"
                onClick={() => onNavigate && onNavigate('home')}
                title="Return to Studio"
              >
                <ArrowLeft size={16} />
                <span>Return to Studio</span>
              </button>
            </div>
            <div className="profile-guest-card">
              <div className="profile-guest-icon-box">
                <User size={32} />
              </div>
              <h3 className="profile-guest-title">Save & Track Your Speaking Progress</h3>
              <p className="profile-guest-desc">
                Sign in to customize your academic institution, set career goals, and access personalized AI feedback reports across all your devices.
              </p>
              <div className="profile-guest-actions">
                <button 
                  type="button" 
                  className="btn btn-primary btn-lg" 
                  onClick={() => openAuthModal && openAuthModal('login')}
                >
                  <LogIn size={18} />
                  <span>Sign In / Student Portal</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-lg" 
                  onClick={() => openAuthModal && openAuthModal('register')}
                >
                  <span>Create Free Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <section className={`profile-section ${isExpanded ? 'is-expanded' : 'is-collapsed'}`} id={id}>
        <div className="section-container profile-section-container">
          {/* Compact Profile Option Card for Guest */}
          <div 
            className={`profile-option-card ${isExpanded ? 'active-open' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }
            }}
          >
            <div className="profile-option-left">
              <div className="profile-option-avatar guest">
                <User size={22} />
              </div>
              <div className="profile-option-info">
                <div className="profile-option-name-row">
                  <h3 className="profile-option-name">Student Profile & Academic Center</h3>
                  <span className="profile-option-badge guest">Guest Mode</span>
                </div>
                <p className="profile-option-subtitle">
                  Sign in or create your profile to track speaking progress, sync XP, and personalize AI practice
                </p>
              </div>
            </div>

            <div className="profile-option-right">
              <button
                type="button"
                className={`profile-option-action-btn ${isExpanded ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                <span>{isExpanded ? 'Hide Details' : 'View Profile Option'}</span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Details revealed only on click */}
          {isExpanded && (
            <div className="profile-details-wrapper animate-slide-down">
              <div className="profile-guest-card">
                <div className="profile-guest-icon-box">
                  <User size={32} />
                </div>
                <h3 className="profile-guest-title">Save & Track Your Speaking Progress</h3>
                <p className="profile-guest-desc">
                  Sign in to customize your academic institution, set career goals, and access personalized AI feedback reports across all your devices.
                </p>
                <div className="profile-guest-actions">
                  <button 
                    type="button" 
                    className="btn btn-primary btn-lg" 
                    onClick={() => openAuthModal && openAuthModal('login')}
                  >
                    <LogIn size={18} />
                    <span>Sign In / Student Portal</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-lg" 
                    onClick={() => openAuthModal && openAuthModal('register')}
                  >
                    <span>Create Free Account</span>
                  </button>
                </div>
                <div className="profile-collapse-footer">
                  <button 
                    type="button" 
                    className="profile-collapse-link-btn"
                    onClick={() => setIsExpanded(false)}
                  >
                    <ChevronUp size={15} />
                    <span>Hide Profile Details</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  const initials = activeUser.name
    ? activeUser.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const isStudent = (activeUser.role || role) === 'student';

  // Password rules validation
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  const renderProfileBody = () => (
    <>
      {/* Hero Card: Authenticated User Header */}
      <div className="profile-hero-card">
          <div className="profile-hero-main">
            <div className="profile-hero-avatar-wrapper">
              <div className={`profile-hero-avatar ${isStudent ? 'student' : 'teacher'}`}>
                {initials}
              </div>
            </div>

            <div className="profile-hero-info">
              <div className="profile-title-badges">
                <h1 className="profile-hero-name">{activeUser.name}</h1>
                <span className={`profile-hero-role-tag ${isStudent ? 'student' : 'teacher'}`}>
                  {isStudent ? '🎓 Student Account' : '👨‍🏫 Verified Educator'}
                </span>
                <span className="profile-live-status-pill">
                  <span className="live-status-dot" />
                  Live Session
                </span>
              </div>

              <div className="profile-hero-meta-row">
                <span className="meta-item">
                  <Mail size={14} />
                  {activeUser.email}
                </span>
                {activeProfile?.institution && (
                  <span className="meta-item">
                    <School size={14} />
                    {activeProfile.institution}
                  </span>
                )}
                {activeUser.createdAt && (
                  <span className="meta-item">
                    <Calendar size={14} />
                    Member since {new Date(activeUser.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="profile-tab-switcher">
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <User size={15} />
              <span>Overview</span>
            </button>
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              <Edit3 size={15} />
              <span>Edit Details</span>
            </button>
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Lock size={15} />
              <span>Security & Password</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            TAB 1: OVERVIEW (Details for Currently Authenticated User)
            =================================================================== */}
        {activeTab === 'overview' && (
          <div className="profile-tab-content">
            {/* Live Progress KPIs for Students (Loaded strictly from active profile) */}
            {isStudent && (
              <div className="profile-kpis-grid">
                <div className="profile-kpi-card">
                  <div className="kpi-icon-bubble xp">
                    <Award size={20} />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Experience Points</span>
                    <span className="kpi-value text-amber-400">{activeProfile?.xp ?? 0} XP</span>
                  </div>
                </div>

                <div className="profile-kpi-card">
                  <div className="kpi-icon-bubble sessions">
                    <BookOpen size={20} />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Completed Sessions</span>
                    <span className="kpi-value text-rose-400">{activeProfile?.completed_sessions ?? 12} Sessions</span>
                  </div>
                </div>

                <div className="profile-kpi-card">
                  <div className="kpi-icon-bubble fluency">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Fluency Score</span>
                    <span className="kpi-value text-emerald-400">
                      {activeProfile?.overall_score ?? activeProfile?.overallScore ?? 0}%
                    </span>
                  </div>
                </div>

                <div className="profile-kpi-card">
                  <div className="kpi-icon-bubble level">
                    <Target size={20} />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Communication Level</span>
                    <span className="kpi-value text-indigo-400">
                      Level {Math.floor((activeProfile?.xp ?? 0) / 200) + 1}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Academic / Professional Details Grid */}
            <div className="profile-sections-grid">
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="card-header-title">
                    <BookOpen size={18} className="text-indigo-400" />
                    <h3>{isStudent ? 'Academic Information' : 'Departmental Credentials'}</h3>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => setActiveTab('edit')}
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="profile-card-body">
                  <div className="profile-detail-row">
                    <div className="detail-label">
                      <School size={15} />
                      <span>Institution</span>
                    </div>
                    <div className="detail-value">
                      {activeProfile?.institution || <span className="text-muted">Not specified</span>}
                    </div>
                  </div>

                  {isStudent ? (
                    <>
                      <div className="profile-detail-row">
                        <div className="detail-label">
                          <BookOpen size={15} />
                          <span>Course / Degree</span>
                        </div>
                        <div className="detail-value">
                          {activeProfile?.course || <span className="text-muted">Not specified</span>}
                        </div>
                      </div>

                      <div className="profile-detail-row">
                        <div className="detail-label">
                          <Calendar size={15} />
                          <span>Academic Year</span>
                        </div>
                        <div className="detail-value">
                          {activeProfile?.year || <span className="text-muted">Not specified</span>}
                        </div>
                      </div>

                      <div className="profile-detail-row">
                        <div className="detail-label">
                          <Target size={15} />
                          <span>Primary Speaking Goal</span>
                        </div>
                        <div className="detail-value highlight-goal">
                          {activeProfile?.primary_goal || activeProfile?.primaryGoal || (
                            <span className="text-muted">Improve English Fluency</span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="profile-detail-row">
                        <div className="detail-label">
                          <Building2 size={15} />
                          <span>Department</span>
                        </div>
                        <div className="detail-value">
                          {activeProfile?.department || <span className="text-muted">Not specified</span>}
                        </div>
                      </div>

                      <div className="profile-detail-row">
                        <div className="detail-label">
                          <Briefcase size={15} />
                          <span>Designation</span>
                        </div>
                        <div className="detail-value">
                          {activeProfile?.designation || <span className="text-muted">Not specified</span>}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Account Identity & Session Security Card */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="card-header-title">
                    <Shield size={18} className="text-emerald-400" />
                    <h3>Active Session & Security</h3>
                  </div>
                </div>

                <div className="profile-card-body">
                  <div className="profile-detail-row">
                    <div className="detail-label">
                      <User size={15} />
                      <span>Account ID</span>
                    </div>
                    <div className="detail-value code-font">
                      {activeUser.id}
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="detail-label">
                      <Mail size={15} />
                      <span>Email Verified</span>
                    </div>
                    <div className="detail-value text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      <span>{activeUser.email}</span>
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="detail-label">
                      <Lock size={15} />
                      <span>Password Security</span>
                    </div>
                    <div className="detail-value">
                      <button
                        type="button"
                        className="btn-change-pwd-link"
                        onClick={() => setActiveTab('security')}
                      >
                        Change Password →
                      </button>
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="detail-label">
                      <Calendar size={15} />
                      <span>Last Login</span>
                    </div>
                    <div className="detail-value">
                      {activeUser.lastLogin
                        ? new Date(activeUser.lastLogin).toLocaleString()
                        : 'Active now'}
                    </div>
                  </div>
                </div>

                <div className="profile-card-footer">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      logout();
                      if (onNavigate) onNavigate('home');
                    }}
                  >
                    <span>Sign Out of Session</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: EDIT PROFILE
            =================================================================== */}
        {activeTab === 'edit' && (
          <div className="profile-tab-content">
            <div className="profile-card max-w-2xl mx-auto">
              <div className="profile-card-header">
                <div className="card-header-title">
                  <Edit3 size={18} className="text-indigo-400" />
                  <h3>Edit Profile Details</h3>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => setActiveTab('overview')}
                >
                  <X size={14} />
                  <span>Cancel</span>
                </button>
              </div>

              {saveStatus && (
                <div className={`profile-status-alert ${saveStatus.type}`}>
                  {saveStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{saveStatus.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="profile-edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-icon-wrap">
                    <User size={16} />
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address (Read-only)</label>
                  <div className="input-icon-wrap">
                    <Mail size={16} />
                    <input
                      type="email"
                      className="form-input readonly"
                      value={activeUser.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Institution / University</label>
                  <div className="input-icon-wrap">
                    <School size={16} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. IIT Delhi"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                    />
                  </div>
                </div>

                {isStudent ? (
                  <>
                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Course / Major</label>
                        <div className="input-icon-wrap">
                          <BookOpen size={16} />
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. B.Tech Computer Science"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Academic Year</label>
                        <div className="input-icon-wrap">
                          <Calendar size={16} />
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. 3rd Year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Primary Communication Goal</label>
                      <div className="input-icon-wrap">
                        <Target size={16} />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Placement & Interview Preparation"
                          value={primaryGoal}
                          onChange={(e) => setPrimaryGoal(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Department</label>
                      <div className="input-icon-wrap">
                        <Building2 size={16} />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Department of Humanities"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Designation</label>
                      <div className="input-icon-wrap">
                        <Briefcase size={16} />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Associate Professor"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('overview')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    <Save size={15} />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: SECURITY & PASSWORD CHANGE FOR ACTIVE USER
            =================================================================== */}
        {activeTab === 'security' && (
          <div className="profile-tab-content">
            <div className="profile-card max-w-xl mx-auto">
              <div className="profile-card-header">
                <div className="card-header-title">
                  <KeyRound size={18} className="text-cyan-400" />
                  <h3>Update Account Password</h3>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => setActiveTab('overview')}
                >
                  <X size={14} />
                  <span>Back to Profile</span>
                </button>
              </div>

              <p className="text-sm text-slate-400 mb-4">
                Update the password for your active account (<strong>{activeUser.email}</strong>).
                Passwords are cryptographically secured using scrypt and never stored in plain text.
              </p>

              {passwordStatus && (
                <div className={`profile-status-alert ${passwordStatus.type}`}>
                  {passwordStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{passwordStatus.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="profile-edit-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-icon-wrap">
                    <Lock size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>New Strong Password</label>
                  <div className="input-icon-wrap">
                    <KeyRound size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-pwd-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Password Strength Checklist */}
                  {newPassword && (
                    <div className="pwd-rules-checklist">
                      <span className={`rule-item ${hasMinLength ? 'met' : ''}`}>
                        {hasMinLength ? <Check size={12} /> : '•'} At least 8 characters
                      </span>
                      <span className={`rule-item ${hasUpper ? 'met' : ''}`}>
                        {hasUpper ? <Check size={12} /> : '•'} 1 Uppercase letter
                      </span>
                      <span className={`rule-item ${hasLower ? 'met' : ''}`}>
                        {hasLower ? <Check size={12} /> : '•'} 1 Lowercase letter
                      </span>
                      <span className={`rule-item ${hasNumber ? 'met' : ''}`}>
                        {hasNumber ? <Check size={12} /> : '•'} 1 Number
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="input-icon-wrap">
                    <KeyRound size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isChangingPassword || !hasMinLength}
                  >
                    <Lock size={15} />
                    <span>{isChangingPassword ? 'Updating Password...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </>
  );

  if (!isSection) {
    return (
      <div className="profile-view-wrapper">
        <div className="profile-view-container">
          <div className="profile-nav-bar">
            <button
              type="button"
              className="profile-back-btn"
              onClick={() => onNavigate && onNavigate('home')}
              title="Return to Studio"
            >
              <ArrowLeft size={16} />
              <span>Return to Studio</span>
            </button>

            <div className="profile-session-badge">
              <Shield size={14} className="text-emerald-400" />
              <span>Active Session • Authenticated as <strong>{activeUser.email}</strong></span>
            </div>

            <button
              type="button"
              className="profile-refresh-btn"
              onClick={fetchActiveProfile}
              disabled={isLoading}
              title="Refresh profile from active session"
            >
              <RefreshCw size={14} className={isLoading ? 'spinning' : ''} />
              <span>{isLoading ? 'Syncing...' : 'Sync Session'}</span>
            </button>
          </div>

          {error && (
            <div className="profile-error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {renderProfileBody()}
        </div>
      </div>
    );
  }

  return (
    <section className={`profile-section ${isExpanded ? 'is-expanded' : 'is-collapsed'}`} id={id}>
      <div className="section-container profile-section-container">
        {/* Profile Option Bar / Card - ALWAYS visible at bottom */}
        <div 
          className={`profile-option-card ${isExpanded ? 'active-open' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
        >
          <div className="profile-option-left">
            <div className="profile-option-avatar">
              <span>{initials}</span>
              <span className="profile-online-indicator" title="Active Account" />
            </div>
            <div className="profile-option-info">
              <div className="profile-option-name-row">
                <h3 className="profile-option-name">{activeUser.name || 'User Profile'}</h3>
                <span className={`profile-option-badge ${isStudent ? 'student' : 'educator'}`}>
                  {isStudent ? '🎓 Student' : '👨‍🏫 Educator'}
                </span>
                {activeProfile?.verified && (
                  <span className="profile-verified-chip">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                )}
              </div>
              <p className="profile-option-subtitle">
                {activeProfile?.institution 
                  ? `${activeProfile.institution}${activeProfile.course ? ` • ${activeProfile.course}` : ''}`
                  : (activeUser.email || 'Click to view academic credentials, progress & account settings')}
              </p>
            </div>
          </div>

          <div className="profile-option-right">
            <button
              type="button"
              className={`profile-option-action-btn ${isExpanded ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              title={isExpanded ? 'Collapse Profile Details' : 'Expand Profile Details'}
            >
              <span>{isExpanded ? 'Hide Details' : 'View Profile Details'}</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Details revealed ONLY when clicked */}
        {isExpanded && (
          <div className="profile-details-wrapper animate-slide-down">
            <div className="section-header profile-details-header">
              <div className="section-badge section-badge-indigo">
                <User size={14} />
                <span>Academic Profile & Account Center</span>
              </div>
              <h2 className="section-title">Your Learning Profile</h2>
              <p className="section-subtitle">
                Manage your academic credentials, customize your career practice goals, and review your verified session details.
              </p>
            </div>

            <div className="profile-view-container">
              {/* Top Controls Bar */}
              <div className="profile-nav-bar">
                <button
                  type="button"
                  className="profile-back-btn"
                  onClick={() => onNavigate && onNavigate('home')}
                  title="Scroll back to Top"
                >
                  <ArrowUp size={15} />
                  <span>Back to Top</span>
                </button>

                <div className="profile-session-badge">
                  <Shield size={14} className="text-emerald-400" />
                  <span>Active Session • Authenticated as <strong>{activeUser.email}</strong></span>
                </div>

                <div className="profile-nav-right-cluster">
                  <button
                    type="button"
                    className="profile-refresh-btn"
                    onClick={fetchActiveProfile}
                    disabled={isLoading}
                    title="Refresh profile from active session"
                  >
                    <RefreshCw size={14} className={isLoading ? 'spinning' : ''} />
                    <span>{isLoading ? 'Syncing...' : 'Sync Session'}</span>
                  </button>

                  <button
                    type="button"
                    className="profile-collapse-top-btn"
                    onClick={() => setIsExpanded(false)}
                    title="Collapse Profile Details"
                  >
                    <ChevronUp size={14} />
                    <span>Hide Details</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="profile-error-alert">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {renderProfileBody()}

              {/* Bottom Collapse Bar */}
              <div className="profile-bottom-collapse-bar">
                <button
                  type="button"
                  className="profile-collapse-action-btn"
                  onClick={() => {
                    setIsExpanded(false);
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                >
                  <ChevronUp size={16} />
                  <span>Hide Profile Details</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
