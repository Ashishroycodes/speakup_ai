/**
 * SpeakUp AI Studio - Authentication & Profile API Client Service
 */

const TOKEN_KEY = 'speakup_auth_token_v1';
const USER_KEY = 'speakup_auth_user_v1';

export const authService = {
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      console.warn('Could not save auth token to localStorage', e);
    }
  },

  getCachedUser() {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setCachedUser(user) {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.warn('Could not cache user to localStorage', e);
    }
  },

  clearSession() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Could not clear auth session from localStorage', e);
    }
  },

  /**
   * Universal fetch helper with auth header injection
   */
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(endpoint, {
        ...options,
        headers
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error(`Fetch error on ${endpoint}:`, err);
      return {
        success: false,
        message: 'Could not connect to SpeakUp server. Please check your network.'
      };
    }
  },

  /**
   * Student / Teacher Sign In
   */
  async login({ email, password, role = 'student', name, identifier }) {
    const loginIdentifier = email || name || identifier;
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: loginIdentifier, identifier: loginIdentifier, password, role })
    });

    if (data.success && data.token) {
      this.setToken(data.token);
      this.setCachedUser(data.user);
    }

    return data;
  },

  /**
   * Student Account Registration
   */
  async register(registrationData) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData)
    });

    if (data.success && data.token) {
      this.setToken(data.token);
      this.setCachedUser(data.user);
    }

    return data;
  },

  /**
   * Verify Session & Fetch Active User
   */
  async getMe() {
    const data = await this.request('/api/auth/me', {
      method: 'GET'
    });

    if (data.success && data.user) {
      this.setCachedUser(data.user);
    } else {
      this.clearSession();
    }

    return data;
  },

  /**
   * Forgot Password Link Request
   */
  async forgotPassword(email) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Password Reset with Verification Token
   */
  async resetPassword({ token, newPassword, confirmPassword }) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword, confirmPassword })
    });
  },

  /**
   * Update Student Profile
   */
  async updateStudentProfile(profileData) {
    return this.request('/api/student/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  /**
   * Synchronize Student Progress (XP, Streak, Vocab, Skills) with Database
   */
  async syncStudentProgress(progressData) {
    return this.request('/api/student/progress/sync', {
      method: 'POST',
      body: JSON.stringify(progressData)
    });
  },

  /**
   * Get Student Active Assignments
   */
  async getStudentAssignments() {
    return this.request('/api/student/assignments', {
      method: 'GET'
    });
  },

  /**
   * Teacher: Get Class Analytics & Students List
   */
  async getTeacherStudents() {
    return this.request('/api/teacher/students', {
      method: 'GET'
    });
  },

  /**
   * Teacher: Create New Practice Assignment
   */
  async createAssignment(assignmentData) {
    return this.request('/api/teacher/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData)
    });
  },

  /**
   * Teacher: Get Created Assignments
   */
  async getTeacherAssignments() {
    return this.request('/api/teacher/assignments', {
      method: 'GET'
    });
  },

  /**
   * Teacher: Delete Assignment by ID
   */
  async deleteAssignment(assignmentId) {
    return this.request(`/api/teacher/assignments/${encodeURIComponent(assignmentId)}`, {
      method: 'DELETE'
    });
  },

  /**
   * Teacher: Update Profile
   */
  async updateTeacherProfile(profileData) {
    return this.request('/api/teacher/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  /**
   * Universal: Fetch active authenticated user & profile from active session
   */
  async getProfile() {
    return this.request('/api/auth/me', {
      method: 'GET'
    });
  },

  /**
   * Student: Fetch Student Profile directly
   */
  async getStudentProfile() {
    return this.request('/api/student/profile', {
      method: 'GET'
    });
  },

  /**
   * Teacher: Fetch Teacher Profile directly
   */
  async getTeacherProfile() {
    return this.request('/api/teacher/profile', {
      method: 'GET'
    });
  },

  /**
   * Authenticated User: Change Password
   */
  async changePassword({ currentPassword, newPassword, confirmPassword }) {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
    });
  }
};
