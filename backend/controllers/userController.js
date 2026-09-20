import { db } from '../config/database.js';
import { UserModel } from '../models/User.js';
import { hashPassword, generateResetToken } from '../utils/security.js';
import { validatePassword } from '../utils/validation.js';

async function querySql(sql, params = []) {
  if (db && db.query) {
    return await db.query(sql, params);
  }
  return db.prepare(sql).all(...params);
}

async function queryOneSql(sql, params = []) {
  if (db && db.queryOne) {
    return await db.queryOne(sql, params);
  }
  return db.prepare(sql).get(...params) || null;
}

async function executeSql(sql, params = []) {
  if (db && db.execute) {
    return await db.execute(sql, params);
  }
  return db.prepare(sql).run(...params);
}

export const UserController = {
  /**
   * GET /api/users
   * Fetch list of all registered users with their academic/role details.
   * SECURITY: password_hash and salt are strictly excluded from selection.
   */
  async getAllUsers(req, res) {
    try {
      const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const searchQuery = (urlObj.searchParams.get('q') || '').trim().toLowerCase();
      const roleFilter = (urlObj.searchParams.get('role') || '').trim().toLowerCase();

      // Secure SQL query - selecting only safe, public/display columns
      const queryStr = `
        SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.role, 
          u.profile_image, 
          u.created_at, 
          u.last_login,
          sp.institution AS student_institution, 
          sp.course, 
          sp.year, 
          sp.primary_goal, 
          sp.xp, 
          sp.streak, 
          sp.overall_score,
          tp.institution AS teacher_institution, 
          tp.department, 
          tp.designation
        FROM users u
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
        ORDER BY u.created_at DESC
      `;

      const rows = await querySql(queryStr);

      let users = rows.map((r) => ({
        id: r.id,
        name: r.name,
        username: r.name, // Display username
        email: r.email,
        role: r.role,
        profileImage: r.profile_image,
        createdAt: r.created_at,
        lastLogin: r.last_login,
        profile: r.role === 'student' ? {
          institution: r.student_institution || 'Institution / University',
          course: r.course || 'General Studies',
          year: r.year || '1st Year',
          primaryGoal: r.primary_goal || 'Improve English Speaking',
          xp: r.xp ?? 0,
          streak: r.streak ?? 0,
          overallScore: r.overall_score ?? 70
        } : {
          institution: r.teacher_institution || 'Department / University',
          department: r.department || 'Communication & Humanities',
          designation: r.designation || 'Instructor'
        }
      }));

      // In-memory filter for flexible search & role filtering
      if (roleFilter && (roleFilter === 'student' || roleFilter === 'teacher')) {
        users = users.filter(u => u.role === roleFilter);
      }

      if (searchQuery) {
        users = users.filter(u => 
          u.name.toLowerCase().includes(searchQuery) ||
          u.email.toLowerCase().includes(searchQuery) ||
          (u.profile?.institution && u.profile.institution.toLowerCase().includes(searchQuery))
        );
      }

      return res.status(200).json({
        success: true,
        count: users.length,
        totalRegistered: rows.length,
        users
      });
    } catch (err) {
      console.error('Error in getAllUsers:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve users directory.',
        error: err.message
      });
    }
  },

  /**
   * GET /api/users/:id
   * Fetch single user details securely without sensitive keys.
   */
  async getUserById(req, res, userId) {
    try {
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required.' });
      }

      const row = await queryOneSql(`
        SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.role, 
          u.profile_image, 
          u.created_at, 
          u.last_login,
          sp.institution AS student_institution, 
          sp.course, 
          sp.year, 
          sp.primary_goal, 
          sp.xp, 
          sp.streak, 
          sp.overall_score,
          tp.institution AS teacher_institution, 
          tp.department, 
          tp.designation
        FROM users u
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
        WHERE u.id = ?
      `, [userId]);

      if (!row) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const user = {
        id: row.id,
        name: row.name,
        username: row.name,
        email: row.email,
        role: row.role,
        profileImage: row.profile_image,
        createdAt: row.created_at,
        lastLogin: row.last_login,
        profile: row.role === 'student' ? {
          institution: row.student_institution || 'Institution',
          course: row.course || 'General Studies',
          year: row.year || '1st Year',
          primaryGoal: row.primary_goal || 'Improve English Speaking',
          xp: row.xp ?? 0,
          streak: row.streak ?? 0,
          overallScore: row.overall_score ?? 70
        } : {
          institution: row.teacher_institution || 'Institution',
          department: row.department || 'Communication',
          designation: row.designation || 'Instructor'
        }
      };

      return res.status(200).json({ success: true, user });
    } catch (err) {
      console.error('Error in getUserById:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve user details.' });
    }
  },

  /**
   * POST /api/users/forgot-password
   * Request password reset token for any user (by email or user ID).
   */
  async requestPasswordReset(req, res) {
    try {
      const { email, userId } = req.body || {};

      let targetUser = null;
      if (email) {
        targetUser = await UserModel.findByEmail(email.trim().toLowerCase());
      } else if (userId) {
        targetUser = await UserModel.findById(userId);
      }

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: 'No user found matching the provided email or ID.'
        });
      }

      const token = generateResetToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity

      await executeSql(
        'INSERT INTO password_resets (token, email, expires_at, used) VALUES (?, ?, ?, 0)',
        [token, targetUser.email, expiresAt]
      );

      return res.status(200).json({
        success: true,
        message: `Password reset token generated for ${targetUser.name}.`,
        user: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email
        },
        token,
        expiresAt,
        resetUrl: `${process.env.APP_URL || 'http://localhost:5173'}?resetToken=${token}`
      });
    } catch (err) {
      console.error('requestPasswordReset error:', err);
      return res.status(500).json({
        success: false,
        message: 'Could not generate password reset token.',
        error: err.message
      });
    }
  },

  /**
   * POST /api/users/reset-password
   * Verify token and securely hash and store the new password.
   */
  async executePasswordReset(req, res) {
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
      const record = await queryOneSql(
        'SELECT * FROM password_resets WHERE token = ? AND used = 0',
        [token]
      );

      if (!record) {
        return res.status(400).json({
          success: false,
          message: 'This password reset token is invalid or has already been used.'
        });
      }

      // Verify expiration
      if (new Date() > new Date(record.expires_at)) {
        return res.status(400).json({
          success: false,
          message: 'This password reset token has expired. Please request a fresh reset link.'
        });
      }

      const user = await UserModel.findByEmail(record.email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Account associated with this reset link was not found.'
        });
      }

      // Cryptographically hash the new password using scrypt with unique salt
      const { hash, salt } = hashPassword(newPassword);
      await executeSql('UPDATE users SET password_hash = ?, salt = ? WHERE id = ?', [hash, salt, user.id]);

      // Invalidate token immediately
      await executeSql('UPDATE password_resets SET used = 1 WHERE token = ?', [token]);

      return res.status(200).json({
        success: true,
        message: `Password successfully updated for ${user.name}! You can now sign in with your new password.`
      });
    } catch (err) {
      console.error('executePasswordReset error:', err);
      return res.status(500).json({
        success: false,
        message: 'Could not reset password. Please try again.',
        error: err.message
      });
    }
  }
};
