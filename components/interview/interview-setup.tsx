"use client";

import {useMemo, useState} from "react";
import {BriefcaseBusiness, Clock3, Plus, Sparkles, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildDefaultInterviewSetup,
  createFlowSection,
  getSectionLabel,
  INTERVIEW_SECTION_OPTIONS,
  INTERVIEW_SENIORITY_OPTIONS,
} from "@/utils/interview-config";
import type {
  InterviewFlowSection,
  InterviewSectionType,
  InterviewSeniority,
  InterviewSetupConfig,
} from "@/utils/types";

export default function InterviewSetup({
  role,
  onStart,
}: {
  role: string;
  onStart: (config: InterviewSetupConfig) => void;
}) {
  const [config, setConfig] = useState<InterviewSetupConfig>(() =>
    buildDefaultInterviewSetup(role),
  );

  const totalDuration = useMemo(
    () =>
      config.flow.reduce(
        (total, section) => total + section.durationMinutes,
        0,
      ),
    [config.flow],
  );

  const updateSection = (
    sectionId: string,
    updater: (section: InterviewFlowSection) => InterviewFlowSection,
  ) => {
    setConfig((current) => ({
      ...current,
      flow: current.flow.map((section) =>
        section.id === sectionId ? updater(section) : section,
      ),
    }));
  };

  const addSection = (type: InterviewSectionType) => {
    setConfig((current) => ({
      ...current,
      flow: [...current.flow, createFlowSection(type)],
    }));
  };

  const removeSection = (sectionId: string) => {
    setConfig((current) => ({
      ...current,
      flow: current.flow.filter((section) => section.id !== sectionId),
    }));
  };

  return (
    <div className="w-full px-4 py-8 md:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-900/55">
            Interview Setup
          </p>
          <h1 className="text-3xl font-bold text-blue-950">
            Configure the interview before the call starts
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            Phase 1 uses a backend-owned section engine. You choose the flow and
            target level here, then the backend controls section timing and
            transitions during the session.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <Card className="border-blue-950/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-blue-950">
                <BriefcaseBusiness className="h-5 w-5 text-blue-900" />
                Interview Plan
              </CardTitle>
              <CardDescription>
                Role is preselected. Configure the target level and interview
                sections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Role</p>
                  <div className="rounded-xl border border-blue-950/10 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
                    {config.role}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Preparing for
                  </p>
                  <Select
                    value={config.seniority}
                    onValueChange={(value) =>
                      setConfig((current) => ({
                        ...current,
                        seniority: value as InterviewSeniority,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_SENIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Interview flow
                    </p>
                    <p className="text-sm text-slate-500">
                      Each section defines the backend timing and transition
                      guardrails.
                    </p>
                  </div>
                  <Select onValueChange={(value) => addSection(value as InterviewSectionType)}>
                    <SelectTrigger className="w-[220px] rounded-xl">
                      <SelectValue placeholder="Add section" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_SECTION_OPTIONS.map((option) => (
                        <SelectItem key={option.type} value={option.type}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {config.flow.map((section, index) => {
                    const template = INTERVIEW_SECTION_OPTIONS.find(
                      (option) => option.type === section.type,
                    );

                    return (
                      <div
                        key={section.id}
                        className="rounded-2xl border border-blue-950/10 bg-slate-50/80 p-4"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              Section {index + 1}: {getSectionLabel(section.type)}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {template?.description}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-full text-slate-500"
                            onClick={() => removeSection(section.id)}
                            disabled={config.flow.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr]">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Section type
                            </p>
                            <Select
                              value={section.type}
                              onValueChange={(value) =>
                                updateSection(section.id, () => {
                                  const next = createFlowSection(
                                    value as InterviewSectionType,
                                  );
                                  return {
                                    ...next,
                                    id: section.id,
                                  };
                                })
                              }
                            >
                              <SelectTrigger className="w-full rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {INTERVIEW_SECTION_OPTIONS.map((option) => (
                                  <SelectItem key={option.type} value={option.type}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Minutes
                            </p>
                            <Input
                              type="number"
                              min={5}
                              max={45}
                              value={section.durationMinutes}
                              onChange={(event) =>
                                updateSection(section.id, (current) => ({
                                  ...current,
                                  durationMinutes: Number(event.target.value || 0),
                                }))
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Min Qs
                            </p>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={section.minQuestions}
                              onChange={(event) =>
                                updateSection(section.id, (current) => ({
                                  ...current,
                                  minQuestions: Number(event.target.value || 0),
                                }))
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Max Qs
                            </p>
                            <Input
                              type="number"
                              min={1}
                              max={30}
                              value={section.maxQuestions}
                              onChange={(event) =>
                                updateSection(section.id, (current) => ({
                                  ...current,
                                  maxQuestions: Number(event.target.value || 0),
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-950/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-blue-950">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Session Summary
              </CardTitle>
              <CardDescription>
                This is the configuration that will be sent to the backend
                section engine.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-blue-950/10 bg-slate-50/90 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  {config.seniority} · {config.role}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <Clock3 className="h-4 w-4 text-blue-900/70" />
                  Total planned time: {totalDuration} minutes
                </div>
              </div>

              <div className="space-y-3">
                {config.flow.map((section) => (
                  <div
                    key={section.id}
                    className="rounded-xl border border-blue-950/10 bg-white/80 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {getSectionLabel(section.type)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {section.durationMinutes} min
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Guardrails: {section.minQuestions} to {section.maxQuestions}{" "}
                      completed question cycles
                    </p>
                  </div>
                ))}
              </div>

              <Button
                className="mt-2 h-11 w-full rounded-xl"
                onClick={() => onStart(config)}
              >
                <Plus className="h-4 w-4" />
                Start Interview
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
