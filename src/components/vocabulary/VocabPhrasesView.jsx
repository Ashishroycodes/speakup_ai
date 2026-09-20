import React, { useState } from 'react';
import { PHRASES_AND_IDIOMS_LIST } from '../../data/vocabularyData';
import { playRealVoiceAudio, stopCurrentVoiceAudio, THEME_VOICES } from '../../services/voiceService';

export default function VocabPhrasesView({ theme = 'dark', onOpenSpeakModal }) {
  const [playingPhrase, setPlayingPhrase] = useState(null);

  const handleSpeakPhrase = (text) => {
    if (playingPhrase === text) {
      stopCurrentVoiceAudio();
      setPlayingPhrase(null);
      return;
    }

    const voice = THEME_VOICES[theme]?.voice || 'nova';
    setPlayingPhrase(text);
    playRealVoiceAudio(text, {
      voice,
      onStart: () => setPlayingPhrase(text),
      onEnd: () => setPlayingPhrase(null),
      onError: () => setPlayingPhrase(null)
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
          💡 Phrase Builder & Essential Idioms
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Master native-sounding phrases, polite conversation formulas, and high-impact idioms for fluent speech.
        </p>
      </div>

      <div className="scenarios-grid">
        {PHRASES_AND_IDIOMS_LIST.map((group) => (
          <div key={group.id} className="scenario-card" style={{ gap: '16px' }}>
            <div>
              <span className="vocab-pos-badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                {group.category}
              </span>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-primary)', margin: '6px 0 0' }}>
                {group.title}
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {group.items.map((item, idx) => {
                const isPlaying = playingPhrase === item.phrase;

                return (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-muted)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '12px',
                      padding: '12px 14px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        "{item.phrase}"
                      </strong>
                      <button
                        className={`speaker-btn ${isPlaying ? 'is-playing' : ''}`}
                        style={{ width: '28px', height: '28px', fontSize: '0.8rem', flexShrink: 0 }}
                        onClick={() => handleSpeakPhrase(item.phrase)}
                        title="Listen pronunciation"
                        aria-label={`Pronounce ${item.phrase}`}
                      >
                        {isPlaying ? '🔊' : '🔈'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', margin: '4px 0', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                        {item.formality}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '2px 0 4px' }}>
                      {item.meaning}
                    </p>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      "{item.example}"
                    </div>

                    {onOpenSpeakModal && (
                      <div style={{ marginTop: '8px', textAlign: 'right' }}>
                        <button
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0
                          }}
                          onClick={() => onOpenSpeakModal({
                            id: `phrase-${idx}`,
                            word: item.phrase,
                            meaning: item.meaning,
                            partOfSpeech: 'phrase',
                            phonetic: '',
                            speakingPrompt: `Use the phrase "${item.phrase}" in a natural sentence.`
                          })}
                        >
                          🎙️ Practice this phrase →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
