"use server";

import { prisma } from "@/prisma/src";
import type { Prisma } from "@/src/generated/client";



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
