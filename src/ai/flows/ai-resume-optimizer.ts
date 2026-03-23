
'use server';
/**
 * @fileOverview A Genkit flow for holistically improving an entire resume with Tone and Version selection.
 *
 * - optimizeResume - A function that refines the entire resume for ATS and high-impact readability based on tone and version.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeDataSchema = z.object({
  name: z.string(),
  role: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  profileSummary: z.string(),
  experiences: z.array(z.object({
    id: z.string(),
    company: z.string(),
    role: z.string(),
    duration: z.string(),
    bullets: z.array(z.string()),
  })),
  education: z.array(z.object({
    id: z.string(),
    degree: z.string(),
    institution: z.string(),
  })),
  projects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
  })),
  skills: z.array(z.object({
    id: z.string(),
    name: z.string(),
    level: z.number(),
    category: z.string().optional(),
  })),
  tone: z.enum(['Fresher', 'Corporate', 'Creative', 'Startup']).optional(),
  version: z.enum(['ats', 'designer']).optional(),
});

export async function optimizeResume(input: any) {
  return optimizeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeResumePrompt',
  input: {schema: ResumeDataSchema},
  output: {schema: ResumeDataSchema},
  prompt: `You are a professional resume optimizer and formatting expert. 
Your task is to improve the following resume based on the selected TONE and VERSION strategy.

VERSION STRATEGY: {{{version}}}
{{#if (eq version 'ats')}}
- FOCUS: Pure readability for machines. 
- FORMAT: Simple structure, standard section headers, keyword-rich but concise.
- TONE: Professional and factual. Avoid narrative fluff.
{{/if}}

{{#if (eq version 'designer')}}
- FOCUS: Modern appeal for human recruiters.
- FORMAT: Impact-driven storytelling, slightly enhanced wording, more engaging tone.
- TONE: Bold and confident. Highlight "Unique Value Proposition" more strongly.
{{/if}}

TONE SELECTION: {{{tone}}}
{{#if (eq tone 'Fresher')}}
- FOCUS: Potential, academic projects, skills, and fast learning. 
{{/if}}
{{#if (eq tone 'Corporate')}}
- FOCUS: Formal structure, seniority, and leadership.
{{/if}}
{{#if (eq tone 'Creative')}}
- FOCUS: Storytelling, unique projects, and vision.
{{/if}}
{{#if (eq tone 'Startup')}}
- FOCUS: Impact, speed, and cross-functional results.
{{/if}}

STRICT TASKS:
1. PERSONA: Act as a senior executive career coach and ATS optimization specialist.
2. GRAMMAR & CLARITY: Fix all grammatical errors and improve sentence structure.
3. PROFESSIONAL SUMMARY: Rewrite to be a high-impact "Executive Overview" (3–4 lines max). 
4. WORK EXPERIENCE: 
   - Rewrite every single bullet point using strong action verbs (e.g., "Spearheaded", "Engineered").
   - MANDATORY: Add measurable results (%, $, #) to every possible bullet point.
5. SKILLS: Inject industry-relevant keywords for ATS compatibility.
6. FORMAT: You MUST return the exact same JSON structure.

Current Resume Data:
"""
{{json this}}
"""`,
});

const optimizeResumeFlow = ai.defineFlow(
  {
    name: 'optimizeResumeFlow',
    inputSchema: ResumeDataSchema,
    outputSchema: ResumeDataSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
