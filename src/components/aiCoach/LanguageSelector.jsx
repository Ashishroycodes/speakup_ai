import React from 'react';
import { LANGUAGES } from '../../data/aiCoachData';
import { Globe } from 'lucide-react';
import './LanguageSelector.css';

export default function LanguageSelector({ selectedLanguage, onSelectLanguage }) {
  return (
    <div className="language-selector-wrap">
      <div className="lang-label-box">
        <Globe size={15} />
        <span>Conversation Language:</span>
      </div>

      <div className="lang-buttons-row">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            type="button"
            className={`lang-btn ${selectedLanguage === lang.id ? 'active' : ''}`}
            onClick={() => onSelectLanguage(lang.id)}
            title={`Set conversation language to ${lang.label}`}
          >
            <span className="lang-flag">{lang.flag}</span>
            <span className="lang-name">{lang.label}</span>
            <span className="lang-tag">{lang.tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
