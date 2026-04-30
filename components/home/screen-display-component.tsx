import {
  Video,
  MicOff,
  Smile,
  MonitorUp,
  Phone,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import AgentAvatar from "../ui/agent-avatar";

export default function ScreenDisplayComponent() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-[#fcfcfc] dark:bg-zinc-950 px-20 pb-14 pt-14">
      {/* Video Grid */}
      <div className="flex items-center justify-center gap-4 w-full max-w-[90%] flex-1 min-h-0 mb-8">
        {/* Person 1 (You) */}
        <div className="relative w-1/2 h-full rounded-lg overflow-hidden border-2 border-[#00d084] shadow-sm bg-gray-100">
          <Image
            src="https://ik.imagekit.io/mrityunjay/prepnova/person-1_e2jmus.webp?updatedAt=1777513835620"
            alt="You"
            className="w-full h-full object-cover"
            fill
          />
          <div className="absolute bottom-3.5 left-3.5 bg-black/30 text-white text-[13px] px-1.5 py-1 rounded-sm backdrop-blur-xl">
            You
          </div>
        </div>

        {/* Person 2 (Mira) */}
        <div className="relative w-1/2 h-full rounded-lg overflow-hidden shadow-sm bg-gray-100">
          {/* <Image
            src="https://ik.imagekit.io/mrityunjay/prepnova/teach%20(11).png"
            alt="Mira"
            className="w-full h-full object-cover"
            fill
          /> */}
          <div className="flex items-center justify-center w-full h-full">
            <AgentAvatar size={120} seed="" />
          </div>
          <div className="absolute bottom-3.5 left-3.5 bg-black/30 text-white text-[13px] px-1.5 py-1 rounded-sm backdrop-blur-xl">
            Kirosk (AI Interviewer)
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 shrink-0">
        <div className="flex items-center justify-center">
          <Button size={"xs"} variant={"ghost"} className="hover:cursor-pointer flex items-center-safe justify-center gap-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 px-2.5 py-0 rounded-l-full rounded-r-lg text-xs font-medium shadow-sm transition-all">
            <Video className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
            Camera
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </Button>

          <Button size={"xs"} variant={"ghost"} className="hover:cursor-pointer flex items-center gap-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 px-2.5 py-1.5 rounded-r-full text-xs font-medium shadow-sm transition-all">
            <MicOff className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
            Microphone
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </Button>
        </div>

        <button className="hover:cursor-pointer flex items-center justify-center w-7.5 h-7.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-full shadow-sm transition-all">
          <Smile className="w-3.5 h-3.5" />
        </button>

        <button className="hover:cursor-pointer flex items-center justify-center w-7.5 h-7.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-full shadow-sm transition-all">
          <MonitorUp className="w-3.5 h-3.5" />
        </button>

        <button className="hover:cursor-pointer flex items-center justify-center w-12 h-7.5 bg-[#e63946] hover:bg-[#d32f3a] text-white rounded-full shadow-xl transition-all ml-1">
          <Phone className="w-3.5 h-3.5" style={{transform: "rotate(135deg)"}} />
        </button>
      </div>
    </div>
  );
}
