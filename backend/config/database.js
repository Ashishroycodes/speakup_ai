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
let _useMemoryDb = false;

// --------------------------------------------------------------------------
// Resilient In-Memory Database Store (Serverless Zero-Config Fallback)
// --------------------------------------------------------------------------
const memoryStore = {
  users: new Map(),
  student_profiles: new Map(),
  teacher_profiles: new Map(),
  assignments: new Map(),
  password_resets: new Map()
};

function hashPasswordInline(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function initMemoryDatabase() {
  if (memoryStore.users.size > 0) return;

  const now = new Date().toISOString();
  const { hash: studentHash, salt: studentSalt } = hashPasswordInline('Student@123');
  const studentId = 'usr_student_demo_01';

  memoryStore.users.set(studentId, {
    id: studentId,
    name: 'Ashish Kumar',
    email: 'student@speakup.edu',
    password_hash: studentHash,
    salt: studentSalt,
    role: 'student',
    profile_image: null,
    created_at: now,
    last_login: now
  });

  memoryStore.student_profiles.set(studentId, {
    user_id: studentId,
    institution: 'IIT Delhi',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    primary_goal: 'Placement & Tech Interview Preparation',
    xp: 320,
    streak: 4,
    streak_days_json: '{"Mon":true,"Tue":true,"Wed":true,"Thu":false,"Fri":false}',
    sessions_count: 5,
    total_speaking_seconds: 280,
    completed_challenges: 2,
    overall_score: 82,
    skills_json: '{"speakingFluency":80,"grammar":70,"vocabulary":72,"clarity":82}',
    learned_vocab_json: '["v-1","v-2","v-3","v-8"]',
    updated_at: now
  });

  const { hash: teacherHash, salt: teacherSalt } = hashPasswordInline('Teacher@123');
  const teacherId = 'usr_teacher_demo_01';

  memoryStore.users.set(teacherId, {
    id: teacherId,
    name: 'Dr. Priya Mukherjee',
    email: 'teacher@speakup.edu',
    password_hash: teacherHash,
    salt: teacherSalt,
    role: 'teacher',
    profile_image: null,
    created_at: now,
    last_login: now
  });

  memoryStore.teacher_profiles.set(teacherId, {
    user_id: teacherId,
    institution: 'IIT Delhi',
    department: 'Department of Humanities & Management',
    designation: 'Associate Professor of Communication',
    created_at: now
  });

  const asgId = 'asg_project_pitch_01';
  memoryStore.assignments.set(asgId, {
    id: asgId,
    teacher_id: teacherId,
    title: '60-Second Technical Project Elevator Pitch',
    skill: 'Presentation',
    difficulty: 'Intermediate',
    duration_minutes: 15,
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    instructions: 'Introduce your academic project clearly. State the core problem, your methodology, and the key impact within 60 seconds.',
    created_at: now
  });
}

function createMemoryStatement(sql) {
  const normalizedSql = sql.trim().replace(/\s+/g, ' ');
  const upper = normalizedSql.toUpperCase();

  return {
    get(...params) {
      if (upper.includes('FROM USERS')) {
        if (upper.includes('COUNT(*)')) {
          return { count: memoryStore.users.size };
        }
        if (upper.includes('EMAIL = ?')) {
          const email = (params[0] || '').toLowerCase().trim();
          for (const u of memoryStore.users.values()) {
            if (u.email.toLowerCase() === email) return { ...u };
          }
          return null;
        }
        if (upper.includes('LOWER(EMAIL) = LOWER(?)') || upper.includes('LOWER(NAME) = LOWER(?)')) {
          const idVal = (params[0] || '').toLowerCase().trim();
          for (const u of memoryStore.users.values()) {
            if (u.email.toLowerCase() === idVal || u.name.toLowerCase() === idVal) return { ...u };
          }
          return null;
        }
        if (upper.includes('LOWER(NAME) LIKE LOWER(?)')) {
          const prefix = (params[0] || '').replace(/%/g, '').toLowerCase().trim();
          for (const u of memoryStore.users.values()) {
            if (u.name.toLowerCase().startsWith(prefix)) return { ...u };
          }
          return null;
        }
        if (upper.includes('ID = ?')) {
          const u = memoryStore.users.get(params[0]);
          return u ? { ...u } : null;
        }
      }

      if (upper.includes('FROM STUDENT_PROFILES')) {
        if (upper.includes('USER_ID = ?')) {
          const p = memoryStore.student_profiles.get(params[0]);
          return p ? { ...p } : null;
        }
      }

      if (upper.includes('FROM TEACHER_PROFILES')) {
        if (upper.includes('USER_ID = ?')) {
          const p = memoryStore.teacher_profiles.get(params[0]);
          return p ? { ...p } : null;
        }
      }

      if (upper.includes('FROM ASSIGNMENTS')) {
        if (upper.includes('COUNT(*)')) {
          return { count: memoryStore.assignments.size };
        }
        if (upper.includes('ID = ?')) {
          const a = memoryStore.assignments.get(params[0]);
          return a ? { ...a } : null;
        }
      }

      if (upper.includes('FROM PASSWORD_RESETS')) {
        if (upper.includes('TOKEN = ?')) {
          const r = memoryStore.password_resets.get(params[0]);
          return r ? { ...r } : null;
        }
      }

      return null;
    },

    all(...params) {
      if (upper.includes('FROM USERS')) {
        const list = Array.from(memoryStore.users.values()).map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          profile_image: u.profile_image,
          created_at: u.created_at,
          last_login: u.last_login
        }));
        list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        return list;
      }

      if (upper.includes('FROM ASSIGNMENTS')) {
        const list = Array.from(memoryStore.assignments.values());
        if (upper.includes('TEACHER_ID = ?')) {
          const filtered = list.filter(a => a.teacher_id === params[0]);
          filtered.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
          return filtered;
        }
        list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        return list;
      }

      return [];
    },

    run(...params) {
      if (upper.startsWith('INSERT INTO USERS')) {
        const [id, name, email, password_hash, salt, role, created_at, last_login] = params;
        memoryStore.users.set(id, {
          id,
          name,
          email: (email || '').toLowerCase().trim(),
          password_hash,
          salt,
          role: role || 'student',
          profile_image: null,
          created_at: created_at || new Date().toISOString(),
          last_login: last_login || new Date().toISOString()
        });
        return { changes: 1, lastInsertRowid: id };
      }

      if (upper.startsWith('INSERT INTO STUDENT_PROFILES')) {
        const [
          user_id, institution, course, year, primary_goal, xp, streak,
          sessions_count, total_speaking_seconds, completed_challenges, overall_score, updated_at
        ] = params;
        memoryStore.student_profiles.set(user_id, {
          user_id,
          institution: institution || 'Delhi Technological University',
          course: course || 'Computer Science & Engineering',
          year: year || '3rd Year',
          primary_goal: primary_goal || 'Improve English Speaking',
          xp: xp ?? 240,
          streak: streak ?? 3,
          streak_days_json: '{"Mon":true,"Tue":true,"Wed":true,"Thu":false,"Fri":false}',
          sessions_count: sessions_count ?? 3,
          total_speaking_seconds: total_speaking_seconds ?? 180,
          completed_challenges: completed_challenges ?? 1,
          overall_score: overall_score ?? 78,
          skills_json: '{"speakingFluency":80,"grammar":70,"vocabulary":72,"clarity":82}',
          learned_vocab_json: '["v-1","v-2","v-3","v-8"]',
          updated_at: updated_at || new Date().toISOString()
        });
        return { changes: 1 };
      }

      if (upper.startsWith('INSERT INTO TEACHER_PROFILES')) {
        const [user_id, institution, department, designation, created_at] = params;
        memoryStore.teacher_profiles.set(user_id, {
          user_id,
          institution: institution || 'Delhi Technological University',
          department: department || 'Humanities & Professional Communication',
          designation: designation || 'Senior Assistant Professor',
          created_at: created_at || new Date().toISOString()
        });
        return { changes: 1 };
      }

      if (upper.startsWith('INSERT INTO ASSIGNMENTS')) {
        const [id, teacher_id, title, skill, difficulty, duration_minutes, due_date, instructions, created_at] = params;
        memoryStore.assignments.set(id, {
          id,
          teacher_id,
          title,
          skill,
          difficulty,
          duration_minutes,
          due_date,
          instructions,
          created_at: created_at || new Date().toISOString()
        });
        return { changes: 1 };
      }

      if (upper.startsWith('INSERT INTO PASSWORD_RESETS')) {
        const [token, email, expires_at, used] = params;
        memoryStore.password_resets.set(token, {
          token,
          email,
          expires_at,
          used: used ?? 0
        });
        return { changes: 1 };
      }

      if (upper.startsWith('UPDATE USERS')) {
        if (upper.includes('LAST_LOGIN = ? WHERE ID = ?')) {
          const u = memoryStore.users.get(params[1]);
          if (u) u.last_login = params[0];
          return { changes: u ? 1 : 0 };
        }
        if (upper.includes('PASSWORD_HASH = ?, SALT = ? WHERE ID = ?')) {
          const u = memoryStore.users.get(params[2]);
          if (u) {
            u.password_hash = params[0];
            u.salt = params[1];
          }
          return { changes: u ? 1 : 0 };
        }
        if (upper.includes('NAME = ? WHERE ID = ?')) {
          const u = memoryStore.users.get(params[1]);
          if (u) u.name = params[0];
          return { changes: u ? 1 : 0 };
        }
      }

      if (upper.startsWith('UPDATE STUDENT_PROFILES')) {
        const userId = params[params.length - 1];
        const p = memoryStore.student_profiles.get(userId);
        if (p) {
          if (upper.includes('PRIMARY_GOAL')) {
            p.institution = params[0];
            p.course = params[1];
            p.year = params[2];
            p.primary_goal = params[3];
            p.updated_at = params[4];
          } else if (upper.includes('XP = ?')) {
            p.xp = params[0];
            p.streak = params[1];
            p.streak_days_json = params[2];
            p.sessions_count = params[3];
            p.total_speaking_seconds = params[4];
            p.completed_challenges = params[5];
            p.overall_score = params[6];
            p.skills_json = params[7];
            p.learned_vocab_json = params[8];
            p.updated_at = params[9];
          }
          return { changes: 1 };
        }
        return { changes: 0 };
      }

      if (upper.startsWith('UPDATE TEACHER_PROFILES')) {
        const userId = params[params.length - 1];
        const p = memoryStore.teacher_profiles.get(userId);
        if (p) {
          p.institution = params[0];
          p.department = params[1];
          p.designation = params[2];
          return { changes: 1 };
        }
        return { changes: 0 };
      }

      if (upper.startsWith('UPDATE PASSWORD_RESETS')) {
        if (upper.includes('USED = 1 WHERE TOKEN = ?')) {
          const r = memoryStore.password_resets.get(params[0]);
          if (r) r.used = 1;
          return { changes: r ? 1 : 0 };
        }
      }

      if (upper.startsWith('DELETE FROM ASSIGNMENTS')) {
        if (upper.includes('WHERE ID = ?')) {
          const existed = memoryStore.assignments.delete(params[0]);
          return { changes: existed ? 1 : 0 };
        }
      }

      if (upper.startsWith('DELETE FROM USERS')) {
        if (upper.includes('WHERE ID = ?')) {
          const existed = memoryStore.users.delete(params[0]);
          return { changes: existed ? 1 : 0 };
        }
      }

      if (upper.startsWith('DELETE FROM STUDENT_PROFILES')) {
        if (upper.includes('WHERE USER_ID = ?')) {
          const existed = memoryStore.student_profiles.delete(params[0]);
          return { changes: existed ? 1 : 0 };
        }
      }

      return { changes: 0 };
    }
  };
}

