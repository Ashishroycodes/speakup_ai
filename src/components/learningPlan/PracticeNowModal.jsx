import React from 'react';
import { X, Sparkles, Clock, Target, ArrowRight } from 'lucide-react';

export default function PracticeNowModal({
  isOpen,
  onClose,
  recommendation = null,
  loading = false,
  onStartPractice
}) {
  if (!isOpen) return null;

  return (
    <div className="learning-modal-overlay" onClick={onClose}>
      <div
        className="learning-modal-container practice-now-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="practice-now-title"
      >
        <div className="learning-modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge spark-badge">
              <Sparkles size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 id="practice-now-title" className="modal-title">What Should I Practice Now?</h3>
              <p className="modal-subtitle">AI recommended high-impact practice based on your latest metrics</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="practice-now-loading">
            <div className="plan-spinner" />
            <p>Analyzing your latest sessions to pinpoint the highest leverage practice...</p>
          </div>
        ) : recommendation ? (
          <div className="practice-now-body">
            <div className="practice-recommendation-card">
              <div className="recommendation-badge-row">
                <span className="skill-pill-tag">
                  <Target size={14} />
                  {recommendation.skill || 'Fluency'}
                </span>
                <span className="time-pill-tag">
                  <Clock size={14} />
                  {recommendation.estimatedMinutes || 5} min
                </span>
              </div>

              <h3 className="recommendation-title">{recommendation.title}</h3>
              
              <div className="recommendation-reason-box">
                <p className="reason-text">
                  <strong>Why this now:</strong> {recommendation.reason}
                </p>
              </div>

              <div className="recommendation-action-area">
                <button
                  type="button"
                  className="btn-start-action"
                  onClick={() => {
                    onClose();
                    if (onStartPractice) {
                      onStartPractice(recommendation.targetModule || 'practice', recommendation.targetPayload || '');
                    }
                  }}
                >
                  <span>Start Practice Now</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
