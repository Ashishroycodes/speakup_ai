/**
 * SpeakUp AI Coach - Secure Server-Side API Route
 *
 * Route: POST /api/chat
 *
 * Security & Architecture:
 * - Reads `AI_API_KEY` strictly from the server environment (`process.env.AI_API_KEY`).
 * - Never returns or leaks the API key to the client.
 * - Works as a Vercel Serverless Function in production, and via Vite dev middleware locally.
 * - Automatically supports OpenAI, Groq, Google Gemini, OpenRouter, and custom endpoints.
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
          // Allow fresh values from .env to update process.env
          if (val) {
            process.env[key] = val;
          }
        }
      }
    } catch {
      // Safe fallback if fs is restricted
    }
  }
}

export function generateContextualQuickPrompts(aiText = '', mode = 'casual', _language = 'auto') {
  const lower = (aiText || '').toLowerCase();

  // 1. Projects & coding / technical assignments
  if (lower.includes('project') || lower.includes('complete') || lower.includes('technical') || lower.includes('build')) {
    return [
      "I built a web application using React and Node.js",
      "Our main challenge was managing tight project deadlines",
      "Mera project college students ke time management ke liye tha"
    ];
  }

  // 2. Interview intro, background & roles
  if (lower.includes('tell me about yourself') || lower.includes('background') || lower.includes('target') || lower.includes('interview')) {
    return [
      "I am a passionate software engineer with strong problem solving skills",
      "I recently graduated with a degree in computer science",
      "Maine recently multiple frontend projects pe actively kaam kiya hai"
    ];
  }

  // 3. Difficulties, challenges & obstacles
  if (lower.includes('challenge') || lower.includes('difficult') || lower.includes('problem') || lower.includes('obstacle')) {
    return [
      "I broke down the issue step-by-step and tested incrementally",
      "Collaborating closely with my team helped resolve it quickly",
      "Starting was tricky, but consistent practice made it easy"
    ];
  }

  // 4. Strengths, skills & advantages
  if (lower.includes('strength') || lower.includes('skill') || lower.includes('best at') || lower.includes('qualit')) {
    return [
      "My greatest strengths are quick adaptability and active listening",
      "I excel at communicating complex ideas simply to team members",
      "Main pressure situations mein calm rehke focus maintain karta hu"
    ];
  }

  // 5. Nervousness, fear & hesitation
  if (lower.includes('nervous') || lower.includes('hesitat') || lower.includes('anxious') || lower.includes('dar')) {
    return [
      "I feel nervous when suddenly asked to speak before large groups",
      "Taking a deep breath and organizing my points helps me stay calm",
      "Mujhe public speaking me thoda hesitation feel hota hai"
    ];
  }

  // 6. College life, exams & academics
  if (lower.includes('college') || lower.includes('exam') || lower.includes('campus') || lower.includes('study')) {
    return [
      "College lectures and lab submissions have been quite intense lately",
      "I am actively preparing for campus placement drives this semester",
      "Aaj college me kaafi engaging seminar attend kiya"
    ];
  }

  // 7. Free time, hobbies & interests
  if (lower.includes('hobby') || lower.includes('weekend') || lower.includes('free time') || lower.includes('unwind')) {
    return [
      "I enjoy exploring modern web development and playing cricket",
      "I like listening to communication podcasts and reading books",
      "Weekend pe main friends ke sath hang out karta hu"
    ];
  }

  // 8. Workplace & professional sync
  if (mode === 'workplace' || lower.includes('priority') || lower.includes('deliverable') || lower.includes('sync')) {
    return [
      "Our sprint goals are on track for deployment this Friday",
      "I need a quick alignment on the final client specifications",
      "I am prioritizing the high-impact user bug fixes today"
    ];
  }

  // 9. Presentation & public speaking hooks
  if (mode === 'presentation' || lower.includes('pitch') || lower.includes('hook') || lower.includes('audience')) {
    return [
      "Did you know that 80% of communication success comes from clarity?",
      "Imagine a world where anyone can speak English without hesitation",
      "Good morning everyone, today I want to share an inspiring story"
    ];
  }

  // 10. General conversational fallback
  return [
    "Yes, absolutely! Let me share a quick example with you",
    "I believe consistent practice is the single most important factor",
    "That makes total sense, and I completely agree with your viewpoint"
  ];
}

export default async function handler(req, res) {
  // Ensure .env is read if running in Node/Vite environment
  ensureEnvLoaded();

  // Set CORS headers
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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

  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed. Use POST.',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  // 2. Validate Request Body
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const {
    message,
    history = [],
    language = 'auto',
    mode = 'casual',
    difficulty = 'intermediate',
    goal = 'Improve Fluency',
    isVoiceCall = false
  } = body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      error: 'User message cannot be empty.',
      code: 'EMPTY_MESSAGE'
    });
  }

  // 3. Validate Server Environment Secret Key (supports AI_API_KEY and provider-specific aliases)
  const apiKey = (
    process.env.AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.VITE_AI_API_KEY ||
    ''
  ).trim();

  // Demo / Mock mode: Intelligent conversational partner when no live key is added yet
  if (apiKey.toLowerCase() === 'demo' || apiKey.toLowerCase() === 'mock') {
    const lower = message.toLowerCase().trim();
    let replyText = '';
    let correction = null;

    // Detect common English mistakes for coaching demo
    if (lower.includes("didn't knew") || lower.includes("did not knew")) {
      correction = {
        original: "didn't knew",
        improved: "didn't know",
        explanation: "After 'did' or 'didn't', always use the base form of the verb (know, not knew)."
      };
    } else if (lower.includes("myself ") && (lower.startsWith("myself ") || lower.includes("hi myself") || lower.includes("hello myself"))) {
      correction = {
        original: "myself [name]",
        improved: "I am [name] / My name is [name]",
        explanation: "In professional English, introduce yourself with 'I am' or 'My name is' rather than 'myself'."
      };
    } else if (lower.includes("revert back")) {
      correction = {
        original: "revert back",
        improved: "reply / revert",
        explanation: "'Revert' already means 'to go back', so saying 'revert back' is repetitive. Simply use 'reply' or 'revert'."
      };
    } else if (lower.includes("she don't") || lower.includes("he don't")) {
      correction = {
        original: "don't",
        improved: "doesn't",
        explanation: "Use 'doesn't' for singular third-person subjects like he, she, or it."
      };
    }

    const isQuestion = lower.includes('?') || lower.startsWith('what') || lower.startsWith('how') || lower.startsWith('why') || lower.startsWith('can you') || lower.startsWith('tell me') || lower.startsWith('explain');

    if (isQuestion) {
      if (lower.includes('interview') || mode === 'interview') {
        replyText = "That's a classic interview question! Before I share my coaching tips, give it a shot yourself—how would you answer that right now?";
      } else {
        replyText = "That is a thought-provoking question! But remember, this is your speaking practice—how would you explain or answer that in your own words?";
      }
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('namaste')) {
      replyText = mode === 'interview'
        ? "Hello! Welcome to your interview practice session. Let's begin: Could you tell me a little about yourself and your background?"
        : "Hi there! It's great to talk with you. What topic would you like to practice discussing today?";
    } else if (lower.includes('nervous') || lower.includes('hesitat') || lower.includes('dar')) {
      replyText = "It is completely normal to feel hesitation when speaking! Remember, fluency comes before perfection. Tell me, what is one thing you enjoy doing in your free time?";
    } else if (lower.includes('college') || lower.includes('exam') || lower.includes('project')) {
      replyText = "College projects and exams can definitely keep you busy! What is the most exciting project you've worked on recently?";
    } else if (lower.includes('how are you')) {
      replyText = "I'm doing wonderful and excited to chat with you! How has your day been going so far?";
    } else {
      replyText = `That's an interesting point! Could you elaborate a bit more on "${message.slice(0, 45).replace(/"/g, '')}"? I'm all ears!`;
    }

    return res.status(200).json({
      id: 'ai-' + Date.now(),
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      corrections: correction,
      detectedLanguage: language === 'auto' ? 'en' : language,
      suggestedPrompts: generateContextualQuickPrompts(replyText, mode, language)
    });
  }

  if (!apiKey || apiKey === 'your_secret_key_here') {
    return res.status(500).json({
      error: 'AI_API_KEY is not configured on the server. Please set the AI_API_KEY environment variable in your .env file locally or in your Vercel project settings.',
      code: 'MISSING_API_KEY'
    });
  }

  // 4. Resolve AI Provider, Endpoint, and Model
  let endpoint = 'https://api.openai.com/v1/chat/completions';
  let model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (process.env.AI_BASE_URL) {
    let base = process.env.AI_BASE_URL.replace(/\/+$/, '');
    endpoint = base.endsWith('/chat/completions') ? base : `${base}/chat/completions`;
  } else if (apiKey.startsWith('gsk_') || process.env.GROQ_API_KEY) {
    // Groq (fast & affordable)
    endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
  } else if (apiKey.startsWith('AQ.') || apiKey.startsWith('AIzaSy') || process.env.GEMINI_API_KEY) {
    // Google Gemini (New Gemini 3.6 Flash API)
    endpoint = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
    model = process.env.AI_MODEL || 'gemini-3.6-flash';
  } else if (apiKey.startsWith('sk-or-') || process.env.OPENROUTER_API_KEY) {
    // OpenRouter
    endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    model = process.env.AI_MODEL || 'openai/gpt-4o-mini';
  }

  // 5. System instructions tailored to SpeakUp communication coaching
  const systemPrompt = `You are the AI Communication Coach on the SpeakUp platform.
Your mission is to help Indian college students and young professionals build spoken English confidence through natural, supportive dialogue.
You understand English, Hindi, and Hinglish (conversational Hindi written in Roman script, e.g. "Aaj mera interview hai, kaafi nervous lag raha hai").

Settings for this student:
- Session Type: ${isVoiceCall ? 'Real-Time Spoken Voice Call (Hands-Free Conversation)' : 'Interactive Chat Practice'}
- Conversation Mode: ${mode} (casual, interview, college, workplace, group_discussion, presentation)
- Difficulty Level: ${difficulty} (beginner, intermediate, advanced)
- Learning Goal: ${goal}
- Language Setting: ${language}

CRITICAL BEHAVIORAL DIRECTIVES:
1. NEVER GIVE DIRECT ANSWERS TO STUDENT QUESTIONS (ANTI-Q&A RULE):
   - You are a speaking conversation coach, NOT an informational search engine, tutor, or encyclopedia.
   - If the student asks you ANY question (e.g. "What is machine learning?", "What should I say in an interview?", "Can you tell me the answer?", "Why do people procrastinate?", or asks for your opinion on a topic):
     DO NOT provide direct answers, factual lectures, or definitions!
     Instead, give a brief 1-sentence friendly conversational reaction, and IMMEDIATELY REDIRECT the question back to the student so that THEY practice speaking and explaining their thoughts!
     * Example: If student asks "What is artificial intelligence?", reply: "That's a huge topic right now! Before I chime in, how would you explain AI in your own words to someone new to it?"
     * Example: If student asks "How should I introduce myself in an interview?", reply: "You have a great background to highlight! Pretend I'm your hiring manager right now—give it a shot and tell me about yourself!"
     * Example: If student asks "Can you give me the answer?", reply: "Haha, no shortcuts here in speaking practice! Take a breath and give it your best attempt—I'm right here cheering you on."
     * Example: If student asks "What's your favorite hobby?", reply: "I love having chats like this with curious students! What about you, what do you enjoy doing to unwind?"
2. ENGAGING 2-WAY DIALOGUE:
   - The student must do 80% of the talking.
   - Keep your replies CONCISE (1 to 2 sentences maximum), completely natural for spoken audio.
   - Always end with an open-ended conversational hook or follow-up question to keep the back-and-forth momentum flowing.
3. LANGUAGE & NATURAL HINGLISH POLICY:
   - Understand English, Hindi, and natural Hinglish seamlessly (e.g. "mera introduction kaise better kar sakta hu?", "Today I went to college aur waha presentation tha.", "mujhe interview ke liye practice karni hai.").
   - Do NOT treat natural Hindi words used in Hinglish as spelling mistakes or grammatical errors! Do NOT incorrectly mark Hindi words used naturally in Hinglish as English errors.
   - If language is 'hi', reply in Devanagari Hindi. If 'hinglish', reply naturally in Hinglish/English. If 'en', reply in clear, friendly English. If 'auto', match the student's chosen language style seamlessly.
   - In the "correction" field: ONLY provide a tip if there is an ACTUAL grammatical flaw (e.g. "didn't knew", "she don't", subject-verb mismatch). If the student spoke natural Hinglish or their sentence has no real grammar mistake, set "correction" to null!
4. DYNAMIC CONTEXTUAL QUICK PROMPTS (MANDATORY):
   - You MUST generate a "suggestedPrompts" array containing 3 to 4 natural, engaging follow-up responses that the STUDENT could say next in reply to your message.
   - Each suggested prompt MUST be directly related to the question or topic you just posed (e.g. if you asked about their college project, suggestions must be answers about their project).
   - Keep each prompt concise (3 to 10 words).
   - If the student speaks Hinglish, include a blend of natural English and Hinglish prompt options.
5. OUTPUT FORMAT:
   - Output MUST BE strictly a valid JSON object with NO markdown backticks or commentary outside the JSON:
{
  "reply": "Conversational reply (1-2 sentences redirecting to student or advancing the conversation)",
  "correction": {
    "original": "Student's exact phrase that had an actual grammatical mistake",
    "improved": "Better English phrasing",
    "explanation": "Friendly 1-sentence tip explaining why"
  } or null,
  "detectedLanguage": "en" | "hi" | "hinglish",
  "suggestedPrompts": [
    "Contextual reply 1 directly answering your question",
    "Contextual reply 2 offering an alternative perspective",
    "Contextual reply 3 with practical example"
  ]
}`;

  // 6. Build Chat History (limit to last 8 turns to stay efficient)
  const chatMessages = [
    { role: 'system', content: systemPrompt }
  ];

  const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
  for (const item of recentHistory) {
    const textVal = item?.text || item?.content || '';
    const senderVal = item?.sender || item?.role || '';
    if (textVal && (senderVal === 'user' || senderVal === 'ai' || senderVal === 'assistant')) {
      chatMessages.push({
        role: senderVal === 'user' ? 'user' : 'assistant',
        content: textVal
      });
    }
  }

  // Append current message
  chatMessages.push({
    role: 'user',
    content: message.trim()
  });

  // 7. Request to Upstream AI Provider with timeout handling
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 30000);

  try {
    let rawContent = '';

    // A. Native Google Gemini API Support (Gemini 3.6 Flash / 2.5 Flash / 2.0 Flash)
    if (apiKey.startsWith('AQ.') || apiKey.startsWith('AIzaSy') || process.env.GEMINI_API_KEY) {
      const geminiModel = process.env.AI_MODEL || 'gemini-flash-lite-latest';

      const contents = [];
      const historyItems = Array.isArray(history) ? history.slice(-8) : [];
      for (const item of historyItems) {
        const textVal = item?.text || item?.content || '';
        const senderVal = item?.sender || item?.role || '';
        if (textVal && (senderVal === 'user' || senderVal === 'ai' || senderVal === 'assistant' || senderVal === 'model')) {
          const role = senderVal === 'user' ? 'user' : 'model';
          if (contents.length === 0) {
            if (role === 'user') {
              contents.push({ role: 'user', parts: [{ text: textVal }] });
            }
          } else {
            const lastRole = contents[contents.length - 1].role;
            if (lastRole === role) {
              contents[contents.length - 1].parts[0].text += '\n' + textVal;
            } else {
              contents.push({ role, parts: [{ text: textVal }] });
            }
          }
        }
      }

      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        contents[contents.length - 1].parts[0].text += '\n' + message.trim();
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: message.trim() }]
        });
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey.trim()}`;

      let geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: 'application/json'
          }
        }),
        signal: abortController.signal
      });

      // Model fallback if primary failed (e.g. 503 spike, 404 deprecated, or 429 quota)
      if (!geminiRes.ok) {
        const fallbackModels = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite-preview', 'gemini-flash-lite-latest'];
        for (const candidate of fallbackModels) {
          if (candidate === geminiModel) continue;
          const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${apiKey.trim()}`;
          const fallbackRes = await fetch(fallbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: { 
                temperature: 0.7, 
                maxOutputTokens: 1000, 
                responseMimeType: 'application/json'
              }
            }),
            signal: abortController.signal
          }).catch(() => null);
          if (fallbackRes && fallbackRes.ok) {
            geminiRes = fallbackRes;
            break;
          }
        }
      }

      clearTimeout(timeoutId);

      if (!geminiRes.ok) {
        const errorJson = await geminiRes.json().catch(() => ({}));
        const errorMsg = errorJson?.error?.message || geminiRes.statusText;
        console.warn(`Gemini upstream status ${geminiRes.status}: ${errorMsg}. Using conversational coach fallback.`);
        
        // Intelligent fallback: Do not crash or block the student's conversation!
        const lower = message.toLowerCase().trim();
        const isQ = lower.includes('?') || lower.startsWith('what') || lower.startsWith('how') || lower.startsWith('why') || lower.startsWith('can you') || lower.startsWith('tell me');
        let fallbackReply = '';
        if (isQ) {
          fallbackReply = mode === 'interview'
            ? "That's a key question interviewers love to ask! Give it a try right now as if I am your hiring manager—how would you answer?"
            : "That's a really interesting question to explore! But since this is your speaking practice, how would you explain your thoughts on that?";
        } else {
          fallbackReply = mode === 'interview'
            ? "Thank you for sharing that. Could you describe a specific situation where you applied that skill to overcome a challenge?"
            : "That makes a lot of sense! Could you share an example or tell me more about how that impacted you?";
        }

        return res.status(200).json({
          id: 'ai-fb-' + Date.now(),
          sender: 'ai',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          corrections: null,
          detectedLanguage: language === 'auto' ? 'en' : language,
          suggestedPrompts: generateContextualQuickPrompts(fallbackReply, mode, language)
        });
      }

      const geminiData = await geminiRes.json();
      rawContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    } else {
      // B. OpenAI-Compatible Providers (OpenAI, Groq, OpenRouter)
      const upstreamResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model,
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 350
        }),
        signal: abortController.signal
      });

      clearTimeout(timeoutId);

      if (!upstreamResponse.ok) {
        let errorDetails = '';
        try {
          const errorJson = await upstreamResponse.json();
          errorDetails = errorJson?.error?.message || errorJson?.message || JSON.stringify(errorJson);
        } catch {
          errorDetails = upstreamResponse.statusText;
        }

        if (upstreamResponse.status === 401 || upstreamResponse.status === 403) {
          return res.status(401).json({
            error: 'Invalid AI API Key. Please verify your AI_API_KEY is active and authorized.',
            code: 'INVALID_API_KEY',
            details: errorDetails
          });
        }

        if (upstreamResponse.status === 429) {
          return res.status(429).json({
            error: 'AI Provider rate limit or quota exceeded. Please wait a moment or check your AI account balance.',
            code: 'RATE_LIMIT',
            details: errorDetails
          });
        }

        return res.status(upstreamResponse.status >= 500 ? 502 : upstreamResponse.status).json({
          error: `AI Provider returned error (${upstreamResponse.status}): ${errorDetails}`,
          code: 'API_PROVIDER_ERROR',
          details: errorDetails
        });
      }

      const data = await upstreamResponse.json();
      rawContent = data?.choices?.[0]?.message?.content?.trim() || '';
    }

    // 9. Parse AI Response JSON (handle potential markdown code blocks)
    let parsedReply = null;
    try {
      const cleanJson = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      parsedReply = JSON.parse(cleanJson);
    } catch {
      // If parsing fails, fall back to plain text
      parsedReply = {
        reply: rawContent || "I'm here! Could you repeat that?",
        correction: null,
        detectedLanguage: 'en'
      };
    }

    // 10. Format response to match SpeakUp's frontend message contract
    const formattedResponse = {
      id: 'ai-' + Date.now(),
      sender: 'ai',
      text: parsedReply.reply || rawContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      corrections: parsedReply.correction || null,
      detectedLanguage: parsedReply.detectedLanguage || 'en',
      suggestedPrompts: Array.isArray(parsedReply.suggestedPrompts) && parsedReply.suggestedPrompts.length > 0
        ? parsedReply.suggestedPrompts
        : generateContextualQuickPrompts(parsedReply.reply || rawContent, mode, language)
    };

    return res.status(200).json(formattedResponse);

  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      return res.status(504).json({
        error: 'AI request timed out. Please try again.',
        code: 'REQUEST_TIMEOUT'
      });
    }

    return res.status(502).json({
      error: 'Failed to communicate with AI provider API. Network or connection failure.',
      code: 'API_NETWORK_FAILURE',
      details: err.message
    });
  }
}
