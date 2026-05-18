import {handwriting_font} from "@/utils/fonts";
import {Highlighter} from "../ui/highlighter";
import JoinMeeting from "./join-meeting";

export default function HeroSection() {
  return (
    <div className="w-[95%] md:max-w-4xl mx-auto pt-34 md:pt-0 md:mt-48">
      {/* heading */}
      <div className="hidden md:block text-left">
        <h1 className="text-3xl md:text-6xl font-semibold">Prepare for</h1>
        <h1 className="text-3xl md:text-6xl font-semibold mt-3">
          Your{" "}
          <span className={`${handwriting_font.className} italic font-light`}>
            <Highlighter action="underline" color="#FF9800">
              Next Interview
            </Highlighter>
          </span>
          .
        </h1>
      </div>

      <div className="md:hidden text-center">
        <h1 className="text-3xl md:text-6xl font-semibold">Prepare for Your</h1>
        <h1 className="text-3xl md:text-6xl font-semibold mt-1">
         
          <span className={`${handwriting_font.className} italic font-light`}>
            <Highlighter action="underline" color="#FF9800">
              Next Interview
            </Highlighter>
          </span>
          .
        </h1>
      </div>

      {/* description */}
      <div className="hidden md:block text-left mt-4">
        <h1 className="text-base md:text-xl text-neutral-500 dark:text-neutral-400">
          With our Interview Agent get exact Interview experience for your{" "}
          <br />
          specific role with Real Time Feedback and Post Detailed Analysis.
        </h1>
      </div>
      
      <div className="md:hidden flex w-full px-6 text-center mt-4">
        <h1 className="text-sm md:text-xl text-neutral-500 dark:text-neutral-400">
          {`Practise Interviews with our Agent for your specific`}{" "}
          
          role with Real Time Feedback & Detailed Analysis.
        </h1>
      </div>
      {/* may here i have some imp message or sth */}
      <div className="mt-8 md:mt-8">
        <JoinMeeting />
      </div>
    </div>
  );
}
