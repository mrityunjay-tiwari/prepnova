"use server";

import {auth} from "@/utils/auth";
import {prisma} from "@/prisma/src";
import {generateAndSaveReportForDraft} from "@/utils/report-generation";
import {revalidatePath} from "next/cache";

/**
 * Regenerates the report for a FAILED (or stuck PROCESSING) draft using the
 * transcript already stored in our DB — no dependency on the backend still
 * remembering the session. Ownership-checked.
 */
export async function regenerateReport(draftId: string) {
  if (!draftId) {
    return {success: false, error: "Draft ID is required"} as const;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return {success: false, error: "Not authenticated"} as const;
  }

  const draft = await prisma.interviewDraft.findUnique({where: {id: draftId}});
  if (!draft || draft.userId !== session.user.id) {
    return {success: false, error: "Draft not found"} as const;
  }

  if (draft.status === "READY" && draft.reportId) {
    return {success: true, reportId: draft.reportId, alreadyDone: true} as const;
  }

  if (draft.error === "no_segments" || !draft.transcript) {
    return {
      success: false,
      error: "This interview wasn't captured, so a report can't be generated.",
    } as const;
  }

  try {
    await prisma.interviewDraft.update({
      where: {id: draftId},
      data: {status: "PROCESSING"},
    });

    const {reportId} = await generateAndSaveReportForDraft(draft);
    revalidatePath("/dashboard");
    return {success: true, reportId} as const;
  } catch (error) {
    await prisma.interviewDraft
      .update({
        where: {id: draftId},
        data: {
          status: "FAILED",
          error: error instanceof Error ? error.message : String(error),
          attempts: {increment: 1},
        },
      })
      .catch(() => {});
    return {
      success: false,
      error: "Report generation failed. Please try again.",
    } as const;
  }
}
