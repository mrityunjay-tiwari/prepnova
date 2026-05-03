"use client";

import React, {useState} from "react";
import {X, ArrowUp, SmilePlus} from "lucide-react";
import Image from "next/image";

export default function SystemNodePopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute inline-block z-50">
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
        <div className="absolute top-[-20px] left-[60px] w-[320px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
          <div className="p-5 pb-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-3 items-center">
                <Image
                  src="https://ik.imagekit.io/mrityunjay/prepnova/screen-image?updatedAt=1777738073915"
                  alt="Shadcn"
                  width={36}
                  height={36}
                  className="rounded-full w-9 h-9 object-cover"
                />
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-slate-900 text-[15px]">
                    Shadcn
                  </span>
                  <span className="text-[13px] text-slate-400">6:32 pm</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors mt-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body text */}
            <p className="text-slate-600 text-[15px] leading-relaxed ml-12 mb-3 pr-2">
              {`Hey team, I've been thinking about the new dashboard redesign.`}
            </p>

            {/* Reactions */}
            <div className="flex gap-2 ml-12">
              <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600 transition-colors">
                <span></span> <span>2</span>
              </button>
              <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600 transition-colors">
                <span></span> <span>12</span>
              </button>
              <button className="flex items-center justify-center bg-slate-50 border border-slate-100 hover:bg-slate-100 w-7 h-7 rounded-full text-slate-400 transition-colors">
                <SmilePlus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Footer Input */}
          <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
            <input
              type="text"
              placeholder="Reply"
              className="bg-transparent text-[15px] outline-none text-slate-600 placeholder:text-slate-400 w-full"
            />
            <button className="w-7 h-7 bg-slate-200/60 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors shrink-0">
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
