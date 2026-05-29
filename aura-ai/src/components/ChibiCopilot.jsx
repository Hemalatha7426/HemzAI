import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Cpu, Award, Zap, HelpCircle, Settings, Eye, EyeOff } from 'lucide-react';

const CHIBI_ASSISTANT = {
  name: "Hemz AI Assistant",
  title: "HEMZ AI Copilot",
  avatar: "/images/chibi_reading.png",
  welcome: "Hello! I am your Hemz AI Assistant. I can help answer doubts about the HEMZ AI application (such as the resume scanner, voice recording, DistilBERT sentiment scoring, and privacy policy) and help with your coding, framework, or architectural questions. Ask me anything!",
  color: "var(--yellow-neon)",
  glow: "rgba(245, 158, 11, 0.15)",
  tip: "Break down complex coding problems step-by-step, and always explain the direct business value and user scale of your optimizations!"
};

const BOT_KNOWLEDGE = {
  motivation: [
    "🌟 **Limited Edition Reminder**:\nNever forget that you are a limited edition—there is absolutely no one else with your exact combination of skills, grit, and perspective. The engineering hurdles you face today are just forging the unique technical authority that will define your career. Stay resilient, stay focused, and keep coding!",
    "🌟 **Acknowledge the Struggle**:\nBe incredibly proud of yourself. Only you truly know the silent hours of debugging, reading documentations, and striving that you've put in. Every single line of code you optimize is compounding into career mastery. Trust the process!",
    "🌟 **Proactive Creation**:\nDon't wait for the perfect opportunities to find you. Go out and create them! Every mock interview, refactored endpoint, and structured architectural note is building the bridge to your target engineering role.",
    "🌟 **The Joy of Crafting**:\nA happy and curious mind naturally attracts professional success. Let your coding journey be full of curiosity, wonder, and the deep, satisfying joy of creating things from scratch. Keep your eyes bright!"
  ],
  system: [
    "🚀 **Scalable Notification Service Architecture**:\n\n1.  **Ingress & Gateway**: REST API Gateways receive request payloads, perform fast JWT validation, and push to a message broker.\n2.  **Broker Decoupling**: Use **Apache Kafka** or **RabbitMQ** to queue alerts, preventing database write spikes.\n3.  **Deduplication & Cache**: Implement **Redis** key-value caches to deduplicate redundant pushes within 5-minute slots.\n4.  **Persistent Registry**: Archive all notification transaction states in a fast, flexible **MongoDB** storage cluster for historic analytical tracking.",
    "🚀 **MongoDB Database Scaling Strategy**:\n\n*   **Avoid Array Overgrowth**: Store references in a one-to-many relationship instead of embedding infinite arrays in single documents.\n*   **Compound Indexing**: Align indexes with the exact query shapes. Use execution plans (`explain()`) to confirm index utilization.\n*   **Write Concerns**: Balance safety and speed by matching replication thresholds (`w: majority`) with proper journaling parameters.",
    "🚀 **Modern Web API Security Protocol**:\n\n*   **CORS Safeguards**: Explicitly whitelist trusted origin domains instead of leaving configurations wide open (`*`).\n*   **Rate-Limiting**: Enforce request throttles at your API Gateway (e.g., maximum 60 requests per minute per IP) to prevent DDoS bottlenecks.\n*   **Token Expiry**: Use short-lived JWT access tokens backed by securely encrypted HTTP-only refresh tokens stored in database sessions."
  ],
  drill: [
    "💡 **STAR Behavioral Challenge**:\n*'Tell me about a time you had to optimize a severely bottlenecked API endpoint.'*\n\n*   **Your Strategy**: Allocate 20% to Situation (the latency metrics), 20% to Task (your goal), 40% to Action (explain the indices, SQL joins, or caches you fixed), and 20% to the quantified Result (e.g. *'latencies dropped from 4.2s to 120ms'*).",
    "💡 **Spring Boot Technical Drill**:\n*How do you handle transactional consistency across microservices in Spring Boot?*\n\n*   **Answer Key**: Explain the **Saga Pattern** (Choreography vs Orchestration) and how to handle distributed rollbacks using compensating transactions or transactional outboxes.",
    "💡 **React Performance Drill**:\n*Explain how React's Fiber engine schedules state updates under concurrent rendering modes.*\n\n*   **Answer Key**: Discuss prioritized lanes, selective hydration in Server-Side Rendering (SSR), and how the reconciler avoids blocking the browser's paint cycles."
  ],
  star: [
    "📊 **The Master STAR Blueprint**:\n\n*   **[S] Situation**: Describe the production scale or framework bottleneck. (*'We had a Spring Boot monolithic service serving 10k concurrent clients...' *)\n*   **[T] Task**: Define your specific mission. (*'My goal was to reduce DB join latencies by at least 60%.' *)\n*   **[A] Action**: Detail your exact steps. Avoid saying 'we'; say 'I'. Reference indexes, SQL caching patterns, and code optimizations.\n*   **[R] Result**: Provide quantified telemetry metrics! (*'...achieving a 68% latency reduction and saving $4k monthly.'*)"
  ]
};

