
import {UIMessage, streamText, convertToModelMessages} from 'ai'
import { openrouter } from "@openrouter/ai-sdk-provider";
import { PREPNOVA_AI_SYSTEM_PROMPT } from '@/utils/system-prompt';

export async function POST(req: Request) {
    try{
        const {messages}:{messages: UIMessage[]} = await req.json()

        const result = await streamText({
            model: openrouter("openai/gpt-oss-120b:free"),
            messages: await convertToModelMessages(messages),
            system: PREPNOVA_AI_SYSTEM_PROMPT
        })
                    
        return result.toUIMessageStreamResponse()
    } catch(err) {
        console.error("fialed to generate message")
        return new Response("Failed to generate message", {status: 500})
    }
}