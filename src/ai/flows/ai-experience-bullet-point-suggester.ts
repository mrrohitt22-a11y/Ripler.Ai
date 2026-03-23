'use server';
/**
 * @fileOverview A Genkit flow for suggesting impactful bullet points for work experience.
 *
 * - suggestExperienceBulletPoints - A function that handles the bullet point suggestion process.
 * - AiExperienceBulletPointSuggesterInput - The input type for the suggestExperienceBulletPoints function.
 * - AiExperienceBulletPointSuggesterOutput - The return type for the suggestExperienceBulletPoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiExperienceBulletPointSuggesterInputSchema = z.object({
  jobRole: z.string().describe('The job role for which to suggest bullet points.'),
  industry: z.string().describe('The industry the job role belongs to.'),
  currentDescription: z
    .string()
    .optional()
    .describe('An optional existing description or bullet points to enhance.'),
});
export type AiExperienceBulletPointSuggesterInput = z.infer<
  typeof AiExperienceBulletPointSuggesterInputSchema
>;

const AiExperienceBulletPointSuggesterOutputSchema = z.object({
  suggestedBulletPoints: z
    .array(z.string())
    .describe('A list of suggested impactful bullet points.'),
});
export type AiExperienceBulletPointSuggesterOutput = z.infer<
  typeof AiExperienceBulletPointSuggesterOutputSchema
>;

export async function suggestExperienceBulletPoints(
  input: AiExperienceBulletPointSuggesterInput
): Promise<AiExperienceBulletPointSuggesterOutput> {
  return aiExperienceBulletPointSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiExperienceBulletPointSuggesterPrompt',
  input: {schema: AiExperienceBulletPointSuggesterInputSchema},
  output: {schema: AiExperienceBulletPointSuggesterOutputSchema},
  prompt: `You are an expert career coach. Your task is to convert a simple job description into 3-5 strong, achievement-oriented, and quantified resume bullet points.

Job Role: {{{jobRole}}}
Industry: {{{industry}}}

{{#if currentDescription}}
Description to enhance:
"""{{{currentDescription}}}"""
{{/if}}

Rules:
1. Start each bullet point with a strong action verb.
2. Include at least one quantifiable metric (percentage, currency, or numerical volume) in every bullet point.
3. Focus on impact and results rather than just duties.
4. Keep each bullet point concise (one line).

Example Input: "worked at medical shop"
Example Output:
- Managed inventory of 500+ pharmaceutical products, reducing stockouts by 30% through improved tracking.
- Optimized order processing speed by 25% by implementing a new digital record-keeping system.
- Achieved a 98% accuracy rate in prescription fulfillment for a high-volume retail environment.

Provide the suggestions in a JSON array format.`,
});

const aiExperienceBulletPointSuggesterFlow = ai.defineFlow(
  {
    name: 'aiExperienceBulletPointSuggesterFlow',
    inputSchema: AiExperienceBulletPointSuggesterInputSchema,
    outputSchema: AiExperienceBulletPointSuggesterOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
