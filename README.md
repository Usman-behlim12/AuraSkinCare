# 🌿 Aura Skincare — AI Voice Customer Support Specialist (Aria)

> **Datastraw Hiring Assignment:** Build an AI Voice CX Agent for a D2C Brand  
> **Brand:** Aura Skincare (Premium Organic Indian Skincare)  
> **Agent Persona:** Aria — Friendly, professional, and concise Indian customer support specialist  
> **Architecture:** React 19 (Vite) + Node.js/Express REST API + MongoDB + Gemini 1.5 Flash Function Calling + Web Speech STT/TTS

---

## 📋 Executive Overview & Actual Working System

This project is a complete, full-stack, browser-based AI Voice Customer Support Agent built specifically for **Aura Skincare**. Evaluators can click **"Start Call"**, speak naturally with their microphone, and converse in real-time with **Aria**, an AI voice agent tailored with an Indian accent, strict brand policy guardrails, live database lookup & cancellation tools, and automatic post-call structured JSON analytics.

### ⚡ What Is Currently Running Right Now (Actual Working State)
- **Frontend App (Port 5173):** Live React 19 application with interactive Voice Orb, real-time audio soundwaves, barge-in interruption handling, evaluator test order helper chips, live synchronized transcript, and brand policies drawer.
- **Backend REST API (Port 5000):** Express.js server providing brand information, product catalog endpoints, order status lookups, and order cancellation with transactional state validation.
- **Database (MongoDB):** Connected to MongoDB (`mongodb://127.0.0.1:27017/aura_skincare`), auto-seeding mock orders and products on startup, and dynamically saving cancellations in real-time.
- **Dual AI Engine:** Gemini 1.5 Flash with tool declarations (`get_order_details`, `cancel_order`) paired with a deterministic client-side simulation engine so evaluators can test 100% of the functionality immediately even with or without an API key.

---

## 🌸 About Aura Skincare (Brand & Website)

**Aura Skincare** is a modern, premium organic Indian skincare brand dedicated to simple, effective, and clean skincare crafted with thoughtfully selected botanical ingredients tailored for Indian skin types and weather conditions.

### Core Brand Values & Philosophy
- **100% Organic & Botanical:** Free from harmful parabens, sulphates, artificial fragrance, and toxins.
- **Cruelty-Free & Dermatologically Tested:** Formulated ethically and safely tested for sensitive Indian skin.
- **Nationwide Delivery:** Direct-to-Consumer fulfillment through trusted courier partners (BlueDart and Delhivery).
- **Customer First Experience:** Transparent order tracking, instant cancellations for processing orders, and prompt customer care via voice AI.

---

## 📜 Aura Skincare — Brand Policies & Guardrails

The voice agent Aria strictly adheres to the following customer policies and will politely refuse requests that breach these rules:

| Policy Area | Terms & Conditions | Voice Agent Enforcement |
| :--- | :--- | :--- |
| **🚚 Shipping & Delivery** | • **Free Delivery** on all orders above **₹499**.<br>• Orders below ₹499 have a flat **₹50 shipping fee**.<br>• Standard delivery timeline is **3–5 business days** across India. | Explains thresholds accurately; clarifies courier details (BlueDart/Delhivery) upon order lookup. |
| **🔄 Return & Refund** | • Returns accepted within **7 days of delivery**.<br>• Product **must be unopened, unused, and in original packaging**.<br>• Damaged or defective items must be reported within **48 hours of delivery** with photos for replacement.<br>• **Opened or tested products CANNOT be returned**. | If customer says: *"I bought this 20 days ago and have opened it. Can I return it?"*, Aria politely declines and explains the policy. |
| **❌ Cancellation Policy** | • Orders can be cancelled **ONLY while their status is 'Processing'**.<br>• Once an order is **'Shipped'** or **'Out for Delivery'**, it **CANNOT be cancelled**.<br>• If already dispatched, Aria instructs customer to **refuse delivery at the doorstep**. | If customer asks to cancel `ORD-103` (Processing), Aria calls `cancel_order` and cancels it. For `ORD-101` (Out for Delivery), Aria politely rejects cancellation. |
| **💵 Cash on Delivery (COD)** | • COD available for orders up to **₹2,500**.<br>• Customers can pay via **Cash or doorstep UPI** to delivery executives. | Answers COD queries instantly with payment mode options. |
| **🛡️ Out-of-Scope Queries** | • The agent handles only Aura Skincare related inquiries (orders, products, shipping, returns, cancellations). | If customer asks: *"Can you book me a flight to Goa?"*, Aria politely declines and redirects to Aura Skincare. |

