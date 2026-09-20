/**
 * SpeakUp - Phase 8: Presentation Coach AI Analysis Endpoint
 *
 * Route: POST /api/presentation-analysis
 *
 * Evaluates:
 * - Overall Score (0–100)
 * - 6 Dimensions: clarity, fluency, grammar, vocabulary, structure, relevance (0–100)
 * - Structure Analysis: Introduction, Main Point, Supporting Explanation, Conclusion
 * - Filler Word Analysis: um, uh, actually, basically, like, you know, hmm
 *   (Strictly avoids treating natural Hindi/Hinglish words as fillers)
 * - Better Presentation: What You Did Well & How To Improve (max 5 practical before/after items)
 * - AI Coach Feedback: Friendly Next Practice advice
 * - High-availability zero-crash fallback engine
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
          if (val && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch {
      // Safe fallback
    }
  }
}

// Precise filler word regex patterns
const COMMON_FILLER_PATTERNS = [
  { word: 'um', regex: /\bum\b/gi },
  { word: 'uh', regex: /\buh\b/gi },
  { word: 'actually', regex: /\bactually\b/gi },
  { word: 'basically', regex: /\bbasically\b/gi },
  { word: 'like', regex: /\b(?<!(feel|look|sound|seem|act)\s)like\b(?!\s(to|a|an|the|my|this))/gi },
  { word: 'you know', regex: /\byou know\b/gi },
  { word: 'hmm', regex: /\bhmm+\b/gi }
];

/**
 * Intelligent Local Fallback Analyzer
 * Deterministically analyzes the candidate's transcript if Gemini is unavailable
 */
