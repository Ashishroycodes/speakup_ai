import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  ShieldCheck,
  Clock,
  MessageSquare
} from 'lucide-react';

export default function RoleplayReport({
  report,
  onPracticeAgain,
  onExploreOtherScenarios
}) {
  if (!report) return null;

  const {
    scenario = 'Real-Life Scenario',
    character = 'Roleplay Partner',
    difficulty = 'Intermediate',
    language = 'English',
    goal = 'Confidence',
    durationSeconds = 120,
    totalTurns = 4,
    scores = {},
    summary = 'Great job completing your real-life roleplay session!',
    whatYouDidWell = [],
    whatYouCanImprove = [],
    betterResponseSuggestions = [],
    detectedSkills = []
  } = report;

  const overallScore = scores.overallCommunication ?? 80;

  // 9 Dimensions list
  const metricsList = [
    { key: 'overallCommunication', name: 'Overall Communication', score: scores.overallCommunication ?? 80, color: '#6366f1' },
    { key: 'clarity', name: 'Clarity & Directness', score: scores.clarity ?? 82, color: '#38bdf8' },
    { key: 'politeness', name: 'Politeness & Tact', score: scores.politeness ?? 88, color: '#10b981' },
    { key: 'relevance', name: 'Contextual Relevance', score: scores.relevance ?? 84, color: '#06b6d4' },
    { key: 'fluency', name: 'Fluency & Pacing', score: scores.fluency ?? 80, color: '#8b5cf6' },
    { key: 'grammar', name: 'Grammar Accuracy', score: scores.grammar ?? 78, color: '#f59e0b' },
    { key: 'vocabulary', name: 'Vocabulary Diversity', score: scores.vocabulary ?? 75, color: '#ec4899' },
    { key: 'conversationFlow', name: 'Conversation Flow', score: scores.conversationFlow ?? 80, color: '#14b8a6' },
    { key: 'responseQuality', name: 'Response Quality', score: scores.responseQuality ?? 82, color: '#f43f5e' }
  ];

  const formatMinutes = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}m ${remainder}s`;
  };

  return (
    <div className="roleplay-report-container" id="roleplay-report-container">
      {/* Hero Performance Card */}
      <div className="report-hero-card">
        <div className="report-hero-info">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
            <Trophy size={16} />
            <span>Roleplay Performance Report</span>
          </div>

          <h2>{scenario}</h2>
          <p>{summary}</p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap', fontSize: '0.825rem', color: '#94a3b8' }}>
            <span>Partner: <strong>{character}</strong></span>
            <span>Level: <strong>{difficulty}</strong></span>
            <span>Language: <strong>{language}</strong></span>
            <span>Focus: <strong>{goal}</strong></span>
            <span><Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />{formatMinutes(durationSeconds)}</span>
            <span><MessageSquare size={12} style={{ display: 'inline', marginRight: '3px' }} />{totalTurns} Turns</span>
          </div>
        </div>

        {/* Big Score Dial */}
        <div className="report-score-dial" id="report-overall-score-dial">
          <span className="score-dial-number">{overallScore}</span>
          <span className="score-dial-label">Score / 100</span>
        </div>
      </div>

      {/* 9-Metric Analysis Grid */}
      <h3 className="section-subheading">9-Dimension Communication Evaluation</h3>
      <div className="report-scores-grid">
        {metricsList.map((m) => (
          <div key={m.key} className="score-metric-card">
            <div className="metric-header">
              <span>{m.name}</span>
              <span className="metric-score-value" style={{ color: m.color }}>{m.score}</span>
            </div>
            <div className="metric-bar-bg">
              <div 
                className="metric-bar-fill" 
                style={{ 
                  width: `${Math.min(100, Math.max(10, m.score))}%`,
                  background: m.color 
                }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* What You Did Well & What You Can Improve */}
      <div className="report-feedback-columns">
        {/* Column 1: What You Did Well */}
        <div className="feedback-column-card">
          <h4 className="feedback-column-title well">
            <CheckCircle2 size={18} />
            <span>What You Did Well</span>
          </h4>
          <ul className="feedback-points-list">
            {whatYouDidWell.map((pt, idx) => (
              <li key={idx}>
                <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span>
                <span>{pt.replace(/^✓\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: What You Can Improve */}
        <div className="feedback-column-card">
          <h4 className="feedback-column-title improve">
            <AlertTriangle size={18} />
            <span>What You Can Improve</span>
          </h4>
          <ul className="feedback-points-list">
            {whatYouCanImprove.map((pt, idx) => (
              <li key={idx}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>•</span>
                <span>{pt.replace(/^[-•]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Better Response Suggestions */}
      {betterResponseSuggestions.length > 0 && (
        <div className="report-suggestions-section">
          <h3 className="section-subheading">Stronger Response Suggestions</h3>
          <div className="suggestions-cards-list">
            {betterResponseSuggestions.map((item, idx) => (
              <div key={idx} className="suggestion-card">
                <div className="suggestion-row">
                  <div className="suggestion-label">You said:</div>
                  <div className="suggestion-said">"{item.youSaid}"</div>
                </div>

                <div className="suggestion-row">
                  <div className="suggestion-label" style={{ color: '#34d399' }}>A stronger version:</div>
                  <div className="suggestion-stronger">"{item.strongerVersion}"</div>
                </div>

                {item.why && (
                  <div className="suggestion-row" style={{ marginBottom: 0 }}>
                    <div className="suggestion-label">Why:</div>
                    <div className="suggestion-why">{item.why}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Communication Skills Detected */}
      {detectedSkills.length > 0 && (
        <div>
          <h3 className="section-subheading">Communication Skills Demonstrated</h3>
          <div className="report-skills-deck">
            {detectedSkills.map((skill, idx) => (
              <span key={idx} className="skill-detected-pill">
                <ShieldCheck size={14} style={{ color: '#818cf8' }} />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="report-footer-actions">
        <button
          type="button"
          className="secondary-control-btn"
          onClick={onPracticeAgain}
          id="practice-again-roleplay-btn"
        >
          <RotateCcw size={15} />
          <span>Practice Again</span>
        </button>

        <button
          type="button"
          className="scenario-start-btn"
          onClick={onExploreOtherScenarios}
          id="explore-other-scenarios-btn"
        >
          <Sparkles size={15} />
          <span>Try Another Scenario</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
