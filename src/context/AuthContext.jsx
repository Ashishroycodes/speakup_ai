/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCachedUser());
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  const [authModalRole, setAuthModalRole] = useState('student'); // 'student' | 'teacher'
  const [resetTokenParam, setResetTokenParam] = useState('');

  // Profile Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Active Teacher Assignments for Students
  const [activeAssignments, setActiveAssignments] = useState([]);

  // Fetch student assignments helper
  const loadAssignments = useCallback(async () => {
    try {
      const data = await authService.getStudentAssignments();
      if (data.success && data.assignments) {
        setActiveAssignments(data.assignments);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    async function initAuth() {
      const token = authService.getToken();

      // Check if URL has resetToken
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('resetToken');
        if (tokenFromUrl) {
          setResetTokenParam(tokenFromUrl);
          setAuthModalMode('reset');
          setAuthModalOpen(true);
        }
      }

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();
        if (data.success && data.user) {
          setUser(data.user);
          setProfile(data.profile);
          if (data.user.role === 'student') {
            loadAssignments();
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.warn('Session verification error', err);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, [loadAssignments]);

  // Open Auth Modal
  const openAuthModal = useCallback(({ mode = 'login', role = 'student' } = {}) => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const openProfileModal = useCallback(() => {
    setProfileModalOpen(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setProfileModalOpen(false);
  }, []);

  // Sign In
  const login = async ({ email, password, role }) => {
    const res = await authService.login({ email, password, role });
    if (res.success && res.user) {
      setUser(res.user);
      setProfile(res.profile);
      setAuthModalOpen(false);
      if (res.user.role === 'student') {
        loadAssignments();
      }
    }
    return res;
  };

  // Student Sign Up
  const register = async (registrationData) => {
    const res = await authService.register(registrationData);
    if (res.success && res.user) {
      setUser(res.user);
      setProfile(res.profile);
      setAuthModalOpen(false);
      loadAssignments();
    }
    return res;
  };

  // Sign Out
  const logout = () => {
    authService.clearSession();
    setUser(null);
    setProfile(null);
    setActiveAssignments([]);
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    if (!user) return { success: false };

    let res;
    if (user.role === 'student') {
      res = await authService.updateStudentProfile(profileData);
    } else {
      res = await authService.updateTeacherProfile(profileData);
    }

    if (res.success && res.profile) {
      setProfile(res.profile);
      if (profileData.name) {
        setUser((prev) => (prev ? { ...prev, name: profileData.name } : prev));
      }
    }
    return res;
  };

  // Sync Student Progress to Database
  const syncProgressToCloud = useCallback(async (progressState) => {
    if (!user || user.role !== 'student') return;
    try {
      await authService.syncStudentProgress(progressState);
    } catch (e) {
      console.warn('Could not sync progress to cloud', e);
    }
  }, [user]);

  // Refresh active user and profile from server
  const refreshProfile = useCallback(async () => {
    try {
      const data = await authService.getMe();
      if (data.success && data.user) {
        setUser(data.user);
        setProfile(data.profile);
        return { success: true, user: data.user, profile: data.profile };
      }
      return { success: false };
    } catch (err) {
      console.warn('refreshProfile error:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const value = {
    user,
    profile,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    authModalOpen,
    authModalMode,
    authModalRole,
    resetTokenParam,
    profileModalOpen,
    activeAssignments,
    openAuthModal,
    closeAuthModal,
    openProfileModal,
    closeProfileModal,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
    syncProgressToCloud,
    reloadAssignments: loadAssignments
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
