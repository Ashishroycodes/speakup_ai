import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  Trophy, 
  Lightbulb, 
  Volume2, 
  Shuffle, 
  Send, 
  AlertTriangle, 
  Edit3,
  Globe
} from 'lucide-react';
import { 
  PRESENTATION_CATEGORIES, 
  getRandomPresentationTopic 
} from '../../data/presentationTopicsData';
import PresentationReport from './PresentationReport';
import './PresentationChallenge.css';

export default function PresentationChallengeCard({
  onPresentationCompleted,
  completedCount = 0
}) {
  // Current active mode: 'idle' | 'practicing' | 'analyzing' | 'report'
  const [viewState, setViewState] = useState('idle');

  // Topic configuration
  const [selectedCategory, setSelectedCategory] = useState('technology');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [currentTopic, setCurrentTopic] = useState(() => 
    getRandomPresentationTopic({ category: 'technology', difficulty: 'Intermediate' })
  );

  // Time & speech settings
  const [durationMinutes, setDurationMinutes] = useState(2);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [useTextMode, setUseTextMode] = useState(false);

  // Runtime timer & speech states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(120);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimesUp, setIsTimesUp] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysisReport, setAnalysisReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Refs
  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const isSpeechSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Map language to speech recognition code
  const getLangCode = (lang) => {
    if (lang === 'Hindi') return 'hi-IN';
    if (lang === 'Hinglish') return 'en-IN';
    return 'en-US';
  };

  // Stop microphone
  const handleStopSpeaking = useCallback(() => {
    setIsSpeaking(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isSpeaking && viewState === 'practicing') {
      timerIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsTimesUp(true);
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isSpeaking, viewState]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          /* ignore */
        }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Switch category
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const newTopic = getRandomPresentationTopic({ 
      category: catId, 
      difficulty: selectedDifficulty 
    });
    setCurrentTopic(newTopic);
  };

  // Switch difficulty
  const handleDifficultyChange = (diff) => {
    setSelectedDifficulty(diff);
    const newTopic = getRandomPresentationTopic({ 
      category: selectedCategory, 
      difficulty: diff 
    });
    setCurrentTopic(newTopic);
  };

  // Shuffle topic
  const handleShuffleTopic = () => {
    const newTopic = getRandomPresentationTopic({ 
      category: selectedCategory, 
      difficulty: selectedDifficulty 
    });
    setCurrentTopic(newTopic);
  };

  // Duration selection
  const handleDurationChange = (mins) => {
    setDurationMinutes(mins);
    setRemainingSeconds(mins * 60);
    setIsTimesUp(false);
  };

  // Replay Audio Instructions (Text-to-Speech)
  const handleReplayInstructions = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const textToSpeak = `Presentation Challenge: ${currentTopic.title}. Target time is ${durationMinutes} minutes. Goal: ${currentTopic.goal}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  };

  // Start practicing
  const handleStartPractice = () => {
    setViewState('practicing');
    setTranscript('');
    setElapsedSeconds(0);
    setRemainingSeconds(durationMinutes * 60);
    setIsTimesUp(false);
    setErrorMessage('');
    setIsSpeaking(true);

    if (isSpeechSupported && !useTextMode) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getLangCode(selectedLanguage);

        recognition.onresult = (event) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          setTranscript(current.trim());
        };

        recognition.onerror = (e) => {
          console.warn('SpeechRecognition error:', e);
          if (e.error === 'not-allowed') {
            setErrorMessage('Microphone access was denied. You can still type your speech using "Use Text Instead".');
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech start error:', e);
        setUseTextMode(true);
      }
    }
  };

  // Resume microphone
  const handleResumeSpeaking = () => {
    setIsSpeaking(true);
    if (isSpeechSupported && !useTextMode) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getLangCode(selectedLanguage);

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
        console.warn('Resume error:', e);
      }
    }
  };

  // Submit presentation for AI evaluation
  const handleSubmitPresentation = async () => {
    handleStopSpeaking();

    const cleanTranscript = (transcript || '').trim();
    if (!cleanTranscript) {
      setErrorMessage('Please speak aloud or type your presentation before submitting.');
      return;
    }

    setViewState('analyzing');
    setErrorMessage('');

    try {
      const payload = {
        topic: currentTopic.title,
        category: currentTopic.category,
        difficulty: currentTopic.difficulty,
        durationMinutes,
        actualSeconds: Math.max(15, elapsedSeconds),
        transcript: cleanTranscript,
        language: selectedLanguage
      };

      const res = await fetch('/api/presentation-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const reportData = await res.json();
      setAnalysisReport(reportData);
      setViewState('report');

      // Award XP, mark challenge complete, and save progress
      if (onPresentationCompleted) {
        onPresentationCompleted({
          topic: currentTopic.title,
          category: currentTopic.category,
          difficulty: currentTopic.difficulty,
          durationSeconds: elapsedSeconds || durationMinutes * 60,
          overallScore: reportData.overallScore || 80,
          scores: reportData.scores || {},
          report: reportData
        });
      }
    } catch (err) {
      console.error('Presentation analysis submission error:', err);
      setErrorMessage('Could not connect to the AI coach. Please verify your connection or retry.');
      setViewState('practicing');
    }
  };

  // Reset to initial card view
  const handleBackToChallenges = () => {
    handleStopSpeaking();
    setViewState('idle');
    setTranscript('');
    setAnalysisReport(null);
    setErrorMessage('');
  };

  // Format seconds to mm:ss
  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. REPORT VIEW
  if (viewState === 'report' && analysisReport) {
    return (
      <div className="challenge-card card presentation-challenge-card" id="presentation-challenge-card">
        <div style={{ padding: '36px' }}>
          <PresentationReport
            report={analysisReport}
            topic={currentTopic}
            onPracticeAgain={() => {
              setViewState('practicing');
              setTranscript('');
              setElapsedSeconds(0);
              setRemainingSeconds(durationMinutes * 60);
              setIsTimesUp(false);
              setIsSpeaking(true);
            }}
            onTryAnotherTopic={() => {
              handleShuffleTopic();
              setViewState('practicing');
              setTranscript('');
              setElapsedSeconds(0);
              setRemainingSeconds(durationMinutes * 60);
              setIsTimesUp(false);
              setIsSpeaking(true);
            }}
            onBackToChallenges={handleBackToChallenges}
          />
        </div>
      </div>
    );
  }

  // 2. ANALYZING / LOADING STATE
  if (viewState === 'analyzing') {
    return (
      <div className="challenge-card card presentation-challenge-card" id="presentation-challenge-card">
        <div className="presentation-analyzing-card">
          <div className="analyzing-spinner-ring"></div>
          <h3 className="analyzing-title">Analyzing Your Presentation...</h3>
          <p className="analyzing-desc">
            Evaluating speech structure, communication clarity, vocabulary range, and filler words against communication benchmarks.
          </p>
        </div>
      </div>
    );
  }

  // 3. INTERACTIVE PRACTICE WORKSPACE
  if (viewState === 'practicing') {
    return (
      <div className="challenge-card card presentation-challenge-card" id="presentation-challenge-card">
        <div style={{ padding: '36px' }}>
          {/* Header Bar */}
          <div className="challenge-tag-row">
            <span className="presentation-pill">
              <Mic size={14} />
              Presentation Challenge
            </span>
            <span className={`difficulty-pill diff-${selectedDifficulty.toLowerCase()}`}>
              {selectedDifficulty}
            </span>
            <span className="challenge-meta xp">
              <Trophy size={14} />
              +30 XP Reward
            </span>
          </div>

          {/* Setup / Filter bar inside practice mode */}
          <div className="presentation-setup-bar">
            <div className="setup-filter-row">
              <div className="category-scroll-chips">
                {PRESENTATION_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-chip-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.badge}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="shuffle-topic-btn"
                onClick={handleShuffleTopic}
                title="Pick another topic from this category"
              >
                <Shuffle size={14} />
                <span>Shuffle Topic</span>
              </button>
            </div>

            {/* Difficulty Level Switcher */}
            <div className="setup-filter-row" style={{ marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="setup-label">Difficulty:</span>
                {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    className={`category-chip-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                    onClick={() => handleDifficultyChange(diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topic Title & Description */}
          <h3 className="challenge-prompt-text" id="presentation-topic-heading">
            "{currentTopic.title}"
          </h3>

          <p className="challenge-description">
            {currentTopic.prompt}
          </p>

          {/* Goal Banner */}
          <div className="presentation-goal-banner">
            <Lightbulb size={18} className="goal-icon" />
            <div className="goal-content">
              <h5>Goal</h5>
              <p>{currentTopic.goal}</p>
            </div>
          </div>

          {/* Settings Strip: Time selector, Language, Audio Replay */}
          <div className="practice-settings-strip" style={{ marginTop: '16px' }}>
            {/* Duration Selector */}
            <div className="settings-group">
              <Clock size={15} />
              <span className="setup-label">Time:</span>
              <div className="duration-pills">
                {[1, 2, 3, 5].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    className={`duration-pill-btn ${durationMinutes === mins ? 'active' : ''}`}
                    onClick={() => handleDurationChange(mins)}
                  >
                    {mins} Min{mins > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div className="settings-group">
              <Globe size={15} />
              <span className="setup-label">Language:</span>
              <div className="duration-pills">
                {['English', 'Hindi', 'Hinglish'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={`duration-pill-btn ${selectedLanguage === lang ? 'active' : ''}`}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Replay Instructions Button */}
            <button
              type="button"
              className="replay-audio-btn"
              onClick={handleReplayInstructions}
              title="Hear topic instructions aloud"
            >
              <Volume2 size={15} />
              <span>Replay Instructions</span>
            </button>
          </div>

          {/* Timer Display */}
          <div className="presentation-timer-box" style={{ marginTop: '16px' }}>
            <div className="timer-digits-wrap">
              <span className={`timer-digits ${remainingSeconds <= 15 ? 'time-warning' : ''}`}>
                {formatTime(remainingSeconds)}
              </span>
              <span className="timer-label">
                {isTimesUp ? 'Time limit reached' : 'Remaining Time'}
              </span>
            </div>

            {isSpeaking ? (
              <span className="live-mic-pulse">
                <span className="red-dot"></span>
                <span>Recording in progress ({selectedLanguage})...</span>
              </span>
            ) : (
              <span className="challenge-meta">
                <span>Microphone paused</span>
              </span>
            )}
          </div>

          {/* Time's Up Banner (Does not auto-submit!) */}
          {isTimesUp && (
            <div className="times-up-alert" style={{ marginTop: '14px' }}>
              <div className="times-up-text">
                <AlertTriangle size={18} />
                <span>Time's up! You've reached your {durationMinutes}-minute target.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSubmitPresentation}
                >
                  <Send size={13} />
                  <span>Submit Presentation</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsTimesUp(false)}
                >
                  <span>Continue Speaking</span>
                </button>
              </div>
            </div>
          )}

          {/* Transcript Area */}
          <div className="presentation-transcript-box" style={{ marginTop: '16px' }}>
            <div className="transcript-header-line">
              <span>
                <Edit3 size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Your Live Transcript (Editable):
              </span>
              <button
                type="button"
                className="transcript-mode-toggle"
                onClick={() => setUseTextMode(!useTextMode)}
              >
                {useTextMode ? 'Switch to Voice Mode' : 'Use Text Instead'}
              </button>
            </div>

            <textarea
              id="presentation-transcript-input"
              className="presentation-textarea"
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={
                useTextMode
                  ? 'Type your presentation here directly...'
                  : isSpeechSupported
                    ? 'Start speaking into your microphone. Your live speech transcript appears here in real-time. You can edit it before submitting...'
                    : 'Speech recognition is unavailable in this browser. Please type your presentation here...'
              }
            />
          </div>

          {errorMessage && (
            <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: '8px 0 0 0' }}>
              ⚠️ {errorMessage}
            </p>
          )}

          {/* Workspace Action Buttons */}
          <div className="presentation-actions-bar" style={{ marginTop: '20px' }}>
            <div className="actions-left">
              {isSpeaking ? (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleStopSpeaking}
                  id="pres-stop-btn"
                >
                  <Square size={14} />
                  <span>Stop Microphone</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleResumeSpeaking}
                  id="pres-resume-btn"
                >
                  <Play size={14} />
                  <span>Resume Speaking</span>
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setTranscript('');
                  setElapsedSeconds(0);
                  setRemainingSeconds(durationMinutes * 60);
                  setIsTimesUp(false);
                }}
              >
                <RotateCcw size={14} />
                <span>Clear Transcript</span>
              </button>
            </div>

            <div className="actions-right">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleBackToChallenges}
              >
                <span>Back</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm complete-btn"
                onClick={handleSubmitPresentation}
                id="pres-submit-btn"
              >
                <Send size={14} />
                <span>Submit Presentation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. DEFAULT CARD VIEW (Inside Challenges Section)
  return (
    <div className="challenge-card card presentation-challenge-card" id="presentation-challenge-card">
      <div className="challenge-card-inner">
        {/* Left Column */}
        <div className="challenge-content-col">
          <div className="challenge-tag-row">
            <span className="presentation-pill">
              <Mic size={14} />
              Presentation Challenge
            </span>
            <span className="challenge-meta">
              <Clock size={14} />
              5–10 min
            </span>
            <span className={`difficulty-pill diff-${selectedDifficulty.toLowerCase()}`}>
              {selectedDifficulty}
            </span>
            <span className="challenge-meta xp">
              <Trophy size={14} />
              +30 XP Reward
            </span>
          </div>

          <h3 className="challenge-prompt-text" id="presentation-challenge-title">
            "Speak Like a Presenter"
          </h3>

          <p className="challenge-description">
            Give a short presentation on a topic and get AI-powered communication feedback on your structure, delivery clarity, and filler words.
          </p>

          {/* Suggested Structure */}
          <div className="challenge-pointers">
            <div className="pointer-header">
              <Lightbulb size={16} />
              <span>Suggested 3-Beat Structure:</span>
            </div>
            <div className="pointer-chips">
              <span className="pointer-chip">1. Strong Hook & Intro (30s)</span>
              <span className="pointer-chip">2. Core Evidence & Examples (60s)</span>
              <span className="pointer-chip">3. Memorable Conclusion (30s)</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="challenge-action-row">
            <button
              id="start-presentation-challenge-btn"
              type="button"
              className="btn btn-primary btn-lg challenge-btn"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}
              onClick={handleStartPractice}
            >
              <Mic size={18} />
              <span>Start Challenge</span>
              <ArrowRight size={16} />
            </button>
            <span className="challenge-deadline">
              Current Topic: <strong>"{currentTopic.title}"</strong>
            </span>
          </div>
        </div>

        {/* Right Column: Mastery Motivation */}
        <div className="challenge-streak-col">
          <div className="streak-circle-box">
            <div className="streak-flame-icon">🎤</div>
            <div className="streak-count">{completedCount} Done</div>
            <div className="streak-label">Completed</div>
          </div>

          <div className="streak-benefits-list">
            <div className="streak-benefit-item">
              <span className="check-bullet">✓</span>
              <span>Eliminate impromptu stage hesitation</span>
            </div>
            <div className="streak-benefit-item">
              <span className="check-bullet">✓</span>
              <span>Analyze Introduction, Body & Conclusion</span>
            </div>
            <div className="streak-benefit-item">
              <span className="check-bullet">✓</span>
              <span>Detect filler words & earn +30 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
