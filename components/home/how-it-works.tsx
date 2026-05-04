"use client";

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
import AgentAvatar from "../ui/agent-avatar";
import FLoatingInterviewReportPanel from "./floating-interview-analysis-panel";
import Image from "next/image";
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
import BasicDropdown from "../ui/basic-dropdown";

const Cross = ({className}: {className?: string}) => (
  <div
    className={cn(
      "absolute h-4 w-4 flex items-center justify-center pointer-events-none z-10",
      className,
    )}
  >
    <div className="w-full h-[0.8px] bg-slate-200 dark:bg-zinc-800 absolute" />
    <div className="h-full w-[0.8px] bg-slate-200 dark:bg-zinc-800 absolute" />
  </div>
);

const Step1Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center bg-white dark:bg-zinc-900">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative pt-10 pb-4 px-2 bg-linear-to-t from-slate-100 to-gray-50 dark:from-zinc-900/50 dark:to-zinc-800/50 max-w-full overflow-hidden">
          <Card className="inset-0 relative max-w-full m-2 z-40 p-1 py-3 bg-white dark:bg-zinc-950 dark:border-zinc-800">
            <CardContent className="">
              <div className="flex w-full items-center gap-2">
                {/* Icon */}
                <div className="bg-gray-100 dark:bg-zinc-800 flex items-center justify-center w-8 h-8 rounded-md text-gray-700 dark:text-zinc-300 font-semibold shrink-0">
                  R.
                </div>

                <Work1Card />
              </div>
            </CardContent>
          </Card>

          <Card className="inset-0 relative max-w-full m-4 rounded-lg z-30 -mt-13 dark:bg-zinc-950 dark:border-zinc-800"></Card>
          <Card className="inset-0 relative max-w-full m-6 rounded-lg z-20 -mt-15 dark:bg-zinc-950 dark:border-zinc-800"></Card>
          <Card className="inset-0 relative max-w-full m-8 rounded-lg z-10 -mt-17 dark:bg-zinc-950 dark:border-zinc-800"></Card>
          <Card className="inset-0 relative max-w-full m-10 rounded-lg z-0 -mt-19 dark:bg-zinc-950 dark:border-zinc-800"></Card>
          <Card className="inset-0 relative max-w-full m-12 rounded-lg -z-10 -mt-21 dark:bg-zinc-950 dark:border-zinc-800"></Card>
          <Card className="inset-0 relative max-w-full m-14 rounded-lg -z-20 -mt-23 dark:bg-zinc-950 dark:border-zinc-800"></Card>

          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none z-50" />
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

const ROLE_ITEMS = [
  {id: "react-developer", label: "React Developer"},
  {id: "full-stack-developer", label: "Full Stack Developer"},
  {id: "frontend-developer", label: "Frontend Developer"},
  {id: "backend-developer", label: "Backend Developer"},
  {id: "data-scientist", label: "Data Scientist"},
];

const TARGET_ITEMS = [
  {id: "internship", label: "Internship"},
  {id: "sde1", label: "SDE1"},
  {id: "sde2", label: "SDE2"},
  {id: "sde3", label: "SDE3"},
  {id: "principal-engineer", label: "Principal Engineer"},
  {id: "staff-engineer", label: "Staff Engineer"},
];

const Work1Card = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <BasicDropdown
        items={ROLE_ITEMS}
        label="Choose role"
        className="w-full !block"
      />
    </div>
  );
};

const Work2Card = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <BasicDropdown
        items={TARGET_ITEMS}
        label="Choose Target"
        className="w-full !block"
      />
    </div>
  );
};

