import React from 'react';
import { X, Shield, Truck, RotateCcw, Ban, IndianRupee } from 'lucide-react';
import { BRAND_POLICIES } from '../data/mockOrders';

export default function BrandPoliciesDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog policies-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon-badge">🌿</span>
            <div>
              <h3 className="modal-title">Aura Skincare — Brand Knowledge & Policies</h3>
              <p className="modal-subtitle">Datastraw Section 3 Specification</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body policies-body">
          {/* Brand Overview */}
          <div className="policy-card brand-card">
            <div className="policy-card-title">
              <Shield size={16} className="policy-icon" />
              <h4>Brand Overview</h4>
            </div>
            <p className="policy-card-desc">{BRAND_POLICIES.brand_overview}</p>
          </div>

          {/* Shipping Policy */}
          <div className="policy-card">
            <div className="policy-card-title">
              <Truck size={16} className="policy-icon text-blue" />
              <h4>Shipping Policy</h4>
            </div>
            <ul className="policy-list">
              <li><strong>Free Delivery:</strong> On orders above ₹499.</li>
              <li><strong>Shipping Fee:</strong> Orders below ₹499 have a flat ₹50 shipping fee.</li>
              <li><strong>Delivery Timeline:</strong> Standard delivery takes 3–5 business days.</li>
            </ul>
          </div>

          {/* Return & Refund Policy */}
          <div className="policy-card">
            <div className="policy-card-title">
              <RotateCcw size={16} className="policy-icon text-emerald" />
              <h4>Return & Refund Policy</h4>
            </div>
            <ul className="policy-list">
              <li><strong>Return Window:</strong> Returns are accepted within <strong>7 days of delivery</strong>.</li>
              <li><strong>Condition:</strong> Only for <strong>unopened, unused</strong> products in original packaging.</li>
              <li><strong>Opened Products:</strong> Opened or tested items strictly cannot be returned.</li>
              <li><strong>Damaged / Defective:</strong> Must be reported within 48 hours of delivery with photos for free replacement.</li>
            </ul>
          </div>

          {/* Cancellation Policy */}
          <div className="policy-card">
            <div className="policy-card-title">
              <Ban size={16} className="policy-icon text-rose" />
              <h4>Cancellation Policy</h4>
            </div>
            <ul className="policy-list">
              <li><strong>Processing Status Only:</strong> Orders can be cancelled <strong>only while status is 'Processing'</strong>.</li>
              <li><strong>Shipped / Out for Delivery:</strong> Once an order is Shipped or Out for Delivery, it cannot be cancelled via system. Customers may refuse delivery at the doorstep.</li>
            </ul>
          </div>

          {/* Cash on Delivery (COD) */}
          <div className="policy-card">
            <div className="policy-card-title">
              <IndianRupee size={16} className="policy-icon text-gold" />
              <h4>Cash on Delivery (COD)</h4>
            </div>
            <ul className="policy-list">
              <li><strong>Order Cap:</strong> COD is available for orders up to <strong>₹2,500</strong>.</li>
              <li><strong>Doorstep Modes:</strong> Customers can pay by cash or UPI at the doorstep.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary-modal" onClick={onClose}>
            Close Brand Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}
