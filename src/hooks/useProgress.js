import { useState, useEffect } from 'react';

const STORAGE_KEY = 'speakup_student_progress_v1';

const INITIAL_PROGRESS = {
  xp: 240,
  streak: 3,
  longestStreak: 5,
  lastPracticeDate: new Date().toISOString().split('T')[0],
  streakDays: {
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: false,
    Sat: false,
    Sun: false
  },
  streakHistory: [],
  sessionsCount: 3,
  totalSpeakingTimeSeconds: 180,
  completedChallenges: 1,
  learnedVocab: ['v-1', 'v-2', 'v-3', 'v-8'],
  savedVocab: ['v-2', 'v-5'],
  practicedVocab: ['v-1', 'v-2'],
  masteredVocab: ['v-1'],
  difficultVocab: ['v-5'],
  weakVocab: ['v-2'],
  vocabNotes: {},
  vocabQuizStats: {
    totalQuestions: 12,
    correctAnswers: 10,
    quizzesCompleted: 2
  },
  vocabSpeakingCount: 4,
  vocabDailyGoal: 20,
  vocabTodayDate: new Date().toISOString().split('T')[0],
  vocabTodayCompleted: 4,
  vocabStreak: 3,
  vocabSpeakingHistory: [],
  spacedRepetition: {},
  overallScore: 78,
  skills: {
    speakingFluency: 80,
    grammar: 70,
    vocabulary: 72,
    clarity: 82
  },
  // Phase 10 Learning Plan & Assessment state
  completedInterviews: 0,
  completedRoleplays: 0,
  assessmentCompleted: false,
  assessmentDate: null,
  assessmentLevel: null,
  assessmentScores: null,
  learningPreferences: {
    goals: ['Speak English confidently', 'Improve fluency'],
    dailyTimeMinutes: 15,
    language: 'English'
  },
  completedPlanTasks: [],
  completedPlanDate: new Date().toISOString().split('T')[0],
  cachedLearningPlan: null
};

