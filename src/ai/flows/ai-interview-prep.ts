'use server';
/**
 * @fileOverview A Genkit flow for generating personalized interview preparation guides.
 *
 * - prepareInterview - A function that generates interview questions and answers based on a resume.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionAnswerSchema = z.object({
  question: z.string().describe('The interview question.'),
  answer: z.string().describe('A high-impact, professional sample answer.'),
});

const InterviewPrepOutputSchema = z.object({
  commonQuestions: z.array(QuestionAnswerSchema).describe('5 common interview questions and answers.'),
  roleSpecificQuestions: z.array(QuestionAnswerSchema).describe('5 role-specific or technical questions and answers.'),
});
export type InterviewPrepOutput = z.infer<typeof InterviewPrepOutputSchema>;

const InterviewPrepInputSchema = z.object({
  resumeData: z.any().describe('The current structured resume data'),
});
export type InterviewPrepInput = z.infer<typeof InterviewPrepInputSchema>;

export async function prepareInterview(input: InterviewPrepInput): Promise<InterviewPrepOutput> {
  return interviewPrepFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewPrepPrompt',
  input: {schema: InterviewPrepInputSchema},
  output: {schema: InterviewPrepOutputSchema},
  prompt: `You are an expert interview coach and senior technical recruiter.

Based on the provided resume, generate a comprehensive interview preparation guide.

Resume Data:
"""
{{json resumeData}}
"""

TASKS:
1. COMMON QUESTIONS: Generate 5 common behavioral or introductory interview questions (e.g., "Tell me about yourself", "What is your greatest strength?") tailored to the user's background.
2. ROLE-SPECIFIC QUESTIONS: Generate 5 technical or role-specific questions based on the skills and experiences listed in the resume.
3. ANSWERS: For every question, provide a high-impact, professional sample answer that uses the STAR method (Situation, Task, Action, Result) where appropriate, referencing the specific achievements in the resume.

Return the result in the specified JSON format.`,
});

const interviewPrepFlow = ai.defineFlow(
  {
    name: 'interviewPrepFlow',
    inputSchema: InterviewPrepInputSchema,
    outputSchema: InterviewPrepOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
