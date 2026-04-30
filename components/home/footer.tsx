import SocialSelector from "@/src/components/smoothui/social-selector";
import {Tooltip, TooltipContent, TooltipTrigger} from "../ui/tooltip";
import {CircleDot, MousePointerClick} from "lucide-react";
import Link from "next/link";

import { redirect } from "next/navigation";

export default function Footer() {
  return (
    <footer className="mb-10 mx-2 md:mx-0 flex flex-col items-center">
      <SocialSelector />
      <div className="text-xs md:text-sm flex items-center gap-1 text-neutral-400">
        © 2026 <Link href={'https://mrityunjay.site'} target="_blank" className="text-neutral-400 hover:text-neutral-500 transition-colors duration-200 flex items-center gap-1">Mrityunjay Tiwari<MousePointerClick className="size-4" /></Link>
      </div>
    </footer>
  );
}

// © 2026