// Deterministic Communication Profile Calculator across all practice modules
export function computeCommunicationProfile(progress, interviewHistory = [], roleplayHistory = []) {
  const scores = {};
  
  // 1. Grammar
  const grammarSources = [];
  if (progress?.assessmentScores?.grammar) grammarSources.push(progress.assessmentScores.grammar);
  if ((progress?.sessionsCount || 0) > 0 && progress?.skills?.grammar) grammarSources.push(progress.skills.grammar);
  scores.grammar = grammarSources.length > 0 
    ? Math.round(grammarSources.reduce((a, b) => a + b, 0) / grammarSources.length) 
    : null;

  // 2. Fluency
  const fluencySources = [];
  if (progress?.assessmentScores?.fluency) fluencySources.push(progress.assessmentScores.fluency);
  if ((progress?.sessionsCount || 0) > 0 && progress?.skills?.speakingFluency) fluencySources.push(progress.skills.speakingFluency);
  if (roleplayHistory.length > 0) {
    const rpFluency = roleplayHistory.map((r) => r.scores?.conversationFlow || r.score).filter(Boolean);
    if (rpFluency.length > 0) fluencySources.push(Math.round(rpFluency.reduce((a, b) => a + b, 0) / rpFluency.length));
  }
  scores.fluency = fluencySources.length > 0 
    ? Math.round(fluencySources.reduce((a, b) => a + b, 0) / fluencySources.length) 
    : null;

  // 3. Vocabulary
  const vocabSources = [];
  if (progress?.assessmentScores?.vocabulary) vocabSources.push(progress.assessmentScores.vocabulary);
  if ((progress?.learnedVocab?.length || 0) > 0) {
    const vocabScore = Math.min(96, 62 + Math.round((progress.learnedVocab.length / 25) * 25));
    vocabSources.push(vocabScore);
  } else if ((progress?.sessionsCount || 0) > 0 && progress?.skills?.vocabulary) {
    vocabSources.push(progress.skills.vocabulary);
  }
  scores.vocabulary = vocabSources.length > 0 
    ? Math.round(vocabSources.reduce((a, b) => a + b, 0) / vocabSources.length) 
    : null;

  // 4. Clarity
  const claritySources = [];
  if (progress?.assessmentScores?.clarity) claritySources.push(progress.assessmentScores.clarity);
  if ((progress?.sessionsCount || 0) > 0 && progress?.skills?.clarity) claritySources.push(progress.skills.clarity);
  scores.clarity = claritySources.length > 0 
    ? Math.round(claritySources.reduce((a, b) => a + b, 0) / claritySources.length) 
    : null;

  // 5. Conversation
  const convSources = [];
  if (progress?.assessmentScores?.conversation) convSources.push(progress.assessmentScores.conversation);
  if (roleplayHistory.length > 0) {
    const rpScores = roleplayHistory.map((r) => r.scores?.overallCommunication || r.score).filter(Boolean);
    if (rpScores.length > 0) convSources.push(Math.round(rpScores.reduce((a, b) => a + b, 0) / rpScores.length));
  }
  scores.conversation = convSources.length > 0 
    ? Math.round(convSources.reduce((a, b) => a + b, 0) / convSources.length) 
    : null;

  // 6. Professional Communication
  const profSources = [];
  if (progress?.assessmentScores?.professional) profSources.push(progress.assessmentScores.professional);
  const profRoleplays = roleplayHistory.filter((r) => r.category === 'Workplace' || r.category === 'Job' || r.category === 'Interview');
  if (profRoleplays.length > 0) {
    const pScores = profRoleplays.map((r) => r.scores?.professionalTone || r.score).filter(Boolean);
    if (pScores.length > 0) profSources.push(Math.round(pScores.reduce((a, b) => a + b, 0) / pScores.length));
  }
  scores.professional = profSources.length > 0 
    ? Math.round(profSources.reduce((a, b) => a + b, 0) / profSources.length) 
    : null;

  // 7. Interview Communication
  const interviewSources = [];
  if (progress?.assessmentScores?.interview) interviewSources.push(progress.assessmentScores.interview);
  if (interviewHistory.length > 0) {
    const ivScores = interviewHistory.map((i) => i.score).filter(Boolean);
    if (ivScores.length > 0) interviewSources.push(Math.round(ivScores.reduce((a, b) => a + b, 0) / ivScores.length));
  }
  scores.interview = interviewSources.length > 0 
    ? Math.round(interviewSources.reduce((a, b) => a + b, 0) / interviewSources.length) 
    : null;

  // Determine overall communication level
  const validScores = Object.values(scores).filter((v) => typeof v === 'number');
  let overallAvg = null;
  let level = progress?.assessmentLevel || 'Intermediate';

  if (validScores.length > 0) {
    overallAvg = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
    if (overallAvg < 65) level = 'Beginner';
    else if (overallAvg <= 82) level = 'Intermediate';
    else level = 'Advanced';
  } else if (!progress?.assessmentCompleted && (progress?.sessionsCount || 0) === 0) {
    level = 'Beginner';
  }

  return {
    scores,
    overallAvg,
    level,
    hasEnoughData: validScores.length >= 2,
    validScoreCount: validScores.length
  };
}

