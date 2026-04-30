export default function BgGradient({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
   <div className="min-h-[130vh] w-full bg-white dark:bg-black relative">
  {/* Bottom Fade Stripes */}
  <div
    className="absolute rounded-b-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/8 bottom-0 left-0 w-[99%] h-[76vh] z-0 pointer-events-none
               [mask-image:linear-gradient(to_top,black,transparent)]"
    style={{
      backgroundImage: `
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 0.01px,
          rgba(125, 178, 209,1) 2px,
          rgba(125, 178, 209,1) 4px
        )
      `,
    }}
  />

  {/* Dark mode stripes */}
  <div
    className="absolute bottom-0 left-0 w-full h-[50vh] z-0 pointer-events-none hidden dark:block
               [mask-image:linear-gradient(to_top,white,transparent)]"
    style={{
      backgroundImage: `
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(55,65,81,0.4) 2px,
          rgba(55,65,81,0.4) 4px
        )
      `,
    }}
  />

  {/* Content */}
  <div className="relative z-10">
    {/* Your content/components */}
    {children}
  </div>
</div>
  
  )
}
