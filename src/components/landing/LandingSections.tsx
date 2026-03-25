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
        <div className="relative p-6 sm:p-10 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] mx-auto mt-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📄', title: '35+ Templates', desc: 'Recruiter-approved, ATS-friendly templates for every industry.', color: 'from-white/80 to-[#EAF5ED]' },
              { icon: '🤖', title: 'Enhance with AI', desc: 'AI rewrites your bullet points and optimizes for keywords.', color: 'from-white/80 to-[#E4F0FB]' },
              { icon: '🚀', title: 'Check ATS Score', desc: 'Get a live ATS score and actionable suggestions.', color: 'from-white/80 to-[#EEECF8]' },
              { icon: '✉️', title: 'Cover Letters', desc: 'Generate a tailored cover letter in under 30 seconds.', color: 'from-white/80 to-[#EBEBF4]' },
              { icon: '🌐', title: 'Resume Website', desc: 'Turn your resume into a shareable online profile.', color: 'from-white/80 to-[#FCEFDA]' },
              { icon: '📍', title: 'Resume Tracking', desc: 'Track where you applied and follow up at the right time.', color: 'from-white/80 to-[#E3F2EE]' }
            ].map((f, i) => (
              <div key={i} onClick={() => onOpenModal('signup')} className={`rounded-3xl p-7 bg-gradient-to-br ${f.color} border border-white hover:border-white/50 shadow-sm flex flex-col justify-between min-h-[240px] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm text-[22px]">
                      {f.icon}
                    </div>
                    <div className="flex gap-1.5 opacity-30 mix-blend-multiply">
                      <div className="w-2 h-2 rounded-sm bg-black" />
                      <div className="w-2 h-4 rounded-sm bg-black" />
                    </div>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full border-[2px] border-black/15" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[22px] mb-3 text-black leading-tight tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>{f.title}</h4>
                  <p className="text-[13px] leading-relaxed text-black/60 font-medium mb-8">
                    {f.desc}
                  </p>
                </div>
                <div className="self-end bg-black/25 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] text-white/95 font-bold tracking-widest uppercase flex items-center gap-2 transition-transform hover:scale-105">
                  <span className="w-1.5 h-1.5 rounded-full border-2 border-white/60" /> Explore
                </div>
              </div>
            ))}
          </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
          
          {/* Template 1: Creative Gradient */}
          <div className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 aspect-[1/1.4] flex flex-col cursor-pointer hover:-translate-y-2 overflow-hidden reveal reveal-delay-1">
            <div className="flex-1 w-full relative">
              <div className="h-10 bg-gradient-to-r from-[#A3C4F3] to-[#CFBAF0] w-full"></div>
              <div className="p-4 space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex-shrink-0"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2 w-3/4 bg-gray-800 rounded"></div>
                    <div className="h-1.5 w-1/2 bg-[#A3C4F3] rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                  <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                  <div className="h-1.5 w-4/5 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="space-y-2">
                    <div className="h-2 w-1/2 bg-gray-300 rounded mb-1"></div>
                    <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                    <div className="h-1.5 w-5/6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-1/2 bg-gray-300 rounded mb-1"></div>
                    <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                    <div className="h-1.5 w-4/5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-3 px-4 bg-white border-t border-gray-100 text-sm font-bold text-gray-800 text-center">Creative Gradient</div>
            <div className="absolute inset-0 bg-[#A3C4F3]/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => onOpenModal('signup')} className="px-5 py-2.5 bg-white text-gray-900 font-bold rounded-lg shadow-lg hover:scale-105 transition-transform text-sm">Use Template</button>
            </div>
          </div>

          {/* Template 2: Midnight Mode */}
          <div className="group relative bg-[#18181b] border border-gray-800 rounded-xl shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 aspect-[1/1.4] flex flex-col cursor-pointer hover:-translate-y-2 overflow-hidden reveal reveal-delay-2">
            <div className="flex-1 w-full p-4 flex flex-col">
              <div className="flex justify-between items-end mb-4 border-b border-gray-800 pb-3">
                 <div className="space-y-2 w-2/3">
                   <div className="h-2.5 w-4/5 bg-gray-100 rounded"></div>
                   <div className="h-1.5 w-1/2 bg-[#90DBF4] rounded"></div>
                 </div>
                 <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                 </div>
              </div>
              <div className="flex gap-4 flex-1">
                <div className="w-1/3 border-r border-gray-800 pr-3 space-y-4">
                  <div className="space-y-2">
                     <div className="h-1.5 w-full bg-gray-500 rounded"></div>
                     <div className="h-1 w-full bg-gray-700 rounded"></div>
                     <div className="h-1 w-4/5 bg-gray-700 rounded"></div>
                  </div>
                  <div className="space-y-2">
                     <div className="h-1.5 w-full bg-gray-500 rounded"></div>
                     <div className="h-1 w-full bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="w-2/3 space-y-4">
                  <div className="space-y-2">
                     <div className="h-2 w-1/2 bg-[#CFBAF0] rounded mb-2"></div>
                     <div className="h-1 w-full bg-gray-700 rounded"></div>
                     <div className="h-1 w-full bg-gray-700 rounded"></div>
                     <div className="h-1 w-5/6 bg-gray-700 rounded"></div>
                  </div>
                  <div className="space-y-2">
                     <div className="h-1 w-full bg-gray-700 rounded"></div>
                     <div className="h-1 w-4/5 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-3 px-4 bg-[#18181b] border-t border-gray-800 text-sm font-bold text-gray-200 text-center">Midnight Mode</div>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => onOpenModal('signup')} className="px-5 py-2.5 bg-gradient-to-r from-[#A3C4F3] to-[#CFBAF0] text-gray-900 font-bold rounded-lg shadow-lg hover:scale-105 transition-transform text-sm">Use Template</button>
            </div>
          </div>

          {/* Template 3: Executive Sidebar */}
          <div className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 aspect-[1/1.4] flex flex-col cursor-pointer hover:-translate-y-2 overflow-hidden reveal reveal-delay-3">
            <div className="flex-1 w-full flex">
              <div className="w-[35%] bg-[#1e293b] p-3 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white mb-3"></div>
                <div className="h-1.5 w-full bg-gray-400 rounded mb-1"></div>
                <div className="h-1 w-2/3 bg-gray-500 rounded mb-4"></div>
                
                <div className="w-full space-y-1.5 mt-auto mb-2">
                  <div className="h-1 w-full bg-gray-600 rounded"></div>
                  <div className="h-1 w-4/5 bg-gray-600 rounded"></div>
                </div>
              </div>
              <div className="w-[65%] p-4 space-y-4">
                <div className="space-y-1.5 border-b border-gray-200 pb-2">
                  <div className="h-2 w-3/4 bg-gray-800 rounded"></div>
                  <div className="h-1 w-1/2 bg-gray-400 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-1/2 bg-blue-600 rounded mb-1"></div>
                  <div className="h-1 w-full bg-gray-200 rounded"></div>
                  <div className="h-1 w-full bg-gray-200 rounded"></div>
                  <div className="h-1 w-4/5 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-1/2 bg-blue-600 rounded mb-1"></div>
                  <div className="h-1 w-full bg-gray-200 rounded"></div>
                  <div className="h-1 w-5/6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="py-3 px-4 bg-white border-t border-gray-100 text-sm font-bold text-gray-800 text-center">Executive Sidebar</div>
            <div className="absolute inset-0 bg-[#1e293b]/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => onOpenModal('signup')} className="px-5 py-2.5 bg-white text-gray-900 font-bold rounded-lg shadow-lg hover:scale-105 transition-transform text-sm">Use Template</button>
            </div>
          </div>

          {/* Template 4: Minimalist Clean */}
          <div className="group relative bg-[#fafafa] border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 aspect-[1/1.4] flex flex-col cursor-pointer hover:-translate-y-2 overflow-hidden reveal reveal-delay-4">
            <div className="flex-1 w-full p-5 space-y-6">
              <div className="text-center space-y-2">
                <div className="h-2.5 w-1/2 bg-gray-900 rounded mx-auto"></div>
                <div className="h-1 w-1/4 bg-gray-400 rounded mx-auto"></div>
                <div className="flex justify-center gap-2 mt-2">
                  <div className="w-4 h-1 bg-gray-300 rounded"></div>
                  <div className="w-4 h-1 bg-gray-300 rounded"></div>
                  <div className="w-4 h-1 bg-gray-300 rounded"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                  <div className="h-1.5 w-1/3 bg-gray-800 rounded"></div>
                  <div className="flex-1 border-b border-gray-200"></div>
                </div>
                <div className="space-y-1.5 pl-3">
                  <div className="h-1 w-full bg-gray-300 rounded"></div>
                  <div className="h-1 w-full bg-gray-300 rounded"></div>
                  <div className="h-1 w-5/6 bg-gray-300 rounded"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                  <div className="h-1.5 w-1/3 bg-gray-800 rounded"></div>
                  <div className="flex-1 border-b border-gray-200"></div>
                </div>
                <div className="space-y-1.5 pl-3">
                  <div className="h-1 w-full bg-gray-300 rounded"></div>
                  <div className="h-1 w-4/5 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
            <div className="py-3 px-4 bg-white border-t border-gray-100 text-sm font-bold text-gray-800 text-center">Minimalist Clean</div>
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => onOpenModal('signup')} className="px-5 py-2.5 bg-black text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform text-sm">Use Template</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
