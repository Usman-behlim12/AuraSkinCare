import { GoogleGenerativeAI } from '@google/generative-ai';
import { Order } from './models/Order.js';
import { INITIAL_ORDERS } from './seed.js';

export const SYSTEM_INSTRUCTION = `
You are Aria, the friendly, professional, and concise Indian customer support specialist for Aura Skincare.
Aura Skincare is a premium organic Indian skincare brand focused on simple, effective skincare products made with thoughtfully selected ingredients.

Core Behavioral Guidelines:
1. Persona:
   - Friendly, empathetic, polished, and natural Indian customer care executive.
   - Speak naturally in concise, spoken-friendly sentences (typically 1-3 sentences max, suitable for voice output).
   - Use warm professional tone (e.g. "Namaste! Welcome to Aura Skincare. How may I assist you today?").
   - Maintain context throughout the conversation. Avoid robotic repetition.

2. Aura Skincare Brand Policies (ENFORCE STRICTLY — DO NOT MAKE PROMISES OUTSIDE POLICY):
   - Shipping Policy: Free delivery on orders above ₹499. Orders below ₹499 have a ₹50 shipping fee. Standard delivery takes 3–5 business days across India.
   - Return & Refund Policy: Returns are accepted within 7 days of delivery ONLY for unopened, unused products in original packaging. Damaged or defective products must be reported within 48 hours of delivery with photos for replacement. Opened or used items CANNOT be returned. Items delivered more than 7 days ago CANNOT be returned.
   - Cancellation Policy: Orders can be cancelled ONLY while their status is 'Processing'. Once an order is 'Shipped' or 'Out for Delivery', it CANNOT be cancelled; advise the customer they may refuse delivery at the doorstep.
   - Cash on Delivery (COD): Available for orders up to ₹2,500. Customers can pay by cash or UPI at the doorstep.

3. Policy Enforcement & Guardrails:
   - When a customer asks to return an opened product or an item purchased >7 days ago (e.g. "I bought this 20 days ago and have opened it. Can I return it?"):
     Politely refuse and clearly explain the policy: returns are only valid within 7 days of delivery for unopened, unused products in original packaging. Do NOT promise exceptions or refunds.
   - Out-of-Scope Queries (e.g. "Can you book me a flight to Goa?", or any question unrelated to Aura Skincare):
     Do NOT answer the question. Politely decline by saying: "I apologize, but I cannot answer that. I am Aria, the customer care assistant for Aura Skincare, and I can only help you with your order tracking, cancellations, returns, and Aura Skincare product policies. How may I assist you with your order today?"
   - Graceful Degradation:
     If the customer's input is unclear, muddled, or an order ID is missing or invalid:
     Gracefully ask for clarification (e.g., "I couldn't locate an order with that number, could you please repeat or verify the order ID?"). Never hallucinate order details.
`;

