import React, { useState } from 'react';
import { playRealVoiceAudio, stopCurrentVoiceAudio, THEME_VOICES } from '../../services/voiceService';

export default function VocabCard({
  wordItem,
  isLearned = false,
  isSaved = false,
  isDifficult = false,
  isMastered = false,
  onToggleLearned,
  onToggleSaved,
  onToggleDifficult,
  onToggleMastered,
  onOpenSpeakModal,
  theme = 'dark'
}) {
  const [showHindi, setShowHindi] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePronounce = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      stopCurrentVoiceAudio();
      setIsPlaying(false);
      return;
    }

    const voice = THEME_VOICES[theme]?.voice || 'nova';
    setIsPlaying(true);
    playRealVoiceAudio(wordItem.word, {
      voice,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };

  const cardClasses = [
    'vocab-card',
    isLearned ? 'is-learned' : '',
    isMastered ? 'is-mastered' : '',
    isDifficult ? 'is-difficult' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {/* Card Header */}
      <div className="vocab-card-header">
        <div>
          <div className="vocab-word-title-row">
            <h3 className="vocab-word-name">{wordItem.word}</h3>
            {wordItem.partOfSpeech && (
              <span className="vocab-pos-badge">{wordItem.partOfSpeech}</span>
            )}
            <span
              className="vocab-pos-badge"
              style={{
                background: wordItem.difficulty === 'advanced' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                color: wordItem.difficulty === 'advanced' ? 'var(--accent-rose)' : 'var(--primary)'
              }}
            >
              {wordItem.difficulty || 'intermediate'}
            </span>
          </div>

          <div className="vocab-pronounce-row">
            {wordItem.phonetic && (
              <span className="vocab-ipa">{wordItem.phonetic}</span>
            )}
            <button
              className={`speaker-btn ${isPlaying ? 'is-playing' : ''}`}
              onClick={handlePronounce}
              title={`Listen pronunciation of ${wordItem.word}`}
              aria-label={`Listen pronunciation of ${wordItem.word}`}
            >
              {isPlaying ? '🔊' : '🔈'}
            </button>
          </div>
        </div>

        {/* Quick Header Actions */}
        <div className="card-header-actions">
          <button
            className={`icon-action-btn ${isSaved ? 'active-bookmark' : ''}`}
            onClick={() => onToggleSaved?.(wordItem.id)}
            title={isSaved ? 'Remove from Saved' : 'Save / Bookmark word'}
            aria-label="Save word"
          >
            {isSaved ? '★' : '☆'}
          </button>

          <button
            className={`icon-action-btn ${isDifficult ? 'active-difficult' : ''}`}
            onClick={() => onToggleDifficult?.(wordItem.id)}
            title={isDifficult ? 'Mark as Not Difficult' : 'Mark as Tricky/Difficult'}
            aria-label="Mark tricky"
          >
            {isDifficult ? '⚠️' : '⚡'}
          </button>

          <button
            className={`icon-action-btn ${isMastered ? 'active-mastered' : ''}`}
            onClick={() => onToggleMastered?.(wordItem.id)}
            title={isMastered ? 'Mastered!' : 'Mark as Mastered (+20 XP)'}
            aria-label="Mark mastered"
          >
            {isMastered ? '🏆' : '⚪'}
          </button>
        </div>
      </div>

      {/* Meaning & Hindi Toggle */}
      <div className="vocab-meaning-box">
        <p className="vocab-meaning-text">{wordItem.meaning}</p>
        
        {wordItem.hindiMeaning && (
          <div className="hindi-toggle-row">
            {showHindi ? (
              <span className="hindi-text">🇮🇳 {wordItem.hindiMeaning}</span>
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hindi translation available</span>
            )}
            <button
              className="toggle-hindi-btn"
              onClick={() => setShowHindi(!showHindi)}
            >
              {showHindi ? 'Hide Hindi' : 'Show Hindi'}
            </button>
          </div>
        )}
      </div>

      {/* Real-life Example */}
      {wordItem.example && (
        <div className="vocab-example-block">
          "{wordItem.example}"
        </div>
      )}

      {/* Real-life A/B Conversation Snippet */}
      {wordItem.conversationSnippet && (
        <div className="vocab-dialogue-block">
          <div className="dialogue-speaker">
            <span className="speaker-tag">A:</span>
            <span>{wordItem.conversationSnippet.a}</span>
          </div>
          <div className="dialogue-speaker">
            <span className="speaker-tag">B:</span>
            <span>{wordItem.conversationSnippet.b}</span>
          </div>
        </div>
      )}

      {/* Expandable Deep Dive: Synonyms, Collocations & Common Mistakes */}
      <div className="card-details-accordion">
        <button
          className="accordion-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>
            {isExpanded ? '▲ Hide Advanced Usage' : '▼ Collocations, Mistakes & Synonyms'}
          </span>
        </button>

        {isExpanded && (
          <div className="accordion-body">
            {/* Collocations */}
            {wordItem.collocations && wordItem.collocations.length > 0 && (
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  🤝 Natural Collocations:
                </strong>
                <div className="chips-cloud">
                  {wordItem.collocations.map((col, idx) => (
                    <span key={idx} className="word-chip" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synonyms & Antonyms */}
            {((wordItem.synonyms && wordItem.synonyms.length > 0) || (wordItem.antonyms && wordItem.antonyms.length > 0)) && (
              <div>
                {wordItem.synonyms && wordItem.synonyms.length > 0 && (
                  <div style={{ marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Synonyms: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{wordItem.synonyms.join(', ')}</span>
                  </div>
                )}
                {wordItem.antonyms && wordItem.antonyms.length > 0 && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Antonyms: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{wordItem.antonyms.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Common Mistakes */}
            {wordItem.commonMistakes && (
              <div className="mistake-badge-box">
                <div className="avoid-text">❌ Avoid: "{wordItem.commonMistakes.avoid}"</div>
                <div className="use-text">✅ Use: "{wordItem.commonMistakes.use}"</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="vocab-card-footer">
        <button
          className={`mark-learned-btn ${isLearned ? 'is-active' : ''}`}
          onClick={() => onToggleLearned?.(wordItem.id)}
        >
          {isLearned ? '✓ Learned' : '+ Mark Learned'}
        </button>

        <button
          className="speak-action-btn"
          onClick={() => onOpenSpeakModal?.(wordItem)}
        >
          🎙️ Speak with Word
        </button>
      </div>
    </div>
  );
}
