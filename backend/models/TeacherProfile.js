import { db } from '../config/database.js';

export const TeacherProfileModel = {
  async findByUserId(userId) {
    if (!userId) return null;
    return await db.queryOne(`
      SELECT tp.*, u.name, u.email 
      FROM teacher_profiles tp
      JOIN users u ON tp.user_id = u.id
      WHERE tp.user_id = ?
    `, [userId]);
  },

  async create(userId, {
    institution = 'Institution / University',
    department = 'Humanities & Communication',
    designation = 'Assistant Professor'
  } = {}) {
    const now = new Date().toISOString();
    await db.execute(`
      INSERT INTO teacher_profiles (user_id, institution, department, designation, created_at)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, institution, department, designation, now]);

    return await this.findByUserId(userId);
  },

  async update(userId, { institution, department, designation }) {
    await db.execute(`
      UPDATE teacher_profiles
      SET institution = COALESCE(?, institution),
          department = COALESCE(?, department),
          designation = COALESCE(?, designation)
      WHERE user_id = ?
    `, [institution, department, designation, userId]);

    return await this.findByUserId(userId);
  }
};
