"use client";

import {cn} from "@/lib/utils";
import {XIcon} from "../hover-icons/close";
import {MessageCircleIcon} from "../hover-icons/message-circle";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../ui/tooltip";
import {useEffect, useRef, useState} from "react";
import {marker, sans} from "@/lib/fonts";
import Image from "next/image";
import {Button} from "../ui/button";
import {SendIcon} from "lucide-react";
import {AnimatePresence, motion} from "motion/react";
import {Textarea} from "../ui/textarea";
import VoiceTranscription from "./speak";
import {useChat} from "@ai-sdk/react";
import {DefaultChatTransport} from "ai";
import {FaStop} from "react-icons/fa6";
import {IoIosCheckmark} from "react-icons/io";
import {Spinner} from "../kibo-ui/spinner";
import {CheckCheckIcon} from "../hover-icons/doublecheck";
import {ChevronDownIcon} from "../hover-icons/down-arrow";
import ChatReactions from "./chat-reactions";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
import MarkDownRenderer from "./react-markdown";

type MessageMeta = {
  time: string;
  state: "sending" | "sent" | "delivered";
};

const WELCOME_MESSAGE = {
  id: "welcome-message",
  role: "assistant" as const,
  parts: [
    {
      type: "text" as const,
      text: "Hello and welcome! I'm Mrityunjay's AI.\nAsk me anything — projects, ideas, or just chat.",
    },
  ],
};

