import { db } from '../config/database.js';

async function queryOne(sql, params = []) {
  if (db && typeof db.queryOne === 'function') return db.queryOne(sql, params);
  if (db && typeof db.prepare === 'function') return db.prepare(sql).get(...params) || null;
  return null;
}

async function query(sql, params = []) {
  if (db && typeof db.query === 'function') return db.query(sql, params);
  if (db && typeof db.prepare === 'function') return db.prepare(sql).all(...params);
  return [];
}

async function execute(sql, params = []) {
  if (db && typeof db.execute === 'function') return db.execute(sql, params);
  if (db && typeof db.prepare === 'function') return db.prepare(sql).run(...params);
  return null;
}

function safeJsonParse(val, fallback) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export const StudentProfileModel = {
  async findByUserId(userId) {
    if (!userId) return null;
    const row = await queryOne(`
      SELECT sp.*, u.name, u.email, u.last_login 
      FROM student_profiles sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.user_id = ?
    `, [userId]);

    if (!row) return null;

    return {
      ...row,
      streakDays: safeJsonParse(row.streak_days_json, {}),
      skills: safeJsonParse(row.skills_json, {}),
      learnedVocab: safeJsonParse(row.learned_vocab_json, [])
    };
  },

  async create(userId, {
    institution = 'College / University',
    course = 'General Studies',
    year = '1st Year',
    primaryGoal = 'Improve English Speaking',
    xp = 240,
    streak = 3,
    overallScore = 75
  } = {}) {
    const now = new Date().toISOString();
    await execute(`
      INSERT INTO student_profiles (
        user_id, institution, course, year, primary_goal, xp, streak, overall_score, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, institution, course, year, primaryGoal, xp, streak, overallScore, now]);

    return await this.findByUserId(userId);
  },

  async update(userId, { institution, course, year, primaryGoal }) {
    const now = new Date().toISOString();
    await execute(`
      UPDATE student_profiles 
      SET institution = COALESCE(?, institution),
          course = COALESCE(?, course),
          year = COALESCE(?, year),
          primary_goal = COALESCE(?, primary_goal),
          updated_at = ?
      WHERE user_id = ?
    `, [
      institution !== undefined ? institution : null,
      course !== undefined ? course : null,
      year !== undefined ? year : null,
      primaryGoal !== undefined ? primaryGoal : null,
      now,
      userId
    ]);

    return await this.findByUserId(userId);
  },

  async syncProgress(userId, {
    xp,
    streak,
    streakDays,
    sessionsCount,
    totalSpeakingTimeSeconds,
    completedChallenges,
    overallScore,
    skills,
    learnedVocab
  }) {
    const now = new Date().toISOString();
    await execute(`
      UPDATE student_profiles 
      SET xp = COALESCE(?, xp),
          streak = COALESCE(?, streak),
          streak_days_json = COALESCE(?, streak_days_json),
          sessions_count = COALESCE(?, sessions_count),
          total_speaking_seconds = COALESCE(?, total_speaking_seconds),
          completed_challenges = COALESCE(?, completed_challenges),
          overall_score = COALESCE(?, overall_score),
          skills_json = COALESCE(?, skills_json),
          learned_vocab_json = COALESCE(?, learned_vocab_json),
          updated_at = ?
      WHERE user_id = ?
    `, [
      xp !== undefined ? xp : null,
      streak !== undefined ? streak : null,
      streakDays ? JSON.stringify(streakDays) : null,
      sessionsCount !== undefined ? sessionsCount : null,
      totalSpeakingTimeSeconds !== undefined ? totalSpeakingTimeSeconds : null,
      completedChallenges !== undefined ? completedChallenges : null,
      overallScore !== undefined ? overallScore : null,
      skills ? JSON.stringify(skills) : null,
      learnedVocab ? JSON.stringify(learnedVocab) : null,
      now,
      userId
    ]);

    return await this.findByUserId(userId);
  },

  async findAll() {
    const rows = await query(`
      SELECT sp.*, u.name, u.email, u.last_login 
      FROM student_profiles sp
      JOIN users u ON sp.user_id = u.id
      ORDER BY sp.xp DESC
    `);

    return rows.map((row) => ({
      ...row,
      streakDays: safeJsonParse(row.streak_days_json, {}),
      skills: safeJsonParse(row.skills_json, {}),
      learnedVocab: safeJsonParse(row.learned_vocab_json, [])
    }));
  }
};
