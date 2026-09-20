import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  Award, 
  Mic, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  X, 
  RotateCcw, 
  Zap, 
  Crown,
  Clock,
  ArrowRight
} from 'lucide-react';
import { HUB_VOCABULARY } from '../../data/vocabularyHubData';
import './GamifiedPractice.css';

// Level thresholds based on XP (Requirement 8)
function getGamifiedLevelInfo(xp = 0) {
  if (xp < 150) {
    return {
      level: 1,
      title: 'Starter',
      minXp: 0,
      maxXp: 150,
      currentXp: xp,
      nextLevelXp: 150,
      progressPercent: Math.min(100, Math.round((xp / 150) * 100))
    };
  } else if (xp < 350) {
    return {
      level: 2,
      title: 'Speaker',
      minXp: 150,
      maxXp: 350,
      currentXp: xp,
      nextLevelXp: 350,
      progressPercent: Math.min(100, Math.round(((xp - 150) / 200) * 100))
    };
  } else if (xp < 650) {
    return {
      level: 3,
      title: 'Communicator',
      minXp: 350,
      maxXp: 650,
      currentXp: xp,
      nextLevelXp: 650,
      progressPercent: Math.min(100, Math.round(((xp - 350) / 300) * 100))
    };
  } else if (xp < 1000) {
    return {
      level: 4,
      title: 'Confident Speaker',
      minXp: 650,
      maxXp: 1000,
      currentXp: xp,
      nextLevelXp: 1000,
      progressPercent: Math.min(100, Math.round(((xp - 650) / 350) * 100))
    };
  } else {
    return {
      level: 5,
      title: 'Pro Communicator',
      minXp: 1000,
      maxXp: 1500,
      currentXp: xp,
      nextLevelXp: 1500,
      progressPercent: Math.min(100, Math.round(((xp - 1000) / 500) * 100))
    };
  }
}

// 6 Core Journey Checkpoints (Requirements 2, 3, 10, 15)
const CHECKPOINTS = [
  {
    id: 'cp-speak',
    number: 1,
    title: 'Speak 30s',
    subtitle: 'Spontaneous Speech',
    icon: '💬',
    type: 'speak',
    duration: 30,
    xpReward: 20,
    instruction: 'Introduce yourself or talk about your day continuously for 30 seconds.',
    samplePrompts: [
      'Introduce yourself, your education, and your dream career.',
      'Talk about your college campus and what you love most about it.',
      'Describe what you accomplished today and one thing you look forward to tomorrow.'
    ]
  },
  {
    id: 'cp-words',
    number: 2,
    title: 'Learn 5 Words',
    subtitle: 'Vocabulary Boost',
    icon: '📚',
    type: 'words',
    xpReward: 20,
    instruction: 'Identify the exact meaning of 5 common spoken English expressions.'
  },
  {
    id: 'cp-grammar',
    number: 3,
    title: 'Fix 3 Sentences',
    subtitle: 'Grammar Accuracy',
    icon: '🧠',
    type: 'grammar',
    xpReward: 20,
    instruction: 'Spot and fix 3 high-frequency grammatical mistakes commonly made in spoken English.'
  },
  {
    id: 'cp-fluency',
    number: 4,
    title: 'AI Dialogue',
    subtitle: '3 Conversational Turns',
    icon: '🎤',
    type: 'dialogue',
    xpReward: 20,
    instruction: 'Complete a quick 3-turn spoken or typed exchange with your AI coach.'
  },
  {
    id: 'cp-boss',
    number: 5,
    title: 'Boss Challenge',
    subtitle: '60s Project Pitch',
    icon: '🔥',
    type: 'boss',
    isBoss: true,
    duration: 60,
    xpReward: 50,
    instruction: 'Communication Boss: Deliver a clear 60-second pitch about your project or favorite technology.'
  },
  {
    id: 'cp-finish',
    number: 6,
    title: 'Finish',
    subtitle: 'Journey Victory',
    icon: '🏆',
    type: 'finish',
    xpReward: 30,
    instruction: 'Celebrate your checkpoint achievements and claim the level communicator victory.'
  }
];