export { isDifferentCalendarWeek } from '../utils/streakUtils.js';

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = parsed.vocabTodayDate !== today;
        const isNewPlanDay = parsed.completedPlanDate !== today;

        // Smart streak hydration: check if consecutive streak broke (>1 day missed)
        let hydratedStreak = typeof parsed.streak === 'number' ? parsed.streak : INITIAL_PROGRESS.streak;
        if (parsed.lastPracticeDate) {
          const d1 = new Date(today + 'T00:00:00');
          const d2 = new Date(parsed.lastPracticeDate + 'T00:00:00');
          const daysDiff = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff > 1 && hydratedStreak > 0) {
            hydratedStreak = 0;
          }
        }

        const emptyWeek = {
          Mon: false,
          Tue: false,
          Wed: false,
          Thu: false,
          Fri: false,
          Sat: false,
          Sun: false
        };

        const isNewWeek = parsed.lastPracticeDate ? isDifferentCalendarWeek(today, parsed.lastPracticeDate) : false;

        const hydratedStreakDays = isNewWeek
          ? emptyWeek
          : {
              ...emptyWeek,
              ...(parsed.streakDays || INITIAL_PROGRESS.streakDays)
            };

        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          streak: hydratedStreak,
          longestStreak: typeof parsed.longestStreak === 'number' ? parsed.longestStreak : Math.max(hydratedStreak, 5),
          lastPracticeDate: parsed.lastPracticeDate || INITIAL_PROGRESS.lastPracticeDate,
          streakDays: hydratedStreakDays,
          streakHistory: Array.isArray(parsed.streakHistory) ? parsed.streakHistory : [],
          savedVocab: parsed.savedVocab || INITIAL_PROGRESS.savedVocab,
          practicedVocab: parsed.practicedVocab || INITIAL_PROGRESS.practicedVocab,
          masteredVocab: parsed.masteredVocab || INITIAL_PROGRESS.masteredVocab,
          difficultVocab: parsed.difficultVocab || INITIAL_PROGRESS.difficultVocab,
          vocabNotes: parsed.vocabNotes || {},
          vocabQuizStats: parsed.vocabQuizStats || INITIAL_PROGRESS.vocabQuizStats,
          vocabDailyGoal: parsed.vocabDailyGoal || 20,
          vocabTodayDate: today,
          vocabTodayCompleted: isNewDay ? 0 : (parsed.vocabTodayCompleted ?? 4),
          vocabStreak: parsed.vocabStreak || 3,
          vocabSpeakingHistory: parsed.vocabSpeakingHistory || [],
          spacedRepetition: parsed.spacedRepetition || {},
          // Phase 10 hydration
          completedInterviews: parsed.completedInterviews || 0,
          completedRoleplays: parsed.completedRoleplays || 0,
          assessmentCompleted: parsed.assessmentCompleted || false,
          assessmentDate: parsed.assessmentDate || null,
          assessmentLevel: parsed.assessmentLevel || null,
          assessmentScores: parsed.assessmentScores || null,
          learningPreferences: parsed.learningPreferences || INITIAL_PROGRESS.learningPreferences,
          completedPlanTasks: isNewPlanDay ? [] : (parsed.completedPlanTasks || []),
          completedPlanDate: today,
          cachedLearningPlan: parsed.cachedLearningPlan || null
        };
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return INITIAL_PROGRESS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }, [progress]);

  // Unified helper to accurately calculate consecutive day streak
  const applyPracticeStreak = (prev) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const lastDate = prev.lastPracticeDate;
    const currentStreak = typeof prev.streak === 'number' ? prev.streak : 0;
    const longestStreak = typeof prev.longestStreak === 'number' ? prev.longestStreak : currentStreak;
    const history = Array.isArray(prev.streakHistory) ? [...prev.streakHistory] : [];

    if (!history.includes(todayStr)) {
      history.push(todayStr);
    }

    let newStreak = currentStreak;

    if (!lastDate || currentStreak === 0) {
      newStreak = 1;
    } else {
      const d1 = new Date(todayStr + 'T00:00:00');
      const d2 = new Date(lastDate + 'T00:00:00');
      const diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already practiced today; maintain active streak
        newStreak = Math.max(1, currentStreak);
      } else if (diffDays === 1) {
        // Practiced yesterday, consecutive streak increased!
        newStreak = currentStreak + 1;
      } else {
        // Missed 1+ days, reset to 1
        newStreak = 1;
      }
    }

    const emptyWeek = {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false
    };

    const isNewWeek = lastDate ? isDifferentCalendarWeek(todayStr, lastDate) : false;
    const baseDays = isNewWeek ? emptyWeek : (prev.streakDays || emptyWeek);

    const updatedStreakDays = {
      ...baseDays,
      [todayDay]: true
    };

    const newLongest = Math.max(longestStreak, newStreak);

    return {
      streak: newStreak,
      longestStreak: newLongest,
      lastPracticeDate: todayStr,
      streakDays: updatedStreakDays,
      streakHistory: history
    };
  };

  // Record a completed speaking session
  const recordSpeakingSession = (durationSeconds = 60, _topicTitle = '') => {
    setProgress((prev) => {
      const newSessions = (prev.sessionsCount || 0) + 1;
      const newSeconds = (prev.totalSpeakingTimeSeconds || 0) + durationSeconds;
      const newXp = (prev.xp || 0) + 15;
      const streakUpdates = applyPracticeStreak(prev);
      
      return {
        ...prev,
        ...streakUpdates,
        sessionsCount: newSessions,
        totalSpeakingTimeSeconds: newSeconds,
        xp: newXp
      };
    });
  };

  // Complete a daily challenge (+20 XP)
  const completeChallenge = () => {
    setProgress((prev) => {
      const newChallenges = (prev.completedChallenges || 0) + 1;
      const newXp = (prev.xp || 0) + 20;
      const streakUpdates = applyPracticeStreak(prev);
      
      return {
        ...prev,
        ...streakUpdates,
        completedChallenges: newChallenges,
        xp: newXp
      };
    });
  };

  // Toggle or mark vocab word as learned (+10 XP first time)
  const toggleVocabLearned = (vocabId) => {
    setProgress((prev) => {
      const isAlreadyLearned = (prev.learnedVocab || []).includes(vocabId);
      let updatedList;
      let xpBonus = 0;

      if (isAlreadyLearned) {
        updatedList = prev.learnedVocab.filter((id) => id !== vocabId);
      } else {
        updatedList = [...(prev.learnedVocab || []), vocabId];
        xpBonus = 10;
      }

      const newTodayCompleted = !isAlreadyLearned 
        ? (prev.vocabTodayCompleted || 0) + 1 
        : prev.vocabTodayCompleted;

      return {
        ...prev,
        learnedVocab: updatedList,
        vocabTodayCompleted: newTodayCompleted,
        xp: (prev.xp || 0) + xpBonus
      };
    });
  };

  // Toggle Saved / Bookmarked vocabulary
  const toggleSaveVocab = (vocabId) => {
    setProgress((prev) => {
      const current = prev.savedVocab || [];
      const isSaved = current.includes(vocabId);
      const updated = isSaved ? current.filter((id) => id !== vocabId) : [...current, vocabId];
      return {
        ...prev,
        savedVocab: updated
      };
    });
  };

  // Toggle Difficult / Tricky vocabulary
  const toggleDifficultVocab = (vocabId) => {
    setProgress((prev) => {
      const current = prev.difficultVocab || [];
      const isDifficult = current.includes(vocabId);
      const updated = isDifficult ? current.filter((id) => id !== vocabId) : [...current, vocabId];
      return {
        ...prev,
        difficultVocab: updated
      };
    });
  };

  // Toggle Mastered vocabulary (+20 XP if newly marked)
  const toggleMasteredVocab = (vocabId) => {
    setProgress((prev) => {
      const current = prev.masteredVocab || [];
      const isMastered = current.includes(vocabId);
      const updated = isMastered ? current.filter((id) => id !== vocabId) : [...current, vocabId];
      const xpBonus = !isMastered ? 20 : 0;
      return {
        ...prev,
        masteredVocab: updated,
        xp: (prev.xp || 0) + xpBonus
      };
    });
  };

  // Save personal user note for a word
  const saveVocabNote = (vocabId, noteText) => {
    setProgress((prev) => ({
      ...prev,
      vocabNotes: {
        ...(prev.vocabNotes || {}),
        [vocabId]: noteText
      }
    }));
  };

  // Record a completed Speak-with-Word submission
  const recordVocabSpeaking = ({ vocabId, word, sentence, score = 80, feedback = '', xpEarned = 15 }) => {
    setProgress((prev) => {
      const practiced = prev.practicedVocab || [];
      const updatedPracticed = practiced.includes(vocabId) ? practiced : [...practiced, vocabId];
      
      const mastered = prev.masteredVocab || [];
      const updatedMastered = score >= 85 && !mastered.includes(vocabId)
        ? [...mastered, vocabId]
        : mastered;

      const historyEntry = {
        id: 'vs-' + Date.now(),
        vocabId,
        word,
        sentence,
        score,
        feedback,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      const newHistory = [historyEntry, ...(prev.vocabSpeakingHistory || [])].slice(0, 30);

      return {
        ...prev,
        practicedVocab: updatedPracticed,
        masteredVocab: updatedMastered,
        vocabSpeakingCount: (prev.vocabSpeakingCount || 0) + 1,
        vocabTodayCompleted: (prev.vocabTodayCompleted || 0) + 1,
        vocabSpeakingHistory: newHistory,
        xp: (prev.xp || 0) + xpEarned
      };
    });
  };

  // Record completed Vocab Quiz results
  const recordVocabQuizResult = ({ total = 5, correct = 5, xpEarned = 25 }) => {
    setProgress((prev) => {
      const currentStats = prev.vocabQuizStats || { totalQuestions: 0, correctAnswers: 0, quizzesCompleted: 0 };
      return {
        ...prev,
        vocabQuizStats: {
          totalQuestions: (currentStats.totalQuestions || 0) + total,
          correctAnswers: (currentStats.correctAnswers || 0) + correct,
          quizzesCompleted: (currentStats.quizzesCompleted || 0) + 1
        },
        xp: (prev.xp || 0) + xpEarned
      };
    });
  };

  // Spaced Repetition Review update
  const recordSpacedReview = (vocabId, qualityRating = 'good') => {
    setProgress((prev) => {
      const currentDeck = prev.spacedRepetition || {};
      const currentItem = currentDeck[vocabId] || { level: 0, reviewCount: 0 };
      
      let nextIntervalDays = 1;
      let newLevel = currentItem.level;
      if (qualityRating === 'easy') {
        newLevel = Math.min(5, currentItem.level + 2);
        nextIntervalDays = Math.pow(2, newLevel);
      } else if (qualityRating === 'good') {
        newLevel = Math.min(5, currentItem.level + 1);
        nextIntervalDays = Math.max(1, currentItem.level * 2);
      } else {
        newLevel = Math.max(0, currentItem.level - 1);
        nextIntervalDays = 1;
      }

      const nextReviewDate = new Date(Date.now() + nextIntervalDays * 24 * 60 * 60 * 1000).toISOString();

      return {
        ...prev,
        spacedRepetition: {
          ...currentDeck,
          [vocabId]: {
            level: newLevel,
            reviewCount: (currentItem.reviewCount || 0) + 1,
            lastReviewed: new Date().toISOString(),
            nextReviewDate
          }
        },
        xp: (prev.xp || 0) + 5
      };
    });
  };

  // Record an incorrectly answered vocabulary word -> Moves to Needs Review
  const recordVocabIncorrect = (vocabId) => {
    setProgress((prev) => {
      const currentWeak = prev.weakVocab || [];
      const updatedWeak = currentWeak.includes(vocabId) ? currentWeak : [...currentWeak, vocabId];
      return {
        ...prev,
        weakVocab: updatedWeak
      };
    });
  };

  // Record a correctly answered vocabulary word (+3 XP)
  const recordVocabCorrect = (vocabId) => {
    setProgress((prev) => {
      const currentWeak = prev.weakVocab || [];
      const updatedWeak = currentWeak.filter((id) => id !== vocabId);
      return {
        ...prev,
        weakVocab: updatedWeak,
        xp: (prev.xp || 0) + 3
      };
    });
  };

  // Complete a Vocabulary Challenge (+15 XP, +1 challenge, streak check)
  const completeVocabChallenge = ({ _score = 100, xpEarned = 15 } = {}) => {
    setProgress((prev) => {
      const newChallenges = (prev.completedChallenges || 0) + 1;
      const newXp = (prev.xp || 0) + xpEarned;
      const streakUpdates = applyPracticeStreak(prev);

      return {
        ...prev,
        ...streakUpdates,
        completedChallenges: newChallenges,
        xp: newXp,
        vocabTodayCompleted: (prev.vocabTodayCompleted || 0) + 5
      };
    });
  };

  // Reset streak only (Day 0 / all 7 days unchecked)
  const resetStreak = () => {
    setProgress((prev) => ({
      ...prev,
      streak: 0,
      lastPracticeDate: null,
      streakDays: {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false
      },
      streakHistory: []
    }));
  };

  // Manually advance streak for testing/evaluation
  const advanceStreak = () => {
    setProgress((prev) => {
      const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const newStreak = (prev.streak || 0) + 1;
      const newLongest = Math.max(prev.longestStreak || 0, newStreak);
      const todayStr = new Date().toISOString().split('T')[0];
      const history = Array.isArray(prev.streakHistory) ? [...prev.streakHistory] : [];
      if (!history.includes(todayStr)) history.push(todayStr);

      return {
        ...prev,
        streak: newStreak,
        longestStreak: newLongest,
        lastPracticeDate: todayStr,
        streakDays: {
          ...(prev.streakDays || { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false }),
          [todayDay]: true
        },
        streakHistory: history
      };
    });
  };

  // Reset XP only (0 XP)
  const resetXp = () => {
    setProgress((prev) => ({
      ...prev,
      xp: 0
    }));
  };

  // Phase 6: Interview History state & persistence
  const [interviewHistory, setInterviewHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('speakup_interview_history_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read interview history from localStorage', e);
    }
    return [];
  });

  // Record completed mock interview session
  const recordInterviewSession = (sessionData) => {
    const newEntry = {
      id: 'interview-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      interviewType: sessionData.interviewType || 'HR Interview',
      targetRole: sessionData.targetRole || 'Software Developer',
      experienceLevel: sessionData.experienceLevel || 'Beginner',
      difficulty: sessionData.difficulty || 'Medium',
      score: sessionData.overallScore || 75,
      scores: sessionData.scores || {},
      completedQuestions: sessionData.completedQuestions || 5,
      totalQuestions: sessionData.totalQuestions || 5,
      durationSeconds: sessionData.durationSeconds || 180,
      report: sessionData.report || null,
      qaList: sessionData.qaList || []
    };

    setInterviewHistory((prev) => {
      const updated = [newEntry, ...prev].slice(0, 30);
      try {
        localStorage.setItem('speakup_interview_history_v1', JSON.stringify(updated));
      } catch {
        /* ignore localStorage quota/disabled errors */
      }
      return updated;
    });

    // Update progress state with +50 XP and log session
    setProgress((prev) => {
      const newXp = (prev.xp || 0) + 50;
      const newSessions = (prev.sessionsCount || 0) + 1;
      const newSeconds = (prev.totalSpeakingTimeSeconds || 0) + (sessionData.durationSeconds || 180);
      const newOverall = sessionData.overallScore 
        ? Math.round(((prev.overallScore || 78) * 0.7) + (sessionData.overallScore * 0.3))
        : (prev.overallScore || 78);
      const streakUpdates = applyPracticeStreak(prev);

      return {
        ...prev,
        ...streakUpdates,
        xp: newXp,
        sessionsCount: newSessions,
        totalSpeakingTimeSeconds: newSeconds,
        overallScore: newOverall,
        completedInterviews: (prev.completedInterviews || 0) + 1
      };
    });

    return newEntry;
  };

  const clearInterviewHistory = () => {
    setInterviewHistory([]);
    try {
      localStorage.removeItem('speakup_interview_history_v1');
    } catch {
      /* ignore localStorage quota/disabled errors */
    }
  };

  // Phase 7: Real-Life Roleplay History state & persistence
  const [roleplayHistory, setRoleplayHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('speakup_roleplay_history_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      /* ignore storage read error */
    }
    return [];
  });

  // Record completed roleplay session
  const recordRoleplaySession = (sessionData) => {
    const newEntry = {
      id: 'roleplay-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      scenario: sessionData.scenario || 'Conversation',
      category: sessionData.category || 'College',
      character: sessionData.character || 'Roleplay Partner',
      difficulty: sessionData.difficulty || 'Intermediate',
      language: sessionData.language || 'English',
      goal: sessionData.goal || 'Confidence',
      score: sessionData.scores?.overallCommunication || sessionData.score || 78,
      scores: sessionData.scores || {},
      totalTurns: sessionData.totalTurns || (sessionData.conversationHistory ? sessionData.conversationHistory.length : 4),
      durationSeconds: sessionData.durationSeconds || 120,
      report: sessionData.report || null,
      conversationHistory: sessionData.conversationHistory || []
    };

    setRoleplayHistory((prev) => {
      const updated = [newEntry, ...prev].slice(0, 30);
      try {
        localStorage.setItem('speakup_roleplay_history_v1', JSON.stringify(updated));
      } catch {
        /* ignore storage error */
      }
      return updated;
    });

    // Update progress state with +40 XP and log session
    setProgress((prev) => {
      const newXp = (prev.xp || 0) + 40;
      const newSessions = (prev.sessionsCount || 0) + 1;
      const newSeconds = (prev.totalSpeakingTimeSeconds || 0) + (sessionData.durationSeconds || 120);
      const sessionScore = sessionData.scores?.overallCommunication || sessionData.score || 78;
      const newOverall = sessionScore
        ? Math.round(((prev.overallScore || 78) * 0.7) + (sessionScore * 0.3))
        : (prev.overallScore || 78);
      const streakUpdates = applyPracticeStreak(prev);

      return {
        ...prev,
        ...streakUpdates,
        xp: newXp,
        sessionsCount: newSessions,
        totalSpeakingTimeSeconds: newSeconds,
        overallScore: newOverall,
        completedRoleplays: (prev.completedRoleplays || 0) + 1
      };
    });

    return newEntry;
  };

  const clearRoleplayHistory = () => {
    setRoleplayHistory([]);
    try {
      localStorage.removeItem('speakup_roleplay_history_v1');
    } catch {
      /* ignore storage error */
    }
  };

  // Phase 8: Presentation Challenge History state & persistence
  const [presentationHistory, setPresentationHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('speakup_presentation_history_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      /* ignore storage error */
    }
    return [];
  });

  // Record completed presentation challenge (+30 XP, +1 challenge, streak update)
  const recordPresentationChallenge = (sessionData) => {
    const scores = sessionData.scores || {};
    const newEntry = {
      id: 'pres-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      topic: sessionData.topic || 'Presentation Challenge',
      category: sessionData.category || 'Technology',
      difficulty: sessionData.difficulty || 'Intermediate',
      score: sessionData.overallScore || 80,
      scores,
      grammarScore: scores.grammar || 80,
      fluencyScore: scores.fluency || 78,
      vocabularyScore: scores.vocabulary || 75,
      clarityScore: scores.clarity || 80,
      structureScore: scores.structure || 80,
      relevanceScore: scores.relevance || 85,
      durationSeconds: sessionData.durationSeconds || 120,
      completionStatus: 'completed',
      report: sessionData.report || null
    };

    setPresentationHistory((prev) => {
      const updated = [newEntry, ...prev].slice(0, 30);
      try {
        localStorage.setItem('speakup_presentation_history_v1', JSON.stringify(updated));
      } catch {
        /* ignore storage error */
      }
      return updated;
    });

    // Update progress state with +30 XP, mark challenge complete, and log streak
    setProgress((prev) => {
      const newXp = (prev.xp || 0) + 30;
      const newChallenges = (prev.completedChallenges || 0) + 1;
      const newSessions = (prev.sessionsCount || 0) + 1;
      const presentationScore = sessionData.overallScore || 80;
      const newOverall = presentationScore
        ? Math.round(((prev.overallScore || 78) * 0.7) + (presentationScore * 0.3))
        : (prev.overallScore || 78);
      const streakUpdates = applyPracticeStreak(prev);

      return {
        ...prev,
        ...streakUpdates,
        xp: newXp,
        completedChallenges: newChallenges,
        sessionsCount: newSessions,
        totalSpeakingTimeSeconds: newSeconds,
        overallScore: newOverall
      };
    });

    return newEntry;
  };

  const clearPresentationHistory = () => {
    setPresentationHistory([]);
    try {
      localStorage.removeItem('speakup_presentation_history_v1');
    } catch {
      /* ignore storage error */
    }
  };

  // Phase 10: Save initial assessment diagnostic results (+50 XP)
  const saveAssessmentResult = ({ level = 'Intermediate', scores = {}, answers = [] }) => {
    setProgress((prev) => {
      const newXp = (prev.xp || 0) + 50;
      const updatedSkills = {
        speakingFluency: scores.fluency || prev.skills?.speakingFluency || 75,
        grammar: scores.grammar || prev.skills?.grammar || 70,
        vocabulary: scores.vocabulary || prev.skills?.vocabulary || 70,
        clarity: scores.clarity || prev.skills?.clarity || 75
      };

      const validValues = Object.values(scores).filter((v) => typeof v === 'number');
      const calculatedOverall = validValues.length > 0
        ? Math.round(validValues.reduce((a, b) => a + b, 0) / validValues.length)
        : prev.overallScore;

      return {
        ...prev,
        xp: newXp,
        overallScore: calculatedOverall,
        skills: updatedSkills,
        assessmentCompleted: true,
        assessmentDate: new Date().toISOString(),
        assessmentLevel: level,
        assessmentScores: scores,
        assessmentAnswers: answers
      };
    });
  };

  // Phase 10: Save learning goals and time preference
  const saveLearningPreferences = (newPrefs) => {
    setProgress((prev) => ({
      ...prev,
      learningPreferences: {
        ...(prev.learningPreferences || INITIAL_PROGRESS.learningPreferences),
        ...newPrefs
      }
    }));
  };

  // Phase 10: Mark a personalized daily task completed (+XP & daily streak count)
  const completePlanTask = (taskId, xpReward = 20) => {
    setProgress((prev) => {
      const currentList = prev.completedPlanTasks || [];
      if (currentList.includes(taskId)) return prev;

      const updatedTasks = [...currentList, taskId];
      const newXp = (prev.xp || 0) + xpReward;
      const streakUpdates = applyPracticeStreak(prev);

      return {
        ...prev,
        ...streakUpdates,
        completedPlanTasks: updatedTasks,
        xp: newXp
      };
    });
  };

  // Phase 10: Cache learning plan object
  const saveCachedLearningPlan = (plan) => {
    setProgress((prev) => ({
      ...prev,
      cachedLearningPlan: plan
    }));
  };

  // Phase 11: Record a gamified practice checkpoint task (+XP, streak update, speaking count)
  const recordGamifiedTask = (taskId, xpReward = 20, taskType = 'speak', durationSeconds = 30) => {
    setProgress((prev) => {
      const newXp = (prev.xp || 0) + xpReward;
      const isSpeakingTask = taskType === 'speak' || taskType === 'boss';
      const newSessions = isSpeakingTask ? (prev.sessionsCount || 0) + 1 : (prev.sessionsCount || 0);
      const newSpeakingSeconds = isSpeakingTask 
        ? (prev.totalSpeakingTimeSeconds || 0) + durationSeconds 
        : (prev.totalSpeakingTimeSeconds || 0);
      const newChallenges = (prev.completedChallenges || 0) + 1;
      const streakUpdates = applyPracticeStreak(prev);

      return {
        ...prev,
        ...streakUpdates,
        xp: newXp,
        sessionsCount: newSessions,
        totalSpeakingTimeSeconds: newSpeakingSeconds,
        completedChallenges: newChallenges
      };
    });
  };

  // Reset progress for testing
  const resetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROGRESS));
      localStorage.removeItem('speakup_interview_history_v1');
      localStorage.removeItem('speakup_roleplay_history_v1');
      localStorage.removeItem('speakup_presentation_history_v1');
      localStorage.removeItem('speakup_gamified_tasks_today_v1');
      localStorage.removeItem('speakup_gamified_unlocked_v1');
    } catch {
      /* ignore localStorage quota/disabled errors */
    }
    setInterviewHistory([]);
    setRoleplayHistory([]);
    setPresentationHistory([]);
  };

  return {
    progress,
    interviewHistory,
    roleplayHistory,
    presentationHistory,
    recordSpeakingSession,
    completeChallenge,
    recordPresentationChallenge,
    clearPresentationHistory,
    toggleVocabLearned,
    toggleSaveVocab,
    toggleDifficultVocab,
    toggleMasteredVocab,
    saveVocabNote,
    recordVocabSpeaking,
    recordVocabQuizResult,
    recordSpacedReview,
    recordVocabIncorrect,
    recordVocabCorrect,
    completeVocabChallenge,
    recordInterviewSession,
    clearInterviewHistory,
    recordRoleplaySession,
    clearRoleplayHistory,
    resetStreak,
    advanceStreak,
    resetXp,
    resetProgress,
    saveAssessmentResult,
    saveLearningPreferences,
    completePlanTask,
    saveCachedLearningPlan,
    recordGamifiedTask
  };
}

