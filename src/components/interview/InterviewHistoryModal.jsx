import React from 'react';
import { X, History, Trash2, ArrowRight } from 'lucide-react';

export default function InterviewHistoryModal({
  isOpen,
  onClose,
  history = [],
  onSelectSession,
  onClearHistory
}) {
  if (!isOpen) return null;

  return (
    <div className="history-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="history-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="history-modal-header">
          <div className="history-modal-title">
            <History size={18} className="text-primary" />
            <span>Interview Practice History</span>
          </div>

          <button
            type="button"
            className="history-close-btn"
            onClick={onClose}
            aria-label="Close history modal"
            id="close-history-modal-btn"
          >
            <X size={20} />
          </button>
        </div>

        <div className="history-modal-body">
          {history.length === 0 ? (
            <div className="history-empty-state">
              <History size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>No mock interviews recorded yet.</p>
              <span style={{ fontSize: '13px' }}>
                Complete an interview to generate your first AI performance report!
              </span>
            </div>
          ) : (
            <div className="history-items-list">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="history-item-row"
                  onClick={() => {
                    onSelectSession(item);
                    onClose();
                  }}
                  role="button"
                  tabIndex={0}
                  id={`history-item-${item.id}`}
                >
                  <div className="history-item-info">
                    <span className="history-role">{item.targetRole || 'Software Developer'}</span>
                    <span className="history-meta">
                      {item.interviewType} • {item.completedQuestions || 5} Questions • {item.date}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="history-score-badge">
                      Score: {item.score ?? 75}
                    </span>
                    <ArrowRight size={15} className="text-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="history-modal-footer">
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {history.length} session{history.length > 1 ? 's' : ''} stored locally
            </span>

            <button
              type="button"
              className="chip-btn"
              onClick={onClearHistory}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)' }}
              id="clear-interview-history-btn"
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
