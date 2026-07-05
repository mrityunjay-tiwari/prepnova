import {generateObject} from "ai";
import {openrouter} from "@openrouter/ai-sdk-provider";
import {prisma} from "@/prisma/src";
import {InterviewReportSchema} from "@/app/api/structured-data/schema";
import {INTERVIEW_EVALUATOR_SYSTEM_PROMPT} from "@/utils/system-prompt";
import {Prisma} from "@/src/generated/client";
import type {
  InterviewSegment,
  InterviewReportResult,
  StoredInterviewFlowSection,
  PostureStats,
} from "@/utils/types";

export type StoredReportContext = {
  role?: string;
  seniority?: string;
  flow?: StoredInterviewFlowSection[];
  feedbackHistory?: Array<{
    question: string;
    section_type: string;
    score: number;
    short_feedback: string;
  }>;
};

/**
 * The subset of an InterviewDraft row required to (re)generate its report.
 * Kept loose so both the finalize route and the retry action can pass a raw
 * Prisma draft record without extra mapping.
 */
export type DraftForReport = {
  id: string;
  callId: string;
  userId: string;
  role: string | null;
  seniority: string | null;
  transcript: Prisma.JsonValue;
  reportContext: Prisma.JsonValue;
  postureStats: Prisma.JsonValue;
};

const DEFAULT_POSTURE: PostureStats = {min: 0, max: 0, avg: 0};

export function buildTranscript(segments: InterviewSegment[]) {
  return segments
    .map(
      (segment, index) =>
        `Q${index + 1}: ${segment.question}\nA${index + 1}: ${segment.answer}`,
    )
    .join("\n\n");
}

function buildReportPrompt({
  role,
  seniority,
  flow,
  feedbackHistory,
  postureStats,
  transcript,
}: {
  role: string;
  seniority: string;
  flow: StoredInterviewFlowSection[];
  feedbackHistory: StoredReportContext["feedbackHistory"];
  postureStats: PostureStats;
  transcript: string;
}) {
  return `
Role:
${role}

Target seniority:
${seniority}

Interview flow:
${JSON.stringify(flow, null, 2)}

Question-level feedback history:
${JSON.stringify(feedbackHistory ?? [], null, 2)}

Posture statistics:
${JSON.stringify(postureStats, null, 2)}

Interview transcript:
${transcript}
`;
}

/**
 * Generates the structured report for a stored draft (using its saved
 * transcript — no backend dependency), creates the InterviewReport, and marks
 * the draft READY. Throws if generation fails; the caller decides how to record
 * the failure on the draft. Never deletes the draft (kept as the durable
 * transcript record).
 */
export async function generateAndSaveReportForDraft(draft: DraftForReport) {
  const segments = (Array.isArray(draft.transcript)
    ? draft.transcript
    : []) as unknown as InterviewSegment[];

  if (!segments.length) {
    throw new Error("Draft has no transcript to generate a report from");
  }

  const reportContext = (draft.reportContext ?? {}) as StoredReportContext;
  const postureStats = (draft.postureStats ?? DEFAULT_POSTURE) as PostureStats;

  const transcript = buildTranscript(segments);
  const roleForReport = draft.role || reportContext.role || "Frontend Developer";
  const seniority = draft.seniority || reportContext.seniority || "SDE1";
  const flow = reportContext.flow || [];

  const {object} = await generateObject({
    model: openrouter("openai/gpt-oss-20b:free"),
    schema: InterviewReportSchema,
    system: INTERVIEW_EVALUATOR_SYSTEM_PROMPT,
    prompt: buildReportPrompt({
      role: roleForReport,
      seniority,
      flow,
      feedbackHistory: reportContext.feedbackHistory,
      postureStats,
      transcript,
    }),
  });

  const report = object as InterviewReportResult;

  const savedReport = await prisma.interviewReport.create({
    data: {
      userId: draft.userId,
      callId: draft.callId,
      role: roleForReport,
      seniority,
      technicalScore: report.technicalScore,
      problemSolvingScore: report.problemSolvingScore,
      communicationScore: report.communicationScore,
      confidenceScore: report.confidenceScore,
      behavioralScore: report.behavioralScore,
      overallScore: report.overallScore,
      readinessLevel: report.readinessLevel,
      postureMin: postureStats.min,
      postureMax: postureStats.max,
      postureAvg: postureStats.avg,
      postureSummary: report.postureSummary,
      strengths: report.strengths,
      improvementAreas: report.improvementAreas,
      actionPlan: report.actionPlan,
      communicationSummary: report.communicationSummary,
      sectionBreakdown: report.sectionBreakdown,
      flowUsed: flow,
      finalSummary: report.finalSummary,
    },
  });

  await prisma.interviewDraft.update({
    where: {id: draft.id},
    data: {status: "READY", reportId: savedReport.id, error: null},
  });

  return {reportId: savedReport.id};
}
