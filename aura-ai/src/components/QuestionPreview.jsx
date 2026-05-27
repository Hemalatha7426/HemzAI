import React, { useState } from 'react';
import { Terminal, Shield, Play, ArrowLeft, Volume2, HelpCircle, HeartPulse, User, Smile } from 'lucide-react';

export default function QuestionPreview({ parsedData, configData, onStartPractice, onBack }) {
  const [activeTab, setActiveTab] = useState('HR');

  const { candidateName = "Alex Mercer", skills = ["React", "Spring Boot", "MongoDB"] } = parsedData;
  const { track = "Technical", experienceLevel = "Mid" } = configData;

  // Custom tabs matching the screenshots (HR, TECHNICAL, STRESS, SCENARIO)
  const tabs = [
    { id: 'HR', title: 'HR', icon: User },
    { id: 'TECHNICAL', title: 'TECHNICAL', icon: Terminal },
    { id: 'STRESS', title: 'STRESS', icon: HeartPulse },
    { id: 'SCENARIO', title: 'SCENARIO', icon: HelpCircle }
  ];

  // Helper to retrieve simulated question pools for reviewing in tabs
  const getQuestionsForTab = (tabId) => {
    const primary = skills[0] || "Software Engineering";
    const secondary = skills[1] || "System Architecture";

    switch (tabId) {
      case 'HR':
        return [
          { q: "Can you tell me a little about yourself and your background?", tip: "Aim to walk through your resume in under 2 minutes, highlighting major impact points." },
          { q: "Why are you interested in joining us, and how do you align with our technical values?", tip: "Reference active projects or cultural points that match your own interests." },
          { q: "Describe your biggest professional achievement and how you measured success.", tip: "Cite concrete metrics (e.g. latency decreased by 30%, user conversion up by 15%)." }
        ];
      case 'TECHNICAL':
        return [
          { q: `What are the core differences between asynchronous processing and synchronous multi-threading in ${primary}?`, tip: "Explain thread allocations, context switching overheads, and non-blocking event loops." },
          { q: `How do you index and optimize performance for dynamic aggregation filters in ${skills.includes ? (skills.includes('MongoDB') ? 'MongoDB' : 'databases') : 'MongoDB'}?`, tip: "Mention single-field vs compound indexes, index selection order, and covered queries." },
          { q: `Explain how you handle CORS, JWT tokens, and CSRF mitigation in ${secondary}.`, tip: "Detail cryptographic signature validation, token storage practices, and browser cookie attributes." }
        ];
      case 'STRESS':
        return [
          { q: "You find out that a critical feature you deployed has caused a production blackout, and the Tech Lead is offline. What is your instant reaction?", tip: "Emphasize immediate rollback plans first before attempting debugging." },
          { q: "A manager demands that you ship a feature tomorrow that you know has not been security audited. How do you handle this confrontation?", tip: "Articulate how to explain the risk tradeoffs objectively, citing company policies." },
          { q: "You disagree completely with the architectural decision made by the Staff Engineer, but the sprint starts today. Do you argue or commit?", tip: "Explain the philosophy of 'disagree and commit' after presenting your case." }
        ];
      case 'SCENARIO':
        return [
          { q: `Imagine a database service experiencing a sudden spike in CPU and latency. How do you isolate the bottleneck under load?`, tip: "Discuss profiling active connections, analyzing read queries, and scaling secondary clusters." },
          { q: `A legacy module breaks because another team updated their shared library version. How do you roll back and secure stability?`, tip: "Discuss locking dependency versions, caching artifact repositories, and CI registry builds." }
        ];
      default:
        return [];
    }
  };

  const activeQuestions = getQuestionsForTab(activeTab);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.1fr', gap: '30px', maxWidth: '980px', width: '100%', margin: '0 auto', zIndex: 1 }}>
      
      {/* LEFT COLUMN - Waving Robot AI Companion & Quick Profile (Aligned with bottom-left photo) */}
      <div className="glass-panel dot-grid" style={{ padding: '35px 25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px', height: 'fit-content', textAlign: 'center' }}>
        
        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cyan-neon)', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', width: '100%' }}>
          SANDBOX AGENT
        </h4>

        {/* Floating waving Smile robot */}
        <div style={{ position: 'relative', width: '95px', height: '95px', display: 'flex', alignItems: 'center', justify: 'center', marginTop: '10px' }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px dashed var(--pink-neon)', animation: 'spin 18s linear infinite', opacity: 0.5 }} />
          <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', background: 'rgba(255, 0, 127, 0.05)', boxShadow: '0 0 15px rgba(255, 0, 127, 0.2)' }} />
          <Smile size={32} style={{ color: 'var(--pink-neon)', zIndex: 1, filter: 'drop-shadow(0 0 6px var(--pink-neon))' }} />
        </div>

        {/* Small equalizer soundwave graphic below robot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '24px', margin: '5px 0' }}>
          <span className="wave-bar" style={{ height: '8px', animationDelay: '0s' }} />
          <span className="wave-bar" style={{ height: '18px', animationDelay: '0.2s', backgroundColor: 'var(--pink-neon)' }} />
          <span className="wave-bar" style={{ height: '12px', animationDelay: '0.4s' }} />
          <span className="wave-bar" style={{ height: '22px', animationDelay: '0.6s', backgroundColor: 'var(--pink-neon)' }} />
          <span className="wave-bar" style={{ height: '9px', animationDelay: '0.8s' }} />
        </div>

        {/* Start Practice button */}
        <button 
          className="btn-cyber btn-cyber-pink" 
          style={{ width: '100%', padding: '12px', fontSize: '0.82rem', borderRadius: '30px' }} 
          onClick={onStartPractice}
        >
          Start Practice
        </button>

        {/* Skeleton Candidate Card below button */}
        <div style={{ 
          width: '100%', 
          borderTop: '1px solid var(--glass-border)', 
          paddingTop: '15px', 
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div>
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>CANDIDATE ID:</span>
            <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>{candidateName}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SKILLS DECODED:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
              {skills.slice(0, 3).map((s, i) => (
                <span key={i} style={{ fontSize: '0.62rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.15)', color: 'var(--cyan-neon)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN - Glowing category tabs & list previews */}
      <div className="glass-panel dot-grid" style={{ padding: '35px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.3rem', fontWeight: '800', color: '#fff' }}>
            Interactive Practice Sandbox
          </h3>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            PROMPTS SCANNED
          </span>
        </div>

        {/* Categories Tab selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '12px 6px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid var(--pink-neon)' : '1px solid var(--glass-border)',
                  background: isActive ? 'rgba(255, 0, 127, 0.08)' : 'rgba(5, 6, 15, 0.4)',
                  color: isActive ? 'var(--pink-neon)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
              >
                <Icon size={14} />
                {t.title}
              </button>
            );
          })}
        </div>

        {/* Tab content scrollable listings (Aligned with scrollable Pinkyy list) */}
        <div className="glass-panel" style={{ 
          padding: '20px', 
          background: 'rgba(5, 6, 15, 0.25)', 
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          maxHeight: '320px',
          overflowY: 'auto'
        }}>
          <h4 style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.8rem', 
            color: 'var(--pink-neon)', 
            letterSpacing: '1px', 
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255, 0, 127, 0.1)',
            paddingBottom: '8px',
            marginBottom: '5px'
          }}>
            {activeTab} Questions
          </h4>

          {activeQuestions.map((q, idx) => (
            <div key={idx} style={{ padding: '8px 0', borderBottom: idx < activeQuestions.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--pink-neon)', fontWeight: 'bold' }}>
                  Q{idx + 1}.
                </span>
                <p style={{ fontSize: '0.88rem', color: '#fff', fontWeight: '600', lineHeight: '1.4' }}>
                  {q.q}
                </p>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '25px', lineHeight: '1.4' }}>
                💡 Key Tip: {q.tip}
              </p>
            </div>
          ))}
        </div>

        {/* Companion robot status bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0, 242, 254, 0.03)', border: '1px solid rgba(0, 242, 254, 0.08)', borderRadius: '12px', padding: '12px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="wave-bar" style={{ height: '8px', animationDelay: '0s' }} />
            <span className="wave-bar" style={{ height: '14px', animationDelay: '0.2s' }} />
            <span className="wave-bar" style={{ height: '10px', animationDelay: '0.4s' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--cyan-neon)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
            ROBOT COMPANION ACTIVE. SANDBOX CONFIGURATED.
          </span>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '5px' }}>
          <button className="btn-cyber btn-cyber-pink" style={{ padding: '10px 24px', fontSize: '0.82rem' }} onClick={onStartPractice}>
            Start Interview
          </button>
          <button className="btn-cyber btn-cyber-secondary" style={{ padding: '10px 24px', fontSize: '0.82rem' }} onClick={onBack}>
            Back
          </button>
        </div>

      </div>

    </div>
  );
}
