import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, MicOff, PhoneOff, Volume2, VolumeX, Sparkles,
  RotateCcw, MessageSquare, ChevronDown, Headphones, ArrowRight,
  AlertCircle, Briefcase, GraduationCap, Coffee, Check
} from 'lucide-react';
import { sendChatMessage } from '../../services/aiService';
import { 
  REAL_VOICES, 
  playRealVoiceAudio, 
  stopCurrentVoiceAudio, 
  createAudioAnalyser 
} from '../../services/voiceService';
import './RealTimeVoiceCall.css';

// Contextual conversation starters based on active mode
const MODE_CONVERSATION_STARTERS = {
  casual: "Hey there! Great to connect with you. How has your day been going so far? Tell me what you've been up to!",
  interview: "Hello! Welcome to your mock interview session. Let's start with a classic: Could you introduce yourself and tell me what role you're targeting?",
  college: "Hey! What exciting project, subject, or campus activity have you been spending time on in college lately?",
  workplace: "Hello! In today's workplace sync, how are your key priorities and deliverables progressing?",
  group_discussion: "Hi there! Let's practice expressing your viewpoint clearly. What is a recent news or tech trend that caught your attention?",
  presentation: "Welcome! Ready to practice your pitch? Whenever you're ready, give me the opening hook of your presentation."
};

