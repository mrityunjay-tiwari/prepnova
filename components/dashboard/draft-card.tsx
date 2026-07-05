"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  AlertTriangle,
  CalendarDays,
  Loader2,
  RefreshCw,
  TrashIcon,
} from "lucide-react";
import {format} from "date-fns";
import {motion} from "motion/react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {regenerateReport} from "@/app/actions/regenerateReport";
import {deleteInterviewDraft} from "@/app/actions/userReports";

type Draft = {
  id: string;
  role: string | null;
  status: string;
  error: string | null;
  createdAt: Date | string;
};

export function DraftCard({draft}: {draft: Draft}) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formattedDate = format(new Date(draft.createdAt), "PPP");
  const isProcessing = draft.status === "PROCESSING";
  const notCaptured = draft.error === "no_segments";
  // Retry is allowed for FAILED drafts and for drafts stuck in PROCESSING
  // (e.g. the request died mid-generation). Only "not captured" can't retry.
  const canRetry = !notCaptured;

  const handleRetry = async () => {
    setIsRetrying(true);
    setErrorMsg(null);
    try {
      const res = await regenerateReport(draft.id);
      if (res.success) {
        router.refresh();
      } else {
        setErrorMsg(res.error ?? "Couldn't generate the report.");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDismiss = async () => {
    setIsDeleting(true);
    try {
      await deleteInterviewDraft(draft.id);
      router.refresh();
    } catch {
      setErrorMsg("Couldn't remove this. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <motion.div whileHover={{y: -4}} transition={{duration: 0.2}}>
      <Card className="rounded-sm p-0 overflow-hidden border-muted/40 bg-linear-to-br from-card to-card/50">
        <CardHeader className="pb-1 pt-2.5">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold">
                {draft.role || "General Interview"}
              </CardTitle>
              <CardDescription className="flex text-xs items-center gap-1.5 mt-1.5">
                <CalendarDays className="h-3 w-3" />
                {formattedDate}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={
                isProcessing
                  ? "text-blue-500 bg-blue-500/10 border-blue-500/20 text-xs"
                  : "text-amber-500 bg-amber-500/10 border-amber-500/20 text-xs"
              }
            >
              {isProcessing ? "Processing" : "Needs report"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {isProcessing ? (
            <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Finishing your report… if it stalls, you can retry below.
            </div>
          ) : notCaptured ? (
            <div className="flex items-start gap-2 py-2 text-sm text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span>
                We couldn&rsquo;t capture this interview, so a report can&rsquo;t
                be generated. Your other interviews are unaffected.
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2 py-2 text-sm text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span>
                Your interview is safely saved, but the report didn&rsquo;t
                generate. You can retry — nothing was lost.
              </span>
            </div>
          )}
          {errorMsg ? (
            <p className="mt-1 text-xs text-red-500">{errorMsg}</p>
          ) : null}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-2 pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            disabled={isDeleting || isRetrying}
          >
            <TrashIcon className="h-4 w-4" />
            {isDeleting ? "Removing…" : "Dismiss"}
          </Button>
          {canRetry ? (
            <Button
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying || isDeleting}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
              />
              {isRetrying ? "Generating…" : "Retry"}
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
