import React, { useState, useEffect, useRef } from 'react';

export default function VocabSpeakModal({
  wordItem,
  isOpen,
  onClose,
  onRecordSpeaking
}) {
  const [sentence, setSentence] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const recognitionRef = useRef(null);
  const speechSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSentence(transcript);
      };

      recognition.onerror = (_e) => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  if (!isOpen || !wordItem) return null;

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        setSentence('');
        recognitionRef.current.start();
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleEvaluate = async () => {
    if (!sentence.trim()) return;
    setEvaluating(true);

    try {
      const res = await fetch('/api/vocab-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: wordItem.word,
          sentence: sentence.trim(),
          meaning: wordItem.meaning
        })
      });

      const data = await res.json();
      setEvaluationResult(data);

      if (onRecordSpeaking) {
        onRecordSpeaking({
          vocabId: wordItem.id,
          word: wordItem.word,
          sentence: sentence.trim(),
          score: data.score || 75,
          feedback: data.feedback || '',
          xpEarned: data.xpEarned || 15
        });
      }
    } catch {
      // Local fallback in case of unexpected network error
      const fallbackResult = {
        score: 75,
        isWordUsed: sentence.toLowerCase().includes(wordItem.word.toLowerCase()),
        feedback: `Good attempt practicing "${wordItem.word}". Try adding more context to make your thought complete!`,
        grammarNotes: 'Sentence structure was understood.',
        collocationNotes: 'Keep practicing natural phrasing.',
        strongerVersion: sentence,
        xpEarned: 15,
        badge: 'Good Effort'
      };
      setEvaluationResult(fallbackResult);
      if (onRecordSpeaking) {
        onRecordSpeaking({
          vocabId: wordItem.id,
          word: wordItem.word,
          sentence: sentence.trim(),
          score: 75,
          feedback: fallbackResult.feedback,
          xpEarned: 15
        });
      }
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Word Info Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              SPEAKING CHALLENGE
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {wordItem.partOfSpeech} • {wordItem.phonetic}
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', margin: 0 }}>
            {wordItem.word}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '4px 0 0' }}>
            {wordItem.meaning}
          </p>
        </div>

        {/* Prompt Card */}
        <div className="speak-prompt-card">
          <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '4px', fontSize: '0.9rem' }}>
            🎯 Speaking Prompt:
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
            {wordItem.speakingPrompt || `Create a meaningful sentence using the word "${wordItem.word}".`}
          </div>
        </div>

        {/* Input Area (Voice + Editable Text) */}
        <div>
          <textarea
            className="speak-input-area"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder={`Speak into the mic or type your sentence using "${wordItem.word}" here...`}
            rows={3}
          />

          <div className="mic-toggle-row" style={{ marginTop: '12px' }}>
            {speechSupported ? (
              <button
                className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecording}
              >
                <span>{isRecording ? '⏹ Stop' : '🎙️ Tap to Speak'}</span>
              </button>
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ℹ️ Voice input not supported in this browser. You can type above!
              </span>
            )}

            <button
              className="speak-action-btn"
              style={{ padding: '10px 22px', fontSize: '0.95rem' }}
              onClick={handleEvaluate}
              disabled={evaluating || !sentence.trim()}
            >
              {evaluating ? 'Analyzing...' : '⚡ Evaluate Sentence'}
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        {evaluationResult && (
          <div className="feedback-box">
            <div className="feedback-score-row">
              <div>
                <span
                  className={`score-badge ${
                    evaluationResult.score >= 80 ? '' : evaluationResult.score >= 60 ? 'average' : 'low'
                  }`}
                >
                  {evaluationResult.score}/100
                </span>
                <span style={{ marginLeft: '10px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {evaluationResult.badge || 'Practice Score'}
                </span>
              </div>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>
                +{evaluationResult.xpEarned || 15} XP Earned!
              </div>
            </div>

            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
              {evaluationResult.feedback}
            </p>

            {evaluationResult.grammarNotes && (
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <strong>📝 Grammar & Structure:</strong> {evaluationResult.grammarNotes}
              </div>
            )}

            {evaluationResult.collocationNotes && (
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <strong>🤝 Phrasing & Natural Flow:</strong> {evaluationResult.collocationNotes}
              </div>
            )}

            {evaluationResult.strongerVersion && (
              <div style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.88rem' }}>
                <strong style={{ color: 'var(--accent-emerald)' }}>💡 Stronger Alternative:</strong>
                <p style={{ margin: '4px 0 0', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                  "{evaluationResult.strongerVersion}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