---

## 🧴 Aura Skincare — Product Catalog (In Database)

The backend and database contain the complete product line for Aura Skincare:

| Product ID | Product Name | Category | Price | Key Ingredients | Description | Stock |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PROD-001** | **Vitamin C Serum (30ml)** | Serums & Treatments | **₹699** | Kakadu Plum, 15% L-Ascorbic Acid, Hyaluronic Acid, Ferulic Acid | Pure organic botanical Vitamin C serum for radiant, glowing skin and dark spot reduction. | In Stock |
| **PROD-002** | **Hydrating Sunscreen SPF 50 (50ml)** | Sun Protection | **₹499** | Zinc Oxide, Organic Aloe Vera, Niacinamide, Vitamin E | Lightweight, non-greasy matte finish sunscreen formulated for Indian climate with zero white cast. | In Stock |
| **PROD-003** | **Green Tea Face Wash + Toner Combo** | Cleansers & Toners | **₹850** | Organic Green Tea, Tea Tree Oil, Witch Hazel, Salicylic Acid | Gentle foaming cleanser and clarifying toner to unclog pores and balance natural oils. | In Stock |
| **PROD-004** | **Kumkumadi Radiance Night Facial Oil (20ml)** | Facial Oils | **₹799** | Kashmiri Saffron, Red Sandalwood, Manjistha, Almond Oil | Traditional Ayurvedic beauty elixir to rejuvenate dull skin and impart a luminous golden glow overnight. | In Stock |
| **PROD-005** | **Ceramide Barrier Repair Moisturizer (50g)** | Moisturizers | **₹599** | 5 Ceramides, Centella Asiatica (Cica), Shea Butter, Oat Extract | Intense 24-hour hydration cream to restore damaged skin barriers and calm irritation. | In Stock |

---

## 📦 Mock Orders Database (Live Testing Scenarios)

The database includes the exact test records specified in the Datastraw evaluation document:

| Order ID | Customer | Product Ordered | Value | Current Status | Courier & Tracking | Order Notes & Eligibility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ORD-101** | Priya Sharma | Vitamin C Serum (30ml) | ₹699 | **Out for Delivery** | BlueDart — `BD-982103` | Expected by 6 PM today. **Not eligible for cancellation** (customer can refuse at doorstep). |
| **ORD-102** | Rahul Verma | Hydrating Sunscreen SPF 50 | ₹499 | **Delivered** | Delhivery — `DL-441029` | Delivered 14 days ago. **Ineligible for return** (exceeds 7-day policy window). |
| **ORD-103** | Ananya Patel | Green Tea Face Wash + Toner | ₹850 | **Processing** | Pending Allocation | Ordered 3 hours ago. **Eligible for immediate cancellation**. Triggering cancellation changes status to `Cancelled` in MongoDB. |

---

## 🏗️ Architecture & Actual Working Pipeline

```
  [ Customer Speaking into Mic ]
                 │
                 ▼
     [ Web Speech API (STT: en-IN) ]
                 │
                 ├── Barge-in Trigger ──> [ window.speechSynthesis.cancel() ]
                 │
                 ▼
      [ Conversational Dispatcher ]
                 │
       ┌─────────┴────────────────────────┐
       ▼                                  ▼
[ Gemini 1.5 Flash API ]      [ Built-In Smart Fallback ]
(Tool & Function Calling)      (Zero-Key Rule Engine)
       │                                  │
       └─────────┬────────────────────────┘
                 │
                 ▼
  [ Tool Execution Layer (REST / DB) ]
   ├── get_order_details(order_id)
   └── cancel_order(order_id, reason)
                 │
                 ▼
       [ MongoDB Database ]
    (Live Updates & Status Persistence)
                 │
                 ▼
 [ Natural Indian Spoken Response (TTS: en-IN) ]
                 │
                 ▼
   [ Customer Hears Voice via Speakers ]
                 │
                 ▼ (On "End Call")
 [ Post-Call Analytics & JSON Summary Generator ]
```

