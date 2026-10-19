import React, { useState } from 'react';
import { X, Key, Check, ExternalLink, ShieldCheck, Info } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey }) {
  const [inputValue, setInputValue] = useState(currentKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveKey(inputValue.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setInputValue('');
    onSaveKey('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog api-key-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon-badge">🔑</span>
            <div>
              <h3 className="modal-title">Gemini API Key Configuration</h3>
              <p className="modal-subtitle">Powering Aria's Natural Conversation & Function Calling</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="key-info-callout">
              <Info size={16} className="callout-icon" />
              <div>
                <strong>Zero Setup Required:</strong> The app includes an intelligent built-in fallback simulation engine. Even without an API key, all order lookups, policy enforcement, speech synthesis, and post-call summaries will work seamlessly!
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="gemini-key-input" className="form-label">
                Google Gemini API Key
              </label>
              <div className="input-with-icon">
                <Key size={16} className="input-icon" />
                <input
                  id="gemini-key-input"
                  type="password"
                  className="form-input"
                  placeholder="AIzaSy..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <p className="form-hint">
                Stored locally in your browser's <code>localStorage</code>. Never sent to any third-party server.
              </p>
            </div>

            <div className="key-guide-links">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="guide-link"
              >
                <span>Get a free Gemini API key from Google AI Studio</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="modal-footer modal-footer-split">
            {currentKey && (
              <button type="button" className="btn-danger-outline" onClick={handleClear}>
                Remove Saved Key
              </button>
            )}
            <div className="footer-right-buttons">
              <button type="button" className="btn-secondary-modal" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary-modal">
                {savedSuccess ? (
                  <>
                    <Check size={16} /> Saved!
                  </>
                ) : (
                  'Save Key'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
