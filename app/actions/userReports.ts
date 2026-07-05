"use server";

import { prisma } from "@/prisma/src";

export async function getUserInterviewReports(userId: string) {
  if (!userId) {
    throw new Error("User ID is required to fetch reports");
  }

  try {
    const reports = await prisma.interviewReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

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
    const report = await prisma.interviewReport.findUnique({
      where: { id: reportId },
    });

    return report;
  } catch (error) {
    console.error(`Error fetching interview report ${reportId}:`, error);
    throw new Error("Failed to fetch interview report");
  }
}

export async function deleteInterviewReport(reportId: string) {
  if (!reportId) {
    throw new Error("Report ID is required");
  }

  try {
    const result = await prisma.interviewReport.delete({
      where: { id: reportId },
    });

    return { success: true };
  } catch (error) {
    console.error(`Error deleting interview report ${reportId}:`, error);
    throw new Error("Failed to delete interview report");
  }
}

/**
 * Pending/failed interview captures that don't yet have a finished report.
 * READY drafts are excluded because their report already shows as a normal
 * InterviewReport card.
 */
export async function getUserInterviewDrafts(userId: string) {
  if (!userId) {
    throw new Error("User ID is required to fetch drafts");
  }

  try {
    const drafts = await prisma.interviewDraft.findMany({
      where: { userId, status: { in: ["PROCESSING", "FAILED"] } },
      orderBy: { createdAt: "desc" },
    });

    return drafts;
  } catch (error) {
    console.error(`Error fetching interview drafts for user ${userId}:`, error);
    throw new Error("Failed to fetch user interview drafts");
  }
}

export async function deleteInterviewDraft(draftId: string) {
  if (!draftId) {
    throw new Error("Draft ID is required");
  }

  try {
    await prisma.interviewDraft.delete({ where: { id: draftId } });
    return { success: true };
  } catch (error) {
    console.error(`Error deleting interview draft ${draftId}:`, error);
    throw new Error("Failed to delete interview draft");
  }
}
