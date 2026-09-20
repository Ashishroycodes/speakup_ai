import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  Shuffle, 
  ArrowLeft,
  Volume2,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';

export default function PresentationReport({
  report,
  topic,
  onPracticeAgain,
  onTryAnotherTopic,
  onBackToChallenges
}) {
  if (!report) return null;

  const {
    overallScore = 80,
    scores = {
      clarity: 80,
      fluency: 78,
      grammar: 82,
      vocabulary: 75,
      structure: 80,
      relevance: 85
    },
    structureAnalysis = {},
    fillerAnalysis = { totalFillers: 0, mostUsedFiller: 'None', suggestion: '' },
    deliveryStats = { totalWords: 0, speakingDurationSeconds: 60, wordsPerMinute: 0 },
    whatYouDidWell = [],
    howToImprove = [],
    nextPractice = '',
    honestNotice = ''
  } = report;

  const dimensions = [
    { label: 'Clarity', score: scores.clarity ?? 80, color: '#6366F1' },
    { label: 'Fluency', score: scores.fluency ?? 78, color: '#06B6D4' },
    { label: 'Grammar', score: scores.grammar ?? 82, color: '#10B981' },
    { label: 'Vocabulary', score: scores.vocabulary ?? 75, color: '#F59E0B' },
    { label: 'Structure', score: scores.structure ?? 80, color: '#8B5CF6' },
    { label: 'Relevance', score: scores.relevance ?? 85, color: '#EC4899' }
  ];

  const structureItems = [
    { key: 'introduction', label: 'Introduction & Hook', data: structureAnalysis.introduction },
    { key: 'mainPoint', label: 'Main Point & Core Concept', data: structureAnalysis.mainPoint },
    { key: 'supportingExplanation', label: 'Supporting Evidence & Examples', data: structureAnalysis.supportingExplanation },
    { key: 'conclusion', label: 'Conclusion & Key Takeaway', data: structureAnalysis.conclusion }
  ];

  const getScoreBadge = (val) => {
    if (val >= 85) return { text: 'Excellent Delivery', cls: 'badge-emerald' };
    if (val >= 70) return { text: 'Proficient Presenter', cls: 'badge-indigo' };
    if (val >= 55) return { text: 'Developing Speaker', cls: 'badge-amber' };
    return { text: 'Needs Practice', cls: 'badge-red' };
  };

  const badge = getScoreBadge(overallScore);

  return (
    <div className="presentation-report-container" id="presentation-report-card">
      {/* 1. Header Banner */}
      <div className="report-header-card">
        <div className="report-header-left">
          <div className="report-badge-row">
            <span className={`report-status-badge ${badge.cls}`}>
              <Sparkles size={14} />
              <span>{badge.text}</span>
            </span>
            <span className="report-xp-tag">
              <Trophy size={14} />
              <span>+30 XP Earned</span>
            </span>
          </div>
          <h3 className="report-title">🎤 Presentation Performance Report</h3>
          <p className="report-topic-sub">Topic: <strong>"{topic?.title || 'Presentation'}"</strong></p>
        </div>

        {/* Overall Score Circle */}
        <div className="report-score-radial">
          <div className="radial-circle">
            <span className="radial-number">{overallScore}</span>
            <span className="radial-denom">/100</span>
          </div>
          <span className="radial-caption">Overall Score</span>
        </div>
      </div>

      {/* 2. Delivery Quick Stats */}
      <div className="report-stats-grid">
        <div className="report-stat-box">
          <Activity size={16} className="stat-icon" />
          <div className="stat-val">{deliveryStats.wordsPerMinute || 0} WPM</div>
          <div className="stat-lbl">Speaking Pace</div>
        </div>
        <div className="report-stat-box">
          <Volume2 size={16} className="stat-icon" />
          <div className="stat-val">{deliveryStats.totalWords || 0}</div>
          <div className="stat-lbl">Total Words Spoken</div>
        </div>
        <div className="report-stat-box">
          <TrendingUp size={16} className="stat-icon" />
          <div className="stat-val">{Math.round(deliveryStats.speakingDurationSeconds || 0)}s</div>
          <div className="stat-lbl">Duration</div>
        </div>
        <div className="report-stat-box">
          <Award size={16} className="stat-icon" />
          <div className="stat-val">{fillerAnalysis.totalFillers ?? 0}</div>
          <div className="stat-lbl">Filler Words</div>
        </div>
      </div>

      {/* 3. 6 Key Communication Dimensions */}
      <div className="report-section-box">
        <h4 className="report-subheading">Skill Competencies (0–100)</h4>
        <div className="dimensions-grid">
          {dimensions.map((dim) => (
            <div key={dim.label} className="dimension-bar-item">
              <div className="dimension-header">
                <span className="dimension-name">{dim.label}</span>
                <span className="dimension-num">{dim.score}%</span>
              </div>
              <div className="dimension-track">
                <div 
                  className="dimension-fill" 
                  style={{ width: `${dim.score}%`, backgroundColor: dim.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Presentation Structure Analysis */}
      <div className="report-section-box">
        <h4 className="report-subheading">Presentation Structure Analysis</h4>
        <p className="report-hint-text">
          A successful presentation follows a logical flow: Hook, Main Point, Supporting Evidence, and Conclusion.
        </p>
        <div className="structure-checklist">
          {structureItems.map(({ key, label, data }) => {
            const isPresent = Boolean(data?.present);
            return (
              <div key={key} className={`structure-item ${isPresent ? 'is-present' : 'is-missing'}`}>
                <div className="structure-icon">
                  {isPresent ? (
                    <CheckCircle2 size={18} className="text-emerald" />
                  ) : (
                    <AlertCircle size={18} className="text-amber" />
                  )}
                </div>
                <div className="structure-content">
                  <div className="structure-header-line">
                    <span className="structure-label">{label}</span>
                    <span className={`structure-pill ${isPresent ? 'pill-success' : 'pill-warning'}`}>
                      {isPresent ? '✓ Included' : '⚠ Needs Improvement'}
                    </span>
                  </div>
                  <p className="structure-feedback">{data?.feedback || (isPresent ? 'Present and well integrated.' : 'Could be clearer or more deliberate.')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Filler Word Analysis */}
      <div className="report-section-box filler-word-box">
        <div className="filler-header-row">
          <h4 className="report-subheading">Filler Word Analysis</h4>
          <span className="filler-count-pill">
            Total: <strong>{fillerAnalysis.totalFillers || 0}</strong>
          </span>
        </div>
        <div className="filler-meta-row">
          <div className="filler-meta-item">
            <span className="filler-meta-lbl">Most Used Filler:</span>
            <span className="filler-meta-val">{fillerAnalysis.mostUsedFiller || 'None detected'}</span>
          </div>
        </div>
        <p className="filler-suggestion-text">
          💡 <strong>Coach Suggestion:</strong> {fillerAnalysis.suggestion || 'Practice conscious pauses when transitioning between points.'}
        </p>
      </div>

      {/* 6. What You Did Well & How To Improve */}
      <div className="report-split-grid">
        {/* Strengths */}
        <div className="report-feedback-col strengths-col">
          <h4 className="feedback-col-title text-emerald">
            <CheckCircle2 size={17} />
            <span>What You Did Well</span>
          </h4>
          <ul className="feedback-list">
            {(whatYouDidWell.length > 0 ? whatYouDidWell : ['Good vocal projection and attempt under timed pressure.']).map((item, idx) => (
              <li key={idx} className="feedback-item strength-item">
                <span className="check-bullet">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="report-feedback-col improvements-col">
          <h4 className="feedback-col-title text-amber">
            <TrendingUp size={17} />
            <span>How To Improve (Max 5)</span>
          </h4>
          <div className="improvements-list">
            {(howToImprove.length > 0 ? howToImprove : [{
              youSaid: 'General statements without examples.',
              better: 'Use specific data or concrete anecdotes: "For example, in my project..."',
              explanation: 'Concrete examples make your ideas memorable and compelling.'
            }]).slice(0, 5).map((imp, idx) => (
              <div key={idx} className="improvement-card">
                <div className="imp-bubble you-said">
                  <span className="imp-tag">You Said:</span>
                  <p className="imp-text">"{imp.youSaid}"</p>
                </div>
                <div className="imp-bubble better-way">
                  <span className="imp-tag">Better Delivery:</span>
                  <p className="imp-text">"{imp.better}"</p>
                </div>
                {imp.explanation && (
                  <p className="imp-explanation">💡 {imp.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. AI Coach Next Practice Advice */}
      {nextPractice && (
        <div className="next-practice-banner">
          <div className="next-practice-icon">🎯</div>
          <div className="next-practice-body">
            <h5>Your Next Practice Focus</h5>
            <p>{nextPractice}</p>
          </div>
        </div>
      )}

      {honestNotice && (
        <div className="honest-notice-text">
          ℹ️ {honestNotice}
        </div>
      )}

      {/* 8. Action Buttons */}
      <div className="report-actions-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onPracticeAgain}
          id="pres-practice-again-btn"
        >
          <RotateCcw size={16} />
          <span>Practice Again</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onTryAnotherTopic}
          id="pres-another-topic-btn"
        >
          <Shuffle size={16} />
          <span>Try Another Topic</span>
        </button>

        <button
          type="button"
          className="btn btn-outline"
          onClick={onBackToChallenges}
          id="pres-back-challenges-btn"
        >
          <ArrowLeft size={16} />
          <span>Back to Challenges</span>
        </button>
      </div>
    </div>
  );
}
