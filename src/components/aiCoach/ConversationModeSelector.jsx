import React from 'react';
import { CONVERSATION_MODES, DIFFICULTY_LEVELS, CONVERSATION_GOALS } from '../../data/aiCoachData';
import { 
  MessageCircle, GraduationCap, Briefcase, Users, Building2, Presentation, 
  Target 
} from 'lucide-react';
import './ConversationModeSelector.css';

const ICON_MAP = {
  MessageCircle,
  GraduationCap,
  Briefcase,
  Users,
  Building2,
  Presentation
};

export default function ConversationModeSelector({
  selectedMode,
  onSelectMode,
  selectedDifficulty,
  onSelectDifficulty,
  selectedGoal,
  onSelectGoal
}) {
  return (
    <div className="mode-selector-container">
      {/* 6 Modes Row */}
      <div className="modes-row-group">
        <span className="group-label">Conversation Mode:</span>
        <div className="modes-cards-scroll">
          {CONVERSATION_MODES.map((mode) => {
            const Icon = ICON_MAP[mode.icon] || MessageCircle;
            const isSelected = selectedMode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                className={`mode-card-pill ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectMode(mode.id)}
                title={mode.description}
              >
                <div className="mode-pill-icon">
                  <Icon size={16} />
                </div>
                <span className="mode-pill-title">{mode.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty & Goal Secondary Row */}
      <div className="secondary-settings-row">
        {/* Difficulty */}
        <div className="difficulty-setting-wrap">
          <span className="setting-label">Level:</span>
          <div className="difficulty-pills">
            {DIFFICULTY_LEVELS.map((diff) => (
              <button
                key={diff.id}
                type="button"
                className={`diff-pill-btn ${selectedDifficulty === diff.id ? 'active' : ''}`}
                onClick={() => onSelectDifficulty(diff.id)}
                title={diff.desc}
              >
                <span>{diff.dot}</span>
                <span>{diff.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="goal-setting-wrap">
          <span className="setting-label">
            <Target size={14} />
            Goal:
          </span>
          <select
            className="goal-select-dropdown"
            value={selectedGoal}
            onChange={(e) => onSelectGoal(e.target.value)}
          >
            {CONVERSATION_GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
