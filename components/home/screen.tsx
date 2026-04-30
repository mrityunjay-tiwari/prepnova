import { Safari } from "../ui/safari";
import Image from "next/image";
import ScreenDisplayComponent from "./screen-display-component";

export function Screen() {
  return (
    <div className="w-full max-w-4xl mx-auto z-40">
      <Safari
        url="https://prepnova.in"
        className="flex items-center justify-center"
      >
        <ScreenDisplayComponent />   
      </Safari>
    </div>
  )
}