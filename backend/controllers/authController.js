import crypto from 'node:crypto';
import { UserModel } from '../models/User.js';
import { StudentProfileModel } from '../models/StudentProfile.js';
import { TeacherProfileModel } from '../models/TeacherProfile.js';
import { db } from '../config/database.js';
import { hashPassword, verifyPassword, generateToken, generateResetToken } from '../utils/security.js';
import { validateEmail, validatePassword, sanitizeString } from '../utils/validation.js';

export const AuthController = {
  /**
   * Register a new student account
   */
  async register(req, res) {
    try {
      const { 
        name, 
        email, 
        password, 
        confirmPassword, 
        college, 
        course, 
        year, 
        primaryGoal 
      } = req.body || {};

      // 1. Basic presence check
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please fill in all required fields (Name, Email, and Password).'
        });
      }

      // 2. Email format validation
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.'
        });
      }

      // 3. Confirm password check
      if (confirmPassword && password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match. Please verify and try again.'
        });
      }

      // 4. Password strength validation
      const pwdCheck = validatePassword(password);
      if (!pwdCheck.isValid) {
        return res.status(400).json({
          success: false,
          message: pwdCheck.message
        });
      }

      // 5. Check if email already registered
      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists. Please sign in instead.'
        });
      }

      // 6. Hash password & create user
      const { hash, salt } = hashPassword(password);
      const userId = `usr_std_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

      const user = await UserModel.create({
        id: userId,
        name: sanitizeString(name, 100),
        email,
        passwordHash: hash,
        salt,
        role: 'student'
      });

      // 7. Create student profile
      const profile = await StudentProfileModel.create(userId, {
        institution: sanitizeString(college || 'College / University', 120),
        course: sanitizeString(course || 'General Studies', 100),
        year: sanitizeString(year || '1st Year', 50),
        primaryGoal: sanitizeString(primaryGoal || 'Improve English Speaking', 100)
      });

      // 8. Generate auth token
      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      return res.status(201).json({
        success: true,
        message: `Welcome to SpeakUp, ${user.name}!`,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at
        },
        profile
      });
    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong during registration. Please try again.'
      });
    }
  },

  /**
   * Login student or teacher
   */
  async login(req, res) {
    try {
      const { email, password, role, name, identifier, username } = req.body || {};
      const loginIdentifier = (email || name || identifier || username || '').trim();

      if (!loginIdentifier || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please enter your email or name, and your password.'
        });
      }

      const { UserModel: FreshUserModel } = await import(`../models/User.js?t=${Date.now()}`);
      const user = await FreshUserModel.findByEmailOrName(loginIdentifier);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "We couldn't sign you in with those details. Please check your email or name and password and try again."
        });
      }

      // Verify password
      const isMatch = verifyPassword(password, user.password_hash, user.salt);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "We couldn't sign you in with those details. Please check your email or name and password and try again."
        });
      }

      // Role check (prevent students from logging into teacher mode or vice-versa)
      if (role && user.role !== role) {
        if (user.role === 'teacher' && role === 'student') {
          return res.status(403).json({
            success: false,
            message: 'This account is registered as a Teacher. Please use the Teacher Sign In tab.'
          });
        }
        if (user.role === 'student' && role === 'teacher') {
          return res.status(403).json({
            success: false,
            message: 'This account is registered as a Student. Teacher privileges are not assigned to this account.'
          });
        }
      }

      // Update last login
      await UserModel.updateLastLogin(user.id);

      // Fetch profile
      let profile = null;
      if (user.role === 'student') {
        profile = await StudentProfileModel.findByUserId(user.id);
      } else if (user.role === 'teacher') {
        profile = await TeacherProfileModel.findByUserId(user.id);
      }

      // Generate token
      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      return res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          lastLogin: new Date().toISOString()
        },
        profile
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while signing you in. Please try again.'
      });
    }
  },

  /**
   * Get currently authenticated user profile
   */
  async me(req, res) {
    try {
      const user = req.user;
      let profile = null;
      if (user.role === 'student') {
        profile = await StudentProfileModel.findByUserId(user.id);
      } else if (user.role === 'teacher') {
        profile = await TeacherProfileModel.findByUserId(user.id);
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at
        },
        profile
      });
    } catch (err) {
      console.error('Me endpoint error:', err);
      return res.status(500).json({
        success: false,
        message: 'Could not fetch user profile.'
      });
    }
  },

  /**
   * Forgot password: creates short-lived reset token
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body || {};

      if (!email || !validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.'
        });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = await UserModel.findByEmail(normalizedEmail);

      // For security, always respond with same message regardless of whether user exists
      const successMessage = "If an account exists with this email, we'll send password reset instructions.";

      if (user) {
        const token = generateResetToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

        await db.execute(
          'INSERT INTO password_resets (token, email, expires_at, used) VALUES (?, ?, ?, 0)',
          [token, normalizedEmail, expiresAt]
        );

        const resetUrl = `${process.env.APP_URL || 'http://localhost:5173'}?resetToken=${token}`;

        // Log locally/server-side for dev mode
        console.log('---------------------------------------------------------');
        console.log(`🔐 [SpeakUp Auth] Password Reset Requested for: ${normalizedEmail}`);
        console.log(`🔗 Reset Token: ${token}`);
        console.log(`🌐 Reset URL: ${resetUrl}`);
        console.log('---------------------------------------------------------');

        return res.status(200).json({
          success: true,
          message: successMessage,
          // Expose dev token only in development for smooth pair-programming verification
          devResetToken: process.env.NODE_ENV !== 'production' ? token : undefined
        });
      }

      return res.status(200).json({
        success: true,
        message: successMessage
      });
    } catch (err) {
      console.error('Forgot password error:', err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.'
      });
    }
  },

  /**
   * Reset password with valid token
   */
  async resetPassword(req, res) {
    try {
      const { token, newPassword, confirmPassword } = req.body || {};

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Reset token and new password are required.'
        });
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match. Please verify and try again.'
        });
      }

      const pwdCheck = validatePassword(newPassword);
      if (!pwdCheck.isValid) {
        return res.status(400).json({
          success: false,
          message: pwdCheck.message
        });
      }

      // Check token in DB
      const record = await db.queryOne(
        'SELECT * FROM password_resets WHERE token = ? AND used = 0',
        [token]
      );

      if (!record) {
        return res.status(400).json({
          success: false,
          message: 'This password reset link is invalid or has already been used.'
        });
      }

      // Check expiry
      if (new Date() > new Date(record.expires_at)) {
        return res.status(400).json({
          success: false,
          message: 'This password reset link has expired. Please request a new one.'
        });
      }

      const user = await UserModel.findByEmail(record.email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Account associated with this reset link was not found.'
        });
      }

      // Hash new password and update user
      const { hash, salt } = hashPassword(newPassword);
      await UserModel.updatePassword(user.id, hash, salt);

      // Mark token as used
      await db.execute('UPDATE password_resets SET used = 1 WHERE token = ?', [token]);

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully. You can now sign in with your new password.'
      });
    } catch (err) {
      console.error('Reset password error:', err);
      return res.status(500).json({
        success: false,
        message: 'Could not reset password. Please try again.'
      });
    }
  },

  /**
   * Change password for currently authenticated user
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body || {};
      const user = req.user;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required.'
        });
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match.'
        });
      }

      // Verify current password
      const fullUser = await UserModel.findByEmail(user.email);
      if (!fullUser) {
        return res.status(404).json({
          success: false,
          message: 'User account not found.'
        });
      }

      const isCurrentValid = verifyPassword(currentPassword, fullUser.password_hash, fullUser.salt);
      if (!isCurrentValid) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password.'
        });
      }

      const pwdCheck = validatePassword(newPassword);
      if (!pwdCheck.isValid) {
        return res.status(400).json({
          success: false,
          message: pwdCheck.message
        });
      }

      const { hash, salt } = hashPassword(newPassword);
      await UserModel.updatePassword(user.id, hash, salt);

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully!'
      });
    } catch (err) {
      console.error('changePassword error:', err);
      return res.status(500).json({
        success: false,
        message: 'Could not change password.'
      });
    }
  }
};
