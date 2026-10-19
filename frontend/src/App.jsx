import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import VoiceAgentOrb from './components/VoiceAgentOrb';
import OrdersHelperCard from './components/OrdersHelperCard';
import CallTranscript from './components/CallTranscript';
import PostCallSummaryModal from './components/PostCallSummaryModal';
import BrandPoliciesDrawer from './components/BrandPoliciesDrawer';
import ApiKeyModal from './components/ApiKeyModal';
import { INITIAL_ORDER_DATABASE } from './data/mockOrders';
import {
  getEffectiveApiKey,
  createGeminiSession,
  simulateAriaResponse,
  generateCallSummary,
  parseOrderId
} from './services/geminiService';
import { speechService } from './services/speechService';
import {
  checkBackendStatus,
  fetchLiveOrders,
  cancelLiveOrder,
  checkBackendAiStatus,
  sendAiChat,
  generateAiSummary
} from './services/apiService';
import './App.css';

export default function App() {
  // Call & Agent State
  const [status, setStatus] = useState('Idle'); // 'Idle' | 'Listening' | 'Thinking' | 'Speaking'
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [activeToolExecution, setActiveToolExecution] = useState(null);
  const [isMongoConnected, setIsMongoConnected] = useState(false);
  const [isBackendAiConfigured, setIsBackendAiConfigured] = useState(false);

  // Database State (dynamically fetched from MongoDB if available, with mock fallback)
  const [orderDatabase, setOrderDatabase] = useState(INITIAL_ORDER_DATABASE);

  // Modals & Configuration
  const [apiKey, setApiKey] = useState(() => getEffectiveApiKey());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [postCallSummary, setPostCallSummary] = useState(null);

  // Refs
  const chatSessionRef = useRef(null);
  const isCallActiveRef = useRef(isCallActive);
  const orderDatabaseRef = useRef(orderDatabase);

  // Keep refs in sync with state
  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  useEffect(() => {
    orderDatabaseRef.current = orderDatabase;
  }, [orderDatabase]);

  // Initialize or re-initialize Gemini chat session when API key changes
  const initChatSession = useCallback(() => {
    if (apiKey) {
      try {
        chatSessionRef.current = createGeminiSession(apiKey);
      } catch (err) {
        console.warn("Failed to initialize Gemini chat session:", err);
        chatSessionRef.current = null;
      }
    } else {
      chatSessionRef.current = null;
    }
  }, [apiKey]);

  useEffect(() => {
    initChatSession();
  }, [initChatSession]);

  // Connect to MongoDB, fetch live orders and check backend AI status on startup
  useEffect(() => {
    async function loadMongoData() {
      try {
        const [statusRes, aiStatusRes] = await Promise.all([
          checkBackendStatus(),
          checkBackendAiStatus()
        ]);
        setIsMongoConnected(statusRes.connected && statusRes.mongo);
        setIsBackendAiConfigured(aiStatusRes.configured);
        if (statusRes.connected) {
          const res = await fetchLiveOrders();
          if (res.live && res.orders && Object.keys(res.orders).length > 0) {
            setOrderDatabase(res.orders);
          }
        }
      } catch (err) {
        console.warn("Backend startup check:", err);
      }
    }
    loadMongoData();
  }, []);

  // Configure Speech Service Callbacks
  useEffect(() => {
    speechService.onInterimResult = (text) => {
      if (isCallActiveRef.current) {
        setInterimTranscript(text);
      }
    };

    speechService.onFinalResult = (text) => {
      if (isCallActiveRef.current && text.trim()) {
        setInterimTranscript('');
        handleProcessCustomerInput(text.trim());
      }
    };

    speechService.onSpeechStart = () => {
      // Barge-in: Customer started speaking while Aria was speaking!
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        speechService.stopSpeaking();
        setStatus('Listening');
      }
    };

    speechService.onError = (err) => {
      console.warn("Speech recognition notice:", err);
    };

    return () => {
      speechService.stopListening();
      speechService.stopSpeaking();
    };
  }, []);

  // Voice output helper
  const speakAgentResponse = (text) => {
    setStatus('Speaking');
    speechService.speak(text, {
      onStart: () => {
        setStatus('Speaking');
      },
      onEnd: () => {
        if (isCallActiveRef.current) {
          setStatus('Listening');
          speechService.startListening();
        } else {
          setStatus('Idle');
        }
      },
      onError: () => {
        if (isCallActiveRef.current) {
          setStatus('Listening');
          speechService.startListening();
        } else {
          setStatus('Idle');
        }
      }
    });
  };

  // Main input processor: Handles both voice STT and text inputs
  const handleProcessCustomerInput = async (inputText) => {
    speechService.stopListening();
    setStatus('Thinking');
    setActiveToolExecution(null);

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append Customer message
    setTranscript(prev => [...prev, {
      role: 'Customer',
      text: inputText,
      timestamp
    }]);

    let agentReply = '';
    let executedTool = null;

    // 1. Try secure Backend AI call (using backend process.env.GEMINI_API_KEY)
    let backendChatSuccess = false;
    try {
      const aiResponse = await sendAiChat({
        message: inputText,
        history: transcript,
        orders: orderDatabaseRef.current,
        apiKey
      });

      if (aiResponse && aiResponse.success && aiResponse.reply) {
        agentReply = aiResponse.reply;
        executedTool = aiResponse.executedTool;
        if (executedTool) {
          setActiveToolExecution(executedTool.name);
        }
        if (aiResponse.updatedOrder) {
          const u = aiResponse.updatedOrder;
          setOrderDatabase(prev => ({
            ...prev,
            [u.order_id]: {
              ...prev[u.order_id],
              status: u.status,
              notes: u.notes,
              is_cancellable: u.is_cancellable
            }
          }));
        }
        backendChatSuccess = true;
      }
    } catch (err) {
      console.warn("Backend AI chat attempt notice:", err.message);
    }

    // 2. Fallback to intelligent local simulation if backend unavailable or no response
    if (!backendChatSuccess) {
      const sim = simulateAriaResponse(inputText, orderDatabaseRef.current, setOrderDatabase);
      agentReply = sim.reply;
      executedTool = sim.toolExecuted;
      if (executedTool) {
        setActiveToolExecution(executedTool.name);
      }
    }

    setActiveToolExecution(null);

    // Sync live cancellation with MongoDB database if cancel_order tool was triggered
    if (executedTool && executedTool.name === 'cancel_order' && executedTool.args?.order_id) {
      cancelLiveOrder(executedTool.args.order_id, 'Cancelled via Voice CX').catch(err => {
        console.warn("Live MongoDB cancellation sync notice:", err);
      });
    }

    // Append Aria message
    setTranscript(prev => [...prev, {
      role: 'Aria',
      text: agentReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolExecuted: executedTool
    }]);

    // Speak reply
    speakAgentResponse(agentReply);
  };

  // Start Call Handler
  const handleStartCall = () => {
    setIsCallActive(true);
    initChatSession();

    const greeting = "hello! Welcome to Aura Skincare. I am Aria, your customer support specialist. How may I assist you with your orders or brand questions today?";

    setTranscript([
      {
        role: 'Aria',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    speakAgentResponse(greeting);
  };

  // End Call Handler
  const handleEndCall = async () => {
    setIsCallActive(false);
    speechService.stopListening();
    speechService.stopSpeaking();
    setStatus('Idle');
    setActiveToolExecution(null);
    setInterimTranscript('');

    // Generate Post-Call Structured Summary (Section 2.D)
    if (transcript.length > 0) {
      let summary = null;
      try {
        summary = await generateAiSummary({
          transcript,
          apiKey
        });
      } catch (err) {
        console.warn('Backend AI summary notice:', err);
      }

      if (!summary) {
        summary = await generateCallSummary({
          transcript,
          apiKey
        });
      }

      setPostCallSummary(summary);
      setIsSummaryModalOpen(true);
    }
  };

  // Interrupt / Barge-in Handler
  const handleInterrupt = () => {
    speechService.stopSpeaking();
    if (isCallActive) {
      setStatus('Listening');
      speechService.startListening();
    }
  };

  // Replay speech for a message
  const handleSpeakAgain = (text) => {
    speechService.speak(text);
  };

  // Evaluator Quick Prompt Click
  const handleSelectPrompt = (promptText) => {
    if (!isCallActive) {
      setIsCallActive(true);
      initChatSession();
    }
    handleProcessCustomerInput(promptText);
  };

  // API Key Save
  const handleSaveApiKey = (newKey) => {
    if (newKey) {
      localStorage.setItem('aura_gemini_api_key', newKey);
      setApiKey(newKey);
    } else {
      localStorage.removeItem('aura_gemini_api_key');
      setApiKey(null);
    }
  };

  return (
    <div className="app-container">
      {/* Brand Header */}
      <Header
        hasApiKey={isBackendAiConfigured || !!apiKey}
        isMongoConnected={isMongoConnected}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenPoliciesModal={() => setIsPoliciesOpen(true)}
      />

      {/* Main Layout */}
      <main className="main-content-layout">
        {/* Voice Agent Hero Orb Section */}
        <VoiceAgentOrb
          status={status}
          isCallActive={isCallActive}
          onStartCall={handleStartCall}
          onEndCall={handleEndCall}
          onInterrupt={handleInterrupt}
          interimTranscript={interimTranscript}
          activeToolExecution={activeToolExecution}
        />

        {/* Dashboard: Left (Orders Helper Panel) | Right (Live Call Transcript) */}
        <div className="two-col-dashboard">
          <OrdersHelperCard
            orderDatabase={orderDatabase}
            onSelectPrompt={handleSelectPrompt}
            isCallActive={isCallActive}
          />

          <CallTranscript
            transcript={transcript}
            onSendMessage={handleProcessCustomerInput}
            isCallActive={isCallActive}
            onSpeakAgain={handleSpeakAgain}
            status={status}
          />
        </div>
      </main>

      {/* Post-Call Summary Modal (Section 2.D) */}
      <PostCallSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summaryData={postCallSummary}
        transcript={transcript}
      />

      {/* Brand Policies Drawer (Section 3) */}
      <BrandPoliciesDrawer
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />
    </div>
  );
}