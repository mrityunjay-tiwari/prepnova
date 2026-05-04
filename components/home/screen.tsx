import { Safari } from "../ui/safari";
import Image from "next/image";
import ScreenDisplayComponent from "./screen-display-component";
import FLoatingInterviewReportPanel from "./floating-interview-analysis-panel";

export function Screen() {
  return (
    <div className="w-[95%] max-w-4xl mx-auto z-20">
      <Safari
        url="https://prepnova.in"
        className="flex items-center justify-center"
      >
        <ScreenDisplayComponent />   
      <div className="scale-40 md:scale-100 origin-top-right absolute top-1.5 right-1.5">
        <FLoatingInterviewReportPanel />
      </div>
      </Safari>
    </div>
  )
}