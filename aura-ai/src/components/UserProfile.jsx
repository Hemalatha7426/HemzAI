import { useState } from 'react';
import { Award, Terminal, Calendar, Sliders, ArrowLeft, History, Zap, Star, Activity, FileText, Trash2 } from 'lucide-react';

export default function UserProfile({ parsedData, history, onBack, onViewPastSession, onDeleteSession }) {
  const [activeSubTab, setActiveSubTab] = useState('MASTERY'); // MASTERY -> RESUME -> TIMELINE
  
  // Custom TTS Preferences
  const [voiceVolume, setVoiceVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('hemz_tts_pref');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.volume !== undefined) return parsed.volume;
      }
    } catch {
      // ignore parsing error
    }
    return 0.8;
  });

  const [voiceSpeed, setVoiceSpeed] = useState(() => {
    try {
      const saved = localStorage.getItem('hemz_tts_pref');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.speed !== undefined) return parsed.speed;
      }
    } catch {
      // ignore parsing error
    }
    return 1.0;
  });

  const [voicePitch, setVoicePitch] = useState(() => {
    try {
      const saved = localStorage.getItem('hemz_tts_pref');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pitch !== undefined) return parsed.pitch;
      }
    } catch {
      // ignore parsing error
    }
    return 1.0;
  });

  const [voiceGender, setVoiceGender] = useState(() => {
    try {
      const saved = localStorage.getItem('hemz_tts_pref');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gender !== undefined) return parsed.gender;
      }
    } catch {
      // ignore parsing error
    }
    return 'female';
  }); // female vs male vs natural

  const candidateName = parsedData?.candidateName || "Anonymous Candidate";
  const skills = parsedData?.skills || ["React", "Spring Boot", "Java", "REST APIs", "SQL"];
  const education = parsedData?.education || "Bachelor of Science in Computer Science";
  
  // Calculate average performance metrics across historical logs
  const totalRuns = history.length;
  const avgHemzIndex = totalRuns > 0 
    ? Math.round(history.reduce((sum, item) => sum + (item.overallScore || 0), 0) / totalRuns) 
    : 0; // Show 0% if no runs yet

  const getRank = (score) => {
    if (score >= 90) return 'ELITE GUARDIAN';
    if (score >= 80) return 'MASTER TECHNOLOGIST';
    if (score >= 65) return 'PROFICIENT INTERVIEWER';
    return 'DEVELOPING INITIATE';
  };

  // Save Configs on changes
  const savePreferences = () => {
    const config = { volume: voiceVolume, speed: voiceSpeed, pitch: voicePitch, gender: voiceGender };
    localStorage.setItem('hemz_tts_pref', JSON.stringify(config));
    
    // Quick success voice trigger
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const text = `Vocal preferences initialized at speed ${voiceSpeed} and pitch ${voicePitch}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = voiceVolume;
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
      
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => 
        voiceGender === 'female' 
          ? v.name.includes("Google US English") || v.name.includes("Zira") 
          : v.name.includes("David") || v.name.includes("Male")
      );
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Dimensional Stats mapped dynamically
  const profileMetrics = [
    { name: 'Technical Depth', value: totalRuns > 0 ? Math.min(avgHemzIndex + 4, 98) : 0, desc: 'Keywords, architectural frameworks, and engineering accuracy.', icon: Zap, color: 'var(--cyan-neon)' },
    { name: 'STAR Structure', value: totalRuns > 0 ? Math.max(avgHemzIndex - 6, 45) : 0, desc: 'Pacing situational tasks, concrete actions, and results.', icon: Star, color: 'var(--pink-neon)' },
    { name: 'Pacing & Fluidity', value: totalRuns > 0 ? Math.min(avgHemzIndex + 2, 95) : 0, desc: 'Speaking speed stability and sustained fluid responses.', icon: Activity, color: 'var(--purple-neon)' },
    { name: 'Spoken Integrity', value: totalRuns > 0 ? Math.max(avgHemzIndex - 2, 50) : 0, desc: 'Grammar cohesion and exclusion of vocal filters.', icon: Award, color: 'var(--emerald-neon)' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.1fr', gap: '30px', maxWidth: '980px', width: '100%', margin: '0 auto', zIndex: 1 }}>
      
      {/* LEFT COLUMN - USER IDENTITY CARD & VOCAL CONFIG */}
      <div className="glass-panel dot-grid" style={{ padding: '35px 25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px', height: 'fit-content' }}>
        
        {/* Profile Header */}
        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-dark)', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '3px dashed var(--ink-dark)', paddingBottom: '10px', width: '100%', textAlign: 'center' }}>
          Candidate Profile
        </h4>

        {/* Cartoon Chibi Profile Portrait */}
        <div style={{ 
          border: '3px solid var(--ink-dark)',
          borderRadius: '50%',
          overflow: 'hidden',
          width: '120px',
          height: '120px',
          boxShadow: '4px 4px 0px var(--ink-dark)',
          background: '#fff'
        }}>
          <img 
            src="/images/straw_hat_girl.png" 
            alt="Profile Character" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* User Quick Info */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--ink-dark)', fontFamily: 'var(--font-sans)', letterSpacing: '-0.3px' }}>
            {candidateName}
          </h3>
          <span className="badge-comic" style={{ background: 'var(--purple-neon)', marginTop: '8px', display: 'inline-block' }}>
            {getRank(avgHemzIndex)}
          </span>
        </div>

        {/* Customized Professional Quote Bubble */}
        <div style={{
          background: 'var(--yellow-neon)',
          border: '3px solid var(--ink-dark)',
          borderRadius: '16px',
          padding: '12px 15px',
          width: '100%',
          boxShadow: '3px 3px 0px var(--ink-dark)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontStyle: 'italic', fontWeight: '800', fontSize: '0.78rem', color: 'var(--ink-dark)', lineHeight: '1.4' }}>
            "Behaviour is always greater than knowledge. Because in life there are many situations where knowledge fails but Behaviour can still handle. — A. P. J Abdul Kalam"
          </p>
        </div>

        {/* Vocal Preferences Form Section */}
        <div style={{ 
          width: '100%', 
          borderTop: '3px dashed var(--ink-dark)', 
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <h5 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--pink-neon)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={12} /> TTS Synthesizer Config
          </h5>

          {/* AI Voice Gender selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.62rem', color: 'var(--ink-dark)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Interviewer Vocal Field
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                onClick={() => setVoiceGender('female')}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: '2px solid var(--ink-dark)',
                  background: voiceGender === 'female' ? 'var(--pink-neon)' : '#ffffff',
                  color: 'var(--ink-dark)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: voiceGender === 'female' ? '1px 1px 0px var(--ink-dark)' : '3px 3px 0px var(--ink-dark)',
                  transform: voiceGender === 'female' ? 'translate(2px, 2px)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                FEMALE_VOX
              </button>
              <button 
                onClick={() => setVoiceGender('male')}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: '2px solid var(--ink-dark)',
                  background: voiceGender === 'male' ? 'var(--pink-neon)' : '#ffffff',
                  color: 'var(--ink-dark)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: voiceGender === 'male' ? '1px 1px 0px var(--ink-dark)' : '3px 3px 0px var(--ink-dark)',
                  transform: voiceGender === 'male' ? 'translate(2px, 2px)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                MALE_VOX
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-dark)', marginBottom: '4px' }}>
              <span>Vocal Volume</span>
              <span>{Math.round(voiceVolume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="1.0" 
              step="0.05"
              value={voiceVolume}
              onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--pink-neon)', cursor: 'pointer' }}
            />
          </div>

          {/* Speed Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-dark)', marginBottom: '4px' }}>
              <span>Vocal Speed</span>
              <span>{voiceSpeed}x</span>
            </div>
            <input 
              type="range" 
              min="0.7" 
              max="1.4" 
              step="0.05"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--pink-neon)', cursor: 'pointer' }}
            />
          </div>

          {/* Pitch Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-dark)', marginBottom: '4px' }}>
              <span>Vocal Pitch</span>
              <span>{voicePitch}x</span>
            </div>
            <input 
              type="range" 
              min="0.8" 
              max="1.3" 
              step="0.05"
              value={voicePitch}
              onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--pink-neon)', cursor: 'pointer' }}
            />
          </div>

          {/* Save Button */}
          <button 
            onClick={savePreferences}
            className="btn-cyber btn-cyber-pink"
            style={{ width: '100%', padding: '10px', fontSize: '0.72rem', borderRadius: '8px', display: 'flex', gap: '6px' }}
          >
            <Sliders size={12} /> Save Preferences
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN - DETAILED SUB-TABS & MASTER DATA */}
      <div className="glass-panel dot-grid" style={{ padding: '35px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* Navigation back and title header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={onBack}
              style={{
                background: '#ffffff',
                border: '3px solid var(--ink-dark)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-dark)',
                cursor: 'pointer',
                boxShadow: '2px 2px 0px var(--ink-dark)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-1px, -1px)';
                e.currentTarget.style.boxShadow = '3px 3px 0px var(--ink-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '2px 2px 0px var(--ink-dark)';
              }}
            >
              <ArrowLeft size={16} />
            </button>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.3rem', fontWeight: '800', color: 'var(--ink-dark)' }}>
              Competency Index Workspace
            </h3>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cyan-neon)' }}>
            TOTAL RUNS: {totalRuns}
          </span>
        </div>

        {/* Tab Buttons (Mastery Stats, Decoded Resume, Timeline Logs) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => setActiveSubTab('MASTERY')}
            style={{
              padding: '12px 6px',
              borderRadius: '10px',
              border: activeSubTab === 'MASTERY' ? '1px solid var(--cyan-neon)' : '1px solid var(--glass-border)',
              background: activeSubTab === 'MASTERY' ? 'rgba(0, 242, 254, 0.08)' : 'rgba(5, 6, 15, 0.4)',
              color: activeSubTab === 'MASTERY' ? 'var(--cyan-neon)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            <Award size={13} style={{ marginRight: '6px', display: 'inline' }} />
            Mastery Stats
          </button>
          <button
            onClick={() => setActiveSubTab('RESUME')}
            style={{
              padding: '12px 6px',
              borderRadius: '10px',
              border: activeSubTab === 'RESUME' ? '1px solid var(--cyan-neon)' : '1px solid var(--glass-border)',
              background: activeSubTab === 'RESUME' ? 'rgba(0, 242, 254, 0.08)' : 'rgba(5, 6, 15, 0.4)',
              color: activeSubTab === 'RESUME' ? 'var(--cyan-neon)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            <FileText size={13} style={{ marginRight: '6px', display: 'inline' }} />
            Decoded Resume
          </button>
          <button
            onClick={() => setActiveSubTab('TIMELINE')}
            style={{
              padding: '12px 6px',
              borderRadius: '10px',
              border: activeSubTab === 'TIMELINE' ? '1px solid var(--cyan-neon)' : '1px solid var(--glass-border)',
              background: activeSubTab === 'TIMELINE' ? 'rgba(0, 242, 254, 0.08)' : 'rgba(5, 6, 15, 0.4)',
              color: activeSubTab === 'TIMELINE' ? 'var(--cyan-neon)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            <History size={13} style={{ marginRight: '6px', display: 'inline' }} />
            Chamber Logs
          </button>
        </div>

        {/* DYNAMIC SUBTAB WORKSPACE */}
        <div style={{ flex: '1', minHeight: '320px', overflowY: 'auto' }}>
          
          {/* TAB 1: MASTERY PROGRESS METRICS */}
          {activeSubTab === 'MASTERY' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {profileMetrics.map((met, idx) => {
                  const Icon = met.icon;
                  return (
                    <div key={idx} className="glass-panel" style={{ padding: '18px 20px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: met.color, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                          <Icon size={14} /> {met.name}
                        </span>
                        <span style={{ fontSize: '1.05rem', fontWeight: '900', color: 'var(--ink-dark)', fontFamily: 'var(--font-mono)' }}>
                          {met.value}%
                        </span>
                      </div>
                      
                      {/* Neon Progress Bar */}
                      <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(30, 41, 59, 0.05)', overflow: 'hidden', border: '2px solid var(--ink-dark)' }}>
                        <div style={{ height: '100%', width: `${met.value}%`, background: met.color }} />
                      </div>

                      <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {met.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Cognitive standing message panel */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#ffffff', border: '3px solid var(--ink-dark)', borderRadius: '16px', padding: '12px 18px', marginTop: '5px', boxShadow: '3px 3px 0px var(--ink-dark)' }}>
                <Award size={18} style={{ color: 'var(--cyan-neon)' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {totalRuns > 0 ? (
                    <>Hemz Cognitive standing compiled successfully. Your overall mock average grade is <strong style={{ color: 'var(--cyan-neon)' }}>{avgHemzIndex}%</strong>. Study structural design aggregates and speech flow patterns to advance.</>
                  ) : (
                    <>No cognitive standing compiled yet. Enter the vocal chamber to record your first run and generate your overall average grade!</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DECODED RESUME BADGES */}
          {activeSubTab === 'RESUME' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '18px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--ink-dark)', borderBottom: '3px dashed var(--ink-dark)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={14} /> Scanned Resume Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>NAME ON RECORDS:</span>
                    <p style={{ fontWeight: 'bold', color: 'var(--ink-dark)', fontSize: '0.9rem', marginTop: '2px' }}>{candidateName}</p>
                  </div>
                  
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>QUALIFICATIONS:</span>
                    <p style={{ fontWeight: 'bold', color: 'var(--ink-dark)', fontSize: '0.9rem', marginTop: '2px' }}>{education}</p>
                  </div>
                </div>

                <div style={{ marginTop: '5px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>DECODED COMPETENCY STACKS:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {skills.map((skill, index) => (
                      <span key={index} style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '2px solid var(--ink-dark)',
                        background: '#ffffff',
                        color: 'var(--ink-dark)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: '600',
                        boxShadow: '2px 2px 0px var(--ink-dark)',
                        marginRight: '6px',
                        marginBottom: '6px'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff', border: '3px solid var(--ink-dark)', borderRadius: '16px', padding: '12px 18px', boxShadow: '3px 3px 0px var(--ink-dark)' }}>
                <Terminal size={16} style={{ color: 'var(--pink-neon)' }} />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Need to update your interview capabilities? Go back to the **Resume Scanner** dashboard to overlay new documentation tags.
                </span>
              </div>

            </div>
          )}

          {/* TAB 3: TIMELINE logs */}
          {activeSubTab === 'TIMELINE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {totalRuns === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed var(--glass-border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                  <History size={36} style={{ marginBottom: '15px', color: 'var(--text-muted)', display: 'inline-block' }} />
                  <p style={{ fontSize: '0.85rem' }}>No past session history found. Run mock interviews to list items here!</p>
                </div>
              ) : (
                history.map((sess, idx) => (
                  <div 
                    key={sess.id || idx}
                    style={{
                      background: 'rgba(5, 6, 15, 0.4)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s'
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>
                          Chamber Log #{totalRuns - idx}
                        </span>
                        <span style={{ fontSize: '0.62rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255, 0, 127, 0.05)', border: '1px solid rgba(255, 0, 127, 0.15)', color: 'var(--pink-neon)', fontFamily: 'var(--font-mono)' }}>
                          {sess.track}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={11} /> {sess.timestamp ? new Date(sess.timestamp).toLocaleDateString() : 'Active'}
                        </span>
                        <span>
                          Grade: {sess.experienceLevel || 'Mid'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '900', color: sess.overallScore >= 80 ? 'var(--emerald-neon)' : 'var(--cyan-neon)', fontFamily: 'var(--font-mono)' }}>
                          {sess.overallScore}%
                        </span>
                      </div>
                      <button 
                        onClick={() => onViewPastSession(sess)}
                        className="btn-cyber btn-cyber-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.65rem', borderRadius: '6px' }}
                      >
                        View Report
                      </button>
                      
                      {onDeleteSession && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(sess.id, e);
                          }}
                          title="Delete Session Log"
                          style={{
                            background: 'rgba(255, 0, 127, 0.03)',
                            border: '1px solid rgba(255, 0, 127, 0.15)',
                            borderRadius: '6px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgba(255, 0, 127, 0.65)',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 0, 127, 0.15)';
                            e.currentTarget.style.color = 'var(--pink-neon)';
                            e.currentTarget.style.borderColor = 'var(--pink-neon)';
                            e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 0, 127, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 0, 127, 0.03)';
                            e.currentTarget.style.color = 'rgba(255, 0, 127, 0.65)';
                            e.currentTarget.style.borderColor = 'rgba(255, 0, 127, 0.15)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Back control */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
          <button className="btn-cyber btn-cyber-secondary" style={{ padding: '10px 24px', fontSize: '0.8rem' }} onClick={onBack}>
            Back to Hub
          </button>
        </div>

      </div>

    </div>
  );
}
