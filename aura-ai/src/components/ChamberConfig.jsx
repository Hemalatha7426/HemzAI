import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Users, Layers, Award, ShieldAlert, Sparkles, Play } from 'lucide-react';

export default function ChamberConfig({ parsedData, onConfigComplete, onBack }) {
  const [track, setTrack] = useState('Technical');
  const [experienceLevel, setExperienceLevel] = useState('Mid');
  const [mode, setMode] = useState('Mock'); // Mock vs Practice
  const [useCamera, setUseCamera] = useState(false);
  const previewVideoRef = useRef(null);
  const previewStreamRef = useRef(null);

  const startPreviewCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240, facingMode: "user" }, 
        audio: false 
      });
      previewStreamRef.current = stream;
      setUseCamera(true);
    } catch (err) {
      console.warn("Error accessing camera preview: ", err);
      alert("Could not access camera. Please check browser media/permission settings.");
    }
  };

  const stopPreviewCamera = () => {
    if (previewStreamRef.current) {
      previewStreamRef.current.getTracks().forEach(track => track.stop());
      previewStreamRef.current = null;
    }
    setUseCamera(false);
  };

  useEffect(() => {
    return () => {
      if (previewStreamRef.current) {
        try {
          previewStreamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
      }
    };
  }, []);

  // Symmetrical callback ref to bulletproof video element mounting in React
  const setPreviewVideoRef = (el) => {
    previewVideoRef.current = el;
    if (el && previewStreamRef.current) {
      try {
        if (el.srcObject !== previewStreamRef.current) {
          el.srcObject = previewStreamRef.current;
          el.play().catch(e => console.warn("Preview callback play failed:", e));
        }
      } catch (err) {
        console.warn("Preview callback error assigning stream:", err);
      }
    }
  };

  useEffect(() => {
    if (useCamera && previewVideoRef.current && previewStreamRef.current) {
      try {
        if (previewVideoRef.current.srcObject !== previewStreamRef.current) {
          previewVideoRef.current.srcObject = previewStreamRef.current;
          previewVideoRef.current.play().catch(e => console.warn("Preview play failed:", e));
        }
      } catch (err) {
        console.warn("Error assigning preview stream:", err);
      }
    }
  }, [useCamera]);

  const tracks = [
    {
      id: 'Technical',
      title: 'Technical Core',
      desc: 'Coding, core databases, frameworks, algorithms, and microservices logic.',
      icon: Terminal,
      color: 'var(--cyan-neon)',
      glow: 'rgba(0, 242, 254, 0.15)'
    },
    {
      id: 'HR',
      title: 'Behavioral & HR',
      desc: 'STAR behavioral challenges, conflict resolution, leadership, and career branding.',
      icon: Users,
      color: 'var(--pink-neon)',
      glow: 'rgba(255, 0, 127, 0.15)'
    },
    {
      id: 'Scenario',
      title: 'Scenario Based',
      desc: 'Real-world high-throughput scaling, failure mitigation, cache eviction, and consistency.',
      icon: Layers,
      color: 'var(--purple-neon)',
      glow: 'rgba(127, 0, 255, 0.15)'
    }
  ];

  const handleStart = () => {
    if (previewStreamRef.current) {
      try {
        previewStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      previewStreamRef.current = null;
    }
    onConfigComplete({
      track,
      experienceLevel,
      mode,
      startWithCamera: useCamera
    });
  };

  return (
    <div className="glass-panel dot-grid" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '40px', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '25px', marginBottom: '25px' }}>
        <div style={{ 
          border: '2px solid rgba(255,255,255,0.12)',
          borderRadius: '50%',
          overflow: 'hidden',
          width: '100px',
          height: '100px',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
          background: '#fff',
          flexShrink: 0
        }}>
          <img 
            src="/images/warmup.png" 
            alt="Warmup Study Character" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: '800', color: '#ffffff', marginBottom: '6px', letterSpacing: '0.5px' }}>
            CHAMBER CONFIG
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: '500', margin: 0 }}>
            Welcome, <span style={{ color: 'var(--cyan-neon)', fontWeight: '800' }}>{parsedData.candidateName}</span>. Establish your specs before engaging the voice fields!
          </p>
        </div>
      </div>

      {/* Warmup Motivational Quote Block */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        borderLeft: '4px solid var(--yellow-neon)',
        borderRadius: '8px',
        padding: '12px 18px',
        marginBottom: '30px',
        textAlign: 'left'
      }}>
        <p style={{ margin: 0, fontStyle: 'italic', fontWeight: '600', fontSize: '0.8rem', color: '#ffffff', lineHeight: '1.4' }}>
          "What is yours will always find you. Keep putting in the effort, sharpening your technical tools, and the right engineering role will meet your preparation."
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Track Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
            Select Sector Track
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            {tracks.map(t => {
              const Icon = t.icon;
              const isSelected = track === t.id;
              return (
                <div 
                  key={t.id}
                  onClick={() => setTrack(t.id)}
                  style={{
                    border: isSelected ? `2px solid ${t.color}` : '1.5px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    color: '#ffffff',
                    boxShadow: isSelected ? `0 0 15px ${t.color}33` : 'none',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minHeight: '170px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }
                  }}
                >
                  <Icon size={24} style={{ color: t.color, filter: `drop-shadow(0 0 5px ${t.color}88)` }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', fontFamily: 'var(--font-sans)', color: '#ffffff' }}>{t.title}</h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: '500', lineHeight: '1.4' }}>{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Mode selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
            Operational Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div 
              onClick={() => setMode('Mock')}
              style={{
                padding: '20px',
                borderRadius: '16px',
                cursor: 'pointer',
                border: mode === 'Mock' ? '2px solid var(--pink-neon)' : '1.5px solid rgba(255,255,255,0.06)',
                background: mode === 'Mock' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                boxShadow: mode === 'Mock' ? '0 0 15px rgba(236, 72, 153, 0.2)' : 'none',
                transform: mode === 'Mock' ? 'translateY(-2px)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                transition: 'all 0.25s'
              }}
              onMouseEnter={(e) => {
                if (mode !== 'Mock') {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (mode !== 'Mock') {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }
              }}
            >
              <Award size={24} style={{ color: 'var(--pink-neon)', flexShrink: 0, filter: 'drop-shadow(0 0 5px rgba(236,72,153,0.4))' }} />
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Mock Evaluation</h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '4px', lineHeight: '1.3' }}>Full interview rounds recorded in repository database with technical grades.</p>
              </div>
            </div>

            <div 
              onClick={() => setMode('Practice')}
              style={{
                padding: '20px',
                borderRadius: '16px',
                cursor: 'pointer',
                border: mode === 'Practice' ? '2px solid var(--emerald-neon)' : '1.5px solid rgba(255,255,255,0.06)',
                background: mode === 'Practice' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                boxShadow: mode === 'Practice' ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none',
                transform: mode === 'Practice' ? 'translateY(-2px)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                transition: 'all 0.25s'
              }}
              onMouseEnter={(e) => {
                if (mode !== 'Practice') {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (mode !== 'Practice') {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }
              }}
            >
              <Sparkles size={24} style={{ color: 'var(--emerald-neon)', flexShrink: 0, filter: 'drop-shadow(0 0 5px rgba(16,185,129,0.4))' }} />
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Warmup Practice</h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '4px', lineHeight: '1.3' }}>Low stress interactive sandbox designed for quick warmups. No record log created.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Media & Device Configuration */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
            Media & Hardware Devices
          </label>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            padding: '20px',
            borderRadius: '16px',
            border: '1.5px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.015)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Enable Webcam Feed</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '500', lineHeight: '1.3' }}>
                  Analyze and display your camera feed in a glassmorphic HUD overlay during the mock interview.
                </p>
              </div>
              
              {/* Cyber Switch Toggle */}
              <div 
                onClick={() => {
                  if (useCamera) {
                    stopPreviewCamera();
                  } else {
                    startPreviewCamera();
                  }
                }}
                style={{
                  width: '56px',
                  height: '28px',
                  borderRadius: '15px',
                  background: useCamera ? 'var(--emerald-neon)' : 'rgba(255,255,255,0.08)',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: useCamera ? '0 0 12px rgba(16, 185, 129, 0.45)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '2.5px',
                  left: useCamera ? '30px' : '3px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }} />
              </div>
            </div>

            {/* Live Mini Preview Grid */}
            <div style={{
              display: useCamera ? 'flex' : 'none',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '10px',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div style={{
                width: '220px',
                height: '145px',
                borderRadius: '12px',
                border: '2.5px solid var(--emerald-neon)',
                overflow: 'hidden',
                background: '#000',
                position: 'relative',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.25)'
              }}>
                <video 
                  ref={setPreviewVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(5, 8, 20, 0.85)',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  fontSize: '0.58rem',
                  fontWeight: '800',
                  color: 'var(--emerald-neon)',
                  fontFamily: 'var(--font-mono)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  CAMERA ACTIVE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn-cyber btn-cyber-secondary" style={{ flex: '0.4' }} onClick={onBack}>
              Back
            </button>
            <button 
              className={`btn-cyber ${useCamera ? 'btn-cyber-pink' : 'btn-cyber-disabled'}`} 
              style={{ 
                flex: '1',
                opacity: useCamera ? 1 : 0.45,
                cursor: useCamera ? 'pointer' : 'not-allowed',
                boxShadow: useCamera ? '0 0 15px var(--pink-neon)88' : 'none',
                background: useCamera ? 'linear-gradient(135deg, var(--pink-neon), var(--purple-neon))' : 'rgba(255,255,255,0.04)',
                color: useCamera ? '#fff' : 'var(--text-secondary)',
                border: useCamera ? 'none' : '1px solid rgba(255,255,255,0.08)',
                pointerEvents: useCamera ? 'auto' : 'none'
              }} 
              disabled={!useCamera}
              onClick={handleStart}
            >
              ACTIVATE CHAMBER <Play size={16} />
            </button>
          </div>
          {!useCamera && (
            <p style={{
              margin: '6px 0 0 0',
              fontSize: '0.74rem',
              color: 'var(--yellow-neon)',
              fontWeight: '600',
              fontFamily: 'var(--font-mono)',
              textAlign: 'center',
              letterSpacing: '0.2px',
              animation: 'fadeIn 0.3s'
            }}>
              ⚠️ WEBCAM IS REQUIRED: ENABLE CAMERA FEED ABOVE TO SECURE INTEGRITY
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
