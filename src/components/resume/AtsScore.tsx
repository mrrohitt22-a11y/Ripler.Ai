"use client";

import React, { useState, useEffect } from 'react';
import { ResumeData } from '@/lib/resume-store';
import { Progress } from '@/components/ui/progress';
import { Zap, CheckCircle2, AlertCircle, TrendingUp, Search, ListFilter, LayoutPanelLeft, Sparkles, Loader2, ChevronDown, ChevronUp, Briefcase, Target, ShieldCheck, Lightbulb, FileText, Copy, Linkedin, Mic2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { analyzeAts, DetailedAtsAnalysisOutput } from '@/ai/flows/ai-detailed-ats-analyzer';
import { matchJob, JobMatchOutput } from '@/ai/flows/ai-job-matcher';
import { generateCoverLetter } from '@/ai/flows/ai-cover-letter-generator';
import { generateLinkedInProfile, LinkedInOutput } from '@/ai/flows/ai-linkedin-expert';
import { prepareInterview, InterviewPrepOutput } from '@/ai/flows/ai-interview-prep';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AtsScoreProps {
  data: ResumeData;
  onUpdateData?: (newData: ResumeData) => void;
}

export const AtsScore: React.FC<AtsScoreProps> = ({ data, onUpdateData }) => {
  const [basicScore, setBasicScore] = useState(0);
  const [basicSuggestions, setBasicSuggestions] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [detailedAnalysis, setDetailedAnalysis] = useState<DetailedAtsAnalysisOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);
  
  const [jdText, setJdText] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchOutput | null>(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);

  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  const [linkedinResult, setLinkedinResult] = useState<LinkedInOutput | null>(null);
  const [isGeneratingLinkedin, setIsGeneratingLinkedin] = useState(false);
  const [linkedinDialogOpen, setLinkedinDialogOpen] = useState(false);

  const [interviewResult, setInterviewResult] = useState<InterviewPrepOutput | null>(null);
  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => {
      calculateHeuristicScore();
      setIsUpdating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [data]);

  const calculateHeuristicScore = () => {
    let currentScore = 0;
    const newSuggestions: string[] = [];

    if (data.profileSummary && data.profileSummary.trim().length > 50) currentScore += 15;
    else newSuggestions.push("Expand your professional summary.");

    if (data.skills && data.skills.length >= 3) currentScore += 20;
    else newSuggestions.push("Add more core skills.");

    const hasMetrics = data.experiences?.some(exp => 
      exp.bullets.some(bullet => /\d+/.test(bullet))
    );
    if (hasMetrics) currentScore += 25;
    else newSuggestions.push("Add numbers/metrics to experience.");

    const sectionsComplete = (data.experiences?.length > 0) && (data.education?.length > 0) && (data.skills?.length > 0);
    if (sectionsComplete) currentScore += 20;
    else newSuggestions.push("Fill all essential sections.");

    const hasTextQuality = data.name.length > 2 && data.profileSummary.length > 100;
    if (hasTextQuality) currentScore += 20;
    else newSuggestions.push("Refine formatting and text length.");

    setBasicScore(currentScore);
    setBasicSuggestions(newSuggestions.slice(0, 3));
  };

  const handleDeepAudit = async () => {
    setIsAnalyzing(true);
    try {
      const resumeText = `
        Name: ${data.name}
        Role: ${data.role}
        Summary: ${data.profileSummary}
        Experience: ${data.experiences.map(e => `${e.role} at ${e.company}: ${e.bullets.join(' ')}`).join('\n')}
        Skills: ${data.skills.map(s => s.name).join(', ')}
        Education: ${data.education.map(e => `${e.degree} from ${e.institution}`).join(', ')}
      `;

      const result = await analyzeAts({
        resumeText,
        role: data.role || "Professional"
      });

      setDetailedAnalysis(result);
      setShowDetailed(true);
      toast({ title: "Deep Audit Complete", description: `AI Score: ${result.score}/100. Check the advisor's report below.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Audit failed", description: "Could not perform detailed analysis." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleJobMatch = async () => {
    if (!jdText.trim()) {
      toast({ variant: "destructive", title: "Missing JD", description: "Please paste a job description first." });
      return;
    }
    setIsMatching(true);
    try {
      const result = await matchJob({
        resumeData: data,
        jobDescription: jdText
      });
      setMatchResult(result);
      toast({ title: "Comparison Complete", description: `Match Score: ${result.score}/100` });
    } catch (err) {
      toast({ variant: "destructive", title: "Match failed" });
    } finally {
      setIsMatching(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jdText.trim()) return;
    setIsGeneratingLetter(true);
    try {
      const result = await generateCoverLetter({
        resumeData: data,
        jobDescription: jdText
      });
      setCoverLetter(result.letter);
      toast({ title: "Cover Letter Ready", description: "Personalized letter generated for this role." });
    } catch (err) {
      toast({ variant: "destructive", title: "Generation failed" });
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleGenerateLinkedin = async () => {
    setIsGeneratingLinkedin(true);
    try {
      const result = await generateLinkedInProfile({
        resumeData: data
      });
      setLinkedinResult(result);
      setLinkedinDialogOpen(true);
      toast({ title: "LinkedIn Profile Ready", description: "Headline and summary have been generated." });
    } catch (err) {
      toast({ variant: "destructive", title: "Generation failed", description: "Could not generate LinkedIn content." });
    } finally {
      setIsGeneratingLinkedin(false);
    }
  };

  const handleGenerateInterviewPrep = async () => {
    setIsGeneratingInterview(true);
    try {
      const result = await prepareInterview({
        resumeData: data
      });
      setInterviewResult(result);
      setInterviewDialogOpen(true);
      toast({ title: "Interview Prep Ready", description: "Your customized interview guide has been generated." });
    } catch (err) {
      toast({ variant: "destructive", title: "Preparation failed", description: "Could not generate interview questions." });
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to Clipboard" });
  };

  const applyMatchImprovements = () => {
    if (matchResult && onUpdateData) {
      const updatedExperiences = data.experiences.map(exp => {
        const optimized = matchResult.optimizedSections.experiences.find(oe => oe.id === exp.id);
        return optimized ? { ...exp, bullets: optimized.improvedBullets } : exp;
      });

      onUpdateData({
        ...data,
        profileSummary: matchResult.optimizedSections.summary,
        experiences: updatedExperiences
      });

      setMatchResult(null);
      setMatchDialogOpen(false);
      toast({ title: "Tailored Content Applied", description: "Your resume is now optimized for this specific role." });
    }
  };

  const currentScore = detailedAnalysis ? detailedAnalysis.score : basicScore;

  const getScoreColor = (s: number) => {
    if (s > 75) return "text-emerald-500";
    if (s >= 50) return "text-amber-500";
    return "text-destructive";
  };

  return (
    <div className="w-full max-w-[794px] mb-6 animate-fadeUp no-print">
      <div className="p-5 bg-white rounded-xl border border-[#C9864A]/20 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Score Display */}
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/10" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * currentScore) / 100}
                  strokeLinecap="round"
                  className={cn("transition-all duration-1000 ease-out", getScoreColor(currentScore))}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={cn("text-xl font-black leading-none", getScoreColor(currentScore))}>{currentScore}</span>
                <span className="text-[8px] font-bold uppercase opacity-50">Score</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1A1208] flex items-center gap-2">
                ATS Readiness
                {isUpdating && <Zap className="w-3 h-3 text-[#C9864A] animate-pulse" />}
                {detailedAnalysis && <Badge variant="outline" className="text-[9px] h-4 bg-emerald-50 text-emerald-700 border-emerald-200">AI Advisor Active</Badge>}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-tight max-w-[240px]">
                {currentScore > 75 
                  ? "Highly optimized for modern recruiter algorithms." 
                  : "Requires strategic improvements to bypass ATS filters."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-[10px] font-bold uppercase tracking-wider h-9 border-orange-100 text-orange-600 hover:bg-orange-50"
              onClick={handleGenerateInterviewPrep}
              disabled={isGeneratingInterview}
            >
              {isGeneratingInterview ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Mic2 className="w-3.5 h-3.5 mr-2" />}
              Prep Interview
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="text-[10px] font-bold uppercase tracking-wider h-9 border-blue-100 text-blue-600 hover:bg-blue-50"
              onClick={handleGenerateLinkedin}
              disabled={isGeneratingLinkedin}
            >
              {isGeneratingLinkedin ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Linkedin className="w-3.5 h-3.5 mr-2" />}
              LinkedIn Expert
            </Button>

            <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-wider h-9 border-[#C9864A]/20 text-[#C9864A] hover:bg-[#C9864A]/5">
                  <Target className="w-3.5 h-3.5 mr-2" />
                  Match JD
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Compare with Job Description</DialogTitle>
                  <DialogDescription>Paste the job posting below. AI will score your fit, suggest improvements, and write your cover letter.</DialogDescription>
                </DialogHeader>
                {!matchResult ? (
                  <div className="space-y-4 py-4">
                    <Textarea 
                      placeholder="Paste job description here..." 
                      className="min-h-[200px] text-xs"
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                    />
                    <Button 
                      className="w-full bg-[#C9864A] hover:bg-[#B74610] text-white" 
                      onClick={handleJobMatch}
                      disabled={isMatching}
                    >
                      {isMatching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                      Analyze Match Compatibility
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6 py-4">
                      <div className="flex items-center justify-between p-4 bg-[#C9864A]/5 rounded-lg border border-[#C9864A]/10">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-[#C9864A]">Job Match Score</div>
                          <div className="text-3xl font-black text-[#1A1208]">{matchResult.score}/100</div>
                        </div>
                        <Target className="w-10 h-10 text-[#C9864A] opacity-20" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          variant="outline" 
                          className="h-20 flex-col gap-2 border-dashed border-[#C9864A]/30 hover:bg-[#C9864A]/5"
                          onClick={handleGenerateCoverLetter}
                          disabled={isGeneratingLetter}
                        >
                          {isGeneratingLetter ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5 text-[#C9864A]" />}
                          <span className="text-[10px] font-bold uppercase tracking-wider">AI Cover Letter</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-20 flex-col gap-2 border-dashed border-emerald-200 hover:bg-emerald-50"
                          onClick={applyMatchImprovements}
                        >
                          <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Apply Optimization</span>
                        </Button>
                      </div>

                      {coverLetter && (
                        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 h-8 w-8" 
                            onClick={() => copyToClipboard(coverLetter)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <div className="text-[10px] font-black uppercase tracking-widest text-[#1A1208]/60">Generated Cover Letter</div>
                          <div className="text-[11px] leading-relaxed whitespace-pre-wrap font-body text-[#1A1208]/80">
                            {coverLetter}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-red-600">Missing Keywords</div>
                        <div className="flex flex-wrap gap-1.5">
                          {matchResult.missingKeywords.map((kw, i) => (
                            <Badge key={i} variant="outline" className="text-[9px] bg-red-50/50 border-red-100 text-red-700">{kw}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-amber-600">Weak Areas</div>
                        <ul className="space-y-1.5">
                          {matchResult.weakAreas.map((area, i) => (
                            <li key={i} className="text-[11px] flex gap-2"><AlertCircle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" /> {area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </ScrollArea>
                )}
                <DialogFooter className="border-t pt-4">
                  <Button variant="outline" onClick={() => setMatchResult(null)}>Reset Analysis</Button>
                  <Button variant="ghost" onClick={() => setMatchDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button 
              size="sm" 
              onClick={handleDeepAudit} 
              disabled={isAnalyzing}
              className="bg-[#C9864A] hover:bg-[#B74610] text-white text-[10px] font-bold uppercase tracking-wider h-9"
            >
              {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Sparkles className="w-3.5 h-3.5 mr-2" />}
              AI Advisor Audit
            </Button>
            {detailedAnalysis && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDetailed(!showDetailed)}
                className="h-9"
              >
                {showDetailed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* LinkedIn Dialog */}
        <Dialog open={linkedinDialogOpen} onOpenChange={setLinkedinDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-[#0077b5]" /> LinkedIn Profile Optimization
              </DialogTitle>
              <DialogDescription>AI-generated content to boost your visibility and networking potential.</DialogDescription>
            </DialogHeader>
            {linkedinResult && (
              <div className="space-y-6 py-4">
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8" 
                    onClick={() => copyToClipboard(linkedinResult.headline)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">LinkedIn Headline</div>
                  <div className="text-sm font-bold text-[#1A1208]">
                    {linkedinResult.headline}
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8" 
                    onClick={() => copyToClipboard(linkedinResult.summary)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">LinkedIn About Summary</div>
                  <div className="text-[11px] leading-relaxed whitespace-pre-wrap font-body text-[#1A1208]/80">
                    {linkedinResult.summary}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="ghost" onClick={() => setLinkedinDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Interview Prep Dialog */}
        <Dialog open={interviewDialogOpen} onOpenChange={setInterviewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mic2 className="w-5 h-5 text-orange-600" /> Interview Preparation Coach
              </DialogTitle>
              <DialogDescription>Customized interview questions and sample answers based on your resume data.</DialogDescription>
            </DialogHeader>
            {interviewResult && (
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-8 py-4">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Common Questions
                    </h4>
                    <Accordion type="single" collapsible className="w-full">
                      {interviewResult.commonQuestions.map((q, i) => (
                        <AccordionItem key={`common-${i}`} value={`common-${i}`}>
                          <AccordionTrigger className="text-left text-sm font-bold py-3">
                            {q.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-[11px] leading-relaxed text-[#1A1208]/80 bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                            <div className="font-bold text-orange-800 mb-2 uppercase text-[9px]">Sample Answer:</div>
                            {q.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Role-Specific Questions
                    </h4>
                    <Accordion type="single" collapsible className="w-full">
                      {interviewResult.roleSpecificQuestions.map((q, i) => (
                        <AccordionItem key={`role-${i}`} value={`role-${i}`}>
                          <AccordionTrigger className="text-left text-sm font-bold py-3">
                            {q.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-[11px] leading-relaxed text-[#1A1208]/80 bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                            <div className="font-bold text-orange-800 mb-2 uppercase text-[9px]">Sample Answer:</div>
                            {q.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </ScrollArea>
            )}
            <DialogFooter className="border-t pt-4">
              <Button variant="ghost" onClick={() => setInterviewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detailed AI Report */}
        {detailedAnalysis && showDetailed && (
          <div className="mt-6 pt-6 border-t border-dashed space-y-6 animate-in slide-in-from-top-2 duration-300">
            {/* Main Advisor Section */}
            <div className="bg-[#C9864A]/5 p-4 rounded-xl border border-[#C9864A]/10 space-y-4">
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#B74610]">
                <Lightbulb className="w-4 h-4" /> Advisor's Top Recommendations
              </div>
              <div className="grid grid-cols-1 gap-3">
                {detailedAnalysis.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 text-[11px] leading-relaxed text-[#1A1208] bg-white p-2.5 rounded-lg border border-[#C9864A]/5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#B74610]">
                  <Search className="w-3.5 h-3.5" /> Missing Keywords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {detailedAnalysis.missingKeywords.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-[9px] bg-red-50 text-red-700 border-red-100">{kw}</Badge>
                  ))}
                  {detailedAnalysis.missingKeywords.length === 0 && <span className="text-[10px] opacity-50 italic">None found</span>}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#B74610]">
                  <ListFilter className="w-3.5 h-3.5" /> Content Gaps
                </div>
                <ul className="space-y-1.5">
                  {detailedAnalysis.weakBulletPoints.map((bp, i) => (
                    <li key={i} className="text-[10px] leading-tight text-[#1A1208]/70 flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" /> {bp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#B74610]">
                <LayoutPanelLeft className="w-3.5 h-3.5" /> Formatting & Layout
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {detailedAnalysis.formattingIssues.map((issue, i) => (
                  <li key={i} className="text-[10px] leading-tight text-[#1A1208]/70 flex items-start gap-2 bg-muted/20 p-2 rounded">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9864A] mt-1 shrink-0" /> {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Basic Suggestions (Fallback) */}
        {!detailedAnalysis && basicSuggestions.length > 0 && (
          <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
            {basicSuggestions.map((s, i) => (
              <Badge key={i} variant="outline" className="text-[9px] font-medium border-[#C9864A]/20 text-[#1A1208]/60">
                • {s}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
