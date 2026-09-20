/**
 * SpeakUp - Phase 8: Presentation Coach Topics & Categories Dataset
 *
 * Categories:
 * - College
 * - Technology
 * - Career
 * - Daily Life
 * - Social Topics
 * - General Knowledge
 * - Interview
 * - Professional
 *
 * Difficulty Tiers:
 * - Beginner: Simple everyday topics & familiar concepts
 * - Intermediate: College, practical tech, and career scenarios
 * - Advanced: Professional, leadership, and abstract reasoning topics
 */

export const PRESENTATION_CATEGORIES = [
  { id: 'technology', label: 'Technology', icon: 'Cpu', badge: '💻 Technology' },
  { id: 'college', label: 'College', icon: 'GraduationCap', badge: '🎓 College' },
  { id: 'career', label: 'Career', icon: 'Briefcase', badge: '💼 Career' },
  { id: 'daily_life', label: 'Daily Life', icon: 'Sun', badge: '☀️ Daily Life' },
  { id: 'social_topics', label: 'Social Topics', icon: 'Users', badge: '👥 Social Topics' },
  { id: 'general_knowledge', label: 'General Knowledge', icon: 'Globe', badge: '🌍 General Knowledge' },
  { id: 'interview', label: 'Interview', icon: 'UserCheck', badge: '🎯 Interview' },
  { id: 'professional', label: 'Professional', icon: 'Award', badge: '👔 Professional' }
];

