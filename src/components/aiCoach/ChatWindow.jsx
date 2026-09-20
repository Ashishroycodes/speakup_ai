import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import './ChatWindow.css';

export default function ChatWindow({
  messages = [],
  isLoading,
  onImproveSentence,
  onResetChat: _onResetChat
}) {
  const viewportRef = useRef(null);
  const isUserScrolledUpRef = useRef(false);

  // Detect if user has manually scrolled up to inspect previous dialogue or tips
  const handleScroll = () => {
    if (!viewportRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    // If distance from bottom is greater than 80px, the user is deliberately reading up
    isUserScrolledUpRef.current = (scrollHeight - scrollTop - clientHeight) > 80;
  };

  const lastMsg = messages[messages.length - 1];

  useEffect(() => {
    if (!viewportRef.current) return;

    // If the user just sent a message, reset scroll lock and scroll down
    if (lastMsg && lastMsg.sender === 'user') {
      isUserScrolledUpRef.current = false;
    }

    if (!isUserScrolledUpRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading, lastMsg]);

  return (
    <div 
      className="chat-window-viewport" 
      ref={viewportRef}
      onScroll={handleScroll}
    >
      {/* Messages Stream */}
      <div className="chat-messages-stream">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onImproveSentence={onImproveSentence}
          />
        ))}

        {/* AI Typing / Thinking bubble */}
        {isLoading && (
          <div className="chat-message-row ai-row typing-row">
            <div className="message-avatar-bubble">🤖</div>
            <div className="message-content-wrapper">
              <div className="message-bubble ai-bubble typing-bubble">
                <span className="typing-dot dot-1"></span>
                <span className="typing-dot dot-2"></span>
                <span className="typing-dot dot-3"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
