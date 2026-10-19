import React, { useRef, useEffect, useState } from 'react';
import { User, Bot, Sparkles, Volume2, Send, CornerDownLeft, MessageSquare } from 'lucide-react';

export default function CallTranscript({
  transcript,
  onSendMessage,
  isCallActive,
  onSpeakAgain,
  status
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcript]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="transcript-panel">
      <div className="transcript-header">
        <div className="transcript-title-group">
          <MessageSquare size={18} className="panel-icon" />
          <h3 className="panel-title">Live Call Transcript</h3>
        </div>
        <span className="transcript-count-badge">
          {transcript.length} {transcript.length === 1 ? 'Exchange' : 'Exchanges'}
        </span>
      </div>

      <div className="transcript-messages-container">
        {transcript.length === 0 ? (
          <div className="transcript-empty-state">
            <span className="empty-icon">🎙️</span>
            <p className="empty-title">Call transcript will appear here in real-time</p>
            <p className="empty-sub">
              Click <strong>"Start Voice Call"</strong> to speak with Aria, or type a message below.
            </p>
          </div>
        ) : (
          transcript.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble-row ${msg.role === 'Customer' ? 'msg-customer' : 'msg-aria'}`}
            >
              <div className="avatar-icon">
                {msg.role === 'Customer' ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className="message-content-wrapper">
                <div className="message-meta-row">
                  <span className="speaker-label">{msg.role === 'Customer' ? 'Customer' : 'Aria (Aura Skincare)'}</span>
                  <span className="timestamp-label">{msg.timestamp || 'Just now'}</span>
                </div>

                {msg.toolExecuted && (
                  <div className="transcript-tool-badge">
                    <Sparkles size={12} />
                    <span>Tool Called: <code>{msg.toolExecuted.name}</code> ({JSON.stringify(msg.toolExecuted.args)})</span>
                  </div>
                )}

                <div className="message-text">
                  {msg.text}
                </div>

                {msg.role === 'Aria' && (
                  <button
                    className="btn-replay-voice"
                    onClick={() => onSpeakAgain(msg.text)}
                    title="Play voice again"
                  >
                    <Volume2 size={13} />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {status === 'Thinking' && (
          <div className="message-bubble-row msg-aria thinking-bubble">
            <div className="avatar-icon">
              <Bot size={16} />
            </div>
            <div className="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Text input bar */}
      <form onSubmit={handleSubmit} className="transcript-input-form">
        <input
          type="text"
          className="text-input"
          placeholder={isCallActive ? "Type to speak with Aria..." : "Start call or type a test query..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          type="submit"
          className="btn-send-message"
          disabled={!inputText.trim()}
          title="Send query"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
