# 🌿 Aura Skincare — AI Voice Customer Support Specialist (Aria)

> **Datastraw Hiring Assignment:** Build an AI Voice CX Agent for a D2C Brand  
> **Brand:** Aura Skincare (Premium Organic Indian Skincare)  
> **Agent Persona:** Aria — Friendly, professional, and concise Indian customer support specialist  

---

## 🚀 Live Demo & Repository
- **Application URL:** [Deploy to Vercel/Netlify with 1 click or run locally]
- **GitHub Repository:** [Your GitHub Link Here]
- **Short Approach Note:** *We built an in-browser, low-latency AI voice customer support specialist for Aura Skincare utilizing the Web Speech API for continuous speech recognition (`en-IN`) and speech synthesis, paired with Gemini 1.5 Flash for native function calling and brand policy enforcement. The architecture guarantees zero-pause conversational responsiveness with barge-in interruption handling, dynamic mock order state tracking, and automated post-call structured JSON summarization.*

---

## 🌟 Key Features

1. **Natural Voice-to-Voice Pipeline in the Browser:**
   - **Speech-to-Text (STT):** Real-time continuous speech recognition via Web Speech API tuned for Indian English accents (`en-IN`).
   - **Text-to-Speech (TTS):** Natural Indian English voice prioritization (`en-IN` / `hi-IN` voices like Microsoft Heera, Neerja, Google voices) with natural pitch and cadence.
   - **Barge-in / Interruption Handling:** When the customer speaks or clicks while Aria is speaking, audio synthesis cancels instantly (`window.speechSynthesis.cancel()`), gracefully transitioning to Listening.

2. **Autonomous Tool & Function Calling:**
   - Real-time invocation of `get_order_details(order_id)` when customers mention an order ID (`ORD-101`, `ORD-102`, `ORD-103`).
   - `cancel_order(order_id, reason)` tool that validates eligibility against the live policy (only cancellable if in `Processing` status) and dynamically updates database state on the UI.

3. **Strict Brand Policies & Guardrails:**
   - **Return & Refund Policy:** Strictly enforces 7-day window for unopened, unused items. Politely refuses returns for opened products or orders delivered >7 days ago (e.g. `ORD-102` delivered 14 days ago).
   - **Cancellation Policy:** Enforces that orders in `Shipped` or `Out for Delivery` cannot be cancelled, offering doorstep refusal advice instead.
   - **Shipping & COD Policies:** Automatically articulates ₹499 free delivery threshold, ₹50 standard shipping fee, and ₹2,500 Cash on Delivery limits.
   - **Out-of-Scope Guardrails:** Gracefully redirects unrelated inquiries (e.g., flight bookings, weather) back to Aura Skincare.
   - **Graceful Degradation:** Handles mumbled audio or invalid order IDs (`ORD-999`) with polite clarification requests rather than hallucinating.

4. **Post-Call Summary & Structured JSON Outcome:**
   - Automatically triggered when the call concludes.
   - Outputs chronological transcript with timestamps and tool call badges.
   - Outputs structured JSON conforming strictly to Section 2.D specifications:
     ```json
     {
       "customer_intent": "ORDER_TRACKING",
       "order_id": "ORD-101",
       "resolution_status": "RESOLVED",
       "call_summary": "Customer asked about the delivery status of ORD-101. The order is out for delivery and expected by 6 PM today."
     }
     ```

5. **Evaluator Testing Interface:**
   - Visual mock database panel displaying `ORD-101`, `ORD-102`, and `ORD-103` details.
   - One-click prompt chips for rapid evaluator testing of all edge cases and policies.
   - Zero-friction testing: includes an intelligent built-in simulation fallback so evaluators can test 100% of the UI, speech, tools, and summaries even before inputting an API key.

---

## 🏗️ System Architecture

```
[ Customer Microphone ]
          │
          ▼
 [ Web Speech API (STT: en-IN) ]
          │
          ▼
 [ Realtime Input Stream & Barge-in Controller ]
          │
          ├── User starts speaking while Aria speaks ──> [ window.speechSynthesis.cancel() ]
          │
          ▼
 [ Gemini 1.5 Flash Reasoning Engine ] ◄──► [ Function Calling Tool Registry ]
   - System Guardrails & Policies              - get_order_details(order_id)
   - Indian Concierge Persona                  - cancel_order(order_id)
          │                                              │
          ▼                                              ▼
 [ Generated Spoken Response ]                 [ Dynamic Mock Order DB ]
          │
          ▼
 [ Web Speech Synthesis (TTS: en-IN) ]
          │
          ▼
[ Customer Speaker / Headphones ]
          │
          ▼ (On Call End)
 [ Post-Call Analytics Engine ] ──> Structured JSON Summary (Section 2.D)
```

---

## 💡 Tell Us How You Think (Section 9 Answers)

