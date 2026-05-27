import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Volume2, ArrowLeft, RefreshCw, BarChart2, Star, Zap, Activity, BookOpen, Smile, Cpu } from 'lucide-react';
import { pipeline, env } from '@xenova/transformers';

export default function DiagnosticDashboard({ reportData, onRestart, onHome }) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [playingSuggested, setPlayingSuggested] = useState(null);
  const [hideFeedback, setHideFeedback] = useState(false);
  const [showCompletionCard, setShowCompletionCard] = useState(true);
  
  // Client-side ML Sentiment Classifier States
  const [mlStatus, setMlStatus] = useState('UNINITIALIZED');
  const [mlProgress, setMlProgress] = useState(0);
  const [mlResults, setMlResults] = useState({});

  const {
    candidateName = "Alex Mercer",
    candidateSkills = [],
    track = "Technical",
    experienceLevel = "Mid",
    overallScore = 75,
    feedbackSummary = "Great job! Fundamentals are solid across the technical tracks.",
    resumeImprovementFeedback = "",
    qaEvaluations = []
  } = reportData;
  const isCertificate = reportData.isCertificate || reportData.certificate || false;

  const formatCritiqueText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} style={{ color: '#fff', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '4px',
          padding: '2px 6px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--cyan-neon)',
          margin: '0 2px'
        }}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const getFallbackResumeFeedback = (skillsList, isCert) => {
    const list = skillsList && skillsList.length > 0 ? skillsList : ["React.js", "Spring Boot"];
    const matched = [];
    const knownSkills = ["React.js", "Spring Boot", "MongoDB", "Java SE/EE", "Python ML", "Node.js", "Express.js", "SQL Databases", "AWS Cloud", "Docker Containers", "Kubernetes", "TypeScript", "Svelte", "Vue.js", "Angular", "Rust", "Go (Golang)", "C/C++", "C#", "Swift", "Kotlin", "Ruby on Rails", "PHP", "Django", "Flask", "PostgreSQL", "MySQL", "Redis", "Apache Kafka", "GraphQL", "Git/GitHub", "Terraform", "PyTorch", "TensorFlow", "Google Cloud (GCP)", "Microsoft Azure", "Firebase", "Next.js"];
    
    list.forEach(skill => {
      knownSkills.forEach(key => {
        if (skill.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(skill.toLowerCase())) {
          if (!matched.includes(key)) {
            matched.push(key);
          }
        }
      });
    });

    if (matched.length === 0) matched.push("React.js", "Spring Boot");
    const primary = matched[0];

    if (isCert) {
      return `### 🌟 Certificate Strengths Analysis
- **Verified Competency Badge:** Your certification explicitly validates specialized knowledge in \`${primary}\`.
- **Structured Technical Foundation:** Earning a formal credential proves strong self-discipline, structured learning habits, and conceptual clarity in modern platforms.

### 🔍 Transition Gaps to Professional Resume
- **Missing Practical Application:** A single course credential represents theoretical knowledge. To appeal to corporate recruiters, you need to bridge this with robust, multi-tier projects.
- **Lack of Enterprise Scale:** Most certificate assignments focus on micro-problems. Real-world systems require dealing with distributed state, error thresholds, and containerized cloud pipelines.
- **Adjacent Tech Integration:** A \`${primary}\` certificate becomes twice as valuable when integrated with complementary databases (like SQL/MongoDB) and CI/CD tools (like Git/Docker).

### 🚀 Step-by-Step Action Roadmap
1. **Build a Full-Scale Capstone:** Don't just list the certificate. Create a fully functional GitHub project that implements the certificate's key concepts in an end-to-end user scenario.
2. **Quantify Local Testing:** Add quantitative details: *Built a modular project utilizing ${primary}, achieving sub-100ms request handling under simulated load*.
3. **Cross-Pollinate Badges:** Frame this certification on your resume as part of an active learning roadmap, linking it directly to your target engineering roles.`;
    }

    let gaps = "";
    if (list.includes("React.js") && !list.includes("TypeScript")) {
      gaps += "- **Missing Type Safety:** You list `React.js` but lack `TypeScript`. Modern roles highly prioritize type-safe components.\n";
    }
    if ((list.includes("Spring Boot") || list.includes("Node.js")) && !list.includes("Docker Containers") && !list.includes("Docker")) {
      gaps += "- **Missing Containerization:** You list modern backends but lack `Docker` container orchestration, which is essential for cloud devops environments.\n";
    }
    if (!list.includes("AWS Cloud")) {
      gaps += "- **Cloud Infrastructure:** Your resume has a strong programming foundation but lacks cloud provider exposure (`AWS Cloud` or similar).\n";
    }
    if (!gaps) {
      gaps += "- **Quantifiable Metrics:** Ensure your project descriptions emphasize specific metrics (e.g. *Optimized DB query times by 40%*) rather than simple lists of duties.\n";
    }

    return `### 🌟 Resume Strengths Analysis
- **Strong Modern Tech Stack:** Excellent coverage of core technologies: \`${matched.join("`, `")}\`.
- **Clear Specialization:** Your skills demonstrate a focused foundation in ${matched.includes("Spring Boot") || matched.includes("Java SE/EE") ? "robust enterprise backend development" : "dynamic frontend and modern UI architectures"}.

### 🔍 Identified Technical Gaps
${gaps}

### 🚀 Step-by-Step Action Roadmap
1. **Add Complementary Badges:** Dedicate 1-2 weeks to study and add \`Docker\` or \`TypeScript\` to your stack.
2. **Quantify Impact:** Rewrite your project bullet points to use the STAR method: *Action + Result + Quantified Metric*.
3. **Highlight System Design:** Ensure your resume mentions API design (REST/GraphQL) and database design patterns.`;
  };

  // Custom text-based tone critique helper
  const getToneCritique = (label, confidence) => {
    if (label === 'POSITIVE') {
      if (confidence > 85) {
        return "Excellent structural delivery. The response communicates high spoken authority and clear validation of technical points.";
      }
      return "Optimistic phrasing with good keyword distribution. A bit more syntactic structure would elevate the technical depth.";
    } else {
      if (confidence > 85) {
        return "Carefully paced with structured caveats, though could benefit from more proactive and optimistic solution frameworks.";
      }
      return "Highly analytical tone with cautious delivery. The detail is outstanding, but try to frame challenges as opportunities.";
    }
  };

  // Fallback simulator for offline/CDN constraints
  const runFallbackSimulatedML = (text) => {
    if (!text || text.includes('[No spoken response') || text.trim() === '') {
      return {
        label: 'INSUFFICIENT DATA',
        score: 0,
        tone: 'SILENT / SKIPPED',
        confidence: 0,
        feedback: 'No transcript available to assess.'
      };
    }
    
    const words = text.split(/\s+/).length;
    let confidence = Math.min(65 + (words % 30), 98);
    let tone = 'BALANCED & PRAGMATIC';
    let label = 'POSITIVE';
    
    if (words > 40) {
      tone = 'CONFIDENT & PERSUASIVE';
      label = 'POSITIVE';
    } else if (words > 20) {
      tone = 'CONSTRUCTIVE & OPTIMISTIC';
      label = 'POSITIVE';
    } else if (words > 10) {
      tone = 'DELIBERATE & ANALYTICAL';
      label = 'NEGATIVE';
      confidence = Math.min(50 + (words % 40), 90);
    } else {
      tone = 'CAUTIOUS & SPECULATIVE';
      label = 'NEGATIVE';
    }
    
    return {
      label: label,
      score: confidence / 100,
      tone: tone,
      confidence: confidence,
      feedback: getToneCritique(label, confidence)
    };
  };

  // Initialize and run Transformers.js client-side model
  useEffect(() => {
    let active = true;
    async function loadModelAndAnalyze() {
      if (!qaEvaluations || qaEvaluations.length === 0) {
        return;
      }
      
      try {
        setMlStatus('LOADING');
        setMlProgress(0);
        
        // Configure Transformers.js settings for Vite & Sandbox safety
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        
        // Load the sentiment classifier pipeline (sst-2 english classifier)
        const classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
          progress_callback: (data) => {
            if (data.status === 'progress' && active) {
              setMlProgress(Math.round(data.progress) || 0);
            }
          }
        });
        
        if (!active) return;
        
        setMlStatus('READY');
        
        // Asynchronously process all transcripts
        const results = {};
        for (let i = 0; i < qaEvaluations.length; i++) {
          const qa = qaEvaluations[i];
          const text = qa.userTranscript || '';
          
          if (!text || text.includes('[No spoken response') || text.trim() === '') {
            results[i] = {
              label: 'INSUFFICIENT DATA',
              score: 0,
              tone: 'SILENT / SKIPPED',
              confidence: 0,
              feedback: 'No transcript available to assess.'
            };
            continue;
          }
          
          try {
            const res = await classifier(text);
            const prediction = res[0];
            const confidence = Math.round(prediction.score * 100);
            let tone = 'BALANCED & PRAGMATIC';
            
            if (prediction.label === 'POSITIVE') {
              if (confidence > 85) {
                tone = 'CONFIDENT & PERSUASIVE';
              } else {
                tone = 'CONSTRUCTIVE & OPTIMISTIC';
              }
            } else {
              if (confidence > 85) {
                tone = 'CAUTIOUS & SPECULATIVE';
              } else {
                tone = 'DELIBERATE & ANALYTICAL';
              }
            }
            
            results[i] = {
              label: prediction.label,
              score: prediction.score,
              tone: tone,
              confidence: confidence,
              feedback: getToneCritique(prediction.label, confidence)
            };
          } catch (inferenceErr) {
            console.error("Inference failed for index", i, inferenceErr);
            results[i] = runFallbackSimulatedML(text);
          }
        }
        
        if (active) {
          setMlResults(results);
        }
      } catch (err) {
        console.error("Failed to initialize Transformers.js pipeline:", err);
        if (active) {
          setMlStatus('ERROR');
          // Graceful fallback to Simulated ML Analytics
          const fallbackResults = {};
          qaEvaluations.forEach((qa, i) => {
            fallbackResults[i] = runFallbackSimulatedML(qa.userTranscript || '');
          });
          setMlResults(fallbackResults);
        }
      }
    }
    
    loadModelAndAnalyze();
    
    return () => {
      active = false;
    };
  }, [qaEvaluations]);

  // Speak the suggested answer aloud for a premium audio touch
  const playSuggestedAnswer = (index, answer) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      if (playingSuggested === index) {
        setPlayingSuggested(null);
        return;
      }

      setPlayingSuggested(index);
      const utterance = new SpeechSynthesisUtterance(answer);
      
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Natural"));
      if (voice) utterance.voice = voice;

      utterance.rate = 0.95;

      utterance.onend = () => {
        setPlayingSuggested(null);
      };

      utterance.onerror = () => {
        setPlayingSuggested(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Helper to determine score status color
  const getScoreColor = (score) => {
    if (score >= 85) return 'var(--emerald-neon)';
    if (score >= 70) return 'var(--cyan-neon)';
    return 'var(--pink-neon)';
  };

  // Compute metrics based on actual transcripts for the sidebar
  const totalQuestions = qaEvaluations.length || 5;
  const answeredQuestions = qaEvaluations.filter(q => q.userTranscript && !q.userTranscript.includes("[No spoken response")).length;
  const skippedQuestions = totalQuestions - answeredQuestions;

  // Mock dimensional stats based on the overall score
  const metrics = [
    { name: 'Technical Depth', value: Math.min(overallScore + 4, 98), desc: 'Keywords, definitions, and framework references.', icon: Zap, color: 'var(--cyan-neon)' },
    { name: 'STAR Structure', value: Math.max(overallScore - 6, 45), desc: 'Situation, Task, Action, and logical transitions.', icon: Star, color: 'var(--pink-neon)' },
    { name: 'Pacing & Volume', value: Math.min(overallScore + 2, 95), desc: 'Sustained speaking cycles and text length.', icon: Activity, color: 'var(--purple-neon)' },
    { name: 'Spoken Authority', value: Math.max(overallScore - 2, 50), desc: 'Grammar fluency and removal of filler phrases.', icon: Award, color: 'var(--emerald-neon)' }
  ];

  if (showCompletionCard) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', width: '100%', zIndex: 1, position: 'relative' }}>
        {/* Ambient background glow inside the overlay */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="glass-panel float-animation" style={{
          padding: '45px 35px',
          textAlign: 'center',
          maxWidth: '430px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '25px',
          background: 'rgba(17, 24, 39, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 35px rgba(16, 185, 129, 0.15)',
          borderRadius: '24px',
          zIndex: 1
        }}>
          {/* Celebrating Cartoon success child illustration in a glowing tech badge circle */}
          <div style={{ 
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '50%',
            overflow: 'hidden',
            width: '150px',
            height: '150px',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
            background: 'rgba(17, 24, 39, 0.8)',
            padding: '6px'
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
              <img 
                src="/images/success.png" 
                alt="Success Victory Cartoon" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div>
            <h3 style={{ 
              fontSize: '2.1rem', 
              fontWeight: '900', 
              color: '#fff', 
              fontFamily: 'var(--font-sans)', 
              textShadow: '0 0 15px rgba(16, 185, 129, 0.4)' 
            }}>
              WELL DONE! 🎉
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', marginTop: '6px' }}>
              You've completed your Mock Interview adventure!
            </p>
          </div>

          {/* Stats Box */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            background: 'rgba(17, 24, 39, 0.55)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '16px', 
            padding: '14px 10px', 
            width: '100%',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Answered</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--cyan-neon)', fontFamily: 'var(--font-mono)' }}>{answeredQuestions}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRight: '1px solid rgba(255, 255, 255, 0.08)' 
            }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Skipped</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--pink-neon)', fontFamily: 'var(--font-mono)' }}>{skippedQuestions}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Total</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{totalQuestions}</span>
            </div>
          </div>

          {/* Motivational Quote note block */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderLeft: '4px solid var(--yellow-neon)',
            borderRadius: '12px',
            padding: '14px 18px',
            width: '100%',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.05)'
          }}>
            <p style={{ 
              margin: 0, 
              fontStyle: 'italic', 
              fontWeight: '600', 
              fontSize: '0.82rem', 
              color: '#ffdf80', 
              lineHeight: '1.5' 
            }}>
              "You have the power to change your story, no matter what page you're on."
            </p>
          </div>

          {/* Two Buttons */}
          <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
            <button 
              className="btn-cyber btn-cyber-pink" 
              style={{ flex: 1.2, padding: '12px', fontSize: '0.78rem' }}
              onClick={() => setShowCompletionCard(false)}
            >
              View Feedback
            </button>
            <button 
              className="btn-cyber btn-cyber-secondary" 
              style={{ flex: 1, padding: '12px', fontSize: '0.78rem' }}
              onClick={onRestart}
            >
              Retry Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: hideFeedback ? 'flex' : 'grid',
      gridTemplateColumns: hideFeedback ? '1fr' : '1fr 2fr',
      gap: '30px',
      maxWidth: hideFeedback ? '450px' : '1080px',
      width: '100%',
      margin: '0 auto',
      zIndex: 1,
      position: 'relative',
      justifyContent: 'center'
    }}>
      
      {/* LEFT COLUMN - Evaluation Stats Summary Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        
        {/* "Well Done 🚀" Sidebar Card */}
        <div className="glass-panel dot-grid" style={{
          padding: '35px 25px',
          textAlign: 'center',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          background: 'rgba(17, 24, 39, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
          borderRadius: '16px'
        }}>
          {/* Celebrating Cartoon success child illustration in glowing circle badge */}
          <div style={{ 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            overflow: 'hidden',
            width: '120px',
            height: '120px',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
            background: 'rgba(17, 24, 39, 0.8)',
            padding: '4px'
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
              <img 
                src="/images/success.png" 
                alt="Success Character" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '900', 
              color: '#fff', 
              fontFamily: 'var(--font-sans)', 
              textShadow: '0 0 10px rgba(16, 185, 129, 0.35)' 
            }}>
              WELL DONE! 🎉
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: '500', marginTop: '6px' }}>
              Completed Session Report
            </p>
          </div>

          {/* Stats Box */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            background: 'rgba(17, 24, 39, 0.55)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '16px', 
            padding: '14px 10px', 
            width: '100%',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Answered</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--cyan-neon)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{answeredQuestions}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRight: '1px solid rgba(255, 255, 255, 0.08)' 
            }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Skipped</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--pink-neon)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{skippedQuestions}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Total</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{totalQuestions}</span>
            </div>
          </div>

          {/* Hide Feedback and Retry Again Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '10px' }}>
            <button 
              className="btn-cyber btn-cyber-pink" 
              style={{ width: '100%', padding: '12px', fontSize: '0.8rem', textTransform: 'none', letterSpacing: '0.5px' }}
              onClick={() => setHideFeedback(!hideFeedback)}
            >
              {hideFeedback ? 'View Feedback' : 'Hide Feedback'}
            </button>
            <button 
              className="btn-cyber btn-cyber-secondary" 
              style={{ width: '100%', padding: '12px', fontSize: '0.8rem', textTransform: 'none', letterSpacing: '0.5px' }}
              onClick={onRestart}
            >
              Retry Again
            </button>
          </div>

          {/* Motivational Quote note block at bottom of sidebar */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderLeft: '4px solid var(--yellow-neon)',
            borderRadius: '12px',
            padding: '10px 14px',
            width: '100%',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.05)',
            marginTop: '5px'
          }}>
            <p style={{ 
              margin: 0, 
              fontStyle: 'italic', 
              fontWeight: '600', 
              fontSize: '0.78rem', 
              color: '#ffdf80', 
              lineHeight: '1.4' 
            }}>
              "You have the power to change your story, no matter what page you're on."
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN - Question & Answer Diagnostics Feed */}
      {!hideFeedback && (
        <div className="glass-panel dot-grid" style={{ 
          padding: '40px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '30px', 
          background: 'rgba(17, 24, 39, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
          borderRadius: '16px'
        }}>
          
          {/* Header section with rating tag */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderBottom: '1px solid var(--glass-border)', 
            paddingBottom: '15px' 
          }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', margin: 0, fontFamily: 'var(--font-sans)' }}>
                Performance Report
              </h3>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '3px', display: 'block' }}>
                AI EVALUATOR
              </span>
            </div>
            
            {/* Orange/Yellow Average pill badge */}
            <div style={{
              background: overallScore >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: '1px solid ' + (overallScore >= 80 ? 'var(--emerald-neon)' : 'var(--yellow-neon)'),
              borderLeft: '4px solid ' + (overallScore >= 80 ? 'var(--emerald-neon)' : 'var(--yellow-neon)'),
              borderRadius: '8px',
              padding: '6px 14px',
              color: overallScore >= 80 ? 'var(--emerald-neon)' : 'var(--yellow-neon)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: overallScore >= 80 ? 'var(--emerald-neon)' : 'var(--yellow-neon)', 
                display: 'inline-block' 
              }} />
              {overallScore >= 80 ? 'EXPERT' : overallScore >= 60 ? 'AVERAGE' : 'DEVELOPING'}
            </div>
          </div>

          {/* Three Takeaway Critique Cards with light yellow borders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ 
                background: 'rgba(245, 158, 11, 0.04)', 
                border: '1px solid rgba(245, 158, 11, 0.12)', 
                borderLeft: '4px solid var(--yellow-neon)', 
                borderRadius: '8px', 
                padding: '16px', 
                display: 'flex', 
                gap: '10px', 
                alignItems: 'flex-start' 
              }}>
                <span style={{ color: 'var(--yellow-neon)', fontSize: '1rem', marginTop: '1px' }}>💡</span>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
                  Believe in yourself and your abilities to become a successful {track || 'Full Stack'} Developer.
                </p>
              </div>
              <div style={{ 
                background: 'rgba(245, 158, 11, 0.04)', 
                border: '1px solid rgba(245, 158, 11, 0.12)', 
                borderLeft: '4px solid var(--yellow-neon)', 
                borderRadius: '8px', 
                padding: '16px', 
                display: 'flex', 
                gap: '10px', 
                alignItems: 'flex-start' 
              }}>
                <span style={{ color: 'var(--yellow-neon)', fontSize: '1rem', marginTop: '1px' }}>💡</span>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
                  Keep practicing and learning to improve your skills and knowledge.
                </p>
              </div>
            </div>
            <div style={{ 
              background: 'rgba(245, 158, 11, 0.04)', 
              border: '1px solid rgba(245, 158, 11, 0.12)', 
              borderLeft: '4px solid var(--yellow-neon)', 
              borderRadius: '8px', 
              padding: '16px', 
              display: 'flex', 
              gap: '10px', 
              alignItems: 'flex-start' 
            }}>
              <span style={{ color: 'var(--yellow-neon)', fontSize: '1rem', marginTop: '1px' }}>💡</span>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
                Stay confident and focused during the interview to showcase your strengths.
              </p>
            </div>
          </div>

          {/* Glassmorphic Resume Optimization Diagnostic Hub */}
          <div className="glass-panel" style={{
            padding: '25px',
            border: '1px solid rgba(0, 242, 254, 0.15)',
            background: 'rgba(17, 24, 39, 0.45)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            overflow: 'hidden',
            marginTop: '10px'
          }}>
            {/* Ambient Background Glow */}
            <div style={{
              position: 'absolute',
              top: '-10%',
              right: '-10%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%)',
              zIndex: 0,
              pointerEvents: 'none'
            }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
              <Cpu size={20} style={{ color: 'var(--cyan-neon)', filter: 'drop-shadow(0 0 8px var(--cyan-neon))' }} />
              <div>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                  Resume Optimization Diagnostic Hub
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Scanned Skills Matrix & Strategic Enhancement Recommendations
                </p>
              </div>
            </div>

            {/* Scanned Skills Matrix */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1 }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                DETECTED RESUME SKILLS ({candidateSkills.length})
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {candidateSkills.map((skill, index) => (
                  <span key={index} style={{
                    background: 'rgba(0, 242, 254, 0.03)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--cyan-neon)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 0 6px rgba(0, 242, 254, 0.02)'
                  }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--cyan-neon)' }} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed Feedback Sections parsed from resumeImprovementFeedback or fallback */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 1, marginTop: '5px' }}>
              {(() => {
                const feedbackText = resumeImprovementFeedback || getFallbackResumeFeedback(candidateSkills, isCertificate);
                // We split the feedback into sections by looking for headings like "### 🌟 Resume Strengths Analysis" or similar
                const sections = feedbackText.split(/###\s+/);
                
                return sections.filter(sec => sec.trim().length > 0).map((sec, secIdx) => {
                  const lines = sec.split('\n');
                  const heading = lines[0].trim();
                  const content = lines.slice(1).join('\n').trim();
                  
                  // Style colors based on heading content
                  let accentColor = 'var(--cyan-neon)';
                  let sectionBg = 'rgba(0, 242, 254, 0.02)';
                  let borderLeft = '3px solid var(--cyan-neon)';
                  
                  if (heading.includes('Gaps') || heading.includes('Gap')) {
                    accentColor = 'var(--pink-neon)';
                    sectionBg = 'rgba(255, 0, 127, 0.02)';
                    borderLeft = '3px solid var(--pink-neon)';
                  } else if (heading.includes('Roadmap') || heading.includes('Step-by-Step')) {
                    accentColor = 'var(--emerald-neon)';
                    sectionBg = 'rgba(0, 255, 135, 0.02)';
                    borderLeft = '3px solid var(--emerald-neon)';
                  }
                  
                  return (
                    <div key={secIdx} style={{
                      background: sectionBg,
                      borderLeft: borderLeft,
                      borderRadius: '4px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <h5 style={{ 
                        fontSize: '0.88rem', 
                        fontWeight: '700', 
                        color: '#fff', 
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {heading}
                      </h5>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#cbd5e1', 
                        lineHeight: '1.5',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        {content.split('\n').filter(line => line.trim().length > 0).map((line, lineIdx) => {
                          // Handle list items nicely
                          const isListItem = line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line);
                          let textToRender = line;
                          let prefix = null;
                          
                          if (line.startsWith('-') || line.startsWith('*')) {
                            textToRender = line.replace(/^[-*]\s+/, '');
                            prefix = <span style={{ color: accentColor, marginRight: '6px' }}>•</span>;
                          } else {
                            const match = line.match(/^(\d+\.)\s+/);
                            if (match) {
                              textToRender = line.replace(/^\d+\.\s+/, '');
                              prefix = <span style={{ color: accentColor, fontFamily: 'var(--font-mono)', fontWeight: 'bold', marginRight: '6px' }}>{match[1]}</span>;
                            }
                          }
                          
                          return (
                            <div key={lineIdx} style={{ 
                              display: 'flex', 
                              alignItems: 'flex-start',
                              marginLeft: isListItem ? '8px' : '0',
                              textAlign: 'left'
                            }}>
                              {prefix}
                              <span style={{ flex: 1 }}>{formatCritiqueText(textToRender)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Detailed Q&A Scrollable Timeline (Screenshot 5 list) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', fontWeight: '800', color: '#fff', marginBottom: '15px' }}>
              Detailed Q&A
            </h4>

            {/* Hemz ML Neural Pipeline Status Header Bar */}
            <div style={{
              background: 'rgba(5, 6, 15, 0.7)',
              border: '1px solid ' + (
                mlStatus === 'READY' ? 'rgba(0, 255, 135, 0.3)' :
                mlStatus === 'LOADING' ? 'rgba(255, 0, 127, 0.3)' :
                mlStatus === 'ERROR' ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 255, 255, 0.1)'
              ),
              borderRadius: '8px',
              padding: '12px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: mlStatus === 'READY' ? '0 0 15px rgba(0, 255, 135, 0.05)' :
                         mlStatus === 'LOADING' ? '0 0 15px rgba(255, 0, 127, 0.05)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={16} className={mlStatus === 'LOADING' ? 'pulse-fast' : ''} style={{
                  color: mlStatus === 'READY' ? 'var(--emerald-neon)' :
                         mlStatus === 'LOADING' ? 'var(--pink-neon)' : 'var(--text-muted)'
                }} />
                <div>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold', 
                    letterSpacing: '1px',
                    color: mlStatus === 'READY' ? 'var(--emerald-neon)' :
                           mlStatus === 'LOADING' ? 'var(--pink-neon)' : 'var(--text-muted)'
                  }}>
                    {mlStatus === 'LOADING' && `[HEMZ ML ENGINE: INITIALIZING NEURAL PIPELINE ${mlProgress}%]`}
                    {mlStatus === 'READY' && `[HEMZ ML ENGINE: CLASSIFIER DISTILBERT IS ONLINE & CACHED]`}
                    {mlStatus === 'ERROR' && `[HEMZ ML ENGINE: CDN ERROR - RUNNING FAILSAME ML FALLBACK]`}
                    {mlStatus === 'UNINITIALIZED' && `[HEMZ ML ENGINE: STANDBY]`}
                  </span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                    {mlStatus === 'LOADING' && 'Downloading classifier (~25MB) to client Cache Storage. Zero external API cost.'}
                    {mlStatus === 'READY' && 'On-device speech tone & sentiment evaluation active. 100% private.'}
                    {mlStatus === 'ERROR' && 'Network limits or offline mode detected. Simulated ML metrics activated.'}
                    {mlStatus === 'UNINITIALIZED' && 'Awaiting session report data processing...'}
                  </p>
                </div>
              </div>
              
              {/* Progress or Status Pill */}
              <div style={{
                background: mlStatus === 'READY' ? 'rgba(0, 255, 135, 0.1)' :
                            mlStatus === 'LOADING' ? 'rgba(255, 0, 127, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                border: '1px solid ' + (
                  mlStatus === 'READY' ? 'var(--emerald-neon)' :
                  mlStatus === 'LOADING' ? 'var(--pink-neon)' : 'rgba(255, 193, 7, 0.5)'
                ),
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.55rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 'bold',
                color: mlStatus === 'READY' ? 'var(--emerald-neon)' :
                       mlStatus === 'LOADING' ? 'var(--pink-neon)' : '#ffc107',
                textTransform: 'uppercase'
              }}>
                {mlStatus}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative', paddingLeft: '45px' }}>
              
              {/* Vertical connecting timeline line */}
              <div style={{
                position: 'absolute',
                top: '15px',
                bottom: '15px',
                left: '20px',
                width: '2px',
                background: 'rgba(0, 242, 254, 0.15)',
                zIndex: 0
              }} />

              {qaEvaluations.map((qa, index) => (
                <div key={index} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  {/* Timeline bullet tag Q1, Q2 etc */}
                  <div style={{
                    position: 'absolute',
                    left: '-45px',
                    top: '2px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0, 242, 254, 0.1)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    color: 'var(--cyan-neon)',
                    zIndex: 1,
                    boxShadow: '0 0 10px rgba(0, 242, 254, 0.1)'
                  }}>
                    Q{index + 1}
                  </div>

                  {/* Question Text */}
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                      Q{index + 1}: {qa.question}
                    </h5>
                  </div>

                  {/* Candidate Answer Card ("YOU SAID") */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.45)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '18px 22px',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.02)'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '0.62rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 'bold',
                      color: 'var(--cyan-neon)',
                      textTransform: 'uppercase',
                      marginBottom: '8px'
                    }}>
                      YOU SAID
                    </div>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      margin: 0,
                      fontStyle: 'italic',
                      fontWeight: '500'
                    }}>
                      "{qa.userTranscript || 'Silent response or skipped'}"
                    </p>

                    {/* Real-time client-side ML Sub-panel */}
                    {mlResults[index] && (
                      <div style={{
                        marginTop: '12px',
                        background: 'rgba(10, 12, 30, 0.95)',
                        border: '1px solid rgba(0, 242, 254, 0.2)',
                        borderRadius: '8px',
                        padding: '12px 14px',
                        color: '#fff',
                        boxShadow: '0 0 10px rgba(0, 242, 254, 0.05)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Cpu size={12} style={{ color: 'var(--cyan-neon)' }} />
                            <span style={{
                              fontSize: '0.55rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 'bold',
                              color: 'var(--cyan-neon)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              HEMZ ML TONE ANALYSIS
                            </span>
                          </div>
                          <span style={{
                            fontSize: '0.55rem',
                            fontFamily: 'var(--font-mono)',
                            color: mlResults[index].label === 'POSITIVE' ? 'var(--emerald-neon)' : 'var(--pink-neon)',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}>
                            {mlResults[index].tone}
                          </span>
                        </div>

                        {/* Metrics details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Accuracy Confidence:</span>
                            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 'bold' }}>
                              {mlResults[index].confidence}% Accuracy Rating
                            </span>
                          </div>
                          
                          {/* Visual glowing bar */}
                          <div style={{
                            width: '100%',
                            height: '4px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: mlResults[index].confidence + '%',
                              height: '100%',
                              background: mlResults[index].label === 'POSITIVE' ? 'var(--emerald-neon)' : 'var(--pink-neon)',
                              boxShadow: '0 0 8px ' + (mlResults[index].label === 'POSITIVE' ? 'var(--emerald-neon)' : 'var(--pink-neon)')
                            }} />
                          </div>

                          <p style={{
                            fontSize: '0.68rem',
                            color: '#d1d5db',
                            margin: '4px 0 0 0',
                            lineHeight: '1.3',
                            fontStyle: 'normal'
                          }}>
                            {mlResults[index].feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Recommendation Card ("AI RECOMMENDATION") */}
                  <div style={{
                    background: 'rgba(127, 0, 255, 0.03)',
                    border: '1px solid rgba(127, 0, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '18px 22px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{
                        display: 'inline-block',
                        background: 'rgba(127, 0, 255, 0.08)',
                        border: '1px solid rgba(127, 0, 255, 0.2)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '0.62rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'bold',
                        color: 'var(--purple-neon)',
                        textTransform: 'uppercase'
                      }}>
                        AI RECOMMENDATION
                      </div>
                      
                      {/* Integrated Voice-Over TTS Button */}
                      <button 
                        onClick={() => playSuggestedAnswer(index, qa.suggestedAnswer)}
                        style={{
                          background: playingSuggested === index ? 'rgba(0, 255, 135, 0.15)' : 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(127, 0, 255, 0.2)',
                          borderRadius: '6px',
                          padding: '3px 10px',
                          color: '#fff',
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.3s'
                        }}
                      >
                        <Volume2 size={12} style={{ color: 'var(--cyan-neon)' }} />
                        {playingSuggested === index ? 'STOP AUDIO' : 'VOICE OVER'}
                      </button>
                    </div>

                    <p style={{
                      fontSize: '0.85rem',
                      color: '#d1d5db',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {qa.suggestedAnswer}
                    </p>
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* Bottom control Return to Hub */}
          <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '10px' }}>
            <button className="btn-cyber btn-cyber-secondary" style={{ flex: '1', padding: '12px' }} onClick={onHome}>
              Return to Hub
            </button>
          </div>

        </div>
      )}

      {/* Embedded Waving CSS Keyframes */}
      <style>{`
        @keyframes wavingArm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-35deg); }
        }
      `}</style>

    </div>
  );
}
