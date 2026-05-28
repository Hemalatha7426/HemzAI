import { useState, useEffect } from 'react';
import { Shield, Sparkles, AudioLines, PlusCircle, History, RefreshCw, BarChart3, Award, Calendar, ChevronRight, HelpCircle, ChevronDown, ChevronUp, LogOut, Trash2, Sun, Moon, Code, Database, Globe } from 'lucide-react';
import ResumeScanner from './components/ResumeScanner';
import ChamberConfig from './components/ChamberConfig';
import InterviewChamber from './components/InterviewChamber';
import DiagnosticDashboard from './components/DiagnosticDashboard';
import AuthHub from './components/AuthHub';
import UserProfile from './components/UserProfile';
import ChibiCopilot from './components/ChibiCopilot';
import DsaPlayground from './components/DsaPlayground';
import SqlPlayground from './components/SqlPlayground';
import NetworksTheory from './components/NetworksTheory';

const faqs = [
  {
    q: "How does the AI Mock Interview Chamber and Speech-to-Text evaluation work?",
    a: "Hemz AI scans your resume capabilities to dynamically build basic 7-question Warmup practices or comprehensive 15-question tracks. Utilizing direct client-side Web Speech APIs, vocal responses are transcribed synchronously with zero network latency. A Spring Boot cognitive grading engine evaluates your answers on technical vocabulary, structural completeness, and contextual coherence."
  },
  {
    q: "What does the Biometric Setup lock and Face Presence Telemetry measure?",
    a: "To ensure exam integrity, the interview chamber config locks entry until your webcam feed is enabled. Our high-fidelity in-browser biometric analyzer runs a 300ms loop executing spatial grid block density checks, skin-tone luma standard deviation, and pixel gradients to verify face presence and prevent backdrop false positives. For strict candidate privacy, webcam hardware tracks are deactivated instantly upon completing your final round."
  },
  {
    q: "What features are included in the exclusive C++ & Java DSA Playground?",
    a: "The DSA Playground supports 96 high-frequency LeetCode questions across 14 categories, restricted exclusively to C++ and Java. It features dynamic signature boilerplate builders, an optimal solution template drawer with Big-O complexity tables, an in-browser sandbox runner with transpiled JavaScript compilation, and an interactive milestone achievement success modal."
  },
  {
    q: "How does the SQL Prep Chamber execute queries on the client side?",
    a: "The SQL Prep Chamber curates 68 essential database queries across 7 categories. It implements a secure client-side sandbox utilizing the in-memory AlaSQL engine loaded with mock relational tables. The workspace includes dynamically commented schema structure headers, a [Reset Code] control, and an interactive SQL success dashboard modal."
  },
  {
    q: "How do I use the Networks Prep PDF note reader and Hamming Parity simulator?",
    a: "Under the Networks Prep tab, you can read the comprehensive study guide directly within a fully responsive, interactive in-browser PDF viewer. You can then validate your placement readiness in the 50-question MCQ practice chamber (10 per unit) or simulate mathematical error correction using the live 7-bit Hamming Code (hashcode) generator."
  },
  {
    q: "Are my scanned resumes, code submissions, and practice logs secure?",
    a: "100%. Scanned resumes, voice transcripts, code solutions, and interview diagnostics reside securely in your local system's private storage ecosystem and local MongoDB databases. The application also supports an ultra-premium glassmorphic theme switcher that dynamically adjusts layout borders, ambient watercolor glows, and contrast variables for maximum readability."
  }
];

