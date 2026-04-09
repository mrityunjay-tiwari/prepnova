"use client";

import {useEffect, useRef} from "react";
import {CallingState} from "@stream-io/video-react-sdk";
import {useRouter} from "next/navigation";
import type {FinalizeInterviewRequest, PostureStats} from "@/utils/types";

const NETWORK_DISCONNECT_TIMEOUT_MS = 30_000;

export function useInterviewFinalization({
  callId,
  role,
  userId,
  callingState,
  getPostureStats,
}: {
  callId: string | null;
  role: string;
  userId: string;
  callingState: CallingState;
  getPostureStats: () => PostureStats;
}) {
  const isFinalizing = useRef(false);
  const hasRedirected = useRef(false);
  const offlineTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const buildFinalizePayload = (
    reason: FinalizeInterviewRequest["reason"],
  ): FinalizeInterviewRequest | null => {
    if (!callId || !userId || !role) {
      return null;
    }

    return {
      callId,
      userId,
      role,
      postureStats: getPostureStats(),
      reason,
    };
  };

  const finalizeInterview = async (
    reason: FinalizeInterviewRequest["reason"],
    options?: {redirectToDashboard?: boolean; useBeacon?: boolean},
  ) => {
    const payload = buildFinalizePayload(reason);

    if (!payload) {
      return;
    }

    if (options?.useBeacon) {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/finalize-interview",
          new Blob([JSON.stringify(payload)], {type: "application/json"}),
        );
      } else {
        fetch("/api/finalize-interview", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch((error) => {
          console.error(
            "Failed to finalize interview during page unload",
            error,
          );
        });
      }

      return;
    }

    if (isFinalizing.current) {
      return;
    }

    isFinalizing.current = true;

    try {
      const response = await fetch("/api/finalize-interview", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
    } catch (error) {
      isFinalizing.current = false;
      console.error("Interview finalization failed", error);
    } finally {
      if (options?.redirectToDashboard && !hasRedirected.current) {
        hasRedirected.current = true;
        router.push("/dashboard");
      }
    }
  };

  useEffect(() => {
    if (!callId) return;

    const handlePageHide = () => {
      finalizeInterview("page_hidden", {useBeacon: true});
    };

    const handleBeforeUnload = () => {
      finalizeInterview("tab_closed", {useBeacon: true});
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [callId, role, userId]);

  useEffect(() => {
    return () => {
      finalizeInterview("route_change", {useBeacon: true});
    };
  }, [callId, role, userId]);

  useEffect(() => {
    if (callingState !== CallingState.JOINED || !callId) {
      if (offlineTimeoutRef.current) {
        clearTimeout(offlineTimeoutRef.current);
        offlineTimeoutRef.current = null;
      }
      return;
    }

    const handleOffline = () => {
      if (offlineTimeoutRef.current) {
        clearTimeout(offlineTimeoutRef.current);
      }

      offlineTimeoutRef.current = setTimeout(() => {
        finalizeInterview("offline_timeout", {redirectToDashboard: true});
      }, NETWORK_DISCONNECT_TIMEOUT_MS);
    };

    const handleOnline = () => {
      if (offlineTimeoutRef.current) {
        clearTimeout(offlineTimeoutRef.current);
        offlineTimeoutRef.current = null;
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);

      if (offlineTimeoutRef.current) {
        clearTimeout(offlineTimeoutRef.current);
        offlineTimeoutRef.current = null;
      }
    };
  }, [callingState, callId, role, userId]);

  useEffect(() => {
    if (!callId) return;
    if (callingState === CallingState.LEFT) {
      finalizeInterview("call_left", {redirectToDashboard: true});
    }
  }, [callingState, callId, role, userId]);
}
