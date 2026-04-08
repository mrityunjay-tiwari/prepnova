"use client";

import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  type User,
} from "@stream-io/video-react-sdk";
import {
  ParticipantView,
  type StreamVideoParticipant,
} from "@stream-io/video-react-sdk";
import {useEffect, useRef, useState} from "react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {usePose} from "@/hooks/usePose";
import {InterviewReportSchema} from "@/app/api/structured-data/schema";
import {experimental_useObject as useObject} from "@ai-sdk/react";
import {useRouter} from "next/navigation";
import {Spinner} from "@/components/ui/spinner";
import {motion} from "motion/react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

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

  // Step 1: Create session
  useEffect(() => {
    const createSession = async () => {
      const res = await fetch("https://mrityunjay18-ai-interview-agent.hf.space/create-session", {
        method: "POST",
      });

      const data = await res.json();
      setDynamicCallId(data.call_id);
    };

    createSession();
  }, []);

  // Step 2: Join Stream (only transport logic here)
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

      await streamCall.camera.enable();
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
        <MyUILayout
          callId={dynamicCallId}
          role={role}
          userId={userId}
          userToken={userToken}
        />
      </StreamCall>
    </StreamVideo>
  );
}

const MyUILayout = ({
  callId,
  role,
  userId,
  userToken,
}: {
  callId: string | null;
  role: string;
  userId: string;
  userToken: string;
}) => {
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();
  const finalUserId = userId;
  const [midFeedback, setMidFeedback] = useState<MidFeedback | null>(null);
  const agentStarted = useRef(false);
  const isFinalizing = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const postureHistory = useRef<number[]>([]);
  const {canvasRef, postureScore, nudgeMessage} = usePose(videoRef);
  const router = useRouter();
  const {submit} = useObject({
    api: "/api/structured-data",
    schema: InterviewReportSchema,
    onFinish: async ({object: finalObject}) => {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("[AI REPORT GENERATED]");
      console.log(finalObject);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(
        "[FE] AI Report generation finished. Object state:",
        finalObject ? "Valid" : "Empty",
      );
      if (!finalObject) {
        console.warn("[FE] No report object received from AI SDK");
        console.log(
          "[FE] AI Report generation failed or returned empty object. Not saving report.",
        );
        isFinalizing.current = false; // Reset finalizing state if report generation fails
        router.push("/dashboard"); // Redirect even if report generation fails
        return;
      }

      try {
        if (!finalUserId || finalUserId === "Quilted_Check") {
          console.error(
            "[FE] Save blocked: User ID is invalid or missing. Are you logged in?",
            {finalUserId},
          );
        }

        const scores = postureHistory.current;
        console.log(`Processing ${scores.length} posture data points...`);

        const min = scores.length > 0 ? Math.min(...scores) : 0;
        const max = scores.length > 0 ? Math.max(...scores) : 0;
        const avg =
          scores.length > 0
            ? scores.reduce((sum, s) => sum + s, 0) / scores.length
            : 0;

        console.log("[FE] Sending final report to /api/save-report...");
        console.log("FE] Final Payload:", {
          report: finalObject,
          userId: finalUserId,
          role,
          postureStats: {min, max, avg},
        });

        const res = await fetch("/api/save-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            report: finalObject,
            userId: finalUserId,
            role,
            postureStats: {min, max, avg},
          }),
        });

        if (res.ok) {
          console.log(
            "Report saved successfully. Redirecting to dashboard...",
          );
          router.push("/dashboard");
        } else {
          console.error("Failed to save report:", await res.text());
        }
      } catch (error) {
        console.error("Save flow failed:", error);
      }
    },
  });

  // Step 3: Start agent ONLY when fully joined
  useEffect(() => {
    if (!callId) return;
    if (callingState !== CallingState.JOINED) return;
    if (agentStarted.current) return;

    agentStarted.current = true;

    const startAgentWithDelay = async () => {
      await new Promise((res) => setTimeout(res, 1000));

      await fetch("https://mrityunjay18-ai-interview-agent.hf.space/start-agent", {
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

  // Step 4: Poll feedback
  useEffect(() => {
    if (!callId) return;
    if (callingState !== CallingState.JOINED) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://mrityunjay18-ai-interview-agent.hf.space/latest-feedback/${callId}`,
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data?.feedback) {
          setMidFeedback(data.feedback);
        }
      } catch (err) {
        console.error("Feedback polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [callId, callingState]);

  // ✅ Step 5: Collect posture stats every 5 seconds
  const currentPoseScoreRef = useRef(postureScore);
  useEffect(() => {
    currentPoseScoreRef.current = postureScore;
  }, [postureScore]);

  useEffect(() => {
    if (callingState !== CallingState.JOINED) return;

    const interval = setInterval(() => {
      const score = currentPoseScoreRef.current;
      postureHistory.current.push(score);
      console.log(
        `⏱️ Posture Sample: ${score.toFixed(2)} (History size: ${postureHistory.current.length})`,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [callingState]);

  // Step 6: Fetch segments and trigger report generation when call ends
  useEffect(() => {
    if (!callId) return;
    if (callingState === CallingState.LEFT) {
      if (isFinalizing.current) return;
      isFinalizing.current = true;

      console.log("User left the call. Starting finalization flow...");

      // Tell the backend to stop the AI Agent loop gracefully
      fetch("https://mrityunjay18-ai-interview-agent.hf.space/end-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ call_id: callId }),
      }).catch((err) => console.error("Failed to stop agent:", err));

      const generateReport = async () => {
        try {
          console.log(`📡 Fetching segments for call: ${callId}...`);
          const res = await fetch(`https://mrityunjay18-ai-interview-agent.hf.space/segments/${callId}`);

          if (!res.ok) {
            console.error(
              "Failed to fetch segments from backend:",
              res.status,
            );
            router.push("/dashboard");
            return;
          }

          const data = await res.json();
          console.log("Full Interview Segments retrieved:", data.segments);

          if (!data?.segments?.length) {
            console.warn(
              "No segments found for this interview. Redirecting...",
            );
            router.push("/dashboard");
            return;
          }

          console.log(
            "Triggering AI report generation with Vercel AI SDK...",
          );
          submit({
            questions: data.segments,
          });
        } catch (err) {
          console.error("Finalization error:", err);
          router.push("/dashboard");
        }
      };

      generateReport();
    }
  }, [callingState, callId, router, submit]);

  // console.log("The final object after processing : ",{object})
  // Attach video reference
  useEffect(() => {
    const interval = setInterval(() => {
      const video = document.querySelector("video") as HTMLVideoElement | null;
      if (video && video.readyState >= 2) {
        videoRef.current = video;
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

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
          <CallControls />
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

              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full h-auto"
              />

              <div className="mt-3 text-sm font-medium">
                Score: {postureScore} —{" "}
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
