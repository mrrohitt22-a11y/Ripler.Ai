'use server';
/**
 * @fileOverview A Genkit flow for generating LinkedIn-optimized profiles.
 *
 * - generateLinkedInProfile - A function that crafts a headline and summary for LinkedIn.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LinkedInInputSchema = z.object({
  resumeData: z.any().describe('The current structured resume data'),
});
export type LinkedInInput = z.infer<typeof LinkedInInputSchema>;

const LinkedInOutputSchema = z.object({
  headline: z.string().describe('A short, keyword-rich, attention-grabbing LinkedIn headline.'),
  summary: z.string().describe('A professional and impactful 3–5 line LinkedIn summary.'),
});
export type LinkedInOutput = z.infer<typeof LinkedInOutputSchema>;

export async function generateLinkedInProfile(input: LinkedInInput): Promise<LinkedInOutput> {
  return linkedinExpertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'linkedinExpertPrompt',
  input: {schema: LinkedInInputSchema},
  output: {schema: LinkedInOutputSchema},
  prompt: `You are a LinkedIn profile expert and personal branding specialist.

Based on the provided resume data, create a powerful LinkedIn headline and summary.

Resume Data:
"""
{{json resumeData}}
"""

INSTRUCTIONS:
1. HEADLINE: 
   - Must be short and attention-grabbing.
   - Must be keyword-rich for the user's target industry.
   - Use professional separators like "|" or "•".
2. SUMMARY:
   - Must be strictly 3–5 lines.
   - Must be professional, impactful, and written in the first person.
   - Focus on the "Unique Value Proposition" and key achievements.

Return the result in the specified JSON format.`,
});

const linkedinExpertFlow = ai.defineFlow(
  {
    name: 'linkedinExpertFlow',
    inputSchema: LinkedInInputSchema,
    outputSchema: LinkedInOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
