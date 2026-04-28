import {auth} from "@/utils/auth";
import {getUserInterviewReports} from "@/app/actions/userReports";
import {LoginRequired} from "@/components/auth/login-required";
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
import {format} from "date-fns";
import {ProgressCharts} from "@/components/dashboard/progress-charts";
import {sans} from "@/lib/fonts";
import { redirect } from "next/navigation";

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const reports = await getUserInterviewReports(session.user.id);
  const sortedReports = [...reports].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  if (reports.length === 0) {
    redirect("/dashboard");
  }

  // Formatting data for charts (limiting to last 7 for trend)
  const chartData = sortedReports.map((report) => ({
    date: format(new Date(report.createdAt), "MMM d"),
    overall: Number(report.overallScore.toFixed(1)),
    technical: Number(report.technicalScore.toFixed(1)),
    communication: Number(report.communicationScore.toFixed(1)),
    confidence: Number(report.confidenceScore.toFixed(1)),
  }));

  // Calculating aggregates
  const avgOverall =
    reports.reduce((acc, curr) => acc + curr.overallScore, 0) / reports.length;
  const avgTechnical =
    reports.reduce((acc, curr) => acc + curr.technicalScore, 0) /
    reports.length;
  const avgCommunication =
    reports.reduce((acc, curr) => acc + curr.communicationScore, 0) /
    reports.length;

  // Calculate improvement (comparing last to previous)
  const lastScore = sortedReports[sortedReports.length - 1].overallScore;
  const prevScore =
    sortedReports.length > 1
      ? sortedReports[sortedReports.length - 2].overallScore
      : 0;
  const scoreImprovement = lastScore - prevScore;

  return (
    <div className="min-h-screen bg-background mt-20 pb-20">
      <div className="container mx-auto md:px-8 px-4 max-w-7xl">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Growth Dashboard
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Tracking your journey toward interview excellence.
            </p>
          </div>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="rounded-xl font-semibold gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </header>

        {/* Professional Aggregate Stats Cards with Double Border */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 ${sans.className}`}
        >
          {[
            {
              label: "Average Score",
              value: `${avgOverall.toFixed(1)}/10`,
              icon: Award,
              improvement: scoreImprovement,
            },
            {
              label: "Tech. Average",
              value: `${avgTechnical.toFixed(1)}/10`,
              icon: Zap,
            },
            {
              label: "Comm. Average",
              value: `${avgCommunication.toFixed(1)}/10`,
              icon: MessageSquare,
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
                    {stat.improvement !== undefined &&
                      stat.improvement !== 0 && (
                        <span
                          className={`flex items-center text-xs font-bold ${stat.improvement > 0 ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {stat.improvement > 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(stat.improvement).toFixed(1)} pts
                        </span>
                      )}
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

        {/* Charts Section */}
        <div className="mb-12">
          <ProgressCharts data={chartData} />
        </div>

        {/* Skill Progress Detail Area */}
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
              {[
                {
                  label: "Technical Knowledge",
                  score: avgTechnical,
                  icon: Zap,
                  color: "bg-emerald-500",
                },
                {
                  label: "Communication Flow",
                  score: avgCommunication,
                  icon: MessageSquare,
                  color: "bg-amber-500",
                },
                {
                  label: "Confidence & Poise",
                  score:
                    reports.reduce((a, c) => a + c.confidenceScore, 0) /
                    reports.length,
                  icon: ShieldCheck,
                  color: "bg-purple-500",
                },
                {
                  label: "Problem Solving Logic",
                  score:
                    reports.reduce((a, c) => a + c.problemSolvingScore, 0) /
                    reports.length,
                  icon: Target,
                  color: "bg-blue-500",
                },
                {
                  label: "Behavioral Alignment",
                  score:
                    reports.reduce((a, c) => a + c.behavioralScore, 0) /
                    reports.length,
                  icon: TrendingUp,
                  color: "bg-pink-500",
                },
              ].map((item, idx) => (
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
                    <Activity className="h-4 w-4" />
                    Sharpen Communication
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your technical scores are higher than your communication
                    pace. Focus on your clarity and articulation in the next
                    mock session.
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
              <CardContent className="p-6">
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;You have increased your overall interview performance
                  by {(scoreImprovement > 0 ? scoreImprovement : 0).toFixed(1)}{" "}
                  points
                  since your last session. Keep the momentum going!&rdquo;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
