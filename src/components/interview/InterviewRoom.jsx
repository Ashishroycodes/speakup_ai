import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Mic, Square, RotateCcw, ArrowRight, 
  AlertCircle, Edit3, Check, Loader2, Bot, Clock, 
  LogOut, Sparkles, MessageSquare
} from 'lucide-react';
import { playRealVoiceAudio, stopCurrentVoiceAudio } from '../../services/voiceService';

export default function InterviewRoom({
  config,
  currentQuestion,
  questionNumber,
  totalQuestions,
  isLoadingQuestion,
  apiError,
  onRetryQuestion,
  onSubmitAnswer,
  onEndEarly
}) {
  const {
    interviewType,
    targetRole,
    experienceLevel,
    difficulty,
    language,
    interviewMode,
    timerLimit
  } = config;

  // Answer states
  const [candidateText, setCandidateText] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [micError, setMicError] = useState(null);
  const [inputMode, setInputMode] = useState(() => {
    return interviewMode === 'Text' ? 'text' : 'voice';
  });

  // Timer states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerIntervalRef = useRef(null);

  // Speech Recognition refs & state tracking
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);
  const candidateTextRef = useRef('');
  const baseTextRef = useRef('');
  const interimTextRef = useRef('');

  const isSpeechSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Map language to speech recognition locale
  const getRecognitionLang = (lang) => {
    if (lang === 'Hindi') return 'hi-IN';
    if (lang === 'Hinglish') return 'en-IN';
    return 'en-US';
  };

  // Synchronize manual text edits with refs
  const handleTranscriptTextChange = (newVal) => {
    setCandidateText(newVal);
    candidateTextRef.current = newVal;
    baseTextRef.current = newVal.trim();
  };

  const stopListening = () => {
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);

    // Commit any unfinalized interim speech when explicitly stopping
    const trailingInterim = interimTextRef.current.trim();
    if (trailingInterim) {
      const updated = candidateTextRef.current
        ? `${candidateTextRef.current.trim()} ${trailingInterim}`
        : trailingInterim;
      candidateTextRef.current = updated;
      setCandidateText(updated);
    }
    interimTextRef.current = '';
    setInterimText('');
    baseTextRef.current = candidateTextRef.current.trim();
  };

  const startListening = () => {
    if (!isSpeechSupported) {
      setInputMode('text');
      setMicError("Voice input isn't available in this browser. You can type your answer instead.");
      return;
    }

    // Never speak AI while mic is listening
    stopCurrentVoiceAudio();
    setIsAiSpeaking(false);
    setMicError(null);

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }

      // Base text is what was confirmed prior to starting this speech recognition session
      baseTextRef.current = candidateTextRef.current.trim();
      interimTextRef.current = '';
      setInterimText('');

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getRecognitionLang(language);

      recognition.onresult = (event) => {
        let finalStr = '';
        let liveInterim = '';
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalStr += res[0].transcript + ' ';
          } else {
            liveInterim += res[0].transcript;
          }
        }

        const trimmedFinal = finalStr.trim();
        const trimmedInterim = liveInterim.trim();

        interimTextRef.current = trimmedInterim;
        setInterimText(trimmedInterim);

        // Derive updated full transcript: base confirmed text + newly finalized speech
        // This prevents duplicating previous sentences every time isFinal triggers
        const base = baseTextRef.current;
        let updatedText = base;
        if (trimmedFinal) {
          updatedText = base ? `${base} ${trimmedFinal}` : trimmedFinal;
        }

        candidateTextRef.current = updatedText;
        setCandidateText(updatedText);
      };

      recognition.onerror = (err) => {
        if (err.error !== 'no-speech' && err.error !== 'aborted') {
          console.warn('SpeechRecognition error:', err.error);
          if (err.error === 'not-allowed') {
            setMicError('Microphone access was denied. You can type your answer instead.');
            setInputMode('text');
            isRecordingRef.current = false;
            setIsRecording(false);
          }
        }
      };

      recognition.onend = () => {
        // If user is still actively recording, restart smoothly without duplicating
        if (isRecordingRef.current) {
          baseTextRef.current = candidateTextRef.current.trim();
          interimTextRef.current = '';
          setInterimText('');
          try {
            recognition.start();
          } catch {
            isRecordingRef.current = false;
            setIsRecording(false);
          }
        } else {
          setIsRecording(false);
          setInterimText('');
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      isRecordingRef.current = true;
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone start error:', err);
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  };

  // 1. Play question audio when question changes / room mounts
  useEffect(() => {
    if (!currentQuestion?.question) return;

    let isMounted = true;

    // Stop any active audio from previous render
    stopCurrentVoiceAudio();

    // AI voice speaks the acknowledgement (if any) and the question
    const textToSpeak = currentQuestion.acknowledgment 
      ? `${currentQuestion.acknowledgment} ${currentQuestion.question}`
      : (questionNumber === 1 
          ? `Hello! Welcome to your mock interview. I will ask you one question at a time. Answer naturally, just like a real interview. Question one: ${currentQuestion.question}`
          : currentQuestion.question);

    playRealVoiceAudio(textToSpeak, {
      voice: 'onyx', // Deep professional tone for interviewer
      language: language === 'Hindi' ? 'hi' : 'en',
      onStart: () => {
        if (isMounted) setIsAiSpeaking(true);
      },
      onEnd: () => {
        if (isMounted) setIsAiSpeaking(false);
      },
      onError: () => {
        if (isMounted) setIsAiSpeaking(false);
      }
    });

    return () => {
      isMounted = false;
      stopCurrentVoiceAudio();
      stopListening();
      setIsAiSpeaking(false);
    };
  }, [currentQuestion?.question, currentQuestion?.acknowledgment, questionNumber, language]);

  // 2. Answer Timer Interval
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [questionNumber]);

  // Replay Question button
  const handleReplayQuestion = () => {
    stopListening();
    if (isAiSpeaking) {
      stopCurrentVoiceAudio();
      setIsAiSpeaking(false);
      return;
    }

    stopCurrentVoiceAudio();
    setIsAiSpeaking(true);

    const textToSpeak = currentQuestion.acknowledgment 
      ? `${currentQuestion.acknowledgment} ${currentQuestion.question}`
      : currentQuestion.question;

    playRealVoiceAudio(textToSpeak, {
      voice: 'onyx',
      language: language === 'Hindi' ? 'hi' : 'en',
      onStart: () => setIsAiSpeaking(true),
      onEnd: () => setIsAiSpeaking(false),
      onError: () => setIsAiSpeaking(false)
    });
  };

  // Try again
  const handleTryAgain = () => {
    stopListening();
    stopCurrentVoiceAudio();
    setIsAiSpeaking(false);
    candidateTextRef.current = '';
    baseTextRef.current = '';
    interimTextRef.current = '';
    setCandidateText('');
    setInterimText('');
    setIsEditingTranscript(false);
    if (inputMode === 'voice') {
      startListening();
    }
  };

  // Submit Answer
  const handleSubmit = () => {
    stopListening();
    stopCurrentVoiceAudio();
    setIsAiSpeaking(false);

    const finalAnswer = (candidateTextRef.current || candidateText || interimText).trim();
    if (!finalAnswer) return;

    onSubmitAnswer({
      questionNumber,
      question: currentQuestion.question,
      answer: finalAnswer,
      timeTakenSeconds: elapsedSeconds
    });
  };

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isTimerExpired = timerLimit > 0 && elapsedSeconds > timerLimit;
  const progressPercent = Math.round(((questionNumber - 1) / totalQuestions) * 100);

  return (
    <div className="room-card" id="interview-room-container">
      {/* 1. Top Bar: Progress and Metadata */}
      <div className="room-topbar">
        <div className="room-progress-meta">
          <span className="room-question-step">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="room-progress-track">
            <div 
              className="room-progress-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="room-badges-row">
          <span className="room-badge role">{targetRole}</span>
          <span className="room-badge">{experienceLevel}</span>
          <span className="room-badge">{interviewType}</span>
          <span className={`room-badge diff-${difficulty.toLowerCase()}`}>{difficulty}</span>
          <span className="room-badge">{language}</span>

          <button
            type="button"
            className="room-end-btn"
            onClick={() => {
              stopListening();
              stopCurrentVoiceAudio();
              setIsAiSpeaking(false);
              onEndEarly();
            }}
            title="Conclude interview early and generate report"
            id="end-interview-early-btn"
          >
            <LogOut size={13} />
            <span>End Early</span>
          </button>
        </div>
      </div>

      {/* 2. API Error Banner with Retry */}
      {apiError && (
        <div className="room-error-banner" role="alert">
          <span>⚠️ {apiError}</span>
          <div className="room-error-actions">
            <button 
              type="button" 
              className="chip-btn" 
              onClick={onRetryQuestion}
              style={{ padding: '4px 10px', fontSize: '12px' }}
            >
              Retry
            </button>
            <button 
              type="button" 
              className="chip-btn" 
              onClick={onEndEarly}
              style={{ padding: '4px 10px', fontSize: '12px' }}
            >
              End Interview
            </button>
          </div>
        </div>
      )}

      {/* 3. AI Interviewer Card */}
      <div className="interviewer-box">
        <div className="interviewer-header">
          <div className="interviewer-identity">
            <div className={`interviewer-avatar ${isAiSpeaking ? 'speaking' : ''}`}>
              <Bot size={22} />
            </div>
            <div className="interviewer-name-row">
              <span className="interviewer-name">AI Interviewer</span>
              <span className="interviewer-status">
                <span className={`status-dot ${isAiSpeaking ? 'speaking' : ''}`} />
                {isLoadingQuestion ? 'Thinking...' : (isAiSpeaking ? 'Speaking question...' : 'Listening')}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="replay-btn"
            onClick={handleReplayQuestion}
            disabled={isLoadingQuestion}
            title={isAiSpeaking ? 'Stop playing question audio' : 'Replay question audio'}
            id="replay-question-btn"
          >
            <Volume2 size={15} />
            <span>{isAiSpeaking ? 'Stop Audio' : 'Replay Question'}</span>
          </button>
        </div>

        {/* Previous Acknowledgment */}
        {currentQuestion?.acknowledgment && (
          <div className="interviewer-acknowledgment">
            "{currentQuestion.acknowledgment}"
          </div>
        )}

        {/* Question Text */}
        <h3 className="interviewer-question-text" id="interviewer-question-heading">
          {isLoadingQuestion ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <Loader2 size={18} className="spin-animation" />
              <span>Preparing your next question...</span>
            </span>
          ) : (
            currentQuestion?.question || "Please tell me about yourself."
          )}
        </h3>

        {/* Tips pill if available */}
        {currentQuestion?.tips && !isLoadingQuestion && (
          <div className="question-tip-pill">
            <Sparkles size={13} />
            <span>Tip: {currentQuestion.tips}</span>
          </div>
        )}
      </div>

      {/* 4. Candidate Response Area */}
      <div className="candidate-box">
        <div className="candidate-box-header">
          <div className="candidate-title-group">
            <MessageSquare size={17} className="text-primary" />
            <span>Your Answer</span>
          </div>

          {/* Timer Display */}
          <div 
            className={`timer-indicator ${isTimerExpired ? 'warning' : ''}`}
            title={timerLimit > 0 ? `Target: ${timerLimit}s` : 'No limit'}
          >
            <Clock size={13} />
            <span>Answer Time: {formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Timer Expiry Non-Blocking Notice */}
        {isTimerExpired && (
          <div className="timer-warning-msg">
            ⏱ Time is up. You can still submit your answer.
          </div>
        )}

        {/* Microphone denied / unsupported notice */}
        {micError && (
          <div className="room-error-banner" style={{ marginBottom: '12px' }}>
            <AlertCircle size={15} />
            <span>{micError}</span>
          </div>
        )}

        {/* Mode Selector / Fallback Toggle */}
        <div className="voice-controls-bar">
          {inputMode === 'voice' ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {!isRecording ? (
                <button
                  type="button"
                  className="voice-primary-btn start"
                  onClick={startListening}
                  disabled={isLoadingQuestion}
                  id="interview-start-speaking-btn"
                >
                  <Mic size={17} />
                  <span>Start Speaking</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="voice-primary-btn stop"
                  onClick={stopListening}
                  id="interview-stop-speaking-btn"
                >
                  <Square size={16} fill="currentColor" />
                  <span>Stop Speaking</span>
                </button>
              )}

              <button
                type="button"
                className="voice-mode-toggle-btn"
                onClick={() => {
                  stopListening();
                  setInputMode('text');
                }}
                id="switch-to-text-mode-btn"
              >
                Switch to Text
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Typing answer mode
              </span>
              {isSpeechSupported && (
                <button
                  type="button"
                  className="voice-mode-toggle-btn"
                  onClick={() => setInputMode('voice')}
                  id="switch-to-voice-mode-btn"
                >
                  <Mic size={13} style={{ marginRight: '4px' }} />
                  Switch to Voice
                </button>
              )}
            </div>
          )}
        </div>

        {/* Answer Content Area */}
        {inputMode === 'voice' ? (
          /* Voice Mode Transcript Review Box */
          <div className={`transcript-card ${isRecording ? 'speaking' : ''}`}>
            <div className="transcript-header">
              <span className="transcript-title">
                {isRecording ? '🎙 Listening live...' : 'Recorded Answer Transcript'}
              </span>
              {candidateText && !isRecording && (
                <button
                  type="button"
                  className="transcript-edit-btn"
                  onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                  id="edit-transcript-toggle-btn"
                >
                  {isEditingTranscript ? <Check size={14} /> : <Edit3 size={14} />}
                  <span>{isEditingTranscript ? 'Done Editing' : 'Edit Transcript'}</span>
                </button>
              )}
            </div>

            {isEditingTranscript ? (
              <textarea
                className="transcript-textarea"
                value={candidateText}
                onChange={(e) => handleTranscriptTextChange(e.target.value)}
                placeholder="Edit your speech transcript here..."
                aria-label="Edit speech transcript"
              />
            ) : (
              <div className={`transcript-body ${!candidateText && !interimText ? 'empty' : ''}`}>
                {candidateText ? (
                  <>
                    <span>{candidateText}</span>
                    {interimText && <span className="transcript-live-interim"> {interimText}</span>}
                  </>
                ) : interimText ? (
                  <span className="transcript-live-interim">{interimText}</span>
                ) : isRecording ? (
                  <span className="transcript-placeholder listening">
                    <span className="live-speech-pulse" />
                    Listening to your voice... Speak your answer now.
                  </span>
                ) : (
                  "Click 'Start Speaking' to answer this question."
                )}
              </div>
            )}
          </div>
        ) : (
          /* Text Mode Fallback Area */
          <div className="text-input-wrap">
            <textarea
              className="candidate-textarea"
              value={candidateText}
              onChange={(e) => handleTranscriptTextChange(e.target.value)}
              placeholder="Type your comprehensive answer here naturally, just like a real interview..."
              disabled={isLoadingQuestion}
              id="interview-text-answer-input"
              aria-label="Candidate interview answer"
            />
            <div className="text-meta-row">
              <span>{candidateText.trim() ? candidateText.trim().split(/\s+/).length : 0} words</span>
              <span>{candidateText.length} characters</span>
            </div>
          </div>
        )}

        {/* Action Buttons: Try Again & Submit Answer */}
        <div className="candidate-actions">
          {(candidateText.trim() || interimText.trim()) && (
            <button
              type="button"
              className="try-again-btn"
              onClick={handleTryAgain}
              disabled={isLoadingQuestion || isRecording}
              id="try-again-answer-btn"
            >
              <RotateCcw size={15} />
              <span>Try Again</span>
            </button>
          )}

          <button
            type="button"
            className="submit-answer-btn"
            onClick={handleSubmit}
            disabled={(!candidateText.trim() && !interimText.trim()) || isLoadingQuestion}
            id="submit-answer-btn"
          >
            {isLoadingQuestion ? (
              <>
                <Loader2 size={16} className="spin-animation" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Answer</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
