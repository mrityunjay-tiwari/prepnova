import {AuthButton} from "@/components/signin/sign-in-button";
import {signIn} from "@/utils/auth";
import Image from "next/image";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";

export default async function LoginPage() {
  return (
    <section className="flex min-h-screen w-full">
      {/* Left visual panel — northern-lights night sky, hidden on mobile */}
      <div className="relative hidden overflow-hidden bg-gradient-to-t from-[#06231a] via-[#081634] to-[#020614] md:flex md:w-[43%]">
        {/* star field — concentrated toward the top */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(1.2px 1.2px at 20% 30%, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 65% 15%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 40% 55%, rgba(255,255,255,0.6), transparent), radial-gradient(1.4px 1.4px at 80% 40%, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 12% 70%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 90% 65%, rgba(255,255,255,0.6), transparent), radial-gradient(1.2px 1.2px at 55% 80%, rgba(255,255,255,0.5), transparent)",
            backgroundSize: "260px 260px",
          }}
        />

        {/* horizon glow rising from the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-emerald-500/35 via-emerald-500/8 to-transparent blur-2xl" />

        {/* vertical aurora curtains / rays streaming up from the horizon */}
        <div className="pointer-events-none absolute bottom-0 left-[8%] h-[92%] w-28 -rotate-6 bg-gradient-to-t from-emerald-400/50 via-emerald-400/15 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-[24%] h-[82%] w-20 rotate-3 bg-gradient-to-t from-teal-300/45 via-teal-300/12 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-[40%] h-[95%] w-32 -rotate-[9deg] bg-gradient-to-t from-green-400/45 via-emerald-300/12 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-[58%] h-[78%] w-24 rotate-6 bg-gradient-to-t from-cyan-400/40 via-cyan-400/12 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-[74%] h-[88%] w-28 -rotate-3 bg-gradient-to-t from-teal-400/45 via-teal-400/12 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-[2%] h-[80%] w-20 rotate-[10deg] bg-gradient-to-t from-emerald-400/40 via-emerald-400/10 to-transparent blur-2xl" />

        {/* soft green halo mid-panel for depth */}
        <div className="pointer-events-none absolute bottom-1/4 left-1/3 h-72 w-[22rem] rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-1/4 h-64 w-72 rounded-full bg-cyan-400/12 blur-3xl" />

        {/* pink aurora accents in the upper sky (like the reference) */}
        <div className="pointer-events-none absolute -top-20 -left-16 h-80 w-80 rounded-full bg-rose-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/4 right-[-3rem] h-64 w-64 rounded-full bg-fuchsia-300/10 blur-3xl" />

        {/* grain / noise texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* subtle vignette for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />

        <div className="absolute inset-0 flex flex-col justify-end p-10 lg:p-14">
          <blockquote className="max-w-2xl">
            <p className="text-xl font-medium leading-snug text-white lg:text-3xl">
              &ldquo;The will to win is nothing without the will to
              prepare.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-white/70">
              — Juma Ikangaa
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right form panel (the only block shown on mobile) */}
      <div className="flex w-full flex-col bg-zinc-50 dark:bg-background md:w-[57%]">
        {/* Top bar: small logo (left) + back button (right), set a bit lower from the top */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 md:px-10 md:pt-10">
          <Link href="/" aria-label="Prepnova home" className="flex items-center">
            <Image
              className="h-7 w-auto"
              src="https://ik.imagekit.io/mrityunjay/prepnova/logoprepnova.png"
              alt="Prepnova"
              width={120}
              height={32}
              priority
            />
          </Link>
          <Link
            href="/"
            aria-label="Back to home"
            className="flex size-9 items-center justify-center rounded-full bg-gradient-to-b from-blue-100 to-white text-blue-600 shadow-md ring-1 ring-blue-200/70 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 dark:from-blue-900/40 dark:to-zinc-900 dark:text-blue-300 dark:ring-blue-800/50"
          >
            <ChevronLeft className="size-5" />
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center px-0 pb-10 md:px-8">
          <div className="mx-auto w-full max-w-[98%] px-4 md:max-w-sm md:px-0">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-2xl font-medium tracking-tight">
                Welcome to Prepnova
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in to continue to your interview workspace.
              </p>
            </div>

            <form
              action={async () => {
                "use server";
                await signIn("google", {redirectTo: "/dashboard"});
              }}
            >
              <AuthButton />
            </form>

            <p className="mt-8 text-center text-xs text-muted-foreground md:text-left">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
