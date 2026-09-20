import React, { useState } from 'react';
import { X, Sparkles, Play, Globe, Target, Gauge, Volume2 } from 'lucide-react';
import { ROLEPLAY_GOALS } from '../../data/roleplayData';
import { THEME_VOICES, REAL_VOICES } from '../../services/voiceService';

export default function RoleplaySetupModal({
  scenario,
  theme = 'dark',
  isOpen,
  onClose,
  onStartRoleplay
}) {
  const [difficultyOverride, setDifficultyOverride] = useState(null);
  const [voiceOverride, setVoiceOverride] = useState(null);
  const [language, setLanguage] = useState('English');
  const [goal, setGoal] = useState('Confidence');

  if (!isOpen || !scenario) return null;

  const difficulty = difficultyOverride || scenario.difficulty || 'Intermediate';
  const setDifficulty = setDifficultyOverride;

  const themeDefaultVoice = THEME_VOICES[theme]?.voice || scenario.characterVoice || 'onyx';
  const selectedVoice = voiceOverride || themeDefaultVoice;

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartRoleplay({
      scenario: scenario.title,
      category: scenario.categoryId,
      character: scenario.character,
      characterRole: scenario.characterRole,
      characterAvatar: scenario.characterAvatar,
      characterVoice: selectedVoice,
      openingLine: scenario.openingLine,
      hint: scenario.hint,
      exampleResponse: scenario.exampleResponse,
      challengeEvent: scenario.challengeEvent,
      difficulty,
      language,
      goal
    });
  };

  const activeVoiceObj = REAL_VOICES.find(v => v.id === selectedVoice);

  return (
    <div className="roleplay-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="roleplay-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close setup modal"
          id="close-roleplay-modal-btn"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="modal-hero-badge">
          <Sparkles size={14} />
          <span>Roleplay Setup</span>
        </div>

        <h2 className="modal-title">{scenario.title}</h2>
        <p className="modal-desc">{scenario.summary}</p>

        {/* AI Character Card */}
        <div className="modal-character-box">
          <div className="modal-character-avatar">
            {scenario.characterAvatar}
          </div>
          <div className="modal-character-info">
            <h4>AI Character: {scenario.character}</h4>
            <p>
              Role: {scenario.characterRole} • Voice: <strong>{activeVoiceObj?.name || selectedVoice}</strong> ({THEME_VOICES[theme]?.name || theme} default)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* AI Character Voice (Theme Adapted) */}
          <div className="setup-form-group">
            <label className="setup-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Volume2 size={13} />
                AI Character Voice (Theme Adapted)
              </span>
            </label>
            <div className="setup-options-row" style={{ flexWrap: 'wrap' }}>
              {REAL_VOICES.map((v) => {
                const isThemeSignature = Object.entries(THEME_VOICES).find(([, tv]) => tv.voice === v.id);
                const isActive = selectedVoice === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    className={`setup-chip ${isActive ? 'active' : ''}`}
                    onClick={() => setVoiceOverride(v.id)}
                    id={`setup-voice-${v.id}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span>{v.name}</span>
                    {isThemeSignature && (
                      <span style={{ fontSize: '0.68rem', opacity: 0.8, textTransform: 'capitalize' }}>
                        ({isThemeSignature[0]})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="setup-form-group">
            <label className="setup-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Gauge size={13} />
                Difficulty Level
              </span>
            </label>
            <div className="setup-options-row">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`setup-chip ${difficulty === lvl ? 'active' : ''}`}
                  onClick={() => setDifficulty(lvl)}
                  id={`setup-diff-${lvl.toLowerCase()}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="setup-form-group">
            <label className="setup-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Globe size={13} />
                Conversation Language
              </span>
            </label>
            <div className="setup-options-row">
              {['English', 'Hindi', 'Hinglish'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`setup-chip ${language === lang ? 'active' : ''}`}
                  onClick={() => setLanguage(lang)}
                  id={`setup-lang-${lang.toLowerCase()}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Learning Goal */}
          <div className="setup-form-group">
            <label className="setup-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Target size={13} />
                Focus Communication Goal
              </span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
              {ROLEPLAY_GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`setup-chip ${goal === g.label ? 'active' : ''}`}
                  onClick={() => setGoal(g.label)}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.6rem' }}
                  id={`setup-goal-${g.id}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Launch Button */}
          <button
            type="submit"
            className="modal-start-btn"
            id="start-roleplay-session-btn"
          >
            <Play size={18} fill="currentColor" />
            <span>Start Roleplay</span>
          </button>
        </form>
      </div>
    </div>
  );
}
