import mysql from 'mysql2/promise';
import crypto from 'node:crypto';

let pool = null;
let initialized = false;
let connectionError = null;

/**
 * Get MySQL connection options from environment
 */
export function getMysqlConfig() {
  if (process.env.MYSQL_URL) {
    return { uri: process.env.MYSQL_URL };
  }

  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'speakup_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
  };
}

/**
 * Helper to hash password for initial seeding
 */
function hashPasswordInline(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function formatMysqlError(err, target) {
  if (err.code === 'ECONNREFUSED' || (err.errors && err.errors.some(e => e.code === 'ECONNREFUSED'))) {
    return `Connection refused at ${target}. MySQL service is not running or port is incorrect.`;
  }
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    return `Access denied. Please check your MYSQL_USER and MYSQL_PASSWORD in .env.`;
  }
  if (err.code === 'ER_BAD_DB_ERROR') {
    return `Database not found. Please verify MYSQL_DATABASE in .env.`;
  }
  return err.message || err.code || 'MySQL connection failed';
}

/**
 * Get or create MySQL Connection Pool
 */
export async function getMysqlPool() {
  if (pool) return pool;

  const config = getMysqlConfig();
  const target = config.uri ? 'connection URI' : `${config.host}:${config.port}/${config.database}`;

  try {
    // If using individual credentials, ensure database exists first
    if (!config.uri && config.database) {
      try {
        const adminConn = await mysql.createConnection({
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          connectTimeout: 4000
        });
        await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await adminConn.end();
      } catch {
        // Silently skip if no permission to create database or already exists
      }
    }

    if (config.uri) {
      pool = mysql.createPool(config.uri);
    } else {
      pool = mysql.createPool(config);
    }

    // Verify connection
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    connectionError = null;
    return pool;
  } catch (err) {
    const formatted = formatMysqlError(err, target);
    connectionError = formatted;
    const customErr = new Error(formatted);
    customErr.code = err.code;
    throw customErr;
  }
}

/**
 * Initialize all required MySQL tables and seed demo accounts
 */