export default function RealTimeVoiceCall({
  isOpen,
  onClose,
  selectedLanguage,
  selectedMode,
  selectedDifficulty,
  selectedGoal,
  onNewMessage,
  onOpenAnalysis
}) {
  // Calling engine: 'neural_voice' | 'webrtc_realtime'
  const [engineType, _setEngineType] = useState('neural_voice');
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);

  // 5 Explicit Call states: 'ready' | 'listening' | 'processing' | 'speaking' | 'error'
  const [callState, setCallState] = useState('connecting'); 
  const [isMuted, setIsMuted] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const initialGreeting = MODE_CONVERSATION_STARTERS[selectedMode] || MODE_CONVERSATION_STARTERS.casual;
  const [lastUserSpeech, setLastUserSpeech] = useState('');
  const [lastAiResponse, setLastAiResponse] = useState(initialGreeting);
  const [callDuration, setCallDuration] = useState(0);
  const [micPermissionError, setMicPermissionError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [visualizerScale, setVisualizerScale] = useState(1);

  // Conversation system states
  const [conversationTurns, setConversationTurns] = useState(() => [{
    id: 'ai-init-call-1',
    sender: 'ai',
    role: 'assistant',
    text: initialGreeting,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [isFeedOpen, setIsFeedOpen] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState({ duration: 0, turns: 0, words: 0 });

  // Synchronous references
  const isCallOpenRef = useRef(false);
  const callStateRef = useRef('connecting');
  const isMutedRef = useRef(false);
  const isProcessingRef = useRef(false);
  const lastUserSpeechRef = useRef('');
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const timerRef = useRef(null);
  const webrtcClientRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const micStreamRef = useRef(null);
  const handleStudentFinishedSpeakingRef = useRef(null);
  const voiceMenuRef = useRef(null);
  const feedScrollAreaRef = useRef(null);

  const isSpeechSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Sync state ref
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  // Click outside to close voice menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (voiceMenuRef.current && !voiceMenuRef.current.contains(e.target)) {
        setShowVoiceMenu(false);
      }
    };
    if (showVoiceMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVoiceMenu]);

  // Auto-scroll conversation feed within modal container
  useEffect(() => {
    if (isFeedOpen && feedScrollAreaRef.current) {
      feedScrollAreaRef.current.scrollTo({
        top: feedScrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [conversationTurns, isFeedOpen]);

  // Minimal fluid visualizer animation loop
  const startVisualizerLoop = useCallback((analyserWrapper) => {
    if (!analyserWrapper) return;

    const renderLoop = () => {
      if (!isCallOpenRef.current) return;

      const freqData = analyserWrapper.getFrequencyData();
      if (freqData && freqData.length > 0) {
        let sum = 0;
        const count = Math.min(32, freqData.length);
        for (let i = 0; i < count; i++) {
          sum += freqData[i];
        }
        const avg = sum / count;
        // Scale between 1.0 and 1.35 for subtle, organic breathing
        const scale = 1 + Math.min(0.35, (avg / 255) * 0.45);
        setVisualizerScale(scale);
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(renderLoop);
  }, []);

  const stopVisualizerLoop = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setVisualizerScale(1);
  }, []);

  // Format call duration MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60).toString().padStart(2, '0');
    const remainingSecs = (secs % 60).toString().padStart(2, '0');
    return `${mins}:${remainingSecs}`;
  };

  // Language mapper for Web Speech API
  const getRecognitionLang = (lang) => {
    if (lang === 'hi') return 'hi-IN';
    if (lang === 'en') return 'en-US';
    return 'en-IN'; // Indian English provides highest accuracy for English and Hinglish in Chromium
  };

  // Accidental noise & minimum text threshold
  const isValidSpeech = (text) => {
    if (!text) return false;
    const clean = text.trim();
    if (clean.length < 3) return false;
    return /[a-zA-Z0-9\u0900-\u097F]/.test(clean);
  };

  // Safe Speech Recognition Starter
  const startListening = useCallback(() => {
    if (!isCallOpenRef.current || !isSpeechSupported || isMutedRef.current) return;

    if (callStateRef.current === 'speaking' || isProcessingRef.current) {
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
        recognitionRef.current = null;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getRecognitionLang(selectedLanguage);

      let accumulatedText = '';

      recognition.onresult = (event) => {
        if (!isCallOpenRef.current || callStateRef.current === 'speaking' || isProcessingRef.current) return;

        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            accumulatedText += ' ' + chunk;
          } else {
            currentInterim += chunk;
          }
        }

        const fullSpoken = (accumulatedText + ' ' + currentInterim).trim();
        setLiveTranscript(fullSpoken);

        // Turn-taking silence detection (1.8s pause auto-triggers response if valid)
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        if (isValidSpeech(fullSpoken)) {
          silenceTimeoutRef.current = setTimeout(() => {
            if (isCallOpenRef.current && callStateRef.current === 'listening' && !isProcessingRef.current) {
              if (handleStudentFinishedSpeakingRef.current) {
                handleStudentFinishedSpeakingRef.current(fullSpoken);
              }
            }
          }, 1800);
        }
      };

      recognition.onerror = (err) => {
        if (err.error === 'not-allowed') {
          setMicPermissionError('Microphone permission was denied. Please allow microphone access in your browser.');
          setCallState('error');
          callStateRef.current = 'error';
          return;
        }
        if (err.error !== 'no-speech' && err.error !== 'aborted') {
          console.warn('RealTime voice recognition note:', err.error);
        }
      };

      recognition.onend = () => {
        if (isCallOpenRef.current && callStateRef.current === 'listening' && !isMutedRef.current && !isProcessingRef.current) {
          setTimeout(() => {
            if (isCallOpenRef.current && callStateRef.current === 'listening' && !isProcessingRef.current) {
              try { recognition.start(); } catch { /* ignore */ }
            }
          }, 150);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      callStateRef.current = 'listening';
      setCallState('listening');

      if (micStreamRef.current && (!audioAnalyserRef.current || engineType === 'neural_voice')) {
        if (audioAnalyserRef.current) audioAnalyserRef.current.cleanup();
        audioAnalyserRef.current = createAudioAnalyser(micStreamRef.current);
        if (audioAnalyserRef.current) {
          startVisualizerLoop(audioAnalyserRef.current);
        }
      }
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
    }
  }, [isSpeechSupported, selectedLanguage, engineType, startVisualizerLoop]);

  // Stop listening helper
  const stopListening = useCallback(() => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
  }, []);

  // Speak AI response with real human voice
  const speakAIResponse = useCallback((text) => {
    if (!isCallOpenRef.current || !text) return;

    stopListening();
    stopCurrentVoiceAudio();

    callStateRef.current = 'speaking';
    setCallState('speaking');

    playRealVoiceAudio(text, {
      voice: selectedVoice,
      language: selectedLanguage,
      onAudioElementCreated: (audioEl) => {
        if (audioAnalyserRef.current) audioAnalyserRef.current.cleanup();
        audioAnalyserRef.current = createAudioAnalyser(audioEl);
        if (audioAnalyserRef.current) {
          startVisualizerLoop(audioAnalyserRef.current);
        }
      },
      onStart: () => {
        if (isCallOpenRef.current) {
          callStateRef.current = 'speaking';
          setCallState('speaking');
        }
      },
      onEnd: () => {
        if (!isCallOpenRef.current) return;
        stopVisualizerLoop();
        if (audioAnalyserRef.current) {
          audioAnalyserRef.current.cleanup();
          audioAnalyserRef.current = null;
        }

        callStateRef.current = 'ready';
        setCallState('ready');
        // Brief cooldown to avoid speaker echo, then auto-listen if not muted
        setTimeout(() => {
          if (isCallOpenRef.current && (callStateRef.current === 'ready' || callStateRef.current === 'listening') && !isMutedRef.current) {
            startListening();
          }
        }, 400);
      },
      onError: (err) => {
        console.warn('Voice playback note, resuming ready state:', err);
        if (isCallOpenRef.current) {
          callStateRef.current = 'ready';
          setCallState('ready');
          setTimeout(() => {
            if (isCallOpenRef.current && !isMutedRef.current) {
              startListening();
            }
          }, 400);
        }
      }
    });
  }, [selectedVoice, selectedLanguage, startListening, stopListening, startVisualizerLoop, stopVisualizerLoop]);

  // Handle student finished speaking with full multi-turn conversation memory
  const handleStudentFinishedSpeaking = useCallback(async (spokenText) => {
    if (isProcessingRef.current) return;

    const textToSend = (spokenText || liveTranscript).trim();
    if (!isValidSpeech(textToSend)) {
      setLiveTranscript('');
      return;
    }

    isProcessingRef.current = true;
    stopListening();
    setLastUserSpeech(textToSend);
    lastUserSpeechRef.current = textToSend;
    setLiveTranscript('');
    setApiError(null);
    callStateRef.current = 'processing';
    setCallState('processing');

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversationTurns((prev) => [...prev, userMessage]);
    if (onNewMessage) onNewMessage(userMessage);

    try {
      // Build conversation history including all previous turns
      const turnsHistory = [...conversationTurns, userMessage].map((t) => ({
        sender: t.sender,
        role: t.sender === 'user' ? 'user' : 'assistant',
        text: t.text
      }));

      const aiReply = await sendChatMessage({
        message: textToSend,
        history: turnsHistory,
        language: selectedLanguage,
        mode: selectedMode,
        difficulty: selectedDifficulty,
        goal: selectedGoal,
        isVoiceCall: true
      });

      if (!isCallOpenRef.current) {
        isProcessingRef.current = false;
        return;
      }

      if (aiReply?.isError) {
        setApiError(aiReply.text || 'AI encountered an issue. Tap Retry below.');
        callStateRef.current = 'error';
        setCallState('error');
        isProcessingRef.current = false;
        return;
      }

      setApiError(null);

      const aiMessage = {
        id: aiReply.id || `ai-${Date.now()}`,
        sender: 'ai',
        role: 'assistant',
        text: aiReply.text,
        corrections: aiReply.corrections || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setLastAiResponse(aiReply.text);
      setConversationTurns((prev) => [...prev, aiMessage]);
      if (onNewMessage) onNewMessage(aiMessage);

      isProcessingRef.current = false;
      speakAIResponse(aiReply.text);
    } catch (err) {
      console.warn('RealTime conversation error:', err);
      isProcessingRef.current = false;
      if (isCallOpenRef.current) {
        setApiError('Unable to connect to AI Coach. Tap Retry to resend.');
        callStateRef.current = 'error';
        setCallState('error');
      }
    }
  }, [liveTranscript, conversationTurns, onNewMessage, selectedLanguage, selectedMode, selectedDifficulty, selectedGoal, speakAIResponse, stopListening]);

  // Keep ref synchronized
  useEffect(() => {
    handleStudentFinishedSpeakingRef.current = handleStudentFinishedSpeaking;
  }, [handleStudentFinishedSpeaking]);

  // Retry previous turn on error
  const handleRetry = useCallback(() => {
    const textToRetry = lastUserSpeechRef.current || lastUserSpeech;
    if (textToRetry && isValidSpeech(textToRetry)) {
      setApiError(null);
      handleStudentFinishedSpeaking(textToRetry);
    } else {
      setApiError(null);
      callStateRef.current = 'listening';
      setCallState('listening');
      startListening();
    }
  }, [lastUserSpeech, handleStudentFinishedSpeaking, startListening]);

  // Stop speaking / Interrupt AI
  const handleStopSpeaking = useCallback(() => {
    stopCurrentVoiceAudio();

    if (webrtcClientRef.current) {
      webrtcClientRef.current.interrupt();
    }

    callStateRef.current = 'ready';
    setCallState('ready');
    stopVisualizerLoop();

    setTimeout(() => {
      if (isCallOpenRef.current && !isMutedRef.current) {
        startListening();
      }
    }, 200);
  }, [stopVisualizerLoop, startListening]);

  // Toggle Mic (Start/Stop Mic explicitly)
  const handleToggleMic = useCallback(() => {
    if (callStateRef.current === 'listening') {
      stopListening();
      setIsMuted(true);
      isMutedRef.current = true;
      if (webrtcClientRef.current) {
        webrtcClientRef.current.setMuted(true);
      }
      callStateRef.current = 'ready';
      setCallState('ready');
    } else {
      setIsMuted(false);
      isMutedRef.current = false;
      if (webrtcClientRef.current) {
        webrtcClientRef.current.setMuted(false);
      }
      callStateRef.current = 'listening';
      setCallState('listening');
      startListening();
    }
  }, [startListening, stopListening]);

  // Switch voice persona
  const handleVoiceChange = (newVoiceId) => {
    setSelectedVoice(newVoiceId);
    stopCurrentVoiceAudio();
    const voiceObj = REAL_VOICES.find((v) => v.id === newVoiceId);
    if (voiceObj) {
      speakAIResponse(`Voice set to ${voiceObj.name}. Let's continue speaking!`);
    }
  };

  // Spark a new conversational question/topic (Useful in-call prompt)
  const handleSparkTopic = useCallback(async (topicTheme = 'a fascinating thought or opinion') => {
    if (callStateRef.current === 'speaking' || callStateRef.current === 'processing') {
      stopCurrentVoiceAudio();
    }
    stopListening();
    setLiveTranscript('');
    callStateRef.current = 'processing';
    setCallState('processing');

    const promptText = `Ask me a thought-provoking, conversational question about ${topicTheme} so I can practice speaking my thoughts. Remember: do not give me the answer, just ask the question!`;

    try {
      const turnsHistory = conversationTurns.map((t) => ({
        sender: t.sender,
        role: t.sender === 'user' ? 'user' : 'assistant',
        text: t.text
      }));

      const aiReply = await sendChatMessage({
        message: promptText,
        history: turnsHistory,
        language: selectedLanguage,
        mode: selectedMode,
        difficulty: selectedDifficulty,
        goal: selectedGoal,
        isVoiceCall: true
      });

      if (!isCallOpenRef.current) return;

      const aiMessage = {
        id: aiReply.id || `ai-${Date.now()}`,
        sender: 'ai',
        role: 'assistant',
        text: aiReply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setLastAiResponse(aiReply.text);
      setConversationTurns((prev) => [...prev, aiMessage]);
      if (onNewMessage) onNewMessage(aiMessage);

      speakAIResponse(aiReply.text);
    } catch (err) {
      console.warn('Spark topic error:', err);
      if (isCallOpenRef.current) {
        callStateRef.current = 'listening';
        setCallState('listening');
        startListening();
      }
    }
  }, [conversationTurns, onNewMessage, selectedLanguage, selectedMode, selectedDifficulty, selectedGoal, speakAIResponse, startListening, stopListening]);

  // Request microphone permissions cleanly
  const requestMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      micStreamRef.current = stream;
      setMicPermissionError(null);
      return true;
    } catch (err) {
      console.warn('Microphone permission request failed:', err);
      setMicPermissionError('Microphone permission is required for voice conversation.');
      setCallState('muted');
      return false;
    }
  };

  // Start Call Sequence on Mount / Open
  useEffect(() => {
    if (!isOpen) {
      isCallOpenRef.current = false;
      stopListening();
      stopCurrentVoiceAudio();
      return;
    }

    isCallOpenRef.current = true;

    // Start duration timer
    timerRef.current = setInterval(() => {
      if (isCallOpenRef.current) {
        setCallDuration((prev) => prev + 1);
      }
    }, 1000);

    // Speak opening greeting immediately so the student hears the coach right away
    speakAIResponse(initialGreeting);

    return () => {
      isCallOpenRef.current = false;
      stopListening();
      stopCurrentVoiceAudio();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (webrtcClientRef.current) {
        webrtcClientRef.current.disconnect();
        webrtcClientRef.current = null;
      }
      if (audioAnalyserRef.current) {
        audioAnalyserRef.current.cleanup();
        audioAnalyserRef.current = null;
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
    };
  }, [isOpen, initialGreeting, speakAIResponse, stopListening]);

  // Handle End Call clicked
  const handleEndCall = () => {
    isCallOpenRef.current = false;
    stopListening();
    stopCurrentVoiceAudio();
    if (timerRef.current) clearInterval(timerRef.current);

    const userTurns = conversationTurns.filter((t) => t.sender === 'user');
    const wordCount = userTurns.reduce((acc, t) => acc + (t.text ? t.text.split(/\s+/).length : 0), 0);

    setSessionSummary({
      duration: callDuration,
      turns: userTurns.length,
      words: wordCount
    });
    setShowSummaryModal(true);
  };

  const handleCloseEntirely = () => {
    setShowSummaryModal(false);
    onClose();
  };

  const handleRestartCall = () => {
    setShowSummaryModal(false);
    setCallDuration(0);
    setLiveTranscript('');
    setLastUserSpeech('');
    isCallOpenRef.current = true;

    const initialGreeting = MODE_CONVERSATION_STARTERS[selectedMode] || MODE_CONVERSATION_STARTERS.casual;
    setLastAiResponse(initialGreeting);
    setConversationTurns([{
      id: `ai-init-${Date.now()}`,
      sender: 'ai',
      role: 'assistant',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    timerRef.current = setInterval(() => {
      if (isCallOpenRef.current) {
        setCallDuration((prev) => prev + 1);
      }
    }, 1000);

    speakAIResponse(initialGreeting);
  };

  if (!isOpen) return null;

  const currentVoiceObj = REAL_VOICES.find((v) => v.id === selectedVoice) || REAL_VOICES[0];
  const modeLabel = selectedMode ? selectedMode.replace('_', ' ') : 'casual';

  return (
    <div className="realtime-call-overlay">
      <div className="realtime-call-card">
        {/* Minimal Header */}
        <div className="call-top-bar">
          <div className="call-header-left">
            <div className="call-status-pill">
              <span className={`live-call-dot ${callState}`}></span>
              <span className="call-title-text">Voice Partner</span>
            </div>
            <span className="call-mode-pill">{modeLabel}</span>
          </div>

          <div className="call-header-right">
            <span className="call-timer-badge">{formatTime(callDuration)}</span>

            {/* Minimal Voice Coach Selector Popover */}
            <div className="voice-menu-wrapper" ref={voiceMenuRef}>
              <button
                type="button"
                className="minimal-voice-btn"
                onClick={() => setShowVoiceMenu((prev) => !prev)}
                title="Change Voice Persona"
              >
                <Headphones size={13} />
                <span>{currentVoiceObj.name}</span>
                <ChevronDown size={12} className={`chevron-icon ${showVoiceMenu ? 'rotated' : ''}`} />
              </button>

              {showVoiceMenu && (
                <div className="voice-dropdown-menu">
                  <div className="voice-dropdown-header">Voice Persona</div>
                  {REAL_VOICES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`voice-menu-item ${selectedVoice === v.id ? 'active' : ''}`}
                      onClick={() => {
                        handleVoiceChange(v.id);
                        setShowVoiceMenu(false);
                      }}
                    >
                      <span className="voice-item-name">{v.name}</span>
                      <span className="voice-item-style">{v.style}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Central Audio Visualizer Stage (Fluid Sound Sphere) */}
        <div className="call-center-stage">
          <div className={`sound-orb-sphere state-${callState}`} style={{ transform: `scale(${visualizerScale})` }}>
            <div className="orb-halo"></div>
            <div className="orb-core">
              {callState === 'speaking' && <Volume2 size={38} className="orb-svg pulse" />}
              {callState === 'listening' && <Mic size={38} className="orb-svg breathing" />}
              {callState === 'ready' && <Mic size={38} className="orb-svg" />}
              {callState === 'processing' && <Sparkles size={38} className="orb-svg spin" />}
              {callState === 'connecting' && <Sparkles size={38} className="orb-svg spin" />}
              {callState === 'error' && <RotateCcw size={38} className="orb-svg" />}
              {callState === 'muted' && <MicOff size={38} className="orb-svg" />}
            </div>
          </div>

          <div className="call-caption-row">
            <span className={`status-label ${callState}`}>
              {callState === 'connecting' && 'Connecting to voice coach...'}
              {callState === 'ready' && 'Ready • Speak now or tap mic below'}
              {callState === 'listening' && 'Listening to you... Speak freely'}
              {callState === 'speaking' && `${currentVoiceObj.name} is speaking...`}
              {callState === 'processing' && 'Thinking...'}
              {callState === 'error' && 'Encountered an issue • Tap Retry below'}
              {callState === 'muted' && 'Microphone Paused • Tap mic to speak'}
            </span>
          </div>

          {/* API or Mic Alert Banners */}
          {apiError && (
            <div className="call-alert-banner warning">
              <AlertCircle size={15} />
              <span>{apiError}</span>
              <button type="button" className="banner-action-btn retry" onClick={handleRetry}>
                <RotateCcw size={12} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {micPermissionError && (
            <div className="call-alert-banner danger">
              <AlertCircle size={15} />
              <span>{micPermissionError}</span>
              <button type="button" className="banner-action-btn" onClick={requestMicAccess}>
                Grant Access
              </button>
            </div>
          )}
        </div>

        {/* Conversation Stream: Minimal Subtitle or Dialogue Feed */}
        {!isFeedOpen ? (
          <div className="active-subtitle-card">
            {liveTranscript ? (
              <div className="subtitle-turn user">
                <span className="turn-tag you">You (speaking...)</span>
                <p className="subtitle-text live">"{liveTranscript}"</p>
              </div>
            ) : lastAiResponse ? (
              <div className="subtitle-turn coach">
                <span className="turn-tag coach">{currentVoiceObj.name} (Coach)</span>
                <p className="subtitle-text">"{lastAiResponse}"</p>
              </div>
            ) : (
              <p className="subtitle-placeholder">Start speaking whenever you're ready...</p>
            )}
          </div>
        ) : (
          <div className="dialogue-feed-container">
            <div className="dialogue-scroll-area" ref={feedScrollAreaRef}>
              {conversationTurns.map((turn) => (
                <div key={turn.id} className={`dialogue-item ${turn.sender}`}>
                  <span className="dialogue-who">{turn.sender === 'user' ? 'You' : currentVoiceObj.name}</span>
                  <div className="dialogue-bubble">
                    <p className="dialogue-text">{turn.text}</p>
                    {turn.corrections && (
                      <div className="dialogue-correction-chip">
                        <span className="chip-badge">💡 Tip</span>
                        <span>Say "{turn.corrections.improved}" instead of "{turn.corrections.original}"</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Conversation Sparks (Useful In-Call Prompts) */}
        <div className="topic-sparks-row">
          <span className="sparks-label">Spark:</span>
          <button 
            type="button" 
            className="spark-pill-btn"
            onClick={() => handleSparkTopic('a fun dilemma or opinion')}
            title="Ask me a new thought-provoking question"
          >
            <Sparkles size={12} />
            <span>New Topic</span>
          </button>
          <button 
            type="button" 
            className="spark-pill-btn"
            onClick={() => handleSparkTopic('a challenging job interview question')}
            title="Practice an interview question"
          >
            <Briefcase size={12} />
            <span>Interview</span>
          </button>
          <button 
            type="button" 
            className="spark-pill-btn"
            onClick={() => handleSparkTopic('college experiences and career plans')}
            title="Talk about college life"
          >
            <GraduationCap size={12} />
            <span>College</span>
          </button>
          <button 
            type="button" 
            className="spark-pill-btn"
            onClick={() => handleSparkTopic('weekend plans and favorite hobbies')}
            title="Casual conversation topic"
          >
            <Coffee size={12} />
            <span>Casual</span>
          </button>
        </div>

        {/* Floating Minimal Controls Deck */}
        <div className="minimal-controls-deck">
          {/* Start / Stop Mic Button */}
          <button
            type="button"
            className={`deck-btn ${callState === 'listening' ? 'active-listening' : isMuted ? 'active-danger' : ''}`}
            onClick={handleToggleMic}
            title={callState === 'listening' ? "Stop Mic (Pause)" : "Start Mic (Speak)"}
          >
            {callState === 'listening' ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Stop Speaking (Interrupt AI) Button */}
          {callState === 'speaking' && (
            <button
              type="button"
              className="deck-btn stop-speaking-btn"
              onClick={handleStopSpeaking}
              title="Stop Speaking (Interrupt Coach)"
            >
              <VolumeX size={19} />
            </button>
          )}

          {/* Retry Button - Prominent when error occurs */}
          {(callState === 'error' || apiError) && (
            <button
              type="button"
              className="deck-btn retry-btn"
              onClick={handleRetry}
              title="Retry AI Response"
            >
              <RotateCcw size={19} />
            </button>
          )}

          {/* Dialogue Feed Toggle */}
          <button
            type="button"
            className={`deck-btn ${isFeedOpen ? 'active-primary' : ''}`}
            onClick={() => setIsFeedOpen((prev) => !prev)}
            title={isFeedOpen ? "Show Minimal Subtitles" : "Show Conversation Feed"}
          >
            <MessageSquare size={19} />
          </button>

          {/* Replay Coach Response */}
          <button
            type="button"
            className="deck-btn"
            onClick={() => speakAIResponse(lastAiResponse)}
            title="Replay Coach Voice"
            disabled={callState === 'speaking' || callState === 'processing'}
          >
            <RotateCcw size={18} />
          </button>

          {/* Send Now (Visible when speech is detected) */}
          {liveTranscript && isValidSpeech(liveTranscript) && (
            <button
              type="button"
              className="deck-btn send-btn"
              onClick={() => handleStudentFinishedSpeaking(liveTranscript)}
              title="Send Speech Immediately"
            >
              <ArrowRight size={19} />
            </button>
          )}

          {/* End Call Button */}
          <button
            id="end-realtime-call-btn"
            type="button"
            className="deck-btn end-call-pill"
            onClick={handleEndCall}
            title="End Conversation"
          >
            <PhoneOff size={18} />
            <span>End Call</span>
          </button>
        </div>

        {/* Post-Call Mini Summary Modal */}
        {showSummaryModal && (
          <div className="call-summary-overlay">
            <div className="call-summary-card">
              <div className="summary-trophy-badge">✨</div>
              <h3 className="summary-heading">Call Completed</h3>
              <p className="summary-desc">
                Great conversation practice! Consistent daily dialogue is the fastest path to spoken English fluency.
              </p>

              <div className="summary-metrics-row">
                <div className="summary-metric-item">
                  <span className="metric-val">{formatTime(sessionSummary.duration)}</span>
                  <span className="metric-title">Duration</span>
                </div>
                <div className="summary-metric-item">
                  <span className="metric-val">{sessionSummary.turns}</span>
                  <span className="metric-title">Speaking Turns</span>
                </div>
                <div className="summary-metric-item">
                  <span className="metric-val">{sessionSummary.words}</span>
                  <span className="metric-title">Words Spoken</span>
                </div>
              </div>

              {/* Deep AI Analysis Primary CTA */}
              {onOpenAnalysis && (
                <div className="summary-primary-action">
                  <button 
                    type="button" 
                    className="summary-btn analyze" 
                    onClick={() => {
                      setShowSummaryModal(false);
                      onOpenAnalysis(conversationTurns, sessionSummary.duration);
                    }}
                  >
                    <Sparkles size={16} />
                    <span>Deep AI Analysis Report</span>
                  </button>
                </div>
              )}

              <div className="summary-action-row">
                <button type="button" className="summary-btn retry" onClick={handleRestartCall}>
                  <RotateCcw size={15} />
                  <span>Practice Again</span>
                </button>
                <button type="button" className="summary-btn done" onClick={handleCloseEntirely}>
                  <Check size={15} />
                  <span>Review in Chat</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
