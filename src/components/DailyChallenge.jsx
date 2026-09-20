import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, Clock, Trophy, ArrowRight, Lightbulb, Zap, Square, CheckCircle2, RotateCcw, Sparkles, Play } from 'lucide-react';
import PresentationChallengeCard from './challenges/PresentationChallengeCard';
import './DailyChallenge.css';

export default function DailyChallenge({ 
  onChallengeCompleted, 
  completedCount = 1,
  onPresentationCompleted,
  presentationCompletedCount = 0
}) {
  const challengePrompt = "Speak for 60 seconds about your future career.";
  const challengeDuration = 60;

  const [isPracticing, setIsPracticing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const isSpeechSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const handleStopChallengeSpeaking = useCallback(() => {
    setIsSpeaking(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore stop error */ }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (isSpeaking) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= challengeDuration - 1) {
            handleStopChallengeSpeaking();
            return challengeDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isSpeaking, handleStopChallengeSpeaking]);

  const handleStartChallenge = () => {
    setIsPracticing(true);
    setIsSpeaking(true);
    setIsCompleted(false);

    if (isSpeechSupported) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          setTranscript(current.trim());
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition error:', e);
      }
    }
  };

  const handleFinishChallenge = () => {
    handleStopChallengeSpeaking();
    setIsCompleted(true);
    if (onChallengeCompleted) {
      onChallengeCompleted();
    }
  };

  const handleResetChallenge = () => {
    handleStopChallengeSpeaking();
    setIsPracticing(false);
    setIsCompleted(false);
    setElapsedSeconds(0);
    setTranscript('');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <section className="daily-challenge-section" id="challenges">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge section-badge-amber">
            <Flame size={15} />
            <span>Daily Discipline</span>
          </div>
          <h2 className="section-title">Today's Challenge</h2>
          <p className="section-subtitle">
            A fresh 60-second spontaneous mission designed to overcome hesitation and build English conversational reflexes.
          </p>
        </div>

        {/* Challenge Card Container */}
        <div className="challenge-card card" id="daily-challenge-card">
          <div className="challenge-card-inner">
            {/* Left Content Column */}
            <div className="challenge-content-col">
              <div className="challenge-tag-row">
                <span className="challenge-pill">
                  <Flame size={14} className="flame-icon" />
                  Today's Challenge
                </span>
                <span className="challenge-meta">
                  <Clock size={14} />
                  1 Minute Sprint
                </span>
                <span className="challenge-meta xp">
                  <Trophy size={14} />
                  +20 XP Reward
                </span>
              </div>

              <h3 className="challenge-prompt-text" id="challenge-prompt-heading">
                "{challengePrompt}"
              </h3>

              <p className="challenge-description">
                Describe the role you aspire to achieve, why you are drawn to it, the impact you wish to create, and the skills you are actively developing today.
              </p>

              {/* Suggested Structure */}
              <div className="challenge-pointers">
                <div className="pointer-header">
                  <Lightbulb size={16} />
                  <span>Structure in 3 beats:</span>
                </div>
                <div className="pointer-chips">
                  <span className="pointer-chip">1. Dream Role & Purpose (20s)</span>
                  <span className="pointer-chip">2. Everyday Skills Cultivated (25s)</span>
                  <span className="pointer-chip">3. Ultimate Vision (15s)</span>
                </div>
              </div>

              {/* Interactive Practice Mode Area */}
              {isPracticing && (
                <div className="challenge-interactive-box">
                  {/* Timer & Mic state */}
                  <div className="challenge-timer-status-row">
                    <div className="challenge-time-readout">
                      <Clock size={16} />
                      <span>Speaking Time:</span>
                      <strong>{formatTime(elapsedSeconds)} / {formatTime(challengeDuration)}</strong>
                    </div>

                    {isSpeaking && (
                      <span className="challenge-live-indicator">
                        <span className="pulsing-red-dot"></span>
                        Recording speech...
                      </span>
                    )}
                  </div>

                  {/* Challenge Transcript Area */}
                  <div className="challenge-transcript-wrap">
                    <label htmlFor="challenge-transcript-text" className="transcript-label-sm">
                      Your Transcript:
                    </label>
                    <textarea
                      id="challenge-transcript-text"
                      className="challenge-transcript-input"
                      rows={3}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder={
                        isSpeechSupported
                          ? 'Speak aloud into your microphone. Your transcript appears here in real-time...'
                          : 'Type your response here or speak aloud...'
                      }
                    />
                  </div>

                  {/* Challenge Action Controls */}
                  <div className="challenge-controls-row">
                    {isSpeaking ? (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={handleStopChallengeSpeaking}
                      >
                        <Square size={14} />
                        <span>Pause</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleStartChallenge}
                      >
                        <Play size={14} />
                        <span>Resume</span>
                      </button>
                    )}

                    <button
                      id="complete-challenge-btn"
                      type="button"
                      className="btn btn-primary btn-sm complete-btn"
                      onClick={handleFinishChallenge}
                    >
                      <CheckCircle2 size={15} />
                      <span>Complete Challenge</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleResetChallenge}
                    >
                      <RotateCcw size={14} />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Completion Celebration banner */}
              {isCompleted && (
                <div className="challenge-success-alert">
                  <div className="success-icon-wrap">
                    <Sparkles size={20} />
                  </div>
                  <div className="success-text-wrap">
                    <h4>🎉 Challenge Completed!</h4>
                    <p>Awesome effort! You earned <strong>+20 XP</strong> and added to your daily practice consistency.</p>
                  </div>
                </div>
              )}

              {/* Initial Action Button */}
              {!isPracticing && !isCompleted && (
                <div className="challenge-action-row">
                  <button 
                    id="start-challenge-btn"
                    className="btn btn-primary btn-lg challenge-btn"
                    onClick={handleStartChallenge}
                  >
                    <Zap size={18} />
                    <span>Start Challenge</span>
                    <ArrowRight size={16} />
                  </button>
                  <span className="challenge-deadline">Resets every 24 hours at midnight</span>
                </div>
              )}
            </div>

            {/* Right Column: Streak & Motivation */}
            <div className="challenge-streak-col">
              <div className="streak-circle-box">
                <div className="streak-flame-icon">🔥</div>
                <div className="streak-count">{completedCount} Done</div>
                <div className="streak-label">Completed</div>
              </div>

              <div className="streak-benefits-list">
                <div className="streak-benefit-item">
                  <span className="check-bullet">✓</span>
                  <span>Eliminate hesitation on impromptu questions</span>
                </div>
                <div className="streak-benefit-item">
                  <span className="check-bullet">✓</span>
                  <span>Earn +20 XP toward communication badges</span>
                </div>
                <div className="streak-benefit-item">
                  <span className="check-bullet">✓</span>
                  <span>Solidify your Mon–Fri streak record</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Card 2: Phase 8 Presentation Challenge Card */}
        <PresentationChallengeCard
          onPresentationCompleted={onPresentationCompleted}
          completedCount={presentationCompletedCount}
        />
      </div>
    </section>
  );
}
