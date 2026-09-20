import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// SpeakUp Vite Configuration & API Middleware Layer (Updated)
function createApiMiddleware(mode) {
  return (req, res, next) => {
    const rawUrl = req.url || '';
    const pathname = rawUrl.split('?')[0];

    // Determine target module
    let targetModule = null;
    if (pathname.startsWith('/api/auth')) {
      targetModule = 'backend/routes/auth.js';
    } else if (pathname.startsWith('/api/student')) {
      targetModule = 'backend/routes/student.js';
    } else if (pathname.startsWith('/api/teacher')) {
      targetModule = 'backend/routes/teacher.js';
    } else if (pathname.startsWith('/api/users')) {
      targetModule = 'backend/routes/users.js';
    } else if (pathname === '/api/chat') {
      targetModule = 'api/chat.js';
    } else if (pathname === '/api/tts') {
      targetModule = 'api/tts.js';
    } else if (pathname === '/api/realtime/session') {
      targetModule = 'api/realtime-session.js';
    } else if (pathname === '/api/voices') {
      targetModule = 'api/voices.js';
    } else if (pathname === '/api/analyze') {
      targetModule = 'api/analyze.js';
    } else if (pathname === '/api/interview') {
      targetModule = 'api/interview.js';
    } else if (pathname === '/api/interview-analysis') {
      targetModule = 'api/interview-analysis.js';
    } else if (pathname === '/api/roleplay') {
      targetModule = 'api/roleplay.js';
    } else if (pathname === '/api/roleplay-analysis') {
      targetModule = 'api/roleplay-analysis.js';
    } else if (pathname === '/api/vocab-evaluate') {
      targetModule = 'api/vocab-evaluate.js';
    } else if (pathname === '/api/vocabulary') {
      targetModule = 'api/vocabulary.js';
    } else if (pathname === '/api/learning-plan') {
      targetModule = 'api/learning-plan.js';
    } else if (pathname === '/api/presentation-analysis') {
      targetModule = 'api/presentation-analysis.js';
    } else if (pathname === '/api/health') {
      targetModule = 'api/health.js';
    }

    if (!targetModule) {
      return next ? next() : undefined;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    // Always synchronize latest .env values
    const freshEnv = loadEnv(mode, process.cwd(), '');
    Object.assign(process.env, freshEnv);

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON body in request', code: 'INVALID_JSON' }));
        return;
      }

      // Polyfill Express/Vercel-like status() and json() helpers for connect middleware
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
        const { pathToFileURL } = await import('node:url');
        const { resolve } = await import('node:path');
        const modulePath = pathToFileURL(resolve(process.cwd(), targetModule)).href;
        const { default: handler } = await import(modulePath + `?t=${Date.now()}`);
        await handler(req, res, pathname);
      } catch (err) {
        console.error(`Error in dev handler for ${pathname}:`, err);
        if (!res.writableEnded) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
        }
      }
    });
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables (including AI_API_KEY without VITE_ prefix) into process.env
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  const apiMiddleware = createApiMiddleware(mode);

  return {
    plugins: [
      react(),
      {
        name: 'vite-plugin-speakup-api',
        configureServer(server) {
          server.middlewares.use(apiMiddleware);
        },
        configurePreviewServer(server) {
          server.middlewares.use(apiMiddleware);
        }
      }
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'lucide-icons';
            }
          }
        }
      },
      chunkSizeWarningLimit: 1000
    }
  };
});

