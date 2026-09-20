import React from 'react';

export default function VocabDashboard({ progress, totalWordsCount = 80, onTabChange }) {
  const learnedCount = progress.learnedVocab?.length || 0;
  const practicedCount = progress.practicedVocab?.length || 0;
  const masteredCount = progress.masteredVocab?.length || 0;
  const todayCompleted = progress.vocabTodayCompleted || 0;
  const dailyGoal = progress.vocabDailyGoal || 20;
  const streak = progress.vocabStreak || progress.streak || 3;
  const speakingCount = progress.vocabSpeakingCount || 0;

  // Calculate Level (1-5)
  let levelName = 'Level 1: Starter';
  let levelBadge = '🌱';
  if (learnedCount >= 40) {
    levelName = 'Level 5: Advanced Communicator';
    levelBadge = '👑';
  } else if (learnedCount >= 25) {
    levelName = 'Level 4: Fluent Speaker';
    levelBadge = '🚀';
  } else if (learnedCount >= 15) {
    levelName = 'Level 3: Confident Talker';
    levelBadge = '⚡';
  } else if (learnedCount >= 6) {
    levelName = 'Level 2: Active Learner';
    levelBadge = '🔥';
  }

  const goalPercentage = Math.min(100, Math.round((todayCompleted / dailyGoal) * 100));

  return (
    <div className="vocab-dashboard">
      <div className="vocab-dashboard-top">
        <div>
          <div className="vocab-level-chip">
            <span>{levelBadge}</span>
            <span>{levelName}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="vocab-level-chip" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            <span>🔥</span>
            <span>{streak} Day Streak</span>
          </div>
          {onTabChange && (
            <button
              className="speak-action-btn"
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              onClick={() => onTabChange('quiz')}
            >
              ⚡ Quick Quiz
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="vocab-stats-grid">
        <div className="vocab-stat-card">
          <div className="vocab-stat-icon">📚</div>
          <div className="vocab-stat-value">{learnedCount}</div>
          <div className="vocab-stat-label">Words Learned</div>
        </div>

        <div className="vocab-stat-card">
          <div className="vocab-stat-icon">🎙️</div>
          <div className="vocab-stat-value">{practicedCount}</div>
          <div className="vocab-stat-label">Words Practiced</div>
        </div>

        <div className="vocab-stat-card">
          <div className="vocab-stat-icon">⭐</div>
          <div className="vocab-stat-value">{masteredCount}</div>
          <div className="vocab-stat-label">Mastered Words</div>
        </div>

        <div className="vocab-stat-card">
          <div className="vocab-stat-icon">🗣️</div>
          <div className="vocab-stat-value">{speakingCount}</div>
          <div className="vocab-stat-label">Sentences Spoken</div>
        </div>

        <div className="vocab-stat-card">
          <div className="vocab-stat-icon">📖</div>
          <div className="vocab-stat-value">{totalWordsCount}</div>
          <div className="vocab-stat-label">Library Words</div>
        </div>
      </div>

      {/* Daily Goal Meter */}
      <div className="daily-goal-section">
        <div className="daily-goal-header">
          <div className="daily-goal-title">
            <span>🎯 Daily Vocabulary Goal</span>
          </div>
          <div className="daily-goal-counts">
            {todayCompleted} / {dailyGoal} words today ({goalPercentage}%)
          </div>
        </div>
        <div className="daily-goal-track">
          <div className="daily-goal-fill" style={{ width: `${goalPercentage}%` }} />
        </div>
      </div>
    </div>
  );
}
