"use client";

import React from 'react';
import { ResumeData, ResumeLayout } from '@/lib/resume-store';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ResumePreviewProps {
  data: ResumeData;
  className?: string;
  id?: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, className, id }) => {
  const isPdfTarget = id === 'resume-pdf-target';
  const config = data.templateConfig || { layout: 'executive', fontPair: 'classic', theme: 'warm' };

  const themes = {
    warm: { sidebar: '#2B1F14', accent: '#C9864A', text: '#1A1208', mute: '#8B7A66', bg: '#FAF9F6' },
    midnight: { sidebar: '#0F172A', accent: '#38BDF8', text: '#0F172A', mute: '#64748B', bg: '#F8FAFC' },
    emerald: { sidebar: '#064E3B', accent: '#10B981', text: '#064E3B', mute: '#374151', bg: '#F0FDF4' },
    slate: { sidebar: '#1E293B', accent: '#6366F1', text: '#1E293B', mute: '#475569', bg: '#F8FAFC' }
  };
  const theme = themes[config.theme] || themes.warm;

  const fontClasses = {
    classic: { head: 'font-headline', body: 'font-body' },
    modern: { head: 'font-body font-bold', body: 'font-body' },
    tech: { head: 'font-code font-bold uppercase', body: 'font-body' }
  };
  const fonts = fontClasses[config.fontPair] || fontClasses.classic;

  const groupedSkills = (data.skills || []).reduce((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof data.skills>);

  // Render Logic for different layouts
  const layout = data.version === 'ats' ? 'ats' : config.layout;

  const renderLayout = () => {
    switch (layout) {
      case 'ats':
        return <ATSLayout data={data} id={id} className={className} />;
      case 'creative':
        return <CreativeLayout data={data} theme={theme} fonts={fonts} groupedSkills={groupedSkills} />;
      case 'minimal':
        return <MinimalLayout data={data} theme={theme} fonts={fonts} groupedSkills={groupedSkills} />;
      case 'elegant':
        return <ElegantLayout data={data} theme={theme} fonts={fonts} groupedSkills={groupedSkills} />;
      case 'compact':
        return <CompactLayout data={data} theme={theme} fonts={fonts} groupedSkills={groupedSkills} />;
      case 'tech_pro':
        return <TechProLayout data={data} theme={theme} fonts={fonts} groupedSkills={groupedSkills} />;
      case 'classic':
        return <ClassicLayout data={data} theme={theme} fonts={fonts} groupedSkills={groupedSkills} />;
      case 'bold_sidebar':
        return <BoldSidebarLayout data={data} theme={theme} fonts={fonts} groupedSkills={groupedSkills} />;
      case 'modernist':
        return <ModernistLayout data={data} theme={theme} fonts={fonts} groupedSkills={groupedSkills} />;
      case 'split':
        return <SplitLayout data={data} theme={theme} fonts={fonts} groupedSkills={groupedSkills} />;
      case 'executive':
      default:
        return <ExecutiveLayout data={data} theme={theme} fonts={fonts} groupedSkills={groupedSkills} />;
    }
  };

  return (
    <div 
      id={id || "resume-content"}
      className={cn(
        "page-container relative bg-white overflow-hidden shadow-2xl origin-top",
        !isPdfTarget && "animate-fadeUp transition-all duration-300",
        "w-[794px] h-[1123px] text-[#1A1208]",
        className
      )}
      style={{ height: '1123px', width: '794px' }}
    >
      {renderLayout()}
    </div>
  );
};

// --- LAYOUT COMPONENTS ---

const ContactInfo = ({ data, theme, orientation = 'vertical' }: any) => (
  <div className={cn("flex gap-4", orientation === 'vertical' ? "flex-col" : "flex-row flex-wrap justify-center")}>
    {data.phone && <div className="flex items-center gap-2 text-[10px]"><Phone className="w-3 h-3" style={{ color: theme.accent }} /> <span>{data.phone}</span></div>}
    {data.email && <div className="flex items-center gap-2 text-[10px]"><Mail className="w-3 h-3" style={{ color: theme.accent }} /> <span className="break-all">{data.email}</span></div>}
    {data.location && <div className="flex items-center gap-2 text-[10px]"><MapPin className="w-3 h-3" style={{ color: theme.accent }} /> <span>{data.location}</span></div>}
  </div>
);

const SectionTitle = ({ children, theme, className }: any) => (
  <h3 className={cn("text-[9px] font-black tracking-[3px] uppercase border-b pb-1 mb-3", className)} style={{ color: theme.mute, borderColor: `${theme.accent}22` }}>
    {children}
  </h3>
);

const ExecutiveLayout = ({ data, theme, fonts, groupedSkills }: any) => (
  <div className="grid grid-cols-[228px_1fr] h-full">
    <aside className="p-6 pt-10 flex flex-col gap-6 h-full border-r" style={{ backgroundColor: theme.sidebar, color: '#C8B8A8' }}>
      <div className="flex flex-col items-center mb-4">
        <Avatar className="w-24 h-24 border-4 border-white/10 shadow-xl mb-4">
          <AvatarImage src={data.photoUrl} className="object-cover" />
          <AvatarFallback className="bg-primary text-white text-2xl">{data.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className={cn("text-xl font-bold text-white text-center leading-tight", fonts.head)}>{data.name}</h2>
        <div className="text-[9px] font-bold tracking-[2px] uppercase text-center mt-2" style={{ color: theme.accent }}>{data.role}</div>
      </div>
      <ContactInfo data={data} theme={theme} />
      <div className="space-y-4">
        <h3 className="text-[8px] font-black tracking-[3px] uppercase border-b pb-1" style={{ color: theme.accent }}>Skills</h3>
        {Object.entries(groupedSkills).map(([cat, skills]: any) => (
          <div key={cat} className="space-y-1.5">
            <div className="text-[7px] font-black uppercase opacity-60">{cat}</div>
            <div className="flex flex-wrap gap-1">
              {skills.map((s: any) => <span key={s.id} className="text-[9px] px-2 py-0.5 bg-white/5 rounded-sm">{s.name}</span>)}
            </div>
          </div>
        ))}
      </div>
    </aside>
    <main className="p-10 pt-12 flex flex-col gap-8" style={{ backgroundColor: theme.bg }}>
      <header>
        <h1 className={cn("text-4xl font-bold mb-2", fonts.head)} style={{ color: theme.text }}>{data.name}</h1>
        <h2 className="text-xs font-bold tracking-[4px] uppercase" style={{ color: theme.accent }}>{data.role}</h2>
      </header>
      <section>
        <SectionTitle theme={theme}>Profile</SectionTitle>
        <p className="text-[11px] leading-relaxed text-justify" style={{ color: theme.text }}>{data.profileSummary}</p>
      </section>
      <section className="flex-1">
        <SectionTitle theme={theme}>Experience</SectionTitle>
        <div className="space-y-6">
          {data.experiences.map((exp: any) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="text-[13px] font-bold" style={{ color: theme.text }}>{exp.company}</h4>
                <span className="text-[9px] font-bold uppercase" style={{ color: theme.accent }}>{exp.duration}</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: theme.accent }}>{exp.role}</div>
              <ul className="space-y-1.5">
                {exp.bullets.map((b: string, i: number) => (
                  <li key={i} className="text-[10.5px] leading-relaxed pl-4 relative" style={{ color: theme.text }}>
                    <div className="absolute left-0 top-[8px] w-1.5 h-[1px]" style={{ backgroundColor: theme.accent }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

const MinimalLayout = ({ data, theme, fonts, groupedSkills }: any) => (
  <div className="p-12 flex flex-col h-full gap-10" style={{ backgroundColor: theme.bg }}>
    <header className="flex justify-between items-start border-b pb-8" style={{ borderColor: `${theme.accent}33` }}>
      <div>
        <h1 className={cn("text-5xl font-bold mb-2", fonts.head)} style={{ color: theme.text }}>{data.name}</h1>
        <h2 className="text-sm font-bold tracking-[5px] uppercase" style={{ color: theme.accent }}>{data.role}</h2>
      </div>
      <ContactInfo data={data} theme={theme} />
    </header>
    <div className="grid grid-cols-[1fr_250px] gap-12 flex-1">
      <div className="space-y-10">
        <section>
          <SectionTitle theme={theme}>Expertise Summary</SectionTitle>
          <p className="text-[11.5px] leading-loose opacity-80">{data.profileSummary}</p>
        </section>
        <section>
          <SectionTitle theme={theme}>Professional Experience</SectionTitle>
          <div className="space-y-8">
            {data.experiences.map((exp: any) => (
              <div key={exp.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold">{exp.company}</h4>
                  <span className="text-[10px] font-medium opacity-60">{exp.duration}</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.accent }}>{exp.role}</div>
                <ul className="space-y-2">
                  {exp.bullets.map((b: string, i: number) => <li key={i} className="text-[11px] leading-relaxed opacity-80 flex gap-3"><span>•</span> {b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
      <aside className="space-y-10">
        <section>
          <SectionTitle theme={theme}>Core Skills</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s: any) => (
              <span key={s.id} className="text-[10px] px-3 py-1 bg-white border rounded-full shadow-sm">{s.name}</span>
            ))}
          </div>
        </section>
        {data.education.length > 0 && (
          <section>
            <SectionTitle theme={theme}>Education</SectionTitle>
            <div className="space-y-4">
              {data.education.map((edu: any) => (
                <div key={edu.id}>
                  <div className="text-[11px] font-bold">{edu.degree}</div>
                  <div className="text-[10px] opacity-60">{edu.institution}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>
    </div>
  </div>
);

const ATSLayout = ({ data, id, className }: any) => (
  <div 
    id={id || "resume-content"}
    className={cn("bg-white p-12 text-black font-sans leading-relaxed w-full h-full", className)}
  >
    <header className="border-b-2 border-black pb-4 mb-6">
      <h1 className="text-3xl font-bold uppercase tracking-tight">{data.name}</h1>
      <div className="text-sm mt-1 flex gap-4">
        <span>{data.email}</span>
        <span>|</span>
        <span>{data.phone}</span>
        <span>|</span>
        <span>{data.location}</span>
      </div>
      <div className="text-lg font-bold mt-2 text-gray-700">{data.role}</div>
    </header>
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Professional Summary</h2>
      <p className="text-[11px] leading-normal">{data.profileSummary}</p>
    </section>
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Work Experience</h2>
      <div className="space-y-4">
        {data.experiences.map((exp: any) => (
          <div key={exp.id}>
            <div className="flex justify-between font-bold text-xs">
              <span>{exp.company}</span>
              <span>{exp.duration}</span>
            </div>
            <div className="italic text-[11px] mb-1">{exp.role}</div>
            <ul className="list-disc pl-5 text-[11px] space-y-1">
              {exp.bullets.map((b: any, i: number) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
    <section>
      <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Education</h2>
      {data.education.map((edu: any) => (
        <div key={edu.id} className="text-[11px]">
          <span className="font-bold">{edu.degree}</span> - {edu.institution}
        </div>
      ))}
    </section>
  </div>
);

const ElegantLayout = ({ data, theme, fonts }: any) => (
  <div className="p-16 h-full flex flex-col gap-10 text-center" style={{ backgroundColor: theme.bg }}>
    <header className="space-y-4">
      <h1 className={cn("text-5xl font-bold", fonts.head)} style={{ color: theme.text }}>{data.name}</h1>
      <div className="flex items-center justify-center gap-6 text-[10px] font-medium tracking-[2px] uppercase opacity-70">
        <span>{data.role}</span>
        <span>•</span>
        <span>{data.location}</span>
      </div>
      <div className="flex justify-center gap-6 text-[11px] border-t border-b py-4" style={{ borderColor: `${theme.accent}22` }}>
        <span>{data.email}</span>
        <span>{data.phone}</span>
      </div>
    </header>
    <section className="max-w-2xl mx-auto">
      <p className="text-[12px] leading-relaxed italic opacity-80">{data.profileSummary}</p>
    </section>
    <div className="grid grid-cols-1 gap-12 text-left">
      <section>
        <SectionTitle theme={theme} className="text-center">Experience</SectionTitle>
        <div className="space-y-10">
          {data.experiences.map((exp: any) => (
            <div key={exp.id} className="space-y-3">
              <div className="flex justify-between items-end border-b pb-1">
                <h4 className="text-base font-bold">{exp.company}</h4>
                <span className="text-[10px] font-medium opacity-60">{exp.duration}</span>
              </div>
              <div className="text-[11px] font-bold italic opacity-70">{exp.role}</div>
              <ul className="space-y-2 pl-4 border-l-2" style={{ borderColor: `${theme.accent}44` }}>
                {exp.bullets.map((b: string, i: number) => <li key={i} className="text-[11px] leading-relaxed">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

const CreativeLayout = ({ data, theme, fonts, groupedSkills }: any) => (
  <div className="w-full h-full flex flex-col bg-white overflow-hidden relative">
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9864A]/5 rounded-bl-full -mr-20 -mt-20 z-0" />
    <header className="p-12 pb-6 z-10 flex justify-between items-start">
      <div className="space-y-2">
        <h1 className={cn("text-5xl font-black uppercase tracking-tighter leading-none", fonts.head)} style={{ color: theme.sidebar }}>
          {data.name.split(' ').map((n: string, i: number) => (
            <span key={i} className={i === 0 ? "block" : "block opacity-40"}>{n}</span>
          ))}
        </h1>
        <div className="h-1.5 w-24 rounded-full" style={{ backgroundColor: theme.accent }} />
      </div>
      <div className="flex flex-col items-end text-[10px] font-bold uppercase tracking-widest space-y-2 text-right">
        <div className="px-3 py-1 bg-[#1A1208] text-white rounded-md">{data.role}</div>
        <div className="space-y-1 pt-4">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
        </div>
      </div>
    </header>
    <div className="flex-1 flex px-12 gap-12 z-10 overflow-hidden">
      <div className="flex-[2] space-y-8">
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3"><span className="w-8 h-[1px] bg-[#1A1208]/20" /> Overview</h3>
          <p className="text-sm leading-relaxed text-justify opacity-80">{data.profileSummary}</p>
        </section>
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3"><span className="w-8 h-[1px] bg-[#1A1208]/20" /> Experience</h3>
          <div className="space-y-6">
            {data.experiences.map((exp: any) => (
              <div key={exp.id} className="grid grid-cols-[100px_1fr] gap-4">
                <div className="text-[10px] font-bold opacity-40 pt-1">{exp.duration}</div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold leading-none">{exp.company}</h4>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.accent }}>{exp.role}</div>
                  <ul className="space-y-1.5 opacity-80">
                    {exp.bullets.map((b: string, i: number) => <li key={i} className="text-[11px] leading-tight flex gap-2"><span>•</span> {b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="flex-1 space-y-8 border-l pl-8 border-[#1A1208]/5">
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expertise</h3>
          {Object.entries(groupedSkills).map(([cat, skills]: any) => (
            <div key={cat} className="space-y-2">
              <div className="text-[8px] font-black uppercase tracking-widest opacity-40">{cat}</div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s: any) => (
                  <span key={s.id} className="px-2 py-0.5 border border-[#C9864A]/20 text-[#C9864A] text-[9px] font-bold rounded">{s.name}</span>
                ))}
              </div>
            </div>
          ))}
        </section>
        {data.photoUrl && <img src={data.photoUrl} className="w-full aspect-square object-cover grayscale rounded-2xl shadow-xl" />}
      </div>
    </div>
  </div>
);

const CompactLayout = ({ data, theme, fonts }: any) => (
  <div className="p-10 flex flex-col h-full gap-6 text-[10px]" style={{ backgroundColor: theme.bg }}>
    <header className="grid grid-cols-2 border-b-2 pb-4" style={{ borderColor: theme.accent }}>
      <div>
        <h1 className={cn("text-3xl font-black", fonts.head)}>{data.name}</h1>
        <h2 className="text-xs font-bold uppercase" style={{ color: theme.accent }}>{data.role}</h2>
      </div>
      <div className="text-right space-y-0.5">
        <div>{data.location}</div>
        <div>{data.phone}</div>
        <div className="font-bold">{data.email}</div>
      </div>
    </header>
    <section>
      <p className="leading-tight opacity-90">{data.profileSummary}</p>
    </section>
    <div className="grid grid-cols-[1fr_200px] gap-8 flex-1">
      <section className="space-y-6">
        <SectionTitle theme={theme}>History</SectionTitle>
        {data.experiences.map((exp: any) => (
          <div key={exp.id} className="space-y-1">
            <div className="flex justify-between font-bold">
              <span>{exp.company} — {exp.role}</span>
              <span>{exp.duration}</span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5">
              {exp.bullets.map((b: string, i: number) => <li key={i} className="leading-tight">{b}</li>)}
            </ul>
          </div>
        ))}
      </section>
      <aside className="space-y-6">
        <section>
          <SectionTitle theme={theme}>Skill Matrix</SectionTitle>
          <div className="space-y-1">
            {data.skills.map((s: any) => (
              <div key={s.id} className="flex justify-between">
                <span>{s.name}</span>
                <span className="opacity-40">({s.level}%)</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  </div>
);

const TechProLayout = ({ data, theme, fonts }: any) => (
  <div className="flex h-full bg-[#0F172A] text-slate-300 font-mono text-[10px]">
    <aside className="w-[200px] p-8 bg-slate-900 border-r border-slate-800 flex flex-col gap-8">
      <div className="space-y-2">
        <div className="w-12 h-1 bg-sky-500" />
        <h1 className="text-white text-xl font-bold leading-none">{data.name.toUpperCase()}</h1>
      </div>
      <section className="space-y-4">
        <div className="text-sky-500 font-black">/CONTACT</div>
        <div className="space-y-2 break-all opacity-70">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
        </div>
      </section>
      <section className="space-y-4">
        <div className="text-sky-500 font-black">/STACK</div>
        <div className="space-y-1.5">
          {data.skills.map((s: any) => (
            <div key={s.id} className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>{s.name}</span>
                <span className="text-sky-500">{s.level}%</span>
              </div>
              <div className="h-0.5 bg-slate-800 w-full"><div className="h-full bg-sky-500" style={{ width: `${s.level}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
    </aside>
    <main className="flex-1 p-12 space-y-10 overflow-hidden">
      <section className="space-y-4">
        <div className="text-sky-500 font-black flex items-center gap-4">
          <span className="opacity-20">01</span> ABOUT_ME <div className="h-[1px] flex-1 bg-slate-800" />
        </div>
        <p className="leading-relaxed opacity-80">{data.profileSummary}</p>
      </section>
      <section className="space-y-6">
        <div className="text-sky-500 font-black flex items-center gap-4">
          <span className="opacity-20">02</span> EXPERIENCE <div className="h-[1px] flex-1 bg-slate-800" />
        </div>
        <div className="space-y-8">
          {data.experiences.map((exp: any) => (
            <div key={exp.id} className="space-y-2">
              <div className="flex justify-between items-baseline text-white">
                <h4 className="font-bold">{exp.role} @ {exp.company}</h4>
                <span className="text-[8px] opacity-40">{exp.duration}</span>
              </div>
              <ul className="space-y-1 opacity-60">
                {exp.bullets.map((b: string, i: number) => <li key={i} className="flex gap-2"><span>{'>'}</span> {b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

const ClassicLayout = ({ data, theme, fonts }: any) => (
  <div className="p-16 h-full text-[#1A1208]" style={{ backgroundColor: '#FFF' }}>
    <header className="text-center border-b-2 border-double border-black pb-6 mb-10">
      <h1 className={cn("text-4xl mb-2", fonts.head)}>{data.name}</h1>
      <div className="text-xs space-x-4">
        <span>{data.location}</span>
        <span>•</span>
        <span>{data.phone}</span>
        <span>•</span>
        <span>{data.email}</span>
      </div>
    </header>
    <div className="space-y-10">
      <section>
        <h3 className="font-bold uppercase border-b mb-3">Professional Profile</h3>
        <p className="text-[12px] leading-relaxed">{data.profileSummary}</p>
      </section>
      <section>
        <h3 className="font-bold uppercase border-b mb-4">Work Experience</h3>
        {data.experiences.map((exp: any) => (
          <div key={exp.id} className="mb-6">
            <div className="flex justify-between font-bold text-sm">
              <span>{exp.company}</span>
              <span>{exp.duration}</span>
            </div>
            <div className="italic text-xs mb-2">{exp.role}</div>
            <ul className="list-disc pl-5 text-[11px] space-y-1">
              {exp.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        ))}
      </section>
    </div>
  </div>
);

const BoldSidebarLayout = ({ data, theme, fonts }: any) => (
  <div className="grid grid-cols-[280px_1fr] h-full">
    <aside className="bg-[#1A1208] text-white p-10 flex flex-col gap-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-black leading-tight">{data.name.split(' ')[0]}<br/><span className="text-[#C9864A]">{data.name.split(' ')[1] || ""}</span></h1>
        <p className="text-[10px] font-bold uppercase tracking-[4px] opacity-40">{data.role}</p>
      </div>
      <section className="space-y-4">
        <div className="text-[#C9864A] text-[9px] font-black uppercase tracking-widest">Connect</div>
        <div className="space-y-3 text-[10px]">
          <div className="flex items-center gap-3"><Mail className="w-3 h-3"/> {data.email}</div>
          <div className="flex items-center gap-3"><Phone className="w-3 h-3"/> {data.phone}</div>
          <div className="flex items-center gap-3"><MapPin className="w-3 h-3"/> {data.location}</div>
        </div>
      </section>
      <section className="space-y-4">
        <div className="text-[#C9864A] text-[9px] font-black uppercase tracking-widest">Skills</div>
        <div className="space-y-4">
          {data.skills.map((s: any) => (
            <div key={s.id} className="space-y-1.5">
              <div className="flex justify-between text-[9px]"><span>{s.name}</span><span>{s.level}%</span></div>
              <div className="h-1 bg-white/10 w-full"><div className="h-full bg-[#C9864A]" style={{ width: `${s.level}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
    </aside>
    <main className="p-12 space-y-12 bg-white">
      <section className="space-y-4">
        <div className="text-xs font-black uppercase tracking-[5px] text-[#1A1208]/20">Biography</div>
        <p className="text-base font-medium leading-relaxed">{data.profileSummary}</p>
      </section>
      <section className="space-y-8">
        <div className="text-xs font-black uppercase tracking-[5px] text-[#1A1208]/20">Work History</div>
        {data.experiences.map((exp: any) => (
          <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-8">
            <div className="text-[10px] font-bold opacity-40">{exp.duration}</div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold">{exp.company}</h4>
              <div className="text-[10px] font-bold uppercase text-[#C9864A]">{exp.role}</div>
              <ul className="space-y-2 opacity-70">
                {exp.bullets.map((b: string, i: number) => <li key={i} className="text-[11px] leading-relaxed flex gap-2"><span>•</span> {b}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </section>
    </main>
  </div>
);

const ModernistLayout = ({ data, theme, fonts }: any) => (
  <div className="p-12 h-full flex flex-col gap-10 bg-white">
    <header className="flex justify-between border-b-8 border-[#1A1208] pb-6">
      <div>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.8]">{data.name}</h1>
        <p className="text-xl font-bold mt-2" style={{ color: theme.accent }}>{data.role}</p>
      </div>
      <div className="text-right text-[10px] font-bold flex flex-col justify-end">
        <div>{data.email}</div>
        <div>{data.phone}</div>
        <div>{data.location}</div>
      </div>
    </header>
    <div className="grid grid-cols-2 gap-12 flex-1 overflow-hidden">
      <section className="space-y-6">
        <div className="bg-[#1A1208] text-white px-3 py-1 text-[10px] font-bold uppercase w-fit">Summary</div>
        <p className="text-[13px] leading-relaxed font-bold">{data.profileSummary}</p>
        <div className="bg-[#1A1208] text-white px-3 py-1 text-[10px] font-bold uppercase w-fit">Skills</div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s: any) => <span key={s.id} className="px-3 py-1 bg-muted font-bold text-[11px]">{s.name}</span>)}
        </div>
      </section>
      <section className="space-y-8">
        <div className="bg-[#1A1208] text-white px-3 py-1 text-[10px] font-bold uppercase w-fit">Experience</div>
        {data.experiences.map((exp: any) => (
          <div key={exp.id} className="space-y-2">
            <div className="flex justify-between items-baseline font-black">
              <h4 className="text-lg uppercase">{exp.company}</h4>
              <span className="text-[9px]">{exp.duration}</span>
            </div>
            <div className="text-xs font-bold" style={{ color: theme.accent }}>{exp.role}</div>
            <ul className="space-y-2">
              {exp.bullets.map((b: string, i: number) => <li key={i} className="text-[11px] leading-tight flex gap-3"><span className="w-1 h-1 bg-[#1A1208] mt-1.5 shrink-0" /> {b}</li>)}
            </ul>
          </div>
        ))}
      </section>
    </div>
  </div>
);

const SplitLayout = ({ data, theme, fonts, groupedSkills }: any) => (
  <div className="grid grid-cols-[1fr_228px] h-full">
    <main className="p-10 pt-12 flex flex-col gap-8" style={{ backgroundColor: theme.bg }}>
      <header>
        <h1 className={cn("text-4xl font-bold mb-2", fonts.head)} style={{ color: theme.text }}>{data.name}</h1>
        <h2 className="text-xs font-bold tracking-[4px] uppercase" style={{ color: theme.accent }}>{data.role}</h2>
      </header>
      <section>
        <SectionTitle theme={theme}>Profile</SectionTitle>
        <p className="text-[11px] leading-relaxed text-justify" style={{ color: theme.text }}>{data.profileSummary}</p>
      </section>
      <section className="flex-1">
        <SectionTitle theme={theme}>Experience</SectionTitle>
        <div className="space-y-6">
          {data.experiences.map((exp: any) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="text-[13px] font-bold" style={{ color: theme.text }}>{exp.company}</h4>
                <span className="text-[9px] font-bold uppercase" style={{ color: theme.accent }}>{exp.duration}</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: theme.accent }}>{exp.role}</div>
              <ul className="space-y-1.5">
                {exp.bullets.map((b: string, i: number) => <li key={i} className="text-[10.5px] leading-relaxed flex gap-3"><span>•</span> {b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
    <aside className="p-6 pt-10 flex flex-col gap-6 h-full border-l" style={{ backgroundColor: theme.sidebar, color: '#C8B8A8' }}>
      <div className="flex flex-col items-center mb-4">
        <Avatar className="w-24 h-24 border-4 border-white/10 shadow-xl mb-4">
          <AvatarImage src={data.photoUrl} className="object-cover" />
          <AvatarFallback className="bg-primary text-white text-2xl">{data.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <ContactInfo data={data} theme={theme} />
      <div className="space-y-4">
        <h3 className="text-[8px] font-black tracking-[3px] uppercase border-b pb-1" style={{ color: theme.accent }}>Skills</h3>
        {Object.entries(groupedSkills).map(([cat, skills]: any) => (
          <div key={cat} className="space-y-1.5">
            <div className="text-[7px] font-black uppercase opacity-60">{cat}</div>
            <div className="flex flex-wrap gap-1">
              {skills.map((s: any) => <span key={s.id} className="text-[9px] px-2 py-0.5 bg-white/5 rounded-sm">{s.name}</span>)}
            </div>
          </div>
        ))}
      </div>
    </aside>
  </div>
);
