'use server';
/**
 * @fileOverview A Genkit flow for matching a resume against a specific job description.
 *
 * - matchJob - A function that compares a resume with a JD and suggests optimizations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizedSectionsSchema = z.object({
  summary: z.string().describe('An optimized professional summary for this JD'),
  experiences: z.array(z.object({
    id: z.string(),
    improvedBullets: z.array(z.string()).describe('Tailored bullet points for this specific role'),
  })),
});

const JobMatchOutputSchema = z.object({
  score: z.number().describe('Compatibility score out of 100'),
  missingKeywords: z.array(z.string()).describe('Keywords found in JD but missing in resume'),
  weakAreas: z.array(z.string()).describe('Specific parts of the resume that do not align with the JD'),
  suggestions: z.array(z.string()).describe('Actionable steps to increase the match score'),
  optimizedSections: OptimizedSectionsSchema,
});

export type JobMatchOutput = z.infer<typeof JobMatchOutputSchema>;

const JobMatchInputSchema = z.object({
  resumeData: z.any().describe('The current structured resume data'),
  jobDescription: z.string().describe('The target job description text'),
});

export type JobMatchInput = z.infer<typeof JobMatchInputSchema>;

export async function matchJob(input: JobMatchInput): Promise<JobMatchOutput> {
  return jobMatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobMatchPrompt',
  input: {schema: JobMatchInputSchema},
  output: {schema: JobMatchOutputSchema},
  prompt: `You are an ATS (Applicant Tracking System) optimization expert. 

Your task is to modify the provided resume to better match the job description.

Tasks:
- Add relevant keywords from the Job Description into the resume
- Improve all bullet points with strong action verbs and measurable results
- Align professional experience with the job role, seniority, and domain requirements

Job Description:
"""
{{{jobDescription}}}
"""

Resume Data:
"""
{{json resumeData}}
"""

INSTRUCTIONS:
1. SCORE: Calculate a match score (0-100) based on skills, experience overlap, and keyword density.
2. MISSING KEYWORDS: Identify critical keywords/tools from the JD not found in the resume.
3. WEAK AREAS: Identify where the resume lacks alignment with the JD's requirements.
4. OPTIMIZED VERSION: Provide a professionally rewritten summary and experience bullets that are TIGHTLY ALIGNED with the JD while maintaining factual integrity.

Return the result in the specified JSON format.`,
});

const jobMatchFlow = ai.defineFlow(
  {
    name: 'jobMatchFlow',
    inputSchema: JobMatchInputSchema,
    outputSchema: JobMatchOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
