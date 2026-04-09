import { z } from "zod";

export const InterviewReportSchema = z.object({
  technicalScore: z.number().min(0).max(10),
  problemSolvingScore: z.number().min(0).max(10),
  communicationScore: z.number().min(0).max(10),
  confidenceScore: z.number().min(0).max(10),
  behavioralScore: z.number().min(0).max(10),
  overallScore: z.number().min(0).max(10),
  strengths: z.array(z.string()).length(3),
  improvementAreas: z.array(z.string()).length(3),
  finalSummary: z.string(),
});