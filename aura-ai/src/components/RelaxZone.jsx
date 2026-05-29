import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Wind, Trophy, RotateCcw, Play, Pause, ChevronLeft, Award } from 'lucide-react';

// Client-Side Web Audio API Ambient Synthesizer
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.oscNodes = [];
    this.gainNodes = [];
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime); // Standard soft level
    this.masterGain.connect(this.ctx.destination);
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!this.ctx) return;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.2, this.ctx.currentTime);
    }
  }

  // Liquid POP synthesizer sound: quick sweeping oscillator
  playPop() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.12); // Sweeps down quickly
      
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t);
      osc.stop(t + 0.13);
    } catch (e) {
      console.warn("Web Audio Pop sound blocked", e);
    }
  }

  // Micro-click flip sound for memory card game
  playFlip() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.setValueAtTime(70, t + 0.02);
      
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {
      console.warn("Web Audio Flip sound blocked", e);
    }
  }

  // Harmonized dual chime sound on successful card match
  playMatch() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 arpeggio
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);
        
        gain.gain.setValueAtTime(0.15, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.35);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.4);
      });
    } catch (e) {
      console.warn("Web Audio Match sound blocked", e);
    }
  }

  // Soft swelling sine wave chord C major add9 (C4 - E4 - G4 - D5) for deep breath-in
  playBreatheIn() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const t = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 587.33]; // C4, E4, G4, D5
      
      this.stopChord();
      
      notes.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        
        // Volume swell
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.08, t + 4.0); // swell up over 4 seconds
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(t);
        
        this.oscNodes.push(osc);
        this.gainNodes.push(gain);
      });
    } catch (e) {
      console.warn("Breathe synth blocked", e);
    }
  }

  // Smooth decay chord transition for breath-out
  playBreatheOut() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const t = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 587.33];
      
      this.stopChord();
      
      notes.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 4.0); // fade out over 4 seconds
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(t);
        
        this.oscNodes.push(osc);
        this.gainNodes.push(gain);
      });
    } catch (e) {
      console.warn("Breathe synth blocked", e);
    }
  }

  stopChord() {
    if (this.oscNodes.length > 0) {
      this.oscNodes.forEach(osc => {
        try {
          osc.stop();
        } catch {}
      });
      this.oscNodes = [];
    }
    this.gainNodes = [];
  }
}

// Master sound object
const synth = new SoundSynthesizer();

