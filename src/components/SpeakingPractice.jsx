import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Sparkles, CheckCircle2, RotateCcw, AlertCircle, Award } from 'lucide-react';
import TopicSelector from './common/TopicSelector';
import Timer from './common/Timer';
import Transcript from './common/Transcript';
import FeedbackCard from './common/FeedbackCard';
import GamifiedPracticeMode from './practice/GamifiedPracticeMode';
import { TOPICS_DATA } from '../data/topicsData';
import './SpeakingPractice.css';

export default function SpeakingPractice({ 
  initialTopicTitle, 
  onSessionCompleted,
  progress,
  onGamifiedTaskComplete,
  interviewHistory,
  roleplayHistory
}) {
  // Practice section mode: 'standard' | 'gamified'
  const [practiceMode, setPracticeMode] = useState('standard');

  // Find initial topic or fallback to default
  const defaultTopic = TOPICS_DATA[0].topics[0];
  const [selectedTopic, setSelectedTopic] = useState(defaultTopic);
  const [selectedDuration, setSelectedDuration] = useState(60); // 30, 60, 120
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [micError, setMicError] = useState(null);

  // Sync if initialTopicTitle prop changes (canonical React pattern for adjusting state when prop changes)
  const [prevTopicTitle, setPrevTopicTitle] = useState(initialTopicTitle);
  if (initialTopicTitle !== prevTopicTitle) {
    setPrevTopicTitle(initialTopicTitle);
    if (initialTopicTitle) {
      setPracticeMode('standard');
      let found = null;
      for (const cat of TOPICS_DATA) {
        const t = cat.topics.find((item) => item.title.toLowerCase() === initialTopicTitle.toLowerCase());
        if (t) {
          found = t;
          break;
        }
      }
      setSelectedTopic(found || {
        id: 'custom-topic',
        title: initialTopicTitle,
        instruction: `Speak for ${selectedDuration} seconds on this focus topic. Structure your response clearly.`,
        guidingPills: ['Key Point', 'Real-world Example', 'Conclusion']
      });
    }
  }

  // Speech Recognition setup
  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const isSpeechSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Timer interval effect
  useEffect(() => {
    if (isSpeaking) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isSpeaking]);

  // Handle Start Speaking
  const handleStartSpeaking = () => {
    setMicError(null);
    setIsSpeaking(true);

    if (isSpeechSupported) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setTranscript(currentTranscript.trim());
        };

        recognition.onerror = (err) => {
          console.warn('Speech recognition status:', err.error);
          if (err.error === 'not-allowed') {
            setMicError('Microphone permission was denied. You can still practice or type your transcript.');
          }
        };

        recognition.onend = () => {
          // If still marked speaking, restart listening
          if (isSpeaking) {
            try { recognition.start(); } catch { /* ignore restart error */ }
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  // Handle Stop Speaking
  const handleStopSpeaking = () => {
    setIsSpeaking(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore stop error */ }
    }
  };

  // When timer reaches target duration
  const handleTimerEnd = () => {
    handleStopSpeaking();
    // Complete session
    if (onSessionCompleted) {
      onSessionCompleted(selectedDuration, selectedTopic.title);
    }
    setShowFeedback(true);
  };

  // Try again
  const handleTryAgain = () => {
    handleStopSpeaking();
    setElapsedSeconds(0);
    setTranscript('');
    setShowFeedback(false);
  };

  // Clear transcript
  const handleClearTranscript = () => {
    setTranscript('');
  };

  // Practice another topic
  const handlePracticeAnother = () => {
    handleTryAgain();
    setShowFeedback(false);
  };

  return (
    <section className="speaking-practice-section" id="practice" data-alias="practice-studio">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Mic size={14} />
            <span>Interactive Speaking Studio</span>
          </div>
          <h2 className="section-title">Speaking Practice</h2>
          <p className="section-subtitle">
            Improve your communication skills through short, interactive challenges.
          </p>
        </div>

        {/* Practice Mode Switcher: Standard Studio vs Gamified Practice */}
        <div className="practice-mode-switcher-container">
          <div className="practice-mode-switcher" role="tablist" aria-label="Practice Mode Selection">
            <button
              id="standard-studio-tab"
              className={`mode-tab-btn ${practiceMode === 'standard' ? 'active' : ''}`}
              onClick={() => setPracticeMode('standard')}
              role="tab"
              aria-selected={practiceMode === 'standard'}
            >
              <Mic size={18} />
              <span>Standard Studio</span>
            </button>
            <button
              id="gamified-practice-tab"
              className={`mode-tab-btn ${practiceMode === 'gamified' ? 'active' : ''}`}
              onClick={() => setPracticeMode('gamified')}
              role="tab"
              aria-selected={practiceMode === 'gamified'}
            >
              <span style={{ fontSize: '1.15rem' }}>🎮</span>
              <span>Gamified Practice</span>
              <span className="mode-tag-pill">Practice. Play. Improve.</span>
            </button>
          </div>
        </div>

        {/* Dynamic Mode View: Gamified Experience or Standard Studio Card */}
        {practiceMode === 'gamified' ? (
          <GamifiedPracticeMode
            progress={progress}
            onCompleteTask={onGamifiedTaskComplete}
            interviewHistory={interviewHistory}
            roleplayHistory={roleplayHistory}
            onSwitchToStandard={() => setPracticeMode('standard')}
          />
        ) : (
          <div className="practice-card card" id="practice-studio-card">
          {/* Topic Selector Component */}
          <TopicSelector
            selectedTopic={selectedTopic}
            onSelectTopic={(topic) => {
              setSelectedTopic(topic);
              setElapsedSeconds(0);
              setTranscript('');
            }}
            disabled={isSpeaking}
          />

          {/* Active Topic Banner */}
          <div className="active-topic-banner">
            <div className="topic-meta">
              <span className="topic-badge">Selected Prompt</span>
              <h3 className="topic-title" id="practice-topic-title">
                Topic: {selectedTopic.title}
              </h3>
            </div>
          </div>

          {/* Prompt Instruction */}
          <div className="instruction-box">
            <div className="instruction-icon">
              <Sparkles size={20} />
            </div>
            <div className="instruction-text">
              <strong>Instruction:</strong>
              <p id="practice-instruction-text">"{selectedTopic.instruction}"</p>
            </div>
          </div>

          {/* Guide Pills */}
          {selectedTopic.guidingPills && (
            <div className="prompt-guide-pills">
              <span className="guide-label">Suggested talking points:</span>
              {selectedTopic.guidingPills.map((pill, idx) => (
                <span key={idx} className="guide-pill">{idx + 1}. {pill}</span>
              ))}
            </div>
          )}

          {/* Mic permission warning if any */}
          {micError && (
            <div className="mic-warning-banner">
              <AlertCircle size={16} />
              <span>{micError}</span>
            </div>
          )}

          {/* Studio Stage */}
          <div className="studio-stage">
            {/* Stage Status */}
            <div className="stage-status">
              {isSpeaking ? (
                <span className="status-badge recording">
                  <span className="pulsing-red-dot"></span>
                  Listening & Transcribing live...
                </span>
              ) : (
                <span className="status-badge ready">
                  <CheckCircle2 size={14} />
                  Microphone Ready
                </span>
              )}
            </div>

            {/* Large Interactive Mic Button */}
            <div className="mic-interactive-wrapper">
              <div className={`mic-halo-ring ${isSpeaking ? 'active-pulse' : ''}`}></div>
              <button
                id="mic-main-btn"
                className={`large-mic-button ${isSpeaking ? 'is-recording' : ''}`}
                onClick={isSpeaking ? handleStopSpeaking : handleStartSpeaking}
                aria-label={isSpeaking ? 'Stop Speaking' : 'Start Speaking'}
                title={isSpeaking ? 'Click to stop' : 'Click to start speaking'}
              >
                <Mic size={40} className="mic-svg" />
              </button>
            </div>

            {/* Audio Waveform Bars */}
            <div className={`audio-visualizer-bars ${isSpeaking ? 'active' : 'idle'}`}>
              {[18, 32, 48, 24, 60, 36, 52, 28, 44, 58, 30, 48, 22, 38, 54, 20].map((height, i) => (
                <span 
                  key={i} 
                  className="audio-bar" 
                  style={{ 
                    '--bar-height': `${height}px`,
                    animationDelay: `${(i % 5) * 0.12}s`
                  }}
                />
              ))}
            </div>

            {/* Modular Timer Component */}
            <Timer
              selectedDuration={selectedDuration}
              onSelectDuration={(dur) => {
                setSelectedDuration(dur);
                setElapsedSeconds(0);
              }}
              elapsedSeconds={elapsedSeconds}
              isSpeaking={isSpeaking}
              onTimerEnd={handleTimerEnd}
            />

            {/* Controls Toolbar */}
            <div className="studio-actions-toolbar">
              {!isSpeaking ? (
                <button
                  id="start-speaking-btn"
                  className="btn btn-primary btn-lg"
                  onClick={handleStartSpeaking}
                >
                  <Play size={18} fill="currentColor" />
                  <span>Start Speaking</span>
                </button>
              ) : (
                <button
                  id="stop-speaking-btn"
                  className="btn btn-danger btn-lg"
                  onClick={handleStopSpeaking}
                >
                  <Square size={18} fill="currentColor" />
                  <span>Stop Speaking</span>
                </button>
              )}

              <button
                id="finish-speaking-btn"
                className="btn btn-secondary btn-lg"
                onClick={handleTimerEnd}
                disabled={elapsedSeconds === 0}
                title="Finish now and get communication feedback"
              >
                <Award size={18} />
                <span>Finish & View Feedback</span>
              </button>

              <button
                id="reset-speaking-btn"
                className="btn btn-secondary btn-lg"
                onClick={handleTryAgain}
                title="Reset timer and transcript"
              >
                <RotateCcw size={18} />
                <span>Try Again</span>
              </button>
            </div>
          </div>

          {/* Modular Live Transcript Component */}
          <Transcript
            transcript={transcript}
            onTranscriptChange={setTranscript}
            onClear={handleClearTranscript}
            onTryAgain={handleTryAgain}
            isSpeaking={isSpeaking}
            isSpeechSupported={isSpeechSupported}
          />
        </div>
        )}
      </div>

      {/* AI Feedback UI Screen Modal */}
      {showFeedback && (
        <FeedbackCard
          score={78}
          transcript={transcript}
          topicTitle={selectedTopic.title}
          onTryAgain={handleTryAgain}
          onPracticeAnother={handlePracticeAnother}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </section>
  );
}
