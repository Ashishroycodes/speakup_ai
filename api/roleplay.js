/**
 * SpeakUp Real-Life AI Roleplay - Dynamic Scenario Engine API
 * 
 * Route: POST /api/roleplay
 * 
 * Capabilities:
 * - Reads AI_API_KEY / GEMINI_API_KEY securely on the server side.
 * - Actively progresses conversations through distinct stages (Context -> Discussion -> Challenge -> Resolution -> Completion).
 * - Solves conversational looping: dynamically drives the dialogue to natural conclusion (5-7 turns) and sets `isCompleted: true`.
 * - Employs Gemini 3.6 Flash via high-performance OpenAI-compatible endpoint with native fallback.
 * - Provides non-intrusive situational hints, model example responses, and lightweight feedback.
 * - Intelligent offline fallback with zero repetition across all 8 scenario categories.
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

// Deterministic intelligent fallback roleplay generator (Zero repetition, full progression)
function generateFallbackRoleplayTurn({
  _scenario = 'Conversation',
  category = 'College',
  _character = 'Conversation Partner',
  difficulty = 'Intermediate',
  language = 'English',
  _goal = 'Fluency',
  turnCount = 1,
  totalExpectedTurns = 6,
  userMessage = ''
}) {
  const isHindi = language === 'Hindi';
  const isHinglish = language === 'Hinglish';
  const lowerMsg = (userMessage || '').toLowerCase();
  const isAdvanced = difficulty === 'Advanced';
  const isCompleted = turnCount >= totalExpectedTurns || turnCount >= 6;

  let reply = '';
  let isChallengeEvent = false;
  let hint = '';
  let exampleResponse = '';
  let quickFeedback = '';
  let detectedSkill = 'Active conversation';

  // Accurate whole-word skill detection (avoid substring false positives)
  if (/\b(hello|hi|hey|namaste|good morning|good afternoon)\b/i.test(lowerMsg)) {
    detectedSkill = 'Greeting';
    quickFeedback = '✓ Natural greeting';
  } else if (/\b(my name is|i am|myself|representing)\b/i.test(lowerMsg)) {
    detectedSkill = 'Introduction';
    quickFeedback = '✓ Clear introduction';
  } else if (/\b(thank|please|kindly|appreciate|grateful|regards)\b/i.test(lowerMsg)) {
    detectedSkill = 'Politeness';
    quickFeedback = '✓ Courteous phrasing';
  } else if (/\b(because|reason|due to|therefore|since)\b/i.test(lowerMsg)) {
    detectedSkill = 'Explaining';
    quickFeedback = '✓ Solid reasoning';
  } else if (/\b(agree|sounds good|deal|settled|concur|aligned)\b/i.test(lowerMsg)) {
    detectedSkill = 'Agreement & Alignment';
    quickFeedback = '✓ Effective alignment';
  } else if (lowerMsg.includes('?') || /\b(could you|would it be|can we|what if)\b/i.test(lowerMsg)) {
    detectedSkill = 'Inquiry & Clarification';
    quickFeedback = '✓ Good inquiry';
  } else {
    quickFeedback = lowerMsg.split(/\s+/).length > 8 ? '✓ Detailed response' : '💡 Elaborate further';
  }

  // Multi-stage progression per category:
  // Turn 1: Initial exploration & clarification
  // Turn 2: Specific deliverables & timelines
  // Turn 3: Challenge, objection, or trade-off
  // Turn 4: Agreement on proposal
  // Turn 5+: Natural completion & celebration

  const cat = (category || '').toLowerCase();

  if (cat.includes('college')) {
    if (turnCount === 1) {
      reply = isHindi
        ? `नमस्ते! यह सुनकर खुशी हुई। क्या आप इस प्रोजेक्ट की शुरुआत में अपनी मुख्य जिम्मेदारियों और प्राथमिकताओं को समझा सकते हैं?`
        : isHinglish
        ? `Hey! Great to coordinate. Is project me aapka main contribution aur timeline planning kya rahegi?`
        : `Thanks for touching base. Could you walk me through your planned responsibilities and timeline for this project?`;
      hint = 'Outline your specific tasks and estimated milestones.';
      exampleResponse = 'I will take responsibility for the core system design and slide draft, aiming to finish by Thursday.';
    } else if (turnCount === 2) {
      reply = isHindi
        ? `समझ गया। डेटाबेस और प्रेजेंटेशन स्लाइड्स को हम टीम के बीच कैसे बांटेंगे ताकि समय पर रिव्यू हो सके?`
        : isHinglish
        ? `Makes sense! Presentation slides aur demo video ka split kaise karein taaki kal sham tak review ho sake?`
        : `That sounds practical. How should we divide the slides and demo rehearsal so we have time to review together?`;
      hint = 'Propose an even distribution of work and a mutual rehearsal time.';
      exampleResponse = 'Let us split the slides evenly: I will cover the architecture and demo, while you handle the problem statement and results.';
    } else if (turnCount === 3) {
      if (isAdvanced) {
        isChallengeEvent = true;
        reply = isHindi
          ? `एक समस्या है: प्रोफेसर ने शुक्रवार को डेडलाइन 24 घंटे पहले यानी कल दोपहर 12 बजे तक कर दी है! क्या हम आज ही सब पूरा कर सकते हैं?`
          : isHinglish
          ? `Wait, professor ne submission deadline 24 hours advance kar di hai! Kya hum aaj night tak draft finalize kar sakte hain?`
          : `There is an unexpected update: the professor moved the deadline up to tomorrow noon! Can we finish the core requirements by tonight?`;
        hint = 'Respond calmly and prioritize the essential items to meet the earlier deadline.';
        exampleResponse = 'We can definitely adapt. Let us focus exclusively on the core requirements and record the demo right after classes.';
      } else {
        reply = isHindi
          ? `यह अच्छा सुझाव है। क्या कोई ऐसा हिस्सा है जहाँ आपको अतिरिक्त मदद या संसाधनों की आवश्यकता है?`
          : isHinglish
          ? `Great suggestion. Kya kisi module me lab resources ya reference papers ki extra help chahiye?`
          : `That sounds balanced. Are there any parts where you feel we might need extra lab hours or professor input?`;
        hint = 'Clarify any blockers or confirm you have everything you need.';
        exampleResponse = 'Everything looks clear on my end. A quick 30-minute sync this evening will ensure we stay on track.';
      }
    } else if (turnCount === 4) {
      reply = isHindi
        ? `उत्कृष्ट! मैं स्लाइड्स का अपना हिस्सा आज रात 9 बजे तक पूरा कर लूँगा। क्या हम कल सुबह 10 बजे फाइनल रिहर्सल करें?`
        : isHinglish
        ? `Superb! Main apna section 9 PM tak update kar dunga. Kal subah 10 AM demo rehearse karein?`
        : `Excellent! I will have my slides ready by 9 PM tonight. Shall we do our final rehearsal tomorrow morning at 10 AM?`;
      hint = 'Confirm the schedule and express readiness to rehearse.';
      exampleResponse = 'Yes, 10 AM tomorrow works perfectly. I will bring the working demo laptop.';
    } else {
      reply = isHindi
        ? `बिल्कुल सही! हमारी योजना पूरी तरह तैयार है। आपसे बात करके बहुत अच्छा लगा—कल मिलते हैं!`
        : isHinglish
        ? `Done deal! Hum completely ready hain. Thanks for coordinating so smoothly—kal milte hain!`
        : `Sounds like a complete plan! We are well aligned and ready to succeed. Great collaborating with you—see you tomorrow!`;
      hint = 'Wrap up with a warm, confident closing.';
      exampleResponse = 'Thank you for your teamwork! Looking forward to delivering an outstanding presentation tomorrow.';
      detectedSkill = 'Closing conversation';
    }
  } else if (cat.includes('workplace') || cat.includes('professional')) {
    if (turnCount === 1) {
      reply = `Thank you for bringing this to my attention. What is the core business objective and timeline for this initiative?`;
      hint = 'State the primary business benefit and key delivery target.';
      exampleResponse = 'Our objective is to reduce onboarding friction by 25% by launching this workflow before Q3.';
    } else if (turnCount === 2) {
      reply = `I see the value. What cross-functional dependencies or engineering bandwidth do we need to coordinate?`;
      hint = 'Mention which teams (e.g. Design, Backend, Security) are required.';
      exampleResponse = 'We will need 2 days of backend API support and a design sign-off, which are already scheduled.';
    } else if (turnCount === 3) {
      if (isAdvanced) {
        isChallengeEvent = true;
        reply = `The executive team just informed us that budget allocation is frozen for this quarter. How can we deliver an MVP without additional spend?`;
        hint = 'Focus on an agile MVP using existing tools and infrastructure.';
        exampleResponse = 'We can build the MVP entirely using our existing components without external tooling or budget increases.';
      } else {
        reply = `What metrics or success criteria will you track to ensure this rollout succeeds?`;
        hint = 'Name 1-2 concrete performance metrics.';
        exampleResponse = 'We will monitor daily active completion rates and customer support ticket frequency over the first two weeks.';
      }
    } else if (turnCount === 4) {
      reply = `That is a pragmatic roadmap. If we approve this today, what is the immediate milestone we will see by next Friday?`;
      hint = 'Commit to a tangible first deliverable.';
      exampleResponse = 'By next Friday, you will have a functional staging prototype and initial usability feedback.';
    } else {
      reply = `You have presented a compelling and realistic plan. You have full leadership support to proceed. Great presentation!`;
      hint = 'Acknowledge the approval professionally and confirm next steps.';
      exampleResponse = 'Thank you for your support and feedback. I will share our sprint kickoff notes by end of day.';
      detectedSkill = 'Closing conversation';
    }
  } else if (cat.includes('interview')) {
    if (turnCount === 1) {
      reply = `Welcome to the discussion! Could you start by highlighting how your background prepared you for this specific challenge?`;
      hint = 'Share relevant skills, project experience, and what excites you about this role.';
      exampleResponse = 'Through hands-on projects and problem solving, I have built practical skills in system design and collaborative delivery.';
    } else if (turnCount === 2) {
      reply = `That is impressive. Could you give me a specific example of when you had to overcome a major technical or team hurdle?`;
      hint = 'Use the STAR method: Situation, Task, Action, Result.';
      exampleResponse = 'When our API latency spiked before launch, I profiled the database queries, added caching, and reduced response time by 40%.';
    } else if (turnCount === 3) {
      if (isAdvanced) {
        isChallengeEvent = true;
        reply = `What if a stakeholder strongly disagrees with your technical recommendation? How do you defend your approach without damaging the relationship?`;
        hint = 'Emphasize data-driven trade-offs, empathetic listening, and pilot testing.';
        exampleResponse = 'I present objective data and benchmark tests, listen to their concerns, and propose a low-risk trial to validate the best path.';
      } else {
        reply = `Where do you see yourself contributing the most value to our team during your first 90 days?`;
        hint = 'Highlight rapid learning, team integration, and shipping early wins.';
        exampleResponse = 'In my first 90 days, I plan to master the codebase, unblock sprint tickets, and contribute to production-grade features.';
      }
    } else if (turnCount === 4) {
      reply = `Your answers demonstrate both technical depth and mature self-awareness. Do you have any questions for me about our culture or expectations?`;
      hint = 'Ask an insightful question about team growth or engineering culture.';
      exampleResponse = 'Could you share how the team fosters mentorship and technical innovation on day-to-day projects?';
    } else {
      reply = `Thank you for such a thoughtful conversation! You communicated with clarity, confidence, and professionalism. We will be in touch soon.`;
      hint = 'Thank the interviewer and express enthusiasm for the opportunity.';
      exampleResponse = 'Thank you for your time and engaging questions. I am very excited about the impact I could make with your team!';
      detectedSkill = 'Closing conversation';
    }
  } else if (cat.includes('customer')) {
    if (turnCount === 1) {
      reply = `Thank you for contacting customer support. I am here to help. Could you please describe what occurred and verify your order or account number?`;
      hint = 'Explain the issue clearly and provide reference details politely.';
      exampleResponse = 'Hello! My order number is #49821, and the package arrived with damaged packaging. I would like an exchange.';
    } else if (turnCount === 2) {
      reply = `I apologize for the inconvenience with your delivery. Let me check our warehouse records. Would you prefer a replacement or a full refund?`;
      hint = 'State your clear preference politely.';
      exampleResponse = 'A replacement would be ideal, as I still need the item for an upcoming event.';
    } else if (turnCount === 3) {
      if (isAdvanced) {
        isChallengeEvent = true;
        reply = `Our standard return policy requires the original box to be in pristine condition. Since the outer box is damaged, the automated system flagged this. How would you like us to proceed?`;
        hint = 'Stay calm, clarify that the carrier caused the damage, and request manual manager review.';
        exampleResponse = 'The package arrived damaged from the carrier before opening. Could you please review the uploaded photos for a manual exception?';
      } else {
        reply = `I have verified the shipment records and photos. I can process your replacement immediately with expedited shipping at no cost. Does that work?`;
        hint = 'Thank the agent and confirm your shipping address.';
        exampleResponse = 'Yes, that works wonderfully! Thank you so much for arranging expedited shipping.';
      }
    } else if (turnCount === 4) {
      reply = `I have confirmed the new tracking ID: EXP-88421. You will receive an email confirmation in 5 minutes. Is there anything else I can assist you with today?`;
      hint = 'Politely confirm that all your needs were met.';
      exampleResponse = 'No, that resolved everything perfectly. Thank you for your fast and courteous help!';
    } else {
      reply = `It was my pleasure to assist you! Thank you for your patience and for being a valued customer. Have a wonderful rest of your day!`;
      hint = 'Conclude with a warm parting greeting.';
      exampleResponse = 'Thank you again! Have a great day ahead.';
      detectedSkill = 'Closing conversation';
    }
  } else {
    // Default Social / Presentation / Group Discussion
    if (turnCount === 1) {
      reply = `Hello! It is great to connect with you on this. What is the main point or perspective you would like to begin with?`;
      hint = 'Introduce your core perspective in 1 or 2 concise sentences.';
      exampleResponse = 'I would love to explore how we can enhance collaborative speaking practice through consistent daily habits.';
    } else if (turnCount === 2) {
      reply = `That is a compelling thought. How do you propose we address differences in background or communication styles?`;
      hint = 'Highlight empathy, active listening, and inclusive dialogue.';
      exampleResponse = 'We can establish open speaking norms where every participant is encouraged to contribute without fear of judgment.';
    } else if (turnCount === 3) {
      if (isAdvanced) {
        isChallengeEvent = true;
        reply = `That sounds great in an ideal setting, but what about high-pressure environments where time is extremely limited?`;
        hint = 'Explain how your approach scales under time constraints.';
        exampleResponse = 'Under tight time limits, structured agendas and concise 60-second contribution caps ensure everyone stays focused.';
      } else {
        reply = `What would be the first tangible takeaway or action item you would recommend for our group?`;
        hint = 'Propose a single clear action item.';
        exampleResponse = 'I recommend each member commit to a 5-minute daily practice session and share weekly reflections.';
      }
    } else if (turnCount === 4) {
      reply = `I completely agree with that direction. It seems we have reached a very solid consensus on how to move forward.`;
      hint = 'Summarize agreement and express appreciation for the fruitful conversation.';
      exampleResponse = 'I appreciate your constructive insights throughout this discussion. It has been a pleasure exchanging ideas.';
    } else {
      reply = `Thank you for such a stimulating conversation! You articulated your thoughts with remarkable poise and clarity. Let's wrap up here—fantastic job!`;
      hint = 'Close the conversation gracefully.';
      exampleResponse = 'Thank you for this wonderful dialogue! I look forward to our next interaction.';
      detectedSkill = 'Closing conversation';
    }
  }

  return {
    reply,
    isChallengeEvent,
    isCompleted,
    stage: isCompleted ? 'Completed' : (turnCount <= 2 ? 'Exploration' : (turnCount <= 4 ? 'Discussion' : 'Resolution')),
    hint,
    exampleResponse,
    quickFeedback,
    detectedSkill
  };
}

export default async function handler(req, res) {
  ensureEnvLoaded();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const {
    scenario = 'Real-Life Conversation',
    category = 'College',
    character = 'Conversation Partner',
    difficulty = 'Intermediate',
    language = 'English',
    goal = 'Confidence',
    conversationHistory = [],
    userMessage = '',
    turnCount: incomingTurnCount,
    totalExpectedTurns = 6
  } = req.body || {};

  // Resolve API Key
  const apiKey = (
    process.env.AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    ''
  ).trim();

  // Compute realistic turn count from incoming property or history length
  const userTurnsCount = Array.isArray(conversationHistory)
    ? conversationHistory.filter(t => t.sender === 'user' || t.role === 'user').length
    : 1;
  const turnCount = typeof incomingTurnCount === 'number' && incomingTurnCount > 0
    ? incomingTurnCount
    : Math.max(1, userTurnsCount);

  const isFinalTurn = turnCount >= totalExpectedTurns;

  // If in demo/mock mode or no key configured, use deterministic progressive engine
  if (!apiKey || apiKey.toLowerCase() === 'demo' || apiKey.toLowerCase() === 'mock') {
    const fallback = generateFallbackRoleplayTurn({
      scenario,
      category,
      character,
      difficulty,
      language,
      goal,
      turnCount,
      totalExpectedTurns,
      userMessage
    });
    return res.status(200).json(fallback);
  }

  // Build System Prompt with explicit Conversation Stage Guidelines
  const systemPrompt = `You are an expert interactive AI Roleplay Actor for "SpeakUp", an advanced communication learning platform for students.

ROLEPLAY SCENARIO CONTEXT:
- Category: ${category}
- Scenario Title: ${scenario}
- Your Assigned AI Character Persona: ${character}
- Student Learning Goal: ${goal}
- Difficulty Level: ${difficulty} (Beginner / Intermediate / Advanced)
- Selected Language: ${language} (English / Hindi / Hinglish)
- Turn Progress: Turn ${turnCount} of ${totalExpectedTurns}
- Stage Directive: ${isFinalTurn ? 'FINAL CONCLUSION: Wrap up the conversation warmly. Do NOT ask another question.' : (turnCount <= 2 ? 'EXPLORATION: Inquire about plans, context, and responsibilities.' : (turnCount <= 4 ? 'ACTIVE DIALOGUE: Discuss details, trade-offs, or realistic challenges.' : 'ALIGNMENT: Move toward resolution and agree on next steps.'))}

CRITICAL CONVERSATION PROGRESSION DIRECTIVES:
1. NEVER REPEAT QUESTIONS OR LOOP THE CONVERSATION. Every turn MUST advance the scenario toward a natural resolution.
2. STAY IN CHARACTER AT ALL TIMES. Speak, react, and emote authentically as "${character}".
3. KEEP REPLIES CONCISE AND NATURAL (1 to 3 sentences maximum).
4. TURN-SPECIFIC INSTRUCTIONS:
   - If Turn ${turnCount} is less than ${totalExpectedTurns}: Ask ONE clear, relevant question or make an actionable statement that moves the discussion forward.
   - If Turn ${turnCount} >= ${totalExpectedTurns} (FINAL TURN): Conclude the conversation warmly! Thank the student, agree on the outcome, set "isCompleted": true, and DO NOT ask another question.
5. ADVANCED DIFFICULTY: If difficulty is "Advanced" and Turn is 3 or 4, you may introduce a realistic obstacle, deadline shift, or objection and set "isChallengeEvent": true.
6. LANGUAGE POLICY:
   - If language is 'Hindi', reply in natural, polite Hindi.
   - If language is 'Hinglish', reply in natural conversational Hinglish/English.
   - If language is 'English', reply in clear, professional English.
7. PROVIDE VALUABLE LEARNING AIDS:
   - "hint": A brief 1-sentence strategic suggestion for how the student can respond effectively in this moment.
   - "exampleResponse": A realistic, polished 1-2 sentence sample answer.
   - "quickFeedback": A concise 2-4 word encouraging observation (e.g. "✓ Decisive response", "✓ Courteous tone", "💡 Add specific details").
   - "detectedSkill": Name one demonstrated communication skill (e.g. "Greeting", "Active listening", "Negotiation", "Time Management", "Politeness", "Explaining", "Closing conversation").

OUTPUT FORMAT:
Return strictly valid JSON with no markdown fences, no backticks, and no extraneous text:
{
  "reply": "Your in-character dialogue to the student",
  "isChallengeEvent": false,
  "isCompleted": ${isFinalTurn ? 'true' : 'false'},
  "hint": "1-sentence strategic guidance",
  "exampleResponse": "1-sentence natural example response",
  "quickFeedback": "✓ Quick observation",
  "detectedSkill": "Skill name"
}`;

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 20000);

  try {
    // Model resolution: prioritize Gemini 3.6 Flash
    const geminiModel = process.env.AI_MODEL || 'gemini-3.6-flash';

    // Format chat history cleanly using OpenAI-compatible structure
    const messages = [{ role: 'system', content: systemPrompt }];

    const recentHistory = Array.isArray(conversationHistory) ? conversationHistory.slice(-8) : [];
    for (const turn of recentHistory) {
      const role = (turn.sender === 'ai' || turn.role === 'assistant' || turn.role === 'model')
        ? 'assistant'
        : 'user';
      const text = turn.text || turn.content || turn.message || '';
      if (text.trim()) {
        messages.push({ role, content: text });
      }
    }

    // Ensure the last message in messages is the current userMessage
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== userMessage) {
      if (userMessage && userMessage.trim()) {
        messages.push({ role: 'user', content: userMessage });
      }
    }

    // Call OpenAI-compatible endpoint first
    let parsed = null;
    const openaiCompatUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

    try {
      const apiRes = await fetch(openaiCompatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: geminiModel,
          messages,
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
      // Proceed to alternate endpoint if needed
    }

    // If OpenAI-compatible endpoint did not succeed, try native endpoint
    if (!parsed) {
      const nativeModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
      for (const modelCandidate of nativeModels) {
        try {
          const nativeUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${apiKey.trim()}`;
          const nativeRes = await fetch(nativeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{
                    text: `${systemPrompt}\n\nStudent's latest response: "${userMessage}".\nReply with strictly JSON.`
                  }]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
                responseMimeType: 'application/json'
              }
            }),
            signal: abortController.signal
          });

          if (nativeRes.ok) {
            const data = await nativeRes.json();
            const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            parsed = JSON.parse(raw.replace(/```json/gi, '').replace(/```/g, '').trim());
            if (parsed && parsed.reply) break;
          }
        } catch {
          // Try next fallback candidate
        }
      }
    }

    clearTimeout(timeoutId);

    if (parsed && parsed.reply) {
      return res.status(200).json({
        reply: parsed.reply,
        isChallengeEvent: Boolean(parsed.isChallengeEvent),
        isCompleted: Boolean(parsed.isCompleted || isFinalTurn),
        stage: isFinalTurn || parsed.isCompleted ? 'Completed' : `Turn ${turnCount} of ${totalExpectedTurns}`,
        hint: parsed.hint || "Share your thoughts directly and keep the conversation collaborative.",
        exampleResponse: parsed.exampleResponse || "I agree with this direction. Let's confirm the next milestone.",
        quickFeedback: parsed.quickFeedback || "✓ Effective answer",
        detectedSkill: parsed.detectedSkill || "Active conversation"
      });
    }

    // Fallback if AI service returned unparsable response
    const fallback = generateFallbackRoleplayTurn({
      scenario,
      category,
      character,
      difficulty,
      language,
      goal,
      turnCount,
      totalExpectedTurns,
      userMessage
    });
    return res.status(200).json(fallback);

  } catch {
    clearTimeout(timeoutId);
    const fallback = generateFallbackRoleplayTurn({
      scenario,
      category,
      character,
      difficulty,
      language,
      goal,
      turnCount,
      totalExpectedTurns,
      userMessage
    });
    return res.status(200).json(fallback);
  }
}
