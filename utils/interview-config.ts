import type {
  InterviewFlowSection,
  InterviewSectionType,
  InterviewSeniority,
  InterviewSetupConfig,
} from "@/utils/types";

export const INTERVIEW_SENIORITY_OPTIONS: InterviewSeniority[] = [
  "Intern",
  "Junior Engineer",
  "SDE1",
  "SDE2",
  "SDE3",
  "Senior Engineer",
  "Staff Engineer",
  "Principal Engineer",
  "Senior AI Engineer",
  "Senior ML Engineer",
];

export const INTERVIEW_SECTION_OPTIONS: Array<{
  type: InterviewSectionType;
  label: string;
  description: string;
  suggestedDuration: number;
  minQuestions: number;
  maxQuestions: number;
}> = [
  {
    type: "projects",
    label: "Projects",
    description: "Project walkthroughs, ownership, and implementation details.",
    suggestedDuration: 10,
    minQuestions: 2,
    maxQuestions: 6,
  },
  {
    type: "frontend",
    label: "Frontend",
    description: "React, browser fundamentals, performance, and UI tradeoffs.",
    suggestedDuration: 15,
    minQuestions: 4,
    maxQuestions: 15,
  },
  {
    type: "backend",
    label: "Backend",
    description: "APIs, databases, services, debugging, and reliability.",
    suggestedDuration: 15,
    minQuestions: 4,
    maxQuestions: 14,
  },
  {
    type: "behavioral",
    label: "Behavioral",
    description: "Communication, conflict handling, ownership, and leadership.",
    suggestedDuration: 10,
    minQuestions: 3,
    maxQuestions: 10,
  },
  {
    type: "dsa",
    label: "DSA",
    description: "Problem-solving, algorithmic reasoning, and complexity thinking.",
    suggestedDuration: 15,
    minQuestions: 3,
    maxQuestions: 10,
  },
  {
    type: "system_design",
    label: "System Design",
    description: "Architecture, tradeoffs, scaling, and reliability discussions.",
    suggestedDuration: 20,
    minQuestions: 2,
    maxQuestions: 8,
  },
  {
    type: "ml_fundamentals",
    label: "ML Fundamentals",
    description: "Model intuition, training, evaluation, and deployment basics.",
    suggestedDuration: 15,
    minQuestions: 3,
    maxQuestions: 10,
  },
];

export function createFlowSection(type: InterviewSectionType): InterviewFlowSection {
  const template = INTERVIEW_SECTION_OPTIONS.find((option) => option.type === type);

  if (!template) {
    throw new Error(`Unknown interview section type: ${type}`);
  }

  return {
    id: crypto.randomUUID(),
    type: template.type,
    durationMinutes: template.suggestedDuration,
    minQuestions: template.minQuestions,
    maxQuestions: template.maxQuestions,
    focusTopics: [],
  };
}

export function getSectionLabel(type: InterviewSectionType) {
  return (
    INTERVIEW_SECTION_OPTIONS.find((option) => option.type === type)?.label ??
    type
  );
}

export function buildDefaultInterviewSetup(role: string): InterviewSetupConfig {
  return {
    role,
    seniority: "SDE1",
    flow: [createFlowSection("projects"), createFlowSection("frontend"), createFlowSection("behavioral")],
  };
}
