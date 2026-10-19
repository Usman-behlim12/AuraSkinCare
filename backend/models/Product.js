import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'Skincare'
    },
    price: {
      type: Number,
      required: true
    },
    formatted_price: {
      type: String
    },
    description: {
      type: String,
      required: true
    },
    key_ingredients: [String],
    in_stock: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model('Product', productSchema);
