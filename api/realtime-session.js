/**
 * SpeakUp AI Coach - Server-Side OpenAI Realtime API Ephemeral Session Token Route
 *
 * Route: POST /api/realtime/session
 *
 * Capabilities:
 * - Securely contacts OpenAI's Realtime API (`POST https://api.openai.com/v1/realtime/sessions`).
 * - Generates an ephemeral WebRTC client secret (`ek_...`) tailored with SpeakUp's
 *   language coaching instructions, voice persona, and server-side Voice Activity Detection (VAD).
 * - Never exposes master API keys to the browser bundle.
 * - If the server is in demo mode or configured with non-OpenAI key, returns `{ supported: false }`
 *   enabling the client to smoothly use the Neural Real Voice Calling Engine.
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

  // Set CORS headers
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    if (res.status) {
      return res.status(204).end();
    }
    res.statusCode = 204;
    return res.end();
  }

  res.status = res.status || ((code) => { res.statusCode = code; return res; });
  res.json = res.json || ((data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return res;
  });

  // Support GET to check Realtime API status/availability
  if (req.method === 'GET') {
    const apiKey = (process.env.OPENAI_API_KEY || process.env.AI_API_KEY || '').trim();
    const isOpenAI = apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-');
    return res.status(200).json({
      supported: isOpenAI,
      provider: isOpenAI ? 'OpenAI Realtime WebRTC' : 'Neural Real Voice Fallback',
      model: process.env.AI_REALTIME_MODEL || 'gpt-4o-realtime-preview'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed. Use POST.',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const {
    voice = 'nova',
    language = 'auto',
    mode = 'casual',
    difficulty = 'intermediate',
    goal = 'Improve Fluency'
  } = body;

  const apiKey = (
    process.env.OPENAI_API_KEY ||
    process.env.AI_API_KEY ||
    ''
  ).trim();

  // Check if an OpenAI key is present
  const isOpenAI = apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-');

  if (!isOpenAI || apiKey.toLowerCase() === 'demo' || apiKey.toLowerCase() === 'mock') {
    return res.status(200).json({
      supported: false,
      reason: 'OpenAI Realtime API requires an OpenAI API key (sk-...). Operating in Neural Real Voice Calling mode.',
      code: 'NO_OPENAI_REALTIME_KEY'
    });
  }

  // Tailored instructions for SpeakUp conversational English coaching
  const instructions = `You are the friendly, encouraging AI Communication Coach on the SpeakUp platform.
Your goal is to help Indian students and young professionals practice conversational English with maximum confidence through a dynamic 2-way conversation.
Settings:
- Conversation Mode: ${mode}
- Difficulty Level: ${difficulty}
- Learning Goal: ${goal}
- Language: ${language}

Core Coaching Principles:
1. NEVER GIVE DIRECT ANSWERS TO QUESTIONS: You are a speaking coach, NOT an answer key or search engine. If the student asks you any question (informational, conceptual, or interview-related), do NOT answer it. Instead, acknowledge it warmly in 1 short phrase and redirect the question back to the student to share their perspective or formulate their answer!
2. Prioritize student speaking time: The student should do 80% of the talking. Keep your turns concise (1 to 2 sentences max).
3. Always keep the dialogue moving: Conclude your turns with an engaging open-ended conversational hook or follow-up question.
4. Understand English, Hindi, and Hinglish seamlessly. If the student speaks Hinglish, respond warmly while naturally modeling polished English phrasing.
5. If correcting phrasing or grammar, give a quick, gentle tip without halting the flow.`;

  const validVoices = ['nova', 'alloy', 'echo', 'shimmer', 'onyx', 'fable'];
  const chosenVoice = validVoices.includes(voice.toLowerCase()) ? voice.toLowerCase() : 'nova';
  const model = process.env.AI_REALTIME_MODEL || 'gpt-4o-realtime-preview';

  try {
    const upstream = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        voice: chosenVoice,
        modalities: ['audio', 'text'],
        instructions,
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 700
        }
      })
    });

    if (!upstream.ok) {
      const errorText = await upstream.text();
      console.warn('OpenAI Realtime session error:', upstream.status, errorText);
      return res.status(200).json({
        supported: false,
        error: `OpenAI Realtime API error: ${upstream.status}`,
        details: errorText,
        reason: 'Realtime session negotiation failed. Falling back to Neural Real Voice Calling mode.'
      });
    }

    const sessionData = await upstream.json();

    return res.status(200).json({
      supported: true,
      client_secret: sessionData.client_secret,
      model: sessionData.model,
      voice: sessionData.voice,
      sessionId: sessionData.id
    });
  } catch (err) {
    console.error('Failed to create OpenAI Realtime session:', err);
    return res.status(200).json({
      supported: false,
      error: err.message,
      reason: 'Network failure communicating with OpenAI Realtime API. Falling back to Neural Real Voice Calling mode.'
    });
  }
}
