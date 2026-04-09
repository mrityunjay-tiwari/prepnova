import { streamObject } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { InterviewReportSchema } from "./schema";
import { INTERVIEW_EVALUATOR_SYSTEM_PROMPT } from "@/utils/system-prompt";

export async function POST(req: Request) {
  try {
    const text = await req.text();
        
    if (!text) {
      return new Response("Empty request body", { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(text);
    } catch (error: unknown) {
      console.error("Failed to parse JSON:", text, error);
      return new Response("Invalid JSON", { status: 400 });
    }

    const { questions } = body;

    if (!questions || !Array.isArray(questions)) {
      console.error("'questions' is missing or not an array:", body);
      return new Response("Missing questions", { status: 400 });
    }

    const transcript = questions
      .map(
        (segment: { question: string; answer: string }, index: number) =>
          `Q${index + 1}: ${segment.question}\nA${index + 1}: ${segment.answer}`
      )
      .join("\n\n");

    const result = streamObject({
      model: openrouter("arcee-ai/trinity-large-preview:free"),
      schema: InterviewReportSchema,
      system: INTERVIEW_EVALUATOR_SYSTEM_PROMPT,
      prompt: transcript,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error(error);
    return new Response("Failed", { status: 500 });
  }
}