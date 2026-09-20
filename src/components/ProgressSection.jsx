import React from 'react';
import { Award, Target, Mic, Clock, Flame, Zap, Shield, Sparkles, BookOpen, CheckCircle2, Star, AlertTriangle } from 'lucide-react';
import BadgeCard from './common/BadgeCard';
import { BADGES_DATA } from '../data/badgesData';
import './ProgressSection.css';

export default function ProgressSection({ 
  progress, 
  onStartPractice: _onStartPractice 
}) {
  const {
    xp = 240,
    streak = 3,
    sessionsCount = 3,
    totalSpeakingTimeSeconds = 180,
    completedChallenges = 1,
    learnedVocab: _learnedVocab = [],
    overallScore = 78,
    skills = {
      speakingFluency: 80,
      grammar: 70,
      vocabulary: 72,
      clarity: 82
    }
  } = progress || {};

  const formatMinutes = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m ${seconds % 60}s`;
  };

  const skillBars = [
    { name: 'Speaking Fluency', percent: skills.speakingFluency, color: 'indigo' },
    { name: 'Grammar', percent: skills.grammar, color: 'cyan' },
    { name: 'Vocabulary', percent: skills.vocabulary, color: 'amber' },
    { name: 'Clarity', percent: skills.clarity, color: 'emerald' }
  ];

  // Vocabulary Competencies (Requirement 20)
  const wordsLearned = (progress?.learnedVocab || []).length;
  const wordsMastered = (progress?.masteredVocab || []).length;
  const wordsToReview = (progress?.weakVocab || []).length;
  const quizAccuracy = progress?.vocabQuizStats?.totalQuestions > 0 
    ? Math.round((progress.vocabQuizStats.correctAnswers / progress.vocabQuizStats.totalQuestions) * 100) 
    : 85;
  const vocabXp = Math.round((xp || 240) * 0.35);
  const vocabLevel = wordsMastered >= 15 ? 'Advanced (C1)' : wordsLearned >= 8 ? 'Upper Intermediate (B2)' : 'Intermediate (B1)';

  return (
    <section className="progress-section" id="progress">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge section-badge-emerald">
            <Target size={14} />
            <span>Progress & Mastery Dashboard</span>
          </div>
          <h2 className="section-title">Your Communication Growth</h2>
          <p className="section-subtitle">
            Comprehensive evaluation of your speaking skills, consistency metrics, and earned achievement badges.
          </p>
        </div>

        {/* Top Overview Row: Overall Communication Score & Skills Breakdown */}
        <div className="progress-overview-grid">
          {/* Overall Communication Score Card */}
          <div className="overall-score-card card">
            <span className="card-subheading-tag">Overall Assessment</span>
            <h3 className="overall-score-heading">Communication Score</h3>
            
            <div className="score-radial-visual">
              <svg width="150" height="150" viewBox="0 0 150 150" className="radial-svg">
                <circle
                  cx="75"
                  cy="75"
                  r="58"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="58"
                  stroke="url(#scoreGrad)"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - overallScore / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                  transform="rotate(-90 75 75)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="radial-score-center">
                <span className="center-score-num">{overallScore}</span>
                <span className="center-score-denom">/100</span>
              </div>
            </div>

            <div className="score-summary-pill">
              <Sparkles size={14} />
              <span>Upper Intermediate Level</span>
            </div>
          </div>

          {/* Skills Breakdown Card */}
          <div className="skills-breakdown-card card">
            <div className="skills-header-row">
              <h3 className="skills-title">Skill Competencies</h3>
              <span className="skills-xp-badge">
                <Zap size={14} />
                XP: {xp}
              </span>
            </div>
            <p className="skills-desc">
              Scores are calculated across your active speech recordings, vocabulary depth, and structure.
            </p>

            <div className="skill-bars-list">
              {skillBars.map((skill) => (
                <div key={skill.name} className="skill-item-bar-row">
                  <div className="skill-labels">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.percent}%</span>
                  </div>
                  <div className="skill-track">
                    <div
                      className={`skill-fill fill-${skill.color}`}
                      style={{ width: `${skill.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Practice Summary Stat Cards */}
        <div className="stats-summary-grid">
          <div className="stat-summary-card card">
            <div className="stat-icon-box indigo">
              <Mic size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{sessionsCount}</span>
              <span className="stat-label">Total Practice Sessions</span>
            </div>
          </div>

          <div className="stat-summary-card card">
            <div className="stat-icon-box cyan">
              <Clock size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{formatMinutes(totalSpeakingTimeSeconds)}</span>
              <span className="stat-label">Total Speaking Time</span>
            </div>
          </div>

          <div className="stat-summary-card card">
            <div className="stat-icon-box amber">
              <Flame size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{streak} Days</span>
              <span className="stat-label">Current Streak</span>
            </div>
          </div>

          <div className="stat-summary-card card">
            <div className="stat-icon-box emerald">
              <Award size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{completedChallenges}</span>
              <span className="stat-label">Challenges Completed</span>
            </div>
          </div>
        </div>

        {/* Vocabulary Competencies & Mastery Dashboard Card (Requirement 20) */}
        <div className="card" style={{ marginTop: '28px', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={20} className="text-indigo-400" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Vocabulary Competencies & Retention
              </h3>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '4px 12px', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1' }}>
              Current Level: {vocabLevel}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Words Learned</span>
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{wordsLearned}</span>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <Star size={14} className="text-amber-400" />
                <span>Words Mastered</span>
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{wordsMastered}</span>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <AlertTriangle size={14} className="text-rose-400" />
                <span>Words To Review</span>
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{wordsToReview}</span>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <Target size={14} className="text-cyan-400" />
                <span>Quiz Accuracy</span>
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{quizAccuracy}%</span>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <Zap size={14} className="text-indigo-400" />
                <span>Vocabulary XP</span>
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>+{vocabXp} XP</span>
            </div>
          </div>
        </div>

        {/* Gamification Badges Section */}
        <div className="badges-section-container">
          <div className="badges-header">
            <div className="badges-title-wrap">
              <Shield size={20} className="shield-icon" />
              <h3>Achievement Badges</h3>
            </div>
            <span className="badges-counter-text">
              {BADGES_DATA.filter((b) => b.checkUnlocked(progress)).length} of {BADGES_DATA.length} Unlocked
            </span>
          </div>

          <div className="badges-cards-grid">
            {BADGES_DATA.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={badge.checkUnlocked(progress)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
