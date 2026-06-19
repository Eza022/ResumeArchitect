export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  location?: string;
  period: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  period: string;
  details?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Reference {
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface TailoredResume {
  contact: ContactInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects?: Project[];
  languages?: string[];
  certifications?: string[];
  references?: Reference[];
}

export interface ResumeData {
  tailoredResume: TailoredResume;
  coverLetter: string;
  analysis: {
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    keyImprovements: string;
  };
}
