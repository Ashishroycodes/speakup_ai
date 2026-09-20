import React, { useState, useEffect, useRef } from 'react';
import LanguageSelector from './LanguageSelector';
import ConversationModeSelector from './ConversationModeSelector';
import ChatWindow from './ChatWindow';
import ConversationInput from './ConversationInput';
import SentenceImprover from './SentenceImprover';
import SessionReport from './SessionReport';
import RealTimeVoiceCall from './RealTimeVoiceCall';
import { CONVERSATION_MODES, INITIAL_CHAT_MESSAGES } from '../../data/aiCoachData';
import { 
  sendChatMessage, 
  generateSessionReport, 
  analyzeCommunicationSession,
  getContextualQuickPrompts,
  getAlternativeQuickPrompts
} from '../../services/aiService';
import { Bot, LogOut, Wand2, RotateCcw, ShieldCheck, Radio, Loader2 } from 'lucide-react';
import './AICoachSection.css';

export default function AICoachSection({ onNavigateToPractice }) {
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [selectedMode, setSelectedMode] = useState('casual');
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate');
  const [selectedGoal, setSelectedGoal] = useState('Improve Fluency');

  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Synchronous session timer and concurrency lock (prevents re-rendering entire section every 1s)
  const sessionStartTimeRef = useRef(0);
  const isSendingRef = useRef(false);

  useEffect(() => {
    sessionStartTimeRef.current = Date.now();
  }, []);

  // Active mode config for suggestions
  const currentModeConfig = CONVERSATION_MODES.find((m) => m.id === selectedMode) || CONVERSATION_MODES[0];
  const [activeQuickPrompts, setActiveQuickPrompts] = useState(
    currentModeConfig?.sampleSuggestions || []
  );

  // Modal / Drawer states
  const [showImprover, setShowImprover] = useState(false);
  const [improverInputSentence, setImproverInputSentence] = useState('');
  const [showSessionReport, setShowSessionReport] = useState(false);
  const [sessionReportData, setSessionReportData] = useState(null);
  const [isLiveVoiceCallOpen, setIsLiveVoiceCallOpen] = useState(false);

  // When mode changes, prompt new mode starter and reset prompt suggestions
  const handleSelectMode = (modeId) => {
    setSelectedMode(modeId);
    const modeConfig = CONVERSATION_MODES.find((m) => m.id === modeId);
    if (modeConfig) {
      setActiveQuickPrompts(modeConfig.sampleSuggestions || []);
      const modeStarterMsg = {
        id: 'mode-' + Date.now(),
        sender: 'ai',
        text: modeConfig.starterPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        corrections: null
      };
      setMessages((prev) => [...prev, modeStarterMsg]);
    }
  };

  // Send message handler with concurrency guard and clean text handling
  const handleSendMessage = async (text) => {
    if (!text || typeof text !== 'string' || !text.trim() || isSendingRef.current) return;
    const cleanText = text.trim();
    isSendingRef.current = true;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const aiReply = await sendChatMessage({
        message: cleanText,
        history: messages,
        language: selectedLanguage,
        mode: selectedMode,
        difficulty: selectedDifficulty,
        goal: selectedGoal
      });

      setMessages((prev) => [...prev, aiReply]);

      // Automatically suggest new quick prompts related to the current conversation context
      if (Array.isArray(aiReply?.suggestedPrompts) && aiReply.suggestedPrompts.length > 0) {
        setActiveQuickPrompts(aiReply.suggestedPrompts);
      } else {
        const contextualSuggestions = getContextualQuickPrompts(
          aiReply?.text || '',
          cleanText,
          selectedMode,
          selectedLanguage
        );
        setActiveQuickPrompts(contextualSuggestions);
      }
    } catch (e) {
      console.warn('Error fetching AI response:', e);
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
    }
  };

  // Trigger Sentence Improver from a message
  const handleOpenImprover = (sentenceText = '') => {
    setImproverInputSentence(sentenceText);
    setShowImprover(true);
  };

  // Pasting an improved sentence into chat
  const handleUseImprovedSentence = (improvedSentence) => {
    handleSendMessage(improvedSentence);
    setShowImprover(false);
  };

  // Direct practice in Speaking Practice section
  const handlePracticeSpeakingSentence = (sentence) => {
    setShowImprover(false);
    if (onNavigateToPractice) {
      onNavigateToPractice(sentence);
    }
  };

  // End Conversation & Generate Deep Real Analysis Report
  const handleEndConversation = async (customMessages = null, customDuration = null) => {
    setIsAnalyzing(true);
    const msgsToAnalyze = customMessages && Array.isArray(customMessages) && customMessages.length > 0
      ? customMessages
      : messages;
    const duration = (customDuration !== null && customDuration !== undefined)
      ? customDuration
      : Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));

    try {
      const report = await analyzeCommunicationSession({
        messages: msgsToAnalyze,
        durationSeconds: duration,
        mode: selectedMode,
        language: selectedLanguage,
        difficulty: selectedDifficulty,
        goal: selectedGoal
      });
      setSessionReportData(report);
      setShowSessionReport(true);
    } catch (err) {
      console.warn('Real AI analysis error, using fallback report:', err);
      const fallbackReport = generateSessionReport(msgsToAnalyze, duration, selectedMode);
      setSessionReportData(fallbackReport);
      setShowSessionReport(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset chat
  const handleResetChat = () => {
    sessionStartTimeRef.current = Date.now();
    setMessages(INITIAL_CHAT_MESSAGES);
    setShowSessionReport(false);
    const modeConfig = CONVERSATION_MODES.find((m) => m.id === selectedMode) || CONVERSATION_MODES[0];
    setActiveQuickPrompts(modeConfig?.sampleSuggestions || []);
  };

  // Refresh quick prompts with alternative suggestions
  const handleRefreshQuickPrompts = () => {
    const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai');
    const aiText = lastAiMsg ? lastAiMsg.text : '';
    const refreshed = getAlternativeQuickPrompts(aiText, selectedMode, selectedLanguage);
    setActiveQuickPrompts(refreshed);
  };

  return (
    <section className="ai-coach-section" id="ai-coach">
      <div className="section-container">
        {/* Header */}
        <div className="section-header ai-coach-header">
          <div className="section-badge section-badge-indigo">
            <Bot size={15} />
            <span>Interactive AI Partner</span>
          </div>
          <h2 className="section-title">AI Communication Coach 🤖</h2>
          <p className="section-subtitle">
            Practice English, Hindi or Hinglish through natural conversations with live real-time voice.
          </p>
        </div>

        {/* Master AI Coach Card */}
        <div className="ai-coach-card card" id="ai-coach-main-card">
          {/* Top Configuration Toolbar */}
          <div className="ai-coach-toolbar">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
            />

            <div className="toolbar-top-actions">
              {/* Real-Time Live Voice Call Toggle */}
              <button
                id="start-realtime-voice-btn"
                type="button"
                className="tool-btn realtime-voice-tool-btn"
                onClick={() => setIsLiveVoiceCallOpen(true)}
                title="Open continuous hands-free real-time voice call"
              >
                <Radio size={15} className="live-call-pulse-icon" />
                <span>🎙️ Real-Time Voice Call</span>
              </button>

              <button
                type="button"
                className="tool-btn improver-tool-btn"
                onClick={() => handleOpenImprover()}
                title="Convert Hinglish to Simple, Professional, or Natural English"
              >
                <Wand2 size={15} />
                <span>Improve My Sentence</span>
              </button>

              <button
                id="end-conversation-btn"
                type="button"
                className="tool-btn end-convo-btn"
                onClick={() => handleEndConversation()}
                disabled={isAnalyzing}
                title="End this conversation and review your feedback report"
              >
                {isAnalyzing ? <Loader2 size={15} className="spin" /> : <LogOut size={15} />}
                <span>{isAnalyzing ? 'Analyzing...' : 'End Conversation'}</span>
              </button>

              <button
                type="button"
                className="tool-btn reset-chat-btn"
                onClick={handleResetChat}
                title="Reset conversation"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Mode & Difficulty Selector */}
          <div className="ai-coach-settings-shelf">
            <ConversationModeSelector
              selectedMode={selectedMode}
              onSelectMode={handleSelectMode}
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
              selectedGoal={selectedGoal}
              onSelectGoal={setSelectedGoal}
            />
          </div>

          {/* Main Chat Interface */}
          <div className="chat-layout-wrapper">
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onImproveSentence={handleOpenImprover}
              onResetChat={handleResetChat}
            />

            <ConversationInput
              onSendMessage={handleSendMessage}
              suggestions={activeQuickPrompts}
              onRefreshSuggestions={handleRefreshQuickPrompts}
              isLoading={isLoading}
              language={selectedLanguage}
            />
          </div>

          {/* Bottom Security & Architecture Disclaimer */}
          <div className="ai-coach-footer-note">
            <ShieldCheck size={14} className="security-icon" />
            <span>
              Real-Time Hands-Free Voice Engine • Bilingual NLP (English + Hindi + Hinglish) • Secure Service Layer
            </span>
          </div>
        </div>

        {/* Real-Time Live Voice Call Modal Component */}
        <RealTimeVoiceCall
          isOpen={isLiveVoiceCallOpen}
          onClose={() => setIsLiveVoiceCallOpen(false)}
          selectedLanguage={selectedLanguage}
          selectedMode={selectedMode}
          selectedDifficulty={selectedDifficulty}
          selectedGoal={selectedGoal}
          onNewMessage={(newMsg) => {
            setMessages((prev) => [...prev, newMsg]);
            if (newMsg?.sender === 'ai') {
              if (Array.isArray(newMsg?.suggestedPrompts) && newMsg.suggestedPrompts.length > 0) {
                setActiveQuickPrompts(newMsg.suggestedPrompts);
              } else {
                setActiveQuickPrompts(
                  getContextualQuickPrompts(newMsg?.text || '', '', selectedMode, selectedLanguage)
                );
              }
            }
          }}
          onOpenAnalysis={(turns, duration) => {
            setIsLiveVoiceCallOpen(false);
            handleEndConversation(turns, duration);
          }}
        />

        {/* Sentence Improver Drawer / Modal */}
        {showImprover && (
          <div className="improver-modal-backdrop" onClick={() => setShowImprover(false)}>
            <div className="improver-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <SentenceImprover
                initialSentence={improverInputSentence}
                onUseSentence={handleUseImprovedSentence}
                onPracticeSpeaking={handlePracticeSpeakingSentence}
                onClose={() => setShowImprover(false)}
              />
            </div>
          </div>
        )}

        {/* End Conversation Session Report Modal */}
        {showSessionReport && (
          <SessionReport
            report={sessionReportData}
            onClose={() => setShowSessionReport(false)}
            onPracticeAgain={() => {
              handleResetChat();
              setShowSessionReport(false);
            }}
            onStartRecommendedPractice={(targetSentence) => {
              setShowSessionReport(false);
              if (onNavigateToPractice) {
                onNavigateToPractice(targetSentence || "Interview Introduction");
              }
            }}
          />
        )}
      </div>
    </section>
  );
}
