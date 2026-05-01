"use client";

import {useEffect, useState} from "react";
import {CallingState} from "@stream-io/video-react-sdk";
import type {InterviewSessionStatus} from "@/utils/types";
import {buildInterviewApiUrl} from "@/utils/interview-api";

const STATUS_POLL_INTERVAL_MS = 5000;

export function useInterviewSectionStatus({
  callId,
  callingState,
}: {
  callId: string | null;
  callingState: CallingState;
}) {
  const [status, setStatus] = useState<InterviewSessionStatus | null>(null);
  const isActive = Boolean(callId && callingState === CallingState.JOINED);

  useEffect(() => {
    if (!isActive || !callId) {
      return;
    }

    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          buildInterviewApiUrl(`/session-status/${callId}`),
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as InterviewSessionStatus;

        if (!cancelled) {
          setStatus(data);
        }
      } catch (error) {
        console.error("Failed to fetch interview session status", error);
      }
    };

    fetchStatus();
    const interval = window.setInterval(fetchStatus, STATUS_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [callId, isActive]);

  return isActive ? status : null;
}