const wisdomSlides = [
  {
    image: "/images/straw_hat_girl.png",
    quote: "The opposite of winning is not losing—it is learning! Every step you take, every query you run, and every mock session you complete is building your bridge to engineering mastery. Be happy to start!",
    author: "Chibi Reader",
    color: "var(--yellow-neon)",
    bgGlow: "rgba(245, 158, 11, 0.05)"
  },
  {
    image: "/images/chibi_proud.png",
    quote: "Be proud of yourself because only you know your struggle. Your resilience and daily effort is building an incredibly brilliant professional path.",
    author: "Resolute Developer",
    color: "var(--purple-neon)",
    bgGlow: "rgba(139, 92, 246, 0.05)"
  },
  {
    image: "/images/chibi_peace.png",
    quote: "Peace isn't found in the absence of challenges, but in the clarity of your calm heart. Let a calm mind guide your engineering solutions today.",
    author: "Peaceful Mind",
    color: "var(--emerald-neon)",
    bgGlow: "rgba(16, 185, 129, 0.05)"
  },
  {
    image: "/images/chibi_joyful.png",
    quote: "A happy heart naturally attracts success. Let your learning journey be full of curiosity, wonder, and the pure joy of creating.",
    author: "Joyful Creator",
    color: "var(--pink-neon)",
    bgGlow: "rgba(236, 72, 153, 0.05)"
  },
  {
    image: "/images/warmup.png",
    quote: "What is yours will always find you. Keep putting in the effort, sharpening your technical tools, and the right engineering role will meet your preparation.",
    author: "System Configurator",
    color: "var(--yellow-neon)",
    bgGlow: "rgba(245, 158, 11, 0.05)"
  },
  {
    image: "/images/peeking.png",
    quote: "Every technical challenge in interview preparation builds the deep engineering expertise and technical intuition that defines your lifetime career.",
    author: "Career Counselor",
    color: "var(--cyan-neon)",
    bgGlow: "rgba(6, 182, 212, 0.05)"
  }
];

function ChibiWisdomCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % wisdomSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const slide = wisdomSlides[currentIndex];

  return (
    <div className="glass-panel" style={{
      padding: '30px 40px',
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: '30px',
      alignItems: 'center',
      border: `1px solid rgba(255, 255, 255, 0.08)`,
      borderLeft: `4px solid ${slide.color}`,
      background: `rgba(17, 24, 39, 0.65)`,
      boxShadow: `0 12px 30px rgba(0, 0, 0, 0.25), 0 0 20px ${slide.bgGlow}`,
      transition: 'all 0.5s ease-in-out',
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Soft Glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '200px',
        height: '200px',
        background: `radial-gradient(circle, ${slide.bgGlow} 0%, transparent 70%)`,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Slide Image */}
      <div style={{
        width: '110px',
        height: '110px',
        borderRadius: '50%',
        border: `1px solid ${slide.color}`,
        boxShadow: `0 0 15px ${slide.color}33`,
        background: 'rgba(17, 24, 39, 0.8)',
        padding: '4px',
        overflow: 'hidden',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
          <img src={slide.image} alt={slide.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Slide Quote Text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1, textAlign: 'left' }}>
        <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: slide.color, fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
          DAILY MOCK MENTORSHIP & WISDOM
        </span>
        <p style={{ fontSize: '0.95rem', fontStyle: 'italic', fontWeight: '500', color: 'var(--text-primary)', lineHeight: '1.5', margin: 0 }}>
          "{slide.quote}"
        </p>

      </div>

      {/* Dots Indicator */}
      <div style={{ position: 'absolute', bottom: '15px', right: '25px', display: 'flex', gap: '6px', zIndex: 1 }}>
        {wisdomSlides.map((_, idx) => (
          <span 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: idx === currentIndex ? '16px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: idx === currentIndex ? slide.color : 'rgba(255, 255, 255, 0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("hemz_theme") || "dark");
  const [appState, setAppState] = useState('AUTH'); // AUTH -> HUB -> PROFILE | SCAN -> CONFIG -> PREVIEW -> CHAMBER -> DIAGNOSTIC
  const [user, setUser] = useState(null);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("hemz_theme", theme);
  }, [theme]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [configData, setConfigData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchSessionHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('http://localhost:8080/api/interviews/history');
      if (response.ok) {
        const dbHistory = await response.json();
        setHistory(dbHistory);
      } else {
        throw new Error();
      }
    } catch {
      console.warn("Backend API offline. Loading history from local storage storage.");
      const localHistory = JSON.parse(localStorage.getItem('aura_history') || '[]');
      setHistory(localHistory);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load Session history on Hub Mount
  useEffect(() => {
    if (appState === 'HUB') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSessionHistory();
    }
  }, [appState]);

  const handleScanComplete = (data) => {
    setParsedData(data);
    setAppState('CONFIG');
  };
  const handleSessionComplete = (data) => {
    setReportData(data);
    setAppState('DIAGNOSTIC');
  };

  const openPastSession = (session) => {
    setReportData(session);
    setAppState('DIAGNOSTIC');
  };

  const handleDeleteSession = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this session log?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/interviews/session/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setHistory(prev => prev.filter(sess => sess.id !== id));
      } else {
        throw new Error();
      }
    } catch {
      console.warn("Backend API offline. Deleting session from local storage.");
      const localHistory = JSON.parse(localStorage.getItem('aura_history') || '[]');
      const updatedHistory = localHistory.filter(sess => sess.id !== id);
      localStorage.setItem('aura_history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }
  };

  // Calculate quick hub metrics
  const totalRuns = history.length;
  const avgScore = totalRuns > 0 
    ? Math.round(history.reduce((sum, item) => sum + (item.overallScore || 0), 0) / totalRuns) 
    : 0;
  
  const getRating = (score) => {
    if (score >= 85) return 'EXPERT';
    if (score >= 70) return 'PROFICIENT';
    return 'DEVELOPING';
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', padding: '40px 20px' }}>
      {/* Background Orbs */}
      <div className="orbital-orb orb-cyan" />
      <div className="orbital-orb orb-purple" />
      <div className="orbital-orb orb-pink" />

      {/* Main Container */}
      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Futuristic Global Header */}
        <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px', background: 'var(--panel-bg)', padding: '16px 24px', borderRadius: '16px', border: 'var(--glass-border)', backdropFilter: 'blur(8px)' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: (user && appState !== 'AUTH') ? 'pointer' : 'default' }} 
            onClick={() => { if (user && appState !== 'AUTH') setAppState('HUB'); }}
          >
            <AudioLines size={30} style={{ color: 'var(--cyan-neon)', filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))' }} />
            <div>
              <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '1px', color: 'var(--text-primary)' }}>
                HEMZ AI
              </h1>
              <p style={{ fontSize: '0.62rem', fontFamily: 'var(--font-sans)', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
                YOU WILL WIN, NOT IMMEDIATELY BUT DEFINITELY.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Elegant Glass theme toggler */}
            <button
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'var(--cyan-neon)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
              title="Toggle theme mode"
            >
              {theme === 'dark' ? <Sun size={15} style={{ color: 'var(--yellow-neon)' }} /> : <Moon size={15} style={{ color: 'var(--purple-neon)' }} />}
            </button>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* DSA Playground navigation pill */}
                <button
                  onClick={() => setAppState(appState === 'DSA_PLAYGROUND' ? 'HUB' : 'DSA_PLAYGROUND')}
                  style={{
                    background: appState === 'DSA_PLAYGROUND' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    borderRadius: '10px',
                    padding: '6px 14px',
                    color: 'var(--cyan-neon)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: appState === 'DSA_PLAYGROUND' ? '0 0 10px rgba(0, 242, 254, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 242, 254, 0.1)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 242, 254, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = appState === 'DSA_PLAYGROUND' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.boxShadow = appState === 'DSA_PLAYGROUND' ? '0 0 10px rgba(0, 242, 254, 0.3)' : 'none';
                  }}
                >
                  <Code size={13} />
                  {appState === 'DSA_PLAYGROUND' ? 'EXIT PLAYGROUND' : 'DSA PLAYGROUND'}
                </button>

                {/* SQL Playground navigation pill */}
                <button
                  onClick={() => setAppState(appState === 'SQL_PLAYGROUND' ? 'HUB' : 'SQL_PLAYGROUND')}
                  style={{
                    background: appState === 'SQL_PLAYGROUND' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '10px',
                    padding: '6px 14px',
                    color: 'var(--purple-neon)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: appState === 'SQL_PLAYGROUND' ? '0 0 10px rgba(139, 92, 246, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = appState === 'SQL_PLAYGROUND' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.boxShadow = appState === 'SQL_PLAYGROUND' ? '0 0 10px rgba(139, 92, 246, 0.3)' : 'none';
                  }}
                >
                  <Database size={13} />
                  {appState === 'SQL_PLAYGROUND' ? 'EXIT PLAYGROUND' : 'SQL PLAYGROUND'}
                </button>

                {/* Networks Prep navigation pill */}
                <button
                  onClick={() => setAppState(appState === 'NETWORKS_THEORY' ? 'HUB' : 'NETWORKS_THEORY')}
                  style={{
                    background: appState === 'NETWORKS_THEORY' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '10px',
                    padding: '6px 14px',
                    color: 'var(--yellow-neon)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: appState === 'NETWORKS_THEORY' ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = appState === 'NETWORKS_THEORY' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.boxShadow = appState === 'NETWORKS_THEORY' ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none';
                  }}
                >
                  <Globe size={13} />
                  {appState === 'NETWORKS_THEORY' ? 'EXIT PLAYGROUND' : 'NETWORKS PREP'}
                </button>

                {/* Glowing Profile Avatar pill */}
                <div 
                  onClick={() => setAppState('PROFILE')}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--purple-neon)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: '#ffffff',
                    boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 0 14px rgba(139, 92, 246, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.4)';
                  }}
                >
                  {user.charAt(0).toUpperCase()}
                </div>

                {/* Glowing Cyber Logout Button */}
                <button 
                  onClick={() => {
                    setShowLogoutConfirm(true);
                  }}
                  style={{
                    background: 'rgba(236, 72, 153, 0.08)',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    color: 'var(--pink-neon)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--pink-neon)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(236, 72, 153, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(236, 72, 153, 0.08)';
                    e.currentTarget.style.color = 'var(--pink-neon)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <LogOut size={11} />
                  DISCONNECT
                </button>
              </div>
            )}
          </div>
        </header>


        {/* Dynamic Route Orchestrator */}
        {appState === 'HUB' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Massive Glowing Hero Area */}
            <div className="glass-panel dot-grid float-animation" style={{ padding: '50px 40px', textAlign: 'center', borderBottom: '1px solid rgba(0, 242, 254, 0.2)' }}>
              <div className="scanner-overlay" style={{ opacity: 0.1 }} />
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.2)', padding: '6px 16px', borderRadius: '30px', marginBottom: '20px' }}>
                <Sparkles size={14} style={{ color: 'var(--cyan-neon)' }} />
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 'bold', letterSpacing: '1px' }}>
                  NEXT-GEN MOCK INTERVIEWS ACTIVATED
                </span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '2.8rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: '1.1', marginBottom: '15px' }}>
                Perfect Your Interviews Through <br />
                <span style={{ background: 'linear-gradient(90deg, var(--cyan-neon), var(--purple-neon))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="text-glow-cyan">
                  Immersive Voice Fields
                </span>
              </h2>

              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 30px auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Hemz AI is a vocal training chamber that scans your professional resume, synthesizes custom technical/HR prompts, transcribes your spoken answers, and delivers complete diagnostic grades.
              </p>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-cyber btn-cyber-pink" style={{ padding: '16px 36px', fontSize: '0.95rem' }} onClick={() => setAppState('SCAN')}>
                  ENTER THE CHAMBERS <PlusCircle size={20} />
                </button>
              </div>
            </div>

            {/* Quick Metrics Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '25px' }}>
              <div className="glass-panel" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.15)', color: 'var(--cyan-neon)' }}>
                  <BarChart3 size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>Total Runs</p>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalRuns}</h4>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 0, 127, 0.08)', border: '1px solid rgba(255, 0, 127, 0.15)', color: 'var(--pink-neon)' }}>
                  <Award size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>Avg Hemz Index</p>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{avgScore}%</h4>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0, 255, 135, 0.08)', border: '1px solid rgba(0, 255, 135, 0.15)', color: 'var(--emerald-neon)' }}>
                  <Shield size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>Overall Standing</p>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{getRating(avgScore)}</h4>
                </div>
            </div>
          </div>

          {/* Daily Coding Wisdom & Chibi Mentorship Carousel */}
            <ChibiWisdomCarousel />
            
            {/* Session History Log List */}
            <div className="glass-panel dot-grid" style={{ padding: '35px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <History size={18} style={{ color: 'var(--cyan-neon)' }} /> SESSION CHAMBER LOGS
                </h3>
                <button 
                  onClick={fetchSessionHistory}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--cyan-neon)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <RefreshCw size={12} style={{ animation: loadingHistory ? 'spin 1.5s linear infinite' : 'none' }} />
                  REFRESH LOGS
                </button>
              </div>

              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed var(--glass-border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                  <History size={36} style={{ marginBottom: '15px', color: 'var(--text-muted)' }} />
                  <p style={{ fontSize: '0.9rem' }}>No historical transcripts found. Enter the vocal chamber to record your first run!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {history.map((sess) => (
                    <div 
                      key={sess.id}
                      onClick={() => openPastSession(sess)}
                      style={{
                        background: 'rgba(5, 6, 15, 0.4)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--cyan-neon)';
                        e.currentTarget.style.background = 'rgba(0, 242, 254, 0.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                        e.currentTarget.style.background = 'rgba(5, 6, 15, 0.4)';
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{sess.candidateName || 'Anonymous'}</span>
                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(0, 242, 254, 0.3)', color: 'var(--cyan-neon)', background: 'rgba(0, 242, 254, 0.05)', fontFamily: 'var(--font-mono)' }}>
                            {sess.track}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> {sess.timestamp ? new Date(sess.timestamp).toLocaleDateString() : 'Active Session'}
                          </span>
                          <span>
                            Grade: {sess.experienceLevel || 'Mid'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button
                          onClick={(e) => handleDeleteSession(sess.id, e)}
                          title="Delete Session Log"
                          style={{
                            background: 'rgba(255, 0, 127, 0.03)',
                            border: '1px solid rgba(255, 0, 127, 0.15)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgba(255, 0, 127, 0.65)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            marginRight: '5px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 0, 127, 0.15)';
                            e.currentTarget.style.color = 'var(--pink-neon)';
                            e.currentTarget.style.borderColor = 'var(--pink-neon)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 127, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 0, 127, 0.03)';
                            e.currentTarget.style.color = 'rgba(255, 0, 127, 0.65)';
                            e.currentTarget.style.borderColor = 'rgba(255, 0, 127, 0.15)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Trash2 size={14} />
                        </button>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: '900', color: sess.overallScore >= 80 ? 'var(--emerald-neon)' : sess.overallScore >= 65 ? 'var(--cyan-neon)' : 'var(--pink-neon)' }}>
                            {sess.overallScore}%
                          </div>
                          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Hemz index
                          </div>
                        </div>
                        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          {/* FAQs Panel */}
          <div className="glass-panel dot-grid" style={{ padding: '35px' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '1px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HelpCircle size={18} style={{ color: 'var(--pink-neon)' }} /> VOCAL CHAMBER FAQ DATABASE
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {faqs.map((faq, index) => {
                const isExpanded = expandedFaq === index;
                return (
                  <div 
                    key={index}
                    style={{
                      background: 'rgba(5, 6, 15, 0.4)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div 
                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                      style={{
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        background: isExpanded ? 'rgba(0, 242, 254, 0.03)' : 'transparent',
                        transition: 'all 0.3s'
                      }}
                    >
                      <span style={{ fontSize: '0.92rem', fontWeight: '600', color: isExpanded ? 'var(--cyan-neon)' : '#fff' }}>
                        {faq.q}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={16} style={{ color: 'var(--cyan-neon)' }} />
                      ) : (
                        <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>

                    <div 
                      style={{
                        maxHeight: isExpanded ? '300px' : '0',
                        opacity: isExpanded ? 1 : 0,
                        padding: isExpanded ? '15px 20px 20px 20px' : '0 20px',
                        borderTop: isExpanded ? '1px solid rgba(0, 242, 254, 0.08)' : 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '0.82rem',
                        lineHeight: '1.6',
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        overflow: 'hidden'
                      }}
                    >
                      {faq.a}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          </div>
        )}

        {appState === 'AUTH' && (
          <AuthHub onLoginSuccess={(username) => {
            setUser(username);
            setAppState('HUB');
            setShowLoginSuccess(true);
          }} />
        )}

        {appState === 'SCAN' && (
          <ResumeScanner onScanComplete={handleScanComplete} />
        )}

        {appState === 'CONFIG' && (
          <ChamberConfig 
            parsedData={parsedData} 
            onConfigComplete={(config) => {
              setConfigData(config);
              setAppState('CHAMBER');
            }} 
            onBack={() => setAppState('SCAN')}
          />
        )}

        {appState === 'CHAMBER' && (
          <InterviewChamber 
            parsedData={parsedData} 
            configData={configData} 
            onSessionComplete={handleSessionComplete}
            onQuit={() => setAppState('HUB')}
          />
        )}

        {appState === 'DIAGNOSTIC' && (
          <DiagnosticDashboard 
            reportData={reportData} 
            onRestart={() => setAppState('SCAN')}
            onHome={() => setAppState('HUB')}
          />
        )}

        {appState === 'PROFILE' && (
          <UserProfile 
            parsedData={parsedData || { candidateName: user, skills: ["React", "Spring Boot", "Java", "MongoDB", "CORS"] }} 
            history={history}
            onBack={() => setAppState('HUB')}
            onViewPastSession={openPastSession}
            onDeleteSession={handleDeleteSession}
          />
        )}

        {appState === 'DSA_PLAYGROUND' && (
          <DsaPlayground 
            onBack={() => setAppState('HUB')}
          />
        )}

        {appState === 'SQL_PLAYGROUND' && (
          <SqlPlayground 
            onBack={() => setAppState('HUB')}
          />
        )}

        {appState === 'NETWORKS_THEORY' && (
          <NetworksTheory 
            onBack={() => setAppState('HUB')}
          />
        )}

        {/* Global Floating Chibi CoPilot Mentorship Chat */}
        <ChibiCopilot />

      </div>

      {/* Glassmorphic Login Success Modal with Chibi and Quote */}
      {showLoginSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 6, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'modalFadeIn 0.3s ease-out'
        }}>
          <style>{`
            @keyframes modalFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes modalScaleIn {
              from { transform: scale(0.9) translateY(10px); opacity: 0; }
              to { transform: scale(1) translateY(0); opacity: 1; }
            }
          `}</style>
          
          <div className="glass-panel" style={{
            maxWidth: '480px',
            width: '90%',
            padding: '30px',
            border: '2px solid var(--cyan-neon)',
            boxShadow: '0 0 35px rgba(0, 242, 254, 0.3)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            position: 'relative',
            animation: 'modalScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Header branding */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--cyan-neon)' }} />
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Access Granted • Welcome back
              </span>
            </div>

            {/* Custom Welcome Chibi Image */}
            <div style={{
              border: '3px solid var(--ink-dark)',
              borderRadius: '24px',
              overflow: 'hidden',
              width: '200px',
              height: '200px',
              boxShadow: '6px 6px 0px var(--ink-dark)',
              background: '#fff'
            }}>
              <img 
                src="/images/login_chibi.png" 
                alt="Welcome Back" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Interactive Quotes Area */}
            <div style={{
              background: 'var(--panel-bg)',
              border: '2px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '16px 20px',
              width: '100%',
              boxShadow: 'var(--panel-shadow)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>


              {/* Text Quote representation */}
              <p style={{ margin: 0, fontStyle: 'italic', fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                "Learn from yesterday. Live for today. Hope for tomorrow."
              </p>
            </div>

            {/* Acknowledgment action button */}
            <button 
              onClick={() => setShowLoginSuccess(false)}
              className="btn-cyber btn-cyber-pink"
              style={{ width: '100%', padding: '12px 24px', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              INITIALIZE INTERFACE & ENTER
            </button>
          </div>
        </div>
      )}

      {/* Glassmorphic Logout Confirmation Modal with Chibi and Quote */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 6, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'modalFadeIn 0.3s ease-out'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '480px',
            width: '90%',
            padding: '30px',
            border: '2px solid var(--pink-neon)',
            boxShadow: '0 0 35px rgba(236, 72, 153, 0.25)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            position: 'relative',
            animation: 'modalScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Header branding */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--pink-neon)' }} />
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--pink-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Disconnect Session • Farewell
              </span>
            </div>

            {/* Custom Welcome Chibi Image */}
            <div style={{
              border: '3px solid var(--ink-dark)',
              borderRadius: '24px',
              overflow: 'hidden',
              width: '180px',
              height: '180px',
              boxShadow: '6px 6px 0px var(--ink-dark)',
              background: '#fff'
            }}>
              <img 
                src="/images/logout_chibi.png" 
                alt="Farewell Reading Girl" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Quote Card */}
            <div style={{
              background: 'var(--panel-bg)',
              border: '2px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '16px 20px',
              width: '100%',
              boxShadow: 'var(--panel-shadow)'
            }}>
              <p style={{ margin: 0, fontStyle: 'italic', fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                "All change is hard at first, messy in the middle and gorgeous at the end."
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
              <button 
                onClick={() => {
                  setUser(null);
                  setAppState('AUTH');
                  setShowLogoutConfirm(false);
                }}
                className="btn-cyber btn-cyber-pink"
                style={{ flex: 1, padding: '12px 24px', fontSize: '0.82rem', fontWeight: 'bold' }}
              >
                DISCONNECT
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="btn-cyber btn-cyber-secondary"
                style={{ flex: 1, padding: '12px 24px', fontSize: '0.82rem', fontWeight: 'bold' }}
              >
                STAY CONNECTED
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
