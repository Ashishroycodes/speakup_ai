/**
 * SpeakUp AI Coach - Available Real Voices API
 *
 * Route: GET /api/voices
 */

export const VOICES_CATALOG = [
  {
    id: 'nova',
    name: 'Nova',
    gender: 'female',
    style: 'Warm & Natural',
    description: 'Energetic, friendly, and encouraging. Best for conversation practice.',
    recommended: true
  },
  {
    id: 'alloy',
    name: 'Alloy',
    gender: 'neutral',
    style: 'Balanced & Clear',
    description: 'Crisp, articulate, and neutral accent.'
  },
  {
    id: 'shimmer',
    name: 'Shimmer',
    gender: 'female',
    style: 'Bright & Expressive',
    description: 'Vibrant, clear intonation, perfect for pronunciation training.'
  },
  {
    id: 'echo',
    name: 'Echo',
    gender: 'male',
    style: 'Warm & Calm',
    description: 'Smooth, reassuring, and patient male coach.'
  },
  {
    id: 'onyx',
    name: 'Onyx',
    gender: 'male',
    style: 'Deep & Professional',
    description: 'Authoritative, resonant tone ideal for interview prep.'
  },
  {
    id: 'fable',
    name: 'Fable',
    gender: 'neutral',
    style: 'Articulate British',
    description: 'Expressive and clear with subtle British warmth.'
  }
];

export default async function handler(req, res) {
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

  return res.status(200).json({
    voices: VOICES_CATALOG,
    defaultVoice: 'nova'
  });
}
