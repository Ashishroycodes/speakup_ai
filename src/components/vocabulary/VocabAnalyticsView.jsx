import React from 'react';

export default function VocabAnalyticsView({ progress, totalWordsCount = 80 }) {
  const learnedCount = progress.learnedVocab?.length || 0;
  const practicedCount = progress.practicedVocab?.length || 0;
  const masteredCount = progress.masteredVocab?.length || 0;
  const quizStats = progress.vocabQuizStats || { totalQuestions: 0, correctAnswers: 0, quizzesCompleted: 0 };
  const speakingHistory = progress.vocabSpeakingHistory || [];
  const streak = progress.vocabStreak || progress.streak || 3;

  const quizAccuracy = quizStats.totalQuestions > 0
    ? Math.round((quizStats.correctAnswers / quizStats.totalQuestions) * 100)
    : 85;

  const libraryCompletion = Math.round((learnedCount / Math.max(1, totalWordsCount)) * 100);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
          📈 Vocabulary Mastery & Speech Analytics
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Detailed performance breakdown tracking your active vocabulary retention, quiz accuracy, and speech usage.
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="vocab-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '32px' }}>
        <div className="vocab-stat-card">
          <div className="vocab-stat-icon">📊</div>
          <div className="vocab-stat-value">{libraryCompletion}%</div>
          <div className="vocab-stat-label">Library Progress ({learnedCount}/{totalWordsCount})</div>
        </div>

        <div className="vocab-stat-card">
          <div className="vocab-stat-icon">🎯</div>
          <div className="vocab-stat-value">{quizAccuracy}%</div>
          <div className="vocab-stat-label">Quiz Accuracy ({quizStats.correctAnswers}/{quizStats.totalQuestions || 1})</div>
        </div>

        <div className="vocab-stat-card">
          <div className="vocab-stat-icon">👑</div>
          <div className="vocab-stat-value">{masteredCount}</div>
          <div className="vocab-stat-label">Mastered Words</div>
        </div>

        <div className="vocab-stat-card">
          <div className="vocab-stat-icon">🎙️</div>
          <div className="vocab-stat-value">{practicedCount}</div>
          <div className="vocab-stat-label">Words Used in Speech</div>
        </div>

        <div className="vocab-stat-card">
          <div className="vocab-stat-icon">🔥</div>
          <div className="vocab-stat-value">{streak} Days</div>
          <div className="vocab-stat-label">Consecutive Streak</div>
        </div>
      </div>

      {/* Recent Spoken Sentences Feed */}
      <div className="vocab-card" style={{ padding: '24px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
          🗣️ Your Spoken Sentence Practice History
        </h4>

        {speakingHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {speakingHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                      {item.word}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {item.date}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontSize: '0.94rem', fontStyle: 'italic' }}>
                    "{item.sentence}"
                  </p>
                  {item.feedback && (
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      💡 {item.feedback}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    className={`score-badge ${
                      item.score >= 80 ? '' : item.score >= 60 ? 'average' : 'low'
                    }`}
                    style={{ fontSize: '1.4rem' }}
                  >
                    {item.score}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎙️</div>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              You haven't practiced speaking any words yet.
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Click "Speak with Word" on any vocabulary card to speak a sentence and get instant AI feedback!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
