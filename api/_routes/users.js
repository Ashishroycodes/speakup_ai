import userRoutes from '../../backend/routes/users.js';

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

function resolvePathname(req, prefix) {
  const urlObj = new URL(req.url || '/', 'http://localhost');
  const subpath = urlObj.searchParams.get('subpath');
  if (subpath) {
    const cleanSubpath = subpath.startsWith('/') ? subpath.slice(1) : subpath;
    return `${prefix}/${cleanSubpath}`;
  }

  const matched = (req.headers && req.headers['x-matched-path']) || urlObj.pathname;
  if (matched && matched.startsWith(prefix)) {
    return matched.replace(/\/+$/, '');
  }

  return prefix;
}

export default async function handler(req, res) {
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(204).end();
    res.statusCode = 204;
    return res.end();
  }

  res.status = res.status || ((code) => { res.statusCode = code; return res; });
  res.json = res.json || ((data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return res;
  });

  if (req.method === 'POST') {
    req.body = await parseBody(req);
  } else {
    req.body = req.body || {};
  }

  const pathname = resolvePathname(req, '/api/users');
  return userRoutes(req, res, pathname);
}