### 1. In-Browser Voice Pipeline
- **Continuous Speech Recognition (STT):** Configured for Indian English (`en-IN`), automatically transcribing customer speech.
- **Natural Voice Synthesis (TTS):** Prioritizes Indian English voices (`en-IN`, `hi-IN` voices like Microsoft Heera, Neerja, Google Indian English) with conversational pitch and rate.
- **Barge-in / Interruption Handling:** When the customer starts speaking while Aria is talking, speech recognition triggers an interrupt that immediately terminates speech synthesis (`window.speechSynthesis.cancel()`) and shifts status seamlessly back to `Listening`.

### 2. Autonomous Tool & Function Calling
- **`get_order_details(order_id)`**: Extracts the order ID from spoken words or text, queries the live order database, and passes full tracking info to the LLM to formulate a natural spoken response.
- **`cancel_order(order_id, reason)`**: Validates if the order status is `Processing`. If valid, it marks the order `Cancelled` in both the UI state and backend MongoDB database. If invalid (e.g. `ORD-101`), it articulates the refusal reason per policy.

### 3. Backend & MongoDB Integration
- **Server:** Node.js Express server listening on `http://localhost:5000`.
- **Database:** MongoDB connection via Mongoose with auto-seed logic on startup.
- **REST Endpoints:**
  - `GET /api/health` — Backend and MongoDB connectivity check.
  - `GET /api/brand` — Brand details and policy dictionary.
  - `GET /api/products` — Complete 5-product catalog.
  - `GET /api/orders` — All order records.
  - `GET /api/orders/:order_id` — Single order lookup.
  - `POST /api/orders/:order_id/cancel` — Validated order cancellation endpoint.
  - `POST /api/orders/reset` — Re-seed orders and products to initial state.

---

## 📊 Post-Call Summary (Section 2.D Output)

When an evaluator clicks **"End Call"**, the application automatically generates:
1. **Full Chronological Transcript:** Detailed dialogue history between Customer and Aria with timestamps and tool call badges.
2. **Structured Call Outcome JSON:** Formatted according to Section 2.D of the assessment specification:

```json
{
  "customer_intent": "ORDER_TRACKING",
  "order_id": "ORD-101",
  "resolution_status": "RESOLVED",
  "call_summary": "Customer asked about the delivery status of ORD-101. The order is out for delivery via BlueDart (BD-982103) and expected by 6 PM today."
}
```

---

## 💡 Tell Us How You Think (Section 9 Answers)

### 1. Why did you choose your particular architecture and technology stack?
- **Web Speech API + React 19 + Node.js + Gemini 1.5 Flash:**
  1. **Zero-Latency Client Voice Pipeline:** Using the browser's native Web Speech API avoids streaming heavy uncompressed audio over WebSockets to an intermediary server. Audio recognition and synthesis happen directly in the browser with near-zero initial connection delay.
  2. **Native Function Calling:** Gemini 1.5 Flash provides deterministic tool calling for `get_order_details` and `cancel_order`, eliminating regex parsing errors and hallucinations.
  3. **Dual-Layer Reliability:** We designed the system with both a live MongoDB backend and an in-memory client fallback so evaluators can test every single feature immediately even before setting up API keys or local database services.

### 2. What was the most difficult part of the assignment, and how did you solve it?
- **Conversational Turn-Taking and Barge-in Interruption:**
  Handling smooth turn-taking in browser environments is notoriously tricky because the microphone can easily capture the agent's own speaker output (echo feedback loop) or fail to interrupt the speech synthesizer when the user starts speaking.
  - *Solution:* We built an event-driven speech coordinator. As soon as Aria begins speaking, the system sets an internal lock. When the customer starts talking, the `onspeechstart` event fires instantly, which calls `window.speechSynthesis.cancel()`, clears pending speech utterances, and returns the agent state to `Listening`. We also provided a visible manual "Interrupt & Speak" button for noisy microphone environments.

