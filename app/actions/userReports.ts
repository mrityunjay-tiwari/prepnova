"use server";

import { prisma } from "@/prisma/src";
import type { Prisma } from "@/src/generated/client";

export type StoredInterviewReportRow = {
  id: string;
  userId: string;
  role: string | null;
  seniority: string | null;
  technicalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  confidenceScore: number;
  behavioralScore: number;
  overallScore: number;
  postureMin: number;
  postureMax: number;
  postureAvg: number;
  strengths: string[];
  improvementAreas: string[];
  actionPlan: Prisma.JsonValue | null;
  communicationSummary: string | null;
  sectionBreakdown: Prisma.JsonValue | null;
  flowUsed: Prisma.JsonValue | null;
  readinessLevel: string | null;
  postureSummary: string | null;
  finalSummary: string;
  createdAt: Date;
};

export async function getUserInterviewReports(userId: string) {
  if (!userId) {
    throw new Error("User ID is required to fetch reports");
  }

  try {
    const reports = await prisma.$queryRaw<StoredInterviewReportRow[]>`
      SELECT
        "id",
        "userId",
        "role",
        "seniority",
        "technicalScore",
        "problemSolvingScore",
        "communicationScore",
        "confidenceScore",
        "behavioralScore",
        "overallScore",
        "postureMin",
        "postureMax",
        "postureAvg",
        "strengths",
        "improvementAreas",
        "actionPlan",
        "communicationSummary",
        "sectionBreakdown",
        "flowUsed",
        "readinessLevel",
        "postureSummary",
        "finalSummary",
        "createdAt"
      FROM "InterviewReport"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
    `;

    return reports;
  } catch (error) {
    console.error(`Error fetching interview reports for user ${userId}:`, error);
    throw new Error("Failed to fetch user interview reports");
  }
}

export async function getInterviewReportById(reportId: string) {
  if (!reportId) {
    throw new Error("Report ID is required");
  }

  try {
    const rows = await prisma.$queryRaw<StoredInterviewReportRow[]>`
      SELECT
        "id",
        "userId",
        "role",
        "seniority",
        "technicalScore",
        "problemSolvingScore",
        "communicationScore",
        "confidenceScore",
        "behavioralScore",
        "overallScore",
        "postureMin",
        "postureMax",
        "postureAvg",
        "strengths",
        "improvementAreas",
        "actionPlan",
        "communicationSummary",
        "sectionBreakdown",
        "flowUsed",
        "readinessLevel",
        "postureSummary",
        "finalSummary",
        "createdAt"
      FROM "InterviewReport"
      WHERE "id" = ${reportId}
      LIMIT 1
    `;

    return rows[0] ?? null;
  } catch (error) {
    console.error(`Error fetching interview report ${reportId}:`, error);
    throw new Error("Failed to fetch interview report");
  }
}
