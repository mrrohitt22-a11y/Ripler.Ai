'use client';
import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  activeTab: 'login' | 'signup';
  onClose: () => void;
  onSwitchTab: (tab: 'login' | 'signup') => void;
  onGoogleLogin: () => void;
  onEmailLogin: (email: string, password: string) => void;
  onEmailSignup: (name: string, email: string, password: string) => void;
}

export function AuthModal({ isOpen, activeTab, onClose, onSwitchTab, onGoogleLogin, onEmailLogin, onEmailSignup }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const isLogin = activeTab === 'login';

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{position:'relative'}}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo"><span>Ripler</span><span style={{WebkitTextFillColor:'var(--accent)'}}>.</span></div>
        <h3>{isLogin ? 'Welcome Back 👋' : 'Get Started Free 🚀'}</h3>
        <div className="modal-sub">{isLogin ? 'Sign in to continue building your resume' : 'Join 50,000+ job seekers. No credit card needed.'}</div>
        
        {/* Google Login Button */}
        <button onClick={onGoogleLogin} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1.5px solid var(--border)',background:'white',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontSize:'0.9rem',fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',marginBottom:'16px',transition:'all 0.2s'}}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        
        <div style={{textAlign:'center',fontSize:'0.8rem',color:'var(--muted)',margin:'12px 0'}}>or use email</div>

        <div className="modal-tabs">
          <button className={`modal-tab ${isLogin ? 'active' : ''}`} onClick={() => onSwitchTab('login')}>Login</button>
          <button className={`modal-tab ${!isLogin ? 'active' : ''}`} onClick={() => onSwitchTab('signup')}>Sign Up Free</button>
        </div>

        {isLogin ? (
          <div>
            <div className="modal-input-group"><label>Email Address</label><input type="email" placeholder="yourname@email.com" value={email} onChange={e => setEmail(e.target.value)}/></div>
            <div className="modal-input-group"><label>Password</label><input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}/></div>
            <button className="modal-submit" onClick={() => onEmailLogin(email, password)}>Login to Ripler →</button>
            <div className="modal-footer-text">Don&apos;t have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('signup'); }}>Sign up free</a></div>
          </div>
        ) : (
          <div>
            <div className="modal-input-group"><label>Full Name</label><input type="text" placeholder="Rahul Kumar" value={name} onChange={e => setName(e.target.value)}/></div>
            <div className="modal-input-group"><label>Email Address</label><input type="email" placeholder="yourname@email.com" value={email} onChange={e => setEmail(e.target.value)}/></div>
            <div className="modal-input-group"><label>Password</label><input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)}/></div>
            <button className="modal-submit" onClick={() => onEmailSignup(name, email, password)}>Create Free Account →</button>
            <div className="modal-footer-text">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('login'); }}>Login</a></div>
          </div>
        )}
      </div>
    </div>
  );
}
