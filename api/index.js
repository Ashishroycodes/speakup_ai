/**
 * SpeakUp AI Coach - Universal Serverless API Entrypoint
 *
 * Consolidates all 18 API routes into a single Serverless Function
 * to strictly adhere to Vercel's Hobby plan limit (max 12 Serverless Functions).
 */

import analyzeHandler from './_routes/analyze.js';
import authHandler from './_routes/auth.js';
import chatHandler from './_routes/chat.js';
import healthHandler from './_routes/health.js';
import interviewAnalysisHandler from './_routes/interview-analysis.js';
import interviewHandler from './_routes/interview.js';
import learningPlanHandler from './_routes/learning-plan.js';
import presentationAnalysisHandler from './_routes/presentation-analysis.js';
import realtimeSessionHandler from './_routes/realtime-session.js';
import roleplayAnalysisHandler from './_routes/roleplay-analysis.js';
import roleplayHandler from './_routes/roleplay.js';
import studentHandler from './_routes/student.js';
import teacherHandler from './_routes/teacher.js';
import ttsHandler from './_routes/tts.js';
import usersHandler from './_routes/users.js';
import vocabEvaluateHandler from './_routes/vocab-evaluate.js';
import vocabularyHandler from './_routes/vocabulary.js';
import voicesHandler from './_routes/voices.js';

function getPathname(req) {
  // 1. Check x-matched-path header set by Vercel / proxy
  if (req.headers && req.headers['x-matched-path']) {
    const p = req.headers['x-matched-path'].split('?')[0].replace(/\/+$/, '');
    if (p && p !== '/api/index' && p !== '/api/index.js') {
      return p;
    }
  }

  // 2. Check query path parameter from Vercel rewrite /api/:path*
  if (req.query && req.query.path) {
    const sub = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    return ('/api/' + sub).replace(/\/+$/, '');
  }

  // 3. Check req.url
  const raw = req.url || '';
  const parsed = raw.split('?')[0].replace(/\/+$/, '');
  if (parsed && parsed !== '/api/index' && parsed !== '/api/index.js') {
    return parsed;
  }

  return '/api';
}

export default async function handler(req, res, overridePath) {
  // CORS Headers
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

  const pathname = (overridePath || getPathname(req)).toLowerCase();

  // Auth & Management Routes
  if (pathname.startsWith('/api/auth')) {
    return authHandler(req, res);
  }
  if (pathname.startsWith('/api/student')) {
    return studentHandler(req, res);
  }
  if (pathname.startsWith('/api/teacher')) {
    return teacherHandler(req, res);
  }
  if (pathname.startsWith('/api/users')) {
    return usersHandler(req, res);
  }

  // AI & Practice Routes
  if (pathname === '/api/chat') {
    return chatHandler(req, res);
  }
  if (pathname === '/api/tts') {
    return ttsHandler(req, res);
  }
  if (pathname === '/api/realtime/session' || pathname === '/api/realtime-session') {
    return realtimeSessionHandler(req, res);
  }
  if (pathname === '/api/voices') {
    return voicesHandler(req, res);
  }
  if (pathname === '/api/analyze') {
    return analyzeHandler(req, res);
  }
  if (pathname === '/api/interview') {
    return interviewHandler(req, res);
  }
  if (pathname === '/api/interview-analysis') {
    return interviewAnalysisHandler(req, res);
  }
  if (pathname === '/api/roleplay') {
    return roleplayHandler(req, res);
  }
  if (pathname === '/api/roleplay-analysis') {
    return roleplayAnalysisHandler(req, res);
  }
  if (pathname === '/api/vocab-evaluate') {
    return vocabEvaluateHandler(req, res);
  }
  if (pathname === '/api/vocabulary') {
    return vocabularyHandler(req, res);
  }
  if (pathname === '/api/learning-plan') {
    return learningPlanHandler(req, res);
  }
  if (pathname === '/api/presentation-analysis') {
    return presentationAnalysisHandler(req, res);
  }
  if (pathname === '/api/health' || pathname === '/api') {
    return healthHandler(req, res);
  }

  // Fallback for unmatched API routes
  return res.status(404).json({
    error: `Endpoint '${pathname}' not found.`,
    code: 'NOT_FOUND'
  });
}
