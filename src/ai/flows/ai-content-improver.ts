'use server';
/**
 * @fileOverview A Genkit flow for professionally improving resume content.
 *
 * - improveContent - A function that refines text for a professional resume.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveContentInputSchema = z.object({
  content: z.string().describe('The content to be improved.'),
  type: z.enum(['name', 'summary', 'experience']).describe('The context of the content (Name, Summary, or Experience).'),
});
export type ImproveContentInput = z.infer<typeof ImproveContentInputSchema>;

const ImproveContentOutputSchema = z.object({
  improvedContent: z.string().describe('The professionally rewritten version of the input content.'),
});
export type ImproveContentOutput = z.infer<typeof ImproveContentOutputSchema>;

export async function improveContent(input: ImproveContentInput): Promise<ImproveContentOutput> {
  return improveContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveContentPrompt',
  input: {schema: ImproveContentInputSchema},
  output: {schema: ImproveContentOutputSchema},
  prompt: `You are an expert resume writer. Your task is to rewrite the provided content to be professional, impactful, and ATS-friendly.

Context: {{{type}}}
Current Content: """{{{content}}}"""

{{#if (eq type 'name')}}
- Ensure the name is formatted correctly (e.g., proper capitalization).
- Suggest the most formal professional version.
{{/if}}

{{#if (eq type 'summary')}}
- Use strong action verbs.
- Highlight expertise and career value.
- Keep it to a concise 3-4 line paragraph.
- Inject high-value industry keywords.
{{/if}}

{{#if (eq type 'experience')}}
- REWRITE RULE: Rewrite the sentence into ONE strong resume bullet point only.
- Start with a powerful action verb.
- Add measurable impact (include numbers, percentages, or currency if possible).
- Make it extremely concise and professional.
- Do not include multiple bullets; provide exactly 1 strong bullet point.
{{/if}}

Return only the improved version in the specified JSON format.`,
});

const improveContentFlow = ai.defineFlow(
  {
    name: 'improveContentFlow',
    inputSchema: ImproveContentInputSchema,
    outputSchema: ImproveContentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
