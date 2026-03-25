
"use client";

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  bullets: string[];
}

export interface Activity {
  id: string;
  organization: string;
  role: string;
  duration: string;
  bullets: string[];
}

export interface Training {
  id: string;
  title: string;
  institution: string;
  year?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  link?: string;
  description?: string;
}

export interface Accomplishment {
  id: string;
  title: string;
  description?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  duration?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category?: string;
}

export interface Language {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface Strength {
  id: string;
  icon: string;
  label: string;
}

export type ResumeTone = 'Fresher' | 'Corporate' | 'Creative' | 'Startup';
export type ResumeVersion = 'ats' | 'designer';

export type ResumeLayout = 
  | 'executive' 
  | 'minimal' 
  | 'split' 
  | 'creative' 
  | 'modernist' 
  | 'ats' 
  | 'elegant' 
  | 'compact' 
  | 'tech_pro' 
  | 'classic' 
  | 'bold_sidebar';

export interface TemplateConfig {
  layout: ResumeLayout;
  fontPair: 'classic' | 'modern' | 'tech';
  theme: 'warm' | 'midnight' | 'emerald' | 'slate';
}

export interface ResumeData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  photoUrl?: string;
  website?: string;
  linkedin?: string;
  profileSummary: string;
  experiences: Experience[];
  internships: Experience[];
  extracurriculars: Activity[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  languages: Language[];
  tools: string[];
  strengths: Strength[];
  trainings: Training[];
  portfolio: PortfolioItem[];
  accomplishments: Accomplishment[];
  templateConfig: TemplateConfig;
  tone: ResumeTone;
  version: ResumeVersion;
}

export const INITIAL_DATA: ResumeData = {
  name: "Rohit",
  role: "Digital Marketing Professional",
  email: "mrrohitt22@gmail.com",
  phone: "9536401175",
  location: "Faridabad, India",
  photoUrl: "",
  profileSummary: "Result-driven Digital Marketing Professional with hands-on experience in corporate operations, manufacturing support, social media management, and AI-powered marketing tools. Proven ability to handle content creation, audience engagement, and digital campaigns. Seeking a growth-oriented role where operational efficiency, digital expertise, and adaptability drive measurable business outcomes.",
  experiences: [
    {
      id: "1",
      company: "Freelance Digital Marketing",
      role: "Digital Marketing Executive",
      duration: "2025 – Present",
      bullets: [
        "Manage social media accounts across Facebook, Instagram & other platforms",
        "Create and schedule engaging content to boost brand visibility",
        "Monitor analytics and optimize posting strategy for maximum engagement",
        "Execute Facebook & Instagram Ads campaigns with awareness of targeting",
        "Utilize AI tools (ChatGPT, Canva AI) for content ideation and copywriting"
      ]
    },
    {
      id: "2",
      company: "IntelliHealth Solutions Pvt. Ltd.",
      role: "Operations Support",
      duration: "2022 – 2024",
      bullets: [
        "Supported corporate operations with data entry and documentation",
        "Assisted in healthcare marketing activities and patient communication",
        "Coordinated with multiple teams for smooth operational flow"
      ]
    }
  ],
  education: [
    { id: "1", degree: "Senior Secondary Education", institution: "Board of School Education" }
  ],
  projects: [],
  skills: [
    { id: "1", name: "Digital Marketing", level: 90, category: "Marketing" },
    { id: "2", name: "Social Media Mgmt", level: 85, category: "Marketing" },
    { id: "3", name: "AI Tools & Automation", level: 80, category: "Technology" },
    { id: "4", name: "Content Creation", level: 75, category: "Creative" },
    { id: "5", name: "Data Entry", level: 100, category: "Admin" },
    { id: "6", name: "MS Office Suite", level: 85, category: "Technology" }
  ],
  languages: [
    { id: "1", name: "Hindi", level: 5 },
    { id: "2", name: "English", level: 3 }
  ],
  tools: ["Facebook Ads", "Instagram Business", "ChatGPT / AI", "Canva", "Google Workspace", "MS Office"],
  strengths: [
    { id: "1", icon: "⚡", label: "Fast Learner & Adaptable" },
    { id: "2", icon: "🎯", label: "Result & Goal Oriented" },
    { id: "3", icon: "🤖", label: "AI-Powered Workflow" },
    { id: "4", icon: "📊", label: "Data-Driven Decisions" }
  ],
  internships: [],
  extracurriculars: [],
  trainings: [],
  portfolio: [],
  accomplishments: [],
  templateConfig: {
    layout: 'executive',
    fontPair: 'classic',
    theme: 'warm'
  },
  tone: 'Corporate',
  version: 'designer'
};
