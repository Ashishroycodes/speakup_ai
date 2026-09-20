import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  Lightbulb, 
  Sparkles, 
  Edit3, 
  AlertTriangle, 
  AlertCircle,
  Clock,
  LogOut,
  HelpCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { 
  THEME_VOICES, 
  REAL_VOICES, 
  playRealVoiceAudio, 
  stopCurrentVoiceAudio 
} from '../../services/voiceService';
import { sendRoleplayTurn } from '../../services/roleplayService';

export default function RoleplayRoom({
  config,
  theme = 'dark',
  onEndRoleplay
}) {
  const {
    scenario,
    category,
    character,
    characterRole,
    characterAvatar,
    characterVoice = 'onyx',
    openingLine = "Hello! What can I help you with today?",
    hint: initialHint,
    exampleResponse: initialExample,
    difficulty = 'Intermediate',
    language = 'English',
    goal = 'Confidence'
  } = config;

  // Theme-adaptive AI Voice (derived from theme or manual override)
  const [voiceOverride, setVoiceOverride] = useState(null);
  const themeVoiceId = THEME_VOICES[theme]?.voice || characterVoice || 'onyx';
  const activeVoice = voiceOverride || themeVoiceId;
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);

  // Session timer & turn progression
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isConversationCompleted, setIsConversationCompleted] = useState(false);
  const [conversationStage, setConversationStage] = useState('Turn 1 of 6');
  const totalExpectedTurns = 6;

  // Status state: 'speaking' | 'listening' | 'thinking' | 'waiting' | 'error'
  const [roleplayStatus, setRoleplayStatus] = useState('speaking');
  const [statusMessage, setStatusMessage] = useState('AI Speaking');

  // Conversation history stream
  const [conversation, setConversation] = useState([
    {
      id: 'init-turn-1',
      sender: 'ai',
      text: openingLine,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Input states
  const [candidateText, setCandidateText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Challenge event banner
  const [activeChallenge, setActiveChallenge] = useState(null);

  // Contextual learning aids
  const [currentHint, setCurrentHint] = useState(initialHint || 'State your point directly and politely.');
  const [currentExample, setCurrentExample] = useState(initialExample || 'Thank you for your time. Here is what I wanted to discuss.');
  const [showHintBox, setShowHintBox] = useState(false);
  const [showExampleBox, setShowExampleBox] = useState(false);
  const [realtimeFeedback, setRealtimeFeedback] = useState(null);

  // Tracking refs to eliminate race conditions & duplicate loops
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const candidateTextRef = useRef('');
  const baseTextRef = useRef('');
  const isAiSpeakingRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const timerIntervalRef = useRef(null);
  const streamScrollRef = useRef(null);

  const isSpeechSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // 1. Session Duration Timer
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Format MM:SS helper
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Auto-scroll stream to bottom on new dialogue
  useEffect(() => {
    if (streamScrollRef.current) {
      streamScrollRef.current.scrollTop = streamScrollRef.current.scrollHeight;
    }
  }, [conversation, interimText]);

  // 2. Stop Listening helper
  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {
        /* ignore recognition stop error */
      }
      recognitionRef.current = null;
    }
  }, []);

  // 3. Start Listening helper (with non-cumulative transcript math)
  const startListening = useCallback(() => {
    if (isAiSpeakingRef.current || isSubmittingRef.current) return;
    if (!isSpeechSupported) {
      setErrorMessage("Voice input isn't available in this browser. You can continue using text below.");
      setRoleplayStatus('error');
      setStatusMessage('Mic Unavailable');
      return;
    }

    stopListening();
    stopCurrentVoiceAudio();

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';

      baseTextRef.current = candidateTextRef.current.trim();
      setInterimText('');
      setErrorMessage(null);
      isListeningRef.current = true;
      setIsListening(true);
      setRoleplayStatus('listening');
      setStatusMessage('Listening to You');

      recognition.onresult = (event) => {
        let liveFinal = '';
        let liveInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            liveFinal += res[0].transcript + ' ';
          } else {
            liveInterim += res[0].transcript + ' ';
          }
        }

        const base = baseTextRef.current ? baseTextRef.current + ' ' : '';
        const updatedCandidateText = (base + liveFinal).trim();

        if (updatedCandidateText !== candidateTextRef.current) {
          candidateTextRef.current = updatedCandidateText;
          setCandidateText(updatedCandidateText);
        }
        setInterimText(liveInterim.trim());
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage("Microphone permission was denied. You can continue by typing your response.");
          stopListening();
          setRoleplayStatus('error');
          setStatusMessage('Mic Permission Denied');
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('Roleplay speech recognition note:', event.error);
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current && !isAiSpeakingRef.current && !isSubmittingRef.current) {
          try {
            recognition.start();
          } catch {
            isListeningRef.current = false;
            setIsListening(false);
            setRoleplayStatus('waiting');
            setStatusMessage('Waiting for You');
          }
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Recognition start error:', err);
      setIsListening(false);
      isListeningRef.current = false;
      setRoleplayStatus('error');
      setStatusMessage('Mic Error');
    }
  }, [isSpeechSupported, language, stopListening]);

  // 4. Voice Speaking Helper
  const speakDialogue = useCallback((textToSpeak) => {
    if (!textToSpeak) return;

    stopListening();
    stopCurrentVoiceAudio();

    isAiSpeakingRef.current = true;
    setRoleplayStatus('speaking');
    setStatusMessage(`${character} Speaking`);

    playRealVoiceAudio(textToSpeak, {
      voice: activeVoice,
      language: language === 'Hindi' ? 'hi' : 'en',
      onStart: () => {
        isAiSpeakingRef.current = true;
        setRoleplayStatus('speaking');
        setStatusMessage(`${character} Speaking`);
      },
      onEnd: () => {
        isAiSpeakingRef.current = false;
        setRoleplayStatus('waiting');
        setStatusMessage('Waiting for You');
      },
      onError: () => {
        isAiSpeakingRef.current = false;
        setRoleplayStatus('waiting');
        setStatusMessage('Waiting for You');
      }
    });
  }, [activeVoice, character, language, stopListening]);

  // 5. Initial Character Greeting Voice Playback on Mount
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        speakDialogue(openingLine);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopCurrentVoiceAudio();
      stopListening();
    };
  }, [openingLine, speakDialogue, stopListening]);

  // 6. Handle Replay Character Audio
  const handleReplayCharacter = () => {
    const lastAiTurn = [...conversation].reverse().find(t => t.sender === 'ai');
    if (lastAiTurn?.text) {
      speakDialogue(lastAiTurn.text);
    }
  };

  // 7. Manual text change synchronization
  const handleTranscriptTextChange = (e) => {
    const val = e.target.value;
    setCandidateText(val);
    candidateTextRef.current = val;
    baseTextRef.current = val;
  };

  // 8. Submit candidate turn
  const handleSubmitTurn = async () => {
    const textToSend = candidateText.trim();
    if (!textToSend || isSubmittingRef.current) return;

    stopListening();
    stopCurrentVoiceAudio();

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setRoleplayStatus('thinking');
    setStatusMessage(`${character} Thinking...`);
    setErrorMessage(null);

    const userTurn = {
      id: `user-turn-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedConversation = [...conversation, userTurn];
    setConversation(updatedConversation);

    // Clear candidate input buffer
    setCandidateText('');
    candidateTextRef.current = '';
    baseTextRef.current = '';
    setInterimText('');
    setIsEditingTranscript(false);
    setShowHintBox(false);
    setShowExampleBox(false);

    const userTurnsCount = conversation.filter(t => t.sender === 'user').length + 1;

    try {
      const response = await sendRoleplayTurn({
        scenario,
        category,
        character,
        difficulty,
        language,
        goal,
        turnCount: userTurnsCount,
        totalExpectedTurns,
        conversationHistory: updatedConversation,
        userMessage: textToSend
      });

      const aiTurn = {
        id: `ai-turn-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        feedback: response.quickFeedback,
        skill: response.detectedSkill,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversation(prev => [...prev, aiTurn]);

      if (response.isCompleted || userTurnsCount >= totalExpectedTurns) {
        setIsConversationCompleted(true);
      }
      if (response.stage) {
        setConversationStage(response.stage);
      }

      if (response.hint) setCurrentHint(response.hint);
      if (response.exampleResponse) setCurrentExample(response.exampleResponse);
      if (response.quickFeedback) setRealtimeFeedback(response.quickFeedback);

      if (response.isChallengeEvent) {
        setActiveChallenge("Challenge: The situation has escalated. Address this objection diplomatically.");
      } else {
        setActiveChallenge(null);
      }

      // Play AI character voice
      speakDialogue(response.reply);

    } catch {
      setErrorMessage("Could not connect to roleplay service. You can retry sending.");
      setRoleplayStatus('error');
      setStatusMessage('Connection Error');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // 9. End Roleplay Session
  const handleFinishRoleplay = () => {
    stopListening();
    stopCurrentVoiceAudio();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    onEndRoleplay({
      scenario,
      category,
      character,
      characterRole,
      characterAvatar,
      difficulty,
      language,
      goal,
      durationSeconds: Math.max(15, elapsedSeconds),
      conversationHistory: conversation
    });
  };

  return (
    <div className="roleplay-room-container" id="roleplay-room-wrapper">
      {/* Top Header Bar */}
      <div className="room-topbar">
        <div className="room-scenario-meta">
          <div className="room-character-avatar">
            {characterAvatar}
          </div>
          <div className="room-scenario-text">
            <h3>{scenario}</h3>
            <p>Roleplay Partner: <strong>{character}</strong> ({characterRole}) • {difficulty}</p>
          </div>
        </div>

        <div className="room-meta-actions">
          {/* Conversation Step Progression */}
          <div className="room-step-pill" title={`Roleplay Stage: ${conversationStage}`}>
            <span style={{ color: '#818cf8', fontWeight: 700 }}>
              Step {Math.min(conversation.filter(t => t.sender === 'user').length + 1, totalExpectedTurns)}
            </span>
            <span style={{ color: '#94a3b8' }}>/{totalExpectedTurns}</span>
          </div>

          {/* Theme Voice Pill & Quick Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="room-voice-pill-btn"
              onClick={() => setShowVoiceSelector(!showVoiceSelector)}
              title="Change AI Voice"
              id="roleplay-voice-selector-toggle-btn"
            >
              <Volume2 size={13} style={{ color: '#38bdf8' }} />
              <span>Voice: <strong>{REAL_VOICES.find(v => v.id === activeVoice)?.name || activeVoice}</strong></span>
            </button>

            {showVoiceSelector && (
              <div className="voice-selector-flyout-menu" id="roleplay-voice-flyout">
                <div className="voice-flyout-header">
                  <span>Theme & Character Voices</span>
                  <button type="button" onClick={() => setShowVoiceSelector(false)}><X size={12} /></button>
                </div>
                {REAL_VOICES.map((v) => {
                  const isThemeMatch = Object.entries(THEME_VOICES).find(([, tv]) => tv.voice === v.id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`voice-option-row ${activeVoice === v.id ? 'active' : ''}`}
                      onClick={() => {
                        setVoiceOverride(v.id);
                        setShowVoiceSelector(false);
                        speakDialogue(`AI voice changed to ${v.name}.`);
                      }}
                    >
                      <div className="voice-name-col">
                        <span className="voice-title">{v.name}</span>
                        {isThemeMatch && (
                          <span className="voice-theme-badge">{isThemeMatch[0]}</span>
                        )}
                      </div>
                      <span className="voice-style-text">{v.style}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="room-timer-pill">
            <Clock size={15} />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            type="button"
            className="end-roleplay-btn"
            onClick={handleFinishRoleplay}
            id="finish-roleplay-session-btn"
          >
            <LogOut size={14} style={{ display: 'inline', marginRight: '4px' }} />
            <span>End Roleplay</span>
          </button>
        </div>
      </div>

      {/* Real-Time Status Pill & Turn Progression Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div className={`roleplay-status-pill status-${roleplayStatus}`} id="roleplay-status-indicator" style={{ marginBottom: 0 }}>
          <span className="status-dot-pulse" />
          <span>{statusMessage}</span>
        </div>

        {realtimeFeedback && (
          <span className="dialogue-feedback-tag" style={{ display: 'inline-block' }}>
            {realtimeFeedback}
          </span>
        )}

        <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginLeft: 'auto' }}>
          {conversationStage}
        </span>
      </div>

      {/* Completion Banner (When Roleplay reaches final conclusion) */}
      {isConversationCompleted && (
        <div className="roleplay-completed-banner" id="roleplay-completion-banner">
          <div className="completion-content-group">
            <Sparkles size={22} style={{ color: '#fbbf24', flexShrink: 0 }} />
            <div>
              <h4>🎉 Roleplay Completed!</h4>
              <p>You and {character} navigated the scenario to a natural conclusion. Click below to view your full 9-metric analysis report.</p>
            </div>
          </div>
          <button
            type="button"
            className="completion-view-report-btn"
            onClick={handleFinishRoleplay}
            id="view-roleplay-report-completed-btn"
          >
            <span>View Analysis Report</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Challenge Event Banner (Advanced) */}
      {activeChallenge && (
        <div className="challenge-event-banner" id="challenge-event-banner">
          <AlertTriangle size={18} />
          <span>{activeChallenge}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div 
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.875rem'
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Dialogue Conversation Stream */}
      <div className="roleplay-dialogue-stream" ref={streamScrollRef} id="roleplay-dialogue-stream">
        {conversation.map((turn) => {
          const isAi = turn.sender === 'ai';
          return (
            <div 
              key={turn.id} 
              className={`dialogue-turn ${isAi ? 'ai-turn' : 'user-turn'}`}
            >
              <div className="dialogue-avatar">
                {isAi ? characterAvatar : '👤'}
              </div>

              <div className="dialogue-bubble">
                <p style={{ margin: 0 }}>{turn.text}</p>
                <div className="dialogue-bubble-meta">
                  <span>{isAi ? character : 'You'} • {turn.timestamp}</span>
                  {turn.skill && (
                    <span className="dialogue-feedback-tag">
                      {turn.skill}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live interim candidate speech preview */}
        {isListening && interimText && (
          <div className="dialogue-turn user-turn" style={{ opacity: 0.8 }}>
            <div className="dialogue-avatar">🎙️</div>
            <div className="dialogue-bubble" style={{ border: '1px dashed rgba(255, 255, 255, 0.4)' }}>
              <p style={{ margin: 0, fontStyle: 'italic' }}>"{interimText}..."</p>
              <div className="dialogue-bubble-meta">
                <span>Listening live...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contextual Learning Aids (Hints & Example) */}
      <div className="roleplay-aids-deck">
        <button
          type="button"
          className="aid-chip-btn"
          onClick={() => {
            setShowHintBox(!showHintBox);
            setShowExampleBox(false);
          }}
          id="roleplay-hint-toggle-btn"
        >
          <Lightbulb size={15} style={{ color: '#fbbf24' }} />
          <span>Need a Hint?</span>
        </button>

        <button
          type="button"
          className="aid-chip-btn"
          onClick={() => {
            setShowExampleBox(!showExampleBox);
            setShowHintBox(false);
          }}
          id="roleplay-example-toggle-btn"
        >
          <HelpCircle size={15} style={{ color: '#38bdf8' }} />
          <span>Show Example</span>
        </button>

        <button
          type="button"
          className="aid-chip-btn"
          onClick={handleReplayCharacter}
          id="roleplay-replay-btn"
        >
          <Volume2 size={15} style={{ color: '#a5b4fc' }} />
          <span>Replay {character}</span>
        </button>
      </div>

      {/* Hint Flyout Box */}
      {showHintBox && (
        <div className="aid-box-flyout" id="roleplay-hint-box">
          <div className="aid-box-header">
            <span>💡 Situational Strategy Hint</span>
            <button 
              type="button" 
              onClick={() => setShowHintBox(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
          <p className="aid-box-content">{currentHint}</p>
        </div>
      )}

      {/* Example Flyout Box */}
      {showExampleBox && (
        <div className="aid-box-flyout" id="roleplay-example-box" style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}>
          <div className="aid-box-header" style={{ color: '#38bdf8' }}>
            <span>⭐ Suggested Natural Response</span>
            <button 
              type="button" 
              onClick={() => setShowExampleBox(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
          <p className="aid-box-content">"{currentExample}"</p>
          <button
            type="button"
            onClick={() => {
              setCandidateText(currentExample);
              candidateTextRef.current = currentExample;
              baseTextRef.current = currentExample;
              setShowExampleBox(false);
            }}
            style={{
              marginTop: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              cursor: 'pointer'
            }}
          >
            Use This Example
          </button>
        </div>
      )}

      {/* User Input Controls Deck */}
      <div className="roleplay-controls-card">
        {/* Transcript review / manual typing textarea */}
        <div className="transcript-review-box">
          <textarea
            className="transcript-textarea"
            placeholder={
              isListening 
                ? "Listening... Your speech will appear here. You can also type directly."
                : "Speak or type your response to continue the roleplay..."
            }
            value={candidateText}
            onChange={handleTranscriptTextChange}
            id="roleplay-transcript-textarea"
          />
        </div>

        {/* Action Buttons Row */}
        <div className="controls-actions-row">
          <div className="controls-group-left">
            {/* Mic Toggle Button */}
            {isSpeechSupported ? (
              <button
                type="button"
                className={`mic-toggle-btn ${isListening ? 'recording' : ''}`}
                onClick={isListening ? stopListening : startListening}
                id="roleplay-mic-toggle-btn"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isListening ? 'Stop Speaking' : 'Start Speaking'}</span>
              </button>
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Type your response above.
              </span>
            )}

            {/* Edit mode toggle */}
            <button
              type="button"
              className="secondary-control-btn"
              onClick={() => setIsEditingTranscript(!isEditingTranscript)}
              id="roleplay-edit-transcript-btn"
            >
              <Edit3 size={15} />
              <span>{isEditingTranscript ? 'Done Editing' : 'Edit Transcript'}</span>
            </button>
          </div>

          <div className="controls-group-right">
            {/* Send Turn Button */}
            <button
              type="button"
              className="send-turn-btn"
              onClick={handleSubmitTurn}
              disabled={isSubmitting || !candidateText.trim()}
              id="roleplay-send-turn-btn"
            >
              {isSubmitting ? (
                <>
                  <Sparkles size={16} className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Response</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
