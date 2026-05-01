import {auth} from "@/utils/auth";
import {getInterviewReportById} from "@/app/actions/userReports";
import {notFound, redirect} from "next/navigation";
import {
  ChevronLeft,
  BarChart3,
  Target,
  MessageSquare,
  Zap,
  ShieldCheck,
  Award,
  Calendar,
  User,
  BrainCircuit,
  Lightbulb,
  AlertCircle,
  ListChecks,
  Route,
  GraduationCap,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@/components/ui/progress";
import {format} from "date-fns";
import {ReportRadarChart} from "@/components/dashboard/report-chart";
import type {
  ReportSectionBreakdown,
  StoredInterviewFlowSection,
} from "@/utils/types";
import {Separator} from "@/components/ui/separator";
import {PiStackFill, PiThumbsUpFill} from "react-icons/pi";
import {RiPencilFill} from "react-icons/ri";
import {LuMessageCircleDashed} from "react-icons/lu";
import {IoIosTrendingUp} from "react-icons/io";
import { BsHandThumbsUp } from "react-icons/bs";
import { MdOutlineSelfImprovement } from "react-icons/md";

function coerceSectionBreakdown(value: unknown): ReportSectionBreakdown[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is ReportSectionBreakdown => {
    return (
      typeof item === "object" &&
      item !== null &&
      typeof (item as ReportSectionBreakdown).sectionType === "string" &&
      typeof (item as ReportSectionBreakdown).label === "string" &&
      typeof (item as ReportSectionBreakdown).score === "number" &&
      typeof (item as ReportSectionBreakdown).summary === "string"
    );
  });
}

function coerceFlow(value: unknown): StoredInterviewFlowSection[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is StoredInterviewFlowSection => {
    return (
      typeof item === "object" &&
      item !== null &&
      typeof (item as StoredInterviewFlowSection).type === "string"
    );
  });
}

