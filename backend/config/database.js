import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getMysqlPool, initMysqlDatabase, getMysqlStatus } from './mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically import native SQLite if supported by Node runtime
let DatabaseSyncClass = null;
try {
  const sqliteMod = await import('node:sqlite');
  DatabaseSyncClass = sqliteMod.DatabaseSync;
} catch {
  // Gracefully handle older Node runtimes or environments without native sqlite
}

/**
 * Check if MySQL database engine is requested in .env
 */
export function isMysqlConfigured() {
  const dbType = (process.env.DB_TYPE || '').toLowerCase();
  return dbType === 'mysql' || Boolean(process.env.MYSQL_URL) || Boolean(process.env.MYSQL_HOST);
}

// --------------------------------------------------------------------------
// SQLite Engine Fallback Setup (Writable in local dev and Vercel /tmp)
// --------------------------------------------------------------------------
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const envDbPath = process.env.DATABASE_PATH;
export const DB_PATH = envDbPath
  ? (path.isAbsolute(envDbPath) ? envDbPath : path.resolve(process.cwd(), envDbPath))
  : (isServerless ? path.join('/tmp', 'speakup.db') : path.resolve(__dirname, '../../data/speakup.db'));

let _sqliteDbInstance = null;
let _sqliteInitError = null;

export function getSqliteDb() {
  if (_sqliteDbInstance) return _sqliteDbInstance;
  if (_sqliteInitError) throw _sqliteInitError;

  if (!DatabaseSyncClass) {
    const err = new Error('Native SQLite (DatabaseSync) is not available in this Node runtime.');
    _sqliteInitError = err;
    throw err;
  }

  try {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      try {
        fs.mkdirSync(dbDir, { recursive: true });
      } catch {
        // Safe fallback in restricted filesystems
      }
    }

    _sqliteDbInstance = new DatabaseSyncClass(DB_PATH);
    try { _sqliteDbInstance.exec('PRAGMA journal_mode = WAL;'); } catch {}
    try { _sqliteDbInstance.exec('PRAGMA foreign_keys = ON;'); } catch {}
    return _sqliteDbInstance;
  } catch (err) {
    _sqliteInitError = err;
    console.warn(`[DB] SQLite initialization failed: ${err.message}`);
    throw err;
  }
}

// Proxy wrapper for backward-compatibility with synchronous sqliteDb calls
export const sqliteDb = {
  prepare(sql) {
    return getSqliteDb().prepare(sql);
  },
  exec(sql) {
    return getSqliteDb().exec(sql);
  }
};

// --------------------------------------------------------------------------
// Unified Database Interface (Supports both MySQL and SQLite)
// --------------------------------------------------------------------------
export const db = {
  get isMysql() {
    return isMysqlConfigured();
  },

  async query(sql, params = []) {
    if (!isInitialized) await initDatabase().catch(() => {});
    if (this.isMysql) {
      try {
        const pool = await getMysqlPool();
        const [rows] = await pool.query(sql, params);
        return rows;
      } catch (err) {
        console.warn(`[DB] MySQL query fallback to SQLite: ${err.message}`);
      }
    }
    return sqliteDb.prepare(sql).all(...params);
  },

  async queryOne(sql, params = []) {
    if (!isInitialized) await initDatabase().catch(() => {});
    if (this.isMysql) {
      try {
        const pool = await getMysqlPool();
        const [rows] = await pool.query(sql, params);
        return rows[0] || null;
      } catch (err) {
        console.warn(`[DB] MySQL queryOne fallback to SQLite: ${err.message}`);
      }
    }
    return sqliteDb.prepare(sql).get(...params) || null;
  },

  async execute(sql, params = []) {
    if (!isInitialized) await initDatabase().catch(() => {});
    if (this.isMysql) {
      try {
        const pool = await getMysqlPool();
        const [result] = await pool.query(sql, params);
        return result;
      } catch (err) {
        console.warn(`[DB] MySQL execute fallback to SQLite: ${err.message}`);
      }
    }
    return sqliteDb.prepare(sql).run(...params);
  },

  prepare(sql) {
    if (this.isMysql) {
      return {
        get: async (...params) => {
          try {
            const pool = await getMysqlPool();
            const [rows] = await pool.query(sql, params);
            return rows[0] || null;
          } catch (err) {
            console.warn(`[DB] MySQL prepare.get fallback to SQLite: ${err.message}`);
            return sqliteDb.prepare(sql).get(...params) || null;
          }
        },
        all: async (...params) => {
          try {
            const pool = await getMysqlPool();
            const [rows] = await pool.query(sql, params);
            return rows;
          } catch (err) {
            console.warn(`[DB] MySQL prepare.all fallback to SQLite: ${err.message}`);
            return sqliteDb.prepare(sql).all(...params);
          }
        },
        run: async (...params) => {
          try {
            const pool = await getMysqlPool();
            const [result] = await pool.query(sql, params);
            return result;
          } catch (err) {
            console.warn(`[DB] MySQL prepare.run fallback to SQLite: ${err.message}`);
            return sqliteDb.prepare(sql).run(...params);
          }
        }
      };
    }

    const stmt = sqliteDb.prepare(sql);
    return {
      get: (...params) => stmt.get(...params),
      all: (...params) => stmt.all(...params),
      run: (...params) => stmt.run(...params)
    };
  },

  exec(sql) {
    return sqliteDb.exec(sql);
  }
};