### 1. Why did you choose your particular architecture and technology stack?
- **Client-Side Web Speech API + Gemini Function Calling:**
  We selected a modular, browser-native voice pipeline (Web Speech Recognition + Speech Synthesis) combined with Google Gemini's native tool calling capabilities for three primary reasons:
  1. **Zero Setup & Latency:** Browser-native speech recognition eliminates the latency and operational cost of streaming raw PCM audio over WebSockets to a dedicated speech server. Voice processing happens on-device with zero roundtrip for speech synthesis.
  2. **Deterministic Tool Execution:** Gemini's native function calling guarantees structured JSON outputs for tools (`get_order_details`, `cancel_order`), preventing hallucinations and ensuring exact order data is retrieved before generating a spoken response.
  3. **High Reliability & Accessibility:** The architecture includes a client-side simulation engine fallback so that evaluators in restricted network environments or without pre-configured API keys can immediately experience the complete conversational flow without friction.

### 2. What was the most difficult part of the assignment, and how did you solve it?
- **Conversational Turn-Taking and Barge-in (Interruption Handling):**
  In human conversations, interruptions and acknowledgments happen fluidly. In browser voice agents, standard speech recognition often picks up the agent's own speech playback (echo loop), or locks the microphone until speech synthesis completely finishes.
  - *Solution:* We implemented an event-driven turn-taking coordinator. When the agent speaks, `status` switches to `Speaking`. If the speech recognition's `onspeechstart` triggers during this window (indicating the customer began talking), the service immediately fires `window.speechSynthesis.cancel()` (barge-in), clears pending utterances, and transfers control back to `Listening`. We also provided a dedicated manual "Interrupt & Speak" button for noisy microphone environments.

### 3. If you had one more week to work on this, what would you improve first and why?
1. **Direct WebSocket Audio Streaming with Gemini 2.0 Multimodal Live API:**
   - Migrate from turn-based STT → LLM → TTS to bidirectional audio streaming over WebSockets. This achieves sub-300ms end-to-end voice latency and supports true emotional voice modulation (warmth, empathy, urgency).
2. **Acoustic Noise Suppression & Voice Activity Detection (VAD):**
   - Integrate WebAssembly-based Silero VAD or RNNoise to filter out background office noise, typing sounds, and accidental microphone breathing.
3. **Multi-turn Contextual Sentiment Tracking:**
   - Add a live customer sentiment meter (e.g. Frustrated → Satisfied) that dynamically adapts Aria's tone and escalates to a human manager if sentiment drops below a safety threshold.

### 4. Imagine this agent is handling 1,000 customer conversations a day. What do you think would need to change or improve?
1. **Backend Proxy & Secrets Management:**
   - Shift LLM orchestration to a secure backend microservice (Node.js/FastAPI on Google Cloud Run or AWS ECS) with Redis caching for repeated policy inquiries. Never expose API keys in browser environments.
2. **Rate Limiting & Queue Orchestration:**
   - Implement concurrency limits, circuit breakers, and rate limiters with fallback LLM providers (e.g., Gemini Flash with fallback to Claude 3.5 Haiku) to guarantee 99.99% uptime during marketing flash sales.
3. **Database Integration & Distributed Locking:**
   - Replace the mock in-memory database with transactional PostgreSQL / MongoDB database with idempotency keys and row-level locking for order cancellation to avoid race conditions.
4. **CRM & Ticketing Webhooks:**
   - Automatically push the post-call structured JSON summary into Zendesk, Freshdesk, or Salesforce CRM so human support agents can review call outcomes immediately if escalated.
5. **Observability & Guardrail Monitoring:**
   - Integrate OpenTelemetry and Langfuse/Helicone for tracking latency distributions, token usage, tool call error rates, and automated hallucination/policy-violation audits.

---

## 🛠️ Setup & Running Locally

### Prerequisites
- Node.js 18+ installed

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd aicustomer/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API Key (Optional)
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Add your free Gemini API key:
```env
VITE_GEMINI_API_KEY=AIzaSy...
```
*(Note: You can also enter or change the API key directly in the UI via the "Enter Gemini API Key" button in the header, or test immediately using the built-in simulation mode).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in Google Chrome or Microsoft Edge.

---

## 🧪 Testing Checklist for Evaluators

| Scenario | Sample Prompt | Expected Behavior |
| :--- | :--- | :--- |
| **Order Tracking** | *"Can you tell me where my order ORD-101 is?"* | Calls `get_order_details("ORD-101")` and reports that it is Out for Delivery with BlueDart, expected by 6 PM today. |
| **Policy Guardrail (Return)** | *"I bought this 20 days ago and have opened it. Can I return it?"* | Explains that returns are only accepted within 7 days for unopened products, politely refusing the return. |
| **Order Cancellation** | *"I want to cancel my order ORD-103"* | Calls `cancel_order("ORD-103")`, updates status from Processing to Cancelled in the database. |
| **Ineligible Cancellation** | *"Please cancel my order ORD-101"* | Refuses cancellation because order is Out for Delivery; advises customer to refuse delivery at doorstep. |
| **Out-of-Scope Query** | *"Can you book me a flight to Goa?"* | Politely declines, clarifying scope is strictly Aura Skincare inquiries. |
| **Edge Case (Invalid Order)** | *"Can you check order ORD-999?"* | Informs customer that the order wasn't found and asks to verify. |
| **Post-Call Summary** | Click **"End Call"** | Generates chronological transcript and structured JSON outcome. |

---

## 📄 License
MIT © Aura Skincare / Candidate Assessment
