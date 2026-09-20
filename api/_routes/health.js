/**
 * SpeakUp AI Coach - Server Health & Provider Diagnostic Route
 *
 * Route: GET /api/health
 */

import fs from 'node:fs';
import path from 'node:path';

function ensureEnvLoaded() {
  const envFiles = ['.env', '.env.local'];
  for (const file of envFiles) {
    try {
      const fullPath = path.resolve(process.cwd(), file);
      if (!fs.existsSync(fullPath)) continue;
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
          if (val) {
            process.env[key] = val;
          }
        }
      }
    } catch {
      // Safe fallback
    }
  }
}

export default async function handler(req, res) {
  ensureEnvLoaded();

  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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

  const key = (process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || '').trim();
  const hasKey = Boolean(key && key !== 'your_secret_key_here');

  let provider = 'none';
  if (key.startsWith('gsk_') || process.env.GROQ_API_KEY) provider = 'Groq';
  else if (key.startsWith('AQ.') || key.startsWith('AIzaSy') || process.env.GEMINI_API_KEY) provider = 'Google Gemini (Gemini 3.6 Flash)';
  else if (key.startsWith('sk-or-') || process.env.OPENROUTER_API_KEY) provider = 'OpenRouter';
  else if (key.startsWith('sk-') || process.env.OPENAI_API_KEY) provider = 'OpenAI';
  else if (key.toLowerCase() === 'demo' || key.toLowerCase() === 'mock') provider = 'Demo Mode';

  let databaseStatus = { connected: false };
  try {
    const { getDatabaseStatus } = await import('../../backend/config/database.js');
    databaseStatus = await getDatabaseStatus();
  } catch (err) {
    databaseStatus = { connected: false, error: err.message };
  }

  return res.status(200).json({
    status: 'ok',
    service: 'SpeakUp AI Coach Server',
    apiKeyConfigured: hasKey,
    detectedProvider: provider,
    keyPreview: key.length > 8 ? `${key.slice(0, 4)}...${key.slice(-3)}` : (key ? 'demo' : 'none'),
    realtimeSupported: provider === 'OpenAI',
    model: process.env.AI_MODEL || (provider.includes('Google Gemini') ? 'gemini-3.6-flash' : (provider === 'OpenAI' ? 'gpt-4o-mini' : (provider === 'Groq' ? 'llama-3.3-70b-versatile' : 'demo'))),
    database: databaseStatus
  });
}
