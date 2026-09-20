import React, { useState } from 'react';
import { X, Check, Target, Sparkles } from 'lucide-react';

const AVAILABLE_GOALS = [
  { id: 'Daily English Speaking', label: 'Daily English Speaking', icon: '🗣️', desc: 'Converse fluently in everyday life' },
  { id: 'Interview Preparation', label: 'Interview Preparation', icon: '💼', desc: 'Crack HR & technical interview questions' },
  { id: 'Placement Preparation', label: 'Placement Preparation', icon: '🎓', desc: 'Campus placement GDs & interviews' },
  { id: 'Professional Communication', label: 'Professional Communication', icon: '🏢', desc: 'Executive presence & workplace interactions' },
  { id: 'College Communication', label: 'College Communication', icon: '📚', desc: 'Presentations, professors & peer discussions' },
  { id: 'Vocabulary Improvement', label: 'Vocabulary Improvement', icon: '📖', desc: 'Expand active lexicon and idiomatic phrases' },
  { id: 'Grammar Improvement', label: 'Grammar Improvement', icon: '✍️', desc: 'Tense consistency, articles & prepositions' },
  { id: 'Fluency', label: 'Fluency', icon: '⚡', desc: 'Speak without pauses, hesitation or filler words' },
  { id: 'Confidence', label: 'Confidence', icon: '🔥', desc: 'Overcome fear of speaking in public' },
  { id: 'Presentation Skills', label: 'Presentation Skills', icon: '📊', desc: 'Structure 3-part presentations with impact' },
  { id: 'Group Discussion', label: 'Group Discussion', icon: '👥', desc: 'Enter discussions smoothly and assert viewpoints' },
  { id: 'Workplace Communication', label: 'Workplace Communication', icon: '👔', desc: 'Team standups, meetings, and client calls' },
  { id: 'General English', label: 'General English', icon: '🌐', desc: 'Clear pronunciation and sentence building' }
];

export default function GoalsSelectionModal({
  isOpen,
  onClose,
  selectedGoals = [],
  onSaveGoals
}) {
  const [currentSelected, setCurrentSelected] = useState(selectedGoals);

  if (!isOpen) return null;

  const toggleGoal = (goalId) => {
    setCurrentSelected((prev) => {
      if (prev.includes(goalId)) {
        if (prev.length === 1) return prev; // keep at least 1 goal
        return prev.filter((g) => g !== goalId);
      }
      return [...prev, goalId];
    });
  };

  const handleSave = () => {
    onSaveGoals(currentSelected);
    onClose();
  };

  return (
    <div className="learning-modal-overlay" onClick={onClose}>
      <div
        className="learning-modal-container goals-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="goals-modal-title"
      >
        <div className="learning-modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Target size={20} className="text-primary" />
            </div>
            <div>
              <h3 id="goals-modal-title" className="modal-title">Customize Your Learning Goals</h3>
              <p className="modal-subtitle">Choose one or more goals to align your AI-generated daily practice</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="goals-grid">
          {AVAILABLE_GOALS.map((goal) => {
            const isSelected = currentSelected.includes(goal.id);
            return (
              <button
                key={goal.id}
                type="button"
                className={`goal-select-card ${isSelected ? 'goal-card-selected' : ''}`}
                onClick={() => toggleGoal(goal.id)}
              >
                <div className="goal-card-header">
                  <span className="goal-icon">{goal.icon}</span>
                  <div className={`goal-check-pill ${isSelected ? 'checked' : ''}`}>
                    {isSelected && <Check size={14} />}
                  </div>
                </div>
                <div className="goal-card-content">
                  <div className="goal-label">{goal.label}</div>
                  <div className="goal-desc">{goal.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="learning-modal-footer">
          <div className="selected-count-label">
            <span>{currentSelected.length}</span> goals selected
          </div>
          <div className="modal-footer-actions">
            <button type="button" className="btn-secondary-plan" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn-primary-plan" onClick={handleSave}>
              <Sparkles size={16} /> Save & Adapt Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
