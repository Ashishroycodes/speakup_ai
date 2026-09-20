import React from 'react';
import { CheckCircle2, AlertTriangle, RotateCcw, ArrowRight, Sparkles, TrendingUp, X } from 'lucide-react';
import './FeedbackCard.css';

export default function FeedbackCard({ 
  score = 78, 
  transcript = '', 
  onTryAgain, 
  onPracticeAnother, 
  onClose,
  topicTitle = ''
}) {
  const categories = [
    { name: 'Grammar', score: 75, color: 'indigo' },
    { name: 'Fluency', score: 80, color: 'cyan' },
    { name: 'Vocabulary', score: 70, color: 'amber' },
    { name: 'Clarity', score: 82, color: 'emerald' }
  ];

  const whatYouDidWell = [
    'Clear introduction and logical opening hook',
    'Good sentence structure and coherent transition of ideas'
  ];

  const improveThis = [
    'Avoid repeated filler words (such as "um", "like", or repeating phrases)',
    'Use more varied vocabulary to enrich descriptions',
    'Speak with fewer pauses between key points to maintain momentum'
  ];

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-card-container card" onClick={(e) => e.stopPropagation()}>
        {/* Top Celebration Bar */}
        <div className="feedback-top-banner">
          <div className="celebration-title-row">
            <span className="celebration-badge">
              <Sparkles size={16} />
              Session Complete
            </span>
            <button className="feedback-close-btn" onClick={onClose} aria-label="Close feedback">
              <X size={18} />
            </button>
          </div>
          <h2 className="feedback-heading">Practice Completed 🎉</h2>
          <p className="feedback-subheading">
            Great job on "{topicTitle || 'Speaking Practice'}"! Here is your communication breakdown.
          </p>
          <div className="xp-awarded-pill">
            <TrendingUp size={15} />
            <span>+15 XP Earned</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="feedback-body-content">
          {/* Main Score & Radar/Categories Row */}
          <div className="feedback-score-grid">
            {/* Overall Communication Score */}
            <div className="overall-score-box">
              <span className="score-label">Communication Score</span>
              <div className="score-circle">
                <span className="score-big-num">{score}</span>
                <span className="score-denom">/100</span>
              </div>
              <span className="score-grade-pill">Strong Communicator</span>
            </div>

            {/* Categories breakdown */}
            <div className="categories-breakdown-box">
              <span className="breakdown-title">Feedback Categories</span>
              <div className="categories-list">
                {categories.map((cat) => (
                  <div key={cat.name} className="cat-metric-row">
                    <div className="cat-metric-labels">
                      <span className="cat-metric-name">{cat.name}</span>
                      <span className="cat-metric-val">{cat.score}</span>
                    </div>
                    <div className="cat-track">
                      <div 
                        className={`cat-fill fill-${cat.color}`} 
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Qualitative Feedback Cards (What you did well / Improve this) */}
          <div className="feedback-insights-grid">
            <div className="insight-card well-card">
              <div className="insight-header">
                <CheckCircle2 size={18} className="insight-icon well-icon" />
                <h4>What you did well</h4>
              </div>
              <ul className="insight-list">
                {whatYouDidWell.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="insight-card improve-card">
              <div className="insight-header">
                <AlertTriangle size={18} className="insight-icon improve-icon" />
                <h4>Improve this</h4>
              </div>
              <ul className="insight-list">
                {improveThis.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transcript review */}
          {transcript && (
            <div className="feedback-transcript-preview">
              <span className="transcript-preview-label">Your Transcript Recorded:</span>
              <p className="transcript-preview-text">"{transcript}"</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="feedback-actions-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onTryAgain}
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onPracticeAnother}
          >
            <span>Practice Another Topic</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
