import React from 'react';
import { Mic, MicOff, PhoneCall, PhoneOff, Volume2, Sparkles, Loader2, Square } from 'lucide-react';

export default function VoiceAgentOrb({
  status,
  isCallActive,
  onStartCall,
  onEndCall,
  onInterrupt,
  interimTranscript,
  activeToolExecution
}) {
  const getStatusLabel = () => {
    switch (status) {
      case 'Listening':
        return 'Listening to you...';
      case 'Thinking':
        return activeToolExecution ? `Calling tool: ${activeToolExecution}...` : 'Aria is thinking...';
      case 'Speaking':
        return 'Aria is speaking (en-IN)...';
      default:
        return 'Ready to connect';
    }
  };

  const getStatusBadgeClass = () => {
    switch (status) {
      case 'Listening':
        return 'badge-listening';
      case 'Thinking':
        return 'badge-thinking';
      case 'Speaking':
        return 'badge-speaking';
      default:
        return 'badge-idle';
    }
  };

  return (
    <div className="voice-agent-container">
      {/* Orb Visualizer Centerpiece */}
      <div className={`orb-wrapper state-${status.toLowerCase()}`}>
        <div className="orb-outer-ring"></div>
        <div className="orb-middle-ring"></div>
        <div className="orb-core">
          {status === 'Idle' && <Sparkles size={48} className="orb-icon idle-glow" />}
          {status === 'Listening' && <Mic size={48} className="orb-icon listening-pulse" />}
          {status === 'Thinking' && <Loader2 size={48} className="orb-icon spin-icon" />}
          {status === 'Speaking' && <Volume2 size={48} className="orb-icon speaking-bounce" />}
        </div>


        {(status === 'Speaking' || status === 'Listening') && (
          <div className="soundwave-bars">
            <span className="wave-bar bar-1"></span>
            <span className="wave-bar bar-2"></span>
            <span className="wave-bar bar-3"></span>
            <span className="wave-bar bar-4"></span>
            <span className="wave-bar bar-5"></span>
          </div>
        )}
      </div>

      {/* Live State & Persona Indicator */}
      <div className="agent-meta-status">
        <div className="persona-info">
          <h2 className="agent-name">Aria</h2>
          <span className="agent-role">Aura Skincare CX Specialist</span>
        </div>

        <div className={`status-pill ${getStatusBadgeClass()}`}>
          <span className="pulse-indicator"></span>
          <span>{getStatusLabel()}</span>
        </div>

        {activeToolExecution && (
          <div className="tool-indicator-banner">
            <Sparkles size={14} className="tool-sparkle" />
            <span>Executing Database Tool: <strong>{activeToolExecution}</strong></span>
          </div>
        )}

        {/* Real-time Interim Voice Speech Feedback */}
        {isCallActive && status === 'Listening' && (
          <div className="live-speech-box">
            {interimTranscript ? (
              <p className="interim-text">"{interimTranscript}"</p>
            ) : (
              <p className="interim-placeholder">Speak naturally into your microphone...</p>
            )}
          </div>
        )}
      </div>

      {/* Main Call Action Buttons */}
      <div className="call-actions-row">
        {!isCallActive ? (
          <button
            id="start-call-btn"
            className="btn-start-call"
            onClick={onStartCall}
          >
            <PhoneCall size={20} />
            <span>Start Voice Call</span>
          </button>
        ) : (
          <div className="active-call-controls">
            {status === 'Speaking' && (
              <button
                id="barge-in-btn"
                className="btn-barge-in"
                onClick={onInterrupt}
                title="Interrupt Aria and speak now (Barge-in)"
              >
                <Square size={16} fill="currentColor" />
                <span>Interrupt & Speak</span>
              </button>
            )}

            <button
              id="end-call-btn"
              className="btn-end-call"
              onClick={onEndCall}
            >
              <PhoneOff size={20} />
              <span>End Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
