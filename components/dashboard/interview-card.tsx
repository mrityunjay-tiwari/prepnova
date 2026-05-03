"use client";

import React from "react";
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
import {CalendarDays, ChevronRight, TrashIcon} from "lucide-react";
import {format} from "date-fns";
import Link from "next/link";
import {motion} from "motion/react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {deleteInterviewReport} from "@/app/actions/userReports";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type InterviewReport = {
  id: string;
  role: string | null;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  createdAt: Date | string;
};

type InterviewCardProps = {
  report: InterviewReport;
};

export function InterviewCard({report}: InterviewCardProps) {
  const formattedDate = format(new Date(report.createdAt), "PPP");
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteInterviewReport(report.id);
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500 bg-green-500/10 border-green-500/20";
    if (score >= 6)
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this interview? This action cannot
              be undone and will permanently remove all associated records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div whileHover={{y: -4}} transition={{duration: 0.2}}>
        <Link href={`/dashboard/reports/${report.id}`} className="block group">
          <Card className="rounded-sm p-0 overflow-hidden border-muted/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-linear-to-br from-card to-card/50">
            <CardHeader className="pb-1 pt-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {report.role || "General Interview"}
                  </CardTitle>
                  <CardDescription className="flex text-xs items-center gap-1.5 mt-1.5">
                    <CalendarDays className="h-3 w-3" />
                    {formattedDate}
                  </CardDescription>
                </div>
                <div className="flex gap-2 items-center justify-center">
                  <Badge
                    variant="outline"
                    className={`${getScoreColor(report.overallScore)} text-xs`}
                  >
                    {report.overallScore.toFixed(1)}/10
                  </Badge>
                  <div
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDialogOpen(true);
                    }}
                    className="p-1 hover:bg-red-500/10 rounded-md transition-colors group/trash cursor-pointer z-10"
                  >
                    <TrashIcon className="h-4 w-4 text-muted-foreground group-hover/trash:text-red-500 transition-colors" />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    Technical
                  </div>
                  <div className="font-medium">
                    {report.technicalScore.toFixed(1)}/10
                  </div>
                  <div className="w-full bg-muted h-1 overflow-hidden">
                    <div
                      className="rounded-none bg-primary h-full transition-all duration-500"
                      style={{width: `${report.technicalScore * 10}%`}}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    Communication
                  </div>
                  <div className="font-medium">
                    {report.communicationScore.toFixed(1)}/10
                  </div>
                  <div className="w-full bg-muted h-1 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-none transition-all duration-500"
                      style={{width: `${report.communicationScore * 10}%`}}
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-2 flex justify-end">
              <Button variant="ghost" size="sm" className="flex items-center">
                View Full Report
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </motion.div>
    </>
  );
}
