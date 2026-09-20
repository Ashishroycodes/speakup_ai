import React, { useState } from 'react';
import { Volume2, ArrowRight, Bookmark, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { playRealVoiceAudio, stopCurrentVoiceAudio, THEME_VOICES } from '../../services/voiceService';

export default function VocabHubCard({
  wordItem,
  isLearned = false,
  isSaved = false,
  isMastered = false,
  onOpenLearn,
  onToggleSaved,
  theme = 'dark'
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayPronunciation = (e) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      stopCurrentVoiceAudio();
      setIsPlayingAudio(false);
      return;
    }

    const voice = THEME_VOICES[theme]?.voice || 'nova';
    setIsPlayingAudio(true);
    // If it's a comparison pair like "Affect vs Effect", pronounce the primary words cleanly
    const speechText = wordItem.word.includes(' vs ') 
      ? wordItem.word.replace(' vs ', ' versus ')
      : wordItem.word;

    playRealVoiceAudio(speechText, {
      voice,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (onToggleSaved) {
      onToggleSaved(wordItem.id);
    }
  };

  const levelColorClass = 
    wordItem.level === 'Beginner' ? 'level-beginner' :
    wordItem.level === 'Intermediate' ? 'level-intermediate' : 'level-advanced';

  return (
    <div 
      className={`vocab-hub-card ${isLearned ? 'card-learned' : ''} ${isMastered ? 'card-mastered' : ''}`}
      onClick={() => { if (onOpenLearn) onOpenLearn(wordItem); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' && onOpenLearn) onOpenLearn(wordItem); }}
      aria-label={`Learn word ${wordItem.word}`}
    >
      {/* Card Header with Word Name & Quick Badges */}
      <div className="hub-card-header">
        <div className="hub-card-title-group">
          <h3 className="hub-card-word">{wordItem.word}</h3>
          {wordItem.pronunciation && (
            <span className="hub-card-phonetic">{wordItem.pronunciation}</span>
          )}
        </div>

        <div className="hub-card-status-badges" onClick={(e) => e.stopPropagation()}>
          {isMastered && (
            <span className="hub-mini-status mastered" title="Mastered">
              <Star size={12} className="fill-current" />
            </span>
          )}
          {isLearned && (
            <span className="hub-mini-status learned" title="Learned">
              <CheckCircle2 size={12} />
            </span>
          )}
          <button
            type="button"
            className={`hub-bookmark-btn ${isSaved ? 'is-saved' : ''}`}
            onClick={handleBookmark}
            title={isSaved ? 'Remove from Saved' : 'Save word'}
            aria-label={isSaved ? 'Remove from Saved' : 'Save word'}
          >
            <Bookmark size={13} className={isSaved ? 'fill-current' : ''} />
          </button>
        </div>
      </div>

      {/* Simple Meaning */}
      <p className="hub-card-meaning">
        {wordItem.meaning}
      </p>

      {/* Short Example Sentence */}
      {wordItem.example && (
        <div className="hub-card-example">
          <span className="quote-mark">“</span>
          <span>{wordItem.example}</span>
          <span className="quote-mark">”</span>
        </div>
      )}

      {/* Card Footer with Badges, Listen Audio and Learn CTA */}
      <div className="hub-card-footer">
        <div className="hub-tags-cluster">
          <span className={`hub-level-badge ${levelColorClass}`}>
            {wordItem.level}
          </span>
          {wordItem.isSlang && (
            <span className="hub-slang-badge" title="Casual / Informal slang">
              <AlertCircle size={10} />
              Casual
            </span>
          )}
          {wordItem.partOfSpeech && !wordItem.isSlang && (
            <span className="hub-pos-badge">
              {wordItem.partOfSpeech}
            </span>
          )}
        </div>

        <div className="hub-actions-cluster">
          <button
            type="button"
            className={`hub-listen-btn ${isPlayingAudio ? 'is-playing' : ''}`}
            onClick={handlePlayPronunciation}
            title="Listen pronunciation"
            aria-label={`Listen pronunciation for ${wordItem.word}`}
          >
            <Volume2 size={13} className={isPlayingAudio ? 'animate-pulse' : ''} />
            <span>{isPlayingAudio ? 'Playing' : 'Listen'}</span>
          </button>

          <button
            type="button"
            className="hub-learn-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenLearn) onOpenLearn(wordItem);
            }}
            title="Open detailed learning view"
          >
            <span>Learn</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
