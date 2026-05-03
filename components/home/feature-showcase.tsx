"use client";

import React, {useState, useEffect} from "react";
import Image from "next/image";
import {cn} from "@/lib/utils";
import Headings from "./headings";

const features = [
  {
    id: 1,
    title: "Detailed Interview Analysis",
    description:
      "Get detailed feedback on your answers, communication with executionable insights.",
    image:
      "https://ik.imagekit.io/mrityunjay/prepnova/ChatGPT%20Image%20May%202,%202026,%2003_31_40%20PM.png",
  },
  {
    id: 2,
    title: "Progress Dashboard",
    description:
      "Track your progress over time and get detailed insights on your performance.",
    image:
      "https://ik.imagekit.io/mrityunjay/prepnova/ChatGPT%20Image%20May%202,%202026,%2003_28_14%20PM.png",
  },
];

export function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const duration = 4500; // 1.5 seconds

  useEffect(() => {
    let animationFrame: number;
    let startTime: number | null = null;
    let currentProgress = progress;

    const animate = (timestamp: number) => {
      if (isHovered) {
        startTime = null;
        return;
      }

      if (!startTime) {
        startTime = timestamp - (currentProgress / 100) * duration;
      }

      const elapsed = timestamp - startTime;
      currentProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(currentProgress);

      if (currentProgress < 100) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Switch to the next card and reset progress
        setActiveIndex((prev) => (prev + 1) % features.length);
        setProgress(0);
        currentProgress = 0;
        startTime = null;
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [activeIndex, isHovered, duration]);

  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-12 font-sans bg-white dark:bg-inherit text-slate-900 dark:text-inherit rounded-3xl">
      <Headings
        subtitle="Post Interview"
        title="Analysis and Progress Tracking"
      />

      <div
        className="flex flex-col md:flex-row gap-2 md:gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {features.map((feature, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={feature.id}
              className={cn(
                "flex flex-col cursor-pointer transition-all duration-700 ease-in-out",
                isActive ? "md:flex-[2]" : "md:flex-[1]",
              )}
              onClick={() => handleCardClick(index)}
            >
              <div
                className={cn(
                  "relative w-full rounded-xl overflow-hidden transition-all duration-700 ease-in-out bg-white border-b border-l shadow-md",
                  "h-[250px] sm:h-[350px] md:h-[400px]",
                )}
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className={cn(
                    "object-contain transition-transform duration-1000",
                    isActive ? "scale-100" : "scale-105",
                  )}
                  priority={index === 0}
                />

                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-linear-to-br shadow-[0_4px_15px_rgba(37,99,235,0.4)] from-blue-500 to-blue-600 text-white font-semibold text-base rounded-xl w-10 h-10 flex items-center justify-center mb-1">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="mt-3 md:mt-4 flex flex-col">
                <h3
                  className={cn(
                    "text-lg md:text-xl font-semibold transition-colors duration-300",
                    isActive
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-900 dark:text-zinc-400",
                  )}
                >
                  {feature.title}
                </h3>

                  {/* Progress bar container */}
                <div className="relative mt-2.5 mb-2.5 h-px w-full bg-slate-200 overflow-hidden">
                  {isActive && (
                    <div
                      className="absolute top-0 left-0 h-full bg-slate-900 transition-none"
                      style={{width: `${progress}%`}}
                    />
                  )}
                </div>

                <p
                  className={cn(
                    "text-sm md:text-md leading-relaxed transition-colors duration-300",
                    isActive
                      ? "text-slate-600 dark:text-zinc-400"
                      : "text-slate-400 dark:text-zinc-600",
                  )}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
