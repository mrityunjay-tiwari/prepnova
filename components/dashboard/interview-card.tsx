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
import {
  CalendarDays,
  ChevronRight,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import {format} from "date-fns";
import Link from "next/link";
import {motion} from "motion/react";

type InterviewReport = {
  id: string;
  role: string | null;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  createdAt: Date | string;
}

type InterviewCardProps = {
  report: InterviewReport;
}

export function InterviewCard({report}: InterviewCardProps) {
  const formattedDate = format(new Date(report.createdAt), "PPP");

  // Helper to determine score color
  const getScoreColor = (score: number) => {
    if (score >= 8)
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 6)
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <motion.div whileHover={{y: -4}} transition={{duration: 0.2}}>
      <Link href={`/dashboard/reports/${report.id}`} className="block group">
        <Card className="overflow-hidden border-muted/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-linear-to-br from-card to-card/50">
          <CardHeader className="pb-3 border-b border-muted/20">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {report.role || "General Interview"}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formattedDate}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={`text-base font-bold px-3 py-1 border ${getScoreColor(report.overallScore)}`}
              >
                {report.overallScore.toFixed(1)}/10
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-5 pb-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <BarChart3 className="h-3 w-3" />
                  Technical
                </div>
                <div className="text-lg font-semibold">
                  {report.technicalScore.toFixed(1)}/10
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{width: `${report.technicalScore * 10}%`}}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <MessageSquare className="h-3 w-3" />
                  Communication
                </div>
                <div className="text-lg font-semibold">
                  {report.communicationScore.toFixed(1)}/10
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{width: `${report.communicationScore * 10}%`}}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-6 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="group/btn gap-1 text-primary hover:text-primary hover:bg-primary/10"
            >
              View Full Report
              <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
