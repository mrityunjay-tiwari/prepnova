export type InterviewSegment = {
  question: string;
  answer: string;
};

export type InterviewSectionType =
  | "frontend"
  | "backend"
  | "behavioral"
  | "dsa"
  | "system_design"
  | "ml_fundamentals"
  | "projects";

export type InterviewSeniority =
  | "Intern"
  | "Junior Engineer"
  | "SDE1"
  | "SDE2"
  | "SDE3"
  | "Senior Engineer"
  | "Staff Engineer"
  | "Principal Engineer"
  | "Senior AI Engineer"
  | "Senior ML Engineer";

export type InterviewFlowSection = {
  id: string;
  type: InterviewSectionType;
  durationMinutes: number;
  minQuestions: number;
  maxQuestions: number;
  focusTopics?: string[];
};

export type InterviewSetupConfig = {
  role: string;
  seniority: InterviewSeniority;
  flow: InterviewFlowSection[];
};

export type InterviewSectionState =
  | "ACTIVE"
  | "WRAP_UP"
  | "TRANSITIONING"
  | "DONE";

export type InterviewSessionStatus = {
  currentSection?: InterviewSectionType;
  currentSectionLabel?: string;
  currentSectionIndex: number;
  totalSections: number;
  sectionState?: InterviewSectionState;
  elapsedSeconds: number;
  durationSeconds: number;
  questionsCompleted: number;
  currentQuestion?: string;
};

export type ReportSectionBreakdown = {
  sectionType: string;
  label: string;
  score: number;
  summary: string;
};

export type StoredInterviewFlowSection = {
  type: string;
  label?: string;
  duration_minutes?: number;
  min_questions?: number;
  max_questions?: number;
};

export type InterviewReportResult = {
  technicalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  confidenceScore: number;
  behavioralScore: number;
  overallScore: number;
  readinessLevel: string;
  strengths: string[];
  improvementAreas: string[];
  communicationSummary: string;
  postureSummary: string;
  actionPlan: string[];
  sectionBreakdown: ReportSectionBreakdown[];
  finalSummary: string;
};

export type MidFeedback = {
  short_feedback: string;
  score: number;
};

export type PostureStats = {
  min: number;
  max: number;
  avg: number;
};

export type FinalizeInterviewRequest = {
  callId: string;
  userId: string;
  role: string;
  postureStats: PostureStats;
  reason?:
    | "call_left"
    | "tab_closed"
    | "page_hidden"
    | "offline_timeout"
    | "route_change";
};
