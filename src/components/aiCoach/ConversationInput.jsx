import React, { useState, useRef } from 'react';
import { Send, Sparkles, RotateCw } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import './ConversationInput.css';

export default function ConversationInput({
  onSendMessage,
  suggestions = [],
  onRefreshSuggestions,
  isLoading,
  disabled,
  language = 'auto'
}) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!inputText.trim() || isLoading || disabled) return;
    const textToSend = inputText.trim();
    setInputText('');
    onSendMessage(textToSend);
    // Keep focus in the textarea for smooth continuous conversation
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && !disabled) {
        handleSend();
      }
    }
  };

  // Dictation mic inserts transcribed speech into the textarea for review
  const handleVoiceTranscript = (transcriptText) => {
    if (!transcriptText || !transcriptText.trim()) return;
    setInputText((prev) => {
      const clean = transcriptText.trim();
      return prev ? `${prev} ${clean}` : clean;
    });
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  return (
    <div className="conversation-input-container">
      {/* Contextual Quick Prompts */}
      {suggestions.length > 0 && (
        <div className="suggestions-scroll-track">
          <span className="suggestions-label">
            <Sparkles size={13} />
            Quick prompt:
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={`${idx}-${s.slice(0, 15)}`}
              type="button"
              className="suggestion-pill"
              onClick={() => {
                onSendMessage(s);
                textareaRef.current?.focus();
              }}
              disabled={isLoading || disabled}
              title={`Send quick prompt: "${s}"`}
            >
              "{s}"
            </button>
          ))}
          {onRefreshSuggestions && (
            <button
              type="button"
              className="refresh-suggestions-btn"
              onClick={onRefreshSuggestions}
              disabled={isLoading || disabled}
              title="Suggest alternative quick prompts"
            >
              <RotateCw size={12} />
              <span>More</span>
            </button>
          )}
        </div>
      )}

      {/* Input box toolbar */}
      <div className="input-box-wrapper">
        <textarea
          ref={textareaRef}
          id="ai-chat-textarea"
          className="chat-textarea"
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type in English, Hindi or Hinglish... (e.g. 'Aaj college mein kaafi busy tha')"
          disabled={disabled}
        />

        <div className="input-actions-bar">
          <VoiceRecorder 
            onTranscriptCaptured={handleVoiceTranscript}
            disabled={disabled}
            language={language}
          />

          <button
            id="ai-chat-send-btn"
            type="button"
            className="send-message-btn"
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading || disabled}
            title={isLoading ? "AI is replying..." : "Send message"}
          >
            <span>{isLoading ? "Replying..." : "Send"}</span>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
