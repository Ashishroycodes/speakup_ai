import React from 'react';
import { Mic, BookOpen, Flame, ArrowRight, Zap, GraduationCap, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StreakCard from './common/StreakCard.jsx';
import './Dashboard.css';

export default function Dashboard({ 
  onSelectCard, 
  streak = 3, 
  longestStreak = 5,
  streakDays = {}, 
  lastPracticeDate = null,
  xp = 240,
  onResetStreak,
  onAdvanceStreak,
  onStartPractice
}) {
  const { user, profile, role, activeAssignments, openAuthModal } = useAuth();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const cards = [
    {
      id: 'speaking',
      title: 'Speaking Practice',
      description: 'Practice answering impromptu prompts with a real-time timer to build spontaneous verbal fluency.',
      icon: Mic,
      color: 'indigo',
      badge: 'Core Skill',
      buttonText: 'Start Speaking',
      actionId: 'practice-studio'
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      description: 'Expand your word bank with context-rich idioms, conversational phrases, and natural expressions.',
      icon: BookOpen,
      color: 'cyan',
      badge: 'Active Words',
      buttonText: 'Start Learning',
      actionId: 'vocabulary'
    },
    {
      id: 'challenge',
      title: 'Daily Challenge',
      description: 'Complete today’s curated 60-second speaking mission and build your consistency streak.',
      icon: Flame,
      color: 'amber',
      badge: 'Streak Booster',
      buttonText: 'Start Challenge',
      actionId: 'challenges'
    }
  ];

  // Map assignment category to actionId
  const getActionForCategory = (cat) => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('vocab')) return 'vocabulary';
    if (lower.includes('interview')) return 'ai-interview';
    if (lower.includes('roleplay')) return 'roleplay';
    return 'practice-studio';
  };

  return (
    <section className="dashboard-section" id="dashboard">
      <div className="section-container">
        {/* Welcome Banner */}
        <div className="dashboard-header">
          <div className="greeting-wrapper">
            <h2 className="dashboard-greeting">
              {user ? `${getTimeGreeting()}, ${user.name.split(' ')[0]}!` : 'Welcome back!'} <span className="waving-hand">👋</span>
            </h2>
            <p className="dashboard-subtext">
              {user 
                ? "Ready for today's communication challenge? Let's build your fluency milestone." 
                : "What communication milestone are we conquering today? Pick an activity to begin."}
            </p>
          </div>

          <div className="dashboard-badges-pill-group">
            {user ? (
              <div className="student-status-pill authenticated">
                <span className="live-indicator"></span>
                <span>{role === 'teacher' ? 'Educator Mode' : (profile?.course ? `${profile.course}` : 'Student Verified')}</span>
              </div>
            ) : (
              <button 
                type="button" 
                className="student-status-pill login-prompt"
                onClick={() => openAuthModal('login')}
              >
                <Sparkles size={14} className="text-indigo-400" />
                <span>Sign in for Class Sync</span>
              </button>
            )}

            <div className="dashboard-xp-pill">
              <Zap size={15} />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Teacher Assignment Highlight Banner (if assigned) */}
        {activeAssignments && activeAssignments.length > 0 && (
          <div className="teacher-assignment-banner">
            <div className="assignment-banner-left">
              <div className="assignment-badge-icon">
                <GraduationCap size={20} />
              </div>
              <div className="assignment-banner-text">
                <div className="assignment-badge-label">
                  <span>Assigned by your teacher</span>
                  {activeAssignments[0].due_date && (
                    <span className="assignment-due-tag">
                      <Calendar size={12} /> Due {activeAssignments[0].due_date}
                    </span>
                  )}
                </div>
                <h4 className="assignment-banner-title">{activeAssignments[0].title}</h4>
                <p className="assignment-banner-desc">{activeAssignments[0].description}</p>
              </div>
            </div>
            <button 
              className="btn btn-primary assignment-action-btn"
              onClick={() => onSelectCard(getActionForCategory(activeAssignments[0].skill_category))}
            >
              <span>Start Assignment</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}


        {/* 7-Day Consistency Streak Tracker */}
        <div className="dashboard-streak-wrapper">
          <StreakCard
            streak={streak}
            longestStreak={longestStreak}
            streakDays={streakDays}
            lastPracticeDate={lastPracticeDate}
            xp={xp}
            onResetStreak={onResetStreak}
            onAdvanceStreak={onAdvanceStreak}
            onStartPractice={onStartPractice}
          />
        </div>

        {/* 3 Simple Cards Grid */}
        <div className="dashboard-cards-grid">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div 
                key={card.id} 
                className={`dashboard-card card card-${card.color}`}
                id={`card-${card.id}`}
              >
                <div className="card-top-row">
                  <div className={`card-icon-box box-${card.color}`}>
                    <IconComponent size={26} />
                  </div>
                  <span className={`card-tag tag-${card.color}`}>{card.badge}</span>
                </div>

                <div className="card-content">
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.description}</p>
                </div>

                <div className="card-footer">
                  <button 
                    id={`btn-card-${card.id}`}
                    className={`btn btn-${card.color === 'indigo' ? 'primary' : 'secondary'} card-action-btn`}
                    onClick={() => onSelectCard(card.actionId)}
                  >
                    <span>{card.buttonText}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
