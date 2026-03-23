'use server';
/**
 * @fileOverview A Genkit flow for parsing resume documents (PDF/Images) into a structured ResumeData object.
 *
 * - parseResume - A function that extracts structured data from resume documents.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeDataSchema = z.object({
  name: z.string().describe('Full name of the person'),
  role: z.string().describe('Current professional title or role'),
  email: z.string().describe('Email address'),
  phone: z.string().describe('Phone number'),
  location: z.string().describe('Location (City, State/Country)'),
  website: z.string().optional().describe('Personal website or portfolio URL'),
  linkedin: z.string().optional().describe('LinkedIn profile URL'),
  profileSummary: z.string().describe('A professional summary or bio'),
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
    link: z.string().optional(),
  })),
  skills: z.array(z.object({
    id: z.string(),
    name: z.string(),
    level: z.number().min(0).max(100),
  })),
  languages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    level: z.number().min(1).max(5),
  })),
  tools: z.array(z.string()),
  strengths: z.array(z.object({
    id: z.string(),
    icon: z.string(),
    label: z.string(),
  })),
});

const AiResumeParserInputSchema = z.object({
  text: z.string().optional().describe('The plain text content of the resume.'),
  fileDataUri: z.string().optional().describe("A document (PDF or Image) of the resume as a data URI (base64)."),
});
export type AiResumeParserInput = z.infer<typeof AiResumeParserInputSchema>;

export async function parseResume(input: AiResumeParserInput) {
  return aiResumeParserFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiResumeParserPrompt',
  input: {schema: AiResumeParserInputSchema},
  output: {schema: ResumeDataSchema},
  prompt: `You are a specialized Resume Parser AI. Your task is to extract structured information from the provided resume document and return it in a valid JSON format.

INSTRUCTIONS:
1. EXTRACT: Find the person's name, contact details (email, phone, location), and professional role.
2. EXPERIENCE: For each job, identify the company, role, dates, and create 3-5 strong bullet points.
3. SKILLS: Extract technical and soft skills. Assign a level (0-100) based on context.
4. EDUCATION: Extract degrees and institutions.
5. GENERATE IDs: Every object in an array (skills, experiences, etc.) MUST have a unique random string 'id'.
6. DEFAULTS: If information is missing, use sensible defaults based on the person's background or leave as empty strings/arrays.

{{#if text}}
Input Text:
"""
{{{text}}}
"""
{{/if}}

{{#if fileDataUri}}
Resume Document: {{media url=fileDataUri}}
{{/if}}

Output strictly in the defined JSON structure.`,
});

const aiResumeParserFlow = ai.defineFlow(
  {
    name: 'aiResumeParserFlow',
    inputSchema: AiResumeParserInputSchema,
    outputSchema: ResumeDataSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
