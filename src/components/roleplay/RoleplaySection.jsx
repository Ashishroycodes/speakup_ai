import React, { useState } from 'react';
import RoleplayScenarioSelector from './RoleplayScenarioSelector';
import RoleplaySetupModal from './RoleplaySetupModal';
import RoleplayRoom from './RoleplayRoom';
import RoleplayReport from './RoleplayReport';
import RoleplayHistoryModal from './RoleplayHistoryModal';
import { analyzeRoleplaySession } from '../../services/roleplayService';
import { Sparkles, Loader2 } from 'lucide-react';
import './Roleplay.css';

export default function RoleplaySection({
  theme = 'dark',
  onRecordSession,
  roleplayHistory = [],
  onClearHistory
}) {
  const [activeView, setActiveView] = useState('scenarios'); // 'scenarios' | 'room' | 'report'
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [activeRoleplayConfig, setActiveRoleplayConfig] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // When user clicks "Practice" on any scenario card
  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setIsSetupModalOpen(true);
  };

  // When user confirms setup and starts roleplay
  const handleStartRoleplay = (config) => {
    setIsSetupModalOpen(false);
    setActiveRoleplayConfig({
      ...config,
      sessionId: `${config.scenario}-${Date.now()}`
    });
    setActiveView('room');
  };

  // When candidate clicks "End Roleplay"
  const handleEndRoleplay = async (sessionData) => {
    setIsAnalyzing(true);

    try {
      const report = await analyzeRoleplaySession({
        scenario: sessionData.scenario,
        category: sessionData.category,
        character: sessionData.character,
        difficulty: sessionData.difficulty,
        language: sessionData.language,
        goal: sessionData.goal,
        durationSeconds: sessionData.durationSeconds,
        conversationHistory: sessionData.conversationHistory
      });

      setActiveReport(report);

      // Record to persistent progress & award +40 XP
      if (onRecordSession) {
        onRecordSession({
          scenario: sessionData.scenario,
          category: sessionData.category,
          character: sessionData.character,
          difficulty: sessionData.difficulty,
          language: sessionData.language,
          goal: sessionData.goal,
          durationSeconds: sessionData.durationSeconds,
          scores: report.scores,
          report,
          conversationHistory: sessionData.conversationHistory
        });
      }

      setActiveView('report');
    } catch (err) {
      console.warn('Roleplay analysis error:', err);
      setActiveView('scenarios');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Practice again with same configuration
  const handlePracticeAgain = () => {
    if (activeRoleplayConfig) {
      setActiveView('room');
    } else {
      setActiveView('scenarios');
    }
  };

  // Switch back to scenario library
  const handleExploreOther = () => {
    setActiveView('scenarios');
  };

  // View saved session from history
  const handleSelectHistorySession = (item) => {
    if (item.report) {
      setActiveReport(item.report);
      setActiveView('report');
    }
  };

  return (
    <section className="roleplay-section" id="roleplay">
      {/* Section Header */}
      <div className="roleplay-header">
        <div className="roleplay-badge">
          <Sparkles size={14} />
          <span>🎭 Real-Life AI Roleplay</span>
        </div>

        <h1 className="roleplay-title">Real-Life AI Roleplay</h1>
        <p className="roleplay-subtitle">
          Practice real conversations with AI before facing them in real life.
        </p>
      </div>

      {/* Analyzing Loading Overlay */}
      {isAnalyzing && (
        <div 
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <Loader2 size={40} className="animate-spin" style={{ color: '#818cf8', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
            Analyzing Your Roleplay Conversation...
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Evaluating communication flow, politeness, clarity, and vocabulary across your dialogue.
          </p>
        </div>
      )}

      {/* View 1: Scenarios Grid */}
      {!isAnalyzing && activeView === 'scenarios' && (
        <RoleplayScenarioSelector
          onSelectScenario={handleSelectScenario}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          historyCount={roleplayHistory.length}
        />
      )}

      {/* View 2: Interactive Roleplay Room */}
      {!isAnalyzing && activeView === 'room' && activeRoleplayConfig && (
        <RoleplayRoom
          key={activeRoleplayConfig.sessionId}
          config={activeRoleplayConfig}
          theme={theme}
          onEndRoleplay={handleEndRoleplay}
        />
      )}

      {/* View 3: Post-Roleplay Report */}
      {!isAnalyzing && activeView === 'report' && activeReport && (
        <RoleplayReport
          report={activeReport}
          onPracticeAgain={handlePracticeAgain}
          onExploreOtherScenarios={handleExploreOther}
        />
      )}

      {/* Setup Modal */}
      <RoleplaySetupModal
        scenario={selectedScenario}
        theme={theme}
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onStartRoleplay={handleStartRoleplay}
      />

      {/* History Modal */}
      <RoleplayHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={roleplayHistory}
        onSelectSession={handleSelectHistorySession}
        onClearHistory={onClearHistory}
      />
    </section>
  );
}
