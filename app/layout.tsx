import type {Metadata} from "next";
import {Cormorant_Garamond, Geist, Geist_Mono, Sen, Ubuntu} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/ui/theme-provider";
import BgGradient from "@/components/home/bg-gradient";
import LayoutWrapper from "@/components/home/layout-wrapper";
import { auth } from "@/utils/auth";
import { Navbar } from "@/components/navbar/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sen = Sen({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  title: "Prepnova",
  description:
    "Prepnova is an AI-powered interview coaching platform that analyzes your answers, body language, and engagement in real time — then turns every session into measurable growth.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await auth();
  return (
    <html lang="en">
      <body
        className={`${sen.className} thin-scrollbar antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper navbar={<Navbar user={user} />}>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
