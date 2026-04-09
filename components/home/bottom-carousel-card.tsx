import { sans } from "@/lib/fonts";
import Image from "next/image";

type CarouselSlideProps = {
  image: string;
  title: string;
  description: string;
}

export default function CarouselSlide({
  image,
  title,
  description,
}: CarouselSlideProps) {
  return (
    <div className="flex flex-col items-center text-center py-8">
      {/* Circular Image */}
      <div className="relative w-32 h-32 md:w-52 md:h-52 rounded-full overflow-hidden bg-white dark:bg-inherit flex items-center justify-center">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-4"
        />
      </div>

      {/* Text Section */}
      <div className="max-w-md space-y-3">
        <h2 className={`md:text-lg font-medium text-neutral-800 dark:text-neutral-100 ${sans.className}`}>
          {title}
        </h2>

        <p className={`text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed ${sans.className}`}>
          {description}
        </p>
      </div>
    </div>
  );
}