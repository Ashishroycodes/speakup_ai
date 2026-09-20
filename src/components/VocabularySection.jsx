import React, { useState, useMemo } from 'react';
import {
  Search, ArrowLeft, CheckCircle2, Bookmark, Star,
  Flame, Award, Sparkles, HelpCircle, X, ChevronRight,
  TrendingUp, Compass, Filter, BookOpen, AlertTriangle
} from 'lucide-react';
import {
  HUB_CATEGORIES,
  HUB_VOCABULARY,
  getRecommendedWords
} from '../data/vocabularyHubData';
import VocabHubCard from './vocabulary/VocabHubCard';
import VocabLearnModal from './vocabulary/VocabLearnModal';
import VocabQuizModal from './vocabulary/VocabQuizModal';
import VocabDictionaryDeck from './vocabulary/VocabDictionaryDeck';
import './vocabulary/Vocabulary.css';

// Communication Goals configuration
const VOCABULARY_GOALS = [
  { id: 'interview', label: 'Interview Preparation', icon: '🎯', categoryId: 'interview' },
  { id: 'professional', label: 'Professional English', icon: '💼', categoryId: 'professional' },
  { id: 'speaking', label: 'Daily Speaking', icon: '🗣️', categoryId: 'speaking' },
  { id: 'college', label: 'College Communication', icon: '🎓', categoryId: 'college-student' },
  { id: 'presentation', label: 'Presentation', icon: '📊', categoryId: 'advanced' },
  { id: 'workplace', label: 'Workplace Communication', icon: '🏢', categoryId: 'professional' },
  { id: 'general', label: 'General English', icon: '🌐', categoryId: 'basic-communication' }
];

