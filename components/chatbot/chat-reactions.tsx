"use client";

import {IoReload} from "react-icons/io5";
import {useState} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "../ui/tooltip";
import {Check, Copy, ThumbsDown, ThumbsUp} from "lucide-react";
import {cn} from "@/lib/utils";

interface ChatReactionProps {
  regenerate: () => void;
  copyResponse: () => void;
}
export default function ChatReactions({
  regenerate,
  copyResponse,
}: ChatReactionProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex gap-2.5 text-neutral-500">
      <Tooltip>
        <TooltipTrigger asChild>
          <ThumbsUp
            size={12}
            className={cn(
              `w-3 h-3 hover:cursor-pointer ${upvoted ? "text-blue-500" : ""}`,
            )}
            onClick={() => {
              setUpvoted(!upvoted);
              if (downvoted) setDownvoted(false);
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Good Response</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ThumbsDown
            size={12}
            className={cn(
              `w-3 h-3 hover:cursor-pointer ${downvoted ? "text-blue-500" : ""}`,
            )}
            onClick={() => {
              setDownvoted(!downvoted);
              if (upvoted) setUpvoted(false);
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Bad Response</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <IoReload
            className="w-3 h-3 hover:rotate-90 transition-all duration-500 hover:cursor-pointer"
            onClick={regenerate}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Regenrate Response</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          {copied ? (
            <Check className="h-3 w-3 text-blue-500 transition-colors" />
          ) : (
            <Copy
              className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer"
              onClick={() => {
                copyResponse();
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy Response</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
