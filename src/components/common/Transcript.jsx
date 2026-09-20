import React from 'react';
import { Volume2, Trash2, RotateCcw, Sparkles } from 'lucide-react';
import './Transcript.css';

export default function Transcript({ 
  transcript, 
  onTranscriptChange, 
  onClear, 
  onTryAgain, 
  isSpeaking, 
  isSpeechSupported 
}) {
  return (
    <div className="transcript-component">
      <div className="transcript-top-bar">
        <div className="transcript-header-label">
          <Volume2 size={18} className="transcript-icon" />
          <h4>Your Transcript</h4>
          {isSpeaking && (
            <span className="live-pill">
              <span className="live-indicator-dot"></span>
              Live Listening
            </span>
          )}
        </div>

        <div className="transcript-quick-actions">
          {transcript && (
            <button
              type="button"
              className="action-link-btn"
              onClick={onClear}
              title="Clear current transcript"
            >
              <Trash2 size={14} />
              <span>Clear transcript</span>
            </button>
          )}

          <button
            type="button"
            className="action-link-btn try-again-link"
            onClick={onTryAgain}
            title="Reset and try again"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      </div>

      <div className="transcript-display-card">
        <textarea
          id="practice-transcript-textarea"
          className="transcript-textarea-input"
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder={
            isSpeechSupported 
              ? 'Start speaking, and your words will appear here in real-time... (Or click here to type or edit manually)' 
              : 'Speech recognition is not available on this browser. You can type or edit your transcript directly here.'
          }
          rows={4}
        />
      </div>

      <div className="transcript-bottom-note">
        <Sparkles size={14} className="note-sparkle" />
        <span>
          {isSpeechSupported 
            ? 'Tip: Speak in clear complete sentences. The AI feedback engine evaluates vocabulary variety and rhythm.' 
            : 'Browser Web Speech API not detected. Feel free to type your spoken answer.'}
        </span>
      </div>
    </div>
  );
}
