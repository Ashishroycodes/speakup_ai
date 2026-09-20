import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Wand2 } from 'lucide-react';
import { playRealVoiceAudio, stopCurrentVoiceAudio } from '../../services/voiceService';
import './ChatMessage.css';

export default function ChatMessage({ 
  message, 
  onImproveSentence 
}) {
  const isAI = message.sender === 'ai';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Real human voice playback for AI responses
  const handleSpeak = () => {
    if (isPlayingAudio) {
      stopCurrentVoiceAudio();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    playRealVoiceAudio(message.text, {
      voice: 'nova',
      language: message.detectedLanguage || 'en',
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  return (
    <div className={`chat-message-row ${isAI ? 'ai-row' : 'user-row'}`}>
      <div className="message-avatar-bubble">
        {isAI ? '🤖' : '🎓'}
      </div>

      <div className="message-content-wrapper">
        <div className="message-header-line">
          <span className="sender-name">{isAI ? 'AI Coach' : 'You'}</span>
          <span className="message-time">{message.timestamp || 'Just now'}</span>

          {isAI && (
            <button
              type="button"
              className={`tts-speaker-btn ${isPlayingAudio ? 'active-playing' : ''}`}
              onClick={handleSpeak}
              title={isPlayingAudio ? "Stop speaking" : "Listen to AI voice"}
            >
              {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
            </button>
          )}

          {!isAI && onImproveSentence && (
            <button
              type="button"
              className="improve-sentence-shortcut-btn"
              onClick={() => onImproveSentence(message.text)}
              title="See Simple, Professional & Natural English versions"
            >
              <Wand2 size={13} />
              <span>Improve sentence</span>
            </button>
          )}
        </div>

        {/* Bubble text */}
        <div className={`message-bubble ${isAI ? 'ai-bubble' : 'user-bubble'}`}>
          <p className="bubble-text">{message.text}</p>
        </div>

        {/* Gentle in-line correction tip if present */}
        {message.corrections && (
          <div className="gentle-correction-box">
            <div className="correction-header">
              <Sparkles size={14} />
              <span>Coach Tip:</span>
            </div>
            <div className="correction-diff">
              <span className="better-text">Try: "{message.corrections.improved}"</span>
            </div>
            <p className="correction-explain">{message.corrections.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
