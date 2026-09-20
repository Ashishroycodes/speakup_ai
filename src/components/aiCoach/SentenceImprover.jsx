import React, { useState } from 'react';
import { generateSentenceImprovements } from '../../services/aiService';
import { Wand2, Check, Mic, Copy, X } from 'lucide-react';
import './SentenceImprover.css';

export default function SentenceImprover({
  initialSentence = '',
  onUseSentence,
  onPracticeSpeaking,
  onClose
}) {
  const [inputSentence, setInputSentence] = useState(
    initialSentence || "Mujhe ye project complete karne mein thoda problem aa raha hai."
  );
  const [copiedKey, setCopiedKey] = useState(null);

  const improvements = generateSentenceImprovements(inputSentence);

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="sentence-improver-modal card">
      <div className="improver-header">
        <div className="improver-title-row">
          <div className="improver-icon-wrap">
            <Wand2 size={18} />
          </div>
          <div>
            <h3>Improve My Sentence</h3>
            <p className="improver-subtext">Convert Hinglish or rough thoughts into polished English expressions</p>
          </div>
        </div>

        {onClose && (
          <button type="button" className="improver-close-btn" onClick={onClose} aria-label="Close improver">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Input query field */}
      <div className="improver-input-field">
        <label htmlFor="raw-sentence-input" className="field-label">Original Sentence (Hinglish or English):</label>
        <div className="input-with-button">
          <input
            id="raw-sentence-input"
            type="text"
            className="sentence-text-input"
            value={inputSentence}
            onChange={(e) => setInputSentence(e.target.value)}
            placeholder="Type any sentence (e.g. 'Aaj college mein kaafi busy tha')"
          />
        </div>
      </div>

      {/* 3 Formats Cards */}
      <div className="improvements-cards-grid">
        {/* Simple English */}
        <div className="improvement-card card-simple">
          <div className="card-top-tag">
            <span className="tag-pill tag-simple">Simple English</span>
            <button
              type="button"
              className="copy-btn"
              onClick={() => handleCopy('simple', improvements.simple)}
              title="Copy to clipboard"
            >
              {copiedKey === 'simple' ? <Check size={14} className="copied" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="improved-text">"{improvements.simple}"</p>
          <div className="card-action-links">
            <button
              type="button"
              className="use-sentence-btn"
              onClick={() => onUseSentence(improvements.simple)}
            >
              <span>Use this sentence</span>
            </button>
            <button
              type="button"
              className="practice-speaking-btn"
              onClick={() => onPracticeSpeaking(improvements.simple)}
            >
              <Mic size={13} />
              <span>Practice speaking</span>
            </button>
          </div>
        </div>

        {/* Professional English */}
        <div className="improvement-card card-pro">
          <div className="card-top-tag">
            <span className="tag-pill tag-pro">Professional English</span>
            <button
              type="button"
              className="copy-btn"
              onClick={() => handleCopy('pro', improvements.professional)}
              title="Copy to clipboard"
            >
              {copiedKey === 'pro' ? <Check size={14} className="copied" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="improved-text">"{improvements.professional}"</p>
          <div className="card-action-links">
            <button
              type="button"
              className="use-sentence-btn pro"
              onClick={() => onUseSentence(improvements.professional)}
            >
              <span>Use this sentence</span>
            </button>
            <button
              type="button"
              className="practice-speaking-btn"
              onClick={() => onPracticeSpeaking(improvements.professional)}
            >
              <Mic size={13} />
              <span>Practice speaking</span>
            </button>
          </div>
        </div>

        {/* Natural English */}
        <div className="improvement-card card-natural">
          <div className="card-top-tag">
            <span className="tag-pill tag-natural">Natural English</span>
            <button
              type="button"
              className="copy-btn"
              onClick={() => handleCopy('natural', improvements.natural)}
              title="Copy to clipboard"
            >
              {copiedKey === 'natural' ? <Check size={14} className="copied" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="improved-text">"{improvements.natural}"</p>
          <div className="card-action-links">
            <button
              type="button"
              className="use-sentence-btn natural"
              onClick={() => onUseSentence(improvements.natural)}
            >
              <span>Use this sentence</span>
            </button>
            <button
              type="button"
              className="practice-speaking-btn"
              onClick={() => onPracticeSpeaking(improvements.natural)}
            >
              <Mic size={13} />
              <span>Practice speaking</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
