import { prisma } from "@/prisma/src";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { report, userId, role, postureStats } = data;

    try {
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
      
      console.log("Report saved successfully", savedReport.id)
      return Response.json({ success: true, id: savedReport.id });

    } catch (prismaError: unknown) {
      const errorMessage = prismaError instanceof Error ? prismaError.message : "Unknown database error";
      console.error("[API] Prisma Error details:", prismaError);
      return new Response(`Database save failed: ${errorMessage}`, { status: 500 });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Save failed: ${errorMessage}`, { status: 500 });
  }
}