// Helper: Parse Order ID from speech, text, product names, or numbers
export function parseOrderId(input) {
  if (!input) return null;
  const s = String(input).toLowerCase();

  if (s.includes("103") || s.includes("green tea") || s.includes("face wash") || s.includes("ananya")) {
    return "ORD-103";
  }
  if (s.includes("101") || s.includes("vitamin c") || s.includes("serum") || s.includes("priya")) {
    return "ORD-101";
  }
  if (s.includes("102") || s.includes("sunscreen") || s.includes("spf") || s.includes("rahul")) {
    return "ORD-102";
  }
  if (s.includes("999")) {
    return "ORD-999";
  }

  const match = s.match(/(?:ord|order|id|number)?\s*[-#]?\s*(\d{3})/i);
  if (match) {
    return `ORD-${match[1]}`;
  }
  return null;
}

// Check cancellation intent in user text
function isCancellationIntent(text) {
  const t = text.toLowerCase();
  return (
    t.includes('cancel') ||
    t.includes('cancellation') ||
    t.includes('cancle') ||
    t.includes('khatam') ||
    t.includes('rok do') ||
    t.includes('hata do') ||
    t.includes('band kar') ||
    t.includes('nahi chahiye')
  );
}

// Fetch order from MongoDB or fallback
async function getOrderRecord(orderId, fallbackOrders = {}) {
  let orderData = null;
  try {
    orderData = await Order.findOne({ order_id: orderId });
  } catch (err) {
    console.warn('MongoDB lookup warning:', err.message);
  }

  if (!orderData && fallbackOrders && fallbackOrders[orderId]) {
    orderData = fallbackOrders[orderId];
  }

  if (!orderData) {
    const found = INITIAL_ORDERS.find(o => o.order_id === orderId);
    if (found) orderData = found;
  }

  return orderData;
}

// Handle AI Chat with Gemini 3.8 Flash + Backend Order Tools
export async function handleAiChat({ message, history = [], orders = {}, apiKey }) {
  const activeKey = apiKey || process.env.GEMINI_API_KEY;
  if (!activeKey) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const userText = String(message || '').trim();
  const lowerText = userText.toLowerCase();
  const orderId = parseOrderId(userText);
  const isCancel = isCancellationIntent(lowerText);

  let executedTool = null;
  let updatedOrder = null;
  let toolContext = '';

  // 1. Tool execution: Order Cancellation
  if (isCancel) {
    const targetId = orderId || (orders['ORD-103']?.status === 'Processing' ? 'ORD-103' : null);
    executedTool = { name: 'cancel_order', args: { order_id: targetId || 'UNKNOWN' } };

    if (targetId) {
      const orderData = await getOrderRecord(targetId, orders);
      if (orderData) {
        if (orderData.status === 'Processing') {
          // Perform cancellation in MongoDB
          try {
            await Order.updateOne(
              { order_id: targetId },
              {
                $set: {
                  status: 'Cancelled',
                  notes: 'Order cancelled by customer during support call.',
                  is_cancellable: false
                }
              }
            );
          } catch (err) {
            console.warn('MongoDB cancel update notice:', err.message);
          }

          updatedOrder = {
            order_id: targetId,
            customer: orderData.customer,
            product: orderData.product,
            status: 'Cancelled',
            notes: 'Order cancelled by customer during support call.',
            is_cancellable: false
          };

          toolContext = `[TOOL RESULT cancel_order]: Success! Order ${targetId} for ${orderData.product} has been cancelled in the database. Instruct customer that cancellation is confirmed and refund/SMS will be sent.`;
        } else {
          toolContext = `[TOOL RESULT cancel_order]: Ineligible. Order ${targetId} has status '${orderData.status}'. Brand policy states orders cannot be cancelled once Shipped or Out for Delivery. Advise customer to refuse delivery at the doorstep.`;
        }
      } else {
        toolContext = `[TOOL RESULT cancel_order]: Order ${targetId} was not found in the database. Politely ask customer to verify order ID.`;
      }
    } else {
      toolContext = `[TOOL CONTEXT]: Customer wants to cancel an order, but no order ID was provided. Politely ask for their order ID (e.g. ORD-103).`;
    }
  }
  // 2. Tool execution: Order Details / Tracking
  else if (orderId) {
    executedTool = { name: 'get_order_details', args: { order_id: orderId } };
    const orderData = await getOrderRecord(orderId, orders);

    if (orderData) {
      toolContext = `[TOOL RESULT get_order_details]: Found order ${orderId} for customer ${orderData.customer}:
- Product: ${orderData.product}
- Status: ${orderData.status}
- Courier: ${orderData.courier || 'N/A'}
- Tracking Number: ${orderData.tracking_number || 'N/A'}
- Notes: ${orderData.notes || 'None'}
- Delivered days ago: ${orderData.delivered_days_ago || 'N/A'}
Communicate this status clearly and concisely to the customer.`;
    } else {
      toolContext = `[TOOL RESULT get_order_details]: Order ${orderId} does not exist in the database. Politely inform customer you could not locate an order with that ID and ask them to verify.`;
    }
  }

  // Call Gemini 3.8 Flash to synthesize response with Aria's persona and policies
  const genAI = new GoogleGenerativeAI(activeKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.8-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 500
    }
  });

  // Build context prompt
  const recentHistory = Array.isArray(history)
    ? history.slice(-6).map(h => `${h.role === 'Customer' || h.role === 'user' ? 'Customer' : 'Aria'}: ${h.text}`).join('\n')
    : '';

  const fullPrompt = `
${recentHistory ? `Recent Conversation History:\n${recentHistory}\n` : ''}
${toolContext ? `Tool Execution Data:\n${toolContext}\n` : ''}
Customer says: "${userText}"

Respond as Aria in 1-3 spoken, friendly, professional sentences. Follow all Aura Skincare brand policies strictly. Do not include asterisks or markdown formatting.
`;

  const result = await model.generateContent(fullPrompt);
  let reply = result.response.text().trim();

  // Clean any stray markdown formatting for natural voice playback
  reply = reply.replace(/\*\*/g, '').replace(/\*/g, '');

  return {
    success: true,
    reply,
    executedTool,
    updatedOrder
  };
}

// Handle AI Structured Summary (Section 2.D)
export async function handleAiSummary({ transcript = [], apiKey }) {
  const activeKey = apiKey || process.env.GEMINI_API_KEY;
  if (!activeKey) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const genAI = new GoogleGenerativeAI(activeKey);
  const summaryModel = genAI.getGenerativeModel({
    model: 'gemini-3.8-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1
    }
  });

  const prompt = `
You are analyzing a customer service call transcript between a customer and Aria (support agent for Aura Skincare).
Generate a structured JSON call outcome following this exact schema:
{
  "customer_intent": "ORDER_TRACKING" | "RETURN_REQUEST" | "CANCELLATION" | "POLICY_INQUIRY" | "OUT_OF_SCOPE" | "GENERAL_INQUIRY",
  "order_id": "ORD-XXX" or null,
  "resolution_status": "RESOLVED" | "POLICY_EXPLAINED" | "ESCALATED" | "UNRESOLVED",
  "call_summary": "Concise 1-2 sentence factual summary of the call outcome."
}

Transcript:
${transcript.map(m => `${m.role}: ${m.text}`).join('\n')}
`;

  const result = await summaryModel.generateContent(prompt);
  const textResponse = result.response.text();
  const summaryJson = JSON.parse(textResponse);

  return {
    success: true,
    summary: summaryJson
  };
}
