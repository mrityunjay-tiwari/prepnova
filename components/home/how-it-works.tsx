"use client";

import {Card, CardContent} from "../ui/card";
import Headings from "./headings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {cn} from "@/lib/utils";

const Cross = ({className}: {className?: string}) => (
  <div
    className={cn(
      "absolute h-4 w-4 flex items-center justify-center pointer-events-none z-10",
      className,
    )}
  >
    <div className="w-full h-[0.8px] bg-slate-200 absolute" />
    <div className="h-full w-[0.8px] bg-slate-200 absolute" />
  </div>
);

const Step1Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative pt-10 pb-4 px-2 bg-linear-to-t from-slate-100 to-gray-50 max-w-full overflow-hidden">
          <Card className="inset-0 relative max-w-full m-2 z-40 p-1 py-3 bg-white">
            <CardContent className="">
              <div className="flex w-full items-center gap-2">
                {/* Icon */}
                <div className="bg-gray-100 flex items-center justify-center w-8 h-8 rounded-md text-gray-700 font-semibold shrink-0">
                  R
                </div>

                <Work1Card />
              </div>
            </CardContent>
          </Card>

          <Card className="inset-0 relative max-w-full m-4 rounded-lg z-30 -mt-13"></Card>
          <Card className="inset-0 relative max-w-full m-6 rounded-lg z-20 -mt-15"></Card>
          <Card className="inset-0 relative max-w-full m-8 rounded-lg z-10 -mt-17"></Card>
          <Card className="inset-0 relative max-w-full m-10 rounded-lg z-0 -mt-19"></Card>
          <Card className="inset-0 relative max-w-full m-12 rounded-lg -z-10 -mt-21"></Card>
          <Card className="inset-0 relative max-w-full m-14 rounded-lg -z-20 -mt-23"></Card>

          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none z-50" />
        </div>
      </div>

      {/* Step section */}

      <CardsBottomSection
        stepNumber="01"
        title="Select Role"
        description="Select the role you are preparing for."
      />
    </div>
  );
};

const Work1Card = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose role" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="react-developer">React Developer</SelectItem>
          <SelectItem value="full-stack-developer">
            Full Stack Developer
          </SelectItem>
          <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
          <SelectItem value="backend-developer">Backend Developer</SelectItem>
          <SelectItem value="data-scientist">Data Scientist</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const Work2Card = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose Target" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="internship">Internship</SelectItem>
          <SelectItem value="sde1">SDE1</SelectItem>
          <SelectItem value="sde2">SDE2</SelectItem>
          <SelectItem value="sde3">SDE3</SelectItem>
          <SelectItem value="data-scientist">Principal Engineer</SelectItem>
          <SelectItem value="data-scientist">Staff Engineer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const Step2Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative pt-10 pb-4 px-2 bg-linear-to-t from-slate-100 to-gray-50 max-w-full overflow-hidden">
          <Card className="inset-0 relative max-w-full m-2 z-40 p-1 py-3 bg-white">
            <CardContent className="">
              <div className="flex w-full items-center gap-2">
                {/* Icon */}
                <div className="bg-gray-100 flex items-center justify-center w-8 h-8 rounded-md text-gray-700 font-semibold shrink-0">
                  T
                </div>

                <Work2Card />
              </div>
            </CardContent>
          </Card>

          <Card className="inset-0 relative max-w-full m-4 rounded-lg z-30 -mt-13"></Card>
          <Card className="inset-0 relative max-w-full m-6 rounded-lg z-20 -mt-15"></Card>
          <Card className="inset-0 relative max-w-full m-8 rounded-lg z-10 -mt-17"></Card>
          <Card className="inset-0 relative max-w-full m-10 rounded-lg z-0 -mt-19"></Card>
          <Card className="inset-0 relative max-w-full m-12 rounded-lg -z-10 -mt-21"></Card>
          <Card className="inset-0 relative max-w-full m-14 rounded-lg -z-20 -mt-23"></Card>

          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none z-50" />
        </div>
      </div>

      {/* Step section */}

      <CardsBottomSection
        stepNumber="02"
        title="Select Target/Difficulty"
        description="Select target you are preparing for (SDE1, SDE2 etc.)."
      />
    </div>
  );
};

const Step3Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative pt-2 pb-4 px-2 bg-linear-to-t from-slate-100 to-gray-50 max-w-full overflow-hidden">
          <div className="flex w-full items-center justify-center">
            <InterviewSetup12 role="react-developer" />
          </div>
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none z-50" />
        </div>
      </div>

      {/* Step section */}

      <CardsBottomSection
        stepNumber="03"
        title="Configure Your Interview"
        description="Select all the sections to be asked questions about."
      />
    </div>
  );
};

const Step4Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative bg-linear-to-t from-slate-100 to-gray-50 max-w-full overflow-hidden">
          <div className="flex w-full items-center justify-center">
            <div className="w-full h-full rounded-none bg-gray-100 pt-10">
              <div className="flex items-center justify-center w-full h-full pb-14">
                <AgentAvatar size={100} seed="" />
              </div>
              <div className="absolute bottom-3.5 left-3.5 z-[60] bg-black/30 text-white text-xs px-1 py-0.5 rounded-sm backdrop-blur-xl">
                Kirosk (AI Interviewer)
              </div>
            </div>
          </div>
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none z-50" />
        </div>
      </div>

      {/* Step section */}

      <div className="mt-4">
        <CardsBottomSection
        stepNumber="04"
        title="Take the Interview"
        description="Attend the interview custom designed in Real Time as per your configurations."
      />
      </div>
    </div>
  );
};

