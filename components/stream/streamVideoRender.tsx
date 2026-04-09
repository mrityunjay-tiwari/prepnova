"use client";

import {
  Call,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  ToggleAudioPublishingButton,
  CancelCallButton,
  type User,
} from "@stream-io/video-react-sdk";
import {
  ParticipantView,
  type StreamVideoParticipant,
} from "@stream-io/video-react-sdk";
import {useEffect, useRef, useState} from "react";
import {usePose} from "@/hooks/usePose";
import {useRouter} from "next/navigation";
import {Spinner} from "@/components/ui/spinner";
import {motion} from "motion/react";
import type {FinalizeInterviewRequest, PostureStats} from "@/utils/types";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const NETWORK_DISCONNECT_TIMEOUT_MS = 30_000;

type MidFeedback = {
  short_feedback: string;
  score: number;
};

export default function StreamVideoCallRender({
  role,
  userId,
  userToken,
}: {
  role: string;
  userId: string;
  userToken: string;
}) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [dynamicCallId, setDynamicCallId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const hasJoined = useRef(false);

  useEffect(() => {
    const createSession = async () => {
      const res = await fetch(
        "https://mrityunjay18-ai-interview-agent.hf.space/create-session",
        {
          method: "POST",
        },
      );

      const data = await res.json();
      setDynamicCallId(data.call_id);
    };

    createSession();
  }, []);

  useEffect(() => {
    if (!dynamicCallId) return;
    if (hasJoined.current) return;

    hasJoined.current = true;

    const user: User = {
      id: userId,
      name: "Oliver",
      image: "https://getstream.io/random_svg/?id=oliver&name=Oliver",
    };

    const startCall = async () => {
      const streamClient = new StreamVideoClient({
        apiKey,
        user,
        token: userToken,
      });

      const streamCall = streamClient.call("default", dynamicCallId);

      setClient(streamClient);
      setCall(streamCall);

      await streamCall.join({create: true});

      try {
        await streamCall.camera.disable();
      } catch (error) {
        console.log("Camera already disabled", error);
      }

      await streamCall.microphone.enable();
      setIsReady(true);
    };

    startCall();
  }, [dynamicCallId, userId, userToken]);

  if (!client || !call || !isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full gap-4">
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          className="flex flex-col items-center gap-4"
        >
          <div className="p-3 border border-gray-300 rounded-2xl bg-muted/20">
            <div className="p-3 border border-gray-200 rounded-xl bg-background shadow-sm">
              <Spinner className="h-8 w-8 text-blue-950" />
            </div>
          </div>
          <p className="text-xl font-bold tracking-tight text-blue-950 animate-pulse">
            Configuring interview session...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <InterviewLayout callId={dynamicCallId} role={role} userId={userId} />
      </StreamCall>
    </StreamVideo>
  );
}

const InterviewLayout = ({
  callId,
  role,
  userId,
}: {
  callId: string | null;
  role: string;
  userId: string;
}) => {
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();
  const [midFeedback, setMidFeedback] = useState<MidFeedback | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const agentStarted = useRef(false);
  const isFinalizing = useRef(false);
  const hasRedirected = useRef(false);
  const offlineTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const postureHistory = useRef<number[]>([]);
  const {canvasRef, postureScore, nudgeMessage} = usePose(videoRef);
  const currentPoseScoreRef = useRef(postureScore);
  const router = useRouter();

  useEffect(() => {
    currentPoseScoreRef.current = postureScore;
  }, [postureScore]);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const attachLocalCamera = async () => {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({video: true});
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
        setHasCamera(true);
      } catch (error) {
        console.error("Failed to start local camera", error);
        setHasCamera(false);
      }
    };

    attachLocalCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getPostureStats = (): PostureStats => {
    const scores = postureHistory.current;

    if (scores.length === 0) {
      return {min: 0, max: 0, avg: 0};
    }

    return {
      min: Math.min(...scores),
      max: Math.max(...scores),
      avg: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    };
  };

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
    if (callingState !== CallingState.JOINED) return;
    if (agentStarted.current) return;

    agentStarted.current = true;

    const startAgentWithDelay = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await fetch(
        "https://mrityunjay18-ai-interview-agent.hf.space/start-agent",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            role,
            call_id: callId,
          }),
        },
      );
    };

    startAgentWithDelay();
  }, [callingState, callId, role]);

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

  useEffect(() => {
    if (callingState !== CallingState.JOINED) return;

    const interval = setInterval(() => {
      const score = currentPoseScoreRef.current;
      postureHistory.current.push(score);
      console.log(
        `Posture sample: ${score.toFixed(2)} (History size: ${postureHistory.current.length})`,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [callingState]);

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

  if (callingState === CallingState.LEFT) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-4">
        <Spinner className="h-6 w-6 text-blue-950" />
        <p className="text-sm font-bold text-blue-950 uppercase tracking-widest">
          Ending Call...
        </p>
      </div>
    );
  }

  if (
    callingState === CallingState.RECONNECTING ||
    callingState === CallingState.MIGRATING
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-4">
        <Spinner className="h-6 w-6 text-blue-950" />
        <p className="text-sm font-bold text-blue-950 uppercase tracking-widest">
          Reconnecting...
        </p>
      </div>
    );
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-4">
        <Spinner className="h-6 w-6 text-blue-950" />
        <p className="text-sm font-bold text-blue-950 uppercase tracking-widest">
          Joining Call...
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-100px)]">
      <div className="flex-1 relative">
        <StreamTheme>
          <SpeakerLayout participantsBarPosition="top" />
          <div className="str-video__call-controls">
            <ToggleAudioPublishingButton />
            <CancelCallButton />
          </div>
        </StreamTheme>
      </div>

      <div className="p-0.5 border-l border-gray-200 mt-16">
        <div className="w-[360px] border-l-2 border-gray-200 bg-white/70 backdrop-blur-xl p-6 flex flex-col gap-6">
          {midFeedback && (
            <div className="p-0.5 border bg-accent/50 border-gray-200 rounded-2xl">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-800">
                    Live AI Feedback
                  </p>
                  <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                    {midFeedback.score}/10
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {midFeedback.short_feedback}
                </p>
              </div>
            </div>
          )}

          <div className="p-0.5 border bg-accent/50 border-gray-200 rounded-2xl">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="font-semibold text-gray-800 mb-3">
                Posture & Presence
              </p>

              {hasCamera === false ? (
                <div className="flex items-center justify-center w-full aspect-video rounded-lg bg-gray-100 text-sm text-gray-500 font-medium border border-dashed border-gray-300">
                  Camera disabled
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                  />
                </div>
              )}

              <div className="mt-3 text-sm font-medium">
                Score: {postureScore} -{" "}
                <span
                  className={
                    postureScore < 0.5 ? "text-red-500" : "text-emerald-600"
                  }
                >
                  {postureScore < 0.5 ? "Poor" : "Good"} {nudgeMessage}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MyParticipantList = (props: {
  participants: StreamVideoParticipant[];
}) => {
  const {participants} = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        width: "100vw",
      }}
    >
      {participants.map((participant) => (
        <ParticipantView
          muteAudio
          participant={participant}
          key={participant.sessionId}
        />
      ))}
    </div>
  );
};

export const MyFloatingLocalParticipant = (props: {
  participant?: StreamVideoParticipant;
}) => {
  const {participant} = props;
  if (!participant) {
    return <p>Error: No local participant</p>;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "15px",
        left: "15px",
        width: "240px",
        height: "135px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 10px 3px",
        borderRadius: "12px",
      }}
    >
      {participant && <ParticipantView muteAudio participant={participant} />}
    </div>
  );
};
