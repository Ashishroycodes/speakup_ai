import React from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';
import './VocabularyModal.css';

export default function VocabularyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sampleVocab = [
    {
      word: "Articulate",
      pos: "verb / adjective",
      phonetic: "/ɑːrˈtɪk.jə.lət/",
      definition: "To express thoughts, feelings, or ideas clearly and effectively in speech.",
      example: "She was able to articulate her project vision with supreme confidence.",
      tag: "Power Verb"
    },
    {
      word: "In a nutshell",
      pos: "idiom / conversational connector",
      phonetic: "/ɪn ə ˈnʌt.ʃel/",
      definition: "Used to introduce a brief, concise summary of what has been said.",
      example: "In a nutshell, consistent daily practice is the true secret to fluency.",
      tag: "Conversational Phrase"
    },
    {
      word: "Nuanced",
      pos: "adjective",
      phonetic: "/ˈnjuː.ɑːnst/",
      definition: "Characterized by subtle distinctions in meaning, opinion, or tone.",
      example: "He gave a nuanced explanation during the group discussion.",
      tag: "Academic Polish"
    }
  ];

  return (
    <div className="vocab-modal-backdrop" onClick={onClose}>
      <div className="vocab-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="vocab-modal-header">
          <div className="vocab-title-wrap">
            <div className="vocab-icon-box">
              <BookOpen size={20} />
            </div>
            <div>
              <h3>Daily Vocabulary Builder</h3>
              <p>Practice using these natural conversational expressions today</p>
            </div>
          </div>
          <button className="vocab-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <div className="vocab-cards-list">
          {sampleVocab.map((item, index) => (
            <div key={index} className="vocab-word-card">
              <div className="word-card-top">
                <span className="word-name">{item.word}</span>
                <span className="word-phonetic">{item.phonetic}</span>
                <span className="word-tag-pill">{item.tag}</span>
              </div>
              <p className="word-definition">{item.definition}</p>
              <div className="word-example-box">
                <span className="example-label">Example:</span>
                <span className="example-text">"{item.example}"</span>
              </div>
            </div>
          ))}
        </div>

        <div className="vocab-modal-footer">
          <div className="vocab-footer-tip">
            <Sparkles size={16} />
            <span>Try integrating one of these words into your next 60s speaking prompt!</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
