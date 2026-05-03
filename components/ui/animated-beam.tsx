"use client";

import React, { useEffect, useState } from "react";

export interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  pathType?: "orthogonal" | "straight" | "l-shape-right-up" | "l-shape-up-right" | "straight-horizontal";
  elbowFactor?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
  startAnchor?: "center" | "top" | "bottom";
  endAnchor?: "center" | "top" | "bottom";
}

export const AnimatedBeam = ({
  containerRef,
  fromRef,
  toRef,
  reverse = false,
  pathColor = "currentColor",
  pathWidth = 1.5,
  pathOpacity = 0.2,
  gradientStartColor = "#38bdf8",
  gradientStopColor = "#818cf8",
  delay = 0,
  duration = 3,
  pathType = "orthogonal",
  elbowFactor = 0.5,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  startAnchor = "center",
  endAnchor = "center",
}: AnimatedBeamProps) => {
  const [pathD, setPathD] = useState("");

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectA = fromRef.current.getBoundingClientRect();
        const rectB = toRef.current.getBoundingClientRect();

        const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        let startY = rectA.top - containerRect.top + startYOffset;
        if (startAnchor === "center") startY += rectA.height / 2;
        if (startAnchor === "bottom") startY += rectA.height;

        const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
        let endY = rectB.top - containerRect.top + endYOffset;
        if (endAnchor === "center") endY += rectB.height / 2;
        if (endAnchor === "bottom") endY += rectB.height;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        const cornerRadius = 24; 
        const rX = Math.min(cornerRadius, Math.abs(deltaX) / 2);
        const rY = Math.min(cornerRadius, Math.abs(deltaY) / 2);
        const r = Math.min(rX, rY);

        let d = "";
        const dirX = Math.sign(deltaX) || 1;
        const dirY = Math.sign(deltaY) || 1;

        if (r === 0) {
          d = `M ${startX},${startY} L ${endX},${endY}`;
        } else if (pathType === "straight") {
          d = `M ${startX},${startY} L ${endX},${endY}`;
        } else if (pathType === "straight-horizontal") {
          // Force perfectly horizontal line by ignoring endY
          d = `M ${startX},${startY} L ${endX},${startY}`;
        } else if (pathType === "l-shape-right-up") {
          d = `M ${startX},${startY} 
               L ${endX - r * dirX},${startY} 
               Q ${endX},${startY} ${endX},${startY + r * dirY} 
               L ${endX},${endY}`;
        } else if (pathType === "l-shape-up-right") {
          d = `M ${startX},${startY} 
               L ${startX},${endY - r * dirY} 
               Q ${startX},${endY} ${startX + r * dirX},${endY} 
               L ${endX},${endY}`;
        } else {
          // orthogonal
          const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

          if (isHorizontal) {
            const midX = startX + deltaX * elbowFactor;
            const safeMidX = dirX > 0 
              ? Math.min(Math.max(midX, startX + r), endX - r)
              : Math.max(Math.min(midX, startX - r), endX + r);

            d = `M ${startX},${startY} 
                 L ${safeMidX - r * dirX},${startY} 
                 Q ${safeMidX},${startY} ${safeMidX},${startY + r * dirY} 
                 L ${safeMidX},${endY - r * dirY} 
                 Q ${safeMidX},${endY} ${safeMidX + r * dirX},${endY} 
                 L ${endX},${endY}`;
          } else {
            const midY = startY + deltaY * elbowFactor;
            const safeMidY = dirY > 0 
              ? Math.min(Math.max(midY, startY + r), endY - r)
              : Math.max(Math.min(midY, startY - r), endY + r);

            d = `M ${startX},${startY} 
                 L ${startX},${safeMidY - r * dirY} 
                 Q ${startX},${safeMidY} ${startX + r * dirX},${safeMidY} 
                 L ${endX - r * dirX},${safeMidY} 
                 Q ${endX},${safeMidY} ${endX},${safeMidY + r * dirY} 
                 L ${endX},${endY}`;
          }
        }

        setPathD(d);
      }
    };

    const resizeObserver = new ResizeObserver(() => updatePath());

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (fromRef.current) resizeObserver.observe(fromRef.current);
    if (toRef.current) resizeObserver.observe(toRef.current);

    updatePath();

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, fromRef, toRef]);

  const id = React.useId();

  if (!pathD) return null;

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 w-full h-full"
      style={{ zIndex: 0 }}
    >
      {/* Background dotted line */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeDasharray="4 4"
        fill="none"
      />
      {/* Animated beam */}
      <path
        d={pathD}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth + 0.5}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="40 1000"
      >
        <animate
          attributeName="stroke-dashoffset"
          values={reverse ? "0;1000" : "1000;0"}
          dur={`${duration}s`}
          repeatCount="indefinite"
        />
      </path>
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="50%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStartColor} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
