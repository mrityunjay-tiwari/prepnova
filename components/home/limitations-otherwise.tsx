"use client";

import Headings from "./headings";
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
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none z-50" />
        </div>
      </div>

      {/* Step section */}

      <CardsBottomSection
        stepNumber="01"
        title="No Guidance"
        description="Practicing alone feels unrealistic."
      />
    </div>
  );
};

const Step2Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative pt-10 pb-4 px-2 bg-linear-to-t from-slate-100 to-gray-50 max-w-full overflow-hidden">
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none z-50" />
        </div>
      </div>

      {/* Step section */}

      <CardsBottomSection
        stepNumber="02"
        title="Lacking Simulation"
        description="Generic chatbots don’t simulate real interviews."
      />
    </div>
  );
};

const Step3Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative pt-10 pb-4 px-2 bg-linear-to-t from-slate-100 to-gray-50 max-w-full overflow-hidden">
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none z-50" />
        </div>
      </div>

      {/* Step section */}

      <CardsBottomSection
        stepNumber="03"
        title="No Adaptability"
        description="Most tools don’t adapt to role/seniority."
      />
    </div>
  );
};

const Step4Card = () => {
  return (
    <div className="w-full flex flex-col rounded-none items-center">
      {/* Illustration Section */}
      <div className="w-full rounded-none">
        <div className="relative pt-10 pb-4 px-2 bg-linear-to-t from-slate-100 to-gray-50 max-w-full overflow-hidden">
          {/* Fade overlay blending into the white background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none z-50" />
        </div>
      </div>

      {/* Step section */}

      <CardsBottomSection
        stepNumber="04"
        title="Lacking Feedbacks"
        description="Feedback is often vague or not actionable."
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
      <div className="bg-linear-to-br shadow-[0_4px_15px_rgba(37,99,235,0.4)] from-zinc-400 to-zinc-700 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mb-2">
        <h1>{stepNumber}</h1>
      </div>
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
];

export default function Limitations() {
  return (
    <div className="w-full mx-auto max-w-6xl">
      <Headings
        subtitle="Why it Exists?"
        title="Why other solutions feels empty ?"
      />

      <div className="mt-16 relative w-full flex flex-wrap border-t border-l border-slate-200">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="relative w-1/2 md:w-1/4 border-b border-r border-slate-200 flex flex-col items-center"
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
