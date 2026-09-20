/**
 * SpeakUp AI Interview Simulator - Real AI Interviewer API Route
 *
 * Route: POST /api/interview
 *
 * Security & Design:
 * - Reads GEMINI_API_KEY (or AI_API_KEY) strictly on the server side.
 * - Key is never returned or leaked to the client.
 * - Dynamic generation powered by Google Gemini with fallback generation for high availability.
 * - Realistically behaves like an interviewer: asks ONE question at a time,
 *   acknowledges prior responses concisely, asks follow-ups, and adapts to the candidate's level.
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

// Deterministic intelligent fallback question generator
function generateFallbackQuestion({
  interviewType = 'HR Interview',
  targetRole = 'Software Developer',
  _experienceLevel = 'Beginner',
  _difficulty = 'Medium',
  language = 'English',
  questionNumber = 1,
  totalQuestions = 10,
  userAnswer = ''
}) {
  const isHindi = language === 'Hindi';
  const isHinglish = language === 'Hinglish';
  const roleLower = targetRole.toLowerCase();

  // Acknowledgement for previous answer
  let acknowledgment = '';
  if (questionNumber > 1) {
    const acksEn = [
      "Thank you for sharing that.",
      "That is a clear explanation.",
      "Good point. I appreciate your practical perspective.",
      "Understood, that makes complete sense.",
      "Thanks for elaborating on that."
    ];
    const acksHinglish = [
      "Achha point hai. Thanks for sharing.",
      "Sahi explanation diya aapne.",
      "Great, yeh clear perspective tha.",
      "Samajh gaya, aage badhte hain."
    ];
    const acksHi = [
      "धन्यवाद, यह स्पष्ट विवरण था।",
      "अच्छा उत्तर। आइए आगे बढ़ते हैं।",
      "समझ गया, बहुत बढ़िया।"
    ];

    const pickList = isHindi ? acksHi : (isHinglish ? acksHinglish : acksEn);
    acknowledgment = pickList[(questionNumber - 2) % pickList.length];
  }

  // Determine question based on question number & interview type
  let question = "";
  let tips = "";
  let isFollowUp = false;

  // Follow-up logic if candidate gave a rich answer
  if (userAnswer && userAnswer.length > 50 && questionNumber % 3 === 0) {
    isFollowUp = true;
    if (roleLower.includes('data') || roleLower.includes('analyst')) {
      question = isHindi 
        ? "क्या आप बता सकते हैं कि इस कार्य में डेटा की सटीकता (data accuracy) कैसे सुनिश्चित की गई थी?"
        : (isHinglish 
            ? "Aapne jo point bataya, usme data clean karne aur accuracy ensure karne ke liye kaunsa approach use kiya tha?"
            : "Building on your previous answer, how did you ensure data accuracy and validate your final insights?");
      tips = "Explain data validation or cleaning methods.";
    } else {
      question = isHindi
        ? "इस स्थिति में मुख्य तकनीकी चुनौती क्या थी और आपने उसका समाधान कैसे किया?"
        : (isHinglish
            ? "Is scenario me main technical challenge kya tha aur aapne usko kaise debug kiya?"
            : "Looking back at that experience, what was the most difficult bottleneck you hit, and how did you resolve it?");
      tips = "Describe the bottleneck and your technical solution step-by-step.";
    }
  } else if (questionNumber === 1) {
    // Question 1: Self-introduction / background
    if (isHindi) {
      question = `नमस्ते! अपने बारे में बताइए और यह भी साझा कीजिए कि आप ${targetRole} की भूमिका में क्यों रुचि रखते हैं।`;
      tips = "अपनी शिक्षा, मुख्य स्किल्स और इस रोल में रुचि के बारे में बताएं।";
    } else if (isHinglish) {
      question = `Hello! Apne baare me batayein, aur share karein ki aap ${targetRole} role ke liye kyu apply kar rahe hain?`;
      tips = "Education -> Key Skills -> Projects -> Career Goal ka structure follow karein.";
    } else {
      question = `Tell me about yourself, your background, and what inspired you to pursue a role as a ${targetRole}.`;
      tips = "Structure your answer: Education -> Core Skills -> Highlight Project -> Career Goal.";
    }
  } else if (interviewType.includes('HR') || interviewType.includes('Placement') || interviewType.includes('Internship')) {
    const hrQuestions = [
      {
        q: "What would you say are your two greatest strengths, and what is one area you are actively trying to improve?",
        h: "Aapki do sabse badi strengths kya hain aur ek aisi weakness jispe aap actively improve kar rahe hain?",
        hi: "आपकी दो सबसे बड़ी ताकतें क्या हैं और एक कमजोरी जिस पर आप सुधार कर रहे हैं?",
        t: "Be honest about the weakness and show how you are proactively addressing it."
      },
      {
        q: `Why are you specifically interested in working with our team in this ${targetRole} position?`,
        h: `Aap hamari company me is ${targetRole} position ke liye specifically kyu interested hain?`,
        hi: `आप हमारी कंपनी में इस ${targetRole} पद के लिए विशेष रूप से क्यों काम करना चाहते हैं?`,
        t: "Mention company alignment, role challenges, and how you can add value."
      },
      {
        q: "Tell me about a time when you had to work under a tight deadline. How did you organize your priorities?",
        h: "Kisi aise time ke baare me batayein jab aapko tight deadline me kaam karna pada. Aapne priorities kaise manage ki?",
        hi: "किसी ऐसे समय के बारे में बताएं जब आपको समय सीमा के दबाव में काम करना पड़ा। आपने इसे कैसे संभाला?",
        t: "Use STAR: Situation, Task, Action, Result."
      },
      {
        q: "Where do you see yourself professionally over the next 3 to 5 years?",
        h: "Agle 3 se 5 saalon me aap khud ko professionally kis position par dekhte hain?",
        hi: "अगले 3 से 5 वर्षों में आप अपने करियर को कहाँ देखते हैं?",
        t: "Focus on skill depth, leadership potential, and consistent contribution."
      },
      {
        q: "Why should we select you over other candidates applying for this role?",
        h: "Ham aapko baki applicants ke comparison me kyu select karein?",
        hi: "हमें इस पद के लिए अन्य उम्मीदवारों की तुलना में आपको क्यों चुनना चाहिए?",
        t: "Highlight your problem-solving drive, fast learning ability, and dedication."
      }
    ];
    const item = hrQuestions[(questionNumber - 2) % hrQuestions.length];
    question = isHindi ? item.hi : (isHinglish ? item.h : item.q);
    tips = item.t;
  } else if (interviewType.includes('Behavioral')) {
    const behavioral = [
      {
        q: "Tell me about a time you faced a difficult conflict or disagreement within a team. How did you resolve it?",
        h: "Kisi aise situation ke baare me batayein jab team me disagreement hua tha. Aapne use kaise handle kiya?",
        hi: "एक ऐसी स्थिति का वर्णन करें जब टीम में असहमति हुई थी। आपने इसे कैसे सुलझाया?",
        t: "Focus on active listening, professional diplomacy, and the final positive outcome."
      },
      {
        q: "Describe a project that didn't go as planned. What mistakes were made and what was the lesson?",
        h: "Kisi aise project ke baare me batayein jo plan ke mutabiq nahi gaya. Kya mistakes hui aur kya seekh mili?",
        hi: "किसी ऐसे प्रोजेक्ट के बारे में बताएं जो योजना के अनुसार नहीं चला। आपने इससे क्या सीखा?",
        t: "Take ownership, explain the adaptation, and show growth mindset."
      },
      {
        q: "Can you give an example of when you had to learn a completely new technology or tool under pressure?",
        h: "Ek example dein jab aapko short notice me koi nayi technology seekhni padi thi?",
        hi: "कोई उदाहरण दें जब आपको सीमित समय में नई तकनीक सीखनी पड़ी थी?",
        t: "Explain your learning strategy: documentation, hands-on tutorials, fast prototyping."
      },
      {
        q: "Tell me about a time you took initiative to solve a problem without being asked to do so.",
        h: "Kabhi aapne bina bole aage badhkar koi problem solve ki ho? Us incident ke baare me batayein.",
        hi: "किसी ऐसी घटना के बारे में बताएं जहाँ आपने स्वयं पहल करके किसी समस्या का समाधान किया।",
        t: "Highlight proactive mindset, collaboration, and measurable impact."
      }
    ];
    const item = behavioral[(questionNumber - 2) % behavioral.length];
    question = isHindi ? item.hi : (isHinglish ? item.h : item.q);
    tips = item.t;
  } else {
    // Technical questions tailored to targetRole
    if (roleLower.includes('data')) {
      const dataQuestions = [
        {
          q: "How do you approach exploratory data analysis (EDA) when given an unfamiliar dataset with missing values?",
          h: "Jab koi unfamiliar dataset milta hai missing values ke sath, toh aap EDA kaise approach karte hain?",
          hi: "जब आपको अधूरा डेटासेट मिलता है, तो आप डेटा विश्लेषण (EDA) कैसे करते हैं?",
          t: "Discuss summary statistics, handling null values, distributions, and correlation."
        },
        {
          q: "Can you explain the difference between SQL INNER JOIN, LEFT JOIN, and when you would use GROUP BY with HAVING?",
          h: "SQL me INNER JOIN aur LEFT JOIN me kya difference hai? GROUP BY aur HAVING kab use hota hai?",
          hi: "SQL में INNER JOIN और LEFT JOIN में क्या अंतर है? HAVING क्लॉज का उपयोग कब किया जाता है?",
          t: "Clearly distinguish row matching rules and filtering aggregated vs non-aggregated rows."
        },
        {
          q: "How do you detect and handle overfitting in predictive machine learning models?",
          h: "ML models me overfitting kaise detect karte hain aur use rokne ke kya methods hain?",
          hi: "मशीन लर्निंग मॉडल में ओवरफिटिंग की पहचान और रोकथाम कैसे की जाती है?",
          t: "Mention cross-validation, regularization (L1/L2), feature pruning, and data augmentation."
        }
      ];
      const item = dataQuestions[(questionNumber - 2) % dataQuestions.length];
      question = isHindi ? item.hi : (isHinglish ? item.h : item.q);
      tips = item.t;
    } else {
      // General Software / Web / Full Stack / Fresher
      const techQuestions = [
        {
          q: `Walk me through an impressive project you built as a ${targetRole}. What was the architecture and your primary tech stack?`,
          h: `Aapne jo best project banaya hai ${targetRole} ke taur pe, uska architecture aur tech stack explain karein.`,
          hi: `अपने किसी प्रमुख प्रोजेक्ट के बारे में बताएं। उसका आर्किटेक्चर और तकनीकी स्टैक क्या था?`,
          t: "Explain client-server flow, state management, database choice, and deployment."
        },
        {
          q: "How does the browser or runtime handle asynchronous operations (e.g., Event Loop, Promises, or Async/Await)?",
          h: "Asynchronous operations jaise Promises aur Event Loop kaise execute hote hain?",
          hi: "एसिंक्रोनस ऑपरेशन्स और इवेंट लूप किस प्रकार कार्य करते हैं?",
          t: "Discuss call stack, microtask queue, callback queue, and non-blocking execution."
        },
        {
          q: "In Object-Oriented Programming, how would you explain Polymorphism and Encapsulation to a junior developer?",
          h: "OOP concepts me Polymorphism aur Encapsulation ka practical example dekar samjhaiye.",
          hi: "ऑब्जेक्ट ओरिएंटेड प्रोग्रामिंग में पॉलीमॉर्फिज्म और एनकैप्सुलेशन को उदाहरण सहित समझाइए।",
          t: "Give a concrete code analogy (e.g., method overriding vs data hiding via getters/setters)."
        },
        {
          q: "How would you optimize an API or web application that is experiencing slow response times under heavy traffic?",
          h: "Agar koi application heavy traffic me slow chal rahi ho, toh aap performance kaise optimize karenge?",
          hi: "भारी ट्रैफिक के दौरान किसी वेब एप्लिकेशन की गति को कैसे अनुकूलित (optimize) किया जा सकता है?",
          t: "Mention indexing, database query caching, CDN, debouncing, and pagination."
        }
      ];
      const item = techQuestions[(questionNumber - 2) % techQuestions.length];
      question = isHindi ? item.hi : (isHinglish ? item.h : item.q);
      tips = item.t;
    }
  }

  return {
    questionNumber,
    totalQuestions,
    acknowledgment,
    question,
    isFollowUp,
    tips
  };
}

export default async function handler(req, res) {
  ensureEnvLoaded();

  // Set CORS headers
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
    interviewType = 'HR Interview',
    targetRole = 'Software Developer',
    experienceLevel = 'Beginner',
    difficulty = 'Medium',
    language = 'English',
    questionNumber = 1,
    totalQuestions = 10,
    conversationHistory = [],
    userAnswer = ''
  } = body;

  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY ||
    ''
  ).trim();

  // Fallback if demo mode or key not set
  if (!apiKey || apiKey.toLowerCase() === 'demo' || apiKey.toLowerCase() === 'mock') {
    const fallbackData = generateFallbackQuestion({
      interviewType,
      targetRole,
      experienceLevel,
      difficulty,
      language,
      questionNumber,
      totalQuestions,
      userAnswer
    });
    return res.status(200).json(fallbackData);
  }

  // Build System Prompt
  const systemPrompt = `You are a professional, realistic, patient, and encouraging AI Job Interviewer conducting a mock interview for a candidate.

INTERVIEW CONTEXT:
- Interview Type: ${interviewType}
- Target Role: ${targetRole}
- Experience Level: ${experienceLevel}
- Difficulty Level: ${difficulty}
- Selected Language: ${language}
- Current Progress: Question ${questionNumber} of ${totalQuestions}

CORE INTERVIEWER RULES:
1. ASK ONLY ONE QUESTION AT A TIME. Never ask multiple questions in a single response.
2. If this is Question 1:
   - Provide a warm, brief opening greeting (e.g., "Hello! Welcome to your mock interview.") and ask the first question (e.g., introduction and interest in the ${targetRole} role).
   - "acknowledgment" field should be empty or a simple welcome.
3. If Question 2 or higher:
   - Analyze the candidate's previous answer ("userAnswer") internally.
   - Provide a CONCISE (1 sentence max) professional acknowledgment in the "acknowledgment" field (e.g., "That's a good point.", "Thanks for elaborating on that project.", "Understood, handling deadlines is crucial.").
   - Ask the next relevant question or an intelligent follow-up based on what they just explained.
   - DO NOT reveal scores, grades, or long critiques during the interview. Save evaluations for the post-interview report.
   - DO NOT constantly correct grammar or interrupt.
   - Adapt difficulty: if the candidate gives deep answers, increase technical or situational depth; if they struggle, ask a foundational question.
4. LANGUAGE POLICY:
   - Understand English, Hindi, and natural Hinglish seamlessly (e.g. "Maine React use karke frontend banaya tha", "Mujhe coding me algorithms pasand hai").
   - If language is 'Hindi', respond in polite Hindi.
   - If language is 'Hinglish', respond in natural Hinglish/English.
   - If language is 'English', keep your dialogue in clear, professional English.
5. NO REPETITION: Do not repeat questions already asked in previous turns.
6. OUTPUT FORMAT:
   - Output MUST BE strictly valid JSON with no markdown backticks, no markdown fence, and no surrounding text:
{
  "acknowledgment": "Concise 1-sentence acknowledgement of previous answer (empty string if question 1)",
  "question": "The single realistic interview question to ask next",
  "isFollowUp": true or false,
  "tips": "Brief 1-sentence tip on what a hiring manager looks for in this answer"
}`;

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 20000);

  try {
    let rawContent = '';

    // If Gemini key (AQ.* or AIzaSy* or GEMINI_API_KEY)
    if (apiKey.startsWith('AQ.') || apiKey.startsWith('AIzaSy') || process.env.GEMINI_API_KEY) {
      const geminiModel = process.env.AI_MODEL || 'gemini-3.6-flash';

      const contents = [];
      // Include up to last 6 Q&A turns
      const recentHistory = Array.isArray(conversationHistory) ? conversationHistory.slice(-6) : [];
      for (const item of recentHistory) {
        if (item.question) {
          contents.push({ role: 'model', parts: [{ text: item.question }] });
        }
        if (item.answer) {
          contents.push({ role: 'user', parts: [{ text: item.answer }] });
        }
      }

      const promptUserPart = questionNumber === 1
        ? `Please start the mock interview for candidate applying for "${targetRole}" (${interviewType}, ${experienceLevel} level, ${difficulty} difficulty). Ask question 1 of ${totalQuestions}.`
        : `Candidate's answer to question ${questionNumber - 1}: "${userAnswer || 'No answer provided'}". Please provide a 1-sentence acknowledgment and ask question ${questionNumber} of ${totalQuestions}.`;

      contents.push({ role: 'user', parts: [{ text: promptUserPart }] });

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey.trim()}`;

      let geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
            responseMimeType: 'application/json'
          }
        }),
        signal: abortController.signal
      });

      // Model fallback if needed
      if (!geminiRes.ok) {
        const fallbacks = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
        for (const candidate of fallbacks) {
          if (candidate === geminiModel) continue;
          const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${apiKey.trim()}`;
          const resCandidate = await fetch(fallbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
                responseMimeType: 'application/json'
              }
            }),
            signal: abortController.signal
          }).catch(() => null);

          if (resCandidate && resCandidate.ok) {
            geminiRes = resCandidate;
            break;
          }
        }
      }

      if (!geminiRes.ok) {
        throw new Error(`Gemini API returned status ${geminiRes.status}`);
      }

      const geminiData = await geminiRes.json();
      rawContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      // OpenAI / Groq / OpenRouter OpenAI-compatible API
      const baseUrl = (process.env.AI_BASE_URL || (apiKey.startsWith('gsk_') ? 'https://api.groq.com/openai/v1' : 'https://api.openai.com/v1')).replace(/\/+$/, '');
      const model = process.env.AI_MODEL || (apiKey.startsWith('gsk_') ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini');

      const messages = [{ role: 'system', content: systemPrompt }];
      const recentHistory = Array.isArray(conversationHistory) ? conversationHistory.slice(-6) : [];
      for (const item of recentHistory) {
        if (item.question) messages.push({ role: 'assistant', content: item.question });
        if (item.answer) messages.push({ role: 'user', content: item.answer });
      }

      const userText = questionNumber === 1
        ? `Start the mock interview for ${targetRole} (${interviewType}, ${experienceLevel}). Ask Question 1 of ${totalQuestions}.`
        : `Candidate's answer: "${userAnswer || 'No answer'}". Acknowledge and ask question ${questionNumber} of ${totalQuestions}.`;

      messages.push({ role: 'user', content: userText });

      const upstreamRes = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          response_format: { type: 'json_object' }
        }),
        signal: abortController.signal
      });

      if (!upstreamRes.ok) {
        throw new Error(`AI Provider returned status ${upstreamRes.status}`);
      }

      const openAiData = await upstreamRes.json();
      rawContent = openAiData.choices?.[0]?.message?.content || '';
    }

    clearTimeout(timeoutId);

    // Clean markdown code blocks if model wrapped it in ```json
    let cleaned = rawContent.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
    }

    let parsed = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Safe regex extraction if JSON was slightly malformed
      const qMatch = cleaned.match(/"question"\s*:\s*"([^"]+)"/);
      const ackMatch = cleaned.match(/"acknowledgment"\s*:\s*"([^"]+)"/);
      const tipsMatch = cleaned.match(/"tips"\s*:\s*"([^"]+)"/);
      if (qMatch) {
        parsed = {
          question: qMatch[1],
          acknowledgment: ackMatch ? ackMatch[1] : '',
          tips: tipsMatch ? tipsMatch[1] : '',
          isFollowUp: false
        };
      }
    }

    if (!parsed || !parsed.question) {
      throw new Error('AI response did not contain a valid question.');
    }

    return res.status(200).json({
      questionNumber,
      totalQuestions,
      acknowledgment: parsed.acknowledgment || '',
      question: parsed.question,
      isFollowUp: Boolean(parsed.isFollowUp),
      tips: parsed.tips || ''
    });
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('AI Interview generation error, serving intelligent fallback:', err.message);

    // Return deterministic fallback question smoothly
    const fallbackData = generateFallbackQuestion({
      interviewType,
      targetRole,
      experienceLevel,
      difficulty,
      language,
      questionNumber,
      totalQuestions,
      userAnswer
    });
    return res.status(200).json(fallbackData);
  }
}
