import { db } from '../config/database.js';

export const AssignmentModel = {
  async create({
    id,
    teacherId,
    title,
    skill = 'Speaking',
    difficulty = 'Intermediate',
    durationMinutes = 15,
    dueDate,
    instructions = ''
  }) {
    const now = new Date().toISOString();
    await db.execute(`
      INSERT INTO assignments (
        id, teacher_id, title, skill, difficulty, duration_minutes, due_date, instructions, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      teacherId,
      title.trim(),
      skill,
      difficulty,
      durationMinutes,
      dueDate,
      instructions.trim(),
      now
    ]);

    return await this.findById(id);
  },

  async findAll() {
    return await db.query(`
      SELECT a.*, u.name as teacher_name 
      FROM assignments a
      JOIN users u ON a.teacher_id = u.id
      ORDER BY a.created_at DESC
    `);
  },

  async findById(id) {
    return await db.queryOne(`
      SELECT a.*, u.name as teacher_name 
      FROM assignments a
      JOIN users u ON a.teacher_id = u.id
      WHERE a.id = ?
    `, [id]);
  },

  async delete(id, teacherId) {
    return await db.execute('DELETE FROM assignments WHERE id = ? AND teacher_id = ?', [id, teacherId]);
  }
};
