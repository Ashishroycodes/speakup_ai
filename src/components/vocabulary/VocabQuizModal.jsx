import React, { useState } from 'react';
import { HUB_VOCABULARY } from '../../data/vocabularyHubData';
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react';

/**
 * Generate 6 Dynamic Question Types:
 * 1. Multiple Choice (Definition)
 * 2. Fill in the Blank (Cloze sentence)
 * 3. Meaning Match
 * 4. Choose Correct Usage
 * 5. Hindi -> English
 * 6. English -> Hindi
 */
function buildSmartQuizQuestions(sourceWords = [], count = 5) {
  const pool = sourceWords.length >= count 
    ? sourceWords 
    : [...sourceWords, ...HUB_VOCABULARY].slice(0, 40);

  // Shuffle pool
  const shuffledWords = [...pool].sort(() => 0.5 - Math.random());
  const selectedWords = shuffledWords.slice(0, count);

  const questionTypes = [
    'multiple-choice',
    'fill-in-blank',
    'choose-usage',
    'hindi-to-english',
    'english-to-hindi',
    'meaning-match'
  ];

  return selectedWords.map((item, idx) => {
    const qType = questionTypes[idx % questionTypes.length];
    const otherWords = HUB_VOCABULARY.filter((w) => w.id !== item.id);
    const distractor1 = otherWords[Math.floor(Math.random() * otherWords.length)];
    const distractor2 = otherWords[Math.floor(Math.random() * otherWords.length)];
    const distractor3 = otherWords[Math.floor(Math.random() * otherWords.length)];

    if (qType === 'fill-in-blank' && item.example) {
      // Replace target word in example sentence with ______
      const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
      const clozeSentence = item.example.replace(regex, '______');
      const rawOptions = [item.word, distractor1.word, distractor2.word, distractor3.word];
      const shuffledOptions = [...rawOptions].sort(() => 0.5 - Math.random());
      const correctIdx = shuffledOptions.indexOf(item.word);

      return {
        id: `q-${idx}`,
        wordId: item.id,
        type: 'Fill in the Blank',
        question: `Fill in the blank: "${clozeSentence}"`,
        options: shuffledOptions,
        correctIndex: correctIdx,
        explanation: `"${item.word}" means ${item.meaning.toLowerCase()}`,
        hint: `Part of speech: ${item.partOfSpeech || 'Word'}`
      };
    }

    if (qType === 'hindi-to-english' && item.hindiMeaning) {
      const rawOptions = [item.word, distractor1.word, distractor2.word, distractor3.word];
      const shuffledOptions = [...rawOptions].sort(() => 0.5 - Math.random());
      const correctIdx = shuffledOptions.indexOf(item.word);

      return {
        id: `q-${idx}`,
        wordId: item.id,
        type: 'Hindi → English',
        question: `Which English word corresponds to: "${item.hindiMeaning}"?`,
        options: shuffledOptions,
        correctIndex: correctIdx,
        explanation: `"${item.word}" translates to "${item.hindiMeaning}" (${item.meaning}).`,
        hint: item.partOfSpeech
      };
    }

    if (qType === 'english-to-hindi' && item.hindiMeaning && distractor1.hindiMeaning) {
      const rawOptions = [
        item.hindiMeaning,
        distractor1.hindiMeaning || 'अज्ञात',
        distractor2.hindiMeaning || 'साधारण',
        distractor3.hindiMeaning || 'महत्वपूर्ण'
      ];
      const shuffledOptions = [...rawOptions].sort(() => 0.5 - Math.random());
      const correctIdx = shuffledOptions.indexOf(item.hindiMeaning);

      return {
        id: `q-${idx}`,
        wordId: item.id,
        type: 'English → Hindi',
        question: `What is the Hindi meaning of "${item.word}"?`,
        options: shuffledOptions,
        correctIndex: correctIdx,
        explanation: `"${item.word}" in Hindi is "${item.hindiMeaning}". Meaning: ${item.meaning}`,
        hint: item.meaning
      };
    }

    if (qType === 'choose-usage' && item.example) {
      const wrongSentence1 = `I am very ${item.word} yesterday in the room.`;
      const wrongSentence2 = `He did ${item.word} for no reason without speaking.`;
      const wrongSentence3 = `She made an ${item.word} sandwich for breakfast.`;
      const rawOptions = [item.example, wrongSentence1, wrongSentence2, wrongSentence3];
      const shuffledOptions = [...rawOptions].sort(() => 0.5 - Math.random());
      const correctIdx = shuffledOptions.indexOf(item.example);

      return {
        id: `q-${idx}`,
        wordId: item.id,
        type: 'Choose Correct Usage',
        question: `Which sentence uses "${item.word}" correctly?`,
        options: shuffledOptions,
        correctIndex: correctIdx,
        explanation: `Correct: "${item.example}". It correctly reflects: ${item.meaning}`,
        hint: item.partOfSpeech
      };
    }

    // Default: Multiple Choice Definition / Meaning Match
    const rawOptions = [
      item.meaning,
      distractor1.meaning,
      distractor2.meaning,
      distractor3.meaning
    ];
    const shuffledOptions = [...rawOptions].sort(() => 0.5 - Math.random());
    const correctIdx = shuffledOptions.indexOf(item.meaning);

    return {
      id: `q-${idx}`,
      wordId: item.id,
      type: 'Multiple Choice',
      question: `What does "${item.word}" mean?`,
      options: shuffledOptions,
      correctIndex: correctIdx,
      explanation: `"${item.word}" means: ${item.meaning} Example: "${item.example || ''}"`,
      hint: item.hindiMeaning ? `Hindi: ${item.hindiMeaning}` : item.partOfSpeech
    };
  });
}

