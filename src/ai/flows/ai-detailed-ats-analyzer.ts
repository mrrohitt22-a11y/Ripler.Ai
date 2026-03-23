'use server';
/**
 * @fileOverview A Genkit flow for a comprehensive AI ATS Analysis and Professional Advisor.
 *
 * - analyzeAts - A function that performs a deep dive into resume quality and advisor suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetailedAtsAnalysisOutputSchema = z.object({
  score: z.number().describe('The overall ATS score out of 100'),
  missingKeywords: z.array(z.string()).describe('Keywords that should be present for the target role'),
  weakBulletPoints: z.array(z.string()).describe('Bullet points that lack impact or metrics'),
  formattingIssues: z.array(z.string()).describe('Issues with layout or formatting'),
  suggestions: z.array(z.string()).describe('Exactly 5-8 short, one-line actionable professional suggestions'),
});
export type DetailedAtsAnalysisOutput = z.infer<typeof DetailedAtsAnalysisOutputSchema>;

const DetailedAtsAnalysisInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the resume'),
  role: z.string().describe('The target job role'),
});
export type DetailedAtsAnalysisInput = z.infer<typeof DetailedAtsAnalysisInputSchema>;

export async function analyzeAts(input: DetailedAtsAnalysisInput): Promise<DetailedAtsAnalysisOutput> {
  return detailedAtsAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detailedAtsAnalysisPrompt',
  input: {schema: DetailedAtsAnalysisInputSchema},
  output: {schema: DetailedAtsAnalysisOutputSchema},
  prompt: `You are an expert resume improvement advisor and ATS (Applicant Tracking System) specialist.

Analyze the following resume for the target role: {{{role}}}.

Scoring Criteria:
- Keywords relevance (30%)
- Content quality (25%)
- Formatting (15%)
- Impact/action words (15%)
- Length and clarity (15%)

ADVISOR TASKS:
1. FOCUS AREAS: Use of numbers/metrics, powerful action verbs, content clarity, overall length, and identification of missing sections.
2. SUGGESTIONS: Provide exactly 5–8 short, actionable suggestions.
3. STYLE: Each suggestion MUST be strictly 1 line and highly professional.

Resume Content:
"""
{{{resumeText}}}
"""

Strictly evaluate the content. If bullet points lack metrics (%, $, #), flag them. If industry keywords for {{{role}}} are missing, list them.
Return a structured JSON analysis including the score and the advisor's top 5-8 one-line recommendations.`,
});

const detailedAtsAnalysisFlow = ai.defineFlow(
  {
    name: 'detailedAtsAnalysisFlow',
    inputSchema: DetailedAtsAnalysisInputSchema,
    outputSchema: DetailedAtsAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
