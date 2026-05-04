"use client";
import React, {useRef} from "react";
import {User} from "lucide-react";
import Headings from "./headings";
import SystemNodePopover from "./system-node-popover";
import {
  DatabaseTableNode,
  WorkflowForFinalReport,
  WorkflowForFrontendExperience,
  WorkflowForInterviewstateengine,
  WorkflowForLiveEvaluationReport,
  WorkflowForLocalPresence,
  WorkflowForProgressReport,
  WorkflowForUser,
  WorkflowForVoiceSession,
} from "./workflow-node";
import InvoiceNode from "./invoice-node";
import {RiNextjsFill} from "react-icons/ri";
import AgentAvatar from "../ui/agent-avatar";
import {TbShieldCheck} from "react-icons/tb";
import {FaCode} from "react-icons/fa6";
import {BsDatabase} from "react-icons/bs";
import {AiOutlineDeliveredProcedure} from "react-icons/ai";
import {AnimatedBeam} from "../ui/animated-beam";
import Image from "next/image";

export default function Technical() {
  const containerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const frontendRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLDivElement>(null);
  const voiceRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const dbRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full md:max-w-5xl mx-auto mb-24">
      <Headings
        subtitle="For Engineers : System Design"
        title="How The System Thinks"
      />

      <h1 className="text-xs text-right text-muted-foreground mt-5 mb-1 flex gap-1 justify-end items-center max-w-5xl mx-auto">
        *Click on{" "}
        <div className="w-5 h-5 bg-[#6366f1] rounded-t-full rounded-br-full rounded-bl-sm flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform">
          <Image
            src="https://ik.imagekit.io/mrityunjay/prepnova/screen-image?updatedAt=1777738073915"
            alt="Avatar"
            width={10}
            height={10}
            className="rounded-full object-cover w-4 h-4 border-[2px] border-[#6366f1]"
          />
        </div>{" "}
        to know more !
      </h1>
      {/* Placeholder container for the system design diagram */}
      <div
        ref={containerRef}
        className="relative w-full min-h-auto flex flex-col items-start justify-around border border-slate-100 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50 p-8 gap-8"
      >
        <div className="flex items-start justify-around w-full relative">
          <div ref={userRef}>
            <UserNode />
          </div>
          {/* <SystemNodePopover /> */}
          <div className="flex items-start">
            <div className="flex flex-col items-center justify-center gap-24">
              <div className="flex gap-10">
                <div ref={frontendRef}>
                  <FrontendExperience />
                </div>
              </div>
              <div className="flex gap-18 items-start">
                <div ref={localRef}>
                  <LocalPresence />
                </div>
                <div ref={voiceRef}>
                  <VoiceSessionLayer />
                </div>
              </div>
            </div>
            <div className="-ml-24" ref={dbRef}>
              <DatabaseTableNode
                title="users"
                items={[
                  {name: "id", isPrimary: true},
                  {name: "name", isPrimary: false},
                  {name: "email", isPrimary: false},
                ]}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-around w-full mt-10 items-start relative">
          <div ref={progressRef}>
            <ProgressMemory />
          </div>
          <div ref={reportRef}>
            <FinalReportGeneration />
          </div>
          <div className="flex flex-col items-center gap-5">
            <div ref={engineRef}>
              <InterviewStateEngine />
            </div>
          </div>
        </div>
        <div className="flex justify-end w-full mt-10 -ml-48 relative">
          <div ref={liveRef}>
            <LiveEvalutationPipeline />
          </div>
        </div>

        {/* Animated Connections */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={userRef}
          toRef={frontendRef}
          duration={3}
          pathType="straight-horizontal"
          startAnchor="top"
          endAnchor="top"
          startYOffset={68}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={frontendRef}
          toRef={dbRef}
          duration={3}
          pathOpacity={0.2}
          pathColor="rgba(0,0,0,0.2)"
          gradientStartColor="rgba(0,0,0,0)"
          gradientStopColor="rgba(0,0,0,0.4)"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={frontendRef}
          toRef={localRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={frontendRef}
          toRef={voiceRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={localRef}
          toRef={reportRef}
          duration={4}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={voiceRef}
          toRef={engineRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={engineRef}
          toRef={reportRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={reportRef}
          toRef={liveRef}
          duration={4}
          reverse
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={liveRef}
          toRef={progressRef}
          duration={4}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={progressRef}
          toRef={frontendRef}
          duration={5}
          pathType="l-shape-up-right"
        />
      </div>
      <h1 className="text-xs text-left text-muted-foreground mt-5 max-w-5xl mx-auto">
        *This product is designed as a Real-Time Interview System, where each
        layer has a clear responsibility, from{" "}
        <span className="font-semibold">
          voice orchestration, adaptive questioning{" "}
        </span>
        to <span className="font-semibold">backend state control </span>
        for different considerations throughout the interview to{" "}
        <span className="font-semibold">
          evaluation, and long-term progress tracking.
        </span>
      </h1>
    </div>
  );
}

const UserNode = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(196,196,196,1)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-600 dark:text-zinc-300 text-xs rounded-full w-10 h-10 flex items-center justify-center mb-2">
        <h1>
          <User className="size-5" />
        </h1>
      </div>
      <WorkflowForUser />
    </div>
  );
};

const FrontendExperience = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(196,196,196,1)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-600 dark:text-zinc-300 text-xs rounded-full w-10 h-10 flex items-center justify-center mb-2">
        <h1>
          <RiNextjsFill className="size-12" />
        </h1>
      </div>
      <WorkflowForFrontendExperience />
    </div>
  );
};

