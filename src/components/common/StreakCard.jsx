import React, { useState, useMemo, useEffect } from 'react';
import { Flame, Check, RotateCcw, Trophy, ArrowRight, Sparkles, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import './StreakCard.css';

import { getWeekDays, getStreakMilestone, getStreakTier } from '../../utils/streakUtils.js';

export default function StreakCard({
  streak = 0,
  longestStreak = 0,
  streakDays = {},
  lastPracticeDate = null,
  xp = 0,
  onResetStreak,
  onAdvanceStreak,
  onStartPractice
}) {
  const [showResetModal, setShowResetModal] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // 7-day week calculation
  const weekDays = useMemo(() => {
    return getWeekDays(streakDays, lastPracticeDate);
  }, [streakDays, lastPracticeDate]);

  // Today's completion status
  const todayItem = weekDays.find((d) => d.isToday);
  const isTodayCompleted = todayItem?.isCompleted || false;

  // Milestone calculation
  const milestone = useMemo(() => getStreakMilestone(streak), [streak]);
  const tier = useMemo(() => getStreakTier(streak), [streak]);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!feedbackToast) return;
    const timer = setTimeout(() => setFeedbackToast(null), 4000);
    return () => clearTimeout(timer);
  }, [feedbackToast]);

  const handleOpenResetModal = () => {
    setShowResetModal(true);
  };

  const handleCloseResetModal = () => {
    setShowResetModal(false);
  };

  const handleConfirmReset = () => {
    if (onResetStreak) {
      onResetStreak();
      setFeedbackToast({
        type: 'success',
        message: 'Day streak has been reset to 0. You are ready to start a fresh streak!'
      });
    }
    setShowResetModal(false);
  };

  const handleAdvance = () => {
    if (onAdvanceStreak) {
      onAdvanceStreak();
      setFeedbackToast({
        type: 'info',
        message: `Streak simulated! Current streak is now ${streak + 1} days.`
      });
    }
  };

  return (
    <div className="streak-card-component" id="streak-card">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className={`streak-toast-banner ${feedbackToast.type}`} role="alert">
          <div className="toast-content-inner">
            <CheckCircle2 size={16} className="toast-icon" />
            <span>{feedbackToast.message}</span>
          </div>
          <button
            type="button"
            className="toast-dismiss-btn"
            onClick={() => setFeedbackToast(null)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Header Row */}
      <div className="streak-header-row">
        <div className="streak-identity-group">
          <div className={`streak-flame-wrapper ${streak > 0 ? 'flame-lit' : 'flame-idle'}`}>
            <Flame size={26} className="flame-icon-active" />
          </div>

          <div className="streak-titles-block">
            <div className="streak-count-heading">
              <span className="streak-count-number">{streak}</span>
              <span className="streak-count-unit">Day Streak</span>
              <span className={`streak-tier-badge tier-${tier.color}`}>{tier.badge}</span>
            </div>
            <p className="streak-subtitle-text">
              {streak === 0
                ? 'Complete your first practice session today to ignite your streak!'
                : 'Practice every calendar day to keep your speaking momentum alive.'}
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="streak-header-actions">
          {/* Personal Best Record */}
          <div className="streak-record-pill" title="All-time personal best consecutive days">
            <Trophy size={14} className="trophy-icon" />
            <span className="record-label">Personal Best:</span>
            <span className="record-value">{Math.max(longestStreak, streak)} days</span>
          </div>

          {/* Test Advance Streak Button (for evaluation/testing) */}
          {onAdvanceStreak && (
            <button
              type="button"
              id="advance-streak-test-btn"
              className="streak-advance-test-btn"
              onClick={handleAdvance}
              title="Test: Advance streak by +1 day"
            >
              <Sparkles size={12} />
              <span>+1 Day (Test)</span>
            </button>
          )}

          {/* Reset Streak Button */}
          {onResetStreak && (
            <button
              type="button"
              id="reset-streak-btn"
              className="streak-reset-btn"
              onClick={handleOpenResetModal}
              title="Reset day streak counter"
            >
              <RotateCcw size={13} />
              <span>Reset Streak</span>
            </button>
          )}
        </div>
      </div>

      {/* Daily Status Alert Banner */}
      <div className={`streak-daily-status-banner ${isTodayCompleted ? 'completed' : 'pending'}`}>
        <div className="status-banner-left">
          <div className="status-pulse-dot"></div>
          <span className="status-banner-text">
            {isTodayCompleted ? (
              <>
                <strong>Streak protected!</strong> You completed your communication practice for today.
              </>
            ) : (
              <>
                <strong>Action needed today:</strong> Complete at least 1 practice session to extend your streak!
              </>
            )}
          </span>
        </div>

        {!isTodayCompleted && onStartPractice && (
          <button
            type="button"
            className="streak-quick-practice-btn"
            onClick={onStartPractice}
            id="streak-practice-now-btn"
          >
            <span>Practice Now</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* 7-Day Calendar Strip (Mon - Sun) */}
      <div className="streak-days-container">
        <div className="streak-track-label-row">
          <span className="track-title">Weekly Practice Track</span>
          <span className="track-hint">Mon – Sun Calendar Week</span>
        </div>

        <div className="streak-days-track" role="list">
          {weekDays.map((day) => {
            let statusClass = 'pending';
            if (day.isCompleted) statusClass = 'completed';
            else if (day.isPast) statusClass = 'missed';
            else if (day.isToday) statusClass = 'today-pending';

            return (
              <div
                key={day.key}
                role="listitem"
                className={`streak-day-item ${statusClass} ${day.isToday ? 'is-today' : ''}`}
                title={`${day.label} (${day.dateNum}): ${
                  day.isCompleted
                    ? 'Completed'
                    : day.isToday
                    ? 'Today - Practice pending'
                    : day.isPast
                    ? 'Missed'
                    : 'Upcoming'
                }`}
              >
                {day.isToday && <span className="today-chip">Today</span>}

                <span className="day-name">{day.label}</span>
                <span className="day-date-number">{day.dateNum}</span>

                <div className="day-status-circle">
                  {day.isCompleted ? (
                    <Check size={14} className="check-icon" />
                  ) : day.isToday ? (
                    <span className="today-ring-dot"></span>
                  ) : (
                    <span className="circle-placeholder">○</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Progress Bar */}
      <div className="streak-milestone-footer">
        <div className="milestone-text-row">
          <div className="milestone-goal-name">
            <span className="milestone-icon">{milestone.icon}</span>
            <span className="milestone-label">
              Next Goal: <strong>{milestone.name}</strong>
            </span>
          </div>

          <div className="milestone-remaining-label">
            {milestone.isCompleted ? (
              <span className="goal-achieved-badge">Mastered! 🏆</span>
            ) : (
              <span>
                <strong>{milestone.daysRemaining}</strong> {milestone.daysRemaining === 1 ? 'day' : 'days'} remaining
              </span>
            )}
          </div>
        </div>

        <div className="milestone-progress-track">
          <div
            className="milestone-progress-fill"
            style={{ width: `${milestone.percent}%` }}
            role="progressbar"
            aria-valuenow={milestone.percent}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      {/* Confirmation Modal for Reset Streak */}
      {showResetModal && (
        <div className="streak-modal-backdrop" onClick={handleCloseResetModal}>
          <div
            className="streak-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
          >
            <div className="streak-modal-header">
              <div className="modal-alert-icon-box">
                <AlertTriangle size={22} className="alert-triangle-icon" />
              </div>
              <h3 id="reset-modal-title">Reset Day Streak?</h3>
              <button
                type="button"
                className="streak-modal-close"
                onClick={handleCloseResetModal}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="streak-modal-body">
              <p>
                Are you sure you want to reset your practice streak? This will set your current streak to{' '}
                <strong>0 days</strong> and clear this week's checklist.
              </p>

              <div className="modal-safe-box">
                <div className="safe-box-item">
                  <Check size={14} className="safe-check" />
                  <span>
                    Your all-time personal best record of <strong>{Math.max(longestStreak, streak)} days</strong> will be preserved.
                  </span>
                </div>
                <div className="safe-box-item">
                  <Check size={14} className="safe-check" />
                  <span>
                    Your earned XP (<strong>{xp} XP</strong>), badges, and vocabulary history are 100% safe.
                  </span>
                </div>
              </div>
            </div>

            <div className="streak-modal-actions">
              <button
                type="button"
                className="btn btn-secondary modal-cancel-btn"
                onClick={handleCloseResetModal}
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-reset-streak-btn"
                className="btn btn-danger modal-confirm-reset-btn"
                onClick={handleConfirmReset}
              >
                <RotateCcw size={15} />
                <span>Yes, Reset Streak</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
