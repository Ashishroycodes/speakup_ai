import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================================================
// 1. Environment Configuration Loader
// ========================================================================
function loadEnv() {
  const envFiles = ['.env', '.env.local'];
  for (const file of envFiles) {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) continue;

    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const rawLine of content.split('\n')) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eqIdx = line.indexOf('=');
        if (eqIdx !== -1) {
          const key = line.slice(0, eqIdx).trim();
          let val = line.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (err) {
      console.warn(`Failed to parse ${file}:`, err.message);
    }
  }
}

// Load .env variables immediately
loadEnv();

const PORT = parseInt(process.env.PORT || '3001', 10);
const DIST_DIR = path.join(__dirname, 'dist');

// MIME types for serving built frontend assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// ========================================================================
// 2. HTTP Request Router
// ========================================================================
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // Helper to handle JSON API endpoints
  const handleApiModule = async (modulePath) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body in request', code: 'INVALID_JSON' }));
        return;
      }

      // Polyfill helper methods for compatibility with Vercel / Express handlers
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        return res;
      };

      try {
        const { default: handler } = await import(`${modulePath}?t=${Date.now()}`);
        await handler(req, res);
      } catch (err) {
        console.error(`Server error handling ${pathname}:`, err);
        if (!res.writableEnded) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
        }
      }
    });
  };


  // --- Unified API Route Handler (delegates to api/index.js) ---
  if (pathname.startsWith('/api')) {
    return handleApiModule('./api/index.js');
  }

  // --- Serve Static Frontend Files (if dist/ exists) ---
  if (fs.existsSync(DIST_DIR)) {
    let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Fallback response if dist/ is not built yet
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 24px; border: 1px solid #ddd; border-radius: 12px;">
      <h2>🚀 SpeakUp Backend Server Running</h2>
      <p>Server Port: <strong>${PORT}</strong></p>
      <p>API Endpoint: <code>POST /api/chat</code></p>
      <p>Health Check: <a href="/api/health">/api/health</a></p>
      <p>AI_API_KEY Configured: <strong>${Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY !== 'your_secret_key_here')}</strong></p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
      <p style="color: #666; font-size: 14px;">In local development, use <code>npm run dev</code> for hot-reloading frontend.</p>
    </div>
  `);
});

// ========================================================================
// 3. Start Server
// ========================================================================
server.listen(PORT, async () => {
  const hasKey = Boolean(
    process.env.AI_API_KEY &&
    process.env.AI_API_KEY !== 'your_secret_key_here'
  );

  let dbInfo = 'Connecting...';
  try {
    const { getDatabaseStatus } = await import('./backend/config/database.js');
    const status = await getDatabaseStatus();
    dbInfo = status.connected
      ? `Connected (${status.engine}, ${status.usersCount} users registered)`
      : `Disconnected (${status.error || status.mysqlError})`;
  } catch (err) {
    dbInfo = `Connection error (${err.message})`;
  }

  console.log('---------------------------------------------------------');
  console.log(`🚀 SpeakUp Server running at: http://localhost:${PORT}`);
  console.log(`💬 Chat API: POST http://localhost:${PORT}/api/chat`);
  console.log(`🎙️ TTS Real Voice API: POST http://localhost:${PORT}/api/tts`);
  console.log(`⚡ Realtime WebRTC Session: POST http://localhost:${PORT}/api/realtime/session`);
  console.log(`🩺 Health API: GET http://localhost:${PORT}/api/health`);
  console.log(`📦 Database: ${dbInfo}`);
  console.log(`🔑 AI_API_KEY loaded: ${hasKey ? 'YES (configured)' : 'NO (please set in .env)'}`);
  console.log('---------------------------------------------------------');
});
