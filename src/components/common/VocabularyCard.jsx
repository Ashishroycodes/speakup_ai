import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import './VocabularyCard.css';

export default function VocabularyCard({ 
  item, 
  isLearned, 
  onToggleLearned, 
  onPracticeWord 
}) {
  return (
    <div className={`vocab-card-item ${isLearned ? 'is-learned' : ''}`}>
      <div className="vocab-card-top-row">
        <div className="word-title-group">
          <span className="vocab-word-heading">{item.word}</span>
          <span className="vocab-phonetic-badge">{item.phonetic}</span>
        </div>
        <span className="vocab-tag-pill">{item.tag}</span>
      </div>

      <span className="vocab-pos-label">{item.pos}</span>
      <p className="vocab-meaning-text">{item.meaning}</p>

      <div className="vocab-example-container">
        <span className="example-tag-label">Example:</span>
        <p className="example-sentence">"{item.example}"</p>
      </div>

      <div className="vocab-card-actions">
        <button
          type="button"
          className={`vocab-learned-btn ${isLearned ? 'learned-active' : ''}`}
          onClick={() => onToggleLearned(item.id)}
        >
          <Check size={15} />
          <span>{isLearned ? 'Learned' : 'I Know This'}</span>
        </button>

        <button
          type="button"
          className="vocab-practice-btn"
          onClick={() => onPracticeWord(item.word)}
        >
          <span>Practice This Word</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
