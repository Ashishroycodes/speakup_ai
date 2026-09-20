import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import './Timer.css';

export default function Timer({ 
  selectedDuration, 
  onSelectDuration, 
  elapsedSeconds, 
  isSpeaking, 
  onTimerEnd 
}) {
  const durations = [
    { label: '30s', value: 30 },
    { label: '60s', value: 60 },
    { label: '2 mins', value: 120 }
  ];

  // Helper to format seconds as MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const remaining = Math.max(0, selectedDuration - elapsedSeconds);

  // Check if timer expired
  useEffect(() => {
    if (isSpeaking && elapsedSeconds >= selectedDuration) {
      onTimerEnd();
    }
  }, [elapsedSeconds, selectedDuration, isSpeaking, onTimerEnd]);

  return (
    <div className="timer-component">
      {/* Duration selector tabs */}
      <div className="duration-selector-row">
        <span className="duration-label">
          <Clock size={15} />
          Target Duration:
        </span>
        <div className="duration-pill-group">
          {durations.map((d) => (
            <button
              key={d.value}
              type="button"
              className={`duration-pill-btn ${selectedDuration === d.value ? 'active' : ''}`}
              onClick={() => onSelectDuration(d.value)}
              disabled={isSpeaking}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Speaking Time Display */}
      <div className="speaking-time-box">
        <div className="speaking-time-title">Speaking Time</div>
        <div className="speaking-time-numbers">
          <span className="time-elapsed">{formatTime(elapsedSeconds)}</span>
          <span className="time-divider">/</span>
          <span className="time-total">{formatTime(selectedDuration)}</span>
        </div>
        {isSpeaking && remaining <= 10 && remaining > 0 && (
          <span className="timer-countdown-warning">Wrapping up in {remaining}s...</span>
        )}
      </div>
    </div>
  );
}
