"use client";

import {useEffect, useState} from "react";
import {CallingState} from "@stream-io/video-react-sdk";
import type {MidFeedback} from "@/utils/types";

export function useLiveFeedback({
  callId,
  callingState,
}: {
  callId: string | null;
  callingState: CallingState;
}) {
  const [midFeedback, setMidFeedback] = useState<MidFeedback | null>(null);

  useEffect(() => {
    if (!callId) return;
    if (callingState !== CallingState.JOINED) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://mrityunjay18-ai-interview-agent.hf.space/latest-feedback/${callId}?t=${Date.now()}`,
          {
            cache: "no-store",
            headers: {
              Pragma: "no-cache",
              "Cache-Control": "no-cache",
            },
          },
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data?.feedback) {
          setMidFeedback(data.feedback);
        }
      } catch (error) {
        console.error("Feedback polling error:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [callId, callingState]);

  return midFeedback;
}
