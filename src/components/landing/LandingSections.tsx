'use client';
import React from 'react';

interface Props { onOpenModal: (type: 'login' | 'signup') => void; }

export function LandingSections({ onOpenModal }: Props) {
  return (
    <>
      {/* RESULTS */}
      <section className="results-section">
        <div className="result-left reveal">
          <div className="section-tag">Why Ripler?</div>
          <div className="result-header">
            <h2 className="section-title">Create a resume<br/><span className="hl">that gets results</span></h2>
            <a href="#templates" className="choose-btn">Choose a Template →</a>
          </div>
          <div className="result-steps">
            <div className="result-step reveal reveal-delay-1">
              <div className="step-icon-wrap">📋</div>
              <div className="step-text"><h4>Recruiter-Approved Resume</h4><p>Templates that format automatically and pass every ATS scan.</p></div>
            </div>
            <div className="result-step reveal reveal-delay-2">
              <div className="step-icon-wrap">⚡</div>
              <div className="step-text"><h4>Finish in 15 Minutes</h4><p>AI helps you tackle your work experience — powered by AI.</p></div>
            </div>
            <div className="result-step reveal reveal-delay-3">
              <div className="step-icon-wrap">🎯</div>
              <div className="step-text"><h4>Land an Interview</h4><p>We suggest skills that helped millions get interviews at top companies.</p></div>
            </div>
          </div>
        </div>
        <div className="result-right reveal reveal-delay-2">
          <div style={{background:'var(--bg)',borderRadius:'16px',width:'320px',padding:'28px',border:'1px solid var(--border)',boxShadow:'0 8px 40px rgba(59,91,219,0.08)'}}>
            <div style={{display:'flex',gap:'12px',marginBottom:'16px',alignItems:'center'}}>
              <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'linear-gradient(135deg,var(--blue),var(--purple))'}}></div>
              <div><div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'1rem'}}>Priya Sharma</div><div style={{fontSize:'0.75rem',color:'var(--blue)',fontWeight:600}}>Marketing Manager</div></div>
              <div style={{marginLeft:'auto',background:'#E6F9F0',color:'#2F9E44',padding:'4px 10px',borderRadius:'20px',fontSize:'0.7rem',fontWeight:700}}>ATS ✅</div>
            </div>
            <div style={{height:'1px',background:'var(--border)',marginBottom:'12px'}}></div>
            {['Summary','Experience','Skills'].map(s => (<div key={s}><div style={{fontSize:'0.65rem',fontWeight:700,color:'var(--blue)',textTransform:'uppercase' as const,letterSpacing:'0.08em',marginBottom:'6px'}}>{s}</div>
              <div style={{height:'5px',background:'var(--border)',borderRadius:'3px',marginBottom:'4px',width:'100%'}}></div>
              <div style={{height:'5px',background:'var(--border)',borderRadius:'3px',marginBottom:'12px',width:'70%'}}></div></div>))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="reveal" style={{textAlign:'center',marginBottom:'40px'}}>
          <div className="section-tag">Powerful Features</div>
          <h2 className="section-title">6 features to boost<br/><span className="hl">your job search</span></h2>
        </div>
        <div className="features-grid">
          {[{icon:'🎨',title:'35+ Template Designs',desc:'Recruiter-approved, ATS-friendly templates for every industry.'},
            {icon:'🤖',title:'Enhance with AI',desc:'AI rewrites your bullet points and optimizes for keywords.'},
            {icon:'📊',title:'Resume Review & ATS Score',desc:'Get a live ATS score and actionable suggestions.'},
            {icon:'🤖',title:'AI Cover Letter Builder',desc:'Generate a tailored cover letter in under 30 seconds.'},
            {icon:'🌐',title:'Resume Website',desc:'Turn your resume into a shareable online profile.'},
            {icon:'📍',title:'Resume Tracking',desc:'Track where you applied and follow up at the right time.'}
          ].map((f, i) => (
            <div key={i} className={`feature-card reveal reveal-delay-${(i % 3) + 1}`} onClick={() => onOpenModal('signup')}>
              <div className="feature-card-img">{f.icon}</div>
              <div className="feature-card-body"><h4>{f.title}</h4><p>{f.desc}</p></div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:'32px'}} className="reveal">
          <a href="#" className="btn-primary" onClick={(e) => { e.preventDefault(); onOpenModal('signup'); }} style={{display:'inline-flex'}}>Choose a Template →</a>
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="templates-section" id="templates">
        <div className="reveal" style={{textAlign:'center',marginBottom:'32px'}}>
          <div className="section-tag">Templates</div>
          <h2 className="section-title">35+ Professional <span className="hl">Resume Templates</span></h2>
          <p className="section-sub" style={{margin:'8px auto 0',textAlign:'center'}}>ATS-friendly designs loved by recruiters at top companies</p>
        </div>
        <div className="template-grid">
          {['Professional Blue','Modern Dark','Clean Minimal','Executive Pro'].map((name, i) => (
            <div key={i} className={`template-card reveal reveal-delay-${i+1}`}>
              <div className="template-inner">
                <div className="t-header"><div className="t-avatar blue"></div><div className="t-title-lines"><div className="t-line dark" style={{width:'60%',height:'6px',background:'#1A1A2E'}}></div><div className="t-line" style={{width:'40%',background:'var(--blue)'}}></div></div></div>
                <div className="t-body-lines"><div className="t-line w100"></div><div className="t-line w80"></div><div className="t-line w90"></div></div>
                <div className="t-divider"></div>
                <div className="t-body-lines"><div className="t-line w100"></div><div className="t-line w60"></div></div>
              </div>
              <div className="template-label">{name}</div>
              <div className="template-overlay"><button onClick={() => onOpenModal('signup')}>Use Template</button></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
