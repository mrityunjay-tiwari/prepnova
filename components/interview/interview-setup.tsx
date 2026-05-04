"use client";

import {useMemo, useState} from "react";
import {Clock3, Plus, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import BasicDropdown from "@/components/ui/basic-dropdown";
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
import {FaCubesStacked} from "react-icons/fa6";
import {Separator} from "../ui/separator";
import {AnimatedThemeToggler} from "../ui/animated-theme-toggler";

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
    <div className="w-full px-0.5 py-8 md:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3.5">
        <div className="space-y-2 md:space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase flex items-center gap-1 text-blue-900/55 dark:text-blue-400/80">
              <FaCubesStacked className="w-2.5 h-2.5" />
              Interview Setup
            </p>
            <div className="md:hidden">
              <AnimatedThemeToggler />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2 md:gap-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-950 dark:text-zinc-50 leading-tight">
                Configure your interview flow before the call starts!
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 mt-2 md:mt-0">
                Select the target level you are preparing to let us decide the
                type of question to be asked! <br className="hidden md:block" /> And configure for how much
                time and what all sections to be discussed in your interview.
              </p>
            </div>
            <div className="hidden md:block">
              <AnimatedThemeToggler />
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <Card className="border-blue-950/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/50 dark:backdrop-blur-sm rounded-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-blue-950 dark:text-zinc-100">
                Interview Plan
              </CardTitle>
              <CardDescription>
                You selected Role in last page. Now Configure the target level
                and interview sections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Role
                  </p>
                  <div className="rounded-sm border border-blue-950/10 bg-zinc-50 px-4 py-1.5 text-sm font-semibold text-zinc-800 dark:border-white/10 dark:bg-zinc-800/50 dark:text-zinc-200">
                    {config.role}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Preparing for
                  </p>
                  <BasicDropdown
                    items={INTERVIEW_SENIORITY_OPTIONS.map((opt) => ({
                      id: opt,
                      label: opt,
                    }))}
                    label="Select level"
                    defaultValue={config.seniority}
                    onChange={(item) =>
                      setConfig((current) => ({
                        ...current,
                        seniority: item.id as InterviewSeniority,
                      }))
                    }
                    className="w-full [&>button]:rounded-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                  <div>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      Interview flow
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Each section defines the backend timing and transition
                      guardrails.
                    </p>
                  </div>
                  <BasicDropdown
                    items={INTERVIEW_SECTION_OPTIONS.map((opt) => ({
                      id: opt.type,
                      label: opt.label,
                    }))}
                    label="Add section"
                    resetAfterSelect={true}
                    onChange={(item) =>
                      addSection(item.id as InterviewSectionType)
                    }
                    className="w-full md:w-[220px] [&>button]:rounded-sm [&>button]:shadow-lg"
                  />
                </div>

                <div className="space-y-3">
                  {config.flow.map((section, index) => {
                    const template = INTERVIEW_SECTION_OPTIONS.find(
                      (option) => option.type === section.type,
                    );

                    return (
                      <div
                        key={section.id}
                        className="rounded-sm border border-blue-950/10 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-zinc-800/40"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              Section {index + 1}:{" "}
                              {getSectionLabel(section.type)}
                            </p>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                              {template?.description}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-sm text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-700"
                            onClick={() => removeSection(section.id)}
                            disabled={config.flow.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-3 grid-cols-3 md:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr]">
                          <div className="space-y-2 col-span-3 md:col-span-1">
                            <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                              Section type
                            </p>
                            <BasicDropdown
                              items={INTERVIEW_SECTION_OPTIONS.map((opt) => ({
                                id: opt.type,
                                label: opt.label,
                              }))}
                              label="Select type"
                              defaultValue={section.type}
                              onChange={(item) =>
                                updateSection(section.id, () => {
                                  const next = createFlowSection(
                                    item.id as InterviewSectionType,
                                  );
                                  return {
                                    ...next,
                                    id: section.id,
                                  };
                                })
                              }
                              className="w-full [&>button]:rounded-sm"
                            />
                          </div>

                          <div className="space-y-2 col-span-1">
                            <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                              Mins
                            </p>
                            <Input
                              type="number"
                              className="rounded-sm px-2 text-center md:px-3 md:text-left"
                              min={5}
                              max={45}
                              value={section.durationMinutes}
                              onChange={(event) =>
                                updateSection(section.id, (current) => ({
                                  ...current,
                                  durationMinutes: Number(
                                    event.target.value || 0,
                                  ),
                                }))
                              }
                            />
                          </div>

                          <div className="space-y-2 col-span-1">
                            <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                              Min Qs
                            </p>
                            <Input
                              type="number"
                              className="rounded-sm px-2 text-center md:px-3 md:text-left"
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

                          <div className="space-y-2 col-span-1">
                            <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                              Max Qs
                            </p>
                            <Input
                              type="number"
                              className="rounded-sm px-2 text-center md:px-3 md:text-left"
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

          <Card className="border-blue-950/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/50 dark:backdrop-blur-sm rounded-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-blue-950 dark:text-zinc-100">
                Session Summary
              </CardTitle>
              <CardDescription>
                This is the final configuration that will be sent to the backend
                section engine.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-sm border border-blue-950/10 bg-zinc-50/90 p-4 dark:border-white/10 dark:bg-zinc-800/40">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {config.seniority} · {config.role}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Clock3 className="h-4 w-4" />
                  Total planned time: {totalDuration} minutes
                </div>
              </div>

              <div className="space-y-3">
                {config.flow.map((section) => (
                  <div
                    key={section.id}
                    className="rounded-sm border border-blue-950/10 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-zinc-800/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {getSectionLabel(section.type)}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {section.durationMinutes} min
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Guardrails: {section.minQuestions} to{" "}
                      {section.maxQuestions} completed question cycles
                    </p>
                  </div>
                ))}
              </div>

              <Button
                size={"lg"}
                className="mt-2 w-full rounded-full transition-transform active:scale-95"
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
