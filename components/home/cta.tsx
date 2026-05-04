"use client";
import React from "react";
import {Button} from "../ui/button";
import {useRouter} from "next/navigation";
import {Highlighter} from "../ui/highlighter";
import Image from "next/image";
import {MousePointerClick} from "lucide-react";

export default function CTA() {
  const router = useRouter();
  return (
    <div className="w-full max-w-5xl mx-auto p-2 md:p-4 my-12">
      <div className="relative w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col md:flex-row items-center min-h-[400px]">
        <div className="w-full md:w-[65%] p-4 md:p-8 lg:p-12 z-10 flex flex-col items-start text-left">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-zinc-100 mb-2">
            Practice, Analyze{" "}
            <Highlighter action="underline" color="#FF9800">
              & Grow
            </Highlighter>
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-base md:text-base mb-8 max-w-[400px]">
            Start your preparation for the Next Interview now !
          </p>

          <Button
            variant="default"
            className="rounded-full flex gap-2 items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.30)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)] transition-all hover:cursor-pointer"
            onClick={() => router.push("/interview")}
          >
            Start Interview <MousePointerClick className="size-4" />
          </Button>
        </div>

        <div className="w-full md:w-[45%] h-[300px] md:h-full absolute bottom-0 right-0 block overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[5%] right-[-10%] bottom-[-10%] bg-white dark:bg-zinc-950 rounded-tl-2xl border border-slate-100 dark:border-zinc-800 shadow-lg flex flex-col">
            <div className="h-12 border-b border-slate-50 dark:border-zinc-800/50 flex items-center px-5 gap-2 w-full">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-zinc-800" />
            </div>

            <div className="flex-1 relative flex">
              <div className="flex-1 bg-white dark:bg-zinc-950 shadow-xl" />
              <Image
                fill
                src={
                  "https://ik.imagekit.io/mrityunjay/prepnova/screen-image?updatedAt=1777738073915"
                }
                alt=""
                className="object-cover object-bottom-left dark:hidden"
              />
              <Image
                fill
                src={
                  "https://ik.imagekit.io/mrityunjay/prepnova/dark_mode_footer_image"
                }
                alt=""
                className="hidden dark:block object-cover object-bottom-left"
              />
              <div
                className="w-64 lg:w-60 h-full border-l border-slate-50 dark:border-zinc-800/50 bg-[repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9_1px,transparent_1px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,#27272a,#27272a_1px,transparent_1px,transparent_8px)]"
              />
            </div>
          </div>

          <div className="absolute top-[10%] right-[-5%] w-[45%] bottom-[-10%] bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-tl-2xl shadow-2xl">
            <Image
              fill
              src={
                "https://ik.imagekit.io/mrityunjay/prepnova/ChatGPT%20Image%20May%202,%202026,%2003_28_14%20PM.png"
              }
              alt=""
              className="object-cover object-top-left dark:hidden"
            />
            <Image
              fill
              src={
                "https://ik.imagekit.io/mrityunjay/prepnova/ChatGPT%20Image%20May%203,%202026,%2009_26_21%20PM.png"
              }
              alt=""
              className="object-cover object-top-left hidden dark:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
