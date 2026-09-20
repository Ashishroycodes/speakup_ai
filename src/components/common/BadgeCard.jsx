import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import './BadgeCard.css';

export default function BadgeCard({ badge, isUnlocked }) {
  return (
    <div 
      className={`badge-card-item ${isUnlocked ? 'unlocked' : 'locked'}`}
      title={isUnlocked ? `${badge.title}: Unlocked!` : `${badge.title}: Complete requirement to unlock`}
    >
      <div className="badge-icon-bubble">
        <span className="badge-emoji-symbol">{badge.icon}</span>
        {!isUnlocked && (
          <div className="badge-lock-overlay">
            <Lock size={12} className="lock-icon" />
          </div>
        )}
      </div>

      <div className="badge-text-details">
        <div className="badge-title-row">
          <span className="badge-item-title">{badge.title}</span>
          {isUnlocked && <CheckCircle2 size={13} className="unlocked-check-icon" />}
        </div>
        <p className="badge-item-desc">{badge.description}</p>
      </div>
    </div>
  );
}
