"use client";

import React, { ReactNode } from "react";
import { CheckCircle2, GitBranch, Triangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type SubStatus = {
  icon: ReactNode;
  text: ReactNode | string;
  time?: string;
};

type WorkflowNodeProps = {
  mainStatus: {
    icon?: ReactNode;
    text: string;
  };
  subStatuses?: SubStatus[];
}

export function WorkflowNode({ mainStatus, subStatuses }: WorkflowNodeProps) {
  return (
    <div className="w-fit min-w-[100px] max-w-[230px]">
      {/* Main Card */}
      <div className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center gap-3 relative z-10">
        {mainStatus.icon}
        <span className="font-medium text-slate-900 text-sm">
          {mainStatus.text}
        </span>
      </div>

      {/* Sub Cards */}
      {subStatuses && subStatuses.length > 0 && (
        <div className="mt-3 flex flex-col space-y-3">
          {subStatuses.map((status, index) => {
            const isLast = index === subStatuses.length - 1;
            return (
              <div key={index} className="relative pl-10">
                {/* Curve for this item */}
                <div className="absolute top-0 left-[23px] w-[17px] h-1/2 border-l border-b border-dashed border-slate-300 rounded-bl-[16px]" />

                {/* Vertical line connecting to next item */}
                {!isLast && (
                  <div className="absolute top-1/2 left-[23px] w-px h-[calc(100%+12px)] border-l border-dashed border-slate-300" />
                )}

                {/* Vertical line connecting first item to main card */}
                {index === 0 && (
                  <div className="absolute top-[-12px] left-[23px] w-px h-[12px] border-l border-dashed border-slate-300" />
                )}

                {/* Card */}
                <div className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3 relative z-10">
                  {status.icon}
                  <span className="text-slate-600 text-xs">
                    {status.text}
                  </span>
                  {status.time && (
                    <span className="text-slate-400 text-[13.5px] ml-1">
                      {status.time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function WorkflowForUser() {
  return (
    <WorkflowNode
      mainStatus={{
        icon: <CheckCircle2 className="text-[#059669] w-3 h-3" />,
        text: "Starts Interview Practise",
      }}
      subStatuses={[
        {
          icon: <Triangle className="w-3 h-3 shrink-0" />,
          text: "Choses Role and Seniority",
        },
        {
          icon: <GitBranch className="w-3 h-3 shrink-0" />,
          text: "Decides Interview Flow",
        }
      ]}
    />
  );
}

export function WorkflowForFrontendExperience() {
  return (
    <WorkflowNode
      mainStatus={{
        icon: <CheckCircle2 className="text-[#059669] w-3 h-3" />,
        text: "Frontend Experience",
      }}
    />
  );
}

export function WorkflowForLocalPresence() {
  return (
    <WorkflowNode
      mainStatus={{
        icon: <CheckCircle2 className="text-[#059669] w-3 h-3" />,
        text: "Local Presence Analysis",
      }}
      subStatuses={[
        {
          icon: <Triangle className="w-3 h-3 shrink-0" />,
          text: "Pure Client Side posture and pose tracking.",
        }
      ]}
    />
  );
}

export function WorkflowForProgressReport() {
  return (
    <WorkflowNode
      mainStatus={{
        icon: <CheckCircle2 className="text-[#059669] w-3 h-3" />,
        text: "Progress Report",
      }}
      subStatuses={[
        {
          icon: <Triangle className="w-3 h-3 shrink-0" />,
          text: "Persistent Report tracking progress over time.",
        }
      ]}
    />
  );
}


export function WorkflowForVoiceSession() {
  return (
    <WorkflowNode
      mainStatus={{
        icon: <CheckCircle2 className="text-[#059669] w-3 h-3" />,
        text: "Voice Session Layer",
      }}
      subStatuses={[
        {
          icon: <Triangle className="w-3 h-3 shrink-0" />,
          text: "Real-time conversation layer.",
        },
        {
          icon: <Triangle className="w-3 h-3 shrink-0" />,
          text: "Handles call session, speech flow, and turn coordination.",
        },
      ]}
    />
  );
}

export function WorkflowForLiveEvaluationReport() {
  return (
    <WorkflowNode
      mainStatus={{
        icon: <CheckCircle2 className="text-[#059669] w-3 h-3" />,
        text: "Per-answer feedback generation",
      }}
      subStatuses={[
        {
          icon: <Triangle className="w-3 h-3 shrink-0" />,
          text: "Evaluates answers during the session and gives scores & feedbacks.",
        }
      ]}
    />
  );
}

export function WorkflowForFinalReport() {
  return (
    <WorkflowNode
      mainStatus={{
        icon: <CheckCircle2 className="text-[#059669] w-3 h-3" />,
        text: "Final Report Generation",
      }}
      subStatuses={[
        {
          icon: <Triangle className="w-3 h-3 shrink-0" />,
          text: "Structured final performance analysis.",
        }
      ]}
    />
  );
}

export function WorkflowForInterviewstateengine() {
  return (
    <WorkflowNode
      mainStatus={{
        icon: <CheckCircle2 className="text-[#059669] w-3 h-3" />,
        text: "Backend Orchestration",
      }}
      subStatuses={[
        {
          icon: <Triangle className="w-3 h-3 shrink-0" />,
          text: "Controls section timing,",
        },
        {
          icon: <Triangle className="w-3 h-3 shrink-0" />,
          text: "Adapts difficulty based on performance",
        },
        // {
        //   icon: <Triangle className="w-3 h-3 shrink-0" />,
        //   text: "Manages structured questions and real-time adjustments",
        // },
        // {
        //   icon: <Triangle className="w-3 h-3 shrink-0" />,
        //   text: "Drives the overall interview flow, section progression, and questioning logic",
        // },
        // {
        //   icon: <Triangle className="w-3 h-3 shrink-0" />,
        //   text: "Manages structured questions and real-time adjustments",
        // },
      ]}
    />
  );
}


export type TableItem = {
  name: string;
  isPrimary?: boolean;
};

export type DatabaseTableNodeProps = {
  title: string;
  items: (TableItem | string)[];
};

export function DatabaseTableNode({ title, items }: DatabaseTableNodeProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] w-fit min-w-[160px] max-w-[210px] font-sans flex flex-col relative z-10">
      {/* Title */}
      <div className="py-1 border-b border-slate-100 flex items-center justify-center">
        <span className="font-medium text-slate-900 text-sm">{title}</span>
      </div>
      
      {/* List */}
      <div className="p-2 flex flex-col gap-1.5">
        {items.map((item, index) => {
          const name = typeof item === 'string' ? item : item.name;
          const isPrimary = typeof item === 'string' ? index === 0 : item.isPrimary;
          return (
            <div key={index} className="flex items-start gap-1.5">
              <div className={`w-2 h-2 shrink-0 rounded-full mt-1 ${isPrimary ? 'bg-[#06b6d4]' : 'bg-[#a5f3fc]'}`} />
              <span className="text-slate-600 text-xs break-words">{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WritingPadForFrontendExperience() {
  return (
    <div className="relative">
      <DatabaseTableNode 
        title="users" 
        items={[
          { name: "id", isPrimary: true },
          { name: "name", isPrimary: false },
          { name: "email", isPrimary: false }
        ]} 
      />
    </div>
  );
}