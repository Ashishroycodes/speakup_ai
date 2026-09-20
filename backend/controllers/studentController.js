import { UserModel } from '../models/User.js';
import { AssignmentModel } from '../models/Assignment.js';
import { sanitizeString } from '../utils/validation.js';

export const StudentController = {
  /**
   * Get authenticated student's profile & progress
   */
  async getProfile(req, res) {
    try {
      const { StudentProfileModel } = await import(`../models/StudentProfile.js?t=${Date.now()}`);
      const profile = await StudentProfileModel.findByUserId(req.user.id);
      return res.status(200).json({
        success: true,
        user: {
          id: req.user.id,
          name: profile ? profile.name : req.user.name,
          email: profile ? profile.email : req.user.email,
          role: req.user.role
        },
        profile
      });
    } catch (err) {
      console.error('getProfile error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve student profile.'
      });
    }
  },

  /**
   * Update student personal & academic details
   */
  async updateProfile(req, res) {
    try {
      const { StudentProfileModel } = await import(`../models/StudentProfile.js?t=${Date.now()}`);
      const { name, institution, course, year, primaryGoal } = req.body || {};

      if (name) {
        await UserModel.updateName(req.user.id, sanitizeString(name, 100));
      }

      const updated = await StudentProfileModel.update(req.user.id, {
        institution: institution ? sanitizeString(institution, 120) : undefined,
        course: course ? sanitizeString(course, 100) : undefined,
        year: year ? sanitizeString(year, 50) : undefined,
        primaryGoal: primaryGoal ? sanitizeString(primaryGoal, 100) : undefined
      });

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        profile: updated
      });
    } catch (err) {
      console.error('updateProfile error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update student profile.'
      });
    }
  },

  /**
   * Sync practice progress (XP, streak, skills, vocab) to backend database
   */
  async syncProgress(req, res) {
    try {
      const { StudentProfileModel } = await import(`../models/StudentProfile.js?t=${Date.now()}`);
      const progressData = req.body || {};

      const updated = await StudentProfileModel.syncProgress(req.user.id, progressData);

      return res.status(200).json({
        success: true,
        message: 'Progress synchronized with SpeakUp cloud.',
        profile: updated
      });
    } catch (err) {
      console.error('syncProgress error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to synchronize progress.',
        error: err.message
      });
    }
  },

  /**
   * Get assignments published by teachers for students
   */
  async getAssignments(req, res) {
    try {
      const assignments = await AssignmentModel.findAll();
      return res.status(200).json({
        success: true,
        assignments
      });
    } catch (err) {
      console.error('getAssignments error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to load assignments.'
      });
    }
  }
};
