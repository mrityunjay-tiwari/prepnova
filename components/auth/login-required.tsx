// "use client";

// import React from "react";
// import {
//   Empty,
//   EmptyHeader,
//   EmptyTitle,
//   EmptyDescription,
//   EmptyContent,
//   EmptyMedia,
// } from "@/components/ui/empty";
// import {Button} from "@/components/ui/button";
// import {LogIn, ShieldAlert} from "lucide-react";
// import {signIn} from "next-auth/react";
// import {motion} from "motion/react";

// export function LoginRequired() {
//   return (
//     <div className="flex items-center justify-center min-h-[70vh] px-4">
//       <motion.div
//         initial={{opacity: 0, scale: 0.95}}
//         animate={{opacity: 1, scale: 1}}
//         transition={{duration: 0.3}}
//         className="w-full max-w-md"
//       >
//         <Empty className="border-2 border-dashed border-muted bg-muted/20 rounded-[2.5rem] p-12">
//           <EmptyHeader>
//             <div className="p-0.5 border border-gray-300 rounded-2xl mb-4">
//               <EmptyMedia
//                 variant="icon"
//                 className="rounded-xl border border-gray-200 bg-background text-blue-950 p-2 h-12 w-12 flex items-center justify-center"
//               >
//                 <ShieldAlert className="h-6 w-6" />
//               </EmptyMedia>
//             </div>
//             <EmptyTitle className="text-2xl font-black text-foreground">
//               Login Required
//             </EmptyTitle>
//             <EmptyDescription className="text-base font-medium text-muted-foreground mt-2">
//               You need to be authenticated to access your dashboard and track
//               your progress.
//             </EmptyDescription>
//           </EmptyHeader>
//           <EmptyContent>
//             <Button
//               onClick={() => signIn("google", {callbackUrl: "/dashboard"})}
//               className="w-full rounded-2xl py-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all gap-2"
//               size="lg"
//             >
//               <LogIn className="h-5 w-5" />
//               Sign in with Google
//             </Button>
//             <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-4">
//               Secure Authentication by NextAuth.js
//             </p>
//           </EmptyContent>
//         </Empty>
//       </motion.div>
//     </div>
//   );
// }
