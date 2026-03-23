'use server';
/**
 * @fileOverview A Genkit flow for generating personalized professional cover letters.
 *
 * - generateCoverLetter - A function that crafts a tailored cover letter based on resume and JD.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoverLetterInputSchema = z.object({
  resumeData: z.any().describe('The current structured resume data'),
  jobDescription: z.string().describe('The target job description text'),
});
export type CoverLetterInput = z.infer<typeof CoverLetterInputSchema>;

const CoverLetterOutputSchema = z.object({
  letter: z.string().describe('The professionally written 150-250 word cover letter.'),
});
export type CoverLetterOutput = z.infer<typeof CoverLetterOutputSchema>;

export async function generateCoverLetter(input: CoverLetterInput): Promise<CoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: CoverLetterInputSchema},
  output: {schema: CoverLetterOutputSchema},
  prompt: `You are a professional cover letter writer. 

Your task is to write a high-impact, personalized cover letter that connects the user's resume achievements with the specific requirements of the job description.

Job Description:
"""
{{{jobDescription}}}
"""

Resume Data:
"""
{{json resumeData}}
"""

RULES:
1. LENGTH: Strictly 150–250 words.
2. TONE: Professional, engaging, and enthusiastic.
3. STRUCTURE: 
   - Professional header placeholders.
   - Introduction stating the role.
   - 1-2 powerful body paragraphs highlighting relevant experience from the resume.
   - Strong closing call to action.
4. CONTENT: Focus on HOW the user solves the problems mentioned in the JD.

Return only the final cover letter text in the JSON output.`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: CoverLetterInputSchema,
    outputSchema: CoverLetterOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
