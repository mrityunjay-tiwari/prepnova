"use client";

import {
  Content as PopoverContent,
  Portal as PopoverPortal,
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from "@radix-ui/react-popover";
import { User, LogOut } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";

export interface UserData {
  name: string;
  email: string;
  avatar: string;
}

export interface UserAccountAvatarProps {
  user: UserData;
  onLogout?: () => void;
  className?: string;
}

export default function UserAccountAvatar({
  user,
  onLogout,
  className = "",
}: UserAccountAvatarProps) {
  const [userData, setUserData] = useState<UserData>(user);
  const shouldReduceMotion = useReducedMotion();

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <button
          className={`flex cursor-pointer items-center gap-2 rounded-full border bg-background ${className}`}
          type="button"
        >
          <img
            alt="User Avatar"
            className="rounded-full"
            height={48}
            src={userData.avatar}
            width={48}
          />
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          className="z-50 w-64 overflow-hidden rounded-xl border bg-background shadow-xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
          sideOffset={8}
          style={{ pointerEvents: "auto" }}
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { height: "auto" }}
            initial={shouldReduceMotion ? {} : { height: "auto" }}
            style={{ pointerEvents: "auto" }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", duration: 0.25, bounce: 0 }
            }
          >
            <div
              className="flex flex-col divide-y divide-border"
              style={{ pointerEvents: "auto" }}
            >
              <button
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-sm transition-colors text-foreground hover:bg-muted `}
                type="button"
              >
                <User className="shrink-0" size={16} />
                {userData.name}
              </button>
              <button
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-sm transition-colors text-foreground hover:bg-muted `}
                type="button"
              >
                <MdOutlineAlternateEmail className="shrink-0" size={16} />
                {userData.email}
              </button>
       
              {onLogout && (
                <button
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-sm text-red-500 transition-colors hover:bg-red-500/10"
                  onClick={() => onLogout()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onLogout();
                    }
                  }}
                  type="button"
                >
                  <LogOut className="shrink-0" size={16} />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
}
