// API Service for Aura Skincare Backend integration
import { INITIAL_ORDER_DATABASE } from '../data/mockOrders';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? '/api'
    : 'http://localhost:5000/api');


export async function checkBackendStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return { connected: false };
    const data = await res.json();
    return { connected: true, mode: data.mode || 'mock' };
  } catch {
    return { connected: false, mode: 'mock' };
  }
}

export async function fetchLiveOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.success && data.orders && Object.keys(data.orders).length > 0) {
      return { live: true, orders: data.orders };
    }
  } catch {
    // Graceful fallback to initial mock orders
  }
  return { live: false, orders: INITIAL_ORDER_DATABASE };
}


export async function fetchLiveOrderDetails(orderId) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.order) {
        return { success: true, live: true, order: data.order };
      }
    }
  } catch (err) {
    console.warn(`Live lookup for ${orderId} failed, falling back to local:`, err.message);
  }
  return null;
}

export async function cancelLiveOrder(orderId, reason = '') {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
      signal: AbortSignal.timeout(3000)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`Live cancellation for ${orderId} failed, falling back:`, err.message);
    return null;
  }
}

export async function fetchLiveProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.products) {
        return { live: true, products: data.products };
      }
    }
  } catch {
    // Graceful fallback
  }
  return { live: false, products: [] };
}

export async function checkBackendAiStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/status`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { configured: false };
    const data = await res.json();
    return { configured: Boolean(data.success && data.configured), model: data.model || 'gemini-3.8-flash' };
  } catch {
    return { configured: false };
  }
}

export async function sendAiChat({ message, history = [], orders = {}, apiKey = null }) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) {
      headers['x-gemini-api-key'] = apiKey;
    }
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, history, orders }),
      signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.success && data.reply) {
      return data;
    }
    throw new Error(data.error || 'Failed to get AI chat response');
  } catch (err) {
    console.warn('Backend AI chat error:', err.message);
    return null;
  }
}

export async function generateAiSummary({ transcript = [], apiKey = null }) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) {
      headers['x-gemini-api-key'] = apiKey;
    }
    const res = await fetch(`${API_BASE_URL}/ai/summary`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ transcript }),
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.success && data.summary) {
      return data.summary;
    }
    throw new Error(data.error || 'Failed to get AI summary');
  } catch (err) {
    console.warn('Backend AI summary error:', err.message);
    return null;
  }
}