const ASK = [
  {
    id: 1,
    message: "What is my tech stack ?",
  },
  {
    id: 2,
    message: "What is your college name ?",
  },
  {
    id: 3,
    message: "What is your next idea ?",
  },
  {
    id: 4,
    message: "What is your work experience ?",
  },
];
export default function ChatBotOpenButton() {
  const [expanded, setExpanded] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isFormattingInput, setIsFormattingInput] = useState(false);
  const [itisListening, setItIsListening] = useState(false);
  const {messages, sendMessage, status, error, stop, setMessages, regenerate} =
    useChat({
      transport: new DefaultChatTransport({
        api: "/api/chatbot",
      }),
    });
  const formRef = useRef<HTMLFormElement | null>(null);
  const [messageMeta, setMessageMeta] = useState<MessageMeta[]>([]);
  const lastUserMessageIndexRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRef = useRef(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [givenQuestionNotAsked, setGivenQuestionNotAsked] = useState(true);

  const hasInjectedWelcomeRef = useRef(false);

  useEffect(() => {
    if (!expanded) return;
    if (hasInjectedWelcomeRef.current) return;

    hasInjectedWelcomeRef.current = true;

    setMessages([WELCOME_MESSAGE]);

    setMessageMeta([
      {
        time: getCurrentTime(),
        state: "delivered",
      },
    ]);
  }, [expanded, setMessages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const threshold = 50;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    const isNearBottom = distanceFromBottom < threshold;

    autoScrollRef.current = isNearBottom;
    setShowScrollToBottom(!isNearBottom);
  };

  useEffect(() => {
    if (status === "streaming") {
      setShowScrollToBottom(false);
    }
  }, [status]);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });

    autoScrollRef.current = true;
    setShowScrollToBottom(false);
  };

  const handleSetInputValue = async (transcript: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000); // 5 seconds
    try {
      if (transcript.length != 0) {
        setIsFormattingInput(true);

        const formattedText = await fetch("/api/correct-prompt-punctuation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({prompt: transcript}),
        });

        const data = await formattedText.json();
        console.log(data);
        setIsFormattingInput(false);
        setInputValue(data.text);
      }
    } catch (err) {
      setInputValue(transcript);
      console.error("Was unable to format", err);
    } finally {
      clearTimeout(timeoutId);
      setIsFormattingInput(false);
    }
  };
  // console.log("transcript from chatbot comp", transcript);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setGivenQuestionNotAsked(false);
    sendMessage({text: inputValue});

    const index = messageMeta.length;
    lastUserMessageIndexRef.current = index;

    setMessageMeta((prev) => [
      ...prev,
      {
        time: getCurrentTime(),
        state: "sending",
      },
    ]);
    setInputValue("");
    console.log("messages are :", messages, inputValue);
  };

  useEffect(() => {
    if (!messages.length) return;

    const lastIndex = messages.length - 1;
    const lastMessage = messages[lastIndex];

    if (lastMessage.role !== "user") return;

    setMessageMeta((prev) => {
      if (!prev[lastIndex]) return prev;

      const updated = [...prev];

      if (status === "streaming") {
        updated[lastIndex] = {...updated[lastIndex], state: "sent"};
      }

      if (status === "ready") {
        updated[lastIndex] = {...updated[lastIndex], state: "delivered"};
      }

      return updated;
    });
  }, [status, messages]);

  useEffect(() => {
    if (messageMeta.length < messages.length) {
      setMessageMeta((prev) => [
        ...prev,
        {
          time: getCurrentTime(),
          state: "delivered",
        },
      ]);
    }
  }, [messages]);

  useEffect(() => {
    const index = lastUserMessageIndexRef.current;
    if (index === null) return;

    setMessageMeta((prev) => {
      if (!prev[index]) return prev;

      const updated = [...prev];

      if (status === "streaming") {
        updated[index] = {...updated[index], state: "sent"};
      }

      if (status === "ready") {
        updated[index] = {...updated[index], state: "delivered"};
        lastUserMessageIndexRef.current = null;
      }

      return updated;
    });
  }, [status]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (!autoScrollRef.current) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (status !== "streaming") return;

    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "auto",
    });
  }, [status]);

  return (
    <div className="fixed z-20 rounded-full  bottom-5 right-5 hover:cursor-pointer">
     
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="rounded-full p-5 bg-neutral-800 dark:bg-neutral-200 w-full"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <XIcon className="text-neutral-50 dark:text-neutral-950" size={18} />
            ) : (
              <MessageCircleIcon className="text-neutral-50 dark:text-neutral-950" size={18} />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{expanded ? "Close chat" : "Chat with my AI"}</p>
        </TooltipContent>
      </Tooltip>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: "500px"}}
            exit={{opacity: 0, height: 0}}
            transition={{
              duration: 0.35,
              ease: [0.4, 0, 0.2, 1], // material-like easing
            }}
            className="absolute bottom-16 shadow-xl right-0 rounded-xl w-[92vw] md:w-[520px] h-[500px] bg-neutral-50 dark:bg-neutral-900 border overflow-hidden"
          >
            <div className="w-full border-b flex items-center gap-2 px-4 py-3">
              <div className="">
                <div className="rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.12)] p-1 border">
                  <Image
                    src={"https://ik.imagekit.io/mrityunjay/profile.jpg"}
                    alt=""
                    width={20}
                    height={20}
                    className="rounded"
                  />
                </div>
              </div>
              <div className={cn(`flex flex-col items-start`)}>
                <p
                  className={cn(
                    `text-sm font-medium text-neutral-700 dark:text-neutral-300 ${sans.className}`,
                  )}
                >{`Mrityunjay's AI`}</p>
                <div
                  className={cn(
                    `text-xs text-neutral-500 dark:text-neutral-400 flex gap-1 items-start ${sans.className}`,
                  )}
                >
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative w-3 h-3 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-in z-10 absolute justify-self-center"></div>
                          <div className="w-2 h-2 rounded-full bg-blue-300 animate-[ping_1.5s_ease-in-out_infinite] absolute justify-self-center"></div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Online</p>
                      </TooltipContent>
                    </Tooltip>
                    Available
                  </div>
                  {/* <Image
                    src={"https://ik.imagekit.io/mrityunjay/gemini.jpg"}
                    alt=""
                    width={35}
                    height={35}
                    className="dark:hidden"
                  />
                  <Image
                    src={"https://ik.imagekit.io/mrityunjay/TechStack/gemini-dark.png"}
                    alt=""
                    width={35}
                    height={35}
                    className="dark:inline hidden"
                  /> */}
                </div>
              </div>
            </div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className={cn(
                `h-[80%] absolute w-full bg-neutral-50 dark:bg-neutral-950 overflow-y-auto px-5 pb-5 thin-scrollbar hover:cursor-default ${sans.className}`,
              )}
            >
              {error && (
                <div className="text-red-500 mb-4"> {error.message}</div>
              )}
              {messages.map((message, index) => {
                const meta = messageMeta[index];
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start justify-start gap-1",
                      isUser ? "justify-end " : "justify-start items-start  ",
                    )}
                  >
                    {isUser ? (
                      ""
                    ) : (
                      <div className="rounded-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)] p-1 border mt-3.5">
                        <Image
                          src={"https://ik.imagekit.io/mrityunjay/profile.jpg"}
                          alt=""
                          width={15}
                          height={15}
                          className="rounded"
                        />
                      </div>
                    )}

                    {message.parts.map((part, index) => {
                      if (part.type !== "text") return null;

                      return (
                        <div
                          key={`${message.id}-${index}`}
                          className="max-w-[80%] break-words overflow-hidden"
                        >
                          <div
                            className={cn(
                              "w-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.09)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.12)]  rounded-lg  text-sm my-2",
                              isUser
                                ? "bg-blue-100 text-neutral-800 rounded-tr-none px-3 pt-2 pb-1"
                                : "bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200 text-neutral-800 rounded-tl-none px-3 py-2",
                            )}
                          >
                            <MarkDownRenderer content={part.text} />
                            <div className="flex -mr-1.5 items-center justify-end gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 font-light">
                              <div>{meta?.time}</div>
                              {isUser && (
                                <>
                                  {meta?.state === "sending" && (
                                    <IoIosCheckmark size={14} />
                                  )}
                                  {meta?.state === "sent" && (
                                    <CheckCheckIcon size={10} />
                                  )}
                                  {meta?.state === "delivered" && (
                                    <CheckCheckIcon
                                      size={10}
                                      className="text-blue-700"
                                    />
                                  )}
                                  {}
                                </>
                              )}
                            </div>
                            {!isUser && status === "ready" && (
                              <ChatReactions
                                regenerate={regenerate}
                                copyResponse={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <AnimatePresence initial={false}>
                {givenQuestionNotAsked && (
                  <motion.div
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: "auto"}}
                    exit={{opacity: 0, height: 0}}
                    transition={{
                      duration: 0.35,
                      ease: [0.4, 0, 0.2, 1], // material-like easing
                    }}
                    className="flex flex-col gap-2"
                  >
                    <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Ask :
                    </div>
                    <div className="flex flex-wrap gap-2 w-full ">
                      {ASK.map((msg, index) => (
                        <Button
                          key={msg.id}
                          variant={"outline"}
                          className="rounded-xl text-neutral-950 dark:text-inherit dark:bg-neutral-800 hover:dark:bg-neutral-700 hover:cursor-pointer text-xs shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]"
                          onClick={() => {
                            // setInputValue(msg.message);
                            setGivenQuestionNotAsked(false);
                            // handleSubmit()
                            sendMessage({text: msg.message});
                          }}
                        >
                          {msg.message}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {status === "submitted" && (
                <div className="flex items-center gap-1 text-xs">
                  <Spinner variant="throbber" size={12} />
                  <span className="animate-pulse">Thinking...</span>
                </div>
              )}
            </div>
            {showScrollToBottom && (
              <Button
                onClick={scrollToBottom}
                variant={"outline"}
                size={"icon"}
                className="relative top-[300px] left-[240px] rounded-full dark:text-white dark:bg-neutral-900"
              >
                <ChevronDownIcon className="" size={14} />
              </Button>
            )}
            <form onSubmit={handleSubmit} ref={formRef} action={""}>
              <div className="absolute bottom-0 w-full border-t px-4 py-3 flex items-center bg-white dark:bg-neutral-900">
                <Textarea
                  className="rounded-lg resize-none max-h-20 thin-scrollbar dark:bg-neutral-900"
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={2}
                  disabled={itisListening || isFormattingInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // stop newline
                      formRef.current?.requestSubmit();
                    }
                  }}
                />
                <div>
                  <VoiceTranscription
                    transcript={transcript}
                    setTranscript={setTranscript}
                    onCompletion={handleSetInputValue}
                    isFormattingInput={isFormattingInput}
                    setItIsListening={setItIsListening}
                  />
                </div>
                {/* <VoiceInput /> */}
                {status === "submitted" || status === "streaming" ? (
                  <Button
                    onClick={stop}
                    variant={"ghost"}
                    size={"icon"}
                    className="rounded-full animate-pulse"
                  >
                    <FaStop />
                  </Button>
                ) : (
                  <Button
                    className="rounded-full"
                    type="submit"
                    size={"icon"}
                    disabled={
                      itisListening ||
                      isFormattingInput ||
                      status !== "ready" ||
                      inputValue.length === 0
                    }
                  >
                    <SendIcon />
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
