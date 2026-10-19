// Aura Skincare Mock Database & Brand Policy Configuration
// As specified in Datastraw Assessment Document

export const INITIAL_ORDER_DATABASE = {
  "ORD-101": {
    order_id: "ORD-101",
    customer: "Priya Sharma",
    product: "Vitamin C Serum (30ml)",
    value: 699,
    formatted_value: "₹699",
    status: "Out for Delivery",
    courier: "BlueDart",
    tracking_number: "BD-982103",
    notes: "BlueDart — BD-982103. Expected by 6 PM today.",
    delivered_days_ago: null,
    is_cancellable: false,
    cancellation_note: "Cannot be cancelled as it is Out for Delivery. Customer may refuse delivery at doorstep."
  },
  "ORD-102": {
    order_id: "ORD-102",
    customer: "Rahul Verma",
    product: "Hydrating Sunscreen SPF 50",
    value: 499,
    formatted_value: "₹499",
    status: "Delivered",
    courier: "Delhivery",
    tracking_number: "DL-441029",
    notes: "Delhivery — DL-441029. Delivered 14 days ago.",
    delivered_days_ago: 14,
    is_cancellable: false,
    cancellation_note: "Already delivered.",
    return_eligible: false,
    return_ineligible_reason: "Delivered 14 days ago (exceeds the 7-day return window) and/or opened products are ineligible."
  },
  "ORD-103": {
    order_id: "ORD-103",
    customer: "Ananya Patel",
    product: "Green Tea Face Wash + Toner",
    value: 850,
    formatted_value: "₹850",
    status: "Processing",
    courier: "Pending Allocation",
    tracking_number: "TBD",
    notes: "Ordered 3 hours ago. Eligible for cancellation.",
    delivered_days_ago: null,
    is_cancellable: true,
    cancellation_note: "Eligible for immediate cancellation."
  }
};

export const BRAND_POLICIES = {
  brand_name: "Aura Skincare",
  tagline: "Pure organic botanical skincare crafted with thoughtfully selected ingredients",
  brand_overview: "Aura Skincare is a premium organic Indian skincare brand focused on simple, effective skincare products made with thoughtfully selected ingredients.",
  shipping: {
    free_delivery_threshold: "Above ₹499",
    standard_fee: "₹50 for orders below ₹499",
    timeline: "3–5 business days standard delivery across India"
  },
  returns: {
    window_days: 7,
    conditions: "Accepted within 7 days of delivery for unopened, unused products in original packaging.",
    exceptions: "Opened, tested, or used products cannot be returned. Products older than 7 days of delivery cannot be returned.",
    damaged_defective: "Must be reported within 48 hours of delivery with photos for replacement."
  },
  cancellation: {
    rule: "Orders can only be cancelled while their status is 'Processing'. Once an order is Shipped or Out for Delivery, it cannot be cancelled (customers may refuse delivery at doorstep)."
  },
  cod: {
    limit: "Available for orders up to ₹2,500.",
    payment_modes: "Customers can pay by cash or UPI at the doorstep."
  }
};

export const SAMPLE_EVALUATOR_PROMPTS = [
  {
    category: "Order Tracking",
    icon: "📦",
    label: "Track ORD-101 (Out for Delivery)",
    prompt: "Can you tell me where my order ORD-101 is and when it will arrive?"
  },
  {
    category: "Policy Guardrails",
    icon: "🔄",
    label: "Return opened item after 20 days",
    prompt: "I bought this 20 days ago and have opened it. Can I return it?"
  },
  {
    category: "Order Cancellation",
    icon: "❌",
    label: "Cancel ORD-103 (Processing)",
    prompt: "I want to cancel my order ORD-103 for the Green Tea Face Wash."
  },
  {
    category: "Policy Enforcement",
    icon: "🚫",
    label: "Try to cancel ORD-101",
    prompt: "Please cancel my order ORD-101 right now."
  },
  {
    category: "Out of Scope",
    icon: "✈️",
    label: "Out of Scope query (Flight to Goa)",
    prompt: "Can you book me a flight to Goa for this weekend?"
  },
  {
    category: "Edge Case",
    icon: "🔍",
    label: "Invalid Order ID (ORD-999)",
    prompt: "Can you check the status of my order ORD-999?"
  },
  {
    category: "Brand Policy",
    icon: "🚚",
    label: "Shipping & COD limits",
    prompt: "What is your shipping charge, delivery time, and COD limit?"
  }
];