// Curated Grammar Tasks for Level 3
const GRAMMAR_TASKS = [
  {
    incorrect: 'She don’t know where the seminar is being held.',
    options: [
      'She doesn’t know where the seminar is being held.',
      'She not know where the seminar is being held.',
      'She didn’t knew where the seminar is being held.'
    ],
    correctIndex: 0,
    explanation: 'Third-person singular subjects (he, she, it) take "does not" or "doesn’t" in the present simple.'
  },
  {
    incorrect: 'I am having two brothers and one elder sister.',
    options: [
      'I am have two brothers and one elder sister.',
      'I have two brothers and one elder sister.',
      'I having two brothers and one elder sister.'
    ],
    correctIndex: 1,
    explanation: '"Have" as a verb expressing possession or family relation is stative and is not used in the continuous (-ing) tense.'
  },
  {
    incorrect: 'We discussed about the final project in the team meeting.',
    options: [
      'We discussed the final project in the team meeting.',
      'We were discussing about the final project in the team meeting.',
      'We discussed on the final project in the team meeting.'
    ],
    correctIndex: 0,
    explanation: 'The verb "discuss" is transitive and directly takes an object. Do not add the preposition "about".'
  }
];

export default function GamifiedPracticeMode({
  progress = {},
  onCompleteTask,
  onSwitchToStandard
}) {
  const currentXp = progress?.xp || 240;
  const levelInfo = useMemo(() => getGamifiedLevelInfo(currentXp), [currentXp]);
  const streak = progress?.streak || 3;

  // Sound toggle (default muted, requirement 18)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  // Active checkpoint & unlocked set persistence
  const [unlockedCheckpoints, setUnlockedCheckpoints] = useState(() => {
    try {
      const saved = localStorage.getItem('speakup_gamified_unlocked_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore */
    }
    return ['cp-speak']; // Start with checkpoint 1 unlocked
  });

  // Track completed task keys for today to prevent duplicate XP (Requirement 7)
  const todayStr = new Date().toISOString().split('T')[0];
  const [todayCompletedTasks, setTodayCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('speakup_gamified_tasks_today_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayStr) {
          return parsed.tasks || [];
        }
      }
    } catch {
      /* ignore */
    }
    return [];
  });

  // Active checkpoint currently focused
  const [activeCheckpointId, setActiveCheckpointId] = useState(() => {
    return unlockedCheckpoints[unlockedCheckpoints.length - 1] || 'cp-speak';
  });

  // Temporary celebration effect for avatar
  const [celebrationEffect, setCelebrationEffect] = useState(null);

  // Active Runner Modal state
  const [activeModalCheckpoint, setActiveModalCheckpoint] = useState(null);
  const [resultCelebration, setResultCelebration] = useState(null);

  // Reference for horizontally scrollable journey track on phone
  const trackRef = useRef(null);

  // Save unlocked checkpoints to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('speakup_gamified_unlocked_v1', JSON.stringify(unlockedCheckpoints));
    } catch {
      /* ignore */
    }
  }, [unlockedCheckpoints]);

  // Save today's completed tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'speakup_gamified_tasks_today_v1',
        JSON.stringify({ date: todayStr, tasks: todayCompletedTasks })
      );
    } catch {
      /* ignore */
    }
  }, [todayCompletedTasks, todayStr]);

  // Gentle Web Audio sound effect synthesizer (Requirement 18: optional, never autoplay)
  const playSoundEffect = (type = 'click') => {
    if (!isSoundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      /* ignore audio context restrictions */
    }
  };

  // Determine active checkpoint index for avatar positioning along the journey track
  const activeCheckpointIndex = Math.max(
    0,
    CHECKPOINTS.findIndex((c) => c.id === activeCheckpointId)
  );

  // Derived avatar state & speech bubble (pure render derivation without setState in effect)
  const currentCheckpoint = CHECKPOINTS.find((c) => c.id === activeCheckpointId);
  const avatarState = celebrationEffect?.state || (
    currentCheckpoint?.isBoss 
      ? 'boss' 
      : currentCheckpoint?.type === 'finish' 
        ? 'celebrating' 
        : 'idle'
  );
  const avatarMessage = celebrationEffect?.message || (
    currentCheckpoint?.isBoss 
      ? 'Defeat the Boss! 🔥' 
      : currentCheckpoint?.type === 'finish' 
        ? 'Level Champion! 🏆' 
        : `Next: ${currentCheckpoint?.title || 'Practice'}! 🚀`
  );

  // On mobile phone screens, smoothly center the active checkpoint along the track
  useEffect(() => {
    if (trackRef.current && typeof window !== 'undefined' && window.innerWidth <= 768) {
      const activeEl = trackRef.current.querySelector('.checkpoint-node-wrapper.active');
      if (activeEl) {
        const offsetLeft = activeEl.offsetLeft;
        const halfWidth = activeEl.offsetWidth / 2;
        const containerHalf = trackRef.current.offsetWidth / 2;
        trackRef.current.scrollTo({
          left: Math.max(0, offsetLeft + halfWidth - containerHalf),
          behavior: 'smooth'
        });
      }
    }
  }, [activeCheckpointId]);

  // AI Personalized Recommendation (Requirement 14)
  const personalizedRecommendation = useMemo(() => {
    const grammarScore = progress?.skills?.grammar || 70;
    const vocabScore = progress?.skills?.vocabulary || 72;
    const fluencyScore = progress?.skills?.speakingFluency || 80;

    if (grammarScore < 75) {
      return {
        tag: 'Grammar Focus',
        title: '🧠 Grammar Boss Challenge Recommended',
        description: `Your grammar accuracy is currently at ${grammarScore}%. Complete the sentence correction challenge today.`,
        targetId: 'cp-grammar'
      };
    } else if (vocabScore < 75) {
      return {
        tag: 'Vocabulary Expansion',
        title: '📚 Vocabulary Challenge Recommended',
        description: `Expand your spoken word pool with 5 high-impact expressions for everyday conversations.`,
        targetId: 'cp-words'
      };
    } else {
      return {
        tag: 'Fluency Sprint',
        title: '🎤 Spoken Fluency Sprint',
        description: `Maintain your speaking momentum (${fluencyScore}% fluency) with a 30-second live speech challenge.`,
        targetId: 'cp-speak'
      };
    }
  }, [progress]);

  // Handle task completion from runner modal
  const handleTaskCompleted = (checkpoint, earnedXp, metrics = {}) => {
    playSoundEffect('success');
    setCelebrationEffect({
      message: `Great job! +${earnedXp} XP 🎉`,
      state: 'celebrating'
    });
    setTimeout(() => setCelebrationEffect(null), 4000);

    // Check if already completed today to prevent duplicate XP (Requirement 7)
    const alreadyCompleted = todayCompletedTasks.includes(checkpoint.id);
    if (!alreadyCompleted) {
      if (onCompleteTask) {
        onCompleteTask(
          checkpoint.id,
          earnedXp,
          checkpoint.type,
          checkpoint.duration || 30
        );
      }
      setTodayCompletedTasks((prev) => [...prev, checkpoint.id]);
    }

    // Unlock next checkpoint
    const currentIndex = CHECKPOINTS.findIndex((c) => c.id === checkpoint.id);
    if (currentIndex >= 0 && currentIndex < CHECKPOINTS.length - 1) {
      const nextCp = CHECKPOINTS[currentIndex + 1];
      if (!unlockedCheckpoints.includes(nextCp.id)) {
        setUnlockedCheckpoints((prev) => [...prev, nextCp.id]);
      }
      setActiveCheckpointId(nextCp.id);
    }

    // Show celebration modal
    setResultCelebration({
      checkpoint,
      earnedXp: alreadyCompleted ? 0 : earnedXp,
      isRepeat: alreadyCompleted,
      metrics
    });
    setActiveModalCheckpoint(null);
  };

  // Launch a checkpoint runner
  const handleStartCheckpoint = (checkpoint) => {
    if (!unlockedCheckpoints.includes(checkpoint.id)) return;
    playSoundEffect('click');
    setActiveCheckpointId(checkpoint.id);
    setActiveModalCheckpoint(checkpoint);
  };

  // Check today's mission progress (Requirement 13)
  const todayMissionItems = [
    { id: 'cp-speak', label: '🎤 Speak — 30s challenge', done: todayCompletedTasks.includes('cp-speak') },
    { id: 'cp-words', label: '📚 Learn — 5 words', done: todayCompletedTasks.includes('cp-words') },
    { id: 'cp-grammar', label: '🧠 Correct — 3 sentences', done: todayCompletedTasks.includes('cp-grammar') },
    { id: 'cp-fluency', label: '💬 Conversation — 3 turns', done: todayCompletedTasks.includes('cp-fluency') },
    { id: 'cp-boss', label: '🎯 Real-life / Boss Challenge', done: todayCompletedTasks.includes('cp-boss') }
  ];
  const completedMissionCount = todayMissionItems.filter((i) => i.done).length;

  // Compute avatar horizontal percentage along path (desktop)
  const avatarLeftPercent = Math.min(
    95,
    Math.max(5, (activeCheckpointIndex / (CHECKPOINTS.length - 1)) * 90 + 5)
  );

  return (
    <div className="gamified-practice-wrapper" id="gamified-practice-container">
      {/* 1. Gamified Stats & Levels Dashboard */}
      <div className="gamified-stats-dashboard">
        {/* Level Card */}
        <div className="gamified-stat-card">
          <div className="stat-card-icon level-icon">
            <Zap size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">
              <span>Game Level</span>
              <span>Lvl {levelInfo.level} / 5</span>
            </div>
            <div className="stat-card-value">Level {levelInfo.level} — {levelInfo.title}</div>
            <div className="gamified-progress-bar">
              <div 
                className="gamified-progress-fill" 
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="level-disclaimer">
              {levelInfo.currentXp} / {levelInfo.nextLevelXp} XP • Game progress based on earned XP
            </div>
          </div>
        </div>

        {/* Total XP Card */}
        <div className="gamified-stat-card">
          <div className="stat-card-icon xp-icon">
            <Award size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Total Practice XP</div>
            <div className="stat-card-value">{currentXp} XP</div>
            <div className="level-disclaimer">Earn XP on each completed communication challenge</div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="gamified-stat-card">
          <div className="stat-card-icon streak-icon">
            <Flame size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Practice Streak</div>
            <div className="stat-card-value">🔥 {streak} Day Streak</div>
            <div className="level-disclaimer">Complete at least 1 task daily to maintain streak</div>
          </div>
        </div>

        {/* Today's Mission Progress */}
        <div className="gamified-stat-card">
          <div className="stat-card-icon mission-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">
              <span>Today's Mission</span>
              <span>{completedMissionCount} / 5</span>
            </div>
            <div className="stat-card-value">{completedMissionCount} / 5 Complete</div>
            <div className="gamified-progress-bar">
              <div 
                className="gamified-progress-fill mission-fill" 
                style={{ width: `${(completedMissionCount / 5) * 100}%` }}
              />
            </div>
            <div className="level-disclaimer">
              {completedMissionCount === 5 ? '🎉 100 XP Bonus unlocked!' : 'Complete all 5 for +100 XP bonus'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Adaptive Recommendation Banner (Requirement 14) */}
      <div className="adaptive-recommendation-banner">
        <div className="adaptive-banner-left">
          <div className="adaptive-banner-badge">
            <Sparkles size={20} />
          </div>
          <div className="adaptive-banner-text">
            <h4>{personalizedRecommendation.title}</h4>
            <p>{personalizedRecommendation.description}</p>
          </div>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            const target = CHECKPOINTS.find((c) => c.id === personalizedRecommendation.targetId);
            if (target) handleStartCheckpoint(target);
          }}
        >
          <span>Practice Focus</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 3. Controls & Mute Toolbar */}
      <div className="journey-controls-strip">
        <div className="strip-left">
          <span className="strip-title">
            <span>🗺️</span>
            <span>Continuous Communication Journey</span>
          </span>
        </div>
        <div className="strip-right">
          <button
            className={`sound-toggle-btn ${isSoundEnabled ? 'sound-on' : ''}`}
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            title={isSoundEnabled ? 'Sound effects enabled' : 'Muted (default)'}
          >
            {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isSoundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onSwitchToStandard}
            title="Switch back to Standard Practice Studio"
          >
            <span>Standard Studio</span>
          </button>
        </div>
      </div>

      {/* 4. Continuous Journey Map & Animated Character Avatar (Requirements 2, 3, 11) */}
      <div className="journey-map-card">
        <div className="journey-track-wrapper" ref={trackRef}>
          {/* Animated Connecting Path Progress Line */}
          <div className="journey-path-line">
            <div 
              className="journey-path-progress" 
              style={{ width: `${(activeCheckpointIndex / (CHECKPOINTS.length - 1)) * 100}%` }}
            />
          </div>

          {/* Continuous Animated Character Avatar */}
          <div 
            className={`character-avatar-container ${avatarState}`}
            style={{ left: `${avatarLeftPercent}%` }}
          >
            <div className="character-speech-bubble">
              {avatarMessage}
            </div>
            {/* SVG Explorer Robot/Character */}
            <svg 
              className="character-body-svg" 
              viewBox="0 0 64 64" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Glow Halo */}
              <circle cx="32" cy="32" r="28" fill="url(#charGrad)" fillOpacity="0.25" />
              {/* Head / Body Sphere */}
              <circle cx="32" cy="32" r="22" fill="url(#charBodyGrad)" stroke="#3b82f6" strokeWidth="2.5" />
              {/* Headphones Antenna */}
              <path d="M12 32 C12 20, 52 20, 52 32" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
              <rect x="9" y="27" width="6" height="10" rx="3" fill="#3b82f6" />
              <rect x="49" y="27" width="6" height="10" rx="3" fill="#3b82f6" />
              {/* Glowing Face Visor */}
              <rect x="20" y="24" width="24" height="14" rx="7" fill="#0f172a" />
              {/* Animated Eyes */}
              <circle cx="27" cy="31" r="2.5" fill="#38bdf8" />
              <circle cx="37" cy="31" r="2.5" fill="#38bdf8" />
              {/* Microphone Boom */}
              <path d="M49 34 Q45 42 36 43" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
              <circle cx="35" cy="43" r="2" fill="#ef4444" />
              <defs>
                <radialGradient id="charGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 32) scale(28)">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="charBodyGrad" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e293b" />
                  <stop offset="1" stopColor="#0f172a" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Checkpoints Row */}
          <div className="journey-checkpoints-row">
            {CHECKPOINTS.map((cp, idx) => {
              const isUnlocked = unlockedCheckpoints.includes(cp.id);
              const isCompleted = todayCompletedTasks.includes(cp.id);
              const isActive = activeCheckpointId === cp.id;

              return (
                <div
                  key={cp.id}
                  className={`checkpoint-node-wrapper ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''} ${cp.isBoss ? 'is-boss' : ''}`}
                  onClick={() => isUnlocked && handleStartCheckpoint(cp)}
                  title={!isUnlocked ? 'Complete previous checkpoints to unlock' : `Click to play: ${cp.title}`}
                >
                  <div className="checkpoint-node">
                    <span className="checkpoint-node-icon">{cp.icon}</span>
                    <span className="checkpoint-node-badge">
                      {isCompleted ? 'Done ✓' : isActive ? 'Active' : !isUnlocked ? 'Locked' : 'Open'}
                    </span>
                  </div>
                  <div className="checkpoint-meta">
                    <div className="checkpoint-title">
                      {idx + 1}. {cp.title}
                    </div>
                    <div className="checkpoint-subtitle">{cp.subtitle}</div>
                    <div className="checkpoint-reward">+{cp.xpReward} XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Today's Mission & Next Challenge Deck (Requirements 4, 12, 13) */}
      <div className="gamified-cards-deck">
        {/* Mission Checklist */}
        <div className="mission-card">
          <div>
            <div className="mission-card-header">
              <h3 className="mission-card-title">
                <span>🎯</span>
                <span>Today's Practice Mission</span>
              </h3>
              <span className="mission-bonus-pill">+100 XP Bonus</span>
            </div>
            <div className="mission-items-list">
              {todayMissionItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`mission-item-row ${item.done ? 'completed' : ''}`}
                >
                  <div className="mission-item-left">
                    <span className="mission-check-circle">
                      {item.done ? '✓' : ''}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-muted">
                    {item.done ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-secondary text-center">
            {completedMissionCount === 5 
              ? '🎉 All 5 missions completed for today!' 
              : `${5 - completedMissionCount} missions remaining today.`}
          </div>
        </div>

        {/* Next Challenge Action Card */}
        <div className="next-challenge-card">
          <div>
            <div className="next-challenge-header">
              <span className="next-challenge-badge">
                Checkpoint {activeCheckpointIndex + 1} of 6
              </span>
              <span className="next-challenge-xp">
                +{CHECKPOINTS[activeCheckpointIndex]?.xpReward || 20} XP
              </span>
            </div>
            <div className="next-challenge-body">
              <h3>{CHECKPOINTS[activeCheckpointIndex]?.title}</h3>
              <p>{CHECKPOINTS[activeCheckpointIndex]?.instruction}</p>
            </div>
          </div>
          <div className="next-challenge-actions">
            <button
              id="start-practice-game-btn"
              className="btn btn-primary btn-lg flex-1"
              onClick={() => handleStartCheckpoint(CHECKPOINTS[activeCheckpointIndex])}
            >
              <Play size={18} fill="currentColor" />
              <span>
                {todayCompletedTasks.includes(CHECKPOINTS[activeCheckpointIndex]?.id) 
                  ? 'Replay Challenge' 
                  : 'Start Practice Game'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Interactive Challenge Runner Modal (Requirements 4, 5, 15) */}
      {activeModalCheckpoint && (
        <ChallengeRunnerModal
          checkpoint={activeModalCheckpoint}
          onClose={() => setActiveModalCheckpoint(null)}
          onComplete={handleTaskCompleted}
          onSoundPlay={playSoundEffect}
        />
      )}

      {/* 7. Celebration / Result Card Modal (Requirement 6) */}
      {resultCelebration && (
        <div className="challenge-modal-backdrop" onClick={() => setResultCelebration(null)}>
          <div className="challenge-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="result-modal-content">
              <div className="celebrate-trophy">
                {resultCelebration.checkpoint.isBoss ? '👑' : '🎉'}
              </div>
              <h2 className="result-heading">
                {resultCelebration.checkpoint.isBoss 
                  ? 'Boss Defeated! 🏆' 
                  : 'Great Job! 🎉'}
              </h2>
              <div className="result-xp-badge">
                +{resultCelebration.earnedXp} XP Earned
              </div>
              <p className="result-message">
                {resultCelebration.isRepeat 
                  ? 'Awesome practice! You already claimed today’s XP for this checkpoint, but your fluency score has been updated.' 
                  : 'You successfully completed this communication checkpoint! Your streak and level progress have moved forward.'}
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setResultCelebration(null)}
              >
                <span>Continue Practice</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// Embedded Challenge Runner Modal Component
// Supports Speaking, Vocabulary, Grammar, AI Dialogue, and Boss Battle
// --------------------------------------------------------------------------
function ChallengeRunnerModal({ checkpoint, onClose, onComplete, onSoundPlay }) {
  const [secondsRemaining, setSecondsRemaining] = useState(checkpoint.duration || 30);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micWarning, setMicWarning] = useState('');

  // Vocabulary Challenge State
  const [vocabIndex, setVocabIndex] = useState(0);
  const [vocabScore, setVocabScore] = useState(0);
  const [vocabFeedback, setVocabFeedback] = useState(null);

  // Sample 5 vocab words from HUB_VOCABULARY
  const [vocabQuestions] = useState(() => {
    const list = (HUB_VOCABULARY && HUB_VOCABULARY.length > 5) 
      ? HUB_VOCABULARY.slice(0, 15) 
      : [];
    const selected = list.slice(0, 5);
    return selected.map((item, index) => {
      // Pick 2 decoy definitions from other words
      const decoys = list.filter((w) => w.id !== item.id).slice(0, 2).map((w) => w.meaning);
      const options = (index % 2 === 0)
        ? [item.meaning, ...decoys]
        : [decoys[0], item.meaning, decoys[1]];
      return {
        word: item.word,
        pronunciation: item.pronunciation,
        hindi: item.hindiMeaning,
        partOfSpeech: item.partOfSpeech,
        options,
        correctMeaning: item.meaning,
        example: item.example
      };
    });
  });

  // Grammar Challenge State
  const [grammarIndex, setGrammarIndex] = useState(0);
  const [grammarScore, setGrammarScore] = useState(0);
  const [grammarFeedback, setGrammarFeedback] = useState(null);

  // AI Dialogue State (3 turns)
  const [dialogueTurns, setDialogueTurns] = useState([
    { role: 'ai', text: 'Hello! I am your AI communication partner. Could you tell me what you enjoyed doing most this week?' }
  ]);
  const [dialogueInput, setDialogueInput] = useState('');

  // Boss Battle State
  const [bossHealth, setBossHealth] = useState(100);

  // Timer & Speech Recognition references
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Speech Recognition initialization
  const isSpeechSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Start Speaking / Timer
  const handleStartSpeaking = () => {
    setIsRecording(true);
    setMicWarning('');

    if (isSpeechSupported) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript + ' ';
          }
          setTranscript(text.trim());
        };

        recognition.onerror = (e) => {
          if (e.error === 'not-allowed') {
            setMicWarning('Microphone access was denied. You can still type in the transcript box below.');
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Recognition start failed', err);
      }
    }
  };

  const handleStopSpeaking = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
  };

  // Timer countdown effect for speaking & boss
  useEffect(() => {
    if (isRecording && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleStopSpeaking();
            clearInterval(timerRef.current);
            return 0;
          }
          // If boss challenge, reduce boss health as user speaks!
          if (checkpoint.isBoss) {
            setBossHealth((b) => Math.max(0, b - (100 / (checkpoint.duration || 60))));
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, secondsRemaining, checkpoint]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
      }
    };
  }, []);

  // Finish speaking challenge
  const handleFinishSpeaking = () => {
    handleStopSpeaking();
    onComplete(checkpoint, checkpoint.xpReward, {
      durationSeconds: (checkpoint.duration || 30) - secondsRemaining,
      wordCount: transcript.split(/\s+/).filter(Boolean).length
    });
  };

  // Vocabulary answer submission
  const handleVocabAnswer = (chosenOption) => {
    const currentQ = vocabQuestions[vocabIndex];
    if (!currentQ) return;
    const isCorrect = chosenOption === currentQ.correctMeaning;
    if (isCorrect) {
      setVocabScore((prev) => prev + 1);
      onSoundPlay('success');
    }
    setVocabFeedback({ isCorrect, explanation: currentQ.example });

    setTimeout(() => {
      setVocabFeedback(null);
      if (vocabIndex + 1 < vocabQuestions.length) {
        setVocabIndex((prev) => prev + 1);
      } else {
        // Finished all 5 questions
        onComplete(checkpoint, checkpoint.xpReward, {
          score: Math.round(((vocabScore + (isCorrect ? 1 : 0)) / 5) * 100)
        });
      }
    }, 1200);
  };

  // Grammar answer submission
  const handleGrammarAnswer = (chosenIndex) => {
    const currentQ = GRAMMAR_TASKS[grammarIndex];
    if (!currentQ) return;
    const isCorrect = chosenIndex === currentQ.correctIndex;
    if (isCorrect) {
      setGrammarScore((prev) => prev + 1);
      onSoundPlay('success');
    }
    setGrammarFeedback({ isCorrect, explanation: currentQ.explanation });

    setTimeout(() => {
      setGrammarFeedback(null);
      if (grammarIndex + 1 < GRAMMAR_TASKS.length) {
        setGrammarIndex((prev) => prev + 1);
      } else {
        // Finished all 3 grammar questions
        onComplete(checkpoint, checkpoint.xpReward, {
          score: Math.round(((grammarScore + (isCorrect ? 1 : 0)) / 3) * 100)
        });
      }
    }, 1600);
  };

  // AI Dialogue turn submission
  const handleDialogueSubmit = () => {
    if (!dialogueInput.trim()) return;
    const userMsg = dialogueInput.trim();
    setDialogueInput('');

    const newTurns = [...dialogueTurns, { role: 'user', text: userMsg }];
    setDialogueTurns(newTurns);

    onSoundPlay('click');

    setTimeout(() => {
      if (newTurns.length >= 6) {
        // Completed 3 dialogue exchanges
        onComplete(checkpoint, checkpoint.xpReward, { dialogueTurns: 3 });
      } else if (newTurns.length === 2) {
        setDialogueTurns((prev) => [
          ...prev,
          { role: 'ai', text: 'That is wonderful! How does that activity help you feel energized or improve your daily routine?' }
        ]);
      } else if (newTurns.length === 4) {
        setDialogueTurns((prev) => [
          ...prev,
          { role: 'ai', text: 'Excellent articulation. What is one personal communication goal you would like to conquer next?' }
        ]);
      }
    }, 900);
  };

  return (
    <div className="challenge-modal-backdrop" onClick={onClose}>
      <div className="challenge-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="challenge-modal-header">
          <div className="challenge-modal-header-left">
            <span className="text-2xl">{checkpoint.icon}</span>
            <div>
              <h3 className="challenge-modal-title">{checkpoint.title}</h3>
              <span className="text-xs text-secondary">{checkpoint.subtitle}</span>
            </div>
            <span className="challenge-modal-reward-badge">
              +{checkpoint.xpReward} XP
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body based on Checkpoint Type */}
        <div className="challenge-modal-content">
          {/* ================= TYPE 1 & 5: SPEAKING OR BOSS CHALLENGE ================= */}
          {(checkpoint.type === 'speak' || checkpoint.type === 'boss') && (
            <>
              {checkpoint.isBoss && (
                <div className="boss-health-card">
                  <div className="boss-health-title">
                    <Crown size={18} />
                    <span>Communication Boss • 60-Second Challenge</span>
                  </div>
                  <div className="boss-health-bar">
                    <div 
                      className="boss-health-fill" 
                      style={{ width: `${bossHealth}%` }}
                    />
                  </div>
                  <div className="text-xs text-secondary mt-1">
                    {bossHealth > 0 ? `Boss Health: ${Math.round(bossHealth)}% • Speak clearly to defeat the boss!` : '🏆 Boss Defeated! Click finish below to claim +50 XP'}
                  </div>
                </div>
              )}

              <div className="modal-prompt-box">
                <div className="modal-prompt-tag">Speaking Prompt</div>
                <h4 className="modal-prompt-text">
                  "{checkpoint.samplePrompts ? checkpoint.samplePrompts[0] : checkpoint.instruction}"
                </h4>
                <p className="modal-prompt-hint">
                  {checkpoint.isBoss 
                    ? 'Speak for 60 seconds. Articulate key technical concepts and examples clearly.' 
                    : 'Speak continuously until the timer reaches zero or click finish when done.'}
                </p>
              </div>

              <div className="modal-speaking-stage">
                <div className="modal-timer-pill">
                  <Clock size={18} />
                  <span>00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}</span>
                </div>

                <button
                  className={`modal-mic-btn ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? handleStopSpeaking : handleStartSpeaking}
                  aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
                  title={isRecording ? 'Click to pause' : 'Click to start microphone'}
                >
                  <Mic size={32} />
                </button>

                <div className="text-xs text-secondary">
                  {isRecording ? '🎙️ Listening & Transcribing live...' : 'Click mic to begin speaking'}
                </div>

                {micWarning && (
                  <div className="text-xs text-warning text-center">{micWarning}</div>
                )}

                <div className="modal-transcript-area">
                  {transcript ? (
                    <span>{transcript}</span>
                  ) : (
                    <span className="modal-transcript-placeholder">
                      Live speech transcript will appear here. You can also click here to type directly...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSecondsRemaining(checkpoint.duration || 30);
                    setTranscript('');
                    setIsRecording(false);
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleFinishSpeaking}
                  disabled={secondsRemaining === (checkpoint.duration || 30) && !transcript}
                >
                  <CheckCircle2 size={16} />
                  <span>Finish & Claim XP</span>
                </button>
              </div>
            </>
          )}

          {/* ================= TYPE 2: VOCABULARY CHALLENGE ================= */}
          {checkpoint.type === 'words' && vocabQuestions.length > 0 && (
            <div className="quiz-question-card">
              <div className="quiz-question-header">
                <span>Question {vocabIndex + 1} of 5</span>
                <span>Score: {vocabScore} / 5</span>
              </div>

              <div className="quiz-question-sentence">
                <div className="text-xs font-bold text-accent-blue uppercase tracking-wider mb-1">
                  {vocabQuestions[vocabIndex]?.partOfSpeech || 'Expression'}
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  "{vocabQuestions[vocabIndex]?.word}"
                </div>
                <div className="text-xs text-secondary">
                  {vocabQuestions[vocabIndex]?.pronunciation} • {vocabQuestions[vocabIndex]?.hindi}
                </div>
              </div>

              <div className="quiz-options-list">
                {vocabQuestions[vocabIndex]?.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`quiz-option-btn ${
                      vocabFeedback 
                        ? opt === vocabQuestions[vocabIndex].correctMeaning 
                          ? 'correct' 
                          : 'incorrect' 
                        : ''
                    }`}
                    onClick={() => !vocabFeedback && handleVocabAnswer(opt)}
                    disabled={!!vocabFeedback}
                  >
                    <span>{opt}</span>
                    {vocabFeedback && opt === vocabQuestions[vocabIndex].correctMeaning && (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>

              {vocabFeedback && (
                <div className="quiz-explanation-box">
                  <strong>Example:</strong> "{vocabQuestions[vocabIndex]?.example}"
                </div>
              )}
            </div>
          )}

          {/* ================= TYPE 3: GRAMMAR CHALLENGE ================= */}
          {checkpoint.type === 'grammar' && (
            <div className="quiz-question-card">
              <div className="quiz-question-header">
                <span>Sentence {grammarIndex + 1} of 3</span>
                <span>Score: {grammarScore} / 3</span>
              </div>

              <div className="quiz-question-sentence">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                  ⚠️ Spot & Fix The Error
                </div>
                <div className="text-lg font-medium text-primary">
                  "{GRAMMAR_TASKS[grammarIndex]?.incorrect}"
                </div>
              </div>

              <div className="quiz-options-list">
                {GRAMMAR_TASKS[grammarIndex]?.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`quiz-option-btn ${
                      grammarFeedback 
                        ? i === GRAMMAR_TASKS[grammarIndex].correctIndex 
                          ? 'correct' 
                          : 'incorrect' 
                        : ''
                    }`}
                    onClick={() => !grammarFeedback && handleGrammarAnswer(i)}
                    disabled={!!grammarFeedback}
                  >
                    <span>{opt}</span>
                    {grammarFeedback && i === GRAMMAR_TASKS[grammarIndex].correctIndex && (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>

              {grammarFeedback && (
                <div className="quiz-explanation-box">
                  <strong>Why:</strong> {grammarFeedback.explanation}
                </div>
              )}
            </div>
          )}

          {/* ================= TYPE 4: AI DIALOGUE CHALLENGE ================= */}
          {checkpoint.type === 'dialogue' && (
            <div className="quiz-question-card">
              <div className="dialogue-thread">
                {dialogueTurns.map((turn, i) => (
                  <div key={i} className={`dialogue-turn ${turn.role === 'user' ? 'user-turn' : ''}`}>
                    <div className="text-xl">{turn.role === 'ai' ? '🤖' : '🗣️'}</div>
                    <div className={`dialogue-bubble ${turn.role}`}>
                      {turn.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Type or speak your conversational answer..."
                  value={dialogueInput}
                  onChange={(e) => setDialogueInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDialogueSubmit()}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleDialogueSubmit}
                  disabled={!dialogueInput.trim()}
                >
                  <span>Send Turn</span>
                </button>
              </div>
              <div className="text-xs text-secondary text-center">
                Exchange 3 conversational turns to complete this fluency checkpoint.
              </div>
            </div>
          )}

          {/* ================= TYPE 6: FINISH VICTORY ================= */}
          {checkpoint.type === 'finish' && (
            <div className="result-modal-content">
              <div className="celebrate-trophy">🏆</div>
              <h3 className="result-heading">Level Champion Circle!</h3>
              <p className="result-message">
                You have reached the end of this communication journey. Claim your completion bonus and celebrate your confidence progress!
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onComplete(checkpoint, checkpoint.xpReward, { finished: true })}
              >
                <span>Claim +30 XP Victory</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
