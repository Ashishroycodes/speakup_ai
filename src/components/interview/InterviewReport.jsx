import React from 'react';
import { 
  CheckCircle2, AlertTriangle, TrendingUp, 
  RotateCcw, Sparkles, Shield, MessageSquare, 
  Check, BookOpen, Mic, Target
} from 'lucide-react';

export default function InterviewReport({
  report,
  config,
  onPracticeAgain,
  onPracticeWeakAreas,
  onNavigateToCoach,
  onNavigateToPractice,
  onNavigateToProgress
}) {
  if (!report) {
    return (
      <div className="completed-card">
        <p>No report generated yet.</p>
        <button type="button" className="btn btn-primary" onClick={onPracticeAgain}>
          Start New Interview
        </button>
      </div>
    );
  }

  const {
    overallScore = 75,
    scores = {},
    summary = '',
    questionFeedback = [],
    communicationMetrics = {},
    strengths = [],
    improvementPlan = [],
    honestEvaluationNotice = "Scores are calculated based on your spoken/written answers, vocabulary diversity, and structural clarity."
  } = report;

  const {
    targetRole = 'Software Developer',
    interviewType = 'HR Interview',
    difficulty = 'Medium',
    experienceLevel: _experienceLevel = 'Beginner'
  } = config || {};

  const competencyList = [
    { key: 'communication', name: 'Communication', score: scores.communication ?? 75, color: '#4F46E5' },
    { key: 'grammar', name: 'Grammar', score: scores.grammar ?? 72, color: '#06B6D4' },
    { key: 'fluency', name: 'Fluency', score: scores.fluency ?? 78, color: '#10B981' },
    { key: 'vocabulary', name: 'Vocabulary', score: scores.vocabulary ?? 74, color: '#F59E0B' },
    { key: 'answerQuality', name: 'Answer Quality', score: scores.answerQuality ?? 76, color: '#8B5CF6' },
    { key: 'confidence', name: 'Confidence', score: scores.confidence ?? 73, color: '#3B82F6' },
    { key: 'relevance', name: 'Relevance', score: scores.relevance ?? 80, color: '#EC4899' },
    { key: 'clarity', name: 'Clarity', score: scores.clarity ?? 77, color: '#14B8A6' }
  ];

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 65) return 'mid';
    return 'low';
  };

  const getScoreLevelText = (score) => {
    if (score >= 85) return 'Interview Ready (Advanced)';
    if (score >= 70) return 'Solid Foundation (Intermediate)';
    return 'Needs Focused Practice';
  };

  // Radial calculation for overall score circle
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="report-view" id="interview-report-container">
      {/* 1. Header Overview Hero Card */}
      <div className="report-hero-card">
        {/* Radial Overall Score */}
        <div className="report-radial-wrap">
          <div className="report-radial-score">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="var(--bg-muted)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="url(#reportScoreGrad)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
              <defs>
                <linearGradient id="reportScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="report-score-center">
              <span className="score-big">{overallScore}</span>
              <span className="score-denom">/100</span>
            </div>
          </div>

          <div className={`score-status-pill ${getScoreBadgeClass(overallScore)}`}>
            <Sparkles size={13} />
            <span>{getScoreLevelText(overallScore)}</span>
          </div>
        </div>

        {/* Hero Context & Summary */}
        <div className="report-hero-info">
          <span className="report-role-tag">
            {targetRole} • {interviewType} ({difficulty})
          </span>
          <h2 className="report-main-heading">Mock Interview Evaluation Report</h2>
          <p className="report-summary-text">{summary}</p>
          <div className="report-notice-alert">
            <Shield size={14} className="text-primary" />
            <span>{honestEvaluationNotice}</span>
          </div>
        </div>
      </div>

      {/* 2. 8-Dimensional Competency Scores */}
      <div className="competencies-card">
        <h3 className="competencies-title">Key Competencies Evaluation</h3>
        <div className="competencies-grid">
          {competencyList.map((comp) => (
            <div key={comp.key} className="competency-item">
              <div className="comp-header">
                <span className="comp-name">{comp.name}</span>
                <span className="comp-score">{comp.score}%</span>
              </div>
              <div className="comp-track">
                <div
                  className="comp-fill"
                  style={{ width: `${comp.score}%`, backgroundColor: comp.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Strengths & Communication Analysis Row */}
      <div className="report-insights-grid">
        {/* Left: Your Strengths */}
        <div className="insight-card">
          <h3 className="insight-card-title">
            <CheckCircle2 size={18} className="text-accent-emerald" />
            <span>Your Key Strengths</span>
          </h3>
          <div className="strengths-list">
            {strengths.map((str, idx) => (
              <div key={idx} className="strength-item">
                <Check size={16} className="strength-icon" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Communication & Grammar Analysis */}
        <div className="insight-card">
          <h3 className="insight-card-title">
            <MessageSquare size={18} className="text-primary" />
            <span>Communication & Grammar Highlights</span>
          </h3>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ padding: '8px 12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Words</span>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                {communicationMetrics.totalWords || 0}
              </div>
            </div>
            <div style={{ padding: '8px 12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Speech Pace</span>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                {communicationMetrics.wpm || 0} WPM
              </div>
            </div>
            <div style={{ padding: '8px 12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Filler Words</span>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                {communicationMetrics.fillerCount || 0}
              </div>
            </div>
          </div>

          {communicationMetrics.grammarCorrections && communicationMetrics.grammarCorrections.length > 0 ? (
            <div className="grammar-corrections-list">
              {communicationMetrics.grammarCorrections.slice(0, 5).map((corr, idx) => (
                <div key={idx} className="grammar-item">
                  <div className="grammar-orig">"{corr.original}"</div>
                  <div className="grammar-fix">✓ Better: "{corr.improved}"</div>
                  <div className="grammar-explain">{corr.explanation}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              ✓ No major grammatical flaws detected. Communication was natural and clear!
            </p>
          )}
        </div>
      </div>

      {/* 4. Question-Wise Detailed Feedback */}
      <div className="questions-feedback-card">
        <h3 className="competencies-title">Question-by-Question Breakdown</h3>
        <div className="qa-feedback-list">
          {questionFeedback.map((qa, idx) => (
            <div key={idx} className="qa-feedback-item">
              <div className="qa-header-row">
                <span className="qa-num-badge">Question {qa.questionNumber || (idx + 1)}</span>
              </div>

              <div className="qa-question-text">{qa.question}</div>

              {/* Candidate Answer snippet */}
              <div className="qa-answer-block">
                <strong>Your Answer: </strong>
                <span>{qa.candidateAnswer}</span>
              </div>

              {/* Good vs Improve Critique */}
              <div className="qa-critique-grid">
                <div className="critique-col good">
                  <div className="critique-col-title">
                    <CheckCircle2 size={14} />
                    <span>What was good</span>
                  </div>
                  <ul className="critique-list">
                    {(qa.whatWasGood || []).map((g, gIdx) => (
                      <li key={gIdx}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div className="critique-col improve">
                  <div className="critique-col-title">
                    <AlertTriangle size={14} />
                    <span>What could be improved</span>
                  </div>
                  <ul className="critique-list">
                    {(qa.whatCouldBeImproved || []).map((imp, impIdx) => (
                      <li key={impIdx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* STAR Analysis for behavioral questions */}
              {qa.starAnalysis && (
                <div className="star-analysis-box">
                  <div className="star-badges-row">
                    <span className={`star-pill ${qa.starAnalysis.situation ? 'passed' : 'missed'}`}>
                      Situation {qa.starAnalysis.situation ? '✓' : '✕'}
                    </span>
                    <span className={`star-pill ${qa.starAnalysis.task ? 'passed' : 'missed'}`}>
                      Task {qa.starAnalysis.task ? '✓' : '✕'}
                    </span>
                    <span className={`star-pill ${qa.starAnalysis.action ? 'passed' : 'missed'}`}>
                      Action {qa.starAnalysis.action ? '✓' : '✕'}
                    </span>
                    <span className={`star-pill ${qa.starAnalysis.result ? 'passed' : 'missed'}`}>
                      Result {qa.starAnalysis.result ? '✓' : '✕'}
                    </span>
                  </div>
                  {qa.starAnalysis.feedback && (
                    <div className="star-advice">{qa.starAnalysis.feedback}</div>
                  )}
                </div>
              )}

              {/* Better Structure Recommendation */}
              {qa.betterAnswerApproach && (
                <div className="better-structure-box">
                  <strong>Recommended Answer Structure: </strong>
                  <span>{qa.betterAnswerApproach}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. 5-Day Improvement Plan */}
      <div className="plan-card">
        <h3 className="competencies-title">Your 5-Day Interview Improvement Plan</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Personalized daily drills designed according to your weak areas and role requirements:
        </p>

        <div className="plan-days-list">
          {(improvementPlan || []).map((plan, idx) => (
            <div key={idx} className="plan-day-item">
              <span className="plan-day-badge">{plan.day || `Day ${idx + 1}`}</span>
              <div className="plan-day-title">{plan.title}</div>
              <div className="plan-day-focus">{plan.focus}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Action Buttons Navigation Footer */}
      <div className="report-actions-footer">
        <button
          type="button"
          className="report-action-btn primary"
          onClick={onPracticeAgain}
          id="report-practice-again-btn"
        >
          <RotateCcw size={16} />
          <span>Practice Again</span>
        </button>

        <button
          type="button"
          className="report-action-btn secondary"
          onClick={onPracticeWeakAreas}
          id="report-weak-areas-btn"
        >
          <Target size={16} />
          <span>Practice Weak Areas</span>
        </button>

        <button
          type="button"
          className="report-action-btn secondary"
          onClick={onNavigateToCoach}
          id="report-coach-btn"
        >
          <Mic size={16} />
          <span>AI Communication Coach</span>
        </button>

        <button
          type="button"
          className="report-action-btn secondary"
          onClick={onNavigateToPractice}
          id="report-practice-btn"
        >
          <BookOpen size={16} />
          <span>Speaking Practice</span>
        </button>

        <button
          type="button"
          className="report-action-btn secondary"
          onClick={onNavigateToProgress}
          id="report-progress-btn"
        >
          <TrendingUp size={16} />
          <span>View Progress</span>
        </button>
      </div>
    </div>
  );
}
