'use client';
import React from 'react';

interface Props { onOpenModal: (type: 'login' | 'signup') => void; }

export function LandingHero({ onOpenModal }: Props) {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-badge"><div className="dot-pulse"></div>⚡ AI Powered • Trusted by 50,000+ job seekers</div>
        <h1>India&apos;s #1 <span className="gradient-text">AI Resume</span><br/>Builder</h1>
        <p>Get the job 2x as fast. Use AI-powered templates and step-by-step recommendations to create a winning resume — in under 5 minutes.</p>
        <div className="hero-btns">
          <a href="#" className="btn-primary" onClick={(e) => { e.preventDefault(); onOpenModal('signup'); }}>📄 Create New Resume</a>
          <a href="#" className="btn-outline" onClick={(e) => { e.preventDefault(); onOpenModal('signup'); }}>✨ Optimize My Resume</a>
        </div>
        <div className="trust-row">
          <div className="avatars"><span>RK</span><span>PM</span><span>AS</span><span>VJ</span><span>NK</span></div>
          <div><div className="stars">★★★★★</div><div className="trust-text"><strong>4.9/5</strong> from 12,000+ reviews</div></div>
        </div>
        <div className="trustpilot-row">
          <span>EXCELLENT</span><span className="trustpilot-score">4.8</span><span className="tp-stars">★★★★★</span>
          <span>4.8 out of 5 based on 38,365 reviews on</span><strong style={{color:'#00B67A'}}>Trustpilot</strong>
        </div>
      </div>
      <div className="hero-right">
        <div className="floating-chip chip-1">🤖 AI Writing...</div>
        <div className="resume-card">
          <div className="ats-badge">✅ ATS Score: 94/100</div>
          <div className="resume-avatar"></div>
          <div className="resume-name">Rahul Kumar</div>
          <div className="resume-title">Senior Software Engineer</div>
          <div className="resume-divider"></div>
          <div className="resume-section-label">Experience</div>
          <div className="resume-line active"></div>
          <div className="resume-line w90"></div>
          <div className="resume-line w80"></div>
          <div className="resume-divider"></div>
          <div className="resume-section-label">Education</div>
          <div className="resume-line w100"></div>
          <div className="resume-line w60"></div>
          <div className="resume-divider"></div>
          <div className="resume-section-label">Skills</div>
          <div className="skill-tags">
            <span className="skill-tag">React</span><span className="skill-tag">Node.js</span>
            <span className="skill-tag">Python</span><span className="skill-tag">AWS</span>
          </div>
        </div>
        <div className="floating-chip chip-2">📈 +68% Interview Rate</div>
      </div>
    </section>
  );
}
