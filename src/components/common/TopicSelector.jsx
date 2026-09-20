import React, { useState } from 'react';
import { TOPICS_DATA } from '../../data/topicsData';
import { Layers, Check } from 'lucide-react';
import './TopicSelector.css';

export default function TopicSelector({ selectedTopic, onSelectTopic, disabled }) {
  const [activeCategory, setActiveCategory] = useState(
    selectedTopic ? (
      TOPICS_DATA.find(cat => cat.topics.some(t => t.title === selectedTopic.title))?.category || 'Beginner'
    ) : 'Beginner'
  );

  const currentCategoryData = TOPICS_DATA.find((c) => c.category === activeCategory) || TOPICS_DATA[0];

  return (
    <div className="topic-selector-component">
      {/* Category Pills Header */}
      <div className="category-tabs-row">
        <span className="selector-label">
          <Layers size={15} />
          Level:
        </span>
        <div className="category-tabs-group">
          {TOPICS_DATA.map((cat) => (
            <button
              key={cat.category}
              type="button"
              className={`category-tab-btn tab-${cat.color} ${activeCategory === cat.category ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.category)}
              disabled={disabled}
            >
              <span>{cat.category}</span>
              <span className="cat-badge">{cat.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid for Active Category */}
      <div className="topics-cards-grid">
        {currentCategoryData.topics.map((topic) => {
          const isSelected = selectedTopic?.id === topic.id || selectedTopic?.title === topic.title;

          return (
            <div
              key={topic.id}
              className={`topic-select-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onSelectTopic(topic)}
              role="button"
              tabIndex={disabled ? -1 : 0}
            >
              <div className="topic-select-header">
                <span className="topic-name">{topic.title}</span>
                {isSelected && (
                  <span className="topic-selected-check">
                    <Check size={14} />
                  </span>
                )}
              </div>
              <p className="topic-short-instruction">{topic.instruction}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
