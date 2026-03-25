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
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ease-out font-sans ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

      {/* Main Glass Mobile-style Card */}
      <div className={`relative w-full max-w-[400px] h-full sm:h-[800px] sm:max-h-[92vh] sm:rounded-[45px] overflow-hidden shadow-2xl flex flex-col transform transition-all duration-500 ease-out origin-bottom ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 scale-95 opacity-0'}`}
           style={{ background: 'linear-gradient(160deg, #FFD1C1 0%, #FCC0E3 45%, #D4BDFC 100%)' }}>
        
        {/* Top Gradient Area & Controls */}
        <div className="relative pt-8 px-6 pb-2" style={{  minHeight: '22%' }}>
          {/* subtle concentric line pattern overlay (optional css approach) */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at top left, transparent 40px, white 41px, white 42px, transparent 43px), radial-gradient(circle at top left, transparent 80px, white 81px, white 82px, transparent 83px)', backgroundSize: '100% 100%' }} />
          
          <button onClick={onClose} className="relative z-50 flex items-center gap-2 text-black/70 hover:text-black font-semibold text-[13px] tracking-wide transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            Back
          </button>
        </div>

        {/* Liquid Glass Bottom Overlay */}
        <div className="flex-1 w-full bg-white/70 backdrop-blur-3xl border-t border-white/50 sm:rounded-t-[45px] px-8 pt-10 pb-8 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-y-auto scrollbar-hide">
          
          <h2 className="text-[26px] font-extrabold text-center mb-2 text-gray-900 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-center text-[11px] text-gray-600 mb-8 max-w-[220px] mx-auto font-medium leading-relaxed">
            {isLogin 
              ? 'Ready to continue your learning journey? Your path is right here.' 
              : 'We\'re here to help you reach the peaks of learning. Are you ready?'}
          </p>

          <div className="space-y-4 mb-2">
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Enter full name" 
                className="w-full px-5 py-[18px] bg-white/80 border border-white focus:border-[#D4BDFC] rounded-[20px] outline-none text-[13px] placeholder:text-gray-400 font-medium transition-all focus:bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            )}
            <input 
              type="email" 
              placeholder="Enter email" 
              className="w-full px-5 py-[18px] bg-white/80 border border-white focus:border-[#D4BDFC] rounded-[20px] outline-none text-[13px] placeholder:text-gray-400 font-medium transition-all focus:bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input 
                type="password" 
                placeholder="Enter password" 
                className="w-full pl-5 pr-12 py-[18px] bg-white/80 border border-white focus:border-[#D4BDFC] rounded-[20px] outline-none text-[13px] placeholder:text-gray-400 font-medium transition-all focus:bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 mb-8">
            {isLogin ? (
              <>
                <label className="flex items-center gap-2 text-[11px] text-gray-600 font-semibold cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded-sm border-gray-300 accent-indigo-400 cursor-pointer" />
                  Remember me
                </label>
                <a href="#" className="text-[11px] text-indigo-500 font-bold hover:text-indigo-600 hover:underline">Forgot password?</a>
              </>
            ) : (
               <div className="w-full flex justify-end">
                  <a href="#" className="text-[11px] text-indigo-500 font-bold hover:text-indigo-600 hover:underline">Forgot password?</a>
               </div>
            )}
          </div>

          <button 
             className="w-full py-[18px] rounded-full text-white font-bold text-[15px] shadow-[0_10px_25px_rgba(212,189,252,0.6)] transition-all hover:shadow-[0_15px_35px_rgba(212,189,252,0.8)] hover:scale-[1.02] active:scale-[0.98]"
             style={{ background: 'linear-gradient(90deg, #FFB7B2 0%, #D4BDFC 100%)' }}
             onClick={isLogin ? () => onEmailLogin(email, password) : () => onEmailSignup(name, email, password)}
          >
            {isLogin ? 'Log In' : 'Get Started'}
          </button>

          <div className="relative flex items-center justify-center mt-10 mb-8">
            <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="relative bg-[#f8f9fc] px-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase mix-blend-multiply">
              {isLogin ? 'Sign in with' : 'Sign up with'}
            </span>
          </div>

          <div className="flex justify-center gap-6 mb-10">
            <button onClick={onGoogleLogin} className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:-translate-y-1 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </button>
          </div>

          <p className="text-center text-[12px] font-semibold text-gray-500 mt-auto">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
               onClick={() => onSwitchTab(isLogin ? 'signup' : 'login')}
               className="text-[#5b3eb5] font-extrabold hover:text-[#4527a0] hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
