"use client";

import {useEffect, useRef} from "react";
import {CallingState} from "@stream-io/video-react-sdk";
import {buildInterviewApiUrl} from "@/utils/interview-api";

export function useInterviewAgent({
  callId,
  role,
  callingState,
}: {
  callId: string | null;
  role: string;
  callingState: CallingState;
}) {
  const agentStarted = useRef(false);

  useEffect(() => {
    if (!callId) return;
    if (callingState !== CallingState.JOINED) return;
    if (agentStarted.current) return;

    agentStarted.current = true;

    const startAgentWithDelay = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await fetch(buildInterviewApiUrl("/start-agent"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          role,
          call_id: callId,
        }),
      });
    };

    startAgentWithDelay();
  }, [callingState, callId, role]);
}