const LocalPresence = () => {
  return (
    <div className="flex flex-col items-center relative">
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(196,196,196,1)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-600 dark:text-zinc-300 text-xs rounded-full w-10 h-10 flex items-center justify-center mb-2 relative z-10">
        <h1>
          <TbShieldCheck className="size-8" />
        </h1>
      </div>
      <div className="absolute left-52 top-8">
        <SystemNodePopover
          title="Why posture analysis runs locally?"
          description="Pose detection is computed in the browser instead of the backend. That avoids streaming raw posture video for analysis, reduces infrastructure cost, lowers latency, and keeps the backend focused on interview orchestration rather than frame-level vision processing."
          decision="Push vision inference to the client, store only summary posture signals."
        />
      </div>

      <WorkflowForLocalPresence />
    </div>
  );
};

const VoiceSessionLayer = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(196,196,196,1)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-600 dark:text-zinc-300 text-xs rounded-full w-10 h-10 flex items-center justify-center mb-2">
        <h1>
          <AgentAvatar size={38} seed="" />
        </h1>
      </div>
      <WorkflowForVoiceSession />
    </div>
  );
};

const LiveEvalutationPipeline = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm rounded-lg p-1.5 pr-3 flex items-center gap-2 mb-2 w-max">
        <div className="w-8 h-8 bg-[#ffecff] dark:bg-[#ffecff]/10 rounded-md flex items-center justify-center shrink-0">
          <AiOutlineDeliveredProcedure
            className="w-4 h-4 text-[#d406ae]"
            strokeWidth={2}
          />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="text-sm font-medium text-slate-800 dark:text-zinc-100">
            Live Evaluation
          </span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Pipeline
          </span>
        </div>
      </div>

      <WorkflowForLiveEvaluationReport />
    </div>
  );
};

const FinalReportGeneration = () => {
  return (
    <div className="flex flex-col items-center relative">
      <div className="rounded-xl text-xs flex items-center justify-center mb-2">
        <InvoiceNode />
      </div>
      <div className="absolute left-52 top-18">
        <SystemNodePopover
          title="Why final reports are aggregated instead of raw transcript-heavy & Why only transcript segments are mandatory"
          description="Live per-answer feedback is useful during the interview, but final reporting should stay trustworthy even when transcription is imperfect. The report therefore emphasizes structured summaries, scores, strengths, gaps, and action plans instead of raw question-answer dumps and Report generation depends on interview segments as the hard requirement. Additional context such as role metadata, section flow, and feedback history improves report quality, but is treated as optional so one weak dependency does not destroy the entire report pipeline."
          decision="Keep live feedback granular, keep final reports structured and reliable."
        />
      </div>

      <WorkflowForFinalReport />
    </div>
  );
};

const InterviewStateEngine = () => {
  return (
    <div className="flex flex-col items-center relative">
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm rounded-lg p-1.5 pr-3 flex items-center gap-2 mb-2 w-max">
        <div className="w-8 h-8 bg-[#ecfeff] dark:bg-[#ecfeff]/10 rounded-md flex items-center justify-center shrink-0">
          <FaCode className="w-4 h-4 text-[#06b6d4]" strokeWidth={2} />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="text-sm font-medium text-slate-800 dark:text-zinc-100">
            Interview State
          </span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Engine
          </span>
        </div>
      </div>
      <div className="absolute -left-4 top-10">
        <SystemNodePopover
          title="Why the backend owns interview flow?"
          description="Section timing, transitions, and adaptive probing are controlled in the backend so interview logic stays consistent across refreshes, reconnects, and client-side timing drift. The frontend renders state, but does not decide round progression."
          decision="Orchestration lives in the engine, not in the presentation layer."
        />
      </div>
      <WorkflowForInterviewstateengine />
    </div>
  );
};

const ProgressMemory = () => {
  return (
    <div className="flex flex-col items-center relative">
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm rounded-lg p-1.5 pr-3 flex items-center gap-2 mb-2 w-max">
        <div className="w-8 h-8 bg-[#edffec] dark:bg-[#edffec]/10 rounded-md flex items-center justify-center shrink-0">
          <BsDatabase className="w-4 h-4 text-[#109f42]" strokeWidth={0.2} />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="text-sm font-medium text-slate-800 dark:text-zinc-100">
            Progress Report
          </span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Memory
          </span>
        </div>
      </div>

      <div className="absolute left-52 top-8">
        <SystemNodePopover
          title="Why progress insights unlock gradually"
          description="A single interview is a snapshot, not a trend. The progress layer intentionally delays momentum and consistency insights until enough session history (for 3 interviews) exists, so the dashboard reflects meaningful improvement rather than misleading analytics."
          decision="Gate progress metrics by signal quality, not just data availability."
        />
      </div>

      <WorkflowForProgressReport />
    </div>
  );
};
