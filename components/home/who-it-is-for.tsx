import { InfiniteSlider } from "../ui/infinite-slider";
import { ProgressiveBlur } from "../ui/progressive-blur";


export function WhoItIsForSection() {
  return (
    <div className='relative h-auto w-full md:max-w-5xl mx-auto mt-10 overflow-hidden'>
      <InfiniteSlider className='flex h-full w-full items-center'>
        <div className='w-max whitespace-nowrap px-4 text-center text-lg font-[450] text-black dark:text-white'>
          Internship
        </div>
        <div className='w-max whitespace-nowrap px-4 text-center text-lg font-[450] text-black dark:text-white'>
          SDE1
        </div>
        <div className='w-max whitespace-nowrap px-4 text-center text-lg font-[450] text-black dark:text-white'>
          SDE2
        </div>
        <div className='w-max whitespace-nowrap px-4 text-center text-lg font-[450] text-black dark:text-white'>
          SDE3
        </div>
        <div className='w-max whitespace-nowrap px-4 text-center text-lg font-[450] text-black dark:text-white'>
          Principal Engineer
        </div>
        <div className='w-max whitespace-nowrap px-4 text-center text-lg font-[450] text-black dark:text-white'>
          Staff Engineer
        </div>
        <div className='w-max whitespace-nowrap px-4 text-center text-lg font-[450] text-black dark:text-white'>
          GenAI Developer
        </div>
        <div className='w-max whitespace-nowrap px-4 text-center text-lg font-[450] text-black dark:text-white'>
          ML Engineer
        </div>
        <div className='w-max whitespace-nowrap px-4 text-center text-lg font-[450] text-black dark:text-white'>
          DSA Round
        </div>
      </InfiniteSlider>
      <ProgressiveBlur
        className='pointer-events-none absolute top-0 left-0 h-full w-[200px]'
        direction='left'
        blurIntensity={1}
      />
      <ProgressiveBlur
        className='pointer-events-none absolute top-0 right-0 h-full w-[200px]'
        direction='right'
        blurIntensity={1}
      />
    </div>
  );
}
