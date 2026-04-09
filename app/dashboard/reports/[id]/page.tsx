import {auth} from "@/utils/auth";
import {getInterviewReportById} from "@/app/actions/userReports";
import {notFound, redirect} from "next/navigation";
import { ChevronLeft, BarChart3, Target, MessageSquare, Zap, ShieldCheck, Award, Calendar, User, BrainCircuit, Lightbulb, AlertCircle } from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@/components/ui/progress";
import {format} from "date-fns";
import {ReportRadarChart} from "@/components/dashboard/report-chart";

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

  return (
    <div className="min-h-screen bg-background mt-20 pb-20">
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px]"
              >
                Interview Report
              </Badge>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {report.role || "General Assessment"}
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Comprehensive AI analysis of your interview performance.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-3xl border border-primary/10 shadow-sm min-w-[180px]">
            <span className="text-sm font-bold text-primary uppercase tracking-widest mb-1 text-center">
              Overall Score
            </span>
            <span className="text-5xl font-black text-primary">
              {Math.round(report.overallScore)}/10
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-1">
            <ReportRadarChart
              data={{
                technicalScore: report.technicalScore,
                problemSolvingScore: report.problemSolvingScore,
                communicationScore: report.communicationScore,
                confidenceScore: report.confidenceScore,
                behavioralScore: report.behavioralScore,
              }}
            />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card className="border-muted/40 overflow-hidden rounded-3xl shadow-sm h-full flex flex-col">
              <CardHeader className="bg-muted/30 pb-4 border-b border-muted/20">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Detailed breakdown across key competency areas.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-6 flex-1">
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
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-bold text-sm block leading-none mb-1">
                            {item.label}
                          </span>
                          <span className="text-xs text-muted-foreground hidden md:block">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-lg">
                        {item.score.toFixed(1)}/10
                      </span>
                    </div>
                    <Progress value={item.score * 10} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-emerald-500/20 bg-emerald-500/2 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-emerald-600">
                  <Lightbulb className="h-5 w-5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {report.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm leading-relaxed text-foreground"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-amber-500/2 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {report.improvementAreas.map((a, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm leading-relaxed text-foreground"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {a}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-3xl border-muted/40 shadow-sm overflow-hidden bg-linear-to-b from-primary/3 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap italic">
                  &ldquo;{report.finalSummary}&rdquo;
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-muted/40 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Posture Analysis
                </CardTitle>
                <CardDescription>Visual confidence score.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl">
                  <span className="text-sm font-medium">Average Posture</span>
                  <span className="text-lg font-bold text-primary">
                    {Math.round(report.postureAvg)}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed px-1">
                  Your posture remained consistent throughout{" "}
                  {Math.round(report.postureAvg)}% of the interview, indicating
                  high perceived confidence and professional presence.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
