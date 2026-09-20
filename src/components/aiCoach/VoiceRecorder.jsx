import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import './VoiceRecorder.css';

export default function VoiceRecorder({ onTranscriptCaptured, disabled, language = 'auto' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);

  const isSpeechSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const getRecognitionLang = (lang) => {
    if (lang === 'hi') return 'hi-IN';
    if (lang === 'en') return 'en-US';
    // Hinglish and auto perform best on en-IN engine
    return 'en-IN';
  };

  const lastEmittedIndexRef = useRef(0);

  const startRecording = () => {
    if (!isSpeechSupported || disabled) return;

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }

      lastEmittedIndexRef.current = 0;

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getRecognitionLang(language);

      recognition.onresult = (event) => {
        let newlyFinal = '';
        let interimStr = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            if (i >= lastEmittedIndexRef.current) {
              newlyFinal += event.results[i][0].transcript + ' ';
              lastEmittedIndexRef.current = i + 1;
            }
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }
        setInterimText(interimStr);
        const trimmedNew = newlyFinal.trim();
        // Accidental noise safeguard (min 2 chars and contains word characters)
        if (trimmedNew && trimmedNew.length >= 2 && /[a-zA-Z0-9\u0900-\u097F]/.test(trimmedNew)) {
          onTranscriptCaptured(trimmedNew);
        }
      };

      recognition.onerror = (err) => {
        if (err.error !== 'no-speech' && err.error !== 'aborted') {
          console.warn('VoiceRecorder speech recognition error:', err.error);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimText('');
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch (e) {
      console.warn('VoiceRecorder start error:', e);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore recognition stop error */
      }
    }
    setIsRecording(false);
    const trimmedInterim = interimText.trim();
    if (trimmedInterim && trimmedInterim.length >= 2 && /[a-zA-Z0-9\u0900-\u097F]/.test(trimmedInterim)) {
      onTranscriptCaptured(trimmedInterim);
    }
    setInterimText('');
    lastEmittedIndexRef.current = 0;
  };

  return (
    <div className="voice-recorder-wrap">
      {!isRecording ? (
        <button
          type="button"
          id="ai-voice-record-btn"
          className="voice-record-btn"
          onClick={startRecording}
          disabled={disabled || !isSpeechSupported}
          title={isSpeechSupported ? "Click to speak with AI" : "Speech recognition not supported in this browser"}
        >
          <Mic size={18} />
          <span>Voice</span>
        </button>
      ) : (
        <button
          type="button"
          id="ai-voice-stop-btn"
          className="voice-record-btn recording"
          onClick={stopRecording}
          title="Stop recording"
        >
          <Square size={16} fill="currentColor" />
          <span>Listening...</span>
          <span className="live-mic-pulse"></span>
        </button>
      )}
    </div>
  );
}
