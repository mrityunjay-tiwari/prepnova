"use client";

import {useMemo, useState} from "react";
import {useSearchParams} from "next/navigation";
import StreamVideoCallRender from "../stream/streamVideoRender";
import InterviewSetup from "./interview-setup";
import type {InterviewSetupConfig} from "@/utils/types";
import JoinMeeting from "../home/join-meeting";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import {Separator} from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default function InterviewPage({
  userId,
  userName,
  userToken,
}: {
  userId: string;
  userName: string;
  userToken: string;
}) {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const [interviewConfig, setInterviewConfig] =
    useState<InterviewSetupConfig | null>(null);

  const role = useMemo(() => {
    if (!roleParam) {
      return null;
    }

    return roleParam
      .split("-")
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
  }, [roleParam]);

  if (!role) {
    return (
      <div className="min-h-screen bg-background mt-20 w-screen">
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
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Start Interview
              </h1>
              <p className="text-muted-foreground text-md md:text-lg font-medium">
                Select a role to begin your mock interview.
              </p>
            </div>
          </header>

          <Separator className="mb-8" />

          <div className="flex justify-self-center w-full">
            <JoinMeeting />
          </div>
        </div>
      </div>
    );
  }

  if (!interviewConfig) {
    return (
      <div className="w-full max-w-[calc(100%-2.5rem)] md:max-w-7xl mx-auto">
        <InterviewSetup role={role} onStart={setInterviewConfig} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[calc(100%-2.5rem)] md:max-w-7xl mx-auto flex flex-col items-center">
      <StreamVideoCallRender
        config={interviewConfig}
        userId={userId}
        userName={userName}
        userToken={userToken}
      />
    </div>
  );
}
