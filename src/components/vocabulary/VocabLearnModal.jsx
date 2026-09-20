import React, { useState, useEffect } from 'react';
import {
  X, ArrowLeft, Volume2, Bookmark, CheckCircle2, Star,
  Mic, Sparkles, AlertTriangle,
  ArrowRight, ShieldAlert, BookOpen, MessageSquare,
  Bot, Send, Edit3, Check
} from 'lucide-react';
import { playRealVoiceAudio, stopCurrentVoiceAudio, THEME_VOICES } from '../../services/voiceService';

export default function VocabLearnModal({
  wordItem,
  isOpen,
  onClose,
  isLearned = false,
  isSaved = false,
  isMastered = false,
  onToggleLearned,
  onToggleSaved,
  onToggleMastered,
  onPracticeWord,
  theme = 'dark'
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingExample, setIsPlayingExample] = useState(false);

  // Pronunciation practice state
  const [isPronouncing, setIsPronouncing] = useState(false);
  const [pronounceFeedback, setPronounceFeedback] = useState('');

  // AI Coach state
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachAnswer, setCoachAnswer] = useState('');
  const [coachQueryType, setCoachQueryType] = useState('');
  const [customCoachQuery, setCustomCoachQuery] = useState('');

  // Sentence Builder state
  const [builderSentence, setBuilderSentence] = useState('');
  const [builderLoading, setBuilderLoading] = useState(false);
  const [builderResult, setBuilderResult] = useState(null);

  const isSpeechSupported = typeof window !== 'undefined' && 
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopCurrentVoiceAudio();
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !wordItem) return null;

  // Play Word Pronunciation
  const handlePlayPronunciation = () => {
    if (isPlayingAudio) {
      stopCurrentVoiceAudio();
      setIsPlayingAudio(false);
      return;
    }

    const voice = THEME_VOICES[theme]?.voice || 'nova';
    setIsPlayingAudio(true);
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

  // Play Example Sentence Audio
  const handlePlayExampleAudio = () => {
    if (!wordItem.example) return;
    if (isPlayingExample) {
      stopCurrentVoiceAudio();
      setIsPlayingExample(false);
      return;
    }

    const voice = THEME_VOICES[theme]?.voice || 'nova';
    setIsPlayingExample(true);

    playRealVoiceAudio(wordItem.example, {
      voice,
      onStart: () => setIsPlayingExample(true),
      onEnd: () => setIsPlayingExample(false),
      onError: () => setIsPlayingExample(false)
    });
  };

  // Practice Pronunciation via Speech Recognition
  const handlePronounceCheck = () => {
    if (!isSpeechSupported) {
      setPronounceFeedback('Speech recognition is unavailable in this browser. Try saying the word clearly aloud!');
      return;
    }

    setIsPronouncing(true);
    setPronounceFeedback('Listening... Speak the word now.');

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onresult = (e) => {
        setIsPronouncing(false);
        const spoken = (e.results?.[0]?.[0]?.transcript || '').trim().toLowerCase();
        const target = (wordItem?.word || '').trim().toLowerCase();
        if (spoken.includes(target) || target.includes(spoken)) {
          setPronounceFeedback('✓ Great pronunciation! You said it clearly.');
        } else {
          setPronounceFeedback(`Heard "${spoken}". Try saying the word clearly.`);
        }
      };

      rec.onerror = () => {
        setIsPronouncing(false);
        setPronounceFeedback('Try saying the word clearly.');
      };

      rec.onend = () => {
        setIsPronouncing(false);
      };

      rec.start();
    } catch {
      setIsPronouncing(false);
      setPronounceFeedback('Try saying the word clearly.');
    }
  };

  // Ask AI Vocabulary Coach
  const handleAskCoach = async (queryType, customQuery = '') => {
    setIsCoachOpen(true);
    setCoachLoading(true);
    setCoachQueryType(queryType);
    setCoachAnswer('');

    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ask-coach',
          word: wordItem.word,
          queryType,
          userQuery: customQuery,
          language: 'English'
        })
      });

      const data = await res.json();
      setCoachAnswer(data.answer || 'Practice using this word in your next conversation!');
    } catch {
      setCoachAnswer('AI coach is temporarily unavailable. Try again in a moment.');
    } finally {
      setCoachLoading(false);
    }
  };

  // Sentence Builder AI Evaluation
  const handleEvaluateSentence = async () => {
    if (!builderSentence.trim()) return;
    setBuilderLoading(true);
    setBuilderResult(null);

    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-sentence',
          word: wordItem.word,
          sentence: builderSentence.trim(),
          category: wordItem.categoryName
        })
      });

      const data = await res.json();
      setBuilderResult(data);
    } catch {
      setBuilderResult({
        isValid: true,
        feedback: 'Sentence recorded! Keep practicing.',
        correction: builderSentence,
        explanation: 'Great practice using the word in context.'
      });
    } finally {
      setBuilderLoading(false);
    }
  };

  const handlePracticeInStudio = () => {
    if (onPracticeWord) {
      onPracticeWord(wordItem.word);
      onClose();
    }
  };

  return (
    <div className="vocab-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="vocab-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="vocab-modal-header">
          <div className="modal-title-row">
            <div className="modal-word-title-wrap">
              <button
                type="button"
                className="modal-back-btn"
                onClick={onClose}
                title="Back to vocabulary list"
                aria-label="Back to vocabulary list"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>
              <h2 className="modal-word-title">{wordItem.word}</h2>
              {wordItem.pronunciation && (
                <span className="modal-word-phonetic">{wordItem.pronunciation}</span>
              )}
            </div>

            <div className="modal-header-actions">
              <button
                type="button"
                className={`modal-audio-btn ${isPlayingAudio ? 'is-playing' : ''}`}
                onClick={handlePlayPronunciation}
                title="Listen pronunciation"
                aria-label={`Listen pronunciation for ${wordItem.word}`}
              >
                <Volume2 size={16} className={isPlayingAudio ? 'animate-pulse' : ''} />
                <span>{isPlayingAudio ? 'Playing...' : 'Pronounce'}</span>
              </button>

              <button
                type="button"
                className={`modal-audio-btn ${isPronouncing ? 'is-playing' : ''}`}
                onClick={handlePronounceCheck}
                title="Practice saying the word aloud"
              >
                <Mic size={15} />
                <span>{isPronouncing ? 'Listening...' : 'Practice Voice'}</span>
              </button>

              <button
                type="button"
                className={`modal-bookmark-btn ${isSaved ? 'is-saved' : ''}`}
                onClick={() => onToggleSaved && onToggleSaved(wordItem.id)}
                title={isSaved ? 'Saved in Word Bank' : 'Save to Word Bank'}
                aria-label={isSaved ? 'Saved in Word Bank' : 'Save to Word Bank'}
              >
                <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
              </button>

              <button
                type="button"
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close word learning dialog"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Pronunciation Feedback Pill */}
          {pronounceFeedback && (
            <div className="pronounce-feedback-pill">
              <span>{pronounceFeedback}</span>
            </div>
          )}

          {/* Badges row */}
          <div className="modal-badges-row">
            <span className={`modal-badge level-${wordItem.level.toLowerCase()}`}>
              {wordItem.level}
            </span>
            {wordItem.partOfSpeech && (
              <span className="modal-badge pos-badge">
                {wordItem.partOfSpeech}
              </span>
            )}
            <span className="modal-badge category-badge">
              {wordItem.categoryName}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="vocab-modal-body">
          {/* Slang Guidance Box */}
          {wordItem.isSlang && (
            <div className="modal-slang-guidance">
              <div className="slang-guidance-title">
                <ShieldAlert size={16} className="text-amber-400" />
                <span>Casual / Informal English Notice</span>
              </div>
              <p className="slang-guidance-text">
                {wordItem.usageNote || 'This term is informal slang popular in social and peer conversations. Use with friends and in casual digital chats. Avoid using in job interviews, formal business emails, or academic exams.'}
              </p>
            </div>
          )}

          {/* Confusing Words Guidance Box */}
          {wordItem.isConfusing && (
            <div className="modal-confusing-guidance">
              <div className="confusing-guidance-title">
                <AlertTriangle size={16} className="text-indigo-400" />
                <span>Memory Rule & Usage Comparison</span>
              </div>
              <p className="confusing-guidance-text">
                {wordItem.usageNote}
              </p>
            </div>
          )}

          {/* Meanings Section (English & Hindi) */}
          <div className="modal-definitions-box">
            <div className="definition-entry">
              <span className="definition-label">English Meaning</span>
              <p className="definition-text">{wordItem.meaning}</p>
            </div>

            {wordItem.hindiMeaning && (
              <div className="definition-entry hindi-entry">
                <span className="definition-label">Hindi Meaning (हिन्दी अर्थ)</span>
                <p className="definition-text-hindi">{wordItem.hindiMeaning}</p>
              </div>
            )}
          </div>

          {/* Example Sentence with Audio Button */}
          {wordItem.example && (
            <div className="modal-section-block">
              <div className="modal-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={14} />
                  <span>Example in Context</span>
                </div>
                <button
                  type="button"
                  className="example-listen-btn"
                  onClick={handlePlayExampleAudio}
                  title="Listen to this example sentence"
                >
                  <Volume2 size={13} />
                  <span>{isPlayingExample ? 'Playing...' : 'Listen Example'}</span>
                </button>
              </div>
              <div className="modal-example-quote">
                “{wordItem.example}”
              </div>
            </div>
          )}

          {/* Real-Life Conversation Example */}
          {wordItem.conversationExample && (
            <div className="modal-section-block">
              <div className="modal-section-title">
                <MessageSquare size={14} />
                <span>Real-Life Conversation Dialogue</span>
              </div>
              <div className="modal-conversation-thread">
                <div className="chat-bubble speaker-a">
                  <span className="speaker-tag">Person A</span>
                  <p>{wordItem.conversationExample.speakerA}</p>
                </div>
                <div className="chat-bubble speaker-b">
                  <span className="speaker-tag">Person B</span>
                  <p>{wordItem.conversationExample.speakerB}</p>
                </div>
              </div>
            </div>
          )}

          {/* AI VOCABULARY COACH ("Ask AI") */}
          <div className="modal-coach-container">
            <div className="coach-header-row">
              <div className="coach-title-wrap">
                <Bot size={16} className="coach-bot-icon" />
                <span>Ask AI Vocabulary Coach</span>
              </div>
              <button
                type="button"
                className="coach-toggle-btn"
                onClick={() => setIsCoachOpen(!isCoachOpen)}
              >
                {isCoachOpen ? 'Close Coach' : 'Open Coach'}
              </button>
            </div>

            {isCoachOpen && (
              <div className="coach-content-panel">
                <div className="coach-prompt-chips">
                  <button
                    type="button"
                    className={`coach-chip ${coachQueryType === 'meaning' ? 'active' : ''}`}
                    onClick={() => handleAskCoach('meaning')}
                  >
                    What does this word mean?
                  </button>
                  <button
                    type="button"
                    className={`coach-chip ${coachQueryType === 'easier-example' ? 'active' : ''}`}
                    onClick={() => handleAskCoach('easier-example')}
                  >
                    Give me an easier example
                  </button>
                  <button
                    type="button"
                    className={`coach-chip ${coachQueryType === 'interview-usage' ? 'active' : ''}`}
                    onClick={() => handleAskCoach('interview-usage')}
                  >
                    How to use in an interview?
                  </button>
                  <button
                    type="button"
                    className={`coach-chip ${coachQueryType === 'hindi-explanation' ? 'active' : ''}`}
                    onClick={() => handleAskCoach('hindi-explanation')}
                  >
                    Give me a Hindi explanation (Hinglish)
                  </button>
                  <button
                    type="button"
                    className={`coach-chip ${coachQueryType === 'similar-words' ? 'active' : ''}`}
                    onClick={() => handleAskCoach('similar-words')}
                  >
                    Give me similar words
                  </button>
                </div>

                {/* Custom User Question */}
                <div className="coach-custom-input-row">
                  <input
                    type="text"
                    className="coach-input"
                    placeholder={`Ask anything about "${wordItem.word}"...`}
                    value={customCoachQuery}
                    onChange={(e) => setCustomCoachQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customCoachQuery.trim()) {
                        handleAskCoach('custom', customCoachQuery.trim());
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="coach-send-btn"
                    disabled={coachLoading || !customCoachQuery.trim()}
                    onClick={() => handleAskCoach('custom', customCoachQuery.trim())}
                  >
                    <Send size={14} />
                  </button>
                </div>

                {/* Coach Response Display */}
                {coachLoading && (
                  <div className="coach-loading-bubble">
                    <span className="pulsing-coach-dot"></span>
                    <span>AI Coach thinking...</span>
                  </div>
                )}

                {coachAnswer && !coachLoading && (
                  <div className="coach-answer-bubble">
                    <div className="coach-avatar-tag">🤖 AI Coach:</div>
                    <p>{coachAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SENTENCE BUILDER & AI SENTENCE CORRECTION */}
          <div className="modal-sentence-builder-box">
            <div className="builder-header">
              <Edit3 size={15} className="text-indigo-400" />
              <span>Sentence Builder: Use "{wordItem.word}" in your own sentence</span>
            </div>

            <div className="builder-input-wrap">
              <input
                type="text"
                className="builder-input"
                placeholder={`Type a sentence using "${wordItem.word}"...`}
                value={builderSentence}
                onChange={(e) => setBuilderSentence(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && builderSentence.trim()) {
                    handleEvaluateSentence();
                  }
                }}
              />
              <button
                type="button"
                className="builder-eval-btn"
                disabled={builderLoading || !builderSentence.trim()}
                onClick={handleEvaluateSentence}
              >
                <span>{builderLoading ? 'Evaluating...' : 'Check'}</span>
              </button>
            </div>

            {/* Builder Evaluation Result */}
            {builderResult && (
              <div className={`builder-result-card ${builderResult.isValid ? 'valid' : 'invalid'}`}>
                <div className="builder-feedback-header">
                  {builderResult.isValid ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-400" />
                  )}
                  <span>{builderResult.feedback}</span>
                </div>

                {builderResult.correction && builderResult.correction !== builderSentence && (
                  <div className="builder-better-sentence">
                    <span className="builder-tag">Better / Corrected:</span>
                    <p>"{builderResult.correction}"</p>
                  </div>
                )}

                {builderResult.explanation && (
                  <p className="builder-explanation">💡 {builderResult.explanation}</p>
                )}
              </div>
            )}
          </div>

          {/* Synonyms & Antonyms */}
          {((wordItem.synonyms && wordItem.synonyms.length > 0) || (wordItem.antonyms && wordItem.antonyms.length > 0)) && (
            <div className="modal-vocab-relations">
              {wordItem.synonyms && wordItem.synonyms.length > 0 && (
                <div className="relation-group">
                  <span className="relation-heading">Synonyms</span>
                  <div className="relation-chips">
                    {wordItem.synonyms.map((syn, idx) => (
                      <span key={idx} className="relation-chip synonym-chip">{syn}</span>
                    ))}
                  </div>
                </div>
              )}

              {wordItem.antonyms && wordItem.antonyms.length > 0 && (
                <div className="relation-group">
                  <span className="relation-heading">Antonyms</span>
                  <div className="relation-chips">
                    {wordItem.antonyms.map((ant, idx) => (
                      <span key={idx} className="relation-chip antonym-chip">{ant}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Common Phrases & Collocations */}
          {wordItem.collocations && wordItem.collocations.length > 0 && (
            <div className="modal-section-block">
              <div className="modal-section-title">
                <Sparkles size={14} />
                <span>Common Phrases & Collocations</span>
              </div>
              <div className="collocations-list">
                {wordItem.collocations.map((col, idx) => (
                  <span key={idx} className="collocation-pill">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Speaking Practice Prompt */}
          {wordItem.speakingPrompt && (
            <div className="modal-speaking-prompt-box">
              <div className="prompt-header">
                <Mic size={14} className="text-indigo-400" />
                <span>“Use this word” Speaking Challenge</span>
              </div>
              <p className="prompt-content">{wordItem.speakingPrompt}</p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="vocab-modal-footer">
          <div className="modal-learning-actions">
            <button
              type="button"
              className={`action-btn-status ${isLearned ? 'btn-active-learned' : ''}`}
              onClick={() => onToggleLearned && onToggleLearned(wordItem.id)}
            >
              <CheckCircle2 size={15} />
              <span>{isLearned ? 'Marked as Learned ✓' : 'Mark as Learned (+10 XP)'}</span>
            </button>

            <button
              type="button"
              className={`action-btn-status ${isMastered ? 'btn-active-mastered' : ''}`}
              onClick={() => onToggleMastered && onToggleMastered(wordItem.id)}
            >
              <Star size={15} className={isMastered ? 'fill-current' : ''} />
              <span>{isMastered ? 'Mastered ⭐' : 'Mark Mastered (+20 XP)'}</span>
            </button>
          </div>

          <button
            type="button"
            className="action-practice-btn"
            onClick={handlePracticeInStudio}
          >
            <span>Practice Speaking</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
