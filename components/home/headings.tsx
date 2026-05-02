import {Button} from "../ui/button";
import {Highlighter} from "@/components/ui/highlighter";

type THeadingProps = {
  title?: string;
  subtitle: string;
  subheading?: string;
};
export default function Headings({title, subtitle, subheading}: THeadingProps) {
  return (
    <>
      <div className="max-w-5xl mt-10 md:mt-20">
        <div className="w-full flex justify-center items-center">
          <Button
            variant={"outline"}
            size={"lg"}
            className="hidden md:block rounded-none md:rounded-full shadow-lg"
          >
            <span className="font-semibold">{subtitle}</span>
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            className="md:hidden rounded-xs md:rounded-full shadow-lg"
          >
            <span className="font-semibold">{subtitle}</span>
          </Button>
        </div>
        <div className="flex flex-col justify-center items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-medium mt-4 text-center">
            {title}
          </h1>
          <Highlighter action="underline" color="#FF9800">
            {subheading}
          </Highlighter>
        </div>
      </div>
    </>
  );
}
