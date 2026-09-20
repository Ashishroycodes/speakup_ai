import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Palette, Calendar, Mic, Target, FileText, RotateCcw, 
  CheckCircle2, Clock, Plus, Trash2, Volume2, 
  Sparkles, Download, AlertTriangle
} from 'lucide-react';
import { playRealVoiceAudio, stopCurrentVoiceAudio } from '../../services/voiceService';
import './MenuBarDrawer.css';

export default function MenuBarDrawer({
  isOpen,
  onClose,
  theme,
  setTheme,
  themes,
  timetableHook,
  progressHook,
  _onNavigateSection,
  initialTab = 'themes'
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showConfirmReset, setShowConfirmReset] = useState(null); // 'all' | 'streak' | 'xp' | 'both' | 'timetable' | null

  // Synchronize tab if initialTab changes during open transitions
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  if (prevInitialTab !== initialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  // Audio Lab State
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [isPlayingTestVoice, setIsPlayingTestVoice] = useState(false);
  const micStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);
  const [nowTimestamp] = useState(() => Date.now());

  // Exam Countdown State
  const [examGoal, setExamGoal] = useState(() => {
    try {
      const saved = localStorage.getItem('speakup_exam_goal_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      title: 'Campus Placement & Job Interviews',
      targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      dailyTargetMinutes: 15
    };
  });

  // Custom Timetable block input state
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlotTitle, setNewSlotTitle] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('04:00 PM');
  const [newSlotDuration, setNewSlotDuration] = useState('10 min');

  // Save exam goal
  useEffect(() => {
    try {
      localStorage.setItem('speakup_exam_goal_v1', JSON.stringify(examGoal));
    } catch {}
  }, [examGoal]);

  // Microphone testing loop
  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsTestingMic(true);

      const checkVolume = () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const sum = data.reduce((acc, val) => acc + val, 0);
        const avg = sum / data.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicLevel(normalized);
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch {
      alert('Microphone access could not be started. Please ensure microphone permissions are allowed in your browser.');
    }
  };

  const stopMicTest = () => {
    setIsTestingMic(false);
    setMicLevel(0);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
  };

  // Speaker voice test
  const handleTestSpeakerVoice = () => {
    if (isPlayingTestVoice) {
      stopCurrentVoiceAudio();
      setIsPlayingTestVoice(false);
      return;
    }

    setIsPlayingTestVoice(true);
    playRealVoiceAudio(
      "Hello! Your audio output is working perfectly. You're ready to speak with confidence!",
      {
        voice: 'nova',
        onStart: () => setIsPlayingTestVoice(true),
        onEnd: () => setIsPlayingTestVoice(false),
        onError: () => setIsPlayingTestVoice(false)
      }
    );
  };

  // Add custom slot handler
  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (!newSlotTitle.trim()) return;
    timetableHook.addCustomSlot({
      title: newSlotTitle.trim(),
      time: newSlotTime,
      duration: newSlotDuration
    });
    setNewSlotTitle('');
    setShowAddSlot(false);
  };

  // Calculate days remaining for target exam
  const calculateDaysLeft = () => {
    const target = new Date(examGoal.targetDate).getTime();
    const diffDays = Math.ceil((target - nowTimestamp) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Export Progress Report file download
  const handleExportReport = () => {
    const reportData = {
      platform: 'SpeakUp Communication Platform',
      exportDate: new Date().toLocaleDateString('en-US', { dateStyle: 'full' }),
      studentStats: {
        totalXP: progressHook.progress.xp,
        streakDays: progressHook.progress.streak,
        completedSessions: progressHook.progress.sessionsCount,
        speakingTimeMinutes: Math.round((progressHook.progress.totalSpeakingTimeSeconds || 0) / 60),
        learnedVocabCount: progressHook.progress.learnedVocab.length,
        overallFluencyScore: `${progressHook.progress.overallScore}/100`,
        skills: progressHook.progress.skills
      },
      routineSummary: {
        totalBlocks: timetableHook.totalCount,
        completedToday: timetableHook.completedCount,
        completionRate: `${timetableHook.completionPercentage}%`
      },
      targetGoal: examGoal
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SpeakUp_Progress_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset confirmation execution
  const executeReset = () => {
    if (showConfirmReset === 'all') {
      progressHook.resetProgress();
      timetableHook.resetToDefaults();
    } else if (showConfirmReset === 'streak') {
      progressHook.resetStreak();
    } else if (showConfirmReset === 'xp') {
      progressHook.resetXp?.();
    } else if (showConfirmReset === 'both') {
      progressHook.resetStreak();
      progressHook.resetXp?.();
    } else if (showConfirmReset === 'timetable') {
      timetableHook.resetTimetable();
    }
    setShowConfirmReset(null);
  };

  // Cleanup mic test on close
  useEffect(() => {
    if (!isOpen) return;

    return () => {
      stopMicTest();
      stopCurrentVoiceAudio();
      setIsPlayingTestVoice(false);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="menu-drawer-backdrop" onClick={onClose}>
      <div className="menu-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="menu-drawer-header">
          <div className="menu-header-titles">
            <div className="menu-badge">
              <Sparkles size={14} />
              <span>Settings & Tools</span>
            </div>
            <h2 className="menu-main-title">Menu & Study Center</h2>
          </div>

          <button
            type="button"
            className="menu-close-btn"
            onClick={onClose}
            aria-label="Close menu drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector Bar */}
        <div className="menu-tabs-bar">
          <button
            type="button"
            className={`menu-tab-btn ${activeTab === 'themes' ? 'active' : ''}`}
            onClick={() => setActiveTab('themes')}
          >
            <Palette size={16} />
            <span>Themes</span>
          </button>

          <button
            type="button"
            className={`menu-tab-btn ${activeTab === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveTab('timetable')}
          >
            <Calendar size={16} />
            <span>Timetable</span>
            <span className="tab-pill-badge">{timetableHook.completedCount}/{timetableHook.totalCount}</span>
          </button>

          <button
            type="button"
            className={`menu-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            <Mic size={16} />
            <span>Audio Lab</span>
          </button>

          <button
            type="button"
            className={`menu-tab-btn ${activeTab === 'goal' ? 'active' : ''}`}
            onClick={() => setActiveTab('goal')}
          >
            <Target size={16} />
            <span>Target Goal</span>
          </button>

          <button
            type="button"
            className={`menu-tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <FileText size={16} />
            <span>Report</span>
          </button>

          <button
            type="button"
            className={`menu-tab-btn ${activeTab === 'reset' ? 'active' : ''}`}
            onClick={() => setActiveTab('reset')}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {/* Drawer Content Area */}
        <div className="menu-drawer-body">
          {/* TAB 1: Themes & Appearance */}
          {activeTab === 'themes' && (
            <div className="menu-tab-content themes-tab">
              <div className="tab-intro">
                <h3>Choose Your Appearance</h3>
                <p>Personalize SpeakUp's visual aesthetic for daytime clarity or eye-friendly late night practice.</p>
              </div>

              <div className="theme-cards-grid">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    className={`theme-card ${theme === t.id ? 'active' : ''}`}
                    onClick={() => setTheme(t.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="theme-card-top">
                      <div className="theme-swatch" style={{ background: t.previewColor, borderColor: t.accentColor }}>
                        <span className="swatch-accent" style={{ background: t.accentColor }} />
                      </div>
                      <div className="theme-info">
                        <div className="theme-title-row">
                          <span className="theme-name">{t.name}</span>
                          {theme === t.id && (
                            <span className="active-tag">
                              <CheckCircle2 size={13} />
                              Active
                            </span>
                          )}
                        </div>
                        <p className="theme-desc">{t.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Daily Timetable & Schedule */}
          {activeTab === 'timetable' && (
            <div className="menu-tab-content timetable-tab">
              <div className="tab-intro">
                <div className="timetable-progress-card">
                  <div className="progress-card-info">
                    <h3>Today's Speaking Schedule</h3>
                    <span className="progress-card-pct">{timetableHook.completionPercentage}% Completed</span>
                  </div>
                  <div className="timetable-progress-track">
                    <div 
                      className="timetable-progress-fill" 
                      style={{ width: `${timetableHook.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="timetable-slots-list">
                {timetableHook.timetable.map((slot) => (
                  <div key={slot.id} className={`timetable-slot-row ${slot.completed ? 'completed' : ''}`}>
                    <button
                      type="button"
                      className={`slot-check-box ${slot.completed ? 'checked' : ''}`}
                      onClick={() => timetableHook.toggleSlotComplete(slot.id)}
                      title={slot.completed ? "Mark incomplete" : "Mark completed"}
                    >
                      {slot.completed && <CheckCircle2 size={18} />}
                    </button>

                    <div className="slot-details">
                      <div className="slot-header-line">
                        <span className="slot-title">{slot.title}</span>
                        <div className="slot-time-badge">
                          <Clock size={12} />
                          <span>{slot.time}</span>
                          <span className="slot-duration">({slot.duration})</span>
                        </div>
                      </div>
                      <p className="slot-desc">{slot.description}</p>
                    </div>

                    {slot.isCustom && (
                      <button
                        type="button"
                        className="slot-delete-btn"
                        onClick={() => timetableHook.removeSlot(slot.id)}
                        title="Delete routine block"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Custom Slot Drawer/Form */}
              {!showAddSlot ? (
                <div className="timetable-actions-row">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowAddSlot(true)}
                  >
                    <Plus size={15} />
                    <span>Add Custom Practice Block</span>
                  </button>

                  <button
                    type="button"
                    className="btn-link text-muted"
                    onClick={timetableHook.resetTimetable}
                    title="Uncheck all routine items for today"
                  >
                    Reset Today's Checks
                  </button>
                </div>
              ) : (
                <form className="add-slot-form" onSubmit={handleCreateSlot}>
                  <h4>Add New Practice Block</h4>
                  <div className="form-group">
                    <label>Activity Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Mock Interview Practice"
                      value={newSlotTitle}
                      onChange={(e) => setNewSlotTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 05:00 PM"
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 15 min"
                        value={newSlotDuration}
                        onChange={(e) => setNewSlotDuration(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-sm">Save Block</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddSlot(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Audio & Mic Diagnostics Lab */}
          {activeTab === 'audio' && (
            <div className="menu-tab-content audio-tab">
              <div className="tab-intro">
                <h3>Microphone & Audio Lab</h3>
                <p>Test your microphone levels and speaker playback to ensure crystal-clear AI voice calls.</p>
              </div>

              <div className="audio-lab-card">
                <div className="audio-lab-section">
                  <div className="audio-section-header">
                    <div className="audio-header-left">
                      <Mic size={18} className="audio-icon" />
                      <div>
                        <h4>Microphone Input Test</h4>
                        <p>Speak into your microphone to verify live volume detection.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`btn btn-sm ${isTestingMic ? 'btn-danger' : 'btn-primary'}`}
                      onClick={isTestingMic ? stopMicTest : startMicTest}
                    >
                      {isTestingMic ? 'Stop Test' : 'Test Mic'}
                    </button>
                  </div>

                  {/* 10-Segment Audio Level Meter */}
                  <div className="audio-meter-wrap">
                    <div className="audio-meter-track">
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((threshold) => (
                        <div
                          key={threshold}
                          className={`audio-meter-seg ${micLevel >= threshold ? 'lit' : ''} ${threshold > 75 ? 'danger' : (threshold > 50 ? 'warn' : 'good')}`}
                        />
                      ))}
                    </div>
                    <span className="meter-label">
                      {isTestingMic ? (micLevel > 15 ? '🟢 Hearing Voice Clearly' : '🟡 Listening for voice...') : '⚪ Inactive'}
                    </span>
                  </div>
                </div>

                <div className="audio-lab-divider" />

                <div className="audio-lab-section">
                  <div className="audio-section-header">
                    <div className="audio-header-left">
                      <Volume2 size={18} className="audio-icon" />
                      <div>
                        <h4>Speaker & Voice Playback Test</h4>
                        <p>Listen to a high-definition AI voice sample to test your headphones or speakers.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleTestSpeakerVoice}
                    >
                      {isPlayingTestVoice ? 'Stop Audio' : 'Play Voice Test'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Target Speaking Goal & Exam Countdown */}
          {activeTab === 'goal' && (
            <div className="menu-tab-content goal-tab">
              <div className="tab-intro">
                <h3>Target Exam & Goal Tracker</h3>
                <p>Stay motivated with a personalized deadline countdown and daily speaking practice goal.</p>
              </div>

              <div className="goal-countdown-card">
                <div className="countdown-big-num">
                  <span className="num-days">{calculateDaysLeft()}</span>
                  <span className="num-label">Days Left</span>
                </div>
                <div className="goal-summary-box">
                  <h4>{examGoal.title}</h4>
                  <p>Target Date: <strong>{new Date(examGoal.targetDate).toLocaleDateString('en-US', { dateStyle: 'long' })}</strong></p>
                  <p>Daily Goal: <strong>{examGoal.dailyTargetMinutes} minutes/day</strong></p>
                </div>
              </div>

              <div className="goal-edit-box">
                <h4>Customize Your Goal</h4>
                <div className="form-group">
                  <label>Speaking Target / Exam Title</label>
                  <select
                    className="form-input"
                    value={examGoal.title}
                    onChange={(e) => setExamGoal({ ...examGoal, title: e.target.value })}
                  >
                    <option value="Campus Placement & Job Interviews">Campus Placement & Job Interviews</option>
                    <option value="IELTS / TOEFL Speaking Test">IELTS / TOEFL Speaking Test</option>
                    <option value="Corporate Promotion & Client Meetings">Corporate Promotion & Client Meetings</option>
                    <option value="College Seminars & Group Discussions">College Seminars & Group Discussions</option>
                  </select>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Target Exam / Interview Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={examGoal.targetDate}
                      onChange={(e) => setExamGoal({ ...examGoal, targetDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Daily Practice Target (Mins)</label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      className="form-input"
                      value={examGoal.dailyTargetMinutes}
                      onChange={(e) => setExamGoal({ ...examGoal, dailyTargetMinutes: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Export Practice Report */}
          {activeTab === 'report' && (
            <div className="menu-tab-content report-tab">
              <div className="tab-intro">
                <h3>Student Practice Summary</h3>
                <p>Download your complete performance analytics, learned vocabulary, and practice history.</p>
              </div>

              <div className="report-summary-card">
                <div className="report-stats-grid">
                  <div className="report-stat-box">
                    <span className="stat-value">{progressHook.progress.xp}</span>
                    <span className="stat-label">Total XP</span>
                  </div>
                  <div className="report-stat-box">
                    <span className="stat-value">{progressHook.progress.streak} Days</span>
                    <span className="stat-label">Streak</span>
                  </div>
                  <div className="report-stat-box">
                    <span className="stat-value">{progressHook.progress.sessionsCount}</span>
                    <span className="stat-label">Sessions</span>
                  </div>
                  <div className="report-stat-box">
                    <span className="stat-value">{progressHook.progress.learnedVocab.length}</span>
                    <span className="stat-label">Vocab Learned</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block download-report-btn"
                  onClick={handleExportReport}
                >
                  <Download size={18} />
                  <span>Download Student Performance Report (.JSON)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: Reset & Data Center */}
          {activeTab === 'reset' && (
            <div className="menu-tab-content reset-tab">
              <div className="tab-intro">
                <h3>Data & Progress Reset Center</h3>
                <p>Manage your student practice data, streak counter, or reset to a fresh clean state.</p>
              </div>

              <div className="reset-cards-list">
                {/* Reset Streak */}
                <div className="reset-action-card">
                  <div className="reset-card-info">
                    <h4>Reset Practice Streak</h4>
                    <p>Reset your active day streak counter back to Day 0.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowConfirmReset('streak')}
                  >
                    Reset Streak
                  </button>
                </div>

                {/* Reset XP */}
                <div className="reset-action-card">
                  <div className="reset-card-info">
                    <h4>Reset Earned XP</h4>
                    <p>Reset your accumulated points ({progressHook.progress.xp} XP) back to 0 XP.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowConfirmReset('xp')}
                  >
                    Reset XP
                  </button>
                </div>

                {/* Reset Both Streak & XP */}
                <div className="reset-action-card">
                  <div className="reset-card-info">
                    <h4>Reset Both Streak & XP</h4>
                    <p>Simultaneously reset both your active streak and XP counters back to 0.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowConfirmReset('both')}
                  >
                    Reset Both
                  </button>
                </div>

                {/* Reset Daily Routine */}
                <div className="reset-action-card">
                  <div className="reset-card-info">
                    <h4>Reset Today's Routine</h4>
                    <p>Uncheck all timetable slots for today to restart your daily schedule.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowConfirmReset('timetable')}
                  >
                    Reset Timetable
                  </button>
                </div>

                {/* Factory Reset */}
                <div className="reset-action-card danger-card">
                  <div className="reset-card-info">
                    <h4 className="text-danger">Factory Reset Everything</h4>
                    <p>Wipe all practice sessions, XP ({progressHook.progress.xp} XP), learned vocabulary, and restore initial defaults.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setShowConfirmReset('all')}
                  >
                    Factory Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmReset && (
          <div className="confirm-modal-backdrop" onClick={() => setShowConfirmReset(null)}>
            <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon-wrap">
                <AlertTriangle size={24} />
              </div>
              <h4>Are you sure?</h4>
              <p>
                {showConfirmReset === 'all' && 'This will erase all your XP, streak, vocabulary progress, and speaking sessions. This action cannot be undone.'}
                {showConfirmReset === 'streak' && 'This will reset your current day streak back to 0.'}
                {showConfirmReset === 'xp' && 'This will reset your earned XP points back to 0 XP.'}
                {showConfirmReset === 'both' && 'This will reset both your streak counter and your earned XP back to 0.'}
                {showConfirmReset === 'timetable' && 'This will uncheck all routine blocks for today.'}
              </p>
              <div className="confirm-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmReset(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={executeReset}>
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
