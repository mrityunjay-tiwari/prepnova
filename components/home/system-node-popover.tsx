"use client";

import React, {useState} from "react";
import {X, ArrowUp, SmilePlus} from "lucide-react";
import Image from "next/image";

type TSystemNodePopover = {
  title?: string;
  description?: string;
  decision?: string;
};

export default function SystemNodePopover({
  title,
  description,
  decision,
}: TSystemNodePopover) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`absolute inline-block ${isOpen ? "z-[100]" : "z-50"}`}>
      {/* Trigger Bubble */}
      <div
        className="w-8 h-8 bg-[#6366f1] rounded-t-full rounded-br-full rounded-bl-sm flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform relative z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src="https://ik.imagekit.io/mrityunjay/prepnova/screen-image?updatedAt=1777738073915"
          alt="Avatar"
          width={36}
          height={36}
          className="rounded-full object-cover w-6 h-6 border-[2px] border-[#6366f1]"
        />
      </div>

      {/* Popover */}
      {isOpen && (
        <div className="absolute top-[-20px] left-[60px] w-[320px] bg-white dark:bg-zinc-950 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-zinc-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
          <div className="p-5 pb-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-3 items-center">
                {/* <Image
                  src="https://ik.imagekit.io/mrityunjay/prepnova/screen-image?updatedAt=1777738073915"
                  alt="Shadcn"
                  width={36}
                  height={36}
                  className="rounded-full w-9 h-9 object-cover"
                /> */}
                ?
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-slate-900 dark:text-zinc-100 text-[15px]">
                    {title || "System"}
                  </span>
                  {/* <span className="text-[13px] text-slate-400 dark:text-zinc-500">6:32 pm</span> */}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors mt-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body text */}
            <p className="text-slate-600 dark:text-zinc-400 text-[15px] leading-relaxed ml-4 mb-3 pr-2">
              {description || "Hello world"}
            </p>

            {/* Reactions */}
          </div>

          {/* Footer Input */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between">
            {/* <input
              type="text"
              placeholder="Reply"
              className="bg-transparent text-[15px] outline-none text-slate-600 dark:text-zinc-300 placeholder:text-slate-400 dark:placeholder:text-zinc-600 w-full"
            />
            <button className="w-7 h-7 bg-slate-200/60 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-full flex items-center justify-center text-slate-600 dark:text-zinc-400 transition-colors shrink-0">
              <ArrowUp className="w-4 h-4" />
            </button> */}
            <h1 className="text-slate-600 dark:text-zinc-400 text-[15px] leading-relaxed ml-4 mb-3 pr-2">
              Decision : {decision || "Pending"}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}