export default function VocabQuizModal({
  isOpen,
  onClose,
  sourceWords = [],
  onRecordQuizResult,
  onRecordCorrect,
  onRecordIncorrect,
  onCompleteChallenge
}) {
  const [questions, setQuestions] = useState(() => {
    return buildSmartQuizQuestions(sourceWords, 5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Restart or rebuild questions when reopening or testing new words
  const handleRestart = () => {
    const fresh = buildSmartQuizQuestions(sourceWords, 5);
    setQuestions(fresh);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsQuizFinished(false);
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      if (onRecordCorrect && currentQuestion.wordId) {
        onRecordCorrect(currentQuestion.wordId);
      }
    } else {
      if (onRecordIncorrect && currentQuestion.wordId) {
        onRecordIncorrect(currentQuestion.wordId);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsQuizFinished(true);
      const total = questions.length;
      const finalScore = Math.round(((correctCount + (selectedOption === currentQuestion.correctIndex ? 0 : 0)) / total) * 100);

      if (onRecordQuizResult) {
        onRecordQuizResult({
          total,
          correct: correctCount,
          xpEarned: 15
        });
      }

      if (onCompleteChallenge) {
        onCompleteChallenge({ score: finalScore, xpEarned: 15 });
      }
    }
  };

  const percentageScore = questions.length > 0 
    ? Math.round((correctCount / questions.length) * 100) 
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close quiz">
          ✕
        </button>

        {!isQuizFinished ? (
          <div>
            {/* Header / Progress Bar */}
            <div className="quiz-header-status" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="vocab-pos-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366F1', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span style={{ fontSize: '0.82rem', padding: '3px 8px', borderRadius: '6px', background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                  {currentQuestion.type}
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F59E0B' }}>
                Score: {correctCount}/{currentIndex + (isAnswered ? 1 : 0)} correct
              </span>
            </div>

            {/* Progress track */}
            <div className="daily-goal-track" style={{ marginBottom: '24px', height: '6px', background: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                className="daily-goal-fill"
                style={{ 
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>

            {/* Question Text */}
            <h3 className="quiz-question-title" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.4 }}>
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="quiz-options-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {currentQuestion.options.map((option, idx) => {
                let btnStyle = {
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  background: 'var(--bg-card, #FFFFFF)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center'
                };

                if (isAnswered) {
                  if (idx === currentQuestion.correctIndex) {
                    btnStyle.background = 'rgba(16, 185, 129, 0.12)';
                    btnStyle.borderColor = '#10B981';
                    btnStyle.color = '#10B981';
                    btnStyle.fontWeight = '700';
                  } else if (idx === selectedOption) {
                    btnStyle.background = 'rgba(239, 68, 68, 0.12)';
                    btnStyle.borderColor = '#EF4444';
                    btnStyle.color = '#EF4444';
                  }
                }

                return (
                  <button
                    key={idx}
                    style={btnStyle}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                  >
                    <span style={{ marginRight: '10px', fontWeight: 700, opacity: 0.6 }}>
                      {['A', 'B', 'C', 'D'][idx]}.
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback / Explanation Banner */}
            {isAnswered && (
              <div
                style={{
                  background: selectedOption === currentQuestion.correctIndex ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${selectedOption === currentQuestion.correctIndex ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: '12px',
                  padding: '14px 16px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ fontWeight: 700, color: selectedOption === currentQuestion.correctIndex ? '#10B981' : '#EF4444', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {selectedOption === currentQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>✓ Correct! (+3 XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      <span>❌ Added to "Words You Should Review"</span>
                    </>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={handleNext}
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Challenge'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Challenge Completed Screen (Requirement 19) */
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>
              {correctCount >= 4 ? '🎉' : '👏'}
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
              <CheckCircle2 size={18} />
              <span>Vocabulary Challenge Complete</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {correctCount} / {questions.length} Words Completed
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '20px' }}>
              Accuracy Score: <strong>{percentageScore}%</strong>
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(99, 102, 241, 0.12)',
                color: '#6366F1',
                padding: '8px 22px',
                borderRadius: '9999px',
                fontWeight: 700,
                marginBottom: '28px'
              }}
            >
              <Trophy size={16} />
              <span>+15 XP Reward Added to Streak!</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={handleRestart}
              >
                <RotateCcw size={15} />
                <span>Practice Again</span>
              </button>

              <button
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.92rem' }}
                onClick={onClose}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
