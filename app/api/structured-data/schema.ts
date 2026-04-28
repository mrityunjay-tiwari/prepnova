import { z } from "zod";

export const InterviewReportSchema = z.object({
  technicalScore: z.number().min(0).max(10),
  problemSolvingScore: z.number().min(0).max(10),
  communicationScore: z.number().min(0).max(10),
  confidenceScore: z.number().min(0).max(10),
  behavioralScore: z.number().min(0).max(10),
  overallScore: z.number().min(0).max(10),
  readinessLevel: z.string().min(1),
  strengths: z.array(z.string()).length(3),
  improvementAreas: z.array(z.string()).length(3),
  communicationSummary: z.string().min(1),
  postureSummary: z.string().min(1),
  actionPlan: z.array(z.string()).length(4),
  sectionBreakdown: z.array(
    z.object({
      sectionType: z.string().min(1),
      label: z.string().min(1),
      score: z.number().min(0).max(10),
      summary: z.string().min(1),
    }),
  ).min(1),
  finalSummary: z.string(),
});
