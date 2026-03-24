"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ResumeForm } from '@/components/resume/ResumeForm';
import { AtsScore } from '@/components/resume/AtsScore';
import { ResumeData, INITIAL_DATA } from '@/lib/resume-store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Printer, Download, Monitor, Phone, Edit3, Eye, LogIn, LogOut, Cloud, Loader2, Sparkles, User, Settings, CreditCard, Undo2, Redo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [previewScale, setPreviewScale] = useState(0.8);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Unified Undo/Redo State
  const [historyState, setHistoryState] = useState({
    list: [INITIAL_DATA],
    index: 0
  });
  const isHistoryAction = useRef(false);
  
  // Dialog States
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const auth = useAuth();
  const { user } = useUser();
  const db = useFirestore();

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyState.index > 0) {
      isHistoryAction.current = true;
      const prevIndex = historyState.index - 1;
      const prevData = historyState.list[prevIndex];
      
      setHistoryState(prev => ({ ...prev, index: prevIndex }));
      setData(prevData);
      toast({ title: "Undo Applied", description: "Reverted to previous state." });
    }
  }, [historyState, toast]);

  const handleRedo = useCallback(() => {
    if (historyState.index < historyState.list.length - 1) {
      isHistoryAction.current = true;
      const nextIndex = historyState.index + 1;
      const nextData = historyState.list[nextIndex];
      
      setHistoryState(prev => ({ ...prev, index: nextIndex }));
      setData(nextData);
      toast({ title: "Redo Applied", description: "Restored subsequent state." });
    }
  }, [historyState, toast]);

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // History Capture Effect
  useEffect(() => {
    if (!mounted) return;
    
    if (isHistoryAction.current) {
      isHistoryAction.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setHistoryState(prev => {
        const currentInHistory = prev.list[prev.index];
        // Compare data to prevent redundant snapshots
        if (JSON.stringify(data) === JSON.stringify(currentInHistory)) return prev;
        
        const newList = prev.list.slice(0, prev.index + 1);
        newList.push(JSON.parse(JSON.stringify(data)));
        
        // Limit history to 50 snapshots
        if (newList.length > 50) newList.shift();
        
        return {
          list: newList,
          index: newList.length - 1
        };
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, mounted]);

  // Load user data from Firestore on login
  useEffect(() => {
    async function loadUserData() {
      if (user && db && mounted) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const cloudData = userDoc.data() as ResumeData;
            const mergedData = {
              ...data,
              ...cloudData,
              name: cloudData.name || user.displayName || data.name,
              email: cloudData.email || user.email || data.email,
              photoUrl: cloudData.photoUrl || user.photoURL || ""
            };
            setData(mergedData);
            setHistoryState({ list: [mergedData], index: 0 });
          } else {
            const newData = {
              ...INITIAL_DATA,
              name: user.displayName || INITIAL_DATA.name,
              email: user.email || INITIAL_DATA.email,
              photoUrl: user.photoURL || ""
            };
            setData(newData);
            setDocumentNonBlocking(userDocRef, newData, { merge: true });
          }
        } catch (error) {
          console.error("Ripler: Error loading user data:", error);
        }
      }
    }
    loadUserData();
  }, [user, db, mounted]);

  // Auto-save to Firestore with debounce
  useEffect(() => {
    if (user && db && mounted && JSON.stringify(data) !== JSON.stringify(INITIAL_DATA)) {
      const userDocRef = doc(db, 'users', user.uid);
      setIsSaving(true);
      const timer = setTimeout(() => {
        updateDocumentNonBlocking(userDocRef, { ...data });
        setTimeout(() => setIsSaving(false), 800);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [data, user, db, mounted]);

  useEffect(() => {
    if (isMobile) setPreviewScale(0.42);
    else setPreviewScale(0.8);
  }, [isMobile]);

  const handleLogin = async () => {
    if (!auth) {
      toast({ variant: "destructive", title: "Authentication Unavailable", description: "The auth service is initializing." });
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Welcome to Ripler", description: "Your professional profile is synced." });
    } catch (error: any) {
      console.error("Ripler Auth Error:", error);
      toast({ variant: "destructive", title: "Login Failed", description: error.message || "Please check your internet connection and try again." });
    }
  };

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
      setData(INITIAL_DATA);
      setHistoryState({ list: [INITIAL_DATA], index: 0 });
      toast({ title: "Signed Out", description: "Session cleared." });
    }
  };

  const handleDownload = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('resume-pdf-target');
      if (!element) return;
      toast({ title: "Preparing Export", description: "Optimizing layout..." });
      const opt = {
        margin: 0,
        filename: `Ripler_${data.name.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
      toast({ title: "Export Successful" });
    } catch (error) {
      toast({ variant: "destructive", title: "Export Error" });
    }
  };

  const handlePrint = () => window.print();

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col no-print relative overflow-hidden selection:bg-primary/30">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <header className="h-16 border-b bg-card/80 backdrop-blur-2xl flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm no-print">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex flex-col group">
            <h1 className="font-headline font-bold text-foregroundxl leading-none text-foreground tracking-tighter group-hover:text-primary transition-colors">
              Ripler
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              {isSaving ? (
                <div className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-primary font-bold">
                  <Loader2 className="w-2 h-2 animate-spin" /> Saving...
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-muted-foreground font-medium opacity-60">
                  <Cloud className="w-2 h-2" /> {user ? "Cloud Active" : "Local Draft"}
                </div>
              )}
            </div>
          </Link>

          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-md hover:bg-card hover:shadow-sm disabled:opacity-30" 
              onClick={handleUndo} 
              disabled={historyState.index <= 0}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-md hover:bg-card hover:shadow-sm disabled:opacity-30" 
              onClick={handleRedo} 
              disabled={historyState.index >= historyState.list.length - 1}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isMobile && (
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 font-black text-[9px] uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 mr-2" /> Upgrade
              </Button>
            </Link>
          )}
          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 border-2 border-primary/20 shadow-sm hover:scale-105 transition-all">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback className="bg-primary text-white text-[10px] font-bold">
                      {user.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 shadow-2xl border-border bg-white/95 backdrop-blur-xl" align="end">
                <DropdownMenuLabel className="font-headline text-lg px-3 pt-3">My Account</DropdownMenuLabel>
                <div className="px-3 pb-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="mx-1" />
                <DropdownMenuItem onClick={() => setProfileOpen(true)} className="rounded-xl py-3 cursor-pointer hover:bg-primary/5">
                  <User className="mr-3 h-4 w-4 text-primary" />
                  <span className="font-bold text-[10px] uppercase tracking-wider">Professional Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="rounded-xl py-3 cursor-pointer hover:bg-primary/5">
                  <Settings className="mr-3 h-4 w-4 text-primary" />
                  <span className="font-bold text-[10px] uppercase tracking-wider">Account Settings</span>
                </DropdownMenuItem>
                <Link href="/pricing">
                  <DropdownMenuItem className="rounded-xl py-3 cursor-pointer hover:bg-primary/5">
                    <CreditCard className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-bold text-[10px] uppercase tracking-wider">Subscription</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="mx-1" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-3 cursor-pointer text-destructive hover:bg-destructive/5">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-bold text-[10px] uppercase tracking-wider">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={handleLogin} className="gap-2 bg-foreground text-background shadow-lg h-9 px-5 rounded-full hover:scale-105 transition-all">
              <LogIn className="w-4 h-4" /> <span className="font-bold text-xs">Sign In</span>
            </Button>
          )}

          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button size="sm" onClick={handleDownload} className="px-6 bg-primary hover:bg-accent text-white shadow-lg font-black uppercase tracking-widest text-[10px] h-9 rounded-full transition-all">
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </header>

      {/* DIALOGS */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">
          <div className="bg-primary/5 p-8 border-b">
            <DialogTitle className="font-headline text-foregroundxl text-primary flex items-center gap-3">
              <User className="w-6 h-6" /> Professional Profile
            </DialogTitle>
            <DialogDescription className="text-xs">Update your global identity.</DialogDescription>
          </div>
          <div className="p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest opacity-50">Full Name</Label>
                <Input value={data.name} onChange={(e) => setData(p => ({...p, name: e.target.value}))} className="h-11 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest opacity-50">Current Role</Label>
                <Input value={data.role} onChange={(e) => setData(p => ({...p, role: e.target.value}))} className="h-11 rounded-xl font-bold" />
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 pt-0">
            <Button onClick={() => setProfileOpen(false)} className="w-full bg-primary h-12 rounded-xl font-black uppercase tracking-widest text-[11px]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">
          <div className="bg-foreground/5 p-8 border-b">
            <DialogTitle className="font-headline text-foregroundxl text-foreground flex items-center gap-3">
              <Settings className="w-6 h-6" /> Account Settings
            </DialogTitle>
          </div>
          <div className="p-8">
            <div className="p-5 bg-muted/30 rounded-2xl border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Plan Status</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[8px] uppercase">Ripler Free</Badge>
              </div>
              <p className="text-xs font-bold leading-relaxed">Upgrade for AI audits.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="flex-1 h-[calc(100vh-64px)] overflow-hidden z-10 no-print">
        {isMobile ? (
          <Tabs defaultValue="edit" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-card border-b h-14 z-20">
              <TabsTrigger value="edit" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest data-[state=active]:text-primary"><Edit3 className="w-4 h-4" /> Build</TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest data-[state=active]:text-primary"><Eye className="w-4 h-4" /> Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="flex-1 overflow-hidden m-0 p-4 bg-card/50 backdrop-blur-sm">
              <ResumeForm data={data} onChange={setData} />
            </TabsContent>
            <TabsContent value="preview" className="flex-1 overflow-hidden m-0 relative flex flex-col items-center">
              <div className="flex-1 w-full overflow-auto p-4 flex flex-col items-center scrollbar-hide">
                <div className="w-full max-w-[794px] mb-4"><AtsScore data={data} onUpdateData={setData} /></div>
                <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center' }} className="gpu-render shadow-2xl"><ResumePreview data={data} id="resume-content-mobile" /></div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-[460px_1fr] h-full">
            <aside className="border-r bg-card/60 backdrop-blur-md p-6 overflow-hidden z-10">
              <ResumeForm data={data} onChange={setData} />
            </aside>

            <div className="bg-primary/5 overflow-hidden relative flex flex-col items-center">
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-card/90 backdrop-blur-2xl p-2.5 rounded-full shadow-2xl border border-border no-print">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setPreviewScale(Math.max(0.4, previewScale - 0.1))}><Phone className="w-4 h-4" /></Button>
                <div className="text-[10px] font-black w-14 text-center text-primary">{Math.round(previewScale * 100)}%</div>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setPreviewScale(Math.min(1.2, previewScale + 0.1))}><Monitor className="w-4 h-4" /></Button>
                <Separator orientation="vertical" className="h-5" />
                <Button variant="ghost" size="icon" className="rounded-full" onClick={handlePrint}><Printer className="w-4 h-4" /></Button>
              </motion.div>

              <div className="flex-1 w-full overflow-auto p-12 flex flex-col items-center scrollbar-hide perspective-[1200px]">
                <div className="w-full max-w-[794px] mb-8 no-print animate-in fade-in slide-in-from-top-4 duration-700">
                  <AtsScore data={data} onUpdateData={setData} />
                </div>
                
                <motion.div 
                  onMouseMove={handleMouseMove} 
                  onMouseLeave={handleMouseLeave} 
                  style={{ rotateX, rotateY, transformStyle: "preserve-3d", scale: previewScale, transformOrigin: 'top center' }} 
                  className="gpu-render drop-shadow-2xl relative group"
                >
                  <div className="absolute inset-0 bg-black/5 blur-3xl rounded-2xl transform translate-z-[-1px] group-hover:scale-105 transition-transform no-print" />
                  <ResumePreview data={data} id="resume-content" />
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none" style={{ width: '794px' }}>
        <ResumePreview data={data} id="resume-pdf-target" className="shadow-none rounded-none" />
      </div>
    </div>
  );
}