export default function VocabularySection({
  progress = {},
  theme = 'dark',
  learnedVocab = [],
  onToggleLearned,
  onPracticeWord,
  toggleSaveVocab,
  _toggleDifficultVocab,
  toggleMasteredVocab,
  _saveVocabNote,
  _recordVocabSpeaking,
  recordVocabQuizResult,
  _recordSpacedReview,
  recordVocabIncorrect,
  recordVocabCorrect,
  completeVocabChallenge
}) {

  const [selectedGoal, setSelectedGoal] = useState(() => {
    try {
      return localStorage.getItem('speakup_vocab_goal') || 'interview';
    } catch {
      return 'interview';
    }
  });

  const handleSelectGoal = (goalId) => {
    setSelectedGoal(goalId);
    try {
      localStorage.setItem('speakup_vocab_goal', goalId);
    } catch {}
  };

  const [quizSourceWords, setQuizSourceWords] = useState(null);

  // Navigation & View State: 'hub' | 'category'
  const [activeView, setActiveView] = useState('hub');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filters within Category View
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'saved' | 'not-learned' | 'learned' | 'mastered'

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Daily Target Selector State: 5, 10, 15, 20
  const [dailyTarget, setDailyTarget] = useState(() => {
    try {
      return parseInt(localStorage.getItem('speakup_vocab_daily_target') || '5', 10);
    } catch {
      return 5;
    }
  });

  const handleSetDailyTarget = (targetNum) => {
    setDailyTarget(targetNum);
    try {
      localStorage.setItem('speakup_vocab_daily_target', targetNum.toString());
    } catch {}
  };

  // Active Word for Detailed Learning Modal
  const [activeModalWord, setActiveModalWord] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Safe Progress Arrays (Memoized to prevent cascading re-evaluations)
  const rawLearned = progress?.learnedVocab;
  const safeLearned = useMemo(() => rawLearned || learnedVocab || [], [rawLearned, learnedVocab]);
  const rawSaved = progress?.savedVocab;
  const safeSaved = useMemo(() => rawSaved || [], [rawSaved]);
  const rawMastered = progress?.masteredVocab;
  const safeMastered = useMemo(() => rawMastered || [], [rawMastered]);
  const safeWeakIds = useMemo(() => progress?.weakVocab || [], [progress?.weakVocab]);
  const streakCount = progress?.streak || 3;

  // Words that need review
  const weakWordObjects = useMemo(() => {
    return safeWeakIds.map((id) => HUB_VOCABULARY.find((w) => w.id === id || w.word.toLowerCase() === id.toLowerCase())).filter(Boolean);
  }, [safeWeakIds]);

  // "Today's Useful Words" list - Personalized by Goal & Difficulty, prioritizing weak words and skipping mastered
  const todayWords = useMemo(() => {
    const goalObj = VOCABULARY_GOALS.find((g) => g.id === selectedGoal) || VOCABULARY_GOALS[0];
    const catId = goalObj.categoryId;

    let candidates = HUB_VOCABULARY.filter((w) => {
      // Don't repeatedly show words already mastered
      if (safeMastered.includes(w.id)) return false;
      return w.category === catId;
    });

    if (candidates.length < dailyTarget) {
      const rest = HUB_VOCABULARY.filter((w) => !safeMastered.includes(w.id) && !candidates.some((c) => c.id === w.id));
      candidates = [...candidates, ...rest];
    }

    // Prioritize weak words first
    const prioritizedWeak = weakWordObjects.filter((w) => !safeMastered.includes(w.id));
    const combined = [...prioritizedWeak, ...candidates.filter((w) => !safeWeakIds.includes(w.id))];

    return combined.slice(0, dailyTarget);
  }, [selectedGoal, dailyTarget, safeMastered, safeWeakIds, weakWordObjects]);

  const todayCompletedCount = useMemo(() => {
    return todayWords.filter((w) => safeLearned.includes(w.id)).length;
  }, [todayWords, safeLearned]);

  const isTodayTargetCompleted = todayCompletedCount >= todayWords.length && todayWords.length > 0;

  // "Recommended for You" list
  const recommendedWords = useMemo(() => {
    return getRecommendedWords('interview');
  }, []);

  // Global Search Results across ALL 12 categories
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return HUB_VOCABULARY.filter((item) => {
      const matchWord = item.word.toLowerCase().includes(q);
      const matchMeaning = item.meaning.toLowerCase().includes(q);
      const matchHindi = item.hindiMeaning?.toLowerCase().includes(q);
      const matchCat = item.categoryName.toLowerCase().includes(q);
      const matchExample = item.example?.toLowerCase().includes(q);
      return matchWord || matchMeaning || matchHindi || matchCat || matchExample;
    });
  }, [searchQuery]);

  // Words for the Selected Category View
  const categoryWords = useMemo(() => {
    if (!selectedCategory) return [];

    return HUB_VOCABULARY.filter((item) => {
      // Must match category
      if (item.category !== selectedCategory.id) return false;

      // Level filter
      if (selectedLevel !== 'all' && item.level !== selectedLevel) {
        return false;
      }

      // Status filter
      if (selectedStatus === 'saved' && !safeSaved.includes(item.id)) return false;
      if (selectedStatus === 'learned' && !safeLearned.includes(item.id)) return false;
      if (selectedStatus === 'not-learned' && safeLearned.includes(item.id)) return false;
      if (selectedStatus === 'mastered' && !safeMastered.includes(item.id)) return false;

      return true;
    });
  }, [selectedCategory, selectedLevel, selectedStatus, safeSaved, safeLearned, safeMastered]);

  // Open Category Detail View
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedLevel('all');
    setSelectedStatus('all');
    setActiveView('category');
    // Scroll smoothly to top of vocabulary container
    const el = document.getElementById('vocabulary');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Back to Category Hub
  const handleBackToHub = () => {
    setActiveView('hub');
    setSelectedCategory(null);
  };

  // Start Today's Learning flow: find first unlearned today word and open modal
  const handleStartTodayLearning = () => {
    const nextUnlearned = todayWords.find((w) => !safeLearned.includes(w.id));
    if (nextUnlearned) {
      setActiveModalWord(nextUnlearned);
    } else if (todayWords[0]) {
      setActiveModalWord(todayWords[0]);
    }
  };

  return (
    <section className="vocab-section" id="vocabulary">
      <div className="section-container">
        {/* ===================================================================
            1. TOP HEADER & COMPACT PROGRESS INDICATORS
            =================================================================== */}
        <div className="vocab-header-block">
          <div className="vocab-title-wrap">
            <span className="vocab-eyebrow-chip">
              <Sparkles size={13} />
              <span>VOCABULARY HUB</span>
            </span>
            <h2 className="vocab-main-heading">VOCABULARY</h2>
            <p className="vocab-subtitle">
              “Build a stronger vocabulary for real-world communication.”
            </p>
          </div>

          {/* Small Progress Indicators Bar */}
          <div className="vocab-mini-stats-bar">
            <div className="vocab-stat-pill" title="Words marked as learned">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span className="stat-label">Words Learned:</span>
              <span className="stat-val">{safeLearned.length}</span>
            </div>

            <div className="vocab-stat-pill" title="Mastered words">
              <Star size={13} className="text-amber-400" />
              <span className="stat-label">Mastered:</span>
              <span className="stat-val">{safeMastered.length}</span>
            </div>

            <div className="vocab-stat-pill" title="Saved words for review">
              <Bookmark size={13} className="text-indigo-400" />
              <span className="stat-label">Saved:</span>
              <span className="stat-val">{safeSaved.length}</span>
            </div>

            <div className="vocab-stat-pill" title="Daily study streak">
              <Flame size={13} className="text-orange-400" />
              <span className="stat-label">Daily Streak:</span>
              <span className="stat-val">{streakCount} days</span>
            </div>

            <button
              type="button"
              className="vocab-quiz-quick-btn"
              onClick={() => setIsQuizModalOpen(true)}
              title="Test vocabulary in a quick 5-question challenge"
            >
              <Award size={13} />
              <span>Vocab Quiz</span>
            </button>
          </div>

          {/* Deck Switcher: Category Hub vs A-Z Dictionary Deck */}
          <div className="vocab-deck-switcher">
            <button
              type="button"
              className={`vocab-deck-tab ${activeView === 'hub' || activeView === 'category' ? 'is-active' : ''}`}
              onClick={() => {
                setActiveView('hub');
                setSelectedCategory(null);
              }}
              title="Browse by 12 curated communication categories"
            >
              <Compass size={14} />
              <span>Category Hub (12)</span>
            </button>

            <button
              type="button"
              className={`vocab-deck-tab ${activeView === 'dictionary' ? 'is-active' : ''}`}
              onClick={() => {
                setActiveView('dictionary');
              }}
              title="Browse all words alphabetically from A to Z with level tags"
            >
              <BookOpen size={14} />
              <span>A–Z Dictionary Deck</span>
            </button>
          </div>

          {/* Compact Global Search Bar */}
          <div className="vocab-search-container">
            <div className="vocab-search-input-wrapper">
              <Search size={16} className="vocab-search-icon" />
              <input
                type="text"
                className="vocab-search-input"
                placeholder="🔍 Search any word across all 12 categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search vocabulary words"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="vocab-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown / Panel */}
            {searchQuery.trim() && (
              <div className="vocab-search-results-panel">
                <div className="search-results-header">
                  <span>Found {searchResults.length} {searchResults.length === 1 ? 'word' : 'words'} matching “{searchQuery}”</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="search-no-results">
                    <p>No words found matching “{searchQuery}”. Try searching for “Lowkey”, “Affect”, or “Articulate”.</p>
                  </div>
                ) : (
                  <div className="search-results-list">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        className="search-result-row"
                        onClick={() => {
                          setActiveModalWord(item);
                          setSearchQuery('');
                        }}
                      >
                        <div className="search-result-left">
                          <span className="result-word-name">{item.word}</span>
                          <span className="result-meaning">{item.meaning}</span>
                        </div>

                        <div className="search-result-badges">
                          <span className="result-cat-chip">{item.categoryName}</span>
                          <span className={`result-level-chip level-${item.level.toLowerCase()}`}>
                            {item.level}
                          </span>
                          <ChevronRight size={14} className="text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===================================================================
            2. HUB VIEW: TODAY'S WORDS, RECOMMENDATION & CATEGORIES
            =================================================================== */}
        {activeView === 'hub' && (
          <>
            {/* Communication Goal Selector Strip */}
            <div className="vocab-goal-selector-strip">
              <div className="goal-strip-label">
                <Sparkles size={14} className="text-indigo-400" />
                <span>Choose Your Learning Focus:</span>
              </div>
              <div className="goal-chips-scroll">
                {VOCABULARY_GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={`goal-chip-btn ${selectedGoal === g.id ? 'is-active' : ''}`}
                    onClick={() => handleSelectGoal(g.id)}
                  >
                    <span>{g.icon}</span>
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weak Words / Spaced Review Banner */}
            {weakWordObjects.length > 0 && (
              <div className="vocab-weak-words-panel">
                <div className="weak-words-header">
                  <div className="weak-header-title">
                    <AlertTriangle size={16} className="text-amber-400" />
                    <span>Words You Should Review ({weakWordObjects.length})</span>
                  </div>
                  <button
                    type="button"
                    className="weak-review-btn"
                    onClick={() => {
                      setQuizSourceWords(weakWordObjects);
                      setIsQuizModalOpen(true);
                    }}
                  >
                    <span>Review Now</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
                <p className="weak-words-desc">
                  These words were missed during recent practice or quizzes. Review them to build permanent fluency!
                </p>
                <div className="weak-words-pills">
                  {weakWordObjects.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="weak-word-chip"
                      onClick={() => setActiveModalWord(item)}
                      title={`Click to review ${item.word}`}
                    >
                      <span className="weak-chip-name">{item.word}</span>
                      <span className="weak-chip-meaning">{item.meaning}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="vocab-today-card">
          <div className="vocab-today-top-row">
            <div className="today-meta-left">
              <div className="today-badge">
                <Sparkles size={12} />
                <span>Today’s Target</span>
              </div>
              <span className="today-time-estimate">
                {dailyTarget} words • ~{dailyTarget} min
              </span>
              <span className="today-counter">
                ({todayCompletedCount}/{todayWords.length} completed)
              </span>
            </div>

            {/* Compact Daily Target Selector */}
            <div className="today-target-selector">
              <span className="target-selector-label">Goal:</span>
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`target-opt-btn ${dailyTarget === num ? 'is-active' : ''}`}
                  onClick={() => handleSetDailyTarget(num)}
                  title={`Set daily goal to ${num} words/day`}
                >
                  {num}/day
                </button>
              ))}
            </div>
          </div>

          {/* Today's Word Pills & Action Button */}
          <div className="vocab-today-pills-row">
            <div className="today-words-pills-list">
              {todayWords.map((item) => {
                const isLearned = safeLearned.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`today-word-chip ${isLearned ? 'is-done' : ''}`}
                    onClick={() => setActiveModalWord(item)}
                    title={`Click to learn ${item.word}`}
                  >
                    {isLearned ? (
                      <CheckCircle2 size={12} className="text-emerald-400" />
                    ) : (
                      <span className="today-pill-dot" />
                    )}
                    <span className="today-pill-word">{item.word}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className={`today-start-btn ${isTodayTargetCompleted ? 'is-completed' : ''}`}
              onClick={handleStartTodayLearning}
            >
              {isTodayTargetCompleted ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Today’s target completed ✓</span>
                </>
              ) : (
                <>
                  <span>Start Today’s Learning</span>
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ===================================================================
            3. SMART DAILY RECOMMENDATION ("Recommended for You")
            =================================================================== */}
        <div className="vocab-recommended-strip">
          <div className="recommended-caption">
            <TrendingUp size={14} className="text-indigo-400" />
            <span>Recommended for You:</span>
            <span className="recommended-subtitle">Practicing interviews & natural spoken English? Try these today:</span>
          </div>

          <div className="recommended-chips-row">
            {recommendedWords.map((item) => (
              <button
                key={item.id}
                type="button"
                className="recommended-chip"
                onClick={() => setActiveModalWord(item)}
              >
                <span className="rec-word">{item.word}</span>
                <span className="rec-cat-tag">{item.categoryName.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ===================================================================
            4. MAIN VIEW: CATEGORY HUB (12 Compact Cards)
            =================================================================== */}
        <div className="vocab-categories-hub">
              <div className="hub-subheading-row">
                <div className="subheading-left">
                  <Compass size={16} className="text-indigo-400" />
                  <h3 className="hub-section-title">Choose What You Want to Learn</h3>
                </div>
                <span className="hub-counter-label">12 Curated Domains</span>
              </div>

              {/* Responsive Categories Grid (3-4 desktop, 2 tablet, 1-2 mobile) */}
              <div className="categories-compact-grid">
                {HUB_CATEGORIES.map((cat) => {
                  const wordsInCat = HUB_VOCABULARY.filter((w) => w.category === cat.id);
                  const learnedInCat = wordsInCat.filter((w) => safeLearned.includes(w.id)).length;
                  const percent = wordsInCat.length > 0 
                    ? Math.round((learnedInCat / wordsInCat.length) * 100)
                    : 0;

                  return (
                    <div
                      key={cat.id}
                      className="category-compact-card"
                      onClick={() => handleSelectCategory(cat)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleSelectCategory(cat)}
                    >
                      <div className="cat-card-top">
                        <div className="cat-icon-badge">{cat.icon}</div>
                        <span className="cat-tag-badge">{cat.tag}</span>
                      </div>

                      <div className="cat-card-body">
                        <h4 className="cat-card-name">{cat.name}</h4>
                        <p className="cat-card-desc">{cat.description}</p>
                      </div>

                      <div className="cat-card-footer">
                        <span className="cat-words-count">
                          {wordsInCat.length} words
                        </span>
                        <div className="cat-progress-pill" title={`${learnedInCat} of ${wordsInCat.length} words learned`}>
                          <span className="cat-progress-text">{percent}% complete</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ===================================================================
            3. DICTIONARY DECK VIEW (A to Z Organized with Level Badges)
            =================================================================== */}
        {activeView === 'dictionary' && (
          <VocabDictionaryDeck
            onBack={handleBackToHub}
            onOpenLearn={(item) => setActiveModalWord(item)}
            safeLearned={safeLearned}
            safeSaved={safeSaved}
            safeMastered={safeMastered}
            onToggleSaved={toggleSaveVocab}
            theme={theme}
          />
        )}

        {/* ===================================================================
            5. DEDICATED CATEGORY VIEW (With Level & Status Filtering)
            =================================================================== */}
        {activeView === 'category' && selectedCategory && (
          <div className="vocab-category-detail-panel">
            {/* Breadcrumb Navigation & Back Button */}
            <div className="category-detail-nav-row">
              <button
                type="button"
                className="back-to-categories-btn"
                onClick={handleBackToHub}
              >
                <ArrowLeft size={15} />
                <span>Back to Categories</span>
              </button>

              <div className="category-breadcrumbs">
                <span>Vocabulary</span>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-cat">{selectedCategory.name}</span>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-level">{selectedLevel === 'all' ? 'All Levels' : selectedLevel}</span>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-count">{categoryWords.length} words</span>
              </div>
            </div>

            {/* Category Header Banner */}
            <div className="category-detail-header">
              <div className="cat-detail-title-row">
                <span className="cat-detail-big-icon">{selectedCategory.icon}</span>
                <div>
                  <h3 className="cat-detail-title">{selectedCategory.name}</h3>
                  <p className="cat-detail-desc">{selectedCategory.description}</p>
                </div>
              </div>

              {/* Special Slang Advisory in Gen Z Category */}
              {selectedCategory.id === 'gen-z-slang' && (
                <div className="category-special-notice notice-slang">
                  <span className="notice-icon">⚠️</span>
                  <span>
                    <strong>Casual / Informal Slang:</strong> These modern expressions are meant for peer chats, social media, and casual hangouts. Do NOT use them in job interviews, official emails, or academic exams.
                  </span>
                </div>
              )}

              {/* Special Confusing Words Advisory */}
              {selectedCategory.id === 'confusing-words' && (
                <div className="category-special-notice notice-confusing">
                  <span className="notice-icon">⚡</span>
                  <span>
                    <strong>Confusing Word Pairs:</strong> Master words that look or sound similar. Each card includes a memorable memory trick so you never mix them up again.
                  </span>
                </div>
              )}
            </div>

            {/* Filter Bar: Level Filters & Status Filters */}
            <div className="category-filter-toolbar">
              {/* Level Filter Bar */}
              <div className="level-filters-group">
                <span className="filter-label">Level:</span>
                {[
                  { id: 'all', label: 'All Levels' },
                  { id: 'Beginner', label: '🌱 Beginner' },
                  { id: 'Intermediate', label: '🚀 Intermediate' },
                  { id: 'Advanced', label: '⚡ Advanced' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    className={`level-filter-btn ${selectedLevel === lvl.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedLevel(lvl.id)}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>

              {/* Status Filter Chips */}
              <div className="status-filters-group">
                <Filter size={13} className="text-slate-400" />
                {[
                  { id: 'all', label: 'All' },
                  { id: 'not-learned', label: 'Not Learned' },
                  { id: 'learned', label: 'Learned ✓' },
                  { id: 'mastered', label: 'Mastered ⭐' },
                  { id: 'saved', label: 'Saved 🔖' }
                ].map((status) => (
                  <button
                    key={status.id}
                    type="button"
                    className={`status-filter-chip ${selectedStatus === status.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedStatus(status.id)}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compact Word Grid for Selected Category & Level */}
            {categoryWords.length === 0 ? (
              <div className="category-empty-state">
                <HelpCircle size={28} className="text-indigo-400" />
                <h4>No words found matching this filter</h4>
                <p>Try switching levels or resetting status filters to view more words in this category.</p>
                <button
                  type="button"
                  className="reset-filters-btn"
                  onClick={() => {
                    setSelectedLevel('all');
                    setSelectedStatus('all');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="category-words-grid">
                {categoryWords.map((wordItem) => (
                  <VocabHubCard
                    key={wordItem.id}
                    wordItem={wordItem}
                    isLearned={safeLearned.includes(wordItem.id)}
                    isSaved={safeSaved.includes(wordItem.id)}
                    isMastered={safeMastered.includes(wordItem.id)}
                    onOpenLearn={(item) => setActiveModalWord(item)}
                    onToggleSaved={toggleSaveVocab}
                    theme={theme}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================================================================
          6. DETAILED LEARNING MODAL (Progressive Disclosure)
          =================================================================== */}
      <VocabLearnModal
        key={activeModalWord?.id || 'none'}
        wordItem={activeModalWord}
        isOpen={Boolean(activeModalWord)}
        onClose={() => setActiveModalWord(null)}
        isLearned={activeModalWord ? safeLearned.includes(activeModalWord.id) : false}
        isSaved={activeModalWord ? safeSaved.includes(activeModalWord.id) : false}
        isMastered={activeModalWord ? safeMastered.includes(activeModalWord.id) : false}
        onToggleLearned={onToggleLearned}
        onToggleSaved={toggleSaveVocab}
        onToggleMastered={toggleMasteredVocab}
        onPracticeWord={onPracticeWord}
        theme={theme}
      />

      {/* Interactive Vocab Quiz Modal */}
      <VocabQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false);
          setQuizSourceWords(null);
        }}
        sourceWords={quizSourceWords || todayWords}
        onRecordQuizResult={recordVocabQuizResult}
        onRecordCorrect={recordVocabCorrect}
        onRecordIncorrect={recordVocabIncorrect}
        onCompleteChallenge={completeVocabChallenge}
      />
    </section>
  );
}