export const memoryDb = {
  prepare(sql) {
    return createMemoryStatement(sql);
  },
  exec(_sql) {
    return true;
  }
};

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

export function getActiveDb() {
  if (!_useMemoryDb && DatabaseSyncClass) {
    try {
      return getSqliteDb();
    } catch (err) {
      console.warn(`[DB] Native SQLite unavailable (${err.message}). Using resilient in-memory database store.`);
      _useMemoryDb = true;
    }
  } else {
    _useMemoryDb = true;
  }
  initMemoryDatabase();
  return memoryDb;
}

// Proxy wrapper for backward-compatibility with synchronous sqliteDb calls
export const sqliteDb = {
  prepare(sql) {
    return getActiveDb().prepare(sql);
  },
  exec(sql) {
    return getActiveDb().exec(sql);
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

    // SQLite Schema Initialization with Memory Fallback
    if (!_useMemoryDb && DatabaseSyncClass) {
      try {
        initSqliteDatabase();
        isInitialized = true;
        return;
      } catch (sqliteErr) {
        console.warn(`⚠️ [Database] SQLite schema init warning: ${sqliteErr.message}. Initializing resilient in-memory store.`);
        _useMemoryDb = true;
      }
    } else {
      _useMemoryDb = true;
    }

    initMemoryDatabase();
    isInitialized = true;
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
  if (_useMemoryDb) {
    initMemoryDatabase();
    return {
      connected: true,
      engine: 'In-Memory Resilient Store (Serverless Zero-Config Fallback)',
      path: ':memory:',
      usersCount: memoryStore.users.size,
      assignmentsCount: memoryStore.assignments.size,
      tables: ['users', 'student_profiles', 'teacher_profiles', 'assignments', 'password_resets']
    };
  }

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
  } catch {
    initMemoryDatabase();
    return {
      connected: true,
      engine: 'In-Memory Resilient Store (Serverless Fallback)',
      path: ':memory:',
      usersCount: memoryStore.users.size,
      assignmentsCount: memoryStore.assignments.size,
      tables: ['users', 'student_profiles', 'teacher_profiles', 'assignments', 'password_resets']
    };
  }
}

// Automatically initialize database only in long-running local/standalone server (not during Vercel build/packaging)
if (!process.env.VERCEL) {
  initDatabase().catch(err => console.warn('[Database auto-init notice]:', err.message));
}
