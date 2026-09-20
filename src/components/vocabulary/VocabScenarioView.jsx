import React, { useState } from 'react';
import { SCENARIO_VOCABULARY_MAP, VOCABULARY_ITEMS } from '../../data/vocabularyData';

// Map icon name to emoji
const ICON_EMOJIS = {
  Briefcase: '💼',
  GraduationCap: '🎓',
  Presentation: '📊',
  Users: '🤝',
  Building2: '🏢',
  MessageSquare: '💬',
  Utensils: '🍽️',
  Plane: '✈️',
  Stethoscope: '🩺',
  Scale: '⚖️',
  Sparkles: '✨'
};

export default function VocabScenarioView({ onOpenSpeakModal }) {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIO_VOCABULARY_MAP[0]?.id);

  const activeScenario = SCENARIO_VOCABULARY_MAP.find((s) => s.id === activeScenarioId) || SCENARIO_VOCABULARY_MAP[0];

  // Resolve words from ids
  const wordsForScenario = (activeScenario.recommendedWords || []).map((id) => {
    return VOCABULARY_ITEMS.find((w) => w.id === id) || { id, word: id.replace('v-', '') };
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
          🎭 Real-Life Scenarios Vocabulary
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Learn and practice curated power words specifically tailored for practical everyday situations.
        </p>
      </div>

      {/* Scenarios Horizontal Selector */}
      <div className="category-chips-scroll" style={{ marginBottom: '24px' }}>
        {SCENARIO_VOCABULARY_MAP.map((sc) => {
          const isActive = sc.id === activeScenarioId;
          const emoji = ICON_EMOJIS[sc.icon] || '📌';
          return (
            <button
              key={sc.id}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => setActiveScenarioId(sc.id)}
            >
              <span>{emoji}</span>
              <span>{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Feature Card */}
      <div className="wotd-card" style={{ marginBottom: '28px' }}>
        <div className="wotd-badge-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>{ICON_EMOJIS[activeScenario.icon] || '📌'}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)', margin: 0 }}>
                {activeScenario.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '2px 0 0' }}>
                {activeScenario.desc}
              </p>
            </div>
          </div>
          <span className="vocab-pos-badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            {wordsForScenario.length} Key Words
          </span>
        </div>

        {/* Scenario Speaking Challenge Banner */}
        {activeScenario.speakingChallenge && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <strong style={{ color: 'var(--accent-amber)', display: 'block', fontSize: '0.85rem' }}>
                🎯 SCENARIO SPEAKING CHALLENGE
              </strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-primary)', fontSize: '0.94rem' }}>
                "{activeScenario.speakingChallenge}"
              </p>
            </div>
            {wordsForScenario[0] && (
              <button
                className="speak-action-btn"
                onClick={() => onOpenSpeakModal?.(wordsForScenario[0])}
              >
                🎙️ Practice Challenge Word
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recommended Words Grid */}
      <div className="vocab-grid">
        {wordsForScenario.map((word) => (
          <div key={word.id} className="vocab-card">
            <div className="vocab-card-header">
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0 }}>
                  {word.word}
                </h4>
                {word.phonetic && (
                  <span className="vocab-ipa" style={{ marginTop: '4px', display: 'inline-block' }}>
                    {word.phonetic}
                  </span>
                )}
              </div>
              <span className="vocab-pos-badge">{word.partOfSpeech || 'word'}</span>
            </div>

            <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem', margin: 0 }}>
              {word.meaning}
            </p>

            {word.example && (
              <div className="vocab-example-block" style={{ fontSize: '0.84rem' }}>
                "{word.example}"
              </div>
            )}

            <div className="vocab-card-footer" style={{ marginTop: 'auto' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target Word
              </span>
              <button
                className="speak-action-btn"
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                onClick={() => onOpenSpeakModal?.(word)}
              >
                🎙️ Practice in Sentence
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