function generateLocalPresentationReport({
  _topic = 'Explain Your Favorite Technology',
  _category = 'Technology',
  _difficulty = 'Intermediate',
  durationMinutes = 2,
  actualSeconds = 60,
  transcript = '',
  _language = 'English'
}) {
  const cleanTranscript = (transcript || '').trim();
  const words = cleanTranscript ? cleanTranscript.split(/\s+/) : [];
  const totalWords = words.length;

  // Words per minute (WPM)
  const actualMinutes = Math.max(0.2, actualSeconds / 60);
  const wpm = Math.min(220, Math.round(totalWords / actualMinutes));

  // Count fillers
  const fillerCounts = {};
  let totalFillers = 0;
  for (const { word, regex } of COMMON_FILLER_PATTERNS) {
    const matches = cleanTranscript.match(regex);
    if (matches && matches.length > 0) {
      fillerCounts[word] = matches.length;
      totalFillers += matches.length;
    }
  }

  let mostUsedFiller = 'None';
  let maxCount = 0;
  for (const [w, c] of Object.entries(fillerCounts)) {
    if (c > maxCount) {
      maxCount = c;
      mostUsedFiller = `"${w}" (${c} times)`;
    }
  }

  // Structure detection heuristics
  const lowerText = cleanTranscript.toLowerCase();
  const hasIntro = /(today|introduce|hello|welcome|talk about|discuss|start with|first of all|let me)/i.test(lowerText) || totalWords >= 20;
  const hasMainPoint = /(because|reason|technology|important|feature|benefit|advantage|problem|goal|core)/i.test(lowerText) || totalWords >= 40;
  const hasSupporting = /(for example|such as|in fact|specifically|like when|experience|evidence|detail)/i.test(lowerText) || totalWords >= 70;
  const hasConclusion = /(in conclusion|to conclude|finally|in summary|overall|to wrap up|takeaway|thank you)/i.test(lowerText) || (totalWords >= 90 && lowerText.includes('thank'));

  // Metrics based on real spoken content
  let clarity = 75;
  let fluency = 78;
  let grammar = 80;
  let vocabulary = 74;
  let structure = 72;
  let relevance = 82;

  // Word count penalties / boosts
  const expectedMinWords = Math.max(25, durationMinutes * 40);
  if (totalWords < expectedMinWords * 0.4) {
    clarity = Math.max(50, clarity - 18);
    structure = Math.max(50, structure - 15);
  } else if (totalWords >= expectedMinWords) {
    clarity = Math.min(92, clarity + 6);
    structure = Math.min(94, structure + 8);
  }

  // WPM pacing
  if (wpm >= 90 && wpm <= 150) {
    fluency = Math.min(94, fluency + 8);
  } else if (wpm < 60 || wpm > 175) {
    fluency = Math.max(62, fluency - 8);
  }

  // Vocabulary variety
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))).size;
  const vocabRatio = totalWords > 0 ? uniqueWords / totalWords : 0;
  if (vocabRatio > 0.6) {
    vocabulary = Math.min(92, vocabulary + 6);
  }

  // Filler deduction
  if (totalFillers > 5) {
    clarity = Math.max(55, clarity - 6);
    fluency = Math.max(55, fluency - 6);
  }

  const overallScore = Math.min(96, Math.max(45, Math.round(
    clarity * 0.2 +
    fluency * 0.2 +
    structure * 0.2 +
    relevance * 0.15 +
    grammar * 0.15 +
    vocabulary * 0.1
  )));

  // Filler suggestion
  let fillerSuggestion = 'Great job keeping filler words low! You paused naturally instead of using crutch sounds.';
  if (totalFillers > 0) {
    fillerSuggestion = `Try taking a silent 1-second pause when gathering your thoughts instead of saying ${mostUsedFiller}.`;
  }

  // Strengths
  const strengths = [];
  if (hasIntro) strengths.push('Clear opening that oriented the listener immediately to your topic.');
  if (totalWords >= 50) strengths.push('Sustained verbal stamina and willingness to elaborate with specifics.');
  if (totalFillers <= 3) strengths.push('Controlled speech tempo with minimal distracting filler words.');
  if (hasConclusion) strengths.push('Brought the presentation to a deliberate, structured conclusion.');
  if (!strengths.length) strengths.push('Good attempt at speaking spontaneously under a timed challenge.');

  // How to improve
  const howToImprove = [];
  if (!hasConclusion) {
    howToImprove.push({
      youSaid: cleanTranscript.slice(-60) || '...and yeah that is all.',
      better: 'In summary, this technology matters because it solves real problems and opens up new possibilities. Thank you for listening.',
      explanation: 'Always anchor your presentation with a dedicated summary sentence to create a memorable impression.'
    });
  }
  if (!hasSupporting) {
    howToImprove.push({
      youSaid: 'It is very useful and helpful for everyone.',
      better: 'For example, in a classroom setting, students can collaborate simultaneously on the same document from different locations.',
      explanation: 'Use concrete "For example..." illustrations rather than general claims like "it is very useful".'
    });
  }
  if (totalFillers > 3) {
    howToImprove.push({
      youSaid: `Actually, like, it basically helps...`,
      better: 'This solution directly addresses user needs by automating the workflow.',
      explanation: 'Replace filler phrases like "basically" and "you know" with crisp active verbs.'
    });
  }
  if (howToImprove.length === 0) {
    howToImprove.push({
      youSaid: 'It helps many things in daily life.',
      better: 'It optimizes productivity by reducing repetitive manual tasks by over 50%.',
      explanation: 'Quantify your points with tangible outcomes to sound more authoritative.'
    });
  }

  return {
    overallScore,
    scores: {
      clarity,
      fluency,
      grammar,
      vocabulary,
      structure,
      relevance
    },
    structureAnalysis: {
      introduction: {
        present: hasIntro,
        feedback: hasIntro ? 'Engaging opening that introduced the topic clearly.' : 'Open with a strong hook and clearly state what you will discuss.'
      },
      mainPoint: {
        present: hasMainPoint,
        feedback: hasMainPoint ? 'Clear core concept identified and explained.' : 'Anchor your talk around 1-2 prominent main takeaways.'
      },
      supportingExplanation: {
        present: hasSupporting,
        feedback: hasSupporting ? 'Solid evidence or illustrative examples provided.' : 'Add a quick concrete example or personal observation to support your claims.'
      },
      conclusion: {
        present: hasConclusion,
        feedback: hasConclusion ? 'Clean final takeaway provided.' : 'End with a deliberate conclusion or summary takeaway rather than stopping abruptly.'
      }
    },
    fillerAnalysis: {
      totalFillers,
      mostUsedFiller,
      suggestion: fillerSuggestion,
      breakdown: fillerCounts
    },
    deliveryStats: {
      totalWords,
      speakingDurationSeconds: actualSeconds,
      wordsPerMinute: wpm
    },
    whatYouDidWell: strengths,
    howToImprove: howToImprove.slice(0, 5),
    nextPractice: hasConclusion 
      ? 'Your structure is solid! In your next session, focus on using richer descriptive adjectives and quantifying your examples.'
      : 'Your ideas are clear, but your conclusion can be much stronger. Try concluding with a 1-sentence summary next time.',
    honestNotice: 'Scores are computed based on your transcript, structure completeness, and vocabulary variety.'
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

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed. Use POST.',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  const body = req.body || {};
  const {
    topic = 'Explain Your Favorite Technology',
    category = 'Technology',
    difficulty = 'Intermediate',
    durationMinutes = 2,
    actualSeconds = 60,
    transcript = '',
    language = 'English'
  } = body;

  const cleanTranscript = (transcript || '').trim();

  // Validate non-empty transcript
  if (!cleanTranscript) {
    return res.status(400).json({
      error: 'Empty transcript provided. Please speak or enter text before submitting.',
      code: 'EMPTY_TRANSCRIPT'
    });
  }

  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    ''
  ).trim();

  // If no API key or in mock mode, use local analyzer
  if (!apiKey || apiKey.toLowerCase() === 'demo' || apiKey.toLowerCase() === 'mock') {
    const report = generateLocalPresentationReport({
      topic,
      category,
      difficulty,
      durationMinutes,
      actualSeconds,
      transcript: cleanTranscript,
      language
    });
    return res.status(200).json(report);
  }

  // System Prompt for Gemini
  const systemPrompt = `You are a friendly, expert Communication & Presentation Coach.
Evaluate the candidate's spoken presentation transcript honestly, constructively, and encouragingly.

PRESENTATION DETAILS:
- Topic: "${topic}"
- Category: ${category}
- Difficulty Level: ${difficulty}
- Planned Duration: ${durationMinutes} Minute(s)
- Actual Spoken Time: ${actualSeconds} Seconds
- Spoken Language: ${language}
${language === 'Hinglish' ? 'IMPORTANT NOTE ON HINGLISH: The candidate is speaking in natural Hinglish (Hindi + English blend). Do NOT penalize natural Hindi/Hinglish words as grammar mistakes. Do NOT treat natural Hindi words like "ke baare mein", "toh", "lekin", "samajh", etc. as English filler words.' : ''}

TRANSCRIPT:
"${cleanTranscript}"

EVALUATION REQUIREMENTS:
1. Overall Score (0-100): Realistic score reflecting presentation effectiveness.
2. 6 Dimensional Scores (0-100 each):
   - clarity: Articulation and understandability of ideas.
   - fluency: Flow of delivery without awkward stops.
   - grammar: Sentence structure (respect natural Hinglish if used).
   - vocabulary: Variety and relevance of words.
   - structure: Presence of Introduction, Main Points, and Conclusion.
   - relevance: How well the speech directly addressed "${topic}".
3. Structure Analysis:
   - "introduction": { "present": boolean, "feedback": string }
   - "mainPoint": { "present": boolean, "feedback": string }
   - "supportingExplanation": { "present": boolean, "feedback": string }
   - "conclusion": { "present": boolean, "feedback": string }
4. Filler Word Analysis:
   - "totalFillers": count of um, uh, actually, basically, like (used as crutch), you know, hmm.
   - "mostUsedFiller": text (e.g. '"basically" (3 times)') or 'None'.
   - "suggestion": 1 practical tip to replace fillers with intentional pauses.
5. "whatYouDidWell": Array of 3-4 specific strengths demonstrated.
6. "howToImprove": Array of 1 to 5 practical, actionable improvements.
   Each item must be: { "youSaid": "...", "better": "...", "explanation": "..." }.
   Keep improvements realistic and practical, not overly academic.
7. "nextPractice": A friendly 1-2 sentence recommendation for the student's next practice session.

STRICT OUTPUT FORMAT:
Return strictly a valid JSON object matching this schema, with no markdown code blocks, backticks, or extra text:
{
  "overallScore": 82,
  "scores": {
    "clarity": 84,
    "fluency": 80,
    "grammar": 82,
    "vocabulary": 78,
    "structure": 80,
    "relevance": 86
  },
  "structureAnalysis": {
    "introduction": { "present": true, "feedback": "..." },
    "mainPoint": { "present": true, "feedback": "..." },
    "supportingExplanation": { "present": true, "feedback": "..." },
    "conclusion": { "present": true, "feedback": "..." }
  },
  "fillerAnalysis": {
    "totalFillers": 2,
    "mostUsedFiller": "\\"like\\" (2 times)",
    "suggestion": "...",
    "breakdown": { "like": 2 }
  },
  "whatYouDidWell": ["...", "..."],
  "howToImprove": [
    { "youSaid": "...", "better": "...", "explanation": "..." }
  ],
  "nextPractice": "...",
  "honestNotice": "Scores are computed directly from your spoken transcript and structure."
}`;

  try {
    // Model fallback chain: gemini-2.5-flash -> gemini-1.5-flash
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash'];
    let rawText = '';
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 2048,
              responseMimeType: 'application/json'
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Gemini status ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (rawText) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!rawText) {
      console.warn('Gemini API call returned empty or failed. Using intelligent local fallback.', lastError?.message);
      const fallbackReport = generateLocalPresentationReport({
        topic,
        category,
        difficulty,
        durationMinutes,
        actualSeconds,
        transcript: cleanTranscript,
        language
      });
      return res.status(200).json(fallbackReport);
    }

    // Clean JSON text
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    const report = JSON.parse(cleaned);

    // Provide delivery stats
    const words = cleanTranscript.split(/\s+/);
    const actualMinutes = Math.max(0.2, actualSeconds / 60);
    report.deliveryStats = {
      totalWords: words.length,
      speakingDurationSeconds: actualSeconds,
      wordsPerMinute: Math.min(220, Math.round(words.length / actualMinutes))
    };

    return res.status(200).json(report);
  } catch (err) {
    console.error('Error in /api/presentation-analysis:', err);
    // Guarantee zero crashes for user
    const fallbackReport = generateLocalPresentationReport({
      topic,
      category,
      difficulty,
      durationMinutes,
      actualSeconds,
      transcript: cleanTranscript,
      language
    });
    return res.status(200).json(fallbackReport);
  }
}