let isInitializing = false;
let isInitialized = false;

/**
 * Initialize Database Tables and Schemas
 */
export async function initDatabase() {
  if (isInitialized || isInitializing) return;
  isInitializing = true;

  try {
    if (isMysqlConfigured()) {
      try {
        await initMysqlDatabase();
        console.log('✅ [Database] MySQL connection pool ready & schema initialized.');
        isInitialized = true;
        return;
      } catch (err) {
        console.warn(`⚠️ [Database] MySQL connection failed (${err.message}). Initializing SQLite fallback.`);
      }
    }

    // SQLite Schema Initialization
    if (DatabaseSyncClass) {
      try {
        initSqliteDatabase();
        isInitialized = true;
      } catch (sqliteErr) {
        console.warn(`⚠️ [Database] SQLite schema init warning: ${sqliteErr.message}`);
      }
    }
  } finally {
    isInitializing = false;
  }
}

/**
 * Initialize SQLite schemas
 */
function initSqliteDatabase() {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'teacher')),
      profile_image TEXT,
      created_at TEXT NOT NULL,
      last_login TEXT
    );
  `);

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS student_profiles (
      user_id TEXT PRIMARY KEY,
      institution TEXT DEFAULT 'Delhi Technological University',
      course TEXT DEFAULT 'Computer Science & Engineering',
      year TEXT DEFAULT '3rd Year',
      primary_goal TEXT DEFAULT 'Improve English Speaking',
      xp INTEGER DEFAULT 240,
      streak INTEGER DEFAULT 3,
      streak_days_json TEXT DEFAULT '{"Mon":true,"Tue":true,"Wed":true,"Thu":false,"Fri":false}',
      sessions_count INTEGER DEFAULT 3,
      total_speaking_seconds INTEGER DEFAULT 180,
      completed_challenges INTEGER DEFAULT 1,
      overall_score INTEGER DEFAULT 78,
      skills_json TEXT DEFAULT '{"speakingFluency":80,"grammar":70,"vocabulary":72,"clarity":82}',
      learned_vocab_json TEXT DEFAULT '["v-1","v-2","v-3","v-8"]',
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS teacher_profiles (
      user_id TEXT PRIMARY KEY,
      institution TEXT DEFAULT 'Delhi Technological University',
      department TEXT DEFAULT 'Humanities & Professional Communication',
      designation TEXT DEFAULT 'Senior Assistant Professor',
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      teacher_id TEXT NOT NULL,
      title TEXT NOT NULL,
      skill TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      due_date TEXT NOT NULL,
      instructions TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS password_resets (
      token TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0
    );
  `);

  seedSqliteDefaultAccounts();
}