export async function initMysqlDatabase() {
  if (initialized) return;

  const currentPool = await getMysqlPool();

  // 1. Users Table
  await currentPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(191) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      salt VARCHAR(255) NOT NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'student',
      profile_image TEXT,
      created_at VARCHAR(64) NOT NULL,
      last_login VARCHAR(64)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Student Profiles Table
  await currentPool.query(`
    CREATE TABLE IF NOT EXISTS student_profiles (
      user_id VARCHAR(64) PRIMARY KEY,
      institution VARCHAR(255) DEFAULT 'Delhi Technological University',
      course VARCHAR(255) DEFAULT 'Computer Science & Engineering',
      year VARCHAR(64) DEFAULT '3rd Year',
      primary_goal VARCHAR(255) DEFAULT 'Improve English Speaking',
      xp INT DEFAULT 240,
      streak INT DEFAULT 3,
      streak_days_json TEXT,
      sessions_count INT DEFAULT 3,
      total_speaking_seconds INT DEFAULT 180,
      completed_challenges INT DEFAULT 1,
      overall_score INT DEFAULT 78,
      skills_json TEXT,
      learned_vocab_json TEXT,
      updated_at VARCHAR(64) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. Teacher Profiles Table
  await currentPool.query(`
    CREATE TABLE IF NOT EXISTS teacher_profiles (
      user_id VARCHAR(64) PRIMARY KEY,
      institution VARCHAR(255) DEFAULT 'Delhi Technological University',
      department VARCHAR(255) DEFAULT 'Humanities & Professional Communication',
      designation VARCHAR(255) DEFAULT 'Senior Assistant Professor',
      created_at VARCHAR(64) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Assignments Table
  await currentPool.query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id VARCHAR(64) PRIMARY KEY,
      teacher_id VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      skill VARCHAR(100) NOT NULL,
      difficulty VARCHAR(50) NOT NULL,
      duration_minutes INT NOT NULL,
      due_date VARCHAR(64) NOT NULL,
      instructions TEXT,
      created_at VARCHAR(64) NOT NULL,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 5. Password Resets Table
  await currentPool.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      token VARCHAR(128) PRIMARY KEY,
      email VARCHAR(191) NOT NULL,
      expires_at VARCHAR(64) NOT NULL,
      used TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed default demo accounts if table empty
  await seedDefaultAccounts(currentPool);

  initialized = true;
}

/**
 * Seed initial student & teacher demo accounts in MySQL
 */
async function seedDefaultAccounts(currentPool) {
  const [rows] = await currentPool.query('SELECT id FROM users WHERE email = ?', ['student@speakup.edu']);
  if (rows.length === 0) {
    const { hash, salt } = hashPasswordInline('Student@123');
    const now = new Date().toISOString();
    const studentId = 'usr_student_demo_01';

    await currentPool.query(
      'INSERT INTO users (id, name, email, password_hash, salt, role, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [studentId, 'Ashish Kumar', 'student@speakup.edu', hash, salt, 'student', now, now]
    );

    await currentPool.query(
      `INSERT INTO student_profiles (
        user_id, institution, course, year, primary_goal, xp, streak,
        sessions_count, total_speaking_seconds, completed_challenges, overall_score, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentId, 'IIT Delhi', 'B.Tech Computer Science', '3rd Year', 'Placement & Tech Interview Preparation', 320, 4, 5, 280, 2, 82, now]
    );
  }

  const [teacherRows] = await currentPool.query('SELECT id FROM users WHERE email = ?', ['teacher@speakup.edu']);
  if (teacherRows.length === 0) {
    const { hash, salt } = hashPasswordInline('Teacher@123');
    const now = new Date().toISOString();
    const teacherId = 'usr_teacher_demo_01';

    await currentPool.query(
      'INSERT INTO users (id, name, email, password_hash, salt, role, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [teacherId, 'Dr. Priya Mukherjee', 'teacher@speakup.edu', hash, salt, 'teacher', now, now]
    );

    await currentPool.query(
      'INSERT INTO teacher_profiles (user_id, institution, department, designation, created_at) VALUES (?, ?, ?, ?, ?)',
      [teacherId, 'IIT Delhi', 'Department of Humanities & Management', 'Associate Professor of Communication', now]
    );

    await currentPool.query(
      'INSERT INTO assignments (id, teacher_id, title, skill, difficulty, duration_minutes, due_date, instructions, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'asg_project_pitch_01',
        teacherId,
        '60-Second Technical Project Elevator Pitch',
        'Presentation',
        'Intermediate',
        15,
        new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        'Introduce your academic project clearly. State the core problem, your methodology, and the key impact within 60 seconds.',
        now
      ]
    );
  }

  // Ensure placeholder student profiles are completely purged
  try {
    await currentPool.query("DELETE FROM student_profiles WHERE user_id IN ('usr_student_02', 'usr_student_03', 'usr_student_04')");
    await currentPool.query("DELETE FROM users WHERE id IN ('usr_student_02', 'usr_student_03', 'usr_student_04')");
  } catch (purgeErr) {
    console.warn('Placeholder purge warning:', purgeErr.message);
  }
}

/**
 * Diagnostic status for MySQL
 */
export async function getMysqlStatus() {
  const config = getMysqlConfig();
  const target = config.uri ? 'Connection URL' : `${config.host}:${config.port}/${config.database}`;

  try {
    const p = await getMysqlPool();
    const [userCount] = await p.query('SELECT COUNT(*) as count FROM users');
    const [assignmentCount] = await p.query('SELECT COUNT(*) as count FROM assignments');

    return {
      connected: true,
      engine: 'MySQL (mysql2)',
      target,
      usersCount: userCount[0]?.count ?? 0,
      assignmentsCount: assignmentCount[0]?.count ?? 0,
      tables: ['users', 'student_profiles', 'teacher_profiles', 'assignments', 'password_resets']
    };
  } catch (err) {
    return {
      connected: false,
      engine: 'MySQL (mysql2)',
      target,
      error: err.message || connectionError
    };
  }
}
