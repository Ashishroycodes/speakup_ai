import React, { useState } from 'react';
import { CONFUSING_WORDS_LIST } from '../../data/vocabularyData';

export default function VocabComparisonView() {
  const [userAnswers, setUserAnswers] = useState({});

  const handleSelectQuizChoice = (pairId, choice) => {
    setUserAnswers((prev) => ({
      ...prev,
      [pairId]: choice
    }));
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
          ⚖️ Confusing Words Masterclass
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Never mix up easily confused English pairs again. Master meanings, memory tricks, and quick checks.
        </p>
      </div>

      <div className="confusing-grid">
        {CONFUSING_WORDS_LIST.map((pair) => {
          const selectedAnswer = userAnswers[pair.id];
          const hasAnswered = Boolean(selectedAnswer);
          const isCorrect = selectedAnswer?.toLowerCase() === pair.miniQuiz.correctWord.toLowerCase();

          return (
            <div key={pair.id} className="confusing-card">
              {/* Pair Title */}
              <div className="pair-versus-row">
                <span className="word-pill-a">{pair.wordA.word}</span>
                <span className="versus-tag">VS</span>
                <span className="word-pill-b">{pair.wordB.word}</span>
              </div>

              {/* Word A Column */}
              <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{pair.wordA.word}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pair.wordA.pos}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                  {pair.wordA.meaning}
                </p>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '6px' }}>
                  "{pair.wordA.example}"
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                  💡 Trick: {pair.wordA.quickTip}
                </div>
              </div>

              {/* Word B Column */}
              <div style={{ background: 'rgba(6, 182, 212, 0.05)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>{pair.wordB.word}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pair.wordB.pos}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                  {pair.wordB.meaning}
                </p>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '6px' }}>
                  "{pair.wordB.example}"
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  💡 Trick: {pair.wordB.quickTip}
                </div>
              </div>

              {/* Mini Quiz */}
              <div style={{ background: 'var(--bg-muted)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Quick Check:
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: '0 0 10px', fontWeight: 500 }}>
                  {pair.miniQuiz.question}
                </p>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {[pair.wordA.word, pair.wordB.word].map((choice) => {
                    const isThisChoice = selectedAnswer?.toLowerCase() === choice.toLowerCase();
                    let btnStyle = {
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    };

                    if (hasAnswered) {
                      if (choice.toLowerCase() === pair.miniQuiz.correctWord.toLowerCase()) {
                        btnStyle.background = 'rgba(16, 185, 129, 0.15)';
                        btnStyle.borderColor = 'var(--accent-emerald)';
                        btnStyle.color = 'var(--accent-emerald)';
                      } else if (isThisChoice) {
                        btnStyle.background = 'rgba(239, 68, 68, 0.15)';
                        btnStyle.borderColor = 'var(--accent-rose)';
                        btnStyle.color = 'var(--accent-rose)';
                      }
                    }

                    return (
                      <button
                        key={choice}
                        style={btnStyle}
                        onClick={() => handleSelectQuizChoice(pair.id, choice)}
                        disabled={hasAnswered}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div style={{ marginTop: '8px', fontSize: '0.8rem', color: isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {isCorrect ? '✓ Correct! ' : '❌ Remember: '}
                    {pair.miniQuiz.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
