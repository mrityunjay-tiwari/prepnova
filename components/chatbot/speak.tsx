"use client";

import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {MicIcon, StopCircle, StopCircleIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {FaStopCircle} from "react-icons/fa";
import {Spinner} from "../kibo-ui/spinner";

interface VoiceTranscriptionProps {
  transcript: string;
  setTranscript: React.Dispatch<React.SetStateAction<string>>;
  onCompletion: (transcript: string) => Promise<void>;
  isFormattingInput: boolean;
  setItIsListening: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function VoiceTranscription({
  transcript,
  setTranscript,
  onCompletion,
  isFormattingInput,
  setItIsListening,
}: VoiceTranscriptionProps) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const RecognitionConstructor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!RecognitionConstructor) {
      alert("Speech Recognition API not supported");
      return;
    }

    const recognition = new RecognitionConstructor();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += text + " ";
          console.log("Final:", text);
        } else {
          interimTranscript += text;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      if (isListening) recognition.start();
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const startListening = () => {
    if (!isListening) {
      setItIsListening(true);
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const stopListening = () => {
    setItIsListening(false)
    setIsListening(false);
    recognitionRef.current?.stop();
    onCompletion(transcript);
    console.log(transcript);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex gap-2">
          <Button
            onClick={startListening}
            type="button"
            disabled={isListening}
            variant={"ghost"}
            className={cn(
              `rounded-full ${isListening || isFormattingInput ? "hidden" : "inline-block"}`,
            )}
          >
            {<MicIcon className="size-4 text-neutral-600 dark:text-neutral-400" />}
          </Button>

          <Button
            variant="ghost"
            type="button"
            onClick={stopListening}
            className={cn(
              `rounded-full ${isListening ? "inline-block" : "hidden"}`,
            )}
          >
            <div className="relative w-3 h-3 flex items-center justify-center">
              {/* <div className="w-5 h-5 rounded-full bg-red-400 animate-in z-10 absolute justify-self-center"></div> */}
              <div className="w-7 h-7 rounded-full bg-orange-300 animate-[ping_1.5s_ease-in-out_infinite] absolute justify-self-center"></div>
              <div className=" z-20">
                <FaStopCircle className="text-orange-400" />
              </div>
            </div>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              `rounded-full ${isFormattingInput ? "inline-block" : "hidden"}`,
            )}
          >
            <Spinner variant="throbber" size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
