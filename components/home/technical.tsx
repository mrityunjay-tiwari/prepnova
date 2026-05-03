"use client";
import React, { useRef } from "react";
import {User, Database} from "lucide-react";
import {Highlighter} from "../ui/highlighter";
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
  WritingPadForFrontendExperience,
} from "./workflow-node";
import InvoiceNode from "./invoice-node";
import {RiNextjsFill} from "react-icons/ri";
import {IoShieldHalfSharp} from "react-icons/io5";
import AgentAvatar from "../ui/agent-avatar";
import {BiShield} from "react-icons/bi";
import {TbShieldCheck} from "react-icons/tb";
import {FaCode} from "react-icons/fa6";
import {BsDatabase} from "react-icons/bs";
import { AiOutlineDeliveredProcedure } from "react-icons/ai";

import {AnimatedBeam} from "../ui/animated-beam";

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
      <h1 className="text-md text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
        This product is designed as a Real-Time Interview System, where each
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

      {/* Placeholder container for the system design diagram */}
      <div 
        ref={containerRef}
        className="relative w-full min-h-auto flex flex-col items-start justify-around border border-slate-100 rounded-xl bg-slate-50/50 p-8 gap-8 overflow-hidden"
      >
        <div className="flex items-start justify-around w-full relative z-10">
          <div ref={userRef}><UserNode /></div>
          {/* <SystemNodePopover /> */}
          <div className="flex items-start">
            <div className="flex flex-col items-center justify-center gap-24">
              <div className="flex gap-10">
                <div ref={frontendRef}><FrontendExperience /></div>
              </div>
              <div className="flex gap-18 items-start">
                <div ref={localRef}><LocalPresence /></div>
                <div ref={voiceRef}><VoiceSessionLayer /></div>
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
        <div className="flex justify-around w-full mt-10 items-start relative z-10">
          <div ref={progressRef}><ProgressMemory /></div>
          <div ref={reportRef}><FinalReportGeneration /></div>
          <div className="flex flex-col items-center gap-5">
            <div ref={engineRef}><InterviewStateEngine /></div>
          </div>
        </div>
        <div className="flex justify-end w-full mt-10 -ml-48 relative z-10">
          <div ref={liveRef}><LiveEvalutationPipeline /></div>
        </div>

        {/* Animated Connections */}
        <AnimatedBeam containerRef={containerRef} fromRef={userRef} toRef={frontendRef} duration={3} pathType="straight-horizontal" startAnchor="top" endAnchor="top" startYOffset={68} />
        <AnimatedBeam containerRef={containerRef} fromRef={frontendRef} toRef={dbRef} duration={3} pathOpacity={0.2} pathColor="rgba(0,0,0,0.2)" gradientStartColor="rgba(0,0,0,0)" gradientStopColor="rgba(0,0,0,0.4)" />
        <AnimatedBeam containerRef={containerRef} fromRef={frontendRef} toRef={localRef} duration={3} />
        <AnimatedBeam containerRef={containerRef} fromRef={frontendRef} toRef={voiceRef} duration={3} />
        <AnimatedBeam containerRef={containerRef} fromRef={localRef} toRef={reportRef} duration={4} />
        <AnimatedBeam containerRef={containerRef} fromRef={voiceRef} toRef={engineRef} duration={3} />
        <AnimatedBeam containerRef={containerRef} fromRef={engineRef} toRef={reportRef} duration={3} />
        <AnimatedBeam containerRef={containerRef} fromRef={reportRef} toRef={liveRef} duration={4} reverse />
        <AnimatedBeam containerRef={containerRef} fromRef={liveRef} toRef={progressRef} duration={4} />
        <AnimatedBeam containerRef={containerRef} fromRef={progressRef} toRef={frontendRef} duration={5} pathType="l-shape-up-right" />
      </div>
    </div>
  );
}

const UserNode = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(196,196,196,1)] from-zinc-100 to-zinc-200 text-zinc-600 text-xs rounded-full w-10 h-10 flex items-center justify-center mb-2">
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
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(196,196,196,1)] from-zinc-100 to-zinc-200 text-zinc-600 text-xs rounded-full w-10 h-10 flex items-center justify-center mb-2">
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
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(196,196,196,1)] from-zinc-100 to-zinc-200 text-zinc-600 text-xs rounded-full w-10 h-10 flex items-center justify-center mb-2 relative z-10">
        <h1>
          <TbShieldCheck className="size-8" />
        </h1>
      </div>

      {/* Use absolute positioning so this doesn't push down the workflow list */}
      <div className="absolute left-52 top-8 z-20">
        <SystemNodePopover />
      </div>

      <WorkflowForLocalPresence />
    </div>
  );
};

const VoiceSessionLayer = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(196,196,196,1)] from-zinc-100 to-zinc-200 text-zinc-600 text-xs rounded-full w-10 h-10 flex items-center justify-center mb-2">
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
        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-1.5 pr-3 flex items-center gap-2 mb-2 w-max">
        <div className="w-8 h-8 bg-[#ffecff] rounded-md flex items-center justify-center shrink-0">
          <AiOutlineDeliveredProcedure className="w-4 h-4 text-[#d406ae]" strokeWidth={2} />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="text-sm font-medium text-slate-800">
            Live Evaluation
          </span>
          <span className="text-xs text-slate-500 font-medium">Pipeline</span>
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
       <div className="absolute left-52 top-18 z-20">
        <SystemNodePopover />
      </div>

      <WorkflowForFinalReport />
    </div>
  );
};

const InterviewStateEngine = () => {
  return (
    <div className="flex flex-col items-center relative">
      <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-1.5 pr-3 flex items-center gap-2 mb-2 w-max">
        <div className="w-8 h-8 bg-[#ecfeff] rounded-md flex items-center justify-center shrink-0">
          <FaCode className="w-4 h-4 text-[#06b6d4]" strokeWidth={2} />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="text-sm font-medium text-slate-800">
            Interview State
          </span>
          <span className="text-xs text-slate-500 font-medium">Engine</span>
        </div>
      </div>
      <div className="absolute -left-4 top-10 z-20">
        <SystemNodePopover />
      </div>
      <WorkflowForInterviewstateengine />
    </div>
  );
};

const ProgressMemory = () => {
  return (
    <div className="flex flex-col items-center relative">
      <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-1.5 pr-3 flex items-center gap-2 mb-2 w-max">
        <div className="w-8 h-8 bg-[#edffec] rounded-md flex items-center justify-center shrink-0">
          <BsDatabase className="w-4 h-4 text-[#109f42]" strokeWidth={0.2} />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="text-sm font-medium text-slate-800">
            Progress Report
          </span>
          <span className="text-xs text-slate-500 font-medium">Memory</span>
        </div>
      </div>

      {/* Use absolute positioning so this doesn't push down the workflow list */}
      <div className="absolute left-52 top-8 z-20">
        <SystemNodePopover />
      </div>

      <WorkflowForProgressReport />
    </div>
  );
};
