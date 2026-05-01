import Image from "next/image";
import {PiStarFourFill} from "react-icons/pi";

export default function FLoatingInterviewReportPanel() {
  return (
    <div className="z-30">
      <div className="w-full border rounded-lg  shadow-2xl backdrop-saturate-200">
        <div className="gap-3 border-b border-sidebar-border/70 px-3 py-1.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sidebar-foreground flex items-center gap-2">
                <PiStarFourFill className="w-3.5 h-3.5 backdrop-brightness-200 text-neutral-700 dark:text-neutral-300" />
                Live Interview Feedback
              </h3>
            </div>
          </div>
        </div>

        <div className="px-2 pt-1 pb-3">
          <div className="p-0">
            <div className="px-2 text-sm text-sidebar-foreground/65 flex items-center gap-2">
              Live Guidance
            </div>
            <div className="px-1">
              {
                <div className="rounded dark:border-0 border border-sidebar-border/70 bg-white/80 p-2.5 shadow-2xl">
                  <div className="mb-0.5 flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-sm font-medium text-slate-800">
                      {/* <Sparkles className="h-3 w-3" /> */}
                      Last Answer Feedback
                    </div>
                    <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                      9.5/10
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Overall Great job... Keep it up!
                  </p>
                </div>
              }
            </div>
          </div>

          <div className="p-0 pt-4">
            <div className="">
              <div className="px-2 text-sm dark:text-neutral-500 text-sidebar-foreground/65">
                Presence Tracking
              </div>
              <div className="">
                <div className="rounded rounded-b-md dark:border-0 shadow-xl border border-sidebar-border/70 bg-white/85 p-3">
                  <div className="mb-0.5 flex items-center justify-between">
                    <div className="mb-2 text-sm flex items-center gap-2 font-medium text-slate-800">
                      {/* <ScanEye className="h-4 w-4 text-emerald-600" /> */}
                      Posture & Presence
                    </div>
                    <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                      9.5/10
                    </span>
                  </div>

                  {
                    <div className="relative mx-auto w-full max-w-[280px] aspect-video rounded-md shadow-2xl backdrop-blur-3xl overflow-hidden bg-gray-100">
                      <Image
                        src="https://ik.imagekit.io/mrityunjay/prepnova/person-1_e2jmus.webp?updatedAt=1777513835620"
                        alt="You"
                        className="w-full h-full object-cover shadow-2xl"
                        fill
                      />
                    </div>
                  }

                  <div className="mt-2 text-xs leading-relaxed font-medium text-slate-700">
                    <span className={"text-emerald-600"}>
                      Good - Improve Your Posture by doing this & Stop looking
                      aside!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
