/**
 * SpeakUp Vocabulary Sentence Evaluation API
 * 
 * Route: POST /api/vocab-evaluate
 * 
 * Capabilities:
 * - Evaluates a student's spoken/typed sentence using a target vocabulary word.
 * - Provides granular feedback on target word usage, preposition collocations,
 *   grammar accuracy, naturalness, and suggests a stronger native version.
 * - Leverages Gemini 3.6 Flash via OpenAI-compatible endpoint with Bearer auth.
 * - Features instant deterministic local rule-based NLP fallback for high availability.
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

// Local rule-based NLP evaluator
function evaluateLocally({ word = '', sentence = '', _prompt = '' }) {
  const cleanWord = word.trim().toLowerCase();
  const cleanSentence = sentence.trim();
  const lowerSentence = cleanSentence.toLowerCase();

  // Basic word presence check (supports simple stem matching)
  const root = cleanWord.replace(/e$/, '').replace(/ing$/, '').replace(/ed$/, '');
  const isWordUsed = lowerSentence.includes(cleanWord) || (root.length >= 4 && lowerSentence.includes(root));

  const words = cleanSentence.split(/\s+/).filter(Boolean);
  let score = 75;
  let feedback = '';
  let grammarNotes = 'Good sentence structure.';
  let collocationNotes = 'Natural expression and word choice.';
  let strongerVersion = cleanSentence;

  if (!isWordUsed) {
    score = 45;
    feedback = `Make sure to include the target word "${word}" in your sentence.`;
    collocationNotes = `Try saying: "I want to be more ${word} when I speak."`;
    strongerVersion = `I strive to be ${word} in every communication opportunity.`;
    return {
      score,
      isWordUsed: false,
      feedback,
      grammarNotes: 'Please include the target word.',
      collocationNotes,
      strongerVersion,
      xpEarned: 5,
      badge: 'Keep Practicing'
    };
  }

  // Collocation check heuristics
  if (cleanWord === 'confident') {
    if (lowerSentence.includes('confident on')) {
      score = 70;
      collocationNotes = "Avoid 'confident on'. In English, pair confident with 'about' or 'in'.";
      feedback = "Good effort! Adjust the preposition to 'confident about'.";
      strongerVersion = cleanSentence.replace(/confident on/gi, 'confident about');
    } else if (lowerSentence.includes('confident about') || lowerSentence.includes('confident in')) {
      score = 92;
      feedback = "Fantastic sentence! You used the native collocation accurately.";
      collocationNotes = "Perfect pairing with 'about' or 'in'.";
      strongerVersion = `I feel completely ${word} about handling this challenge effectively.`;
    } else {
      score = 85;
      feedback = "Great sentence! Clear and meaningful usage.";
      strongerVersion = `${cleanSentence.replace(/[.?!]$/, '')}, which reinforces my overall confidence.`;
    }
  } else if (cleanWord === 'elaborate') {
    if (lowerSentence.includes('elaborate about')) {
      score = 70;
      collocationNotes = "Avoid 'elaborate about'. Use 'elaborate on' instead.";
      feedback = "Good attempt! The correct native preposition is 'elaborate on'.";
      strongerVersion = cleanSentence.replace(/elaborate about/gi, 'elaborate on');
    } else if (lowerSentence.includes('elaborate on')) {
      score = 94;
      feedback = "Spot on! 'Elaborate on' is the precise natural phrase.";
      collocationNotes = "Excellent command of the phrasal verb form.";
    } else {
      score = 84;
      feedback = "Clear usage! You expressed your thoughts well.";
    }
  } else if (cleanWord === 'hesitant') {
    if (lowerSentence.includes('hesitant to') || lowerSentence.includes('hesitant about')) {
      score = 90;
      feedback = "Great usage! You captured the feeling of hesitation accurately.";
    } else {
      score = 82;
      feedback = "Solid sentence! Try pairing with 'hesitant to [verb]'.";
    }
  } else {
    // General evaluation
    if (words.length >= 8) {
      score = 88;
      feedback = `Well done! You integrated "${word}" into a rich, descriptive sentence.`;
    } else if (words.length >= 4) {
      score = 80;
      feedback = `Good job using "${word}". Try expanding with more context next time!`;
    } else {
      score = 65;
      feedback = `Short sentence. Try adding more background context with "${word}".`;
    }
  }

  // Capitalization and punctuation bonus
  if (/^[A-Z]/.test(cleanSentence) && /[.?!]$/.test(cleanSentence)) {
    grammarNotes = "Clean punctuation and proper capitalization.";
  } else {
    grammarNotes = "Remember to start with a capital letter and end with a period.";
  }

  return {
    score,
    isWordUsed: true,
    feedback,
    grammarNotes,
    collocationNotes,
    strongerVersion,
    xpEarned: score >= 80 ? 15 : 10,
    badge: score >= 90 ? 'Mastery' : 'Good Progress'
  };
}

export default async function handler(req, res) {
  ensureEnvLoaded();

  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.', code: 'METHOD_NOT_ALLOWED' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const {
    word = '',
    sentence = '',
    prompt = ''
  } = body;

  if (!sentence || !sentence.trim()) {
    return res.status(400).json({ error: 'Sentence cannot be empty' });
  }

  const apiKey = (
    process.env.AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    ''
  ).trim();

  // If no API key or in demo mode, use fast rule-based evaluator
  if (!apiKey || apiKey.toLowerCase() === 'demo' || apiKey.toLowerCase() === 'mock') {
    const localResult = evaluateLocally({ word, sentence, _prompt: prompt });
    return res.status(200).json(localResult);
  }

  const systemPrompt = `You are an expert English communication coach for "SpeakUp", helping students improve spoken English and vocabulary.
Evaluate whether the student correctly and naturally used the target word in their sentence.

TARGET WORD: "${word}"
STUDENT'S SENTENCE: "${sentence}"
CONTEXT PROMPT: "${prompt || 'Use the word in a sentence'}"

EVALUATION CRITERIA:
1. isWordUsed: true if the target word (or its direct inflection) is present.
2. score: 0 to 100 based on grammar, accuracy, and natural collocation.
3. feedback: A warm, concise 1-sentence observation.
4. grammarNotes: Brief 1-sentence note on grammar and syntax.
5. collocationNotes: Note any preposition or word-pairing improvements (e.g. "Use 'confident about' rather than 'confident on'").
6. strongerVersion: A more natural, professional, or native phrasing of their sentence.
7. xpEarned: 15 if score >= 80, else 10.
8. badge: "Mastery" if score >= 90, else "Good Progress".

OUTPUT FORMAT:
Return strictly valid JSON with no markdown backticks:
{
  "score": 90,
  "isWordUsed": true,
  "feedback": "...",
  "grammarNotes": "...",
  "collocationNotes": "...",
  "strongerVersion": "...",
  "xpEarned": 15,
  "badge": "Mastery"
}`;

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 12000);

  try {
    const geminiModel = process.env.AI_MODEL || 'gemini-3.6-flash';
    const openaiCompatUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

    let parsed = null;

    try {
      const apiRes = await fetch(openaiCompatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: geminiModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Please evaluate this vocabulary sentence:\nWord: ${word}\nSentence: ${sentence}` }
          ],
          response_format: { type: 'json_object' }
        }),
        signal: abortController.signal
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        const raw = data.choices?.[0]?.message?.content || '';
        parsed = JSON.parse(raw.replace(/```json/gi, '').replace(/```/g, '').trim());
      }
    } catch {
      // Proceed to fallback
    }

    clearTimeout(timeoutId);

    if (parsed && typeof parsed.score === 'number') {
      return res.status(200).json({
        score: parsed.score,
        isWordUsed: Boolean(parsed.isWordUsed),
        feedback: parsed.feedback || "Good usage of the vocabulary word!",
        grammarNotes: parsed.grammarNotes || "Grammatically sound.",
        collocationNotes: parsed.collocationNotes || "Natural word choice.",
        strongerVersion: parsed.strongerVersion || sentence,
        xpEarned: parsed.score >= 80 ? 15 : 10,
        badge: parsed.badge || (parsed.score >= 90 ? 'Mastery' : 'Good Progress')
      });
    }

    const fallback = evaluateLocally({ word, sentence, _prompt: prompt });
    return res.status(200).json(fallback);

  } catch {
    clearTimeout(timeoutId);
    const fallback = evaluateLocally({ word, sentence, _prompt: prompt });
    return res.status(200).json(fallback);
  }
}
