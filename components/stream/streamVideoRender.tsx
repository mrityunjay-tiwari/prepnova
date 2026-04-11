"use client";

import {
  CallingState,
  StreamCall,
  StreamTheme,
  StreamVideo,
  ParticipantView,
  type StreamVideoParticipant,
  useCallStateHooks,
  ToggleAudioPublishingButton,
  CancelCallButton,
} from "@stream-io/video-react-sdk";
import {motion} from "motion/react";
import {useInterviewSession} from "@/hooks/useInterviewSession";
import {useInterviewAgent} from "@/hooks/useInterviewAgent";
import {useLiveFeedback} from "@/hooks/useLiveFeedback";
import {useInterviewPosture} from "@/hooks/useInterviewPosture";
import {useInterviewFinalization} from "@/hooks/useInterviewFinalization";
import {Spinner} from "@/components/ui/spinner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {PanelLeft, Sparkles, ScanEye, UserRound, Bot} from "lucide-react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import AgentAvatar from "../ui/agent-avatar";

export default function StreamVideoCallRender({
  role,
  userId,
  userName,
  userToken,
}: {
  role: string;
  userId: string;
  userName: string;
  userToken: string;
}) {
  const {client, call, callId, isReady} = useInterviewSession({
    userId,
    userName,
    userToken,
  });

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
        <InterviewLayout
          callId={callId}
          role={role}
          userId={userId}
          userName={userName}
        />
      </StreamCall>
    </StreamVideo>
  );
}

const InterviewLayout = ({
  callId,
  role,
  userId,
  userName,
}: {
  callId: string | null;
  role: string;
  userId: string;
  userName: string;
}) => {
  const {useCallCallingState, useLocalParticipant, useRemoteParticipants} =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const coachParticipant = remoteParticipants[0];
  const midFeedback = useLiveFeedback({callId, callingState});
  const {
    videoRef,
    canvasRef,
    postureScore,
    nudgeMessage,
    hasCamera,
    getPostureStats,
  } = useInterviewPosture(callingState);

  useInterviewAgent({callId, role, callingState});
  useInterviewFinalization({
    callId,
    role,
    userId,
    callingState,
    getPostureStats,
  });

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
    <SidebarProvider defaultOpen>
      <div className="h-[calc(100vh-96px)] w-full overflow-hidden">
        <SidebarInset className="bg-transparent">
          <div className="flex h-full">
            <div className="flex min-w-0 flex-1 flex-col px-4 pb-4 pt-5 md:px-6">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-900/55">
                    Interview Stage
                  </p>
                  <h2 className="text-xl font-bold text-blue-950">
                    {role.replace(/-/g, " ")}
                  </h2>
                </div>
                <SidebarTrigger className="inline-flex rounded-full border border-blue-950/10 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-950 shadow-sm backdrop-blur">
                  <PanelLeft className="mr-2 h-4 w-4" />
                  Analysis
                </SidebarTrigger>
              </div>

              <StreamTheme className="mt-14 flex flex-1 flex-col bg-transparent">
                <div className="mx-auto grid h-full w-full flex-1 max-w-8xl auto-rows-fr grid-cols-1 gap-4 lg:grid-cols-2">
                  <InterviewStageTile
                    icon={UserRound}
                    label={userName || "You"}
                    participant={localParticipant}
                    accent="from-sky-500/30 via-cyan-500/15 to-transparent"
                  />
                  <InterviewStageTile
                    icon={Bot}
                    label="Interview Coach"
                    participant={coachParticipant}
                    accent="from-blue-950/40 via-blue-800/20 to-transparent"
                  />
                </div>

                <div className="mt-10 flex items-center justify-center gap-4 pb-2">
                  <ToggleAudioPublishingButton />
                  <CancelCallButton />
                </div>
              </StreamTheme>
            </div>

            <Sidebar
              side="right"
              variant="floating"
              collapsible="offcanvas"
              className="top-16 h-[calc(100vh-170px)] shadow-none"
            >
              <SidebarHeader className="gap-3 border-b border-sidebar-border/70 px-3 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sidebar-foreground/55">
                      Analysis
                    </p>
                    <h3 className="text-lg font-bold text-sidebar-foreground">
                      Interview Signals
                    </h3>
                  </div>
                </div>
              </SidebarHeader>

              <SidebarContent className="px-2 py-3">
                <SidebarGroup className="p-0">
                  <SidebarGroupLabel className="px-2 text-sidebar-foreground/65">
                    Live Guidance
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="px-1">
                    {midFeedback ? (
                      <div className="rounded-3xl border border-sidebar-border/70 bg-white/80 p-4 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            Live AI Feedback
                          </div>
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {midFeedback.score}/10
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600">
                          {midFeedback.short_feedback}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-sidebar-border/70 bg-white/55 p-4 text-sm text-slate-500">
                        Live feedback will appear here once the conversation is
                        underway.
                      </div>
                    )}
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="p-0 pt-4">
                  <SidebarGroupLabel className="px-2 text-sidebar-foreground/65">
                    Presence Tracking
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="px-1">
                    <div className="rounded-lg border border-sidebar-border/70 bg-white/85 p-3">
                      <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                        <ScanEye className="h-4 w-4 text-emerald-600" />
                        Posture & Presence
                      </div>

                      {hasCamera === false ? (
                        <div className="flex items-center justify-center w-full aspect-video rounded-md bg-gray-100 text-sm text-gray-500 font-medium border border-dashed border-gray-300">
                          Camera disabled
                        </div>
                      ) : (
                        <div className="relative mx-auto w-full max-w-[280px] aspect-video rounded-md overflow-hidden bg-gray-100">
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

                      <div className="mt-2 text-sm leading-relaxed font-medium text-slate-700">
                        Score: {postureScore} -{" "}
                        <span
                          className={
                            postureScore < 0.5
                              ? "text-red-500"
                              : "text-emerald-600"
                          }
                        >
                          {postureScore < 0.5 ? "Poor" : "Good"} {nudgeMessage}
                        </span>
                      </div>
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const InterviewStageTile = ({
  participant,
  label,
  icon: Icon,
  accent,
}: {
  participant?: StreamVideoParticipant;
  label: string;
  icon: typeof UserRound;
  accent: string;
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-blue-950/10 bg-blue-950 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.55)]">
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${accent}`}
      />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
      </div>

      <div className="relative h-full w-full">
        {participant ? (
          <ParticipantView
            participant={participant}
            className="h-full w-full"
            muteAudio={participant.isLocalParticipant}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-white/60">
            <div className="text-center">
              <AgentAvatar seed="Interviewer" size={80} />
              <p className="mt-2 text-neutral-500 text-sm dark:text-neutral-400">
                Interviewer
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
