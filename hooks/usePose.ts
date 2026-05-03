import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

const POSE_CONNECTIONS: [number, number][] = [
  [11, 12],
  [11, 13], [13, 15],
  [12, 14], [14, 16],
  [11, 23], [12, 24],
  [23, 24],
  [23, 25], [25, 27],
  [24, 26], [26, 28],
];

export function usePose(
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [postureScore, setPostureScore] = useState(0);
  const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);

  const conditionStartRef = useRef<Record<string, number | null>>({
    eye: null,
    slouch: null,
    shoulders: null,
    hands: null,
  });

  const latestNudgesRef = useRef<
    { message: string; priority: number }[]
  >([]);

  const schedulerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let poseLandmarker: PoseLandmarker;
    let animationFrameId: number;

    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      poseLandmarker = await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        }
      );

      const detect = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
          animationFrameId = requestAnimationFrame(detect);
          return;
        }

        if (video.readyState < 2) {
          animationFrameId = requestAnimationFrame(detect);
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const result = poseLandmarker.detectForVideo(
          video,
          performance.now()
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (result.landmarks.length > 0) {
          const landmarks = result.landmarks[0];

          POSE_CONNECTIONS.forEach(([startIdx, endIdx]) => {
            const start = landmarks[startIdx];
            const end = landmarks[endIdx];

            ctx.beginPath();
            ctx.moveTo(
              start.x * canvas.width,
              start.y * canvas.height
            );
            ctx.lineTo(
              end.x * canvas.width,
              end.y * canvas.height
            );
            ctx.strokeStyle = "rgba(0, 0, 255, 0.7)";
            ctx.lineWidth = 6;
            ctx.stroke();
          });

          landmarks.forEach((point) => {
            ctx.beginPath();
            ctx.arc(
              point.x * canvas.width,
              point.y * canvas.height,
              4,
              0,
              2 * Math.PI
            );
            ctx.fillStyle = "#005ca3";
            ctx.fill();
          });

          const leftShoulder = landmarks[11];
          const rightShoulder = landmarks[12];

          const shoulderDiff = Math.abs(
            leftShoulder.y - rightShoulder.y
          );

          const score = Math.max(0, 1 - shoulderDiff * 5);
          setPostureScore(Number(score.toFixed(2)));

          const now = Date.now();
          const NUDGE_DELAY = 2000;

          const nudges: { message: string; priority: number }[] = [];

          // Eye contact
          const shoulderCenterX =
            (landmarks[11].x + landmarks[12].x) / 2;

          const gazeOffset = Math.abs(
            landmarks[0].x - shoulderCenterX
          );

          if (gazeOffset > 0.07) {
            if (!conditionStartRef.current.eye)
              conditionStartRef.current.eye = now;

            if (now - conditionStartRef.current.eye > NUDGE_DELAY) {
              nudges.push({
                message:
                  "Maintain steady eye contact to build stronger presence.",
                priority: 4,
              });
            }
          } else {
            conditionStartRef.current.eye = null;
          }

          // Slouch
          const verticalDiff =
            landmarks[0].y - landmarks[11].y;

          if (verticalDiff > 0.15) {
            if (!conditionStartRef.current.slouch)
              conditionStartRef.current.slouch = now;

            if (
              now - conditionStartRef.current.slouch >
              NUDGE_DELAY
            ) {
              nudges.push({
                message:
                  "Keep your head aligned with your shoulders.",
                priority: 3,
              });
            }
          } else {
            conditionStartRef.current.slouch = null;
          }

          // Shoulder imbalance
          if (shoulderDiff > 0.06) {
            if (!conditionStartRef.current.shoulders)
              conditionStartRef.current.shoulders = now;

            if (
              now - conditionStartRef.current.shoulders >
              NUDGE_DELAY
            ) {
              nudges.push({
                message:
                  "Align your shoulders to project confidence.",
                priority: 2,
              });
            }
          } else {
            conditionStartRef.current.shoulders = null;
          }

          // Hand spread
          const leftWrist = landmarks[15];
          const rightWrist = landmarks[16];

          const handSpread = Math.abs(
            leftWrist.x - rightWrist.x
          );

          if (handSpread > 0.35) {
            if (!conditionStartRef.current.hands)
              conditionStartRef.current.hands = now;

            if (
              now - conditionStartRef.current.hands >
              NUDGE_DELAY
            ) {
              nudges.push({
                message:
                  "Keep hand movements controlled to appear composed.",
                priority: 1,
              });
            }
          } else {
            conditionStartRef.current.hands = null;
          }

          latestNudgesRef.current = nudges;
        }

        animationFrameId = requestAnimationFrame(detect);
      };

      detect();
    };

    init();

    return () => {
      if (animationFrameId)
        cancelAnimationFrame(animationFrameId);
    };
  }, [videoRef]);

  useEffect(() => {
    schedulerRef.current = setInterval(() => {
      const nudges = latestNudgesRef.current;

      let message = "";

      if (nudges.length > 0) {
        const top = nudges.sort(
          (a, b) => b.priority - a.priority
        )[0];
        message = top.message;
      } else {
        const positives = [
          "You're doing great. Keep it up.",
          "Excellent posture and presence.",
          "You look confident and composed.",
          "Perfect alignment. Stay steady.",
        ];

        message =
          positives[Math.floor(Math.random() * positives.length)];
      }

      setNudgeMessage(message);

      if (clearRef.current) clearTimeout(clearRef.current);

      clearRef.current = setTimeout(() => {
        setNudgeMessage(null);
      }, 3000);
    }, 5000);

    return () => {
      if (schedulerRef.current)
        clearInterval(schedulerRef.current);
      if (clearRef.current)
        clearTimeout(clearRef.current);
    };
  }, []);

  return {
    canvasRef,
    postureScore,
    nudgeMessage,
  };
}