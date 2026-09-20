import crypto from 'node:crypto';
import { TeacherProfileModel } from '../models/TeacherProfile.js';
import { UserModel } from '../models/User.js';
import { sanitizeString } from '../utils/validation.js';

export const TeacherController = {
  /**
   * Get all students with class analytics KPIs
   */
  async getStudents(req, res) {
    try {
      const { StudentProfileModel } = await import(`../models/StudentProfile.js?t=${Date.now()}`);
      const { AssignmentModel } = await import(`../models/Assignment.js?t=${Date.now()}`);
      const students = await StudentProfileModel.findAll();
      const assignments = await AssignmentModel.findAll();

      // Compute aggregate KPIs
      const totalStudents = students.length;
      const activeStudents = students.filter((s) => s.streak > 0).length;
      const totalSessions = students.reduce((acc, s) => acc + (s.sessions_count || 0), 0);
      const avgScore = totalStudents > 0
        ? Math.round(students.reduce((acc, s) => acc + (s.overall_score || 70), 0) / totalStudents)
        : 75;

      return res.status(200).json({
        success: true,
        kpis: {
          totalStudents,
          activeStudents,
          totalSessions,
          activeAssignments: assignments.length,
          averageScore: avgScore
        },
        students: students.map((s) => ({
          id: s.user_id,
          name: s.name,
          email: s.email,
          course: s.course,
          year: s.year,
          institution: s.institution,
          primaryGoal: s.primary_goal,
          xp: s.xp,
          streak: s.streak,
          overallScore: s.overall_score,
          sessionsCount: s.sessions_count,
          lastActive: s.last_login || s.updated_at
        }))
      });
    } catch (err) {
      console.error('getStudents error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve students list.'
      });
    }
  },

  /**
   * Get single student detailed metrics
   */
  async getStudentById(req, res) {
    try {
      const { id } = req.params || {};
      if (!id) {
        return res.status(400).json({ success: false, message: 'Student ID required.' });
      }

      const { StudentProfileModel } = await import(`../models/StudentProfile.js?t=${Date.now()}`);
      const student = await StudentProfileModel.findByUserId(id);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found.' });
      }

      return res.status(200).json({
        success: true,
        student
      });
    } catch (err) {
      console.error('getStudentById error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to load student details.'
      });
    }
  },

  /**
   * Create a new practice assignment for students
   */
  async createAssignment(req, res) {
    try {
      const b = req.body || {};
      const title = b.title;
      const skill = b.skill || b.skill_category || 'Speaking';
      const difficulty = b.difficulty || 'Intermediate';
      const durationMinutes = b.durationMinutes || b.duration_minutes || 15;
      const dueDate = b.dueDate || b.due_date;
      const instructions = b.instructions || b.description || '';

      if (!title || !dueDate) {
        return res.status(400).json({
          success: false,
          message: 'Assignment title and due date are required.'
        });
      }

      const assignmentId = `asg_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      const { AssignmentModel } = await import(`../models/Assignment.js?t=${Date.now()}`);
      const assignment = await AssignmentModel.create({
        id: assignmentId,
        teacherId: req.user.id,
        title: sanitizeString(title, 150),
        skill: sanitizeString(skill, 50),
        difficulty: sanitizeString(difficulty, 30),
        durationMinutes: parseInt(durationMinutes, 10) || 15,
        dueDate,
        instructions: sanitizeString(instructions, 500)
      });

      return res.status(201).json({
        success: true,
        message: 'Practice assignment published successfully.',
        assignment
      });
    } catch (err) {
      console.error('createAssignment error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to create assignment.'
      });
    }
  },

  /**
   * Get all teacher assignments
   */
  async getAssignments(req, res) {
    try {
      const { AssignmentModel } = await import(`../models/Assignment.js?t=${Date.now()}`);
      const assignments = await AssignmentModel.findAll();
      return res.status(200).json({
        success: true,
        assignments
      });
    } catch (err) {
      console.error('Teacher getAssignments error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to load assignments.'
      });
    }
  },

  /**
   * Get authenticated teacher's profile
   */
  async getProfile(req, res) {
    try {
      const profile = await TeacherProfileModel.findByUserId(req.user.id);
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
        message: 'Failed to retrieve teacher profile.'
      });
    }
  },

  /**
   * Update teacher profile details
   */
  async updateProfile(req, res) {
    try {
      const { name, institution, department, designation } = req.body || {};

      if (name) {
        await UserModel.updateName(req.user.id, sanitizeString(name, 100));
      }

      const updated = await TeacherProfileModel.update(req.user.id, {
        institution: institution ? sanitizeString(institution, 120) : undefined,
        department: department ? sanitizeString(department, 120) : undefined,
        designation: designation ? sanitizeString(designation, 100) : undefined
      });

      return res.status(200).json({
        success: true,
        message: 'Teacher profile updated successfully.',
        profile: updated
      });
    } catch (err) {
      console.error('updateTeacherProfile error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update teacher profile.'
      });
    }
  }
};
