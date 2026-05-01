import {auth} from "@/utils/auth";
import {getUserInterviewReports} from "@/app/actions/userReports";
import {InterviewCard} from "@/components/dashboard/interview-card";
import {LoginRequired} from "@/components/auth/login-required";
import {PlusCircle, History, Plus} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const reports = await getUserInterviewReports(session.user.id);

  return (
    <div className="min-h-screen bg-background mt-20">
      <main className="container mx-auto md:px-8 px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              My Interviews
            </h2>
            <p className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <History className="h-4 w-4" />
              Viewing your recent performance and feedback history.
            </p>
          </div>
          <Link href="/interview">
            <Button className="rounded-none">
              <Plus className="h-5 w-5" />
              Start Interview
            </Button>
          </Link>
        </div>

        <Separator className="mb-10" />

        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed rounded-3xl bg-muted/30">
            <div className="bg-muted p-6 rounded-full mb-6">
              <History className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Interviews Yet</h3>
            <p className="text-muted-foreground max-w-sm text-center mb-8">
              {`You haven't completed any interviews yet. Start your first session
              to get personalized AI feedback.`}
            </p>
            <Link href="/interview">
              <Button size="lg" className="rounded-xl px-8">
                Start First Interview
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <InterviewCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