### 3. If you had one more week to work on this, what would you improve first and why?
1. **Direct Bidirectional Audio Streaming via Gemini 2.0 Multimodal Live API:**
   - Upgrade from modular STT → LLM → TTS to raw PCM audio streaming over WebSockets. This reduces latency to under 300ms and enables natural emotional voice inflection (empathy, warmth, polite firmness).
2. **WebAssembly Voice Activity Detection (VAD):**
   - Incorporate Silero VAD via WebAssembly to distinguish human speech from ambient office noise, breathing, or keyboard clicks.
3. **Automated WhatsApp / SMS Notification Integration:**
   - Add a tool to send live tracking links directly to the customer's phone via SMS or WhatsApp upon completing an order inquiry.

### 4. Imagine this agent is handling 1,000 customer conversations a day. What do you think would need to change or improve?
1. **Secure Backend Gateway & Rate Limiting:**
   - Migrate LLM calls exclusively to a distributed backend (e.g., Fastify / Go microservice on AWS ECS or Google Cloud Run) with Redis rate limiting, API token quotas, and request deduplication.
2. **Distributed Transactional Database Locking:**
   - Replace in-memory order manipulation with ACID-compliant transactions in PostgreSQL or MongoDB with idempotency keys to prevent race conditions during simultaneous cancellation requests.
3. **Omnichannel CRM Integration:**
   - Automatically stream the structured post-call JSON summary directly into Zendesk, Freshdesk, or Salesforce CRM so human agents can take over seamlessly if a customer escalates.
4. **Telemetry & Observability:**
   - Integrate OpenTelemetry, Langfuse, or Helicone to track latency distributions, cost per conversation, tool failure rates, and guardrail violation rates.

---

## 🛠️ Step-by-Step Setup & Running Locally

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **MongoDB:** (Optional) running on `mongodb://127.0.0.1:27017`

---

### Step 1: Start the Backend Server

```bash
cd backend
npm install
npm run dev
```
*The backend server will start on `http://localhost:5000` and automatically connect to MongoDB and seed the orders and products collections.*

---

