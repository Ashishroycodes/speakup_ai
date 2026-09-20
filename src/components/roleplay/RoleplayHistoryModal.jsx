import React from 'react';
import { X, History, Trash2, ArrowRight } from 'lucide-react';

export default function RoleplayHistoryModal({
  isOpen,
  onClose,
  history = [],
  onSelectSession,
  onClearHistory
}) {
  if (!isOpen) return null;

  return (
    <div className="roleplay-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="roleplay-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9' }}>
            <History size={18} style={{ color: '#818cf8' }} />
            <span>Roleplay Practice History</span>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close history modal"
            id="close-roleplay-history-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8' }}>
              <History size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>No roleplay sessions recorded yet.</p>
              <span style={{ fontSize: '13px' }}>
                Complete a roleplay to generate your first communication performance report!
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '0.85rem',
                    padding: '0.9rem 1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => {
                    onSelectSession(item);
                    onClose();
                  }}
                  role="button"
                  tabIndex={0}
                  id={`roleplay-history-item-${item.id}`}
                >
                  <div>
                    <span style={{ display: 'block', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem', marginBottom: '2px' }}>
                      {item.scenario}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {item.character} • {item.totalTurns || 4} Turns • {item.date}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#a5b4fc',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '0.5rem'
                    }}>
                      Score: {item.score ?? 78}
                    </span>
                    <ArrowRight size={15} style={{ color: '#94a3b8' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {history.length} session{history.length > 1 ? 's' : ''} stored locally
            </span>

            <button
              type="button"
              onClick={onClearHistory}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
              id="clear-roleplay-history-btn"
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
