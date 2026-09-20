import { db } from '../config/database.js';

async function queryOne(sql, params = []) {
  if (db && typeof db.queryOne === 'function') return db.queryOne(sql, params);
  if (db && typeof db.prepare === 'function') return db.prepare(sql).get(...params) || null;
  return null;
}

async function execute(sql, params = []) {
  if (db && typeof db.execute === 'function') return db.execute(sql, params);
  if (db && typeof db.prepare === 'function') return db.prepare(sql).run(...params);
  return null;
}

export const UserModel = {
  async findByEmail(email) {
    if (!email) return null;
    return await queryOne(
      'SELECT id, name, email, password_hash, salt, role, profile_image, created_at, last_login FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );
  },

  async findByEmailOrName(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim();
    // 1. Exact match by email or full name (case-insensitive)
    let user = await queryOne(
      'SELECT id, name, email, password_hash, salt, role, profile_image, created_at, last_login FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(name) = LOWER(?)',
      [clean, clean]
    );
    if (user) return user;

    // 2. Match by name prefix (e.g. 'Ashish' matching 'Ashish Kumar')
    user = await queryOne(
      'SELECT id, name, email, password_hash, salt, role, profile_image, created_at, last_login FROM users WHERE LOWER(name) LIKE LOWER(?)',
      [`${clean}%`]
    );
    return user || null;
  },

  async findById(id) {
    if (!id) return null;
    return await queryOne(
      'SELECT id, name, email, role, profile_image, created_at, last_login FROM users WHERE id = ?',
      [id]
    );
  },

  async create({ id, name, email, passwordHash, salt, role = 'student' }) {
    const now = new Date().toISOString();
    await execute(
      'INSERT INTO users (id, name, email, password_hash, salt, role, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name.trim(), email.trim().toLowerCase(), passwordHash, salt, role, now, now]
    );

    return await this.findById(id);
  },

  async updateLastLogin(id) {
    const now = new Date().toISOString();
    await execute('UPDATE users SET last_login = ? WHERE id = ?', [now, id]);
  },

  async updatePassword(id, passwordHash, salt) {
    await execute('UPDATE users SET password_hash = ?, salt = ? WHERE id = ?', [passwordHash, salt, id]);
  },

  async updateName(id, name) {
    await execute('UPDATE users SET name = ? WHERE id = ?', [name.trim(), id]);
  }
};
