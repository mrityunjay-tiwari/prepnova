import { generateObject } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { prisma } from "@/prisma/src";
import { InterviewReportSchema } from "@/app/api/structured-data/schema";
import { INTERVIEW_EVALUATOR_SYSTEM_PROMPT } from "@/utils/system-prompt";
import {buildInterviewApiUrl, INTERVIEW_API_BASE_URL} from "@/utils/interview-api";
import type {
  FinalizeInterviewRequest,
  InterviewSegment,
  InterviewReportResult,
  StoredInterviewFlowSection,
} from "@/utils/types";

const globalForInterviewFinalization = global as unknown as {
  finalizedInterviewCalls?: Map<string, "in_progress" | "completed">;
};

const finalizedInterviewCalls =
  globalForInterviewFinalization.finalizedInterviewCalls || new Map();

if (!globalForInterviewFinalization.finalizedInterviewCalls) {
  globalForInterviewFinalization.finalizedInterviewCalls =
    finalizedInterviewCalls;
}

const END_CALL_TIMEOUT_MS = 5_000;
const SEGMENTS_TIMEOUT_MS = 8_000;
const REPORT_CONTEXT_TIMEOUT_MS = 5_000;

function buildTranscript(segments: InterviewSegment[]) {
  return segments
    .map(
      (segment, index) =>
        `Q${index + 1}: ${segment.question}\nA${index + 1}: ${segment.answer}`,
    )
    .join("\n\n");
}

type RemoteReportContext = {
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

if (!INTERVIEW_API_BASE_URL) {
  throw new Error("INTERVIEW_API_BASE_URL is not configured");
}

async function fetchJsonWithTimeout<T>(
  input: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function endRemoteInterview(callId: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), END_CALL_TIMEOUT_MS);

    try {
      await fetch(buildInterviewApiUrl("/end-call"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({call_id: callId}),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("[API] Failed to stop remote interview agent", error);
  }
}

async function getSegmentsWithRetry(callId: string, attempts = 5, delayMs = 1500) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const data = await fetchJsonWithTimeout<{
        segments?: InterviewSegment[];
      }>(
        buildInterviewApiUrl(`/segments/${callId}`),
        {cache: "no-store"},
        SEGMENTS_TIMEOUT_MS,
      );

      if (data.segments?.length) {
        return data.segments;
      }
    } catch (error) {
      if (attempt === attempts) {
        throw error;
      }
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  return [];
}

async function getReportContext(callId: string): Promise<RemoteReportContext> {
  try {
    return await fetchJsonWithTimeout<RemoteReportContext>(
      buildInterviewApiUrl(`/report-context/${callId}`),
      {cache: "no-store"},
      REPORT_CONTEXT_TIMEOUT_MS,
    );
  } catch (error) {
    console.error("[API] Failed to fetch remote report context", error);
    return {};
  }
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
  feedbackHistory: RemoteReportContext["feedbackHistory"];
  postureStats: FinalizeInterviewRequest["postureStats"];
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

export async function POST(req: Request) {
  let payload: FinalizeInterviewRequest;

  try {
    payload = JSON.parse(await req.text()) as FinalizeInterviewRequest;
  } catch (error) {
    console.error("[API] Failed to parse finalize interview payload", error);
    return new Response("Invalid JSON", { status: 400 });
  }

  const { callId, userId, role, postureStats, reason } = payload;

  console.log("[FINALIZE] start", {
    callId,
    userId,
    role,
    reason,
  });

  if (!callId || !userId || !role || !postureStats) {
    console.log("[FINALIZE] missing_required_fields", {
      callId,
      userId,
      role,
      hasPostureStats: Boolean(postureStats),
    });
    return new Response("Missing required fields", { status: 400 });
  }

  const existingStatus = finalizedInterviewCalls.get(callId);
  if (existingStatus === "in_progress" || existingStatus === "completed") {
    console.log("[FINALIZE] duplicate_or_in_progress", {
      callId,
      existingStatus,
      reason,
    });
    return Response.json({ success: true, duplicate: true, reason });
  }

  finalizedInterviewCalls.set(callId, "in_progress");

  try {
    console.log("[FINALIZE] ending_remote_call", { callId });
    await endRemoteInterview(callId);
    console.log("[FINALIZE] remote_call_end_attempt_finished", { callId });

    const segments = await getSegmentsWithRetry(callId);
    console.log("[FINALIZE] segments_fetched", {
      callId,
      segmentCount: segments.length,
      sections: segments.map((segment) => segment.section_type),
    });

    if (!segments.length) {
      finalizedInterviewCalls.delete(callId);
      console.log("[FINALIZE] no_segments", { callId });
      return Response.json({
        success: true,
        finalized: false,
        reason: "no_segments",
      });
    }

    const reportContext = await getReportContext(callId);
    console.log("[FINALIZE] report_context_fetched", {
      callId,
      role: reportContext.role,
      seniority: reportContext.seniority,
      flowCount: reportContext.flow?.length ?? 0,
      feedbackCount: reportContext.feedbackHistory?.length ?? 0,
    });
    const transcript = buildTranscript(segments);
    const roleForReport = reportContext.role || role;
    const seniority = reportContext.seniority || "SDE1";
    const flow = reportContext.flow || [];

    console.log("[FINALIZE] generating_report", {
      callId,
      transcriptLength: transcript.length,
      roleForReport,
      seniority,
      flowCount: flow.length,
    });
    const { object } = await generateObject({
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
    console.log("[FINALIZE] report_generated", {
      callId,
      readinessLevel: report.readinessLevel,
      overallScore: report.overallScore,
      strengthsCount: report.strengths.length,
      improvementsCount: report.improvementAreas.length,
      sectionBreakdownCount: report.sectionBreakdown.length,
    });

    console.log("[FINALIZE] saving_report", { callId });
    const savedReport = await prisma.interviewReport.create({
      data: {
        userId,
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
    finalizedInterviewCalls.set(callId, "completed");
    console.log("[FINALIZE] report_saved", {
      callId,
      reportId: savedReport.id,
      reason,
    });
    return Response.json({
      success: true,
      finalized: true,
      reportId: savedReport.id,
      reason,
    });
  } catch (error) {
    finalizedInterviewCalls.delete(callId);
    console.error("[FINALIZE] failed", {
      callId,
      reason,
      error,
    });
    return new Response("Failed to finalize interview", { status: 500 });
  }
}
