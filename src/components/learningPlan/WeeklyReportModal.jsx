import React from 'react';
import { X, Trophy, TrendingUp, Clock, Zap, BookOpen, Briefcase, Theater, ArrowRight, Sparkles } from 'lucide-react';

export default function WeeklyReportModal({
  isOpen,
  onClose,
  report = null,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="learning-modal-overlay" onClick={onClose}>
      <div
        className="learning-modal-container weekly-report-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="weekly-report-title"
      >
        <div className="learning-modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge trophy-badge">
              <Trophy size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 id="weekly-report-title" className="modal-title">Weekly Communication Report</h3>
              <p className="modal-subtitle">Comprehensive progress synthesis across all your practice sessions</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="weekly-report-loading">
            <div className="plan-spinner" />
            <p>Synthesizing your weekly communication analytics...</p>
          </div>
        ) : report ? (
          <div className="weekly-report-content">
            {/* Top Stat Banner */}
            <div className="report-summary-box">
              <Sparkles size={20} className="text-amber-400 flex-shrink-0" />
              <p>{report.summary}</p>
            </div>

            {/* Core Metrics Grid */}
            <div className="report-metrics-grid">
              <div className="report-metric-card">
                <div className="metric-icon-wrap bg-blue">
                  <Clock size={18} />
                </div>
                <div className="metric-content">
                  <div className="metric-val">{report.practiceMinutes} min</div>
                  <div className="metric-lbl">Total Speaking Time</div>
                </div>
              </div>

              <div className="report-metric-card">
                <div className="metric-icon-wrap bg-purple">
                  <Zap size={18} />
                </div>
                <div className="metric-content">
                  <div className="metric-val">+{report.xpEarned} XP</div>
                  <div className="metric-lbl">XP Earned This Week</div>
                </div>
              </div>

              <div className="report-metric-card">
                <div className="metric-icon-wrap bg-emerald">
                  <TrendingUp size={18} />
                </div>
                <div className="metric-content">
                  <div className="metric-val">{report.sessionsCompleted}</div>
                  <div className="metric-lbl">Sessions Completed</div>
                </div>
              </div>

              <div className="report-metric-card">
                <div className="metric-icon-wrap bg-amber">
                  <BookOpen size={18} />
                </div>
                <div className="metric-content">
                  <div className="metric-val">{report.vocabularyLearned} ({report.vocabularyMastered} mastered)</div>
                  <div className="metric-lbl">Words Expanded</div>
                </div>
              </div>
            </div>

            {/* Breakdown of Practice Across Modules */}
            <div className="report-breakdown-section">
              <h4 className="report-section-title">Session Distribution</h4>
              <div className="report-pill-grid">
                <div className="report-pill">
                  <Briefcase size={16} />
                  <span><strong>{report.interviewsCompleted}</strong> Interviews</span>
                </div>
                <div className="report-pill">
                  <Theater size={16} />
                  <span><strong>{report.roleplaysCompleted}</strong> Roleplays</span>
                </div>
                <div className="report-pill">
                  <Clock size={16} />
                  <span><strong>{report.speakingSessions}</strong> Speaking Drills</span>
                </div>
                <div className="report-pill">
                  <Trophy size={16} />
                  <span><strong>{report.presentationsCompleted || 0}</strong> Presentations</span>
                </div>
              </div>
            </div>

            {/* Trajectory & Comparison */}
            <div className="report-trajectory-grid">
              <div className="trajectory-card positive">
                <div className="trajectory-label">Fluency Trajectory</div>
                <div className="trajectory-value">{report.fluencyImprovement || '+6%'}</div>
                <div className="trajectory-desc">Reduced hesitation and longer phrase chains</div>
              </div>
              <div className="trajectory-card positive">
                <div className="trajectory-label">Grammar Precision</div>
                <div className="trajectory-value">{report.grammarImprovement || '+4%'}</div>
                <div className="trajectory-desc">Higher tense and preposition accuracy</div>
              </div>
            </div>

            {/* Strongest vs Attention */}
            <div className="skills-comparison-wrap">
              <div className="skill-compare-item strength-item">
                <span className="skill-badge-tag green">Strongest Area</span>
                <h4>{report.strongestSkill}</h4>
                <p>Consistently high accuracy and natural phrasing observed in recordings.</p>
              </div>

              <div className="skill-compare-item attention-item">
                <span className="skill-badge-tag amber">Focus Area</span>
                <h4>{report.weakestSkill}</h4>
                <p>Growth opportunity: targeted practice here will create rapid breakthrough.</p>
              </div>
            </div>

            {/* Next Week Recommendation */}
            <div className="next-week-recommendation">
              <div className="next-week-header">
                <ArrowRight size={16} className="text-primary" />
                <span>Recommended Focus For Next Week</span>
              </div>
              <div className="next-week-content">
                {report.recommendedFocusNextWeek}
              </div>
            </div>
          </div>
        ) : null}

        <div className="learning-modal-footer">
          <button type="button" className="btn-primary-plan w-full" onClick={onClose}>
            Got It, Back to Learning Plan
          </button>
        </div>
      </div>
    </div>
  );
}
