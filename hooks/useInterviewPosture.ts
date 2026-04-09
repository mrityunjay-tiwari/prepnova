"use client";

import {useEffect, useRef, useState} from "react";
import {CallingState} from "@stream-io/video-react-sdk";
import {usePose} from "@/hooks/usePose";
import type {PostureStats} from "@/utils/types";

export function useInterviewPosture(callingState: CallingState) {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const postureHistory = useRef<number[]>([]);
  const {canvasRef, postureScore, nudgeMessage} = usePose(videoRef);
  const currentPoseScoreRef = useRef(postureScore);

  useEffect(() => {
    currentPoseScoreRef.current = postureScore;
  }, [postureScore]);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const attachLocalCamera = async () => {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({video: true});
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
        setHasCamera(true);
      } catch (error) {
        console.error("Failed to start local camera", error);
        setHasCamera(false);
      }
    };

    attachLocalCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (callingState !== CallingState.JOINED) return;

    const interval = setInterval(() => {
      const score = currentPoseScoreRef.current;
      postureHistory.current.push(score);
      console.log(
        `Posture sample: ${score.toFixed(2)} (History size: ${postureHistory.current.length})`,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [callingState]);

  const getPostureStats = (): PostureStats => {
    const scores = postureHistory.current;

    if (scores.length === 0) {
      return {min: 0, max: 0, avg: 0};
    }

    return {
      min: Math.min(...scores),
      max: Math.max(...scores),
      avg: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    };
  };

  return {
    videoRef,
    canvasRef,
    postureScore,
    nudgeMessage,
    hasCamera,
    getPostureStats,
  };
}
