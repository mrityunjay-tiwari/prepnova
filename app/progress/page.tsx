import {auth} from "@/utils/auth";
import {getUserInterviewReports} from "@/app/actions/userReports";
import {
  TrendingUp,
  BarChart,
  ChevronRight,
  Target,
  Zap,
  MessageSquare,
  ShieldCheck,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  Activity,
  Sparkles,
  CalendarRange,
  BrainCircuit,
  ChevronLeft,
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
import {Progress} from "@/components/ui/progress";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {format} from "date-fns";
import {ProgressCharts} from "@/components/dashboard/progress-charts";
import {sans} from "@/lib/fonts";
import {redirect} from "next/navigation";
import { LuLockKeyholeOpen } from "react-icons/lu";
import { RiFocusLine } from "react-icons/ri";
import { HiOutlineHandRaised } from "react-icons/hi2";

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const reports = await getUserInterviewReports(session.user.id);
  const sortedReports = [...reports].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  if (reports.length === 0) {
    redirect("/dashboard");
  }

  const latestReport = sortedReports[sortedReports.length - 1];
  const hasEnoughTrendData = reports.length >= 3;
  const hasComparisonData = reports.length >= 2;

  const chartData = sortedReports.map((report) => ({
    date: format(new Date(report.createdAt), "MMM d"),
    overall: Number(report.overallScore.toFixed(1)),
    technical: Number(report.technicalScore.toFixed(1)),
    communication: Number(report.communicationScore.toFixed(1)),
    confidence: Number(report.confidenceScore.toFixed(1)),
  }));

  const avgOverall =
    reports.reduce((acc, curr) => acc + curr.overallScore, 0) / reports.length;
  const avgTechnical =
    reports.reduce((acc, curr) => acc + curr.technicalScore, 0) /
    reports.length;
  const avgCommunication =
    reports.reduce((acc, curr) => acc + curr.communicationScore, 0) /
    reports.length;
  const avgConfidence =
    reports.reduce((acc, curr) => acc + curr.confidenceScore, 0) /
    reports.length;
  const avgProblemSolving =
    reports.reduce((acc, curr) => acc + curr.problemSolvingScore, 0) /
    reports.length;
  const avgBehavioral =
    reports.reduce((acc, curr) => acc + curr.behavioralScore, 0) /
    reports.length;

  const firstScore = sortedReports[0].overallScore;
  const lastScore = latestReport.overallScore;
  const prevScore = hasComparisonData
    ? sortedReports[sortedReports.length - 2].overallScore
    : 0;
  const scoreImprovement = lastScore - prevScore;
  const totalGrowth = lastScore - firstScore;

  const lastThreeReports = sortedReports.slice(-3);
  const previousThreeReports = sortedReports.slice(-6, -3);
  const lastThreeAverage =
    lastThreeReports.reduce((acc, curr) => acc + curr.overallScore, 0) /
    lastThreeReports.length;
  const previousThreeAverage = previousThreeReports.length
    ? previousThreeReports.reduce((acc, curr) => acc + curr.overallScore, 0) /
      previousThreeReports.length
    : firstScore;
  const momentumDelta = lastThreeAverage - previousThreeAverage;

  const latestSkills = [
    {
      label: "Technical Knowledge",
      shortLabel: "Technical",
      score: latestReport.technicalScore,
      icon: RiFocusLine ,
    },
    {
      label: "Communication Flow",
      shortLabel: "Communication",
      score: latestReport.communicationScore,
      icon: RiFocusLine,
    },
    {
      label: "Confidence & Poise",
      shortLabel: "Confidence",
      score: latestReport.confidenceScore,
      icon: RiFocusLine ,
    },
    {
      label: "Problem Solving Logic",
      shortLabel: "Problem Solving",
      score: latestReport.problemSolvingScore,
      icon: RiFocusLine ,
    },
    {
      label: "Behavioral Alignment",
      shortLabel: "Behavioral",
      score: latestReport.behavioralScore,
      icon: RiFocusLine ,
    },
  ];

  const strongestSkill = [...latestSkills].sort((a, b) => b.score - a.score)[0];
  const weakestSkill = [...latestSkills].sort((a, b) => a.score - b.score)[0];

  const averagedSkills = [
    {
      label: "Technical Knowledge",
      score: avgTechnical,
      icon: Zap,
    },
    {
      label: "Communication Flow",
      score: avgCommunication,
      icon: MessageSquare,
    },
    {
      label: "Confidence & Poise",
      score: avgConfidence,
      icon: ShieldCheck,
    },
    {
      label: "Problem Solving Logic",
      score: avgProblemSolving,
      icon: Target,
    },
    {
      label: "Behavioral Alignment",
      score: avgBehavioral,
      icon: TrendingUp,
    },
  ];

  const strongestAverageSkill = [...averagedSkills].sort(
    (a, b) => b.score - a.score,
  )[0];
  const weakestAverageSkill = [...averagedSkills].sort(
    (a, b) => a.score - b.score,
  )[0];

  return (
    <div className="min-h-screen bg-background mt-28 pb-20">
      <div className="container mx-auto md:px-8 px-4 max-w-6xl">
        <div className="mb-4">
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
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Growth Dashboard
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Tracking your journey toward interview excellence.
            </p>
          </div>
        </header>

        {!hasEnoughTrendData ? (
          <div className="space-y-8">
            <div
              className={`overflow-hidden rounded-none border border-dashed bg-card ${sans.className}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                {[
                  {
                    label: "Overall Score",
                    value: `${latestReport.overallScore.toFixed(1)}/10`,
                    icon: Award,
                    accent: "text-emerald-600",
                    bg: "from-emerald-50/80 to-background",
                  },
                  {
                    label: "Readiness Level",
                    value: latestReport.readinessLevel || "In progress",
                    icon: HiOutlineHandRaised,
                    accent: "text-blue-600",
                    bg: "from-blue-50/70 to-background",
                  },
                  {
                    label: "Strongest Skill",
                    value: strongestSkill.shortLabel,
                    icon: strongestSkill.icon,
                    accent: "text-violet-600",
                    bg: "from-purple-50/70 to-background",
                  },
                ].map((stat, idx) => (
                  <div
                    key={stat.label}
                    className={`relative bg-linear-to-br ${stat.bg} p-6 md:p-7 ${
                      idx < 2
                        ? "border-b md:border-b-0 md:border-r border-border/60"
                        : ""
                    }`}
                  >
                    <div className="mb-7 flex items-start justify-between gap-3">
                      <p className="max-w-[10rem] text-[11px] font-bold uppercase text-muted-foreground dark:text-white">
                        {stat.label}
                      </p>
                      <div className="flex p-2.5 items-center justify-center rounded-xl border border-border/70 bg-background shadow-sm">
                        <stat.icon className={`h-4.5 w-4.5 ${stat.accent}`} />
                      </div>
                    </div>
                    <p className="md:text-2xl text-xl capitalize font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
              <Card className="lg:col-span-2 p-0 rounded-lg border-muted/40 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted p-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <LuLockKeyholeOpen className="h-4.5 w-4.5 text-primary" />
                    Progress Unlocks After More Practice
                  </CardTitle>
                  <CardDescription>
                    You have a strong snapshot. We need a little more history to
                    surface real trends.
                  </CardDescription>
                </CardHeader>
                {/* <Separator /> */}
                <CardContent className="p-4 space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {reports.length} of 3 interviews completed
                    </Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      {3 - Math.min(reports.length, 3)} more to unlock momentum
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <Progress
                      value={(reports.length / 3) * 100}
                      className="h-2"
                    />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Complete{" "}
                      {reports.length === 1
                        ? "2 more interviews"
                        : "1 more interview"}{" "}
                      to unlock momentum, consistency, and long-term growth
                      insights.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border/60 bg-background p-4">
                      <div className="mb-2 flex items-center gap-2 font-semibold">
                        <weakestSkill.icon className="h-4 w-4 text-primary" />
                        Focus Area
                      </div>
                      <p className="text-lg font-semibold">
                        {weakestSkill.label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        This is the lowest-scoring area from your latest session
                        at {weakestSkill.score.toFixed(1)}/10.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-background p-4">
                      <div className="mb-2 flex items-center gap-2 font-semibold">
                        <strongestSkill.icon className="h-4 w-4 text-primary" />
                        Current Edge
                      </div>
                      <p className="text-lg font-semibold">
                        {strongestSkill.label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your strongest signal right now is{" "}
                        {strongestSkill.score.toFixed(1)}/10. Keep this steady
                        as you improve the rest.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="rounded-lg p-0 border-muted/40 shadow-sm bg-linear-to-b from-primary/5 to-transparent">
                  <CardHeader className="bg-muted p-3 rounded-t-lg">
                    <CardTitle className="text-xl">Next Milestone</CardTitle>
                    <CardDescription>
                      Suggested next step based on your latest report.
                    </CardDescription>
                  </CardHeader>
                  {/* <Separator /> */}
                  <CardContent className="p-4 pt-0">
                    <div className="rounded-lg border border-border/60 p-4 mb-4">
                      <h4 className="mb-1 flex items-center gap-2 font-semibold text-primary">
                        <Activity className="h-4 w-4" />
                        Sharpen {weakestSkill.shortLabel}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Make your next practice session intentionally target
                        this area so we can start measuring real progress.
                      </p>
                    </div>
                    <Link href="/interview">
                      <Button className="w-full rounded-md hover:cursor-pointer gap-2 font-semibold">
                        Practice Again
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="rounded-lg p-0 border-muted/40 shadow-sm overflow-hidden">
                  <CardHeader className="p-3 bg-muted">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CalendarRange className="h-4 w-4 text-primary" />
                      Snapshot View
                    </CardTitle>
                    <CardDescription>
                      Trend metrics need at least 3 interviews to become
                      meaningful.
                    </CardDescription>
                  </CardHeader>
                  {/* <Separator /> */}
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      With only {reports.length} session
                      {reports.length > 1 ? "s" : ""}, this page is
                      intentionally focused on your current standing rather than
                      noisy trend lines.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12 ${sans.className}`}
            >
              {[
                {
                  label: "Current Readiness",
                  value: latestReport.readinessLevel || "In progress",
                  icon: BrainCircuit,
                },
                {
                  label: "Growth Since Start",
                  value: `${totalGrowth > 0 ? "+" : ""}${totalGrowth.toFixed(1)} pts`,
                  icon: TrendingUp,
                },
                {
                  label: "Momentum",
                  value: `${momentumDelta > 0 ? "+" : ""}${momentumDelta.toFixed(1)} pts`,
                  icon: Activity,
                },
                {
                  label: "Total Interviews",
                  value: reports.length.toString(),
                  icon: BarChart,
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-0.5 border border-gray-300 rounded-[2rem]"
                >
                  <Card className="rounded-[1.8rem] border border-gray-200 shadow-sm bg-background overflow-hidden h-full">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-xl bg-muted/50 border border-border">
                          <stat.icon className="h-5 w-5 text-blue-950" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-3xl font-black text-foreground">
                          {stat.value}
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {stat.label}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <div className="mb-12">
              <ProgressCharts data={chartData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 rounded-3xl border-muted/40 shadow-sm">
                <CardHeader className="border-b border-muted/20 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Parameter Level Mastery
                  </CardTitle>
                  <CardDescription>
                    Comprehensive average across all sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 space-y-8">
                  {averagedSkills.map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2.5 font-bold">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          {item.label}
                        </div>
                        <span className="font-mono font-black">
                          {item.score.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress value={item.score * 10} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="rounded-3xl border-muted/40 shadow-sm bg-linear-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="text-xl">Next Milestone</CardTitle>
                    <CardDescription>Recommended focus area.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="p-4 rounded-2xl bg-background/50 border border-muted/20 mb-4">
                      <h4 className="font-bold text-primary mb-1 flex items-center gap-2">
                        <weakestAverageSkill.icon className="h-4 w-4" />
                        Sharpen {weakestAverageSkill.label}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This is your lowest sustained average. Focus the next
                        few sessions here to improve overall readiness faster.
                      </p>
                    </div>
                    <Link href="/interview">
                      <Button className="w-full rounded-xl gap-2 font-bold shadow-md">
                        Run Quick Check
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-muted/40 shadow-sm overflow-hidden">
                  <div className="p-6 bg-linear-to-r from-primary to-primary/80 text-primary-foreground">
                    <h3 className="text-xl font-black mb-1">Consistency Key</h3>
                    <p className="text-sm opacity-90">
                      Sessions over time build muscle memory.
                    </p>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      &ldquo;You are up{" "}
                      {totalGrowth > 0 ? totalGrowth.toFixed(1) : "0.0"} points
                      since your first session, and your recent momentum is{" "}
                      {momentumDelta > 0 ? "positive" : "still building"}
                      .&rdquo;
                    </p>
                    <div className="rounded-2xl border border-muted/20 bg-background/60 p-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Strongest average</span>
                        <span className="font-semibold">
                          {strongestAverageSkill.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Needs attention</span>
                        <span className="font-semibold">
                          {weakestAverageSkill.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          Latest session change
                        </span>
                        <span
                          className={`font-semibold ${
                            scoreImprovement >= 0
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {scoreImprovement >= 0 ? "+" : ""}
                          {scoreImprovement.toFixed(1)} pts
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
