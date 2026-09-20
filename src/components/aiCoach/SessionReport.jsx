import React from 'react';
import { 
  Clock, MessageSquare, CheckCircle2, AlertTriangle, 
  ArrowRight, RotateCcw, Sparkles, X, Target, Gauge, Zap
} from 'lucide-react';
import './SessionReport.css';

export default function SessionReport({ 
  report, 
  onPracticeAgain, 
  onStartRecommendedPractice, 
  onClose 
}) {
  if (!report) return null;

  const speakingMetrics = report.speakingMetrics || {};

  return (
    <div className="session-report-overlay" onClick={onClose}>
      <div className="session-report-card card" onClick={(e) => e.stopPropagation()}>
        {/* Header banner */}
        <div className="report-header-banner">
          <div className="report-title-row">
            <span className="report-pill">
              <Sparkles size={14} />
              AI Communication Analysis
            </span>
            <button type="button" className="report-close-btn" onClick={onClose} aria-label="Close report">
              <X size={18} />
            </button>
          </div>
          <h2 className="report-title">Your Performance Report</h2>
          <p className="report-subtext">
            Comprehensive AI breakdown of your spoken delivery, pacing, vocabulary, and grammar.
          </p>

          {/* Key Quick Stats Strip */}
          <div className="report-stats-strip">
            <div className="stat-pill">
              <Clock size={14} />
              <span>Duration: <strong>{report.durationFormatted || '02:15'}</strong></span>
            </div>
            <div className="stat-pill">
              <MessageSquare size={14} />
              <span>Turns: <strong>{report.studentMessagesCount || report.totalMessages || 1}</strong></span>
            </div>
            <div className="stat-pill">
              <Zap size={14} />
              <span>Words: <strong>{speakingMetrics.totalWords ?? 0}</strong></span>
            </div>
            <div className="stat-pill">
              <Gauge size={14} />
              <span>Pace: <strong>{speakingMetrics.wpm ?? 0} WPM</strong></span>
            </div>
            <div className="stat-pill">
              <span>Fillers: <strong>{speakingMetrics.fillerCount ?? 0}</strong></span>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="report-body">
          {/* Main Score & Categories */}
          <div className="report-scores-container">
            <div className="report-main-score">
              <span className="score-lbl">Overall Communication Score</span>
              <div className="score-big-wrap">
                <span className="score-number">{report.overallScore || 78}</span>
                <span className="score-denom">/100</span>
              </div>
              <span className="score-badge">{report.performanceLevel || 'Clear Communicator'}</span>
            </div>

            <div className="report-categories-list">
              <div className="category-row">
                <div className="cat-title-val">
                  <span>Grammar</span>
                  <strong>{report.categories?.grammar || 75}%</strong>
                </div>
                <div className="cat-track">
                  <div className="cat-fill fill-indigo" style={{ width: `${report.categories?.grammar || 75}%` }}></div>
                </div>
              </div>

              <div className="category-row">
                <div className="cat-title-val">
                  <span>Vocabulary</span>
                  <strong>{report.categories?.vocabulary || 72}%</strong>
                </div>
                <div className="cat-track">
                  <div className="cat-fill fill-cyan" style={{ width: `${report.categories?.vocabulary || 72}%` }}></div>
                </div>
              </div>

              <div className="category-row">
                <div className="cat-title-val">
                  <span>Fluency & Pacing</span>
                  <strong>{report.categories?.fluency || 81}%</strong>
                </div>
                <div className="cat-track">
                  <div className="cat-fill fill-amber" style={{ width: `${report.categories?.fluency || 81}%` }}></div>
                </div>
              </div>

              <div className="category-row">
                <div className="cat-title-val">
                  <span>Clarity</span>
                  <strong>{report.categories?.clarity || 84}%</strong>
                </div>
                <div className="cat-track">
                  <div className="cat-fill fill-emerald" style={{ width: `${report.categories?.clarity || 84}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Qualitative Feedback */}
          <div className="report-insights-grid">
            <div className="insight-box well-box">
              <div className="insight-box-header">
                <CheckCircle2 size={16} className="text-emerald" />
                <h4>What You Did Well</h4>
              </div>
              <ul className="insight-items">
                {report.whatYouDidWell?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="insight-box improve-box">
              <div className="insight-box-header">
                <AlertTriangle size={16} className="text-amber" />
                <h4>Improve Next Time</h4>
              </div>
              <ul className="insight-items">
                {report.improveNextTime?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Targeted Phrasing Corrections */}
          {report.correctionsList && report.correctionsList.length > 0 && (
            <div className="report-corrections-container">
              <h4 className="corrections-title">💡 Targeted Speaking & Phrasing Tips</h4>
              <div className="corrections-list-wrap">
                {report.correctionsList.map((c, idx) => (
                  <div key={idx} className="report-correction-item">
                    <div className="correction-before-after">
                      <div className="correction-row original">
                        <span className="correction-tag">You said:</span>
                        <p className="correction-text">"{c.studentSaid}"</p>
                      </div>
                      <div className="correction-row improved">
                        <span className="correction-tag">Polished:</span>
                        <p className="correction-text">"{c.better}"</p>
                      </div>
                    </div>
                    {c.reason && (
                      <p className="correction-reason">{c.reason}</p>
                    )}
                    {onStartRecommendedPractice && (
                      <div className="correction-action-footer">
                        <button
                          type="button"
                          className="correction-practice-btn"
                          onClick={() => onStartRecommendedPractice(c.better)}
                          title="Practice speaking this polished sentence"
                        >
                          <Target size={13} />
                          <span>Practice This Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Practice Section */}
          {report.recommendedPractice && (
            <div className="recommended-practice-banner">
              <div className="rec-text-wrap">
                <span className="rec-badge">
                  <Target size={14} />
                  Recommended Next Practice
                </span>
                <p className="rec-action-text">"{report.recommendedPractice}"</p>
              </div>
              {onStartRecommendedPractice && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onStartRecommendedPractice(report.recommendedPractice)}
                >
                  <span>Practice This Now</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="report-footer-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            <span>Close Report</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onPracticeAgain}
          >
            <RotateCcw size={15} />
            <span>Practice Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
