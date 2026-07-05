import {prisma} from "@/prisma/src";
import {Prisma} from "@/src/generated/client";
import {generateAndSaveReportForDraft} from "@/utils/report-generation";
import {buildInterviewApiUrl, INTERVIEW_API_BASE_URL} from "@/utils/interview-api";
import type {
  FinalizeInterviewRequest,
  InterviewSegment,
  StoredInterviewFlowSection,
} from "@/utils/types";

const END_CALL_TIMEOUT_MS = 5_000;
const SEGMENTS_TIMEOUT_MS = 8_000;
const REPORT_CONTEXT_TIMEOUT_MS = 5_000;

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

export async function POST(req: Request) {
  let payload: FinalizeInterviewRequest;

  try {
    payload = JSON.parse(await req.text()) as FinalizeInterviewRequest;
  } catch (error) {
    console.error("[API] Failed to parse finalize interview payload", error);
    return new Response("Invalid JSON", {status: 400});
  }

  const {callId, userId, role, postureStats, reason} = payload;

  console.log("[FINALIZE] start", {callId, userId, role, reason});

  if (!callId || !userId || !role || !postureStats) {
    console.log("[FINALIZE] missing_required_fields", {
      callId,
      userId,
      role,
      hasPostureStats: Boolean(postureStats),
    });
    return new Response("Missing required fields", {status: 400});
  }

  // Idempotency at the DB level: exactly one durable draft per callId. This
  // replaces the previous in-memory Map (which didn't survive across serverless
  // instances) and prevents duplicate reports from the multiple exit paths.
  const existing = await prisma.interviewDraft.findUnique({where: {callId}});
  if (existing) {
    console.log("[FINALIZE] duplicate_existing_draft", {
      callId,
      status: existing.status,
      reason,
    });
    return Response.json({
      success: true,
      duplicate: true,
      status: existing.status,
      reportId: existing.reportId,
      reason,
    });
  }

  let draft;
  try {
    draft = await prisma.interviewDraft.create({
      data: {
        callId,
        userId,
        role,
        status: "PROCESSING",
        postureStats: postureStats as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    // Unique-constraint race: another exit path created the draft first.
    console.log("[FINALIZE] duplicate_draft_race", {callId, reason});
    return Response.json({success: true, duplicate: true, reason});
  }

  try {
    console.log("[FINALIZE] ending_remote_call", {callId});
    await endRemoteInterview(callId);

    const segments = await getSegmentsWithRetry(callId);
    console.log("[FINALIZE] segments_fetched", {
      callId,
      segmentCount: segments.length,
    });

    if (!segments.length) {
      await prisma.interviewDraft.update({
        where: {id: draft.id},
        data: {status: "FAILED", error: "no_segments"},
      });
      console.log("[FINALIZE] no_segments", {callId});
      return Response.json({
        success: true,
        finalized: false,
        reason: "no_segments",
      });
    }

    const reportContext = await getReportContext(callId);

    // Durably persist the transcript BEFORE the fragile LLM step. From here on,
    // even if generation (or the whole request) dies, the interview is safe and
    // the report can be regenerated from the dashboard.
    const updatedDraft = await prisma.interviewDraft.update({
      where: {id: draft.id},
      data: {
        transcript: segments as unknown as Prisma.InputJsonValue,
        reportContext: reportContext as unknown as Prisma.InputJsonValue,
        role: reportContext.role || role,
        seniority: reportContext.seniority || "SDE1",
      },
    });
    console.log("[FINALIZE] transcript_saved", {callId, draftId: draft.id});

    const {reportId} = await generateAndSaveReportForDraft(updatedDraft);
    console.log("[FINALIZE] report_saved", {callId, reportId, reason});

    return Response.json({
      success: true,
      finalized: true,
      reportId,
      reason,
    });
  } catch (error) {
    await prisma.interviewDraft
      .update({
        where: {id: draft.id},
        data: {
          status: "FAILED",
          error: error instanceof Error ? error.message : String(error),
          attempts: {increment: 1},
        },
      })
      .catch(() => {});
    console.error("[FINALIZE] report_generation_failed", {callId, reason, error});

    // The interview is safe in the draft; report is retryable. Return 200 so the
    // client's beacon/unload path doesn't treat this as a hard failure.
    return Response.json({
      success: true,
      finalized: false,
      reason: "report_generation_failed",
    });
  }
}