export const PRESENTATION_TOPICS = [
  // 1. TECHNOLOGY
  {
    id: 'tech-1',
    title: 'Explain Your Favorite Technology',
    category: 'technology',
    difficulty: 'Intermediate',
    prompt: 'Give a 2-minute presentation explaining a technology you love (e.g., smartphones, AI, cloud computing, or electric cars) and why it matters.',
    goal: 'Explain the core features, real-world utility, and personal impact clearly and persuasively.',
    suggestedStructure: [
      '1. Introduction & Hook: What is this technology?',
      '2. Core Value: 2-3 key benefits or problems it solves',
      '3. Conclusion: The future impact or your final takeaway'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'tech-2',
    title: 'Why Should Students Learn Coding?',
    category: 'technology',
    difficulty: 'Beginner',
    prompt: 'Share your perspective on why computer programming and logical thinking are valuable skills for young learners today.',
    goal: 'Present a motivating argument with relatable examples of problem-solving.',
    suggestedStructure: [
      '1. The modern digital world we interact with',
      '2. How coding teaches problem-solving and creativity',
      '3. Encouragement for anyone to start small'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'tech-3',
    title: 'Explain Artificial Intelligence to a 10-Year-Old',
    category: 'technology',
    difficulty: 'Intermediate',
    prompt: 'Explain what Artificial Intelligence actually is using simple analogies, without jargon, so a child can understand.',
    goal: 'Demonstrate conceptual simplicity, storytelling, and avoiding heavy technical jargon.',
    suggestedStructure: [
      '1. A relatable analogy (e.g., a smart robot assistant or recommendation box)',
      '2. How computers learn from examples like humans do',
      '3. Exciting and safe ways AI helps us today'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'tech-4',
    title: 'Explain Your Favorite Smartphone App',
    category: 'technology',
    difficulty: 'Beginner',
    prompt: 'Walk through your most-used mobile app, describing what it does, why you chose it, and how it simplifies your daily routine.',
    goal: 'Practice casual, articulate presentation of everyday software.',
    suggestedStructure: [
      '1. App name and primary purpose',
      '2. Standout feature that saves you time or entertains you',
      '3. Recommendation to others with a quick summary'
    ],
    defaultDurationMinutes: 1
  },
  {
    id: 'tech-5',
    title: 'The Balance Between Privacy and Digital Convenience',
    category: 'technology',
    difficulty: 'Advanced',
    prompt: 'Analyze the trade-offs between free digital services and personal data privacy in today\'s algorithm-driven web.',
    goal: 'Articulate nuanced arguments, balanced viewpoints, and structured recommendations.',
    suggestedStructure: [
      '1. The convenience explosion (personalized feeds, instant recommendations)',
      '2. The hidden cost of user tracking and data vulnerability',
      '3. Practical steps for healthy digital hygiene'
    ],
    defaultDurationMinutes: 3
  },

  // 2. COLLEGE
  {
    id: 'college-1',
    title: 'Introduce Your College Project',
    category: 'college',
    difficulty: 'Intermediate',
    prompt: 'Pitch your final-year or semester college project to a panel of mentors or prospective recruiters.',
    goal: 'Deliver a structured project overview highlighting the problem, technical stack, and results.',
    suggestedStructure: [
      '1. Problem statement: Why does this problem need solving?',
      '2. Proposed solution: Architecture & technologies employed',
      '3. Outcomes, metrics, and key learnings'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'college-2',
    title: 'Explain Your College Major or Degree',
    category: 'college',
    difficulty: 'Beginner',
    prompt: 'Explain what you are studying in college, why you chose this field, and what subjects excite you most.',
    goal: 'Build enthusiasm, clear vocal pacing, and professional pride in your educational journey.',
    suggestedStructure: [
      '1. Major name and core discipline',
      '2. Personal inspiration for selecting this path',
      '3. Future applications in the real world'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'college-3',
    title: 'How Online Education is Transforming Higher Studies',
    category: 'college',
    difficulty: 'Intermediate',
    prompt: 'Present your thoughts on digital classrooms, MOOCs, and self-paced learning versus traditional university lectures.',
    goal: 'Present comparative points clearly with supporting arguments and personal observation.',
    suggestedStructure: [
      '1. The democratization of global knowledge',
      '2. Challenges of discipline, networking, and hands-on labs',
      '3. The ideal hybrid model for 21st-century universities'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'college-4',
    title: 'Should Internships Be Mandatory in College?',
    category: 'college',
    difficulty: 'Intermediate',
    prompt: 'Deliver a persuasive speech advocating for or against mandatory industry internships before graduation.',
    goal: 'Practice persuasive speaking, rhetorical flow, and practical evidence.',
    suggestedStructure: [
      '1. The gap between theory and workplace realities',
      '2. Benefits of hands-on workplace exposure',
      '3. Call to action for university curriculum designers'
    ],
    defaultDurationMinutes: 2
  },

  // 3. CAREER
  {
    id: 'career-1',
    title: 'Talk About Your Career Goal',
    category: 'career',
    difficulty: 'Beginner',
    prompt: 'Describe where you see yourself in 3 to 5 years, the role you wish to hold, and how you are actively preparing today.',
    goal: 'Articulate an authentic, clear professional trajectory with measurable milestones.',
    suggestedStructure: [
      '1. Target role and primary domain',
      '2. Motivations and passion behind this direction',
      '3. Current skill-building actions and roadmap'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'career-2',
    title: 'Why Continuous Learning is Essential in Modern Careers',
    category: 'career',
    difficulty: 'Intermediate',
    prompt: 'Discuss why lifelong upskilling is no longer optional in an era of rapid AI and market changes.',
    goal: 'Present strategic reasoning with actionable examples of upskilling.',
    suggestedStructure: [
      '1. The fast-decaying shelf-life of technical skills',
      '2. Building a mindset of curiosity and adaptable experimentation',
      '3. Practical daily micro-learning habits'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'career-3',
    title: 'Navigating Career Transitions in a Changing Job Market',
    category: 'career',
    difficulty: 'Advanced',
    prompt: 'Deliver advice on how professionals can pivot to new industries or emerging technologies without starting from scratch.',
    goal: 'Deliver executive-level advice with transferable skill frameworks.',
    suggestedStructure: [
      '1. Identifying transferable strengths (communication, problem-solving)',
      '2. Strategic networking and proof-of-work portfolios',
      '3. Managing fear and imposter syndrome during transition'
    ],
    defaultDurationMinutes: 3
  },

  // 4. DAILY LIFE
  {
    id: 'daily-1',
    title: 'Explain Your Daily Routine',
    category: 'daily_life',
    difficulty: 'Beginner',
    prompt: 'Walk listeners through a typical productive day in your life from morning to evening.',
    goal: 'Practice smooth chronological transitions (first, then, afterward, finally).',
    suggestedStructure: [
      '1. Morning kickoff and breakfast habits',
      '2. Work, study, or practice focus blocks',
      '3. Evening wind-down and reflection'
    ],
    defaultDurationMinutes: 1
  },
  {
    id: 'daily-2',
    title: 'Describe a Habit That Changed Your Life',
    category: 'daily_life',
    difficulty: 'Beginner',
    prompt: 'Share one small daily habit (e.g., reading, journaling, exercise, or waking early) that brought significant positive change.',
    goal: 'Tell a personal transformation story with before-and-after contrast.',
    suggestedStructure: [
      '1. The struggle before adopting the habit',
      '2. How you started and stayed consistent',
      '3. The compounding positive results you see today'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'daily-3',
    title: 'The Art of Mindful Disconnection from Screens',
    category: 'daily_life',
    difficulty: 'Intermediate',
    prompt: 'Discuss why setting digital boundaries is vital for mental focus, sleep quality, and genuine presence.',
    goal: 'Present a thoughtful, calm, and grounded personal reflection.',
    suggestedStructure: [
      '1. The constant ping of notifications and fragmented attention',
      '2. What happens when we take intentional screen-free breaks',
      '3. One simple rule to protect personal time every day'
    ],
    defaultDurationMinutes: 2
  },

  // 5. SOCIAL TOPICS
  {
    id: 'social-1',
    title: 'How Social Media Affects Human Relationships',
    category: 'social_topics',
    difficulty: 'Intermediate',
    prompt: 'Analyze both the positive connections and negative isolates fostered by modern social networking platforms.',
    goal: 'Maintain balance, empathy, and objective clarity across both sides of an issue.',
    suggestedStructure: [
      '1. Positive reach: global connection and finding like-minded peers',
      '2. Negative pitfalls: comparison trap and superficial interactions',
      '3. Fostering authentic, deeper real-world bonds'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'social-2',
    title: 'Why Financial Literacy Should Be Taught in Schools',
    category: 'social_topics',
    difficulty: 'Intermediate',
    prompt: 'Make a compelling case for teaching budgeting, investing, and debt management to high school and college students.',
    goal: 'Construct a persuasive argument centered on real-world youth challenges.',
    suggestedStructure: [
      '1. The real-world shock young graduates face with money',
      '2. Fundamental concepts everyone should understand early',
      '3. The long-term societal benefits of financially sound citizens'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'social-3',
    title: 'The Power of Empathy in Divided Communities',
    category: 'social_topics',
    difficulty: 'Advanced',
    prompt: 'Speak on how active listening and empathetic dialogue can bridge ideological and cultural divides in modern society.',
    goal: 'Deliver a moving, high-impact speech with emotional resonance and clarity.',
    suggestedStructure: [
      '1. The danger of echo chambers and snap judgments',
      '2. Empathy as an active skill, not just passive feeling',
      '3. A call to listen before attempting to be understood'
    ],
    defaultDurationMinutes: 3
  },

  // 6. GENERAL KNOWLEDGE
  {
    id: 'gk-1',
    title: 'Why Reading Books is a Superpower for the Brain',
    category: 'general_knowledge',
    difficulty: 'Beginner',
    prompt: 'Explain the cognitive and emotional benefits of reading books compared to skimming quick social media posts.',
    goal: 'Practice structured persuasion and evocative descriptive vocabulary.',
    suggestedStructure: [
      '1. The depth of focus and concentration reading requires',
      '2. Expanding vocabulary and understanding other viewpoints',
      '3. A gentle challenge to read 15 minutes every night'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'gk-2',
    title: 'How Renewable Energy Can Power Future Cities',
    category: 'general_knowledge',
    difficulty: 'Intermediate',
    prompt: 'Present an informative overview of solar, wind, and battery technology transforming municipal power grids.',
    goal: 'Deliver informative, evidence-oriented speech with crisp technical transitions.',
    suggestedStructure: [
      '1. The urgency of transitioning away from fossil fuels',
      '2. Advances in solar efficiency and grid battery storage',
      '3. The vision of self-sustaining, clean smart cities'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'gk-3',
    title: 'The Wonders and Mysteries of Deep Space Exploration',
    category: 'general_knowledge',
    difficulty: 'Advanced',
    prompt: 'Speak about humanity\'s quest into the cosmos—from the James Webb telescope to crewed missions to Mars.',
    goal: 'Deliver an inspiring keynote-style presentation filled with wonder and clear scientific milestones.',
    suggestedStructure: [
      '1. The ancient human urge to look at the stars and explore',
      '2. Landmark achievements of modern telescopes and rovers',
      '3. What space science teaches us about preserving Earth'
    ],
    defaultDurationMinutes: 3
  },

  // 7. INTERVIEW
  {
    id: 'interview-1',
    title: 'Introduce Yourself (The 2-Minute Elevator Pitch)',
    category: 'interview',
    difficulty: 'Intermediate',
    prompt: 'Deliver a crisp, professional 2-minute self-introduction suitable for a hiring manager or executive interview.',
    goal: 'Master the classic Present -> Past -> Future structure without rambling.',
    suggestedStructure: [
      '1. Present: Who you are, your current role/degree, and core focus',
      '2. Past: Key achievements or projects that prove your capability',
      '3. Future: Why this company/role is your ideal next step'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'interview-2',
    title: 'Explain a Problem You Solved Under Pressure',
    category: 'interview',
    difficulty: 'Intermediate',
    prompt: 'Walk through a challenging situation you faced, how you analyzed it, and the successful resolution you achieved.',
    goal: 'Demonstrate structured storytelling using the STAR method (Situation, Task, Action, Result).',
    suggestedStructure: [
      '1. Situation & Task: The urgent dilemma or unexpected hurdle',
      '2. Action: The deliberate, logical steps you took to resolve it',
      '3. Result & Learning: The concrete outcome and key takeaway'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'interview-3',
    title: 'Where Do You See Yourself Adding Value in 3 Years?',
    category: 'interview',
    difficulty: 'Advanced',
    prompt: 'Present a strategic vision of your professional growth and how you plan to contribute to team and business goals.',
    goal: 'Project confidence, ambition, and realistic organizational alignment.',
    suggestedStructure: [
      '1. Mastery of core responsibilities and team workflows',
      '2. Taking ownership of complex problems and mentoring others',
      '3. Driving measurable business or technical outcomes'
    ],
    defaultDurationMinutes: 2
  },

  // 8. PROFESSIONAL
  {
    id: 'prof-1',
    title: 'How to Run Highly Effective Team Meetings',
    category: 'professional',
    difficulty: 'Intermediate',
    prompt: 'Give a concise presentation on leading meetings that start on time, stay focused on an agenda, and produce clear action items.',
    goal: 'Provide practical managerial tips with clean, commanding delivery.',
    suggestedStructure: [
      '1. The cost of poorly structured, aimless meetings',
      '2. The 3 rules: clear agenda, designated timekeeper, and assigned owners',
      '3. Ending with documented next steps and accountability'
    ],
    defaultDurationMinutes: 2
  },
  {
    id: 'prof-2',
    title: 'Delivering Constructive Feedback with Tact',
    category: 'professional',
    difficulty: 'Advanced',
    prompt: 'Present a framework for giving critical feedback to colleagues or juniors in a way that motivates rather than demoralizes.',
    goal: 'Showcase emotional intelligence, communication etiquette, and actionable frameworks.',
    suggestedStructure: [
      '1. Focus on the behavior and impact, never on personal attacks',
      '2. The collaborative feedback loop: listen to their perspective',
      '3. Agreeing together on a measurable improvement pathway'
    ],
    defaultDurationMinutes: 3
  },
  {
    id: 'prof-3',
    title: 'Building a Culture of Innovation in Engineering Teams',
    category: 'professional',
    difficulty: 'Advanced',
    prompt: 'Deliver an executive briefing on how technical leaders can encourage calculated risk-taking and rapid prototyping.',
    goal: 'Project thought leadership with structured business analogies.',
    suggestedStructure: [
      '1. Psychological safety: Embracing fast failure as learning',
      '2. Creating dedicated time for exploration (hackathons, 20% time)',
      '3. Celebrating lessons learned, not just finished wins'
    ],
    defaultDurationMinutes: 3
  }
];

/**
 * Get random topic with optional category and difficulty filtering
 */
export function getRandomPresentationTopic({ category = 'all', difficulty = 'all' } = {}) {
  let filtered = PRESENTATION_TOPICS;

  if (category && category !== 'all') {
    filtered = filtered.filter((t) => t.category === category);
  }

  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter(
      (t) => t.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  if (!filtered.length) {
    filtered = PRESENTATION_TOPICS;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * Find topic by ID with fallback
 */
export function getPresentationTopicById(topicId) {
  return PRESENTATION_TOPICS.find((t) => t.id === topicId) || PRESENTATION_TOPICS[0];
}
