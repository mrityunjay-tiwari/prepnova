"use client";

import {useMemo, useState} from "react";
import {useSearchParams} from "next/navigation";
import StreamVideoCallRender from "../stream/streamVideoRender";
import InterviewSetup from "./interview-setup";
import type {InterviewSetupConfig} from "@/utils/types";

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

  if (!role) return <div>No role selected</div>;

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
