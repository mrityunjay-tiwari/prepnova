# PrepNova

**Backend interview orchestration microservice:** [stream-interview-be](https://github.com/mrityunjay-tiwari/stream-interview-be)

PrepNova is an AI-powered mock interview platform built to simulate structured technical interviews instead of generic chatbot-style Q&A. Users can choose the role they are preparing for, select a target seniority, define the interview flow, take a live AI-driven interview, receive feedback during the session, review a structured final report, and track their progress over time.

The core idea behind the project is simple: interview preparation should feel like an interview system, not a prompt box. A good interview-prep product should not only ask questions. It should understand pacing, sections, follow-ups, evaluation, and what progress actually means across repeated practice.

## What PrepNova Does

PrepNova turns mock interviews into a repeatable learning workflow. A user begins by selecting a role, a seniority target, and interview sections such as projects, frontend, backend, DSA, behavioral, system design, or ML fundamentals. From there, the platform creates a live interview session, asks questions section by section, reacts to answer quality, and generates a structured report once the session ends.

That report is more than a one-time summary. It becomes part of a longer-term progress system that helps users understand how their technical depth, communication, confidence, and readiness evolve over multiple interviews. In that sense, PrepNova is solving two problems at once: making the interview itself more realistic, and making the feedback loop around it more useful.

## Why I Built It

Most interview-prep products feel incomplete in one of two directions. Some are static collections of questions, which are helpful for revision but weak for realism. Others use AI, but still feel like unstructured chat sessions that do not understand rounds, pacing, seniority, or when to probe deeper.

I wanted to build something that could close that gap. The product needed to behave more like a real interviewer, adapt to how the conversation was going, and produce feedback that remained useful even after the interview ended. That is what pushed PrepNova from being "an AI feature" into being a full interview system with real-time orchestration, structured reporting, and persistent progress memory.

## Why It Is Different

PrepNova is not designed to behave like a generic LLM chat interface. Its value comes from explicit interview orchestration. The backend controls section timing, transitions, current question state, and adaptive probing, while the frontend focuses on setup, live continuity, reports, and progress views. That separation matters because it keeps the interview flow deterministic and resilient instead of letting the client become a second logic engine.

The product is also designed for repeated practice. Many AI tools give users one conversation and one answer. PrepNova stores structured reports so each session can later become dashboard data, readiness signals, and progress history. It also includes local posture analysis, which keeps raw posture-video processing in the browser and forwards only lightweight summary signals into the reporting pipeline.

## Tech Stack

The frontend application is built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**, with **Recharts** used for the reporting and progress visualizations. Real-time interview sessions are powered by the **Stream Video SDK**, which provides the live communication layer for the product.

Interview orchestration itself is handled by a separate **FastAPI + Python** microservice. That service owns the interview lifecycle: it creates and tracks the session, manages sections and timing, decides when to follow up or move on, and exposes the state the frontend renders.

For AI capabilities, the system integrates **Deepgram** for speech-to-text and text-to-speech, and **OpenRouter** for LLM-based question generation, answer evaluation, and structured report synthesis. Persistence is handled with **Prisma** and **PostgreSQL**. For posture and presence analysis, the client uses browser camera APIs together with **MediaPipe Tasks Vision** and **PoseLandmarker** so pose inference can run locally in the browser.

## System Design

PrepNova is structured as a layered real-time interview platform. The frontend is responsible for collecting interview configuration, rendering the live session interface, surfacing the active question, showing live feedback, and displaying reports and progress views. The live communication layer carries the voice interaction. The backend interview engine owns the actual interview flow: section timing, transitions, adaptive probing, and current question state. The evaluation and report pipeline turns the interview into structured feedback. The persistence layer stores the resulting reports so they can drive the dashboard and progress system later.

This separation is one of the most important architectural decisions in the project. The frontend does not decide when rounds change or how probing should behave. The backend acts as the source of truth, which reduces drift across refreshes, reconnects, and other real-time edge cases while keeping the client focused on continuity and UX.

### High-Level Flow / Archtitecture Overview

![PrepNova system design](https://ik.imagekit.io/mrityunjay/prepnova/system-design-mobile-view_light?updatedAt=1777838911735)

The interview begins in the frontend, where the candidate configures role, seniority, and interview sections. Once the session starts, the real-time layer handles live communication while the backend engine orchestrates the actual interview. That engine keeps track of the active section, the current question, wrap-up conditions, and whether the user's answer should trigger a deeper follow-up or a transition.

At the same time, the application supports client-side posture analysis in the browser. That local signal does not own the interview flow, but it contributes summary posture data to the final report. When the interview ends, the frontend finalizes the session, transcript segments and report context are collected, the final report is generated, and the result is persisted so it can later appear on the dashboard and progress page.

## Key Engineering Decisions

One of the strongest decisions in PrepNova is that the backend owns the interview flow. Timing, section transitions, adaptive probing, and current-question progression all live server-side. This keeps the interview deterministic and avoids the frontend becoming a second orchestration layer.

Another important decision is mirroring the current question to the frontend. In a live voice system, spoken prompts can occasionally be delayed or missed. By storing the current question centrally and rendering it in the UI, the session remains usable without moving core logic into the client.

The posture-analysis pipeline is also deliberate. Pose detection runs locally in the browser instead of on the backend. That reduces backend compute, avoids streaming raw posture video for inference, lowers bandwidth usage, and narrows the privacy surface. Only summary posture signals are later used in reporting.

The report pipeline is designed to be structured rather than transcript-heavy. Users still receive live feedback answer by answer, but final reports are aggregated into scores, strengths, weaknesses, readiness, communication summary, posture summary, section breakdown, and an action plan. This makes the output easier to trust and far more reusable inside the progress system.

Finally, the progress system is intentionally conservative. PrepNova does not pretend one interview is a trend. Early sessions are treated as snapshots, and richer progress insights unlock only when enough history exists to support them.

## Privacy-Conscious Design

PrepNova is not a fully local product, because audio, live session infrastructure, transcripts, and report generation rely on remote services. However, posture analysis is intentionally local. Raw posture video is processed in the browser and is not uploaded to the backend for pose inference. Only lightweight summary signals are later included in the final report.

That is both a privacy decision and a systems decision. It reduces infrastructure cost, narrows unnecessary data movement, and keeps the backend focused on orchestration and reporting rather than frame-level vision processing.

## The Interview Orchestration Service

PrepNova depends on a dedicated backend service for the part of the product that matters most: the interview itself. The frontend is where users configure the session and experience the UI, but the backend orchestration service is what makes the interview behave like a system instead of a loose chat flow.

That service is responsible for creating and tracking live interview sessions, maintaining the current section and active question, managing timing and transitions between rounds, applying role-aware and seniority-aware difficulty, deciding when to probe deeper, generating interview context, and exposing the structured data used later in final report generation. It also plays a critical role in finalization by making transcript segments and report context available to the frontend reporting pipeline.

In practical terms, if the frontend is the experience layer, the interview orchestration service is the brain of the product. It is the source of truth for the live interview lifecycle and the reason the session can stay structured, adaptive, and consistent.

Repository: [stream-interview-be](https://github.com/mrityunjay-tiwari/stream-interview-be)

## Running The Project Locally

To run the frontend locally, install dependencies, configure the required environment variables, prepare the database, and start the development server.

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

You will need working values for the database, authentication, Stream credentials, the backend interview-service URL, and any AI provider keys used in the report-generation pipeline. The frontend expects the backend microservice to be running and reachable through environment configuration.

Once the app is running, it will be available at [http://localhost:3000](http://localhost:3000).

## Why This Project Matters Technically

From an engineering perspective, PrepNova demonstrates real-time application design, voice orchestration, FE/BE responsibility boundaries, structured report generation, resilient interview finalization, client-side vision inference, and progress persistence over repeated sessions. Just as importantly, it reflects product decisions guided by trust: graceful degradation when inputs are partial, dashboard metrics gated by enough history, and privacy-conscious compute placement where it makes sense.

For technical reviewers and recruiters, the most important framing is this: PrepNova was designed as a complete interview system first, and only then as an AI product.
