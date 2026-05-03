"use client";

import React from "react";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function InvoiceNode() {
  return (
    <div className="bg-white dark:bg-zinc-950 border shadow-sm border-slate-200 dark:border-zinc-800 px-2.5 py-1.5 rounded-sm rounded-tr-xl p-1 w-[70px] flex flex-col gap-1  transition-colors z-10 relative">
      {/* Header */}
      <div className="flex items-center gap-0.5">
        <IoDocumentTextOutline className="text-orange-500" />
        <span className="text-[10px] text-muted-foreground dark:text-slate-100">
          Report
        </span>
      </div>

      {/* Skeleton Lines */}
      <div className="flex flex-col gap-1 w-full">
        <div className="w-full h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
        
        <div className="flex gap-1.5 w-full">
          <div className="w-[35%] h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
          <div className="w-[55%] h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
        </div>
        
        <div className="w-[85%] h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
        
        <div className="flex gap-1.5 w-full">
          <div className="w-[25%] h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
          <div className="w-[30%] h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
          <div className="w-[35%] h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
        </div>
        
        <div className="w-[60%] h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
        
        <div className="w-[75%] h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
        <div className="w-[60%] h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
               
        {/* Thin divider */}
        <div className="w-full h-[1px] bg-slate-100 dark:bg-zinc-800/80 my-0.5" />
        
        {/* Footer line with orange highlight */}
        <div className="flex gap-1.5 w-full items-center">
          <div className="w-[40%] h-[2.5px] bg-slate-200/80 dark:bg-zinc-800 rounded-full" />
          <div className="w-[50%] h-[2.5px] bg-[#fbbf24] dark:bg-[#fbbf24] rounded-full" />
        </div>
      </div>
    </div>
  );
}
