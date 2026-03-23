
'use server';
/**
 * @fileOverview A Genkit flow for generating an Executive Professional Summary.
 *
 * - generateProfileSummary - A function that generates a professional profile summary from scratch.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfileSummaryInputSchema = z.object({
  experienceText: z.string().describe('The user\'s work history and role descriptions.'),
  skills: z.array(z.string()).describe('The user\'s core competencies.'),
  role: z.string().describe('The target professional role.'),
});
export type GenerateProfileSummaryInput = z.infer<typeof GenerateProfileSummaryInputSchema>;

const GenerateProfileSummaryOutputSchema = z.object({
  summary: z.string().describe('The professionally written 3-4 line ATS-friendly summary.'),
});
export type GenerateProfileSummaryOutput = z.infer<typeof GenerateProfileSummaryOutputSchema>;

export async function generateProfileSummary(input: GenerateProfileSummaryInput): Promise<GenerateProfileSummaryOutput> {
  return generateProfileSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProfileSummaryPrompt',
  input: {schema: GenerateProfileSummaryInputSchema},
  output: {schema: GenerateProfileSummaryOutputSchema},
  prompt: `You are an expert resume writer and ATS specialist. 

Based on the user's experience and skills, generate a professional, high-impact profile summary for a resume targeting the role of: {{{role}}}

Experience Context:
"""{{{experienceText}}}"""

Key Skills:
{{#each skills}}- {{{this}}}
{{/each}}

RULES:
1. Length: Exactly 3–4 lines.
2. Tone: Professional, confident, and achievement-oriented.
3. Content: Start with professional identity. Include years of experience (if provided) and top 2 unique value propositions.
4. ATS: Use high-value industry keywords relevant to the role.`,
});

const generateProfileSummaryFlow = ai.defineFlow(
  {
    name: 'generateProfileSummaryFlow',
    inputSchema: GenerateProfileSummaryInputSchema,
    outputSchema: GenerateProfileSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
