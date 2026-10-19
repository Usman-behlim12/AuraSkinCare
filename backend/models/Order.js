import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    customer: {
      type: String,
      required: true
    },
    product: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    formatted_value: {
      type: String
    },
    status: {
      type: String,
      required: true,
      enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
    },
    courier: {
      type: String
    },
    tracking_number: {
      type: String
    },
    notes: {
      type: String
    },
    delivered_days_ago: {
      type: Number,
      default: null
    },
    is_cancellable: {
      type: Boolean,
      default: false
    },
    cancellation_note: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model('Order', orderSchema);
