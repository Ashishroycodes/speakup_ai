import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import SpeakingPractice from './components/SpeakingPractice';
import AICoachSection from './components/aiCoach/AICoachSection';
import InterviewSimulator from './components/interview/InterviewSimulator';
import RoleplaySection from './components/roleplay/RoleplaySection';
import VocabularySection from './components/VocabularySection';
import DailyChallenge from './components/DailyChallenge';
import LearningPlanSection from './components/learningPlan/LearningPlanSection';
import ProgressSection from './components/ProgressSection';
import Footer from './components/Footer';
import MenuBarDrawer from './components/menu/MenuBarDrawer';
import AuthModal from './components/auth/AuthModal';
import ProfileModal from './components/auth/ProfileModal';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import ProfileView from './components/profile/ProfileView';
import { useAuth } from './context/AuthContext';
import { useProgress } from './hooks/useProgress';
import { useTheme } from './hooks/useTheme';
import { useTimetable } from './hooks/useTimetable';

export default function App() {
  const { user, role, isLoading, syncProgressToCloud } = useAuth();
  const [guestMode, setGuestMode] = useState(false);
  const prevUserRef = useRef(user);

  // When a logged-in user signs out, return to the entrance gate
  useEffect(() => {
    if (prevUserRef.current && !user) {
      setGuestMode(false);
    }
    prevUserRef.current = user;
  }, [user]);

  const [activeSection, setActiveSection] = useState('home');
  const [practiceTopic, setPracticeTopic] = useState('Introduce Yourself');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuInitialTab, setMenuInitialTab] = useState('themes');

  // Theme hook (Dark, Light, Sepia, Ocean)
  const { theme, setTheme, toggleTheme, themes } = useTheme();

  // Daily Timetable hook
  const timetableHook = useTimetable();

  // Custom persistent progress hook (localStorage)
  const {
    progress,
    interviewHistory,
    roleplayHistory,
    recordSpeakingSession,
    completeChallenge,
    toggleVocabLearned,
    toggleSaveVocab,
    toggleDifficultVocab,
    toggleMasteredVocab,
    saveVocabNote,
    recordVocabSpeaking,
    recordVocabQuizResult,
    recordSpacedReview,
    recordVocabIncorrect,
    recordVocabCorrect,
    completeVocabChallenge,
    recordInterviewSession,
    clearInterviewHistory,
    recordRoleplaySession,
    clearRoleplayHistory,
    presentationHistory,
    recordPresentationChallenge,
    saveLearningPreferences,
    completePlanTask,
    resetStreak,
    advanceStreak,
    resetXp,
    resetProgress,
    recordGamifiedTask
  } = useProgress();

  // Background cloud progress sync for authenticated students
  useEffect(() => {
    if (user && role === 'student' && progress) {
      const timer = setTimeout(() => {
        syncProgressToCloud({
          xp: progress.xp || 0,
          streak: progress.streak || 0,
          overallScore: 78,
          level: Math.floor((progress.xp || 0) / 200) + 1,
          details: {
            learnedVocabCount: progress.learnedVocab?.length || 0,
            completedChallenges: progress.completedChallenges || 0
          }
        });
      }, 1200);
      return () => clearTimeout(timer);
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [user, role, progress?.xp, progress?.streak, progress?.completedChallenges, progress?.learnedVocab?.length, syncProgressToCloud]);

  const handleOpenResetMenu = () => {
    setMenuInitialTab('reset');
    setIsMenuOpen(true);
  };

  // Direct reach navigation helper with incoming optical blur effect
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'user-portal' || sectionId === 'teacher-portal') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId === 'profile') {
      window.dispatchEvent(new CustomEvent('open-profile-details'));
    }
    let targetId = sectionId;
    if (sectionId === 'practice-studio' && !document.getElementById('practice-studio')) {
      targetId = 'practice';
    } else if (sectionId === 'practice' && !document.getElementById('practice')) {
      targetId = 'practice-studio';
    }

    const element = document.getElementById(targetId);
    if (element) {
      // Dynamically measure navbar height for exact mobile and desktop alignment
      const navHeader = document.querySelector('.navbar-header');
      const navbarHeight = navHeader ? navHeader.offsetHeight : (window.innerWidth <= 768 ? 64 : 72);
      const breathingSpace = window.innerWidth <= 768 ? 8 : 14;
      if (targetId === 'home') {
        window.scrollTo({
          top: 0,
          behavior: 'auto'
        });
      } else {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (navbarHeight + breathingSpace);

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'auto'
        });
      }

      // Apply incoming optical blur & focus transition effect
      element.classList.remove('section-nav-reveal');
      void element.offsetWidth; // Force CSS reflow to re-trigger keyframes
      element.classList.add('section-nav-reveal');

      setTimeout(() => {
        element.classList.remove('section-nav-reveal');
      }, 450);
    }
  };

  // Listen to window scroll to update active navbar link
  useEffect(() => {
    const handleScroll = () => {
      // Don't override active link if user is in a dedicated portal/profile view
      if (document.querySelector('.profile-view-wrapper') || document.querySelector('.teacher-portal-wrapper')) {
        return;
      }
      const sections = [
        { id: 'home', el: document.getElementById('home') },
        { id: 'practice', el: document.getElementById('practice') || document.getElementById('practice-studio') },
        { id: 'ai-coach', el: document.getElementById('ai-coach') },
        { id: 'ai-interview', el: document.getElementById('ai-interview') },
        { id: 'roleplay', el: document.getElementById('roleplay') },
        { id: 'vocabulary', el: document.getElementById('vocabulary') },
        { id: 'challenges', el: document.getElementById('challenges') },
        { id: 'learning-plan', el: document.getElementById('learning-plan') },
        { id: 'progress', el: document.getElementById('progress') },
        { id: 'profile', el: document.getElementById('profile') }
      ];

      const scrollPosition = window.scrollY + 110;

      for (let i = sections.length - 1; i >= 0; i--) {
        const item = sections[i];
        if (item.el && item.el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card action dispatcher from Dashboard
  const handleDashboardCardSelect = (actionId) => {
    if (actionId === 'vocabulary') {
      scrollToSection('vocabulary');
    } else if (actionId === 'practice-studio') {
      scrollToSection('practice-studio');
    } else if (actionId === 'challenges') {
      scrollToSection('challenges');
    } else if (actionId === 'ai-coach') {
      scrollToSection('ai-coach');
    } else if (actionId === 'ai-interview') {
      scrollToSection('ai-interview');
    } else if (actionId === 'roleplay') {
      scrollToSection('roleplay');
    }
  };

  // When student wants to practice a specific word or sentence in Speaking Practice
  const handlePracticeWordOrSentence = (phrase) => {
    setPracticeTopic(phrase);
    scrollToSection('practice-studio');
  };

  // Loading screen while initial auth session is being verified
  if (isLoading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-spinner" />
        <p className="app-loading-text">Initializing SpeakUp AI Studio...</p>
      </div>
    );
  }

  // Before opening website: Show Login & Signup Section if unauthenticated
  if (!user && !guestMode) {
    return (
      <AuthModal 
        isEntranceGate={true}
        onContinueAsGuest={() => setGuestMode(true)}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar 
        onNavigate={scrollToSection} 
        activeSection={activeSection}
        onOpenMenu={() => { setMenuInitialTab('themes'); setIsMenuOpen(true); }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Sections */}
      <main className="main-content">
        {activeSection === 'user-portal' ? (
          <ProfileView onNavigate={scrollToSection} isSection={false} />
        ) : activeSection === 'teacher-portal' ? (
          <div className="teacher-portal-wrapper">
            <div className="teacher-portal-top-bar">
              <div className="portal-badge-indicator">
                <span className="portal-live-dot"></span>
                <span>Educator Dashboard Mode Active</span>
              </div>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => scrollToSection('home')}
              >
                <span>Preview Student View →</span>
              </button>
            </div>
            <TeacherDashboard />
          </div>
        ) : (
          <>
            {/* 1. Landing Page / Hero */}
            <Hero 
              onStartPracticing={() => scrollToSection('practice-studio')}
              onExplorePractice={() => scrollToSection('practice')}
              streak={progress.streak}
              xp={progress.xp}
              onOpenResetMenu={handleOpenResetMenu}
              onOpenMenu={(tab = 'themes') => {
                setMenuInitialTab(tab);
                setIsMenuOpen(true);
              }}
              onNavigate={scrollToSection}
            />

            {/* 2. Practice Dashboard with Streak & XP */}
            <Dashboard 
              onSelectCard={handleDashboardCardSelect}
              streak={progress.streak}
              longestStreak={progress.longestStreak}
              streakDays={progress.streakDays}
              lastPracticeDate={progress.lastPracticeDate}
              xp={progress.xp}
              onResetStreak={resetStreak}
              onAdvanceStreak={advanceStreak}
              onStartPractice={() => scrollToSection('practice-studio')}
            />

            {/* 3. Speaking Practice Studio with Topics, Timer, Speech STT, AI Feedback & Gamified Practice */}
            <SpeakingPractice 
              initialTopicTitle={practiceTopic}
              onSessionCompleted={recordSpeakingSession}
              progress={progress}
              onGamifiedTaskComplete={recordGamifiedTask}
              interviewHistory={interviewHistory}
              roleplayHistory={roleplayHistory}
            />

            {/* 4. AI Communication Partner (AI Coach) */}
            <AICoachSection
              onNavigateToPractice={handlePracticeWordOrSentence}
            />

            {/* 5. Phase 6: AI Interview Simulator */}
            <InterviewSimulator
              onNavigateSection={scrollToSection}
              onRecordSession={recordInterviewSession}
              interviewHistory={interviewHistory}
              onClearHistory={clearInterviewHistory}
            />

            {/* 6. Phase 7: Real-Life AI Roleplay */}
            <RoleplaySection
              theme={theme}
              onRecordSession={recordRoleplaySession}
              roleplayHistory={roleplayHistory}
              onClearHistory={clearRoleplayHistory}
            />

            {/* 7. Vocabulary Section (Interactive Spoken Vocabulary Studio) */}
            <VocabularySection
              progress={progress}
              theme={theme}
              learnedVocab={progress.learnedVocab}
              onToggleLearned={toggleVocabLearned}
              onPracticeWord={handlePracticeWordOrSentence}
              toggleSaveVocab={toggleSaveVocab}
              toggleDifficultVocab={toggleDifficultVocab}
              toggleMasteredVocab={toggleMasteredVocab}
              saveVocabNote={saveVocabNote}
              recordVocabSpeaking={recordVocabSpeaking}
              recordVocabQuizResult={recordVocabQuizResult}
              recordSpacedReview={recordSpacedReview}
              recordVocabIncorrect={recordVocabIncorrect}
              recordVocabCorrect={recordVocabCorrect}
              completeVocabChallenge={completeVocabChallenge}
            />

            {/* 6. Daily Challenge & Presentation Challenge */}
            <DailyChallenge 
              onChallengeCompleted={completeChallenge}
              completedCount={progress.completedChallenges}
              onPresentationCompleted={recordPresentationChallenge}
              presentationCompletedCount={presentationHistory?.length || 0}
            />

            {/* 7. Phase 10: Personalized AI Learning Plan & Adaptive Coach */}
            <LearningPlanSection
              progress={progress}
              interviewHistory={interviewHistory}
              roleplayHistory={roleplayHistory}
              presentationHistory={presentationHistory}
              onNavigateSection={(targetModule, targetPayload) => {
                if (targetModule === 'practice' || targetModule === 'practice-studio') {
                  if (targetPayload) setPracticeTopic(targetPayload);
                  scrollToSection('practice-studio');
                } else if (targetModule === 'ai-interview') {
                  scrollToSection('ai-interview');
                } else if (targetModule === 'roleplay') {
                  scrollToSection('roleplay');
                } else if (targetModule === 'vocabulary') {
                  scrollToSection('vocabulary');
                } else if (targetModule === 'ai-coach') {
                  scrollToSection('ai-coach');
                } else if (targetModule === 'challenges') {
                  scrollToSection('challenges');
                } else {
                  scrollToSection(targetModule);
                }
              }}
              onCompletePlanTask={completePlanTask}
              onSavePreferences={saveLearningPreferences}
            />

            {/* 8. Progress Section (Score 78/100, Skill Bars, Stats, Badges) */}
            <ProgressSection 
              progress={progress}
              onStartPractice={() => scrollToSection('practice-studio')}
            />

            {/* 9. Profile & Academic Hub Section at bottom of page */}
            <ProfileView 
              id="profile"
              isSection={true}
              onNavigate={scrollToSection}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={scrollToSection} 
      />

      {/* Slide-out Menu & Tools Center Drawer */}
      <MenuBarDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        theme={theme}
        setTheme={setTheme}
        themes={themes}
        timetableHook={timetableHook}
        progressHook={{
          progress,
          resetStreak,
          resetXp,
          resetProgress
        }}
        onNavigateSection={scrollToSection}
        initialTab={menuInitialTab}
      />

      {/* Authentication & Profile Modals */}
      <AuthModal />
      <ProfileModal />
    </div>
  );
}