const Step2Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center bg-white dark:bg-zinc-900">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative pt-10 pb-4 px-2 bg-linear-to-t from-slate-100 to-gray-50 dark:from-zinc-900/50 dark:to-zinc-800/50 max-w-full overflow-hidden">
          <Card className="inset-0 relative max-w-full m-2 z-40 p-1 py-3 bg-white dark:bg-zinc-950 dark:border-zinc-800">
            <CardContent className="">
              <div className="flex w-full items-center gap-2">
                {/* Icon */}
                <div className="bg-gray-100 dark:bg-zinc-800 flex items-center justify-center w-8 h-8 rounded-md text-gray-700 dark:text-zinc-300 font-semibold shrink-0">
                  T.
                </div>

                <Work2Card />
              </div>
            </CardContent>
          </Card>

          <Card className="inset-0 relative max-w-full m-4 rounded-lg z-30 -mt-13 dark:bg-zinc-950 dark:border-zinc-800"></Card>
          <Card className="inset-0 relative max-w-full m-6 rounded-lg z-20 -mt-15 dark:bg-zinc-950 dark:border-zinc-800"></Card>
          <Card className="inset-0 relative max-w-full m-8 rounded-lg z-10 -mt-17 dark:bg-zinc-950 dark:border-zinc-800"></Card>
          <Card className="inset-0 relative max-w-full m-10 rounded-lg z-0 -mt-19 dark:bg-zinc-950 dark:border-zinc-800"></Card>
          <Card className="inset-0 relative max-w-full m-12 rounded-lg -z-10 -mt-21 dark:bg-zinc-950 dark:border-zinc-800"></Card>
          <Card className="inset-0 relative max-w-full m-14 rounded-lg -z-20 -mt-23 dark:bg-zinc-950 dark:border-zinc-800"></Card>

          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none z-50" />
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
    <div className="w-full flex flex-col rounded-none items-center bg-white dark:bg-zinc-900">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative pt-2 pb-4 px-2 bg-linear-to-t from-slate-100 to-gray-50 dark:from-zinc-900/50 dark:to-zinc-800/50 max-w-full overflow-hidden">
          <div className="flex w-full items-center justify-center">
            <InterviewSetup12 role="react-developer" />
          </div>
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none z-50" />
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
    <div className="w-full flex flex-col rounded-none items-center bg-white dark:bg-zinc-900">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative bg-linear-to-t from-slate-100 to-gray-50 dark:from-zinc-900/50 dark:to-zinc-800/50 max-w-full overflow-hidden">
          <div className="flex w-full items-center justify-center">
            <div className="w-full h-full rounded-none bg-gray-100 dark:bg-zinc-950 pt-10 border dark:border-zinc-800">
              <div className="flex items-center justify-center w-full h-full pb-14">
                <AgentAvatar size={100} seed="" />
              </div>
              <div className="absolute bottom-3.5 left-3.5 z-[60] bg-black/30 text-white text-xs px-1 py-0.5 rounded-sm backdrop-blur-xl border border-white/10">
                Kirosk (AI Interviewer)
              </div>
            </div>
          </div>
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none z-50" />
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
    <div className="w-full flex flex-col rounded-none items-center bg-white dark:bg-zinc-900">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative bg-linear-to-t from-slate-100 to-gray-50 dark:from-zinc-900/50 dark:to-zinc-800/50 max-w-full overflow-hidden">
          <div className="flex w-full items-center justify-center scale-[90%]">
            <FLoatingInterviewReportPanel />
          </div>
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none z-50" />
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
    <div className="w-full flex flex-col rounded-none items-center bg-white dark:bg-zinc-900">
      <div className="w-full rounded-none">
        <div className="relative pt-5 px-2 pb-4 bg-linear-to-t from-slate-100 to-gray-50 dark:from-zinc-900/50 dark:to-zinc-800/50 max-w-full overflow-hidden">
          <div className="flex w-full items-center justify-center">
            <Image
              src="https://ik.imagekit.io/mrityunjay/prepnova/ChatGPT%20Image%20May%203,%202026,%2009_31_20%20PM.png"
              alt="Report 1"
              width={800}
              height={400}
              className="hidden dark:block w-full h-full"
            />
            <Image
              src="https://ik.imagekit.io/mrityunjay/prepnova/ChatGPT%20Image%20May%202,%202026,%2003_31_40%20PM.png"
              alt="Report 1"
              width={800}
              height={400}
              className="w-full h-full dark:hidden"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none z-50" />
        </div>
      </div>

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
    <div className="w-full bg-white dark:bg-zinc-900 p-6 -mt-8 flex flex-col items-start relative z-50">
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(37,99,235,0.4)] dark:shadow-[0_4px_15px_rgba(37,99,235,0.2)] from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 text-white font-semibold text-base rounded-xl w-10 h-10 flex items-center justify-center mb-2">
        <h1>{stepNumber}</h1>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-zinc-400">{description}</p>
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
    <div className="w-[95%] mx-auto max-w-6xl mt-10 md:mt-0">
      <Headings
        subtitle="How it Solves?"
        title="How the entire flow works!"
        subheading="(Interactive Playground)"
      />

      <div className="mt-5 md:mt-16 relative w-full flex flex-wrap border-t border-l border-slate-200 dark:border-zinc-800">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="relative w-full md:w-1/3 border-b border-r border-slate-200 dark:border-zinc-800 flex flex-col items-center bg-white dark:bg-zinc-900"
          >
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
              <BasicDropdown
                items={INTERVIEW_SECTION_OPTIONS.map((opt) => ({
                  id: opt.type,
                  label: opt.label,
                }))}
                label="Add section"
                resetAfterSelect={true}
                onChange={(item) => addSection(item.id as InterviewSectionType)}
                className="w-[120px] !block [&>button]:rounded-sm [&>button]:shadow-lg [&>button]:text-[10px] md:[&>button]:text-xs [&>button]:h-7 [&>button]:px-2 [&>button]:py-1 -mt-2"
                dropdownClassName="[&_li>button]:min-h-[24px] [&_li>button]:px-2 [&_li>button]:py-1 [&_li>button]:text-[10px] [&_ul]:py-1 w-[120px]"
              />
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
                          className="w-full !block [&>button]:rounded-sm [&>button]:text-[10px] md:[&>button]:text-[11px] [&>button]:h-5 [&>button]:px-1.5 [&>button]:py-0 [&>button>span]:truncate [&>button>span]:max-w-[70px] [&_svg]:h-3 [&_svg]:w-3"
                          dropdownClassName="[&_li>button]:min-h-[20px] [&_li>button]:px-2 [&_li>button]:py-0.5 [&_li>button]:text-[10px] [&_ul]:py-1"
                        />
                      </div>

                      <div className="">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Minutes
                        </p>
                        <Input
                          type="number"
                          className="rounded-xs h-5 text-[11px]! px-1 py-0"
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
