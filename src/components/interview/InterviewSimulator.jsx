import React, { useState, useRef } from 'react';
import { Sparkles, History, Award, RotateCcw, ArrowRight, Loader2 } from 'lucide-react';
import InterviewSetup from './InterviewSetup';
import InterviewRoom from './InterviewRoom';
import InterviewReport from './InterviewReport';
import InterviewHistoryModal from './InterviewHistoryModal';
import { requestNextInterviewQuestion, requestInterviewAnalysis } from '../../services/aiService';
import './InterviewSimulator.css';

export default function InterviewSimulator({
  onNavigateSection,
  onRecordSession,
  interviewHistory = [],
  onClearHistory
}) {
  // Simulator View States: 'setup' | 'room' | 'completed' | 'report'
  const [viewState, setViewState] = useState('setup');
  
  // Configuration
  const [config, setConfig] = useState({
    interviewType: 'HR Interview',
    targetRole: 'Software Developer',
    experienceLevel: 'Beginner',
    difficulty: 'Medium',
    language: 'English',
    questionCount: 5,
    interviewMode: 'Voice + Text',
    timerLimit: 60
  });

  // Current session data
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const [qaList, setQaList] = useState([]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Session duration tracking
  const sessionStartTimeRef = useRef(0);

  // 1. Start Interview
  const handleStartInterview = async (setupConfig) => {
    setConfig(setupConfig);
    setQaList([]);
    setCurrentQuestionNumber(1);
    setApiError(null);
    setActiveReport(null);
    sessionStartTimeRef.current = Date.now();

    // Instantly activate interview room with Question 1
    const initialQuestion = {
      questionNumber: 1,
      totalQuestions: setupConfig.questionCount,
      acknowledgment: '',
      question: `Hello! Welcome to your mock interview for ${setupConfig.targetRole}. Tell me about yourself, your background, and what inspires you to pursue this role.`,
      isFollowUp: false,
      tips: 'Focus on your education, core technical skills, projects, and why you chose this career path.'
    };

    setCurrentQuestionData(initialQuestion);
    setViewState('room');
    setIsLoadingQuestion(false);
  };

  // 2. Candidate Submits Answer -> Proceed to Next or Finish
  const handleSubmitAnswer = async (answerObj) => {
    const updatedQaList = [...qaList, answerObj];
    setQaList(updatedQaList);

    const nextQNum = currentQuestionNumber + 1;

    // Check if interview completed
    if (nextQNum > config.questionCount) {
      setViewState('completed');
      return;
    }

    // Otherwise, fetch next question
    setCurrentQuestionNumber(nextQNum);
    setIsLoadingQuestion(true);
    setApiError(null);

    // Build recent conversation history for LLM
    const historyPayload = updatedQaList.map((item) => ({
      question: item.question,
      answer: item.answer
    }));

    try {
      const nextQData = await requestNextInterviewQuestion({
        interviewType: config.interviewType,
        targetRole: config.targetRole,
        experienceLevel: config.experienceLevel,
        difficulty: config.difficulty,
        language: config.language,
        questionNumber: nextQNum,
        totalQuestions: config.questionCount,
        conversationHistory: historyPayload,
        userAnswer: answerObj.answer
      });

      setCurrentQuestionData(nextQData);
    } catch (err) {
      console.warn('Error fetching next question:', err);
      setApiError('Unable to generate AI follow-up. Using standard progression.');
      setCurrentQuestionData({
        questionNumber: nextQNum,
        totalQuestions: config.questionCount,
        acknowledgment: 'Thank you for sharing that answer.',
        question: `What is one significant technical challenge you encountered while working on a ${config.targetRole} project?`,
        isFollowUp: false,
        tips: 'Describe the problem, the options you considered, and your resolution.'
      });
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // 3. Retry question on failure
  const handleRetryQuestion = async () => {
    setIsLoadingQuestion(true);
    setApiError(null);
    try {
      const qData = await requestNextInterviewQuestion({
        interviewType: config.interviewType,
        targetRole: config.targetRole,
        experienceLevel: config.experienceLevel,
        difficulty: config.difficulty,
        language: config.language,
        questionNumber: currentQuestionNumber,
        totalQuestions: config.questionCount,
        conversationHistory: qaList.map(item => ({ question: item.question, answer: item.answer })),
        userAnswer: qaList[qaList.length - 1]?.answer || ''
      });
      setCurrentQuestionData(qData);
    } catch {
      setApiError('Retry failed. Please continue with text or end interview.');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // 4. End Interview Early
  const handleEndEarly = () => {
    if (qaList.length === 0) {
      setViewState('setup');
      return;
    }
    const confirmEnd = window.confirm('Are you sure you want to end the interview early? We will generate your report based on your answered questions.');
    if (confirmEnd) {
      setViewState('completed');
    }
  };

  // 5. Generate Full Evaluation Report
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    const durationSeconds = Math.max(30, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));

    try {
      const analysisReport = await requestInterviewAnalysis({
        interviewType: config.interviewType,
        targetRole: config.targetRole,
        experienceLevel: config.experienceLevel,
        difficulty: config.difficulty,
        language: config.language,
        durationSeconds,
        qaList
      });

      if (analysisReport) {
        setActiveReport(analysisReport);

        // Record in persistent progress (+50 XP)
        if (onRecordSession) {
          onRecordSession({
            interviewType: config.interviewType,
            targetRole: config.targetRole,
            experienceLevel: config.experienceLevel,
            difficulty: config.difficulty,
            overallScore: analysisReport.overallScore,
            scores: analysisReport.scores,
            completedQuestions: qaList.length,
            totalQuestions: config.questionCount,
            durationSeconds,
            report: analysisReport,
            qaList
          });
        }
      }
      setViewState('report');
    } catch (err) {
      console.warn('Failed to generate report:', err);
      alert('Could not complete AI report generation. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // 6. View Past Historical Report
  const handleSelectHistorySession = (session) => {
    if (session.report) {
      setConfig({
        interviewType: session.interviewType,
        targetRole: session.targetRole,
        experienceLevel: session.experienceLevel,
        difficulty: session.difficulty,
        language: 'English',
        questionCount: session.totalQuestions,
        interviewMode: 'Voice + Text',
        timerLimit: 60
      });
      setActiveReport(session.report);
      setViewState('report');
    }
  };

  return (
    <section className="interview-simulator-section" id="ai-interview">
      <div className="interview-container">
        {/* Section Header */}
        <div className="interview-header">
          <div className="interview-badge">
            <Sparkles size={15} />
            <span>AI Interview Simulator</span>
          </div>

          <h2 className="interview-title">
            AI <span>Interview Simulator</span>
          </h2>

          <p className="interview-subtitle">
            Practice real interview questions with an AI interviewer and improve your confidence, communication and answers.
          </p>

          {viewState === 'setup' && (
            <div className="interview-header-actions">
              {interviewHistory.length > 0 && (
                <button
                  type="button"
                  className="history-trigger-btn"
                  onClick={() => setIsHistoryModalOpen(true)}
                  id="view-interview-history-header-btn"
                >
                  <History size={14} />
                  <span>Interview History ({interviewHistory.length})</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Views */}
        {viewState === 'setup' && (
          <InterviewSetup
            onStartInterview={handleStartInterview}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            historyCount={interviewHistory.length}
          />
        )}

        {viewState === 'room' && currentQuestionData && (
          <InterviewRoom
            key={currentQuestionNumber}
            config={config}
            currentQuestion={currentQuestionData}
            questionNumber={currentQuestionNumber}
            totalQuestions={config.questionCount}
            isLoadingQuestion={isLoadingQuestion}
            apiError={apiError}
            onRetryQuestion={handleRetryQuestion}
            onSubmitAnswer={handleSubmitAnswer}
            onEndEarly={handleEndEarly}
          />
        )}

        {viewState === 'completed' && (
          <div className="completed-card" id="interview-completed-container">
            <div className="completed-icon-wrap">
              <Award size={40} />
            </div>

            <h3 className="completed-title">Interview Completed 🎉</h3>
            <p className="completed-subtext">
              Great job! You have answered all {qaList.length} questions for the {config.targetRole} ({config.interviewType}) mock session.
            </p>

            <div className="completed-stats-row">
              <div className="completed-stat-box">
                <div className="stat-box-val">{qaList.length}</div>
                <div className="stat-box-label">Questions Answered</div>
              </div>
              <div className="completed-stat-box">
                <div className="stat-box-val">{config.targetRole}</div>
                <div className="stat-box-label">Target Role</div>
              </div>
              <div className="completed-stat-box">
                <div className="stat-box-val">{config.difficulty}</div>
                <div className="stat-box-label">Difficulty</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="generate-report-btn"
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                id="generate-interview-report-btn"
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 size={18} className="spin-animation" />
                    <span>Analyzing Answers & Generating Report...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Interview Report</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="chip-btn"
                onClick={() => setViewState('setup')}
                disabled={isGeneratingReport}
                style={{ padding: '14px 20px', fontSize: '14px' }}
              >
                <RotateCcw size={15} style={{ marginRight: '6px' }} />
                <span>Start New Setup</span>
              </button>
            </div>
          </div>
        )}

        {viewState === 'report' && (
          <InterviewReport
            report={activeReport}
            config={config}
            onPracticeAgain={() => setViewState('setup')}
            onPracticeWeakAreas={() => {
              if (onNavigateSection) onNavigateSection('practice-studio');
            }}
            onNavigateToCoach={() => {
              if (onNavigateSection) onNavigateSection('ai-coach');
            }}
            onNavigateToPractice={() => {
              if (onNavigateSection) onNavigateSection('practice-studio');
            }}
            onNavigateToProgress={() => {
              if (onNavigateSection) onNavigateSection('progress');
            }}
          />
        )}
      </div>

      {/* History Modal */}
      <InterviewHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={interviewHistory}
        onSelectSession={handleSelectHistorySession}
        onClearHistory={onClearHistory}
      />
    </section>
  );
}