const Step5Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative bg-linear-to-t from-slate-100 to-gray-50 max-w-full overflow-hidden">
          <div className="flex w-full items-center justify-center scale-[90%]">
           <FLoatingInterviewReportPanel />
          </div>
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none z-50" />
        </div>
      </div>

      {/* Step section */}

      <CardsBottomSection
        stepNumber="05"
        title="Get Live Feedback"
        description="Get Live feeback for your answers and Presence."
      />
    </div>
  );
};

const Step6Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative pt-5 px-2 pb-4 bg-linear-to-t from-slate-100 to-gray-50 max-w-full overflow-hidden">
          <div className="flex w-full items-center justify-center">
            <Image 
              src="https://ik.imagekit.io/mrityunjay/prepnova/report"
              alt="Report 1"
              width={800}
              height={400}
              className="w-full h-full"
            />
          </div>
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none z-50" />
        </div>
      </div>

      {/* Step section */}

      <CardsBottomSection
        stepNumber="06"
        title="Get Your Interview Report"
        description="Get Detailed analysis of your performance based on multiple metrics."
      />
    </div>
  );
};

type CardsBottomSectionProps = {
  stepNumber: string;
  title: string;
  description: string;
};

const CardsBottomSection = ({
  stepNumber,
  title,
  description,
}: CardsBottomSectionProps) => {
  return (
    <div className="w-full bg-white p-6 -mt-8 flex flex-col items-start relative z-50">
      {/* Step number bubble */}
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(37,99,235,0.4)] from-blue-500 to-blue-600 text-white font-semibold text-base rounded-xl w-10 h-10 flex items-center justify-center mb-2">
        <h1>{stepNumber}</h1>
      </div>

      {/* Step content */}
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

const STEPS = [
  {num: "01", card: Step1Card},
  {num: "02", card: Step2Card},
  {num: "03", card: Step3Card},
  {num: "04", card: Step4Card},
  {num: "05", card: Step5Card},
  {num: "06", card: Step6Card},
];

export default function HowItWorks() {
  return (
    <div className="w-full mx-auto max-w-6xl">
      <Headings subtitle="How it Works?" title="How the entire flow works!" subheading="(Interactive Playground)" />

      <div className="mt-16 relative w-full flex flex-wrap border-t border-l border-slate-200">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="relative w-full md:w-1/3 border-b border-r border-slate-200 flex flex-col items-center"
          >
            {/* Blueprint Crosses at intersections */}
            <Cross className="-top-[8px] -left-[8px]" />
            <Cross className="-top-[8px] -right-[8px]" />
            <Cross className="-bottom-[8px] -left-[8px]" />
            <Cross className="-bottom-[8px] -right-[8px]" />

            <step.card />
          </div>
        ))}
      </div>
    </div>
  );
}

import {useState} from "react";
import {TrashIcon} from "lucide-react";

import {Input} from "@/components/ui/input";

import {
  buildDefaultInterviewSetup,
  createFlowSection,
  getSectionLabel,
  INTERVIEW_SECTION_OPTIONS,
} from "@/utils/interview-config";
import type {
  InterviewFlowSection,
  InterviewSectionType,
  InterviewSetupConfig,
} from "@/utils/types";
import {Screen} from "./screen";
import AgentAvatar from "../ui/agent-avatar";
import FLoatingInterviewReportPanel from "./floating-interview-analysis-panel";
import Image from "next/image";

function InterviewSetup12({role}: {role: string}) {
  const [config, setConfig] = useState<InterviewSetupConfig>(() =>
    buildDefaultInterviewSetup(role),
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
    <div className="w-full p-0">
      <Card className="w-full p-0 pt-3.5 border-blue-950/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/50 dark:backdrop-blur-sm rounded-sm">
        <CardContent className="space-y-1">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Interview flow
                </p>
              </div>
              <Select
                onValueChange={(value) =>
                  addSection(value as InterviewSectionType)
                }
              >
                <SelectTrigger
                  size="sm"
                  className="rounded-sm border shadow-lg text-xs"
                >
                  <SelectValue placeholder="Add section" />
                </SelectTrigger>
                <SelectContent>
                  {INTERVIEW_SECTION_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.type}
                      value={option.type}
                      className="text-xs"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-0.5">
              {config.flow.map((section, index) => {
                const template = INTERVIEW_SECTION_OPTIONS.find(
                  (option) => option.type === section.type,
                );

                return (
                  <div
                    key={section.id}
                    className="rounded-sm border border-blue-950/10 bg-zinc-50/80 p-1.5 dark:border-white/10 dark:bg-zinc-800/40"
                  >
                    <div className="mb-0.5 flex items-center justify-between gap-1.5">
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          Section {index + 1}: {getSectionLabel(section.type)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="h-4 w-4 p-0 rounded-sm text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-700 flex items-center justify-center"
                        onClick={() => removeSection(section.id)}
                        disabled={config.flow.length === 1}
                      >
                        <TrashIcon className="h-2.5 w-2.5" />
                      </button>
                    </div>

                    <div className="grid gap-2 md:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr]">
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
                          <SelectTrigger
                            size="sm"
                            className="w-full rounded-xs text-xs"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {INTERVIEW_SECTION_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.type}
                                value={option.type}
                                className="text-xs"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Minutes
                        </p>
                        <Input
                          type="number"
                          className="rounded-xs h-5 text-xs"
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
