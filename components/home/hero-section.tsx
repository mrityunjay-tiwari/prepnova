import {handwriting_font} from "@/utils/fonts";
import {Highlighter} from "../ui/highlighter";
import JoinMeeting from "./join-meeting";

export default function HeroSection() {
  return (
    <div className="w-full md:max-w-4xl mx-auto mt-20 md:mt-48">
      {/* heading */}
      <div className="text-left">
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
      {/* description */}
      <div className="text-left mt-4">
        <h1 className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400">
          With our Voice Agent get exact Interview experience for your <br />
          specific role with Real Time Feedback and Detailed Analysis.
        </h1>
      </div>
      {/* may here i have some imp message or sth */}
      <div className="mt-8">
        <JoinMeeting />
      </div>
    </div>
  );
}
