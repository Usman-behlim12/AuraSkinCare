import React from 'react';
import { Database, Key, ShieldCheck } from 'lucide-react';

export default function Header({ onOpenApiKeyModal, onOpenPoliciesModal, hasApiKey, isMongoConnected }) {
  return (
    <header className="brand-header">
      <div className="brand-header-inner">
        <div className="brand-logo-group">
          <div className="brand-icon-wrapper">
            <span className="brand-icon">🌿</span>
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-name">AURA SKINCARE</h1>
              <span className="badge-luxury">Organic • Indian</span>
            </div>
            <p className="brand-tagline">AI Voice CX Support Concierge — Aria</p>
          </div>
        </div>

        <div className="header-actions">
          {/* MongoDB Live Status Pill */}
          <div 
            className="action-pill-btn"
            title={isMongoConnected ? "Connected to live MongoDB database" : "Running on in-memory database"}
          >
            <Database size={15} className={isMongoConnected ? "text-emerald" : "text-amber"} />
            <span>{isMongoConnected ? 'MongoDB Live' : 'Database: Local'}</span>
            <span className={`status-dot ${isMongoConnected ? 'dot-active' : 'dot-warning'}`}></span>
          </div>

          <button
            className="action-pill-btn"
            onClick={onOpenPoliciesModal}
            title="View Aura Skincare Brand Policies"
          >
            <ShieldCheck size={16} className="pill-icon" />
            <span>Brand Policies</span>
          </button>

          <button
            className={`action-pill-btn ${hasApiKey ? 'key-configured' : 'key-missing'}`}
            onClick={onOpenApiKeyModal}
            title="Configure Gemini API Key"
          >
            <Key size={16} className="pill-icon" />
            <span>{hasApiKey ? 'Gemini 1.5 Flash Active' : 'Enter Gemini API Key'}</span>
            <span className={`status-dot ${hasApiKey ? 'dot-active' : 'dot-warning'}`}></span>
          </button>
        </div>
      </div>
    </header>
  );
}