export default function RelaxZone({ onBack }) {
  const [activeTab, setActiveTab] = useState('BREATH'); // BREATH | POPPER | MEMORY
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    synth.setMuted(nextMute);
  };

  useEffect(() => {
    // Stop any lingering box breathing chords when leaving the component
    return () => {
      synth.stopChord();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.4s ease-out' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .relax-tab-btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-secondary);
          display: flex;
          alignItems: center;
          gap: 8px;
        }
        .relax-tab-btn.active {
          background: rgba(16, 185, 129, 0.12);
          border-color: var(--emerald-neon);
          color: var(--emerald-neon);
          boxShadow: 0 0 15px rgba(16, 185, 129, 0.25);
        }
        .relax-tab-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
          color: var(--text-primary);
        }
        .breath-ring {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 4s linear;
          z-index: 2;
        }
        .breath-ring::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 75%);
          filter: blur(20px);
          z-index: -1;
          transition: opacity 1s ease;
        }
        .memory-card {
          aspect-ratio: 1;
          perspective: 1000px;
          cursor: pointer;
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .memory-card.flipped .card-inner {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .card-front {
          background: rgba(5, 6, 15, 0.85);
          color: var(--emerald-neon);
          box-shadow: inset 0 0 15px rgba(16, 185, 129, 0.05);
        }
        .card-back {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          color: #fff;
          transform: rotateY(180deg);
          box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Glass header section */}
      <div className="responsive-relax-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--emerald-neon)';
              e.currentTarget.style.color = 'var(--emerald-neon)';
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--emerald-neon)', filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.4))' }} />
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '1px', fontWeight: 'bold' }}>
                RELAX CHAMBER ARCADE
              </h2>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Your calm mind is the ultimate weapon against your challenges. So relax!</p>
          </div>
        </div>

        {/* Global Sound Toggler */}
        <button 
          onClick={toggleMute}
          style={{
            background: isMuted ? 'rgba(236, 72, 153, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            border: `1px solid ${isMuted ? 'rgba(236, 72, 153, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: '10px',
            padding: '8px 16px',
            color: isMuted ? 'var(--pink-neon)' : 'var(--emerald-neon)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.25s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 10px ${isMuted ? 'rgba(236, 72, 153, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          {isMuted ? 'CHAMBER MUTED' : 'CHAMBER AUDIO ON'}
        </button>
      </div>

      {/* Tab select bar */}
      <div className="responsive-relax-tabs">
        <button 
          className={`relax-tab-btn ${activeTab === 'BREATH' ? 'active' : ''}`}
          onClick={() => { synth.stopChord(); setActiveTab('BREATH'); }}
        >
          <Wind size={14} /> PRANA FIELD (BREATHING)
        </button>
        <button 
          className={`relax-tab-btn ${activeTab === 'POPPER' ? 'active' : ''}`}
          onClick={() => { synth.stopChord(); setActiveTab('POPPER'); }}
        >
          🫧 AURA POPPER (BUBBLES)
        </button>
        <button 
          className={`relax-tab-btn ${activeTab === 'MEMORY' ? 'active' : ''}`}
          onClick={() => { synth.stopChord(); setActiveTab('MEMORY'); }}
        >
          🧩 COGNITIVE HARMONY
        </button>
      </div>

      {/* Content views */}
      <div className="glass-panel" style={{ minHeight: '480px', display: 'flex', alignItems: 'stretch' }}>
        {activeTab === 'BREATH' && <BreathingGuide />}
        {activeTab === 'POPPER' && <BubblePopper />}
        {activeTab === 'MEMORY' && <MemoryMatch />}
      </div>
    </div>
  );
}

// 🫁 BREATHING GUIDE SUB-COMPONENT
function BreathingGuide() {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleStep, setCycleStep] = useState(0); // 0: Inhale, 1: Hold (Full), 2: Exhale, 3: Hold (Empty)
  const [secondsLeft, setSecondsLeft] = useState(4);
  const cycleTimerRef = useRef(null);

  // Cycle Configuration: [Text, Duration, Ring Scale, Neon Color]
  const steps = [
    { text: "Breathe In...", scale: 1.7, color: 'var(--cyan-neon)', shadow: 'rgba(6, 182, 212, 0.4)' },
    { text: "Hold...", scale: 1.7, color: 'var(--emerald-neon)', shadow: 'rgba(16, 185, 129, 0.4)' },
    { text: "Breathe Out...", scale: 1.0, color: 'var(--purple-neon)', shadow: 'rgba(139, 92, 246, 0.4)' },
    { text: "Hold...", scale: 1.0, color: 'var(--pink-neon)', shadow: 'rgba(236, 72, 153, 0.4)' }
  ];

  const currentStep = steps[cycleStep];

  useEffect(() => {
    if (isRunning) {
      // Trigger synthesizers synchronously on state boundaries
      if (cycleStep === 0) {
        synth.playBreatheIn();
      } else if (cycleStep === 2) {
        synth.playBreatheOut();
      } else {
        synth.stopChord();
      }

      cycleTimerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setCycleStep(old => (old + 1) % 4);
            return 4; // Reset to 4 seconds box duration
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      synth.stopChord();
      clearInterval(cycleTimerRef.current);
    }

    return () => {
      clearInterval(cycleTimerRef.current);
    };
  }, [isRunning, cycleStep]);

  const toggleGuide = () => {
    if (!isRunning) {
      setIsRunning(true);
      setCycleStep(0);
      setSecondsLeft(4);
    } else {
      setIsRunning(false);
      synth.stopChord();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    synth.stopChord();
    setCycleStep(0);
    setSecondsLeft(4);
  };

  return (
    <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '30px', background: 'rgba(5, 6, 15, 0.1)', textAlign: 'center' }}>
      <div style={{ maxWidth: '480px' }}>
        <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald-neon)', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Mindfulness Chamber
        </span>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '5px', marginBottom: '12px' }}>Box Breathing Alignment</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
          Align your respiratory nodes with our rhythmic synthesizer to downregulate stress response triggers. Box breathing (4s cycle) is utilized by top performers to reset logical focus.
        </p>
      </div>

      {/* Rhythmic Pulsing Ring */}
      <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%' }}>
        <div 
          className="breath-ring" 
          style={{
            transform: `scale(${isRunning ? currentStep.scale : 1.0})`,
            border: `3px solid ${isRunning ? currentStep.color : 'rgba(255, 255, 255, 0.08)'}`,
            boxShadow: isRunning ? `0 0 25px ${currentStep.color}33, inset 0 0 20px ${currentStep.color}15` : 'none',
            background: isRunning ? 'rgba(5, 6, 15, 0.65)' : 'rgba(5, 6, 15, 0.3)',
            transition: isRunning ? 'transform 4s linear, border-color 0.5s ease, box-shadow 0.5s ease' : 'all 0.5s ease'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: isRunning ? '1.4rem' : '0.9rem',
              fontWeight: '800',
              color: isRunning ? currentStep.color : 'var(--text-muted)',
              textShadow: isRunning ? `0 0 8px ${currentStep.color}40` : 'none',
              transition: 'all 0.5s'
            }}>
              {isRunning ? currentStep.text : 'STANDBY'}
            </span>
            {isRunning && (
              <span style={{ fontSize: '1.8rem', fontWeight: '900', fontFamily: 'var(--font-mono)', color: '#fff' }}>
                {secondsLeft}s
              </span>
            )}
          </div>
        </div>

        {/* Floating watercolor glow blobs behind */}
        {isRunning && (
          <div style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${currentStep.shadow} 0%, transparent 65%)`,
            zIndex: 0,
            opacity: 0.6,
            pointerEvents: 'none',
            transition: 'background 0.8s ease'
          }} />
        )}
      </div>

      {/* Breathing controllers */}
      <div style={{ display: 'flex', gap: '15px' }}>
        <button 
          onClick={toggleGuide}
          className="btn-cyber"
          style={{ 
            background: isRunning ? 'linear-gradient(135deg, var(--pink-neon), var(--purple-neon))' : 'linear-gradient(135deg, var(--emerald-neon), var(--purple-neon))',
            boxShadow: isRunning ? '0 4px 14px rgba(236, 72, 153, 0.2)' : '0 4px 14px rgba(16, 185, 129, 0.2)',
            padding: '12px 28px',
            fontSize: '0.8rem'
          }}
        >
          {isRunning ? <Pause size={14} /> : <Play size={14} />}
          {isRunning ? 'PAUSE SESSION' : 'INITIALIZE CYCLES'}
        </button>
        <button 
          onClick={handleReset}
          className="btn-cyber btn-cyber-secondary"
          style={{ padding: '12px 20px', fontSize: '0.8rem' }}
        >
          <RotateCcw size={14} /> RESET
        </button>
      </div>
    </div>
  );
}

// 🫧 AURA POPPER SUB-COMPONENT (HIGH PERFORMANCE HTML5 CANVAS)
function BubblePopper() {
  const canvasRef = useRef(null);
  const [popCount, setPopCount] = useState(0);
  const bubblesRef = useRef([]);
  const particlesRef = useRef([]);
  const requestRef = useRef(null);

  // Dimensions of canvas
  const CANVAS_WIDTH = 680;
  const CANVAS_HEIGHT = 440;

  // Spawns a beautiful glass bubble
  const createBubble = (forceBottom = false) => {
    const radius = Math.random() * 25 + 15;
    const colors = [
      { stroke: 'rgba(6, 182, 212, 0.7)', fill: 'rgba(6, 182, 212, 0.12)' },   // Cyan
      { stroke: 'rgba(16, 185, 129, 0.7)', fill: 'rgba(16, 185, 129, 0.12)' }, // Emerald
      { stroke: 'rgba(139, 92, 246, 0.7)', fill: 'rgba(139, 92, 246, 0.12)' }, // Purple
      { stroke: 'rgba(236, 72, 153, 0.7)', fill: 'rgba(236, 72, 153, 0.12)' }  // Pink
    ];
    const scheme = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      x: Math.random() * (CANVAS_WIDTH - 2 * radius) + radius,
      y: forceBottom ? CANVAS_HEIGHT + radius + 10 : Math.random() * (CANVAS_HEIGHT - 60) + 40,
      r: radius,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 0.6 + 0.4), // Float upwards
      stroke: scheme.stroke,
      fill: scheme.fill,
      wobbleSpeed: Math.random() * 0.05 + 0.01,
      wobbleVal: Math.random() * 100,
      wobbleRange: Math.random() * 3 + 1
    };
  };

  // Click boundary checking and pop trigger
  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    let hit = false;
    // Iterate backwards to pop bubbles rendered on top
    const nextBubbles = [];
    for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
      const b = bubblesRef.current[i];
      const dist = Math.hypot(mouseX - b.x, mouseY - b.y);
      if (!hit && dist <= b.r) {
        // Pop! Play satisfaction pluck
        synth.playPop();
        setPopCount(prev => prev + 1);
        hit = true;

        // Spawn beautiful fading debris particles
        for (let j = 0; j < 12; j++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2 + 1;
          particlesRef.current.push({
            x: b.x,
            y: b.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: Math.random() * 3 + 1,
            color: b.stroke,
            alpha: 1.0,
            decay: Math.random() * 0.03 + 0.02
          });
        }
      } else {
        nextBubbles.push(b);
      }
    }
    bubblesRef.current = nextBubbles.reverse(); // Maintain original list order
  };

  // Clear & reset tank
  const handleResetTank = () => {
    bubblesRef.current = Array.from({ length: 10 }, () => createBubble(false));
    particlesRef.current = [];
    setPopCount(0);
  };

  useEffect(() => {
    // Fill tank with initial bubbles
    bubblesRef.current = Array.from({ length: 8 }, () => createBubble(false));

    // Rhythmic bubble emitter interval
    const emitter = setInterval(() => {
      if (bubblesRef.current.length < 18) {
        bubblesRef.current.push(createBubble(true));
      }
    }, 1800);

    // Canvas animation loop
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear drawing area
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 1. Draw subtle background glass guidelines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      for (let i = 40; i < CANVAS_WIDTH; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }

      // 2. Render and animate bubbles
      bubblesRef.current.forEach(b => {
        // Move bubbles
        b.y += b.vy;
        b.wobbleVal += b.wobbleSpeed;
        b.x += b.vx + Math.sin(b.wobbleVal) * b.wobbleRange * 0.15;

        // Bounce horizontally off walls
        if (b.x - b.r < 0 || b.x + b.r > CANVAS_WIDTH) {
          b.vx = -b.vx;
          b.x = b.x - b.r < 0 ? b.r : CANVAS_WIDTH - b.r;
        }

        // Recycle bubble to bottom if it floats off top edge
        if (b.y + b.r < -10) {
          b.y = CANVAS_HEIGHT + b.r + 10;
          b.x = Math.random() * (CANVAS_WIDTH - 2 * b.r) + b.r;
        }

        // Draw bubble card
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.fill;
        ctx.fill();

        ctx.strokeStyle = b.stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3D shiny reflection curve
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      });

      // 3. Render and animate burst particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.7', p.alpha.toFixed(2));
        ctx.fill();
        return true;
      });

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      clearInterval(emitter);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: 'rgba(5, 6, 15, 0.1)', width: '100%' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '680px' }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Interactive Physics Tank
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '2px 0 0 0' }}>Aura Bubble Popper</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="glass-panel" style={{ padding: '6px 14px', background: 'rgba(6, 182, 212, 0.05)', borderColor: 'rgba(6, 182, 212, 0.2)' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 'bold' }}>
              ZEN FLOW: <span style={{ fontSize: '0.9rem', color: '#fff' }}>{popCount}</span>
            </span>
          </div>
          <button 
            onClick={handleResetTank}
            className="btn-cyber btn-cyber-secondary"
            style={{ padding: '8px 16px', fontSize: '0.75rem' }}
          >
            <RotateCcw size={12} /> REFILL
          </button>
        </div>
      </div>

      {/* Bubble interactive canvas container */}
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '680px',
          height: '440px',
          position: 'relative',
          background: 'rgba(5, 6, 15, 0.8) !important',
          border: '1px solid rgba(255, 255, 255, 0.05) !important',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Soft background glow */}
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '350px',
          height: '150px',
          background: 'radial-gradient(ellipse at bottom, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer', position: 'relative', zIndex: 1 }}
        />
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
        💡 Satisfying sound waves synthesized via client oscillator filters. Tap bubbles to release nervous focus.
      </p>
    </div>
  );
}

// 🧠 COGNITIVE HARMONY SUB-COMPONENT (MEMORY GAME)
const SYMBOLS = ['💻', '💾', '🌐', '⚙️', '☕', '✨', '💡', '🧠'];

function MemoryMatch() {
  const [deck, setDeck] = useState([]);
  const [selected, setSelected] = useState([]); // indices
  const [matched, setMatched] = useState([]); // indices
  const [moves, setMoves] = useState(0);
  const [victory, setVictory] = useState(false);

  // Initialize deck shuffled
  const initGame = () => {
    const doubled = [...SYMBOLS, ...SYMBOLS];
    // Fisher-Yates Shuffling Algorithm
    for (let i = doubled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
    }

    setDeck(doubled.map((symbol, idx) => ({ id: idx, val: symbol })));
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setVictory(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (idx) => {
    // Prevent clicking already matched, selected, or card lockout (2 already selected)
    if (matched.includes(idx) || selected.includes(idx) || selected.length >= 2) return;

    synth.playFlip();
    const nextSelected = [...selected, idx];
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = nextSelected;
      
      // Match condition
      if (deck[firstIdx].val === deck[secondIdx].val) {
        setTimeout(() => {
          synth.playMatch();
          const nextMatched = [...matched, firstIdx, secondIdx];
          setMatched(nextMatched);
          setSelected([]);
          
          if (nextMatched.length === deck.length) {
            setVictory(true);
          }
        }, 350);
      } else {
        // Flip back after mismatch delay
        setTimeout(() => {
          setSelected([]);
        }, 1000);
      }
    }
  };

  return (
    <div style={{ flex: 1, padding: '35px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '25px', background: 'rgba(5, 6, 15, 0.1)', width: '100%' }}>
      
      {/* Game scoreboard details */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '440px' }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Cognitive Focus Drill
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '2px 0 0 0' }}>Cognitive Harmony Match</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="glass-panel" style={{ padding: '6px 14px', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald-neon)', fontWeight: 'bold' }}>
              MOVES: <span style={{ fontSize: '0.9rem', color: '#fff' }}>{moves}</span>
            </span>
          </div>
          <button 
            onClick={initGame}
            className="btn-cyber btn-cyber-secondary"
            style={{ padding: '8px 16px', fontSize: '0.75rem' }}
            title="Reset cards board"
          >
            <RotateCcw size={12} /> RE-DECK
          </button>
        </div>
      </div>

      {!victory ? (
        /* Memory 4x4 Grid layout */
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '15px',
            width: '100%',
            maxWidth: '440px',
            position: 'relative'
          }}
        >
          {deck.map((card, idx) => {
            const isFlipped = selected.includes(idx) || matched.includes(idx);
            const isMatched = matched.includes(idx);

            return (
              <div 
                key={card.id} 
                className={`memory-card ${isFlipped ? 'flipped' : ''}`}
                onClick={() => handleCardClick(idx)}
              >
                <div className="card-inner">
                  {/* Front (Hidden Face) */}
                  <div className="card-front" style={{
                    borderColor: isMatched ? 'var(--emerald-neon)' : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isMatched ? 'inset 0 0 20px rgba(16, 185, 129, 0.12)' : 'inset 0 0 10px rgba(255, 255, 255, 0.02)',
                    transition: 'all 0.3s'
                  }}>
                    <div style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.15)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>?</div>
                  </div>
                  {/* Back (Visible Icon) */}
                  <div className="card-back" style={{
                    borderColor: isMatched ? 'var(--emerald-neon)' : 'rgba(255, 255, 255, 0.1)',
                    background: isMatched 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 6, 15, 0.8) 100%)' 
                      : 'rgba(5, 6, 15, 0.9)',
                    filter: isMatched ? 'none' : 'grayscale(0.1)'
                  }}>
                    <span style={{ 
                      fontSize: '2.1rem',
                      filter: isMatched ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.55))' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      {card.val}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Gamified Victory Screen Card */
        <div 
          className="glass-panel float-animation" 
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '30px',
            textAlign: 'center',
            background: 'var(--panel-bg)',
            border: '2px solid var(--emerald-neon) !important',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--emerald-neon)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={30} />
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--emerald-neon)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              COGNITIVE SYNC COMPLETE
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              Finished in {moves} matching moves
            </p>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0, fontStyle: 'italic' }}>
            "Cognitive frequency sync achieved successfully! Your logical neurons are fully recharged and primed to solve your technical and interview placement pathways ahead."
          </p>

          <button 
            onClick={initGame} 
            className="btn-cyber"
            style={{ width: '100%', padding: '12px 24px', fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--emerald-neon), var(--purple-neon))' }}
          >
            <RotateCcw size={14} /> RESTACK & RUN AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
