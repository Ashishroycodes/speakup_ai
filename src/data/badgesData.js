export const BADGES_DATA = [
  {
    id: 'badge-first-practice',
    title: 'First Practice',
    description: 'Complete your first speaking session.',
    icon: '🏅',
    color: 'indigo',
    checkUnlocked: (stats) => (stats.sessionsCount || 0) >= 1
  },
  {
    id: 'badge-3-day-streak',
    title: '3 Day Streak',
    description: 'Maintain consistency for 3 consecutive days.',
    icon: '🔥',
    color: 'amber',
    checkUnlocked: (stats) => (stats.streak || 0) >= 3
  },
  {
    id: 'badge-speaking-beginner',
    title: 'Speaking Beginner',
    description: 'Accumulate at least 60 seconds of live speaking practice.',
    icon: '🎤',
    color: 'emerald',
    checkUnlocked: (stats) => (stats.totalSpeakingTimeSeconds || 0) >= 60
  },
  {
    id: 'badge-vocab-starter',
    title: 'Vocabulary Starter',
    description: 'Master your first new conversational expression.',
    icon: '📚',
    color: 'cyan',
    checkUnlocked: (stats) => (stats.learnedVocab?.length || 0) >= 1
  },
  {
    id: 'badge-challenge-completed',
    title: 'Challenge Completed',
    description: 'Successfully complete a daily 60-second speaking mission.',
    icon: '🎯',
    color: 'rose',
    checkUnlocked: (stats) => (stats.completedChallenges || 0) >= 1
  },
  {
    id: 'badge-assessment-done',
    title: 'Diagnostic Star',
    description: 'Complete the initial communication assessment.',
    icon: '📋',
    color: 'indigo',
    checkUnlocked: (stats) => !!stats.assessmentCompleted
  },
  {
    id: 'badge-first-interview',
    title: 'First Interview',
    description: 'Complete your first AI mock interview session.',
    icon: '💼',
    color: 'cyan',
    checkUnlocked: (stats) => (stats.completedInterviews || 0) >= 1
  },
  {
    id: 'badge-first-roleplay',
    title: 'Real-world Actor',
    description: 'Complete your first real-life AI roleplay dialogue.',
    icon: '🎭',
    color: 'purple',
    checkUnlocked: (stats) => (stats.completedRoleplays || 0) >= 1
  },
  {
    id: 'badge-100-xp',
    title: '100 XP Achiever',
    description: 'Accumulate at least 100 XP through active practice.',
    icon: '⚡',
    color: 'amber',
    checkUnlocked: (stats) => (stats.xp || 0) >= 100
  },
  {
    id: 'badge-5-sessions',
    title: 'Consistent Speaker',
    description: 'Complete 5 speaking practice sessions.',
    icon: '🗣️',
    color: 'emerald',
    checkUnlocked: (stats) => (stats.sessionsCount || 0) >= 5
  },
  {
    id: 'badge-10-sessions',
    title: 'Communication Dedicated',
    description: 'Complete 10 total speaking practice sessions.',
    icon: '🌟',
    color: 'yellow',
    checkUnlocked: (stats) => (stats.sessionsCount || 0) >= 10
  },
  {
    id: 'badge-5-interviews',
    title: 'Interview Veteran',
    description: 'Complete 5 AI mock interviews to master placement preparation.',
    icon: '🏆',
    color: 'indigo',
    checkUnlocked: (stats) => (stats.completedInterviews || 0) >= 5
  },
  {
    id: 'badge-7-day-streak',
    title: 'Weekly Champion',
    description: 'Build and maintain an uninterrupted 7-day practice streak.',
    icon: '🔥',
    color: 'rose',
    checkUnlocked: (stats) => (stats.streak || 0) >= 7
  },
  {
    id: 'badge-100-vocab',
    title: 'Lexicon Master',
    description: 'Learn and add 100 words to your active vocabulary bank.',
    icon: '📖',
    color: 'emerald',
    checkUnlocked: (stats) => (stats.learnedVocab?.length || 0) >= 100
  }
];