function coerceActionPlan(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const session = await auth();
  const {id} = await params;

  if (!session?.user?.id) redirect("/");

  const report = await getInterviewReportById(id);

  if (!report) notFound();
  if (report.userId !== session.user.id) redirect("/dashboard");

  const formattedDate = format(
    new Date(report.createdAt),
    "MMMM do, yyyy 'at' h:mm a",
  );
  const sectionBreakdown = coerceSectionBreakdown(report.sectionBreakdown);
  const flowUsed = coerceFlow(report.flowUsed);
  const actionPlan = coerceActionPlan(report.actionPlan);

  return (
    <div className="min-h-screen bg-background mt-28 pb-20">
      <div className="container mx-auto md:px-8 px-4 max-w-6xl">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="gap-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-1">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="px-2 py-0.5 font-medium uppercase text-xs"
              >
                Interview Report
              </Badge>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Role : {report.role || "General Assessment"}
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Comprehensive analysis of your interview performance.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {report.seniority ? (
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  <GraduationCap className="mr-1 h-3.5 w-3.5" />
                  {report.seniority}
                </Badge>
              ) : null}
              {report.readinessLevel ? (
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  Ready for: {report.readinessLevel}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 rounded-lg shadow-lg md:min-w-40">
            <span className="text-sm font-semibold text-primary uppercase mb-1 text-center">
              Overall Score
            </span>
            <span className="text-xl font-semibold text-primary">
              {Math.round(report.overallScore)}/10
            </span>
          </div>
        </div>
              <Separator />
        <div className="flex flex-col gap-6 mb-10 mt-2.5">
          {/* Row 1: Radar & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportRadarChart
              data={{
                technicalScore: report.technicalScore,
                problemSolvingScore: report.problemSolvingScore,
                communicationScore: report.communicationScore,
                confidenceScore: report.confidenceScore,
                behavioralScore: report.behavioralScore,
              }}
            />

            <Card className="gap-0 border-muted/40 overflow-hidden rounded-lg shadow-sm h-full flex flex-col p-0">
              <CardHeader className="bg-muted p-2.5">
                <CardTitle className="text-xl flex items-center gap-2">
                  <PiStackFill className="h-4 w-4 text-primary" /> Performance
                  Metrics
                </CardTitle>
                <CardDescription>
                  Detailed breakdown across key competency areas.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="p-3.5 mt-2.5 space-y-6 flex-1 overflow-y-auto min-h-0">
                {[
                  {
                    label: "Technical Proficiency",
                    score: report.technicalScore,
                    icon: Zap,
                    desc: "Subject matter knowledge and technical accuracy.",
                  },
                  {
                    label: "Problem Solving",
                    score: report.problemSolvingScore,
                    icon: Target,
                    desc: "Ability to analyze and solve complex scenarios.",
                  },
                  {
                    label: "Communication Skill",
                    score: report.communicationScore,
                    icon: MessageSquare,
                    desc: "Clarity, pace, articulation of thoughts.",
                  },
                  {
                    label: "Self Confidence",
                    score: report.confidenceScore,
                    icon: ShieldCheck,
                    desc: "Poise and conviction during responses.",
                  },
                  {
                    label: "Behavioral Alignment",
                    score: report.behavioralScore,
                    icon: User,
                    desc: "Soft skills and cultural fit assessment.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-primary/5">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium text-sm block leading-none mb-1">
                            {item.label}
                          </span>
                          <span className="text-xs text-muted-foreground hidden md:block">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <span className="font-medium">
                        {item.score.toFixed(1)}/10
                      </span>
                    </div>
                    <Progress value={item.score * 10} className="h-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Exec Summary, Comm Readout, Strengths & Improvements */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card className="gap-0 p-0 overflow-hidden rounded-lg border-muted/40 shadow-sm bg-linear-to-b from-primary/3 to-transparent flex-1 flex flex-col">
                <CardHeader className="p-2.5 bg-muted">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <RiPencilFill className="h-4 w-4 text-primary" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="p-2.5 flex-1 overflow-y-auto thin-scrollbar min-h-0">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {report.finalSummary}
                  </p>
                </CardContent>
              </Card>

              <Card className="gap-0 p-0 overflow-hidden rounded-lg border-muted/40 shadow-sm flex-1 flex flex-col">
                <CardHeader className="p-2.5 bg-muted">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <LuMessageCircleDashed className="h-4 w-4 text-primary" />
                    Communication Readout
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="p-2.5 flex-1 overflow-y-auto min-h-0">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {report.communicationSummary ||
                      "Communication summary unavailable."}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="gap-0 p-0 overflow-hidden lg:col-span-1 border-emerald-500/20 bg-emerald-500/2 rounded-lg shadow-sm h-full flex flex-col">
              <CardHeader className="p-2.5 bg-foreground-muted">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BsHandThumbsUp className="h-4 w-4 text-primary" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <Separator className="bg-emerald-500/20" />
              <CardContent className="p-2.5 px-3.5 flex-1 overflow-y-auto min-h-0">
                <ul className="space-y-2">
                  {report.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="flex gap-1.5 text-sm text-foreground"
                    >
                      <span className="font-medium text-primary">{i + 1}.</span>{" "}
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="gap-0 p-0 overflow-auto lg:col-span-1 border-amber-500/20 bg-amber-500/2 rounded-lg shadow-sm h-full flex flex-col">
              <CardHeader className="p-2.5 bg-foreground-muted">
                <CardTitle className="text-xl flex items-center gap-2">
                  <IoIosTrendingUp className="h-4 w-4 text-primary" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <Separator className="bg-amber-500/20" />
              <CardContent className="p-2.5 px-3.5 flex-1 overflow-y-auto min-h-0">
                <ul className="space-y-2">
                  {report.improvementAreas.map((a, i) => (
                    <li
                      key={i}
                      className="flex gap-1.5 text-sm text-foreground"
                    >
                      <span className="font-medium text-primary">{i + 1}.</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="gap-0 p-0 overflow-hidden rounded-lg border-muted/40 shadow-sm h-full flex flex-col">
                <CardHeader className="p-2.5 bg-muted">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Route className="h-5 w-5 text-primary" />
                    Section Breakdown
                  </CardTitle>
                  <CardDescription>
                    Aggregated performance by interview round.
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-5 p-2.5 flex-1 overflow-y-auto min-h-0">
                  {sectionBreakdown.length ? (
                    sectionBreakdown.map((section, index) => (
                      <div
                        key={`${section.sectionType}-${index}`}
                        className="rounded-2xl border border-muted/30 bg-muted/10 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-foreground">
                              {section.label}
                            </p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                              {section.sectionType.replaceAll("_", " ")}
                            </p>
                          </div>
                          <Badge variant="outline" className="font-mono">
                            {section.score.toFixed(1)}/10
                          </Badge>
                        </div>
                        <Progress
                          value={section.score * 10}
                          className="mb-3 h-1.5"
                        />
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {section.summary}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Section breakdown unavailable for this report.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 flex flex-col gap-6">
              <Card className="gap-0 p-0 overflow-hidden rounded-lg border-muted/40 shadow-sm flex flex-col">
                <CardHeader className="p-2.5 bg-muted">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MdOutlineSelfImprovement className="h-5 w-5 text-primary" />
                    Posture Analysis
                  </CardTitle>
                  <CardDescription>Visual confidence score.</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="p-2.5 space-y-4 flex-1 overflow-y-auto min-h-0">
                  <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl">
                    <span className="text-sm font-medium">Average Posture</span>
                    <span className="text-lg font-bold text-primary">
                      {Math.round(report.postureAvg)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed px-1">
                    {report.postureSummary ||
                      `Your posture remained consistent throughout ${Math.round(report.postureAvg)}% of the interview, indicating generally steady presence.`}
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-0 p-0 overflow-hidden rounded-lg border-muted/40 shadow-sm flex-1 flex flex-col">
                <CardHeader className="p-2.5 bg-muted">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-primary" />
                    Action Plan
                  </CardTitle>
                  <CardDescription>
                    Concrete next steps based on this interview.
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="p-2.5 space-y-3 flex-1 overflow-y-auto min-h-0">
                  {actionPlan.length ? (
                    actionPlan.map((step: string, index: number) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-2xl border border-muted/30 bg-muted/10 px-4 py-3"
                      >
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed text-foreground">
                          {step}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Action plan unavailable for this report.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Row 4: Interview Flow */}
          {flowUsed.length ? (
            <Card className="gap-0 overflow-hidden rounded-lg border-muted/40 shadow-sm flex flex-col">
              <CardHeader className="p-2.5">
                <CardTitle className="text-xl">Interview Flow Used</CardTitle>
                <CardDescription>
                  Session structure used for this mock interview.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="p-2.5 flex flex-wrap gap-3 overflow-y-auto min-h-0">
                {flowUsed.map((section, index) => (
                  <Badge
                    key={`${section.type}-${index}`}
                    variant="outline"
                    className="rounded-full px-3 py-1"
                  >
                    {section.label || section.type.replaceAll("_", " ")}
                    {section.duration_minutes
                      ? ` · ${section.duration_minutes} min`
                      : ""}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
