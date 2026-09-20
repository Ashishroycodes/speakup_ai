import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ProfileModal.css';

export default function ProfileModal() {
  const { 
    user, 
    profile, 
    role, 
    profileModalOpen, 
    closeProfileModal, 
    updateProfile,
    refreshProfile,
    logout 
  } = useAuth();

  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    if (profileModalOpen && refreshProfile) {
      refreshProfile();
    }
  }, [profileModalOpen, refreshProfile]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setInstitution(profile?.institution || '');
      setCourse(profile?.course || '');
      setYear(profile?.year || '');
      setPrimaryGoal(profile?.primary_goal || profile?.primaryGoal || '');
      setDepartment(profile?.department || '');
      setDesignation(profile?.designation || '');
      setStatusMsg(null);
    }
  }, [user, profile, profileModalOpen]);

  if (!profileModalOpen || !user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

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

    const res = await updateProfile(payload);
    setIsSaving(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        closeProfileModal();
      }, 1200);
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Failed to update profile.' });
    }
  };

  return (
    <div className="profile-modal-backdrop" onClick={closeProfileModal}>
      <div className="profile-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="profile-modal-header">
          <div className="profile-header-info">
            <div className="profile-avatar-circle">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="profile-name-title">{user.name}</h3>
              <span className="profile-role-badge">
                {role === 'teacher' ? '👨‍🏫 Verified Educator' : '🎓 Student Account'}
              </span>
            </div>
          </div>
          <button className="profile-close-btn" onClick={closeProfileModal} aria-label="Close profile">
            <X size={18} />
          </button>
        </div>

        {/* Quick Gamified Badges for Students */}
        {role === 'student' && profile && (
          <div className="profile-kpis-deck">
            <div className="profile-kpi-chip">
              <Award size={16} className="text-amber-400" />
              <span>{profile.xp ?? 0} XP</span>
            </div>
            <div className="profile-kpi-chip">
              <Flame size={16} className="text-rose-400" />
              <span>{profile.streak ?? 0} Day Streak</span>
            </div>
            <div className="profile-kpi-chip">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{profile.overall_score ?? 0}% Fluency</span>
            </div>
          </div>
        )}

        {/* Status Alert */}
        {statusMsg && (
          <div className={`profile-status-alert ${statusMsg.type}`}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Form Body */}
        <form className="profile-form-body" onSubmit={handleSave}>
          <div className="profile-field-group">
            <label className="profile-label">Full Name</label>
            <div className="profile-input-wrapper">
              <User size={16} className="profile-input-icon" />
              <input
                type="text"
                className="profile-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="profile-field-group">
            <label className="profile-label">Email Address (Read-only)</label>
            <div className="profile-input-wrapper">
              <Mail size={16} className="profile-input-icon" />
              <input
                type="email"
                className="profile-input readonly"
                value={user.email}
                disabled
              />
            </div>
          </div>

          <div className="profile-field-group">
            <label className="profile-label">Institution / College</label>
            <div className="profile-input-wrapper">
              <School size={16} className="profile-input-icon" />
              <input
                type="text"
                className="profile-input"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>
          </div>

          {role === 'student' ? (
            <>
              <div className="profile-grid-2">
                <div className="profile-field-group">
                  <label className="profile-label">Course / Degree</label>
                  <div className="profile-input-wrapper">
                    <BookOpen size={16} className="profile-input-icon" />
                    <input
                      type="text"
                      className="profile-input"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                    />
                  </div>
                </div>

                <div className="profile-field-group">
                  <label className="profile-label">Academic Year</label>
                  <div className="profile-input-wrapper">
                    <Calendar size={16} className="profile-input-icon" />
                    <input
                      type="text"
                      className="profile-input"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Primary Communication Goal</label>
                <div className="profile-input-wrapper">
                  <Target size={16} className="profile-input-icon" />
                  <input
                    type="text"
                    className="profile-input"
                    value={primaryGoal}
                    onChange={(e) => setPrimaryGoal(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="profile-grid-2">
              <div className="profile-field-group">
                <label className="profile-label">Department</label>
                <div className="profile-input-wrapper">
                  <Building2 size={16} className="profile-input-icon" />
                  <input
                    type="text"
                    className="profile-input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>

              <div className="profile-field-group">
                <label className="profile-label">Designation</label>
                <div className="profile-input-wrapper">
                  <Briefcase size={16} className="profile-input-icon" />
                  <input
                    type="text"
                    className="profile-input"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="profile-modal-footer">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                logout();
                closeProfileModal();
              }}
            >
              <span>Sign Out</span>
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={closeProfileModal}
              >
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isSaving}
              >
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
