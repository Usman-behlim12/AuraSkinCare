import React from 'react';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Sparkles, Send } from 'lucide-react';
import { SAMPLE_EVALUATOR_PROMPTS } from '../data/mockOrders';

export default function OrdersHelperCard({ orderDatabase, onSelectPrompt, isCallActive }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Out for Delivery':
        return <span className="status-tag tag-blue"><Truck size={12} /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="status-tag tag-green"><CheckCircle size={12} /> Delivered</span>;
      case 'Processing':
        return <span className="status-tag tag-amber"><Clock size={12} /> Processing</span>;
      case 'Cancelled':
        return <span className="status-tag tag-red"><AlertCircle size={12} /> Cancelled</span>;
      default:
        return <span className="status-tag">{status}</span>;
    }
  };

  return (
    <div className="orders-helper-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <Package size={18} className="panel-icon" />
          <h3 className="panel-title">Mock Order Database & Evaluator Testing</h3>
        </div>
        <span className="evaluator-pill">Section 4 Specs</span>
      </div>

      <p className="panel-subtitle">
        Reference live mock orders below. Click any prompt chip to test tool execution, policy guardrails, or edge cases instantly.
      </p>

      {/* Orders Grid */}
      <div className="orders-grid">
        {Object.values(orderDatabase).map((order) => (
          <div key={order.order_id} className={`order-card order-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="order-card-header">
              <div className="order-id-badge">{order.order_id}</div>
              {getStatusBadge(order.status)}
            </div>

            <div className="order-card-body">
              <div className="order-row">
                <span className="order-label">Customer:</span>
                <span className="order-value highlight-name">{order.customer}</span>
              </div>
              <div className="order-row">
                <span className="order-label">Product:</span>
                <span className="order-value">{order.product}</span>
              </div>
              <div className="order-row">
                <span className="order-label">Value:</span>
                <span className="order-value price-tag">{order.formatted_value || `₹${order.value}`}</span>
              </div>
              <div className="order-notes-box">
                <span className="notes-icon">ℹ️</span>
                <span className="notes-text">{order.notes}</span>
              </div>
            </div>

            <div className="order-card-footer">
              <button
                className="btn-quick-ask"
                onClick={() => onSelectPrompt(`Where is my order ${order.order_id}?`)}
                title={`Ask Aria about ${order.order_id}`}
              >
                <Send size={13} />
                <span>Track {order.order_id}</span>
              </button>

              {order.status === 'Processing' && (
                <button
                  className="btn-quick-ask btn-quick-cancel"
                  onClick={() => onSelectPrompt(`I want to cancel my order ${order.order_id}`)}
                  title={`Cancel ${order.order_id}`}
                >
                  <AlertCircle size={13} />
                  <span>Cancel Order</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Evaluator Test Prompts */}
      <div className="evaluator-prompts-section">
        <div className="evaluator-prompts-header">
          <Sparkles size={15} className="sparkle-gold" />
          <h4>Instant Evaluator Test Scenarios:</h4>
        </div>
        <div className="prompt-chips-wrapper">
          {SAMPLE_EVALUATOR_PROMPTS.map((item, index) => (
            <button
              key={index}
              className="prompt-chip"
              onClick={() => onSelectPrompt(item.prompt)}
              title={item.prompt}
            >
              <span className="chip-icon">{item.icon}</span>
              <span className="chip-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
