import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Search, X, BookOpen, Volume2, ArrowRight,
  Bookmark, CheckCircle2, Filter
} from 'lucide-react';
import { HUB_VOCABULARY } from '../../data/vocabularyHubData';
import { playRealVoiceAudio, stopCurrentVoiceAudio, THEME_VOICES } from '../../services/voiceService';

const ALPHABET = [
  'ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
  'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

export default function VocabDictionaryDeck({
  onBack,
  onOpenLearn,
  safeLearned = [],
  safeSaved = [],
  safeMastered = [],
  onToggleSaved,
  theme = 'dark'
}) {
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'saved' | 'learned' | 'mastered'
  const [searchQuery, setSearchQuery] = useState('');
  const [playingWordId, setPlayingWordId] = useState(null);

  // Audio Playback
  const handlePronounce = (e, item) => {
    e.stopPropagation();
    if (playingWordId === item.id) {
      stopCurrentVoiceAudio();
      setPlayingWordId(null);
      return;
    }

    const voice = THEME_VOICES[theme]?.voice || 'nova';
    setPlayingWordId(item.id);
    const speechText = item.word.includes(' vs ')
      ? item.word.replace(' vs ', ' versus ')
      : item.word;

    playRealVoiceAudio(speechText, {
      voice,
      onStart: () => setPlayingWordId(item.id),
      onEnd: () => setPlayingWordId(null),
      onError: () => setPlayingWordId(null)
    });
  };

  // Letter counts mapping for badge numbers
  const letterCounts = useMemo(() => {
    const map = { ALL: HUB_VOCABULARY.length };
    HUB_VOCABULARY.forEach((w) => {
      const letter = w.word[0].toUpperCase();
      map[letter] = (map[letter] || 0) + 1;
    });
    return map;
  }, []);

  // Filtered vocabulary based on search, letter, level, and status
  const filteredWords = useMemo(() => {
    let list = [...HUB_VOCABULARY];

    // Alphabet letter filter
    if (selectedLetter !== 'ALL') {
      list = list.filter((w) => w.word[0].toUpperCase() === selectedLetter);
    }

    // Level filter
    if (selectedLevel !== 'all') {
      list = list.filter((w) => w.level === selectedLevel);
    }

    // Status filter
    if (selectedStatus === 'saved') {
      list = list.filter((w) => safeSaved.includes(w.id));
    } else if (selectedStatus === 'learned') {
      list = list.filter((w) => safeLearned.includes(w.id));
    } else if (selectedStatus === 'mastered') {
      list = list.filter((w) => safeMastered.includes(w.id));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((w) => {
        const matchWord = w.word.toLowerCase().includes(q);
        const matchMeaning = w.meaning.toLowerCase().includes(q);
        const matchHindi = w.hindiMeaning?.toLowerCase().includes(q);
        return matchWord || matchMeaning || matchHindi;
      });
    }

    // Sort alphabetically strictly from A to Z
    return list.sort((a, b) => a.word.localeCompare(b.word));
  }, [selectedLetter, selectedLevel, selectedStatus, searchQuery, safeSaved, safeLearned, safeMastered]);

  // Group filtered words by first letter when viewing ALL
  const groupedByLetter = useMemo(() => {
    const groups = {};
    filteredWords.forEach((item) => {
      const letter = item.word[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(item);
    });
    return groups;
  }, [filteredWords]);

  return (
    <div className="vocab-dictionary-deck">
      {/* Navigation Top Bar with Back Button & Title */}
      <div className="dict-nav-header">
        <button
          type="button"
          className="dict-back-btn"
          onClick={onBack}
          title="Back to Vocabulary Hub"
        >
          <ArrowLeft size={16} />
          <span>Back to Hub</span>
        </button>

        <div className="dict-title-wrap">
          <div className="dict-badge">
            <BookOpen size={13} />
            <span>A–Z Dictionary Deck</span>
          </div>
          <h3 className="dict-main-title">English Vocabulary Dictionary</h3>
          <p className="dict-subtitle">
            Organized alphabetically from A to Z with level tags from Beginner to Advanced.
          </p>
        </div>

        {/* Quick Dictionary Search */}
        <div className="dict-search-wrapper">
          <Search size={14} className="dict-search-icon" />
          <input
            type="text"
            className="dict-search-input"
            placeholder="Search words in dictionary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search words in dictionary"
          />
          {searchQuery && (
            <button
              type="button"
              className="dict-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear dictionary search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Alphabet Bar (A–Z) */}
      <div className="dict-alphabet-bar-container">
        <span className="alphabet-bar-label">Letters:</span>
        <div className="dict-alphabet-bar">
          {ALPHABET.map((letter) => {
            const count = letterCounts[letter] || 0;
            const isAvailable = letter === 'ALL' || count > 0;
            const isActive = selectedLetter === letter;

            return (
              <button
                key={letter}
                type="button"
                className={`alphabet-btn ${isActive ? 'is-active' : ''} ${!isAvailable ? 'is-disabled' : ''}`}
                onClick={() => isAvailable && setSelectedLetter(letter)}
                disabled={!isAvailable}
                title={letter === 'ALL' ? `All words (${letterCounts.ALL})` : `${count} words starting with ${letter}`}
              >
                <span>{letter}</span>
                {letter !== 'ALL' && count > 0 && (
                  <span className="alphabet-count">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level and Status Filter Toolbar */}
      <div className="dict-filter-toolbar">
        {/* Word Level Filter */}
        <div className="dict-level-filters">
          <span className="dict-filter-heading">Word Level:</span>
          {[
            { id: 'all', label: 'All Levels' },
            { id: 'Beginner', label: '🌱 Beginner' },
            { id: 'Intermediate', label: '🚀 Intermediate' },
            { id: 'Advanced', label: '⚡ Advanced' }
          ].map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              className={`dict-level-pill ${selectedLevel === lvl.id ? 'is-active' : ''}`}
              onClick={() => setSelectedLevel(lvl.id)}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="dict-status-filters">
          <Filter size={13} className="text-slate-400" />
          {[
            { id: 'all', label: 'All' },
            { id: 'learned', label: 'Learned ✓' },
            { id: 'saved', label: 'Saved 🔖' },
            { id: 'mastered', label: 'Mastered ⭐' }
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              className={`dict-status-pill ${selectedStatus === st.id ? 'is-active' : ''}`}
              onClick={() => setSelectedStatus(st.id)}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Results Counter & Reset Action */}
        <div className="dict-counter-badge">
          <span>{filteredWords.length} {filteredWords.length === 1 ? 'word' : 'words'} found</span>
          {(selectedLetter !== 'ALL' || selectedLevel !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              type="button"
              className="dict-reset-filters-btn"
              onClick={() => {
                setSelectedLetter('ALL');
                setSelectedLevel('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Dictionary Word List Display */}
      {filteredWords.length === 0 ? (
        <div className="dict-empty-view">
          <BookOpen size={32} className="text-indigo-400" />
          <h4>No dictionary entries found</h4>
          <p>There are no words matching letter “{selectedLetter}” with level “{selectedLevel}”.</p>
          <button
            type="button"
            className="dict-reset-filters-btn"
            onClick={() => {
              setSelectedLetter('ALL');
              setSelectedLevel('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
          >
            Show All Words
          </button>
        </div>
      ) : selectedLetter === 'ALL' && !searchQuery.trim() ? (
        /* Grouped A to Z Sections */
        <div className="dict-grouped-sections">
          {Object.keys(groupedByLetter).sort().map((letter) => (
            <div key={letter} className="dict-letter-group" id={`letter-${letter}`}>
              <div className="letter-section-header">
                <div className="letter-anchor-badge">{letter}</div>
                <span className="letter-section-count">
                  {groupedByLetter[letter].length} {groupedByLetter[letter].length === 1 ? 'word' : 'words'}
                </span>
                <div className="letter-divider-line" />
              </div>

              <div className="dict-words-grid">
                {groupedByLetter[letter].map((item) => (
                  <DictionaryWordCard
                    key={item.id}
                    item={item}
                    isLearned={safeLearned.includes(item.id)}
                    isSaved={safeSaved.includes(item.id)}
                    isMastered={safeMastered.includes(item.id)}
                    isPlaying={playingWordId === item.id}
                    onPronounce={(e) => handlePronounce(e, item)}
                    onOpenLearn={() => onOpenLearn && onOpenLearn(item)}
                    onToggleSaved={() => onToggleSaved && onToggleSaved(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Single Letter or Search Results Flat Grid */
        <div className="dict-words-grid">
          {filteredWords.map((item) => (
            <DictionaryWordCard
              key={item.id}
              item={item}
              isLearned={safeLearned.includes(item.id)}
              isSaved={safeSaved.includes(item.id)}
              isMastered={safeMastered.includes(item.id)}
              isPlaying={playingWordId === item.id}
              onPronounce={(e) => handlePronounce(e, item)}
              onOpenLearn={() => onOpenLearn && onOpenLearn(item)}
              onToggleSaved={() => onToggleSaved && onToggleSaved(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Subcomponent: Compact Dictionary Word Card with prominent Level Badge
function DictionaryWordCard({
  item,
  isLearned,
  isSaved,
  isMastered,
  isPlaying,
  onPronounce,
  onOpenLearn,
  onToggleSaved
}) {
  const levelClass =
    item.level === 'Beginner' ? 'level-beginner' :
    item.level === 'Intermediate' ? 'level-intermediate' : 'level-advanced';

  return (
    <div
      className={`dict-word-card ${isLearned ? 'card-learned' : ''} ${isMastered ? 'card-mastered' : ''}`}
      onClick={onOpenLearn}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpenLearn(); }}
    >
      {/* Card Top: Word, Phonetic, Level Badge, and Status */}
      <div className="dict-card-top-row">
        <div className="dict-word-info">
          <h4 className="dict-card-word">{item.word}</h4>
          {item.pronunciation && (
            <span className="dict-card-phonetic">{item.pronunciation}</span>
          )}
        </div>

        <div className="dict-card-badges-right">
          {/* Prominent Level of Word */}
          <span className={`dict-prominent-level ${levelClass}`} title={`Level: ${item.level}`}>
            {item.level}
          </span>

          <button
            type="button"
            className={`dict-bookmark-btn ${isSaved ? 'is-saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSaved();
            }}
            title={isSaved ? 'Saved in Word Bank' : 'Save word'}
          >
            <Bookmark size={13} className={isSaved ? 'fill-current' : ''} />
          </button>
        </div>
      </div>

      {/* Definition & Hindi Translation Preview */}
      <p className="dict-card-meaning">
        {item.meaning}
      </p>

      {item.hindiMeaning && (
        <div className="dict-hindi-preview">
          <span className="hindi-tag">हिन्दी:</span>
          <span className="hindi-text">{item.hindiMeaning}</span>
        </div>
      )}

      {/* Card Footer: Category Tag, Audio Listen, and Learn CTA */}
      <div className="dict-card-footer-row">
        <div className="dict-footer-tags">
          <span className="dict-cat-tag">
            {item.categoryName.split(' ')[0]}
          </span>
          {item.partOfSpeech && (
            <span className="dict-pos-tag">
              {item.partOfSpeech}
            </span>
          )}
          {isLearned && (
            <span className="dict-learned-tag" title="Learned">
              <CheckCircle2 size={11} />
              Learned
            </span>
          )}
        </div>

        <div className="dict-footer-actions">
          <button
            type="button"
            className={`dict-listen-btn ${isPlaying ? 'is-playing' : ''}`}
            onClick={onPronounce}
            title="Listen pronunciation"
          >
            <Volume2 size={13} className={isPlaying ? 'animate-pulse' : ''} />
            <span>{isPlaying ? 'Playing' : 'Listen'}</span>
          </button>

          <button
            type="button"
            className="dict-learn-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLearn();
            }}
            title="Open full learning view"
          >
            <span>Learn</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
