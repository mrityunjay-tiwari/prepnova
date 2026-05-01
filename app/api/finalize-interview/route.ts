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
  finalizedInterviewCalls?: Set<string>;
};

const finalizedInterviewCalls =
  globalForInterviewFinalization.finalizedInterviewCalls || new Set<string>();

if (!globalForInterviewFinalization.finalizedInterviewCalls) {
  globalForInterviewFinalization.finalizedInterviewCalls =
    finalizedInterviewCalls;
}

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

async function getSegmentsWithRetry(callId: string, attempts = 5, delayMs = 1500) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(buildInterviewApiUrl(`/segments/${callId}`), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch interview segments: ${response.status}`);
    }

    const data = (await response.json()) as {
      segments?: InterviewSegment[];
    };

    if (data.segments?.length) {
      return data.segments;
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return [];
}

async function getReportContext(callId: string): Promise<RemoteReportContext> {
  const response = await fetch(buildInterviewApiUrl(`/report-context/${callId}`), {
    cache: "no-store",
  });

  if (!response.ok) {
    return {};
  }

  return (await response.json()) as RemoteReportContext;
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

  if (!callId || !userId || !role || !postureStats) {
    return new Response("Missing required fields", { status: 400 });
  }

  if (finalizedInterviewCalls.has(callId)) {
    return Response.json({ success: true, duplicate: true, reason });
  }

  finalizedInterviewCalls.add(callId);

  try {
    await fetch(buildInterviewApiUrl("/end-call"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ call_id: callId }),
    }).catch((error) => {
      console.error("[API] Failed to stop remote interview agent", error);
    });

    const segments = await getSegmentsWithRetry(callId);

    if (!segments.length) {
      finalizedInterviewCalls.delete(callId);
      return Response.json({
        success: true,
        finalized: false,
        reason: "no_segments",
      });
    }

    const reportContext = await getReportContext(callId);
    const transcript = buildTranscript(segments);
    const roleForReport = reportContext.role || role;
    const seniority = reportContext.seniority || "SDE1";
    const flow = reportContext.flow || [];

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
    return Response.json({
      success: true,
      finalized: true,
      reportId: savedReport.id,
      reason,
    });
  } catch (error) {
    finalizedInterviewCalls.delete(callId);
    console.error("[API] Finalize interview failed", error);
    return new Response("Failed to finalize interview", { status: 500 });
  }
}
