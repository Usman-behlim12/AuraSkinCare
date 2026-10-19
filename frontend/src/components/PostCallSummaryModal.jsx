import React, { useState } from 'react';
import { X, Check, Copy, Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PostCallSummaryModal({ summaryData, isOpen, onClose, transcript }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !summaryData) return null;

  const jsonString = JSON.stringify(summaryData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const payload = {
      summary: summaryData,
      transcript: transcript,
      exported_at: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aura_Skincare_CallSummary_${summaryData.order_id || 'General'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="outcome-badge badge-green"><CheckCircle2 size={13} /> RESOLVED</span>;
      case 'POLICY_EXPLAINED':
        return <span className="outcome-badge badge-blue"><FileText size={13} /> POLICY EXPLAINED</span>;
      case 'CANCELLED':
        return <span className="outcome-badge badge-amber"><AlertCircle size={13} /> CANCELLED</span>;
      default:
        return <span className="outcome-badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog summary-dialog">
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon-badge">📋</span>
            <div>
              <h3 className="modal-title">Post-Call Summary & Structured Outcome</h3>
              <p className="modal-subtitle">Datastraw Section 2.D Specification</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Executive Overview Cards */}
          <div className="summary-cards-grid">
            <div className="summary-metric-card">
              <span className="metric-label">Customer Intent</span>
              <span className="metric-value intent-tag">{summaryData.customer_intent}</span>
            </div>

            <div className="summary-metric-card">
              <span className="metric-label">Order Referenced</span>
              <span className="metric-value order-tag">{summaryData.order_id || 'N/A'}</span>
            </div>

            <div className="summary-metric-card">
              <span className="metric-label">Resolution Status</span>
              <div className="metric-value">
                {getStatusBadge(summaryData.resolution_status)}
              </div>
            </div>
          </div>

          {/* Call Summary Paragraph */}
          <div className="call-summary-box">
            <h4 className="box-title">Executive Call Summary</h4>
            <p className="box-content">{summaryData.call_summary}</p>
          </div>

          {/* Formatted JSON Output (Specification Requirement) */}
          <div className="json-output-section">
            <div className="json-header">
              <span className="json-label">Structured JSON Output:</span>
              <div className="json-actions">
                <button className="btn-action-sm" onClick={handleCopy}>
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
                </button>
                <button className="btn-action-sm" onClick={handleDownload}>
                  <Download size={14} />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            <pre className="json-code-block">
              <code>{jsonString}</code>
            </pre>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary-modal" onClick={onClose}>
            Done & Return to Call Screen
          </button>
        </div>
      </div>
    </div>
  );
}
