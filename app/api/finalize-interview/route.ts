import { generateObject } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { prisma } from "@/prisma/src";
import { InterviewReportSchema } from "@/app/api/structured-data/schema";
import { INTERVIEW_EVALUATOR_SYSTEM_PROMPT } from "@/utils/system-prompt";
import type { FinalizeInterviewRequest, InterviewSegment } from "@/utils/types";

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

async function getSegmentsWithRetry(callId: string, attempts = 5, delayMs = 1500) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(
      `https://mrityunjay18-ai-interview-agent.hf.space/segments/${callId}`,
      { cache: "no-store" },
    );

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
    await fetch("https://mrityunjay18-ai-interview-agent.hf.space/end-call", {
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

    const transcript = buildTranscript(segments);

    const { object: report } = await generateObject({
      model: openrouter("openai/gpt-oss-20b:free"),
      schema: InterviewReportSchema,
      system: INTERVIEW_EVALUATOR_SYSTEM_PROMPT,
      prompt: transcript,
    });

    const savedReport = await prisma.interviewReport.create({
      data: {
        userId,
        role,
        technicalScore: report.technicalScore,
        problemSolvingScore: report.problemSolvingScore,
        communicationScore: report.communicationScore,
        confidenceScore: report.confidenceScore,
        behavioralScore: report.behavioralScore,
        overallScore: report.overallScore,
        strengths: report.strengths,
        improvementAreas: report.improvementAreas,
        finalSummary: report.finalSummary,
        postureMin: postureStats.min,
        postureMax: postureStats.max,
        postureAvg: postureStats.avg,
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
