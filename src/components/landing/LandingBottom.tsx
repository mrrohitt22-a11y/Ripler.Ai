'use client';
import React, { useEffect, useRef, useState } from 'react';

interface Props { onOpenModal: (type: 'login' | 'signup') => void; }

export function LandingBottom({ onOpenModal }: Props) {
  const [counted, setCounted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        setCounted(true);
        const counters = [{id:'c1',target:50,dur:1800},{id:'c2',target:5,dur:1200},{id:'c3',target:94,dur:2000},{id:'c4',target:1,dur:800}];
        counters.forEach(({id,target,dur}) => {
          const el = document.getElementById(id);
          if (!el) return;
          const step = target / (dur / 16);
          let cur = 0;
          const t = setInterval(() => { cur = Math.min(cur+step,target); el.textContent = String(Math.round(cur)); if(cur>=target) clearInterval(t); }, 16);
        });
      }
    }, {threshold: 0.3});
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [counted]);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, {threshold: 0.12});
    reveals.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* STATS */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          <div className="stat-item reveal"><div className="stat-num"><span id="c1">0</span>K+</div><div className="stat-label">Resumes Created</div></div>
          <div className="stat-item reveal reveal-delay-1"><div className="stat-num"><span id="c2">0</span> Mins</div><div className="stat-label">Average Build Time</div></div>
          <div className="stat-item reveal reveal-delay-2"><div className="stat-num"><span id="c3">0</span>%</div><div className="stat-label">Interview Rate Increase</div></div>
          <div className="stat-item reveal reveal-delay-3"><div className="stat-num">#<span id="c4">0</span></div><div className="stat-label">Rated Resume Tool India</div></div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="reveal" style={{textAlign:'center',marginBottom:'40px'}}>
          <div className="section-tag">Success Stories</div>
          <h2 className="section-title">Real People. <span className="hl">Real Results.</span></h2>
        </div>
        <div className="testimonials-grid">
          {[{init:'RK',name:'Rahul Kumar',role:'Software Engineer, TCS • Delhi',text:'"Got hired at TCS within 2 weeks! The AI bullet points were exactly what I needed."',bg:''},
            {init:'PM',name:'Priya Mehta',role:'Marketing Executive • Mumbai',text:'"As a fresher, Ripler did everything for me. Got 3 interview calls in the first week!"',bg:'linear-gradient(135deg,#C2255C,#E64980)'},
            {init:'AS',name:'Amit Singh',role:'Data Analyst, Infosys • Bangalore',text:'"The ATS score feature helped me understand why I was getting rejected. Got a callback from Infosys!"',bg:'linear-gradient(135deg,#E67700,#F59F00)'}
          ].map((t,i) => (
            <div key={i} className={`testimonial-card reveal reveal-delay-${i+1}`}>
              <div className="test-stars">★★★★★</div>
              <div className="test-text">{t.text}</div>
              <div className="test-author">
                <div className="test-avatar" style={t.bg ? {background:t.bg} : {}}>{t.init}</div>
                <div><div className="test-name">{t.name}</div><div className="test-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPANIES */}
      <section className="companies-section">
        <div className="companies-label">Our customers have been hired by →</div>
        <div className="companies-row">
          {['HDFC BANK','TECH MAHINDRA','genpact','accenture','Deloitte','WIPRO','INFOSYS'].map(c => (
            <div key={c} className="company-logo">{c}</div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="reveal">Your Next Job Starts<br/>With a Great Resume</h2>
        <p className="reveal reveal-delay-1">Join 50,000+ job seekers who built their winning resume with Ripler</p>
        <a href="#" className="btn-white reveal reveal-delay-2" onClick={(e) => { e.preventDefault(); onOpenModal('signup'); }}>Build My Resume Now — It&apos;s Free →</a>
        <div className="cta-note reveal reveal-delay-3">No credit card required • Takes under 5 minutes • 100% Free to start</div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <span className="footer-logo-text">Ripler<span style={{color:'var(--accent)'}}>.</span></span>
            <div className="footer-tagline">India&apos;s #1 AI-powered resume builder. Build ATS-friendly resumes in minutes.</div>
            <div style={{display:'flex',gap:'10px',marginTop:'4px'}}>
              {['LinkedIn','Twitter','Instagram'].map(s => (<a key={s} href="#" style={{color:'rgba(255,255,255,0.5)',textDecoration:'none',fontSize:'0.8rem',border:'1px solid rgba(255,255,255,0.15)',padding:'5px 10px',borderRadius:'6px'}}>{s}</a>))}
            </div>
          </div>
          <div><div className="footer-h">Product</div><ul className="footer-links">{['Features','Templates','ATS Score','Cover Letter'].map(l => (<li key={l}><a href="#">{l}</a></li>))}</ul></div>
          <div><div className="footer-h">Company</div><ul className="footer-links">{['About Us','Blog','Careers','Contact'].map(l => (<li key={l}><a href="#">{l}</a></li>))}</ul></div>
          <div>
            <div className="footer-h">Legal</div>
            <ul className="footer-links">
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms-of-service">Terms of Service</a></li>
              <li><a href="/refund-policy">Refund Policy</a></li>
              <li><a href="/cookie-policy">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2025 Ripler. All rights reserved.</div>
          <div>Made with ❤️ in India <span className="india-flag">🇮🇳</span></div>
        </div>
      </footer>
    </>
  );
}