### Step 2: Start the Frontend Application

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Open [http://localhost:5173/](http://localhost:5173/) in Google Chrome or Microsoft Edge.*

---

### Step 3: Configure Environment Variables

In `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aura_skincare
GEMINI_API_KEY=your_gemini_api_key_here
```

In `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
*(Note: The Gemini API key is securely stored only on the backend in `backend/.env` and never exposed to the client or version control. An intelligent in-memory simulator is also built-in as a fallback).*

---

## 🧪 Evaluator Testing Matrix

Evaluators can click any of the quick-prompt chips directly on the UI or speak them aloud:

| # | Test Scenario | Spoken Prompt | Expected AI Agent Response |
| :---: | :--- | :--- | :--- |
| **1** | **Order Tracking** | *"Can you tell me where my order ORD-101 is?"* | Calls `get_order_details("ORD-101")` and reports that Priya's Vitamin C Serum is **Out for Delivery** via BlueDart, expected by 6 PM today. |
| **2** | **Return Guardrail** | *"I bought this 20 days ago and have opened it. Can I return it?"* | Politely refuses return; explains returns are only accepted within 7 days for unopened products in original packaging. |
| **3** | **Order Cancellation** | *"I want to cancel my order ORD-103."* | Calls `cancel_order("ORD-103")`, updates status from **Processing to Cancelled** live in the database and UI. |
| **4** | **Ineligible Cancellation** | *"Please cancel my order ORD-101 right now."* | Refuses cancellation because order is **Out for Delivery**; instructs customer to refuse delivery at doorstep. |
| **5** | **Out-of-Scope Query** | *"Can you book me a flight to Goa for this weekend?"* | Politely declines; clarifies role is strictly Aura Skincare customer support. |
| **6** | **Edge Case / Invalid ID** | *"Can you check the status of order ORD-999?"* | States that order ORD-999 could not be found and asks to verify the order number. |
| **7** | **Brand Policy Query** | *"What is your shipping charge, delivery time, and COD limit?"* | Explains free shipping above ₹499 (₹50 below), 3–5 business days, and COD up to ₹2,500 via cash or UPI. |
| **8** | **Post-Call Summary** | Click **"End Call"** button | Immediately displays chronological transcript and formatted JSON summary modal. |

---

## 📁 Repository Structure

```
aicustomer/
├── backend/
│   ├── models/
│   │   ├── Order.js           # Mongoose schema for customer orders
│   │   └── Product.js         # Mongoose schema for botanical skincare catalog
│   ├── mongo_queries.js       # Query utility helpers
│   ├── package.json           # Backend dependencies (Express, Mongoose, Cors)
│   ├── seed.js                # Auto-seeding script for initial orders & products
│   └── server.js              # Express REST API endpoints & MongoDB connection
│
├── frontend/
│   ├── src/
│   │   ├── assets/            # Static brand assets
│   │   ├── components/
│   │   │   ├── ApiKeyModal.jsx          # Gemini API Key manager
│   │   │   ├── BrandPoliciesDrawer.jsx  # Side drawer with full brand policies
│   │   │   ├── CallTranscript.jsx       # Real-time chat dialogue with audio replay
│   │   │   ├── Header.jsx               # Brand navigation bar & status badges
│   │   │   ├── OrdersHelperCard.jsx     # Evaluator test order cards & prompt chips
│   │   │   ├── PostCallSummaryModal.jsx # Section 2.D post-call structured JSON
│   │   │   └── VoiceAgentOrb.jsx        # Animated voice orb with soundwave frequency
│   │   ├── data/
│   │   │   └── mockOrders.js            # Initial order database & brand policies
│   │   ├── services/
│   │   │   ├── apiService.js            # Live backend & MongoDB API integration
│   │   │   ├── geminiService.js         # Gemini 1.5 Flash tool declarations & simulator
│   │   │   └── speechService.js         # Web Speech STT, TTS & barge-in coordinator
│   │   ├── App.css                      # Modern dark/light glassmorphism styling
│   │   ├── App.jsx                      # Main application orchestrator
│   │   └── main.jsx                     # Vite entry point
│   ├── package.json                     # Frontend dependencies (React 19, Lucide, Vite)
│   └── vite.config.js                   # Vite bundler configuration
│
├── .env.example                         # Environment configuration template
├── .gitignore                           # Git ignore rules
└── README.md                            # Comprehensive project documentation
```

---

## 📬 Datastraw Submission Checklist (Section 10 & 11)

When submitting the assignment to `ozair.shaikh@datastraw.in` and `aryan.jaiswal@datastraw.in` (CC `talent@datastraw.in`):

- [x] **1. Public Application URL:** Live deployment link on Vercel/Netlify.
- [x] **2. GitHub Repository:** Complete source code, clean history, `.env.example`, and this `README.md`.
- [x] **3. 3–5 Minute Demo Video:**
  - [x] Voice agent speaking & natural turn-taking.
  - [x] At least one order lookup (`ORD-101` or `ORD-103`).
  - [x] One policy-related conversation (7-day unopened return policy).
  - [x] Post-call transcript and structured JSON summary modal.
  - [x] Brief architecture walkthrough.
- [x] **4. Short Approach Note:** *(See below)*
- [x] **5. LinkedIn Profile:** Include accessible link in submission email.

### 📝 Short Approach Note (2–3 Sentences)
> *We developed an in-browser, low-latency AI Voice Customer Support Specialist (Aria) for Aura Skincare utilizing the native Web Speech API (`en-IN`) for seamless speech recognition and voice synthesis, combined with Google Gemini 1.5 Flash for autonomous function calling (`get_order_details`, `cancel_order`). The architecture features client-side barge-in interruption handling, a live MongoDB backend with real-time order state synchronization, strict brand policy guardrails, and automated post-call structured JSON summarization.*

---

## 📄 License
MIT © Aura Skincare / Candidate Assessment
