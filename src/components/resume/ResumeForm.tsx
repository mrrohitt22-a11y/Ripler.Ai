
"use client";

import React, { useState, useRef } from 'react';
import { ResumeData, ResumeTone, ResumeVersion, ResumeLayout } from '@/lib/resume-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Sparkles, Plus, Trash2, Wand2, Upload, Loader2, ShieldCheck, Briefcase, User, FileText, Layout, ChevronRight, Camera, Image as ImageIcon, FileUp, Palette, Type } from 'lucide-react';
import { parseResume } from '@/ai/flows/ai-resume-parser';
import { improveContent } from '@/ai/flows/ai-content-improver';
import { optimizeResume } from '@/ai/flows/ai-resume-optimizer';
import { generateProfileSummary } from '@/ai/flows/ai-profile-summary-generator';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  const { toast } = useToast();
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [improvedData, setImprovedData] = useState<ResumeData | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleToneChange = (val: string) => {
    onChange({ ...data, tone: val as ResumeTone });
  };

  const handleVersionChange = (val: string) => {
    onChange({ ...data, version: val as ResumeVersion });
    toast({ title: `Strategy Switched to ${val.toUpperCase()}`, description: "Optimizing layout context." });
  };

  const handleConfigChange = (key: keyof typeof data.templateConfig, value: string) => {
    onChange({
      ...data,
      templateConfig: {
        ...data.templateConfig,
        [key]: value
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange({ ...data, photoUrl: ev.target?.result as string });
        toast({ title: "Photo Updated" });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onChange({ ...data, photoUrl: "" });
    toast({ title: "Photo Removed" });
  };

  const handleFixResume = async () => {
    setOptimizing(true);
    try {
      const result = await optimizeResume(data);
      setImprovedData(result as ResumeData);
      setComparisonOpen(true);
      toast({ title: "AI Analysis complete!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Optimization failed" });
    } finally {
      setOptimizing(false);
    }
  };

  const applyOptimization = () => {
    if (improvedData) {
      onChange({
        ...improvedData,
        templateConfig: data.templateConfig,
        photoUrl: data.photoUrl,
        tone: data.tone,
        version: data.version
      });
      setComparisonOpen(false);
      setImprovedData(null);
      toast({ title: "Upgrades Applied!" });
    }
  };

  const handleExpertSummary = async () => {
    setLoadingAI('profileSummary');
    try {
      const expText = (data.experiences || []).map(e => `${e.role} at ${e.company}: ${e.bullets.join(' ')}`).join('\n');
      const skillsArr = (data.skills || []).map(s => s.name);
      const result = await generateProfileSummary({
        experienceText: expText || "Professional background",
        skills: skillsArr,
        role: data.role || "Professional"
      });
      onChange({ ...data, profileSummary: result.summary });
      toast({ title: "Expert Summary Generated" });
    } catch (err) {
      toast({ variant: "destructive", title: "Generation failed" });
    } finally {
      setLoadingAI(null);
    }
  };

  const handleImproveContent = async (field: keyof ResumeData, type: 'name' | 'summary' | 'experience', extraId?: string) => {
    const currentVal = extraId 
      ? (data.experiences || []).find(e => e.id === extraId)?.bullets.join('\n') || ""
      : String(data[field] || "");

    if (!currentVal.trim()) return;

    setLoadingAI(extraId || field);
    try {
      const result = await improveContent({ content: currentVal, type });
      if (extraId) {
        const newExps = (data.experiences || []).map(e => 
          e.id === extraId ? { ...e, bullets: [result.improvedContent] } : e
        );
        onChange({ ...data, experiences: newExps });
      } else {
        onChange({ ...data, [field]: result.improvedContent });
      }
      toast({ title: "Refined by AI!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Refinement failed" });
    } finally {
      setLoadingAI(null);
    }
  };

  const handleSmartImport = async (text?: string, fileDataUri?: string) => {
    setImporting(true);
    try {
      const result = await parseResume({ text: text || undefined, fileDataUri: fileDataUri || undefined });
      onChange({ ...result, templateConfig: data.templateConfig, tone: data.tone, version: data.version } as ResumeData);
      toast({ title: "Profile Synced Successful" });
      setDialogOpen(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Import failed" });
    } finally {
      setImporting(false);
    }
  };

  const addArrayItem = <T extends any>(key: keyof ResumeData, newItem: T) => {
    onChange({ ...data, [key]: [...((data[key] as T[]) || []), newItem] });
  };

  const removeArrayItem = (key: keyof ResumeData, id: string) => {
    onChange({ ...data, [key]: ((data[key] as any[]) || []).filter((item: any) => item.id !== id) });
  };

  const LAYOUTS: { id: ResumeLayout; name: string }[] = [
    { id: 'executive', name: 'Executive' },
    { id: 'minimal', name: 'Minimalist' },
    { id: 'split', name: 'Split View' },
    { id: 'creative', name: 'Creative' },
    { id: 'modernist', name: 'Modernist' },
    { id: 'ats', name: 'ATS Optimized' },
    { id: 'elegant', name: 'Elegant' },
    { id: 'compact', name: 'Compact' },
    { id: 'tech_pro', name: 'Tech Pro' },
    { id: 'classic', name: 'Classic' },
    { id: 'bold_sidebar', name: 'Bold Sidebar' },
  ];

  return (
    <div className="space-y-8 h-full overflow-y-auto pb-24 pr-1 scrollbar-hide gpu-render">
      {/* Editor Header Section */}
      <div className="flex flex-col gap-4 sticky top-0 bg-card/95 backdrop-blur-md z-30 py-4 border-b -mx-2 px-2">
        <div className="flex justify-between items-center">
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/70">Building Dashboard</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 border-primary/20 text-primary hover:bg-primary/5 font-black text-[9px] uppercase tracking-widest rounded-full">
                <FileUp className="w-3.5 h-3.5" /> AI Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md sm:rounded-2xl">
              <DialogHeader>
                <DialogTitle>PDF Resume Import</DialogTitle>
                <DialogDescription className="text-xs">Upload your existing PDF resume to instantly build your Ripler profile.</DialogDescription>
              </DialogHeader>
              <div className="py-12">
                <Button 
                  variant="outline" 
                  className="w-full h-40 flex-col gap-4 border-dashed border-2 hover:bg-primary/5 rounded-3xl" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                >
                  {importing ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <FileText className="w-8 h-8" />}
                  <span className="text-[11px] font-black uppercase tracking-widest">Upload PDF</span>
                  <input type="file" className="hidden" ref={fileInputRef} accept="application/pdf" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => handleSmartImport(undefined, ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black tracking-widest text-primary/60">Strategy</Label>
              <Tabs value={data.version || 'designer'} onValueChange={handleVersionChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-9 p-1 bg-card border">
                  <TabsTrigger value="ats" className="text-[9px] font-black uppercase">ATS</TabsTrigger>
                  <TabsTrigger value="designer" className="text-[9px] font-black uppercase">Design</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black tracking-widest text-primary/60">Persona</Label>
              <Select value={data.tone || 'Corporate'} onValueChange={handleToneChange}>
                <SelectTrigger className="h-9 text-[10px] font-bold bg-card border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fresher" className="text-xs">🎓 Fresher</SelectItem>
                  <SelectItem value="Corporate" className="text-xs">💼 Corporate</SelectItem>
                  <SelectItem value="Creative" className="text-xs">🎨 Creative</SelectItem>
                  <SelectItem value="Startup" className="text-xs">🚀 Startup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full bg-primary text-white h-11 shadow-xl hover:bg-primary/90 transition-all active:scale-[0.98] rounded-xl" onClick={handleFixResume} disabled={optimizing}>
            {optimizing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
            <span className="font-black uppercase tracking-[0.15em] text-[10px]">Execute AI Makeover</span>
          </Button>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["design", "personal"]} className="space-y-6">
        <AccordionItem value="design" className="border hover:border-primary/30 rounded-2xl bg-card/80 backdrop-blur-xl px-6 shadow-sm hover:shadow-md transition-all duration-300 data-[state=open]:border-primary/40 data-[state=open]:shadow-lg">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Layout className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-headline text-xl block">Template & Design</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Visual Strategy</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2 pb-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                  <Layout className="w-3 h-3" /> Select Layout
                </Label>
                <Select value={data.templateConfig.layout} onValueChange={(v) => handleConfigChange('layout', v)}>
                  <SelectTrigger className="h-11 font-bold text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LAYOUTS.map(l => <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                    <Palette className="w-3 h-3" /> Color Theme
                  </Label>
                  <Select value={data.templateConfig.theme} onValueChange={(v) => handleConfigChange('theme', v)}>
                    <SelectTrigger className="h-11 font-bold text-xs rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm" className="text-xs">Warm Executive</SelectItem>
                      <SelectItem value="midnight" className="text-xs">Midnight Tech</SelectItem>
                      <SelectItem value="emerald" className="text-xs">Emerald Forest</SelectItem>
                      <SelectItem value="slate" className="text-xs">Slate Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                    <Type className="w-3 h-3" /> Font Pair
                  </Label>
                  <Select value={data.templateConfig.fontPair} onValueChange={(v) => handleConfigChange('fontPair', v)}>
                    <SelectTrigger className="h-11 font-bold text-xs rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic" className="text-xs">Classic Serif</SelectItem>
                      <SelectItem value="modern" className="text-xs">Modern Sans</SelectItem>
                      <SelectItem value="tech" className="text-xs">Tech Mono</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="personal" className="border hover:border-primary/30 rounded-2xl bg-card/80 backdrop-blur-xl px-6 shadow-sm hover:shadow-md transition-all duration-300 data-[state=open]:border-primary/40 data-[state=open]:shadow-lg">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-headline text-xl block">Personal Details</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Identity</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2 pb-8">
            <div className="flex items-center gap-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="relative group">
                <Avatar className="w-20 h-20 border-2 border-white shadow-md">
                  <AvatarImage src={data.photoUrl} className="object-cover" />
                  <AvatarFallback className="bg-primary/20 text-primary"><User className="w-8 h-8" /></AvatarFallback>
                </Avatar>
                <button onClick={() => photoInputRef.current?.click()} className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="w-6 h-6" /></button>
                <input type="file" className="hidden" ref={photoInputRef} accept="image/*" onChange={handleImageUpload} />
              </div>
              <div className="space-y-1.5">
                <div className="text-[11px] font-black uppercase tracking-widest text-primary">Headshot</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-[9px] font-bold uppercase rounded-lg" onClick={() => photoInputRef.current?.click()}>Upload</Button>
                  {data.photoUrl && <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase rounded-lg text-destructive" onClick={removePhoto}>Remove</Button>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black opacity-50">Full Name</Label>
                <Input name="name" value={data.name} onChange={handleInputChange} className="h-11 font-bold text-sm rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black opacity-50">Target Role</Label>
                <Input name="role" value={data.role} onChange={handleInputChange} className="h-11 font-bold text-sm rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black opacity-50">Email</Label>
                <Input name="email" value={data.email} onChange={handleInputChange} className="h-11 font-bold text-sm rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black opacity-50">Location</Label>
                <Input name="location" value={data.location} onChange={handleInputChange} className="h-11 font-bold text-sm rounded-xl" />
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-dashed">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] uppercase font-black opacity-50">Summary</Label>
                <Button variant="ghost" size="sm" className="h-8 px-4 text-[9px] text-primary font-black uppercase rounded-full" onClick={handleExpertSummary} disabled={loadingAI === 'profileSummary'}>
                  {loadingAI === 'profileSummary' ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />} Auto-Summary
                </Button>
              </div>
              <Textarea name="profileSummary" value={data.profileSummary} onChange={handleInputChange} className="min-h-[140px] text-xs rounded-xl" />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience" className="border hover:border-primary/30 rounded-2xl bg-card/80 backdrop-blur-xl px-6 shadow-sm hover:shadow-md transition-all duration-300 data-[state=open]:border-primary/40 data-[state=open]:shadow-lg">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-headline text-xl block">Experience</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Professional History</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2 pb-8">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="p-6 border border-border/50 rounded-2xl space-y-5 relative group bg-card/50 hover:bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 text-destructive" onClick={() => removeArrayItem('experiences', exp.id)}><Trash2 className="w-4 h-4" /></Button>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase font-black opacity-50">Company</Label>
                    <Input value={exp.company} onChange={(e) => onChange({...data, experiences: data.experiences.map(ex => ex.id === exp.id ? {...ex, company: e.target.value} : ex)})} className="h-10 text-[13px] font-bold rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase font-black opacity-50">Role</Label>
                    <Input value={exp.role} onChange={(e) => onChange({...data, experiences: data.experiences.map(ex => ex.id === exp.id ? {...ex, role: e.target.value} : ex)})} className="h-10 text-[13px] font-bold rounded-xl" />
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-dashed">
                  <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase opacity-50">Bullets</Label><Button variant="ghost" size="sm" className="h-8 text-[9px] text-primary font-black uppercase" onClick={() => handleImproveContent('experiences', 'experience', exp.id)} disabled={loadingAI === exp.id}><Wand2 className="w-3.5 h-3.5 mr-2" /> Refine</Button></div>
                  {exp.bullets.map((b, i) => (
                    <Input key={i} value={b} onChange={(e) => {
                      const newB = [...exp.bullets]; newB[i] = e.target.value;
                      onChange({...data, experiences: data.experiences.map(ex => ex.id === exp.id ? {...ex, bullets: newB} : ex)});
                    }} className="text-[11px] h-10 bg-card rounded-xl" />
                  ))}
                  <Button variant="ghost" size="sm" className="w-full border-2 border-dashed h-9 text-[9px] font-black uppercase" onClick={() => {
                    const newB = [...exp.bullets, ""];
                    onChange({...data, experiences: data.experiences.map(ex => ex.id === exp.id ? {...ex, bullets: newB} : ex)});
                  }}><Plus className="w-3.5 h-3.5 mr-2" /> Add Bullet</Button>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full h-14 gap-3 border-dashed border-2 font-black uppercase text-[10px] rounded-2xl" onClick={() => addArrayItem('experiences', { id: Math.random().toString(), company: "", role: "", duration: "", bullets: [""] })}><Plus className="w-5 h-5" /> Add Professional Entry</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
