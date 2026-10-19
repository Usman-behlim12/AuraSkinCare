import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Order } from './models/Order.js';
import { Product } from './models/Product.js';
import { INITIAL_ORDERS, INITIAL_PRODUCTS } from './seed.js';
import { handleAiChat, handleAiSummary } from './geminiBackendService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aura_skincare';

// Middleware
app.use(cors());
app.use(express.json());

// Brand Information from Datastraw Assessment Specification
export const BRAND_INFO = {
  name: "Aura Skincare",
  tagline: "Pure organic botanical skincare crafted with thoughtfully selected ingredients",
  overview: "Aura Skincare is a premium organic Indian skincare brand focused on simple, effective skincare products made with thoughtfully selected botanical ingredients. We prioritize natural, toxin-free formulations suitable for Indian climate and skin types.",
  services: [
    "100% Organic, Cruelty-Free & Dermatologically Tested Skincare",
    "Real-time Order Tracking & Nationwide Doorstep Delivery via BlueDart and Delhivery",
    "Free Delivery on orders above ₹499 (Standard 3–5 business days)",
    "Hassle-free 7-day Returns for unopened products in original packaging",
    "Cash on Delivery (COD) available up to ₹2,500 with doorstep Cash or UPI payment"
  ],
  policies: {
    shipping: "Free delivery on orders above ₹499. Orders below ₹499 have a ₹50 shipping fee. Delivery takes 3–5 business days.",
    returns: "Returns accepted within 7 days of delivery for unopened, unused products in original packaging.",
    cancellation: "Orders can be cancelled only while their status is 'Processing'. Once Shipped or Out for Delivery, orders cannot be cancelled.",
    cod: "COD available up to ₹2,500. Pay by Cash or UPI at doorstep."
  }
};

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log(`🌿 Connected to MongoDB at ${MONGO_URI}`);

    // Auto-seed Orders if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('Orders collection is empty. Auto-seeding orders...');
      await Order.insertMany(INITIAL_ORDERS);
      console.log('✅ Orders seeded successfully.');
    } else {
      console.log(`📦 Found ${orderCount} orders in MongoDB.`);
    }

    // Auto-seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Products collection is empty. Auto-seeding products...');
      await Product.insertMany(INITIAL_PRODUCTS);
      console.log('✅ Products seeded successfully.');
    } else {
      console.log(`🧴 Found ${productCount} products in MongoDB.`);
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// Routes

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Aura Skincare CX Backend',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 2. Brand Overview & Store Information
app.get('/api/brand', (req, res) => {
  res.json({
    success: true,
    brand: BRAND_INFO
  });
});

// 3. Products Endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ product_id: 1 });
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const query = req.params.id.toUpperCase();
    const product = await Product.findOne({
      $or: [{ product_id: query }, { name: new RegExp(query, 'i') }]
    });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Orders Endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ order_id: 1 });
    const orderMap = {};
    orders.forEach(o => {
      orderMap[o.order_id] = o;
    });
    res.json({ success: true, count: orders.length, orders: orderMap, list: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/orders/:order_id', async (req, res) => {
  try {
    const orderId = req.params.order_id.toUpperCase();
    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${orderId} not found in MongoDB.` });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders/:order_id/cancel', async (req, res) => {
  try {
    const orderId = req.params.order_id.toUpperCase();
    const { reason } = req.body || {};
    const order = await Order.findOne({ order_id: orderId });

    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${orderId} not found in database.` });
    }

    if (order.status !== 'Processing') {
      return res.status(400).json({
        success: false,
        order_id: orderId,
        current_status: order.status,
        error: `Order cannot be cancelled because its current status is '${order.status}'. Policy allows cancellation only while Processing.`
      });
    }

    order.status = 'Cancelled';
    order.notes = `Order cancelled by customer during support call.${reason ? ` Reason: ${reason}` : ''}`;
    order.is_cancellable = false;
    await order.save();

    console.log(`✅ Order ${orderId} cancelled in MongoDB`);
    res.json({
      success: true,
      message: `Order ${orderId} has been successfully cancelled in MongoDB.`,
      order
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Reset / Re-seed database
app.post('/api/orders/reset', async (req, res) => {
  try {
    await Order.deleteMany({});
    await Product.deleteMany({});
    const orders = await Order.insertMany(INITIAL_ORDERS);
    const products = await Product.insertMany(INITIAL_PRODUCTS);
    res.json({
      success: true,
      message: 'Database reset to initial mock orders & products',
      ordersCount: orders.length,
      productsCount: products.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Secure AI Endpoints (Gemini 1.5 Flash)
app.get('/api/ai/status', (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(key && key.trim() && !key.includes('your_gemini'));
  res.json({
    success: true,
    configured: isConfigured,
    model: 'gemini-1.5-flash'
  });
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, orders } = req.body || {};
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required.' });
    }
    const clientKey = req.headers['x-gemini-api-key'];
    const result = await handleAiChat({
      message,
      history,
      orders,
      apiKey: clientKey
    });
    res.json(result);
  } catch (err) {
    console.error('AI Chat Error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.post('/api/ai/summary', async (req, res) => {
  try {
    const { transcript } = req.body || {};
    if (!Array.isArray(transcript) || transcript.length === 0) {
      return res.status(400).json({ success: false, error: 'Valid transcript array is required.' });
    }
    const clientKey = req.headers['x-gemini-api-key'];
    const result = await handleAiSummary({
      transcript,
      apiKey: clientKey
    });
    res.json(result);
  } catch (err) {
    console.error('AI Summary Error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Aura Skincare CX Backend running on http://localhost:${PORT}`);
});
