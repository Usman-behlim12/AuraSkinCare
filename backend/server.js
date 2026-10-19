import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { INITIAL_ORDERS, INITIAL_PRODUCTS } from './seed.js';
import { handleAiChat, handleAiSummary } from './geminiBackendService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// In-Memory Mock Store (Pure mock data, no database required)
let ordersStore = JSON.parse(JSON.stringify(INITIAL_ORDERS));
let productsStore = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));

console.log(`🌿 Aura Skincare Backend running on Mock Data (${ordersStore.length} orders, ${productsStore.length} products).`);

// Routes

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Aura Skincare CX Backend',
    mode: 'in-memory-mock',
    ordersCount: ordersStore.length
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
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    count: productsStore.length,
    products: productsStore
  });
});

app.get('/api/products/:id', (req, res) => {
  const query = req.params.id.toUpperCase();
  const product = productsStore.find(
    p => p.product_id === query || p.name.toUpperCase().includes(query)
  );
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, product });
});

// 4. Orders Endpoints
app.get('/api/orders', (req, res) => {
  const orderMap = {};
  ordersStore.forEach(o => {
    orderMap[o.order_id] = o;
  });
  res.json({ success: true, count: ordersStore.length, orders: orderMap, list: ordersStore });
});

app.get('/api/orders/:order_id', (req, res) => {
  const orderId = req.params.order_id.toUpperCase();
  const order = ordersStore.find(o => o.order_id === orderId);
  if (!order) {
    return res.status(404).json({ success: false, error: `Order ${orderId} not found in mock store.` });
  }
  res.json({ success: true, order });
});

app.post('/api/orders/:order_id/cancel', (req, res) => {
  const orderId = req.params.order_id.toUpperCase();
  const { reason } = req.body || {};
  const order = ordersStore.find(o => o.order_id === orderId);

  if (!order) {
    return res.status(404).json({ success: false, error: `Order ${orderId} not found in mock store.` });
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

  console.log(`✅ Order ${orderId} cancelled in mock store`);
  res.json({
    success: true,
    message: `Order ${orderId} has been successfully cancelled in mock store.`,
    order
  });
});

// 5. Reset mock data store
app.post('/api/orders/reset', (req, res) => {
  ordersStore = JSON.parse(JSON.stringify(INITIAL_ORDERS));
  productsStore = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  res.json({
    success: true,
    message: 'Mock store reset to initial orders & products',
    ordersCount: ordersStore.length,
    productsCount: productsStore.length
  });
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

    // Merge in-memory ordersStore if client orders not provided
    const effectiveOrders = orders && Object.keys(orders).length > 0 ? orders : {};
    if (Object.keys(effectiveOrders).length === 0) {
      ordersStore.forEach(o => {
        effectiveOrders[o.order_id] = o;
      });
    }

    const clientKey = req.headers['x-gemini-api-key'];
    const result = await handleAiChat({
      message,
      history,
      orders: effectiveOrders,
      apiKey: clientKey
    });

    // If cancellation was executed, sync in-memory store
    if (result?.updatedOrder) {
      const u = result.updatedOrder;
      const match = ordersStore.find(o => o.order_id === u.order_id);
      if (match) {
        match.status = u.status;
        match.notes = u.notes;
        match.is_cancellable = u.is_cancellable;
      }
    }

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
  console.log(`🚀 Aura Skincare Mock Backend running on http://localhost:${PORT}`);
});
