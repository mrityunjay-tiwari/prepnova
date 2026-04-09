"use client";

import {useEffect, useRef, useState} from "react";
import {
  Call,
  StreamVideoClient,
  type User,
} from "@stream-io/video-react-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export function useInterviewSession({
  userId,
  userName,
  userToken,
}: {
  userId: string;
  userName: string;
  userToken: string;
}) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const hasJoined = useRef(false);

  useEffect(() => {
    const createSession = async () => {
      const res = await fetch(
        "https://mrityunjay18-ai-interview-agent.hf.space/create-session",
        {
          method: "POST",
        },
      );

      const data = await res.json();
      setCallId(data.call_id);
    };

    createSession();
  }, []);

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
