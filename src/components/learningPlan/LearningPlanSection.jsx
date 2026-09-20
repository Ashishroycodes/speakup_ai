import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass, Target, Flame, Zap, Award, Sparkles, Clock, CheckCircle2,
  AlertTriangle, ArrowRight, RotateCcw, Bot, Send, Calendar,
  ChevronRight, BarChart2, ShieldAlert, Check, HelpCircle
} from 'lucide-react';
import {
  fetchPersonalizedLearningPlan,
  askLearningCoach,
  getPracticeNowRecommendation,
  fetchWeeklyReport,
  clearLearningPlanCache
} from '../../services/learningPlanService';
import GoalsSelectionModal from './GoalsSelectionModal';
import WeeklyReportModal from './WeeklyReportModal';
import PracticeNowModal from './PracticeNowModal';
import './LearningPlan.css';

const TIME_OPTIONS = [15, 30, 45, 60];

const PRESET_COACH_QUESTIONS = [
  'What should I practice today?',
  'Why is my grammar score low?',
  'How can I improve fluency?',
  'What should I do for interview preparation?',
  'Which vocabulary should I learn?',
  'How can I improve my speaking?'
];

export default function LearningPlanSection({
  progress = {},
  interviewHistory = [],
  roleplayHistory = [],
  presentationHistory = [],
  onNavigateSection,
  onCompletePlanTask,
  onSavePreferences
}) {
  // State for AI plan
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [weeklyReportData, setWeeklyReportData] = useState(null);
  const [weeklyReportLoading, setWeeklyReportLoading] = useState(false);

  const [isPracticeNowOpen, setIsPracticeNowOpen] = useState(false);
  const [practiceNowData, setPracticeNowData] = useState(null);
  const [practiceNowLoading, setPracticeNowLoading] = useState(false);

  // 7-Day Plan active selected day
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(todayDayName);

  // AI Study Coach State
  const [coachInput, setCoachInput] = useState('');
  const [coachAnswer, setCoachAnswer] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [activePresetQuestion, setActivePresetQuestion] = useState('');

  // Daily commitment preferences
  const currentDailyMinutes = progress?.learningPreferences?.dailyTimeMinutes || 30;
  const currentGoals = progress?.learningPreferences?.goals || ['Daily English Speaking', 'Fluency'];

  // Check if user has sufficient data
  const hasSessions = (progress?.sessionsCount || 0) > 0 ||
    interviewHistory.length > 0 ||
    roleplayHistory.length > 0 ||
    (progress?.learnedVocab?.length || 0) > 0;

  // Load or fetch personalized plan
  const loadPlan = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const generatedPlan = await fetchPersonalizedLearningPlan({
        progress,
        interviewHistory,
        roleplayHistory,
        forceRefresh: force
      });
      setPlan(generatedPlan);
    } catch (err) {
      console.warn('Failed to load learning plan:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    progress.sessionsCount,
    progress.overallScore,
    progress.learningPreferences?.dailyTimeMinutes,
    progress.learningPreferences?.goals?.length
  ]);

  // Handle Refresh plan
  const handleRefreshPlan = () => {
    clearLearningPlanCache();
    loadPlan(true);
  };

  // Change Daily Commitment
  const handleSelectDailyTime = (mins) => {
    if (onSavePreferences) {
      onSavePreferences({ dailyTimeMinutes: mins });
    }
    clearLearningPlanCache();
    setTimeout(() => {
      loadPlan(true);
    }, 100);
  };

  // Save Goals
  const handleSaveGoals = (newGoals) => {
    if (onSavePreferences) {
      onSavePreferences({ goals: newGoals });
    }
    clearLearningPlanCache();
    setTimeout(() => {
      loadPlan(true);
    }, 100);
  };

  // Handle Quick Action: What should I practice now?
  const handleOpenPracticeNow = async () => {
    setIsPracticeNowOpen(true);
    setPracticeNowLoading(true);
    try {
      const rec = await getPracticeNowRecommendation({
        progress,
        interviewHistory,
        roleplayHistory
      });
      setPracticeNowData(rec);
    } catch {
      setPracticeNowData(plan?.practiceNow || null);
    } finally {
      setPracticeNowLoading(false);
    }
  };

  // Handle Weekly Report open
  const handleOpenWeeklyReport = async () => {
    setIsWeeklyModalOpen(true);
    setWeeklyReportLoading(true);
    try {
      const rep = await fetchWeeklyReport({
        progress,
        interviewHistory,
        roleplayHistory,
        presentationHistory
      });
      setWeeklyReportData(rep);
    } catch {
      // safe fallback
    } finally {
      setWeeklyReportLoading(false);
    }
  };

  // Ask Learning Coach
  const handleAskCoach = async (questionToAsk) => {
    const q = questionToAsk || coachInput;
    if (!q.trim()) return;

    setActivePresetQuestion(q);
    setCoachLoading(true);
    setCoachAnswer('');

    try {
      const ans = await askLearningCoach({
        question: q,
        progress,
        interviewHistory,
        roleplayHistory
      });
      setCoachAnswer(ans);
    } catch {
      setCoachAnswer('I recommend focusing on 15 minutes of daily spontaneous speaking. Consistency builds confidence faster than any other single practice!');
    } finally {
      setCoachLoading(false);
    }
  };

  // Completed tasks count
  const completedTaskIds = progress?.completedPlanTasks || [];
  const todayTasksList = plan?.todayPlan || [];
  const completedTodayCount = todayTasksList.filter((t) => completedTaskIds.includes(t.id)).length;
  const totalTodayCount = todayTasksList.length || 5;

  // Task Completion handler
  const handleToggleTask = (task) => {
    if (completedTaskIds.includes(task.id)) return;
    if (onCompletePlanTask) {
      onCompletePlanTask(task.id, task.xpReward || 20);
    }
  };

  // Start Task dispatcher
  const handleStartTask = (targetModule, targetPayload) => {
    if (onNavigateSection) {
      onNavigateSection(targetModule || 'practice', targetPayload || '');
    }
  };

  // Calculate actual practice minutes today (approx from completed tasks or session time)
  const taskMinutes = todayTasksList
    .filter((t) => completedTaskIds.includes(t.id))
    .reduce((sum, t) => sum + (t.estimatedMinutes || 5), 0);
  const sessionMins = Math.round((progress?.totalSpeakingTimeSeconds || 0) / 60);
  const estimatedPracticedToday = Math.min(currentDailyMinutes, Math.max(taskMinutes, Math.min(sessionMins, currentDailyMinutes)));

  const selectedDayTasks = useMemo(() => {
    if (!plan?.weeklyPlan) return [];
    const found = plan.weeklyPlan.find((w) => w.day === selectedDay);
    return found ? found.activities || [] : [];
  }, [plan?.weeklyPlan, selectedDay]);

  return (
    <section id="learning-plan" className="learning-plan-section">
      <div className="learning-plan-container">
        {/* ===================================================================
            1. HEADER: Title, Subtitle, and Metrics Summary
            =================================================================== */}
        <div className="learning-plan-header">
          <div className="header-badge-row">
            <span className="section-kicker">
              <Compass size={15} />
              AI ADAPTIVE CURRICULUM
            </span>
            <span className="phase-pill">PHASE 10</span>
          </div>

          <h2 className="learning-plan-title">Your Personal Learning Plan</h2>
          <p className="learning-plan-subtitle">
            AI-powered practice designed around your communication goals and weaknesses.
          </p>

          {/* Top Metric Strip */}
          <div className="plan-metrics-strip">
            <div className="plan-metric-pill">
              <span className="metric-icon-small">
                <Award size={16} className="text-amber-400" />
              </span>
              <div className="metric-pill-text">
                <span className="lbl">Level</span>
                <span className="val">{plan?.level || progress?.assessmentLevel || 'Intermediate'}</span>
              </div>
            </div>

            <div className="plan-metric-pill">
              <span className="metric-icon-small">
                <Flame size={16} className="text-rose-500" />
              </span>
              <div className="metric-pill-text">
                <span className="lbl">Current Streak</span>
                <span className="val">{progress?.streak || 3} Days</span>
              </div>
            </div>

            <div className="plan-metric-pill">
              <span className="metric-icon-small">
                <Zap size={16} className="text-purple-400" />
              </span>
              <div className="metric-pill-text">
                <span className="lbl">Total XP</span>
                <span className="val">{progress?.xp || 240} XP</span>
              </div>
            </div>

            <div className="plan-metric-pill">
              <span className="metric-icon-small">
                <BarChart2 size={16} className="text-emerald-400" />
              </span>
              <div className="metric-pill-text">
                <span className="lbl">Overall Score</span>
                <span className="val">{plan?.overallScore || progress?.overallScore || 78}/100</span>
              </div>
            </div>

            <div className="plan-metric-pill goals-pill" onClick={() => setIsGoalsModalOpen(true)}>
              <span className="metric-icon-small">
                <Target size={16} className="text-primary" />
              </span>
              <div className="metric-pill-text">
                <span className="lbl">Active Goal</span>
                <span className="val highlight">{currentGoals[0] || 'Daily Speaking'} ({currentGoals.length})</span>
              </div>
              <ChevronRight size={14} className="text-muted" />
            </div>
          </div>
        </div>

        {/* ===================================================================
            2. QUICK ACTION BANNER: "What should I practice now?"
            =================================================================== */}
        <div className="practice-now-banner">
          <div className="banner-glow-orbit" />
          <div className="banner-left">
            <div className="banner-icon-badge">
              <Sparkles size={22} className="text-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="banner-heading">Need quick direction?</h3>
              <p className="banner-subtext">
                Ask our adaptive engine to pinpoint your single highest-leverage practice task right now.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-practice-now-cta"
            onClick={handleOpenPracticeNow}
          >
            <Sparkles size={16} />
            <span>What should I practice now?</span>
          </button>
        </div>

        {/* ===================================================================
            3. INSUFFICIENT DATA NOTICE (if brand new user)
            =================================================================== */}
        {!hasSessions && (
          <div className="empty-state-plan-card">
            <ShieldAlert size={36} className="text-amber-400 mx-auto mb-3" />
            <h3>Complete a few practice sessions so AI can build a personalized plan for you.</h3>
            <p>
              Your learning plan is powered by real speech accuracy, grammar analysis, and interview recordings.
              Complete your first 60-second speech to unlock deep personalization!
            </p>
            <div className="empty-state-actions">
              <button
                type="button"
                className="btn-primary-plan"
                onClick={() => handleStartTask('practice', 'Introduce Yourself')}
              >
                Start 60-Second Speaking
              </button>
              <button
                type="button"
                className="btn-secondary-plan"
                onClick={() => handleStartTask('ai-coach', '')}
              >
                Chat with AI Coach
              </button>
              <button
                type="button"
                className="btn-secondary-plan"
                onClick={() => handleStartTask('vocabulary', '')}
              >
                Learn Vocabulary
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="plan-loading-state">
            <div className="plan-spinner" />
            <p>Analyzing practice logs across Speaking, AI Coach, Interview, and Vocabulary...</p>
          </div>
        ) : plan ? (
          <>
            {/* ===================================================================
                4. TODAY'S COMMUNICATION PLAN
                =================================================================== */}
            <div className="plan-section-block">
              <div className="block-header-row">
                <div>
                  <h3 className="block-title">Today's Communication Plan</h3>
                  <p className="block-desc">
                    {plan.summary || 'Prioritized exercises designed to maximize speaking confidence and target weak areas.'}
                  </p>
                </div>
                <div className="plan-header-actions">
                  <button
                    type="button"
                    className="btn-refresh-plan"
                    onClick={handleRefreshPlan}
                    disabled={refreshing}
                    title="Refresh plan based on latest metrics"
                  >
                    <RotateCcw size={15} className={refreshing ? 'animate-spin' : ''} />
                    <span>{refreshing ? 'Refreshing...' : 'Refresh My Plan'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar for Today */}
              <div className="daily-progress-wrap">
                <div className="daily-progress-header">
                  <span className="progress-count-label">
                    <strong>{completedTodayCount}</strong> / {totalTodayCount} tasks completed
                  </span>
                  <span className="progress-percentage-label">
                    {Math.round((completedTodayCount / totalTodayCount) * 100)}% Complete
                  </span>
                </div>
                <div className="daily-progress-track">
                  <div
                    className="daily-progress-bar"
                    style={{ width: `${Math.round((completedTodayCount / totalTodayCount) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Today's Tasks List */}
              <div className="today-tasks-grid">
                {todayTasksList.map((task, idx) => {
                  const isDone = completedTaskIds.includes(task.id);
                  return (
                    <div
                      key={task.id || idx}
                      className={`task-item-card ${isDone ? 'task-completed' : ''}`}
                    >
                      <div className="task-left-block">
                        <button
                          type="button"
                          className={`task-checkbox ${isDone ? 'checked' : ''}`}
                          onClick={() => handleToggleTask(task)}
                          aria-label={isDone ? 'Task completed' : 'Mark task completed'}
                        >
                          {isDone && <Check size={16} />}
                        </button>
                        <div className="task-info">
                          <div className="task-title-row">
                            <h4 className="task-title">{task.title}</h4>
                            <span className={`task-diff-tag diff-${(task.difficulty || 'intermediate').toLowerCase()}`}>
                              {task.difficulty || 'Intermediate'}
                            </span>
                            <span className="task-skill-tag">{task.skill}</span>
                          </div>
                          <p className="task-desc">{task.description}</p>
                          <div className="task-meta-row">
                            <span className="task-time-pill">
                              <Clock size={13} /> {task.estimatedMinutes || 5} min
                            </span>
                            <span className="task-xp-pill">
                              <Zap size={13} /> +{task.xpReward || 20} XP
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="task-right-action">
                        <button
                          type="button"
                          className={`btn-task-action ${isDone ? 'btn-task-done' : ''}`}
                          onClick={() => handleStartTask(task.targetModule, task.targetPayload)}
                        >
                          {isDone ? (
                            <>
                              <CheckCircle2 size={16} />
                              <span>Practice Again</span>
                            </>
                          ) : (
                            <>
                              <span>Start</span>
                              <ArrowRight size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ===================================================================
                5. DAILY GOAL & TIME COMMITMENT
                =================================================================== */}
            <div className="plan-section-block daily-goal-commitment-card">
              <div className="daily-goal-flex">
                <div className="daily-goal-info">
                  <div className="card-kicker">
                    <Clock size={15} /> DAILY TIME COMMITMENT
                  </div>
                  <h3 className="goal-headline">Practice for {currentDailyMinutes} minutes today</h3>
                  <p className="goal-subtext">
                    Progress today: <strong>{estimatedPracticedToday} / {currentDailyMinutes} min</strong>.
                    Tasks adapt dynamically to match your available time.
                  </p>

                  <div className="time-select-row">
                    <span className="time-select-label">Change goal:</span>
                    <div className="time-chips-group">
                      {TIME_OPTIONS.map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          className={`time-chip ${currentDailyMinutes === mins ? 'active' : ''}`}
                          onClick={() => handleSelectDailyTime(mins)}
                        >
                          {mins} min/day
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="daily-goal-stats-badge">
                  <div className="stats-circle-wrap">
                    <span className="stat-circle-val">{Math.round((estimatedPracticedToday / currentDailyMinutes) * 100)}%</span>
                    <span className="stat-circle-lbl">Today's Goal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================================
                6. ADAPTIVE DIFFICULTY & FOCUS AREAS (Weakness Detection)
                =================================================================== */}
            <div className="plan-columns-grid">
              {/* Left Column: Focus Areas */}
              <div className="plan-section-block">
                <div className="block-header-row">
                  <div>
                    <h3 className="block-title">Your Focus Areas</h3>
                    <p className="block-desc">Skills needing dedicated attention based on session metrics.</p>
                  </div>
                </div>

                <div className="focus-areas-list">
                  {(plan.focusAreas || []).length > 0 ? (
                    plan.focusAreas.map((area, idx) => (
                      <div key={idx} className="focus-area-card">
                        <div className="focus-area-top">
                          <div className="area-title-wrap">
                            <AlertTriangle size={16} className="text-amber-400" />
                            <h4>{area.skill}</h4>
                          </div>
                          <div className="area-score-badge">
                            {area.score ? `${area.score}/100` : 'Focus'}
                          </div>
                        </div>
                        <p className="area-reason">{area.reason}</p>
                        <button
                          type="button"
                          className="btn-area-action"
                          onClick={() => handleStartTask(area.targetModule, '')}
                        >
                          <span>{area.action || `Practice ${area.skill}`}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="focus-area-card empty-focus">
                      <p>Consistent across all metrics! Keep maintaining balanced daily practice.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Strengths & Adaptive Difficulty */}
              <div className="plan-section-block">
                <div className="block-header-row">
                  <div>
                    <h3 className="block-title">Your Strengths</h3>
                    <p className="block-desc">Proven competencies observed from your actual recordings.</p>
                  </div>
                </div>

                <div className="strengths-list">
                  {(plan.strengths || []).map((str, idx) => (
                    <div key={idx} className="strength-card">
                      <div className="strength-header">
                        <div className="strength-title-wrap">
                          <CheckCircle2 size={16} className="text-emerald-400" />
                          <h4>{str.skill}</h4>
                        </div>
                        {str.score && <span className="strength-score">{str.score}/100</span>}
                      </div>
                      <p className="strength-praise">{str.praise}</p>
                    </div>
                  ))}
                </div>

                {/* Adaptive Difficulty Note */}
                <div className="difficulty-reason-box">
                  <div className="difficulty-reason-header">
                    <Award size={16} className="text-purple-400" />
                    <span>Adaptive Difficulty Level: <strong>{plan.level || 'Intermediate'}</strong></span>
                  </div>
                  <p className="difficulty-reason-text">
                    {plan.difficultyAdjustmentReason || 'Difficulty adapts automatically based on your speaking pace and accuracy.'}
                  </p>
                </div>
              </div>
            </div>

            {/* ===================================================================
                7. YOUR 7-DAY LEARNING PLAN
                =================================================================== */}
            <div className="plan-section-block">
              <div className="block-header-row">
                <div>
                  <h3 className="block-title">Your 7-Day Learning Plan</h3>
                  <p className="block-desc">A structured weekly cadence balancing vocabulary, grammar, and applied dialogues.</p>
                </div>
              </div>

              {/* Day Selector Chips */}
              <div className="days-picker-bar">
                {(plan.weeklyPlan || []).map((dayItem) => {
                  const isSelected = selectedDay === dayItem.day;
                  const isToday = dayItem.day === todayDayName;
                  return (
                    <button
                      key={dayItem.day}
                      type="button"
                      className={`day-picker-btn ${isSelected ? 'active' : ''} ${isToday ? 'is-today' : ''}`}
                      onClick={() => setSelectedDay(dayItem.day)}
                    >
                      <span className="day-name">{dayItem.day.slice(0, 3)}</span>
                      {isToday && <span className="today-dot" title="Today" />}
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Activities */}
              <div className="day-schedule-card">
                <div className="day-schedule-header">
                  <div className="day-theme-title">
                    <Calendar size={18} className="text-primary" />
                    <h4>
                      {selectedDay} Schedule —{' '}
                      <span className="theme-text">
                        {plan.weeklyPlan?.find((d) => d.day === selectedDay)?.theme || 'Comprehensive Communication'}
                      </span>
                    </h4>
                  </div>
                  <span className="day-skill-badge">
                    {plan.weeklyPlan?.find((d) => d.day === selectedDay)?.skill || 'Speaking Skills'}
                  </span>
                </div>

                <div className="day-activities-list">
                  {selectedDayTasks.map((act, idx) => (
                    <div key={idx} className="day-activity-item">
                      <div className="activity-index">{idx + 1}</div>
                      <div className="activity-title">{act.title}</div>
                      <button
                        type="button"
                        className="btn-activity-start"
                        onClick={() => handleStartTask(act.targetModule || 'practice', '')}
                      >
                        Start <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===================================================================
                8. AI RECOMMENDATIONS & WEEKLY REPORT TRIGGER
                =================================================================== */}
            <div className="plan-section-block">
              <div className="block-header-row">
                <div>
                  <h3 className="block-title">Recommended For You</h3>
                  <p className="block-desc">Targeted drills curated to accelerate your communication milestones.</p>
                </div>
                <button
                  type="button"
                  className="btn-weekly-report-trigger"
                  onClick={handleOpenWeeklyReport}
                >
                  <BarChart2 size={16} />
                  <span>View Weekly Report</span>
                </button>
              </div>

              <div className="recommendations-grid">
                {(plan.recommendations || []).map((rec, idx) => (
                  <div key={idx} className="recommendation-card">
                    <div className="rec-header">
                      <span className="rec-skill">{rec.skill}</span>
                      <span className="rec-time">
                        <Clock size={12} /> {rec.estimatedMinutes || 5} min
                      </span>
                    </div>
                    <h4 className="rec-title">{rec.title}</h4>
                    <p className="rec-reason">{rec.reason}</p>
                    <button
                      type="button"
                      className="btn-rec-action"
                      onClick={() => handleStartTask(rec.targetModule, '')}
                    >
                      <span>{rec.actionLabel || 'Start Practice'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ===================================================================
                9. ASK YOUR LEARNING COACH (AI Study Coach)
                =================================================================== */}
            <div className="plan-section-block ask-coach-container">
              <div className="block-header-row">
                <div>
                  <div className="card-kicker">
                    <Bot size={15} /> AI STUDY COACH
                  </div>
                  <h3 className="block-title">Ask Your Learning Coach</h3>
                  <p className="block-desc">
                    Get instant, tailored advice grounded in your SpeakUp practice history.
                  </p>
                </div>
              </div>

              {/* Preset Question Chips */}
              <div className="coach-preset-chips">
                {PRESET_COACH_QUESTIONS.map((pq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`preset-chip ${activePresetQuestion === pq ? 'active' : ''}`}
                    onClick={() => handleAskCoach(pq)}
                  >
                    <HelpCircle size={13} />
                    <span>{pq}</span>
                  </button>
                ))}
              </div>

              {/* Custom Question Input */}
              <form
                className="coach-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskCoach(coachInput);
                }}
              >
                <input
                  type="text"
                  className="coach-text-input"
                  placeholder="Ask anything (e.g. How can I reduce hesitation in meetings?)..."
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  disabled={coachLoading}
                />
                <button
                  type="submit"
                  className="btn-coach-send"
                  disabled={coachLoading || !coachInput.trim()}
                >
                  <Send size={16} />
                  <span>Ask Coach</span>
                </button>
              </form>

              {/* Coach Answer Display */}
              {coachLoading ? (
                <div className="coach-loading-row">
                  <div className="plan-spinner-small" />
                  <span>Consulting your communication metrics and history...</span>
                </div>
              ) : coachAnswer ? (
                <div className="coach-answer-box">
                  <div className="coach-avatar-bubble">
                    <Bot size={20} className="text-primary" />
                  </div>
                  <div className="coach-answer-text">
                    <div className="coach-name">SpeakUp Learning Coach</div>
                    <p>{coachAnswer}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      {/* Modals */}
      <GoalsSelectionModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        selectedGoals={currentGoals}
        onSaveGoals={handleSaveGoals}
      />

      <WeeklyReportModal
        isOpen={isWeeklyModalOpen}
        onClose={() => setIsWeeklyModalOpen(false)}
        report={weeklyReportData}
        loading={weeklyReportLoading}
      />

      <PracticeNowModal
        isOpen={isPracticeNowOpen}
        onClose={() => setIsPracticeNowOpen(false)}
        recommendation={practiceNowData}
        loading={practiceNowLoading}
        onStartPractice={handleStartTask}
      />
    </section>
  );
}