function hashPasswordInline(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function seedSqliteDefaultAccounts() {
  const studentCheck = sqliteDb.prepare('SELECT id FROM users WHERE email = ?').get('student@speakup.edu');
  if (!studentCheck) {
    const { hash, salt } = hashPasswordInline('Student@123');
    const now = new Date().toISOString();
    const studentId = 'usr_student_demo_01';

    sqliteDb.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, created_at, last_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(studentId, 'Ashish Kumar', 'student@speakup.edu', hash, salt, 'student', now, now);

    sqliteDb.prepare(`
      INSERT INTO student_profiles (
        user_id, institution, course, year, primary_goal, xp, streak,
        sessions_count, total_speaking_seconds, completed_challenges, overall_score, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(studentId, 'IIT Delhi', 'B.Tech Computer Science', '3rd Year', 'Placement & Tech Interview Preparation', 320, 4, 5, 280, 2, 82, now);
  }

  const teacherCheck = sqliteDb.prepare('SELECT id FROM users WHERE email = ?').get('teacher@speakup.edu');
  if (!teacherCheck) {
    const { hash, salt } = hashPasswordInline('Teacher@123');
    const now = new Date().toISOString();
    const teacherId = 'usr_teacher_demo_01';

    sqliteDb.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, created_at, last_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(teacherId, 'Dr. Priya Mukherjee', 'teacher@speakup.edu', hash, salt, 'teacher', now, now);

    sqliteDb.prepare(`
      INSERT INTO teacher_profiles (user_id, institution, department, designation, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(teacherId, 'IIT Delhi', 'Department of Humanities & Management', 'Associate Professor of Communication', now);

    sqliteDb.prepare(`
      INSERT INTO assignments (id, teacher_id, title, skill, difficulty, duration_minutes, due_date, instructions, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('asg_project_pitch_01', teacherId, '60-Second Technical Project Elevator Pitch', 'Presentation', 'Intermediate', 15, new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], 'Introduce your academic project clearly. State the core problem, your methodology, and the key impact within 60 seconds.', now);
  }

  // Ensure placeholder student profiles are completely purged
  const placeholderIds = ['usr_student_02', 'usr_student_03', 'usr_student_04'];
  for (const pid of placeholderIds) {
    sqliteDb.prepare('DELETE FROM student_profiles WHERE user_id = ?').run(pid);
    sqliteDb.prepare('DELETE FROM users WHERE id = ?').run(pid);
  }
}

/**
 * Diagnostic helper to check database health and statistics
 */
export async function getDatabaseStatus() {
  if (!isInitialized) {
    await initDatabase().catch(() => {});
  }

  if (isMysqlConfigured()) {
    const mysqlStatus = await getMysqlStatus();
    if (mysqlStatus.connected) return mysqlStatus;

    // Report MySQL attempt with SQLite fallback
    const sqliteStats = getSqliteStatus();
    return {
      connected: true,
      engine: 'SQLite (Active fallback - MySQL connection failed)',
      mysqlTarget: mysqlStatus.target,
      mysqlError: mysqlStatus.error,
      ...sqliteStats
    };
  }

  return getSqliteStatus();
}

function getSqliteStatus() {
  try {
    const userCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM users').get()?.count ?? 0;
    const assignmentCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM assignments').get()?.count ?? 0;
    const stats = fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH) : { size: 0 };

    return {
      connected: true,
      engine: 'SQLite (Node.js native DatabaseSync)',
      path: DB_PATH,
      sizeBytes: stats.size,
      usersCount: userCount,
      assignmentsCount: assignmentCount,
      tables: ['users', 'student_profiles', 'teacher_profiles', 'assignments', 'password_resets']
    };
  } catch (err) {
    return {
      connected: false,
      engine: 'SQLite',
      path: DB_PATH,
      error: err.message
    };
  }
}

// Automatically initialize database only in long-running local/standalone server (not during Vercel build/packaging)
if (!process.env.VERCEL) {
  initDatabase().catch(err => console.warn('[Database auto-init notice]:', err.message));
}
