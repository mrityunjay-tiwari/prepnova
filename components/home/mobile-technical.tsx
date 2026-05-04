import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Separator} from "../ui/separator";
import {Button} from "../ui/button";
import Headings from "./headings";
import {ImageZoom} from "@/components/kibo-ui/image-zoom";
import Image from "next/image";

export function MobileTechnical() {
  return (
    <>
      <div className="max-w-5xl w-full">
        <Headings title="How The System Thinks" subtitle="For Engineers : System Design" />
        <div className="p-3 md:p-10 rounded-none md:rounded-xl mt-5 bg-white dark:bg-zinc-900 w-full flex justify-center shadow-sm dark:shadow-none border border-gray-100 dark:border-white/5">
          <ImageZoom>
            <Image
              alt="system design image"
              className="dark:hidden h-auto w-full rounded-none md:rounded-xl backdrop-blur-2xl shadow-md"
              height={2000}
              src="https://ik.imagekit.io/mrityunjay/prepnova/system-design-mobile-view_light"
              unoptimized
              width={1500}
            />
            <Image
              alt="system design image"
              className="dark:block hidden h-auto w-full rounded-none md:rounded-xl backdrop-blur-2xl shadow-md"
              height={2000}
              src="https://ik.imagekit.io/mrityunjay/prepnova/system-design-mobile-view"
              unoptimized
              width={1500}
            />
           
          </ImageZoom>
        </div>
      </div>
    </>
  );
}
