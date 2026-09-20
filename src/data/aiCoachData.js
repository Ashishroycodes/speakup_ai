export const LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇬🇧', tag: 'Global' },
  { id: 'hi', label: 'Hindi', flag: '🇮🇳', tag: 'Native' },
  { id: 'hinglish', label: 'Hinglish', flag: '🔄', tag: 'Bilingual' },
  { id: 'auto', label: 'Auto Detect', flag: '🌐', tag: 'Smart' }
];

export const CONVERSATION_MODES = [
  {
    id: 'casual',
    title: 'Casual Chat',
    icon: 'MessageCircle',
    description: 'Talk naturally about daily life, hobbies, college, friends, and technology.',
    starterPrompt: "Hi! How's your day going so far? What's on your mind today?",
    sampleSuggestions: [
      "Aaj college mein kaafi busy tha.",
      "Tell me about an interesting technology you like.",
      "How can I sound more natural when chatting with friends?"
    ]
  },
  {
    id: 'college',
    title: 'College Life',
    icon: 'GraduationCap',
    description: 'Talk about classes, assignments, group projects, exams and campus experiences.',
    starterPrompt: "Hey there! How are your college classes and assignments going this week?",
    sampleSuggestions: [
      "Kal mera presentation hai, and I'm a little nervous.",
      "How do I ask my professor for an assignment extension politely?",
      "Can we practice introducing a college project?"
    ]
  },
  {
    id: 'interview',
    title: 'Interview Practice',
    icon: 'Briefcase',
    description: 'AI acts as a professional interviewer and asks behavioral and technical questions.',
    starterPrompt: "Welcome to your interview practice! Let's start with a classic question: Could you please tell me about yourself and your background?",
    sampleSuggestions: [
      "I want to practice my answer for 'Tell me about yourself'.",
      "Ask me a question about handling team conflicts.",
      "What are the top 3 qualities interviewers look for in fresh graduates?"
    ]
  },
  {
    id: 'group_discussion',
    title: 'Group Discussion',
    icon: 'Users',
    description: 'AI presents a discussion topic, shares contrasting perspectives, and invites your view.',
    starterPrompt: "Welcome to today's Group Discussion round! Our topic is: 'Is Artificial Intelligence replacing human jobs or creating new creative opportunities?' What is your initial stance?",
    sampleSuggestions: [
      "I believe AI will augment jobs rather than replace humans entirely.",
      "How can I politely interrupt or add points in a live GD?",
      "Can you give me contrasting points on this topic?"
    ]
  },
  {
    id: 'workplace',
    title: 'Workplace',
    icon: 'Building2',
    description: 'Practice professional communication with colleagues, managers, and clients.',
    starterPrompt: "Hello! Imagine we are in a weekly team standup meeting. What project update would you like to share today?",
    sampleSuggestions: [
      "Mujhe ye project complete karne mein thoda problem aa raha hai.",
      "How do I write a professional follow-up email to a client?",
      "Can we practice explaining a delay to a manager tactfully?"
    ]
  },
  {
    id: 'presentation',
    title: 'Presentation Practice',
    icon: 'Presentation',
    description: 'Explain a concept or pitch an idea while AI asks constructive follow-up questions.',
    starterPrompt: "Ready for your presentation practice! Go ahead and pitch your topic or slide outline in 60 seconds.",
    sampleSuggestions: [
      "Today I would like to talk about renewable energy adoption.",
      "How do I begin my presentation with an engaging hook?",
      "Ask me a tough question about my project feasibility."
    ]
  }
];

export const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner', color: 'emerald', dot: '🟢', desc: 'Simple vocabulary & short questions' },
  { id: 'intermediate', label: 'Intermediate', color: 'amber', dot: '🟡', desc: 'Longer discussions & richer expressions' },
  { id: 'advanced', label: 'Advanced', color: 'rose', dot: '🔴', desc: 'Professional nuances, debates & interviews' }
];

export const CONVERSATION_GOALS = [
  'Improve Fluency',
  'Improve Vocabulary',
  'Improve Grammar',
  'Speak More Confidently',
  'Interview Preparation',
  'Daily English Practice'
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'init-1',
    sender: 'ai',
    text: "Hi! How are you today? We can chat in English, Hindi, or Hinglish. What would you like to practice today?",
    timestamp: 'Just now',
    corrections: null
  }
];
