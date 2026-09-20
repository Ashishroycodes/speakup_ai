import React, { useState } from 'react';
import { VOCABULARY_ITEMS } from '../../data/vocabularyData';
import { playRealVoiceAudio, stopCurrentVoiceAudio, THEME_VOICES } from '../../services/voiceService';

export default function VocabSpacedRepetitionView({
  progress,
  onRecordSpacedReview,
  theme = 'dark'
}) {
  const [activeTab, setActiveTab] = useState('due'); // 'due' | 'needs-practice' | 'mastered'
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const spacedDeck = progress.spacedRepetition || {};
  const difficultIds = progress.difficultVocab || [];
  const masteredIds = progress.masteredVocab || [];
  const learnedIds = progress.learnedVocab || [];

  // Filter words by deck status
  const dueWords = VOCABULARY_ITEMS.filter((w) => {
    const info = spacedDeck[w.id];
    if (!info) return learnedIds.includes(w.id); // If learned but not reviewed, it's due!
    return !info.nextReviewDate || new Date(info.nextReviewDate) <= new Date();
  });

  const needsPracticeWords = VOCABULARY_ITEMS.filter((w) => {
    return difficultIds.includes(w.id) || (spacedDeck[w.id]?.level && spacedDeck[w.id].level < 2);
  });

  const masteredWords = VOCABULARY_ITEMS.filter((w) => {
    return masteredIds.includes(w.id) || (spacedDeck[w.id]?.level && spacedDeck[w.id].level >= 4);
  });

  // Current active list
  const currentList = activeTab === 'due'
    ? dueWords
    : activeTab === 'needs-practice'
    ? needsPracticeWords
    : masteredWords;

  const currentWord = currentList[currentCardIndex] || currentList[0];

  const handlePronounce = (e) => {
    e.stopPropagation();
    if (!currentWord) return;
    if (isPlaying) {
      stopCurrentVoiceAudio();
      setIsPlaying(false);
      return;
    }

    const voice = THEME_VOICES[theme]?.voice || 'nova';
    setIsPlaying(true);
    playRealVoiceAudio(currentWord.word, {
      voice,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };

  const handleRate = (rating) => {
    if (!currentWord) return;
    if (onRecordSpacedReview) {
      onRecordSpacedReview(currentWord.id, rating);
    }

    setIsFlipped(false);
    if (currentCardIndex < currentList.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
          🧠 Spaced Repetition Flashcard Review
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Scientifically timed reviews that cement words into your active speaking memory permanently.
        </p>
      </div>

      {/* Subtabs */}
      <div className="subtabs-row">
        <button
          className={`subtab-btn ${activeTab === 'due' ? 'active' : ''}`}
          onClick={() => { setActiveTab('due'); setCurrentCardIndex(0); setIsFlipped(false); }}
        >
          ⏰ Due for Review ({dueWords.length})
        </button>

        <button
          className={`subtab-btn ${activeTab === 'needs-practice' ? 'active' : ''}`}
          onClick={() => { setActiveTab('needs-practice'); setCurrentCardIndex(0); setIsFlipped(false); }}
        >
          ⚠️ Needs More Practice ({needsPracticeWords.length})
        </button>

        <button
          className={`subtab-btn ${activeTab === 'mastered' ? 'active' : ''}`}
          onClick={() => { setActiveTab('mastered'); setCurrentCardIndex(0); setIsFlipped(false); }}
        >
          🏆 Mastered Words ({masteredWords.length})
        </button>
      </div>

      {currentList.length > 0 && currentWord ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Card {currentCardIndex + 1} of {currentList.length}
          </div>

          <div
            className="flashcard-card"
            style={{ cursor: 'pointer', minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {!isFlipped ? (
              /* Flashcard Front */
              <div>
                <span className="vocab-pos-badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
                  {currentWord.partOfSpeech || 'Word'}
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--text-primary)', margin: '8px 0' }}>
                  {currentWord.word}
                </h2>
                {currentWord.phonetic && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span className="vocab-ipa">{currentWord.phonetic}</span>
                    <button
                      className={`speaker-btn ${isPlaying ? 'is-playing' : ''}`}
                      onClick={handlePronounce}
                      aria-label="Listen pronunciation"
                    >
                      {isPlaying ? '🔊' : '🔈'}
                    </button>
                  </div>
                )}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                  (Click card to reveal meaning & usage)
                </p>
              </div>
            ) : (
              /* Flashcard Back */
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                  MEANING & RECALL
                </span>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 600, margin: '10px 0 12px' }}>
                  {currentWord.meaning}
                </p>
                {currentWord.hindiMeaning && (
                  <p style={{ color: 'var(--accent-amber)', fontSize: '0.95rem', margin: '0 0 12px' }}>
                    🇮🇳 {currentWord.hindiMeaning}
                  </p>
                )}
                {currentWord.example && (
                  <div className="vocab-example-block" style={{ textAlign: 'left', margin: '12px auto', maxWidth: '460px' }}>
                    "{currentWord.example}"
                  </div>
                )}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '14px', marginBottom: 0 }}>
                  How easily did you recall this word?
                </p>
              </div>
            )}
          </div>

          {/* Spaced Repetition Quality Feedback Buttons */}
          <div className="flashcard-rating-actions">
            <button
              className="rating-btn rating-hard"
              onClick={() => handleRate('hard')}
              title="Review again tomorrow"
            >
              😰 Hard (Review Soon)
            </button>

            <button
              className="rating-btn rating-good"
              onClick={() => handleRate('good')}
              title="Review in 2-3 days"
            >
              👍 Good (+1 Level)
            </button>

            <button
              className="rating-btn rating-easy"
              onClick={() => handleRate('easy')}
              title="Review in 1 week"
            >
              🚀 Easy (+2 Levels)
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '6px' }}>
            No cards in this deck right now!
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Great job! You are up to date on all your vocabulary reviews.
          </p>
        </div>
      )}
    </div>
  );
}
