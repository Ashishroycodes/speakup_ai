import React, { useState } from 'react';
import { ArrowRight, History, Mic, FileText, CheckCircle2 } from 'lucide-react';

const INTERVIEW_TYPES = [
  'HR Interview',
  'Technical Interview',
  'Behavioral Interview',
  'Internship Interview',
  'Placement Interview',
  'Mixed Interview'
];

const EXPERIENCE_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

const PRESET_ROLES = [
  'Software Developer',
  'Full Stack Developer',
  'Java Developer',
  'Data Analyst',
  'Data Science Intern',
  'Web Developer',
  'General Fresher'
];

const LANGUAGES = [
  { id: 'English', label: 'English', sub: 'Standard' },
  { id: 'Hindi', label: 'Hindi (हिंदी)', sub: 'Devanagari' },
  { id: 'Hinglish', label: 'Hinglish', sub: 'Hindi + English' }
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const QUESTION_COUNTS = [5, 10, 15];
const MODES = [
  { id: 'Voice + Text', label: 'Voice + Text', icon: Mic },
  { id: 'Voice', label: 'Voice Only', icon: Mic },
  { id: 'Text', label: 'Text Only', icon: FileText }
];
const TIMERS = [
  { id: 30, label: '30s' },
  { id: 60, label: '60s' },
  { id: 90, label: '90s' },
  { id: 0, label: 'No Limit' }
];

export default function InterviewSetup({
  onStartInterview,
  onOpenHistory,
  historyCount = 0
}) {
  const [interviewType, setInterviewType] = useState('HR Interview');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [language, setLanguage] = useState('English');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [interviewMode, setInterviewMode] = useState('Voice + Text');
  const [timerLimit, setTimerLimit] = useState(60);

  const handleRoleChipClick = (role) => {
    setIsCustomRole(false);
    setTargetRole(role);
  };

  const handleCustomRoleChange = (e) => {
    const val = e.target.value;
    setCustomRole(val);
    setIsCustomRole(true);
    setTargetRole(val.trim() || 'Software Developer');
  };

  const handleStart = () => {
    const finalRole = isCustomRole && customRole.trim() ? customRole.trim() : targetRole;
    onStartInterview({
      interviewType,
      experienceLevel,
      targetRole: finalRole,
      language,
      difficulty,
      questionCount,
      interviewMode,
      timerLimit
    });
  };

  return (
    <div className="setup-card" id="interview-setup-container">
      <div className="setup-grid">
        {/* 1. Interview Type */}
        <div className="setup-group full-width">
          <label className="setup-label">
            <span>1. Interview Type</span>
            <span className="setup-label-hint">Select mock format</span>
          </label>
          <div className="chip-group" role="group" aria-label="Interview Type">
            {INTERVIEW_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`chip-btn ${interviewType === type ? 'active' : ''}`}
                onClick={() => setInterviewType(type)}
                id={`chip-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Target Role */}
        <div className="setup-group full-width">
          <label className="setup-label">
            <span>2. Target Role</span>
            <span className="setup-label-hint">Preset or enter custom</span>
          </label>
          <div className="chip-group" role="group" aria-label="Target Role">
            {PRESET_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                className={`chip-btn ${!isCustomRole && targetRole === role ? 'active' : ''}`}
                onClick={() => handleRoleChipClick(role)}
                id={`chip-role-${role.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {role}
              </button>
            ))}
          </div>
          <div className="custom-role-input-wrap">
            <input
              type="text"
              className="custom-role-input"
              placeholder="Or enter a custom role (e.g. Cloud Engineer, QA Tester, Product Analyst)..."
              value={customRole}
              onChange={handleCustomRoleChange}
              id="custom-role-input"
              aria-label="Custom target role"
            />
          </div>
        </div>

        {/* 3. Experience Level */}
        <div className="setup-group">
          <label className="setup-label">
            <span>3. Experience Level</span>
          </label>
          <div className="chip-group" role="group" aria-label="Experience Level">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                className={`chip-btn ${experienceLevel === level ? 'active' : ''}`}
                onClick={() => setExperienceLevel(level)}
                id={`chip-level-${level.toLowerCase()}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Language */}
        <div className="setup-group">
          <label className="setup-label">
            <span>4. Language</span>
          </label>
          <div className="chip-group" role="group" aria-label="Interview Language">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                className={`chip-btn ${language === lang.id ? 'active' : ''}`}
                onClick={() => setLanguage(lang.id)}
                id={`chip-lang-${lang.id.toLowerCase()}`}
                title={lang.sub}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Difficulty */}
        <div className="setup-group">
          <label className="setup-label">
            <span>5. Difficulty</span>
          </label>
          <div className="chip-group" role="group" aria-label="Difficulty Level">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                type="button"
                className={`chip-btn ${difficulty === diff ? 'active' : ''}`}
                onClick={() => setDifficulty(diff)}
                id={`chip-diff-${diff.toLowerCase()}`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Number of Questions */}
        <div className="setup-group">
          <label className="setup-label">
            <span>6. Questions Count</span>
          </label>
          <div className="chip-group" role="group" aria-label="Number of Questions">
            {QUESTION_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                className={`chip-btn ${questionCount === count ? 'active' : ''}`}
                onClick={() => setQuestionCount(count)}
                id={`chip-count-${count}`}
              >
                {count} Questions
              </button>
            ))}
          </div>
        </div>

        {/* 7. Interview Mode */}
        <div className="setup-group">
          <label className="setup-label">
            <span>7. Input Mode</span>
          </label>
          <div className="chip-group" role="group" aria-label="Interview Input Mode">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`chip-btn ${interviewMode === mode.id ? 'active' : ''}`}
                onClick={() => setInterviewMode(mode.id)}
                id={`chip-mode-${mode.id.toLowerCase().replace(/[^a-z]/g, '')}`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* 8. Answer Timer */}
        <div className="setup-group">
          <label className="setup-label">
            <span>8. Answer Timer</span>
            <span className="setup-label-hint">Non-blocking limit</span>
          </label>
          <div className="chip-group" role="group" aria-label="Answer Timer Limit">
            {TIMERS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`chip-btn ${timerLimit === t.id ? 'active' : ''}`}
                onClick={() => setTimerLimit(t.id)}
                id={`chip-timer-${t.id}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Setup Actions Bottom Row */}
      <div className="setup-actions">
        <div className="setup-summary-text">
          <CheckCircle2 size={16} className="text-primary" />
          <span>
            {questionCount} questions • {interviewType} • {targetRole} ({experienceLevel})
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {historyCount > 0 && (
            <button
              type="button"
              className="history-trigger-btn"
              onClick={onOpenHistory}
              id="setup-history-btn"
            >
              <History size={15} />
              <span>Past Sessions ({historyCount})</span>
            </button>
          )}

          <button
            type="button"
            className="setup-start-btn"
            onClick={handleStart}
            id="start-interview-btn"
          >
            <span>Start Interview</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
