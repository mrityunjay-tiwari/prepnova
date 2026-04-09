"use client";

import {useSearchParams} from "next/navigation";
import StreamVideoCallRender from "../stream/streamVideoRender";

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
  const role = searchParams.get("role");

  if (!role) return <div>No role selected</div>;

  return (
    <div className="w-full max-w-[calc(100%-2.5rem)] md:max-w-7xl mx-auto flex flex-col items-center">
      <StreamVideoCallRender
        role={role ?? "react-developer"}
        userId={userId}
        userName={userName}
        userToken={userToken}
      />
    </div>
  );
}
