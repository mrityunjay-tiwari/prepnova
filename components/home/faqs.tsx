"use client";

import React from "react";
import Headings from "./headings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faqs() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-0 font-sans bg-white dark:bg-inherit text-slate-900 dark:text-inherit rounded-3xl">
      <Headings subtitle="FAQs" title="Frequently Asked Questions" />
      <div className="mt-5 md:mt-0">
        <Accordion
          type="single"
          collapsible
          defaultValue="shipping"
          className="w-full"
        >
          <AccordionItem value="0">
            <AccordionTrigger>
              How is this different from using ChatGPT for interview practice?
            </AccordionTrigger>
            <AccordionContent>
              This is designed as a real interview system, not a generic chat
              session. Instead of giving you a flat back-and-forth conversation,
              it lets you configure role, seniority, and interview rounds, then
              runs a structured mock interview with adaptive questioning, live
              feedback, and a final report. It also tracks your progress over
              multiple sessions, so you can measure improvement over time
              instead of starting from scratch each time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="1">
            <AccordionTrigger>
              Can I choose my role, seniority, and interview format?
            </AccordionTrigger>
            <AccordionContent>
              Yes. You can configure the interview based on the role you are
              preparing for, the seniority level you are targeting, and the
              structure of the interview itself. For example, you can choose
              different sections such as projects, frontend, backend, DSA,
              behavioral, system design, or ML fundamentals, depending on the
              type of preparation you want.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>
              Does the interview adapt based on how I answer?
            </AccordionTrigger>
            <AccordionContent>
              Yes. The interview is not fixed. The system can probe deeper if an
              answer is shallow, move forward if your answer is strong, and
              adjust the flow within the current section based on how the
              interview is going. This makes the experience feel much closer to
              a real interviewer than a static question list or scripted chatbot
              flow.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="3">
            <AccordionTrigger>
              Do I get feedback during the interview, after it, or both?
            </AccordionTrigger>
            <AccordionContent>
              Both. During the interview, you receive live feedback on your
              answers so you can understand how you are doing in the moment.
              After the interview ends, you receive a structured final report
              with scores, strengths, improvement areas, readiness level, action
              steps, and progress memory that helps you improve across multiple
              sessions.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="4">
            <AccordionTrigger>
              Is posture analysis private, and is my video uploaded?
            </AccordionTrigger>
            <AccordionContent>
              Posture analysis is designed to be privacy-conscious. The pose and
              posture processing runs locally in your browser, and raw posture
              video is not uploaded to the backend for analysis. The system only
              uses lightweight summary posture signals, such as posture score
              trends, for the final report. That said, the interview itself
              still uses remote session and report infrastructure, so it should
              not be described as fully local or 100% private.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
