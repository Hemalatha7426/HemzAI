import React, { useState } from 'react';
import { Shield, Mail, Lock, LogIn, Sparkles, AudioLines } from 'lucide-react';

export default function AuthHub({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all security fields.');
      return;
    }
    if (password.length < 5) {
      setError('Credentials must exceed 4 characters.');
      return;
    }
    setError('');

    try {
      const endpoint = isSignUp 
        ? 'http://localhost:8080/api/auth/register' 
        : 'http://localhost:8080/api/auth/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          candidateName: email.split('@')[0]
        })
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.candidateName || email.split('@')[0]);
      } else {
        setError(data.message || 'Verification failed.');
      }
    } catch (err) {
      console.warn("Auth API offline. Logging in via mock fallback authentication.");
      const mockUsers = JSON.parse(localStorage.getItem('hemz_mock_users') || '{}');
      const normalizedEmail = email.toLowerCase().trim();
      
      if (isSignUp) {
        if (mockUsers[normalizedEmail]) {
          setError('Identity already established for this Interface Node.');
        } else {
          mockUsers[normalizedEmail] = password;
          localStorage.setItem('hemz_mock_users', JSON.stringify(mockUsers));
          onLoginSuccess(email.split('@')[0]);
        }
      } else {
        if (mockUsers[normalizedEmail] && mockUsers[normalizedEmail] === password) {
          onLoginSuccess(email.split('@')[0]);
        } else if (mockUsers[normalizedEmail]) {
          setError('Incorrect Access Code / Password.');
        } else {
          mockUsers[normalizedEmail] = password;
          localStorage.setItem('hemz_mock_users', JSON.stringify(mockUsers));
          onLoginSuccess(email.split('@')[0]);
        }
      }
    }
  };

  const handleGoogleMock = () => {
    onLoginSuccess('SSO Candidate');
  };

  return (
    <div className="glass-panel dot-grid float-animation" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', maxWidth: '850px', width: '100%', margin: '0 auto', minHeight: '480px', overflow: 'hidden', zIndex: 1 }}>
      
      {/* LEFT PANEL - AI Cartoon Introduction */}
      <div style={{ 
        background: 'rgba(10, 15, 30, 0.6)', 
        padding: '40px 30px', 
        borderRight: '1px solid rgba(255, 255, 255, 0.08)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center', 
        gap: '24px', 
        position: 'relative' 
      }}>
        
        {/* Cartoon Girl Image Card with glowing border */}
        <div style={{ 
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          width: '170px',
          height: '170px',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.25)',
          background: '#fff'
        }}>
          <img 
            src="/images/welcome.png" 
            alt="Welcome Character" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px', letterSpacing: '0.5px' }}>
            HEMZ AI STUDY SPACE
          </h2>
          
          {/* Glowing Quote Card */}
          <div style={{ 
            color: '#ffffff', 
            fontSize: '0.82rem', 
            lineHeight: '1.4', 
            fontWeight: '600', 
            maxWidth: '280px', 
            margin: '0 auto',
            fontStyle: 'italic',
            padding: '12px 16px',
            background: 'rgba(245, 158, 11, 0.08)',
            borderLeft: '4px solid var(--yellow-neon)',
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            "You have the power to change your story, no matter what page you're on."
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '280px', marginTop: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'left', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Sparkles size={13} style={{ color: 'var(--cyan-neon)', filter: 'drop-shadow(0 0 5px var(--cyan-neon))' }} />
            <span>Dynamic Voice Synthesis Practice</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div style={{ padding: '45px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: '25px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
            {isSignUp ? 'Establish Identity' : 'Welcome Candidate'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: '500' }}>
            {isSignUp ? 'Create credentials to start runs' : 'Log in to initialize vocal sessions'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {error && (
            <p style={{ color: 'var(--pink-neon)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textAlign: 'center', background: 'rgba(255,0,127,0.05)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,0,127,0.15)' }}>
              {error}
            </p>
          )}

          {/* Email Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Interface Node / Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="alex@hemz.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 40px',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Access Code / Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 40px',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-cyber btn-cyber-pink" style={{ width: '100%', padding: '11px', marginTop: '8px', fontSize: '0.8rem' }}>
            INITIALIZE SESSION <LogIn size={15} />
          </button>
        </form>

        {/* SSO Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px' }}>OR CHOOSE SSO</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        {/* Google Mock */}
        <button 
          onClick={handleGoogleMock} 
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}><span style={{ color: '#4285F4' }}>G</span><span style={{ color: '#EA4335' }}>o</span><span style={{ color: '#FBBC05' }}>o</span><span style={{ color: '#34A853' }}>g</span><span style={{ color: '#4285F4' }}>l</span><span style={{ color: '#EA4335' }}>e</span></span> Continue with Google
        </button>

        {/* Switch forms toggle */}
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.74rem', textAlign: 'center', marginTop: '20px' }}>
          {isSignUp ? 'Already have an active identity?' : "Don't have an active identity?"} {' '}
          <span 
            onClick={() => setIsSignUp(!isSignUp)} 
            style={{ color: 'var(--cyan-neon)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </span>
        </p>

      </div>
    </div>
  );
}
