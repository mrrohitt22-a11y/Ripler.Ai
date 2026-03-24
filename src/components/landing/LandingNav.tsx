'use client';
import React, { useEffect, useState } from 'react';

interface Props { onOpenModal: (type: 'login' | 'signup') => void; }

export function LandingNav({ onOpenModal }: Props) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <a className="nav-logo" href="#"><span>Ripler</span><span className="dot">.</span></a>
      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#templates">Templates</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenModal('login'); }}>Contact Us</a></li>
        <li><a href="#" className="btn-login" onClick={(e) => { e.preventDefault(); onOpenModal('login'); }}>Login</a></li>
      </ul>
      <div className="nav-mobile-btn">
        <a href="#" className="btn-login" style={{border:'1.5px solid #e8eaf0',padding:'6px 16px',borderRadius:'8px',fontWeight:600,textDecoration:'none',color:'#1a1a2e',fontSize:'0.88rem'}} onClick={(e) => { e.preventDefault(); onOpenModal('login'); }}>Login</a>
      </div>
    </nav>
  );
}