export default function ChibiCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      sender: 'bot',
      text: CHIBI_ASSISTANT.welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mentor: CHIBI_ASSISTANT
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Connection Settings States
  const [showSettings, setShowSettings] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState(() => localStorage.getItem("aura_selected_engine") || "fallback");
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem("aura_openai_key") || "");
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("aura_gemini_key") || "");
  const [showKeys, setShowKeys] = useState(false);

  // Save Settings to LocalStorage
  useEffect(() => {
    localStorage.setItem("aura_selected_engine", selectedEngine);
  }, [selectedEngine]);

  useEffect(() => {
    localStorage.setItem("aura_openai_key", openaiKey);
  }, [openaiKey]);

  useEffect(() => {
    localStorage.setItem("aura_gemini_key", geminiKey);
  }, [geminiKey]);



  // Auto-scroll chats
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    
    setIsTyping(true);

    let reply = "";
    const systemPrompt = `You are ${CHIBI_ASSISTANT.name}, a highly intelligent ${CHIBI_ASSISTANT.title} and system architecture/career coach inside the Hemz AI mock interview platform. 
Hemz AI is a premium SaaS dark-themed mock interview trainer where users upload their resume, configure interview tracks (Technical, HR, Stress, Scenario), practice answering questions using voice-to-text, and review their diagnostic performance reports with client-side DistilBERT ML sentiment classifiers.
Your tone is professional, extremely supportive, motivational, and technical. Keep your responses structured with markdown bolding, clear lists, and brief code snippets if asked. Do not mention that you are an AI model; stay in character as a cute chibi technical co-pilot! Always answer comprehensively in English.`;

    try {
      if (selectedEngine === 'openai' && openaiKey.trim()) {
        // Direct OpenAI API Call
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: text }
            ]
          })
        });
        if (response.ok) {
          const data = await response.json();
          reply = data.choices[0].message.content;
        } else {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `HTTP Code ${response.status}`);
        }
      } else if (selectedEngine === 'gemini' && geminiKey.trim()) {
        // Direct Gemini 1.5 API Call
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: [{
              role: 'user',
              parts: [{ text: text }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800
            }
          })
        });
        if (response.ok) {
          const data = await response.json();
          reply = data.candidates[0].content.parts[0].text;
        } else {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `HTTP Code ${response.status}`);
        }
      } else if (selectedEngine === 'gateway') {
        // Spring Boot Backend Chatbot API Controller Gateway Call
        const response = await fetch('http://localhost:8080/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            mentorName: CHIBI_ASSISTANT.name,
            provider: 'Gemini',
            apiKey: '' // Managed on backend securely
          })
        });
        if (response.ok) {
          const data = await response.json();
          reply = data.reply;
        } else {
          throw new Error(`Gateway returned HTTP Code ${response.status}`);
        }
      } else {
        // Default Canned / Offline cognitive fallback trigger
        throw new Error("Local engine active.");
      }
    } catch (e) {
      console.warn("External AI call bypassed or failed. Engaging local cognitive fallback.", e.message);
      
      const query = text.toLowerCase().trim();
      let notice = "";
      if (selectedEngine !== 'fallback') {
        notice = `\n\n*(Notice: Chatbot connection via ${selectedEngine.toUpperCase()} failed/was keyless. Hemz local cognitive brain engaged.)*`;
      }

      // Gibberish & Unknown query detector
      const textOnly = query.replace(/[^a-z]/g, '');
      const hasVowels = /[aeiouy]/.test(textOnly);
      const keywords = [
        "hi", "hello", "hey", "greetings", "motivation", "nervous", "anxious", 
        "scared", "sad", "system", "database", "architect", "scale", "drill", 
        "question", "practice", "star", "situation", "method", "app", "hemz", 
        "aura", "how to", "work", "scan", "voice", "audio", "history", "sentiment",
        "help", "tip", "react", "spring", "java", "dsa", "sql", "networks", "code"
      ];
      const matchesKeyword = keywords.some(kw => query.includes(kw));
      const isGibberish = (!hasVowels && textOnly.length > 3) || 
                          (!matchesKeyword && ((textOnly.match(/[aeiouy]/g) || []).length / textOnly.length < 0.15 && textOnly.length > 4)) ||
                          (!matchesKeyword && !query.includes(' ') && query.length > 10) ||
                          (!matchesKeyword);

      if (isGibberish) {
        reply = `This is not a valid query. Please ask a valid question about our placement preparation (such as 'motivation', 'vocal chambers', 'DSA playground', 'SQL prep', or 'networks theory'), and I will happily help you!${notice}`;
      } else if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("greetings") || query.trim() === "hi" || query.trim() === "hello") {
        reply = `Hi there! 👋 I am your Hemz AI Assistant. How can I help you sharpen your technical preparation, design scalable architectures, or navigate your career growth today? Feel free to ask me anything about the Hemz AI application or coding frameworks!${notice}`;
      } else if (query.includes("motivation") || query.includes("nervous") || query.includes("anxious") || query.includes("scared") || query.includes("sad")) {
        const list = BOT_KNOWLEDGE.motivation;
        reply = list[Math.floor(Math.random() * list.length)] + notice;
      } else if (query.includes("system") || query.includes("database") || query.includes("architect") || query.includes("scale")) {
        const list = BOT_KNOWLEDGE.system;
        reply = list[Math.floor(Math.random() * list.length)] + "\n\n*Remember: Clean, scalable system design is the foundation of high-scoring engineering reports.*" + notice;
      } else if (query.includes("drill") || query.includes("question") || query.includes("practice")) {
        const list = BOT_KNOWLEDGE.drill;
        reply = list[Math.floor(Math.random() * list.length)] + notice;
      } else if (query.includes("star") || query.includes("situation") || query.includes("method")) {
        reply = BOT_KNOWLEDGE.star[0] + notice;
      } else if (query.includes("app") || query.includes("hemz") || query.includes("aura") || query.includes("how to") || query.includes("work") || query.includes("scan") || query.includes("voice") || query.includes("audio") || query.includes("history") || query.includes("sentiment")) {
        reply = `**HEMZ AI Guide & Troubleshooting FAQs**:\n\n*   **Resume Scanner**: Paste your resume text in the scanner. The pipeline extracts your name, skills matrix, and custom properties.\n*   **Chamber Setup**: Configure Technical, HR, Stress, or Scenario tracks to guide generated mock questions.\n*   **Interviewer Chambers**: Speak clearly and tap the mic button to save and evaluate. The HTML5 **Web Speech API** translates your speech into text in real-time.\n*   **Neural ML Pipeline**: The diagnostic dashboard downloads a client-side **DistilBERT** ML classifier (~25MB) into your browser's persistent cache on first load, enabling instant, private sentiment evaluations.\n*   **Privacy Guard**: 100% of your transcripts are stored in your secure local IndexedDB/MongoDB browser storage, keeping your sessions private and server-independent!${notice}`;
      } else {
        reply = `That is an exceptionally insightful point! As your ${CHIBI_ASSISTANT.title}, I recommend testing this topic inside the Hemz AI training chamber to build your verbal confidence. \n\nBefore you do, remember this tip: \n\n*"${CHIBI_ASSISTANT.tip}"*\n\nLet me know if you would like me to serve up a fresh "Technical Tip", run an "Interview Drill", or explain "how the scanner works"!${notice}`;
      }
    }

    setMessages(prev => [...prev, {
      sender: 'bot',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mentor: CHIBI_ASSISTANT
    }]);
    setIsTyping(false);
  };

  const formatMessageText = (text) => {
    // Custom parser to format bold `**` and block headers cleanly in chatbot
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} style={{ color: '#ffffff', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <span key={idx} style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{part.slice(1, -1)}</span>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} style={{
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: '4px',
          padding: '2px 5px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--cyan-neon)',
          margin: '0 2px'
        }}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <>
      {/* 1. Dynamic Chibi FAB Avatar (Unfied Assistant Coder) */}
      <div 
        onClick={() => setIsOpen(true)}
        className="chibi-copilot-fab float-animation"
        style={{
          border: `2px solid ${CHIBI_ASSISTANT.color}`,
          boxShadow: `0 0 25px ${CHIBI_ASSISTANT.color}66, inset 0 0 12px rgba(255,255,255,0.1)`
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-3px)';
          e.currentTarget.style.boxShadow = `0 0 35px ${CHIBI_ASSISTANT.color}aa`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = `0 0 25px ${CHIBI_ASSISTANT.color}66`;
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
          <img src={CHIBI_ASSISTANT.avatar} alt={CHIBI_ASSISTANT.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {/* Soft glowing beacon ring */}
        <span style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: CHIBI_ASSISTANT.color,
          border: '2px solid #050814',
          boxShadow: `0 0 8px ${CHIBI_ASSISTANT.color}`
        }} />
        {/* Little floating chat badge */}
        <div className="chat-tooltip" style={{
          position: 'absolute',
          right: '85px',
          background: 'rgba(17, 24, 39, 0.85)',
          border: `1px solid ${CHIBI_ASSISTANT.color}44`,
          padding: '6px 12px',
          borderRadius: '20px',
          color: '#fff',
          fontSize: '0.68rem',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          opacity: 0,
          transform: 'translateX(10px)',
          transition: 'all 0.25s ease',
          pointerEvents: 'none'
        }}>
          Chat with Assistant! 💬
        </div>
      </div>

      {/* 2. Slide Drawer Sidebar Container */}
      {isOpen && (
        <div className="chibi-drawer" style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '440px',
          height: '100vh',
          background: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '-15px 0 45px rgba(0, 0, 0, 0.55)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          {/* Ambient background glow inside the drawer matching the active assistant's glow color */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${CHIBI_ASSISTANT.glow} 0%, transparent 70%)`,
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          {/* Header Drawer Section */}
          <div className="chibi-drawer-header" style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(17, 24, 39, 0.45)',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={16} style={{ color: CHIBI_ASSISTANT.color, filter: `drop-shadow(0 0 5px ${CHIBI_ASSISTANT.color})` }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  HEMZ AI COPILOT
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                  ACTIVE COGNITIVE MENTORSHIP
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: showSettings ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                  background: showSettings ? 'rgba(6, 182, 212, 0.08)' : 'var(--input-bg)',
                  border: showSettings ? '1px solid var(--cyan-neon)' : 'var(--glass-border)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: showSettings ? 'var(--cyan-neon)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: showSettings ? '0 0 10px rgba(6, 182, 212, 0.3)' : 'none'
                }}
                title="AI Engine Settings"
              >
                <Settings size={15} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'var(--input-bg)',
                  border: 'var(--glass-border)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Settings Panel Drawer Overlay */}
          {showSettings && (
            <div style={{
              background: 'var(--drawer-bg)',
              backdropFilter: 'blur(20px)',
              borderBottom: 'var(--glass-border)',
              padding: '20px',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              animation: 'fadeInDown 0.25s ease-out forwards'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                  AI COGNITIVE ENGINE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'fallback', label: 'Local Fallback', desc: 'Offline Brain' },
                    { id: 'gemini', label: 'Gemini 1.5', desc: 'Google AI' },
                    { id: 'openai', label: 'ChatGPT API', desc: 'OpenAI Core' },
                    { id: 'gateway', label: 'Hemz Gateway', desc: 'Secure Proxy' }
                  ].map((engine) => (
                    <button
                      key={engine.id}
                      onClick={() => setSelectedEngine(engine.id)}
                      style={{
                        background: selectedEngine === engine.id ? 'rgba(6, 182, 212, 0.08)' : 'var(--input-bg)',
                        border: selectedEngine === engine.id ? '1.5px solid var(--cyan-neon)' : 'var(--glass-border)',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        color: selectedEngine === engine.id ? 'var(--cyan-neon)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: selectedEngine === engine.id ? 'var(--cyan-neon)' : 'var(--text-primary)' }}>
                        {engine.label}
                      </span>
                      <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                        {engine.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedEngine === 'openai' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--purple-neon)', fontWeight: 'bold' }}>
                      OPENAI API KEY
                    </label>
                    <button 
                      onClick={() => setShowKeys(!showKeys)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.6rem' }}
                    >
                      {showKeys ? <EyeOff size={10} /> : <Eye size={10} />} {showKeys ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-..."
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.75rem',
                      background: 'var(--input-bg)',
                      border: 'var(--glass-border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      margin: 0
                    }}
                  />
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                    Your key is saved in LocalStorage and called directly from your browser.
                  </span>
                </div>
              )}

              {selectedEngine === 'gemini' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--yellow-neon)', fontWeight: 'bold' }}>
                      GOOGLE GEMINI API KEY
                    </label>
                    <button 
                      onClick={() => setShowKeys(!showKeys)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.6rem' }}
                    >
                      {showKeys ? <EyeOff size={10} /> : <Eye size={10} />} {showKeys ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.75rem',
                      background: 'var(--input-bg)',
                      border: 'var(--glass-border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      margin: 0
                    }}
                  />
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                    Get a 100% free Gemini API key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--cyan-neon)', textDecoration: 'underline' }}>Google AI Studio</a>.
                  </span>
                </div>
              )}

              {selectedEngine === 'gateway' && (
                <div style={{
                  background: 'rgba(6, 182, 212, 0.04)',
                  border: '1px solid rgba(6, 182, 212, 0.15)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4'
                }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--cyan-neon)', marginBottom: '4px' }}>
                    🌐 SECURE BACKEND GATEWAY ACTIVE
                  </p>
                  No keys exposed in frontend network logs. Secure queries are routed dynamically through your local Spring Boot controller at <code style={{ color: '#fff' }}>/api/chat</code>. Makes calls via server-side configured environment variables.
                </div>
              )}

              {selectedEngine === 'fallback' && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.04)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4'
                }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--emerald-neon)', marginBottom: '4px' }}>
                    🧠 OFFLINE COGNITIVE BRAIN ACTIVE
                  </p>
                  Zero server loads or external network calls. Responds in real-time using a customized application knowledge database tailored specifically to critique and assist on Hemz AI systems.
                </div>
              )}
            </div>
          )}



          {/* Chat Feed */}
          <div 
            ref={scrollRef}
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              zIndex: 1
            }}
          >
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    maxWidth: '88%',
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    flexDirection: isUser ? 'row-reverse' : 'row'
                  }}
                >
                  {/* Circular Small Chibi Avatar Bubble directly next to speech bubble */}
                  {!isUser && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `1px solid ${CHIBI_ASSISTANT.color}`,
                      boxShadow: `0 0 8px ${CHIBI_ASSISTANT.color}33`,
                      background: 'rgba(17, 24, 39, 0.8)',
                      padding: '1px',
                      flexShrink: 0,
                      marginTop: '4px'
                    }}>
                      <img src={CHIBI_ASSISTANT.avatar} alt={CHIBI_ASSISTANT.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    </div>
                  )}
 
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    gap: '4px',
                    flex: 1
                  }}>
                    {/* Sender Name tag for bot */}
                    {!isUser && (
                      <span style={{ 
                        fontSize: '0.62rem', 
                        fontFamily: 'var(--font-mono)', 
                        color: CHIBI_ASSISTANT.color, 
                        fontWeight: 'bold',
                        marginLeft: '4px'
                      }}>
                        {CHIBI_ASSISTANT.name.toUpperCase()} • {CHIBI_ASSISTANT.title.toUpperCase()}
                      </span>
                    )}
 
                    {/* Message Bubble Card */}
                    <div className={isUser ? "chat-bubble-user" : "chat-bubble-bot"} style={{
                      background: isUser ? 'rgba(139, 92, 246, 0.12)' : 'rgba(17, 24, 39, 0.65)',
                      border: '1px solid ' + (isUser ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.08)'),
                      borderLeft: !isUser ? `4px solid ${CHIBI_ASSISTANT.color}` : undefined,
                      borderRight: isUser ? '4px solid var(--purple-neon)' : undefined,
                      borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      padding: '12px 18px',
                      color: isUser ? '#f3f4f6' : '#cbd5e1',
                      fontSize: '0.82rem',
                      lineHeight: '1.6',
                      textAlign: 'left',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      whiteSpace: 'pre-line'
                    }}>
                      {formatMessageText(msg.text)}
                    </div>
                     
                    {/* Time flag */}
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginRight: isUser ? '4px' : '0', marginLeft: !isUser ? '4px' : '0' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
 
            {/* Simulated typing bubble */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', alignSelf: 'flex-start', maxWidth: '80%' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `1px solid ${CHIBI_ASSISTANT.color}`,
                  background: 'rgba(17, 24, 39, 0.8)',
                  padding: '1px',
                  flexShrink: 0,
                  marginTop: '4px'
                }}>
                  <img src={CHIBI_ASSISTANT.avatar} alt={CHIBI_ASSISTANT.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                 
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: CHIBI_ASSISTANT.color, fontWeight: 'bold', marginLeft: '4px' }}>
                    {CHIBI_ASSISTANT.name.toUpperCase()} IS TYPING...
                  </span>
                  <div className="chat-bubble-typing" style={{
                    background: 'rgba(17, 24, 39, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderLeft: `4px solid ${CHIBI_ASSISTANT.color}`,
                    borderRadius: '4px 16px 16px 16px',
                    padding: '12px 18px',
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                    width: '60px',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  }}>
                    <span className="typing-dot" style={{ background: CHIBI_ASSISTANT.color }} />
                    <span className="typing-dot" style={{ background: CHIBI_ASSISTANT.color, animationDelay: '0.2s' }} />
                    <span className="typing-dot" style={{ background: CHIBI_ASSISTANT.color, animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Command Suggestion Chips */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(10, 15, 30, 0.25)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            zIndex: 1
          }}>
            <button 
              onClick={() => handleSend("Give me instant motivation!")}
              style={suggestionChipStyle("var(--pink-neon)")}
            >
              <Award size={11} /> Motivation
            </button>
            <button 
              onClick={() => handleSend("Provide a technical system tip.")}
              style={suggestionChipStyle("var(--yellow-neon)")}
            >
              <Cpu size={11} /> Technical Tip
            </button>
            <button 
              onClick={() => handleSend("Give me an interview drill question.")}
              style={suggestionChipStyle("var(--purple-neon)")}
            >
              <Zap size={11} /> Technical Drill
            </button>
            <button 
              onClick={() => handleSend("Outline the STAR Method structure.")}
              style={suggestionChipStyle("var(--cyan-neon)")}
            >
              <HelpCircle size={11} /> STAR Framework
            </button>
          </div>

          {/* Send Input Panel */}
          <div className="chibi-drawer-footer" style={{
            padding: '16px 20px',
            background: 'rgba(17, 24, 39, 0.75)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            zIndex: 1
          }}>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder={`Ask ${CHIBI_ASSISTANT.name} anything...`}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '0.8rem',
                margin: 0
              }}
            />
            <button 
              onClick={() => handleSend()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--cyan-neon), var(--purple-neon))',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(6, 182, 212, 0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            >
              <Send size={16} style={{ color: '#fff' }} />
            </button>
          </div>

          {/* Slide Drawer Styles */}
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            @keyframes fadeInDown {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .typing-dot {
              display: inline-block;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              animation: typingBlink 1.2s infinite ease-in-out;
            }
            @keyframes typingBlink {
              0%, 100% { opacity: 0.2; transform: translateY(0); }
              50% { opacity: 1; transform: translateY(-3px); }
            }
            .float-animation:hover .chat-tooltip {
              opacity: 1 !important;
              transform: translateX(0) !important;
            }
          `}</style>
        </div>
      )}
    </>
  );
}

function suggestionChipStyle(borderColor) {
  return {
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${borderColor}44`,
    borderRadius: '20px',
    padding: '5px 14px',
    color: '#fff',
    fontSize: '0.68rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.2s'
  };
}
