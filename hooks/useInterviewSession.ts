"use client";

import {useEffect, useRef, useState} from "react";
import {
  Call,
  StreamVideoClient,
  type User,
} from "@stream-io/video-react-sdk";
import type {InterviewSetupConfig} from "@/utils/types";
import {buildInterviewApiUrl} from "@/utils/interview-api";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export function useInterviewSession({
  config,
  userId,
  userName,
  userToken,
}: {
  config: InterviewSetupConfig;
  userId: string;
  userName: string;
  userToken: string;
}) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const hasCreatedSession = useRef(false);
  const hasJoined = useRef(false);

  useEffect(() => {
    if (hasCreatedSession.current) return;

    hasCreatedSession.current = true;

    const createSession = async () => {
      const res = await fetch(buildInterviewApiUrl("/create-session"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          role: config.role,
          seniority: config.seniority,
          flow: config.flow.map((section) => ({
            type: section.type,
            duration_minutes: section.durationMinutes,
            min_questions: section.minQuestions,
            max_questions: section.maxQuestions,
            focus_topics: section.focusTopics ?? [],
          })),
        }),
      });

      const data = await res.json();
      setCallId(data.call_id);
    };

    createSession().catch((error) => {
      hasCreatedSession.current = false;
      console.error("Failed to create interview session", error);
    });
  }, [config]);

  useEffect(() => {
    if (!callId) return;
    if (hasJoined.current) return;

    hasJoined.current = true;

    const user: User = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_svg/?id=${encodeURIComponent(userId)}&name=${encodeURIComponent(userName)}`,
    };

    const startCall = async () => {
      const streamClient = new StreamVideoClient({
        apiKey,
        user,
        token: userToken,
      });

      const streamCall = streamClient.call("default", callId);

      setClient(streamClient);
      setCall(streamCall);

      await streamCall.join({create: true});

      try {
        await streamCall.camera.disable();
      } catch (error) {
        console.log("Camera already disabled", error);
      }

      await streamCall.microphone.enable();
      setIsReady(true);
    };

    startCall();
  }, [callId, userId, userName, userToken]);

  return {
    client,
    call,
    callId,
    isReady,
  };
}
