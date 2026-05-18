import type {Metadata} from "next";
import {Geist, Geist_Mono, Sen} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/ui/theme-provider";
import LayoutWrapper from "@/components/home/layout-wrapper";
import {auth} from "@/utils/auth";
import {Navbar} from "@/components/navbar/nav";

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
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Prepnova",
  description:
    "AI-powered mock interviews with adaptive feedback, structured reports, and measurable progress tracking.",
  metadataBase: new URL("https://prepnova.site"),

  openGraph: {
    title: "Prepnova",
    description: "AI-powered mock interviews with adaptive feedback, structured reports, and measurable progress tracking.",
    url: "https://prepnova.site",
    siteName: "Prepnova",
    images: [
      {
        url: "https://ik.imagekit.io/mrityunjay/prepnova/prepnova-preview.png", 
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Prepnova",
    description: "AI-powered mock interviews with adaptive feedback, structured reports, and measurable progress tracking.",
    images: ["https://ik.imagekit.io/mrityunjay/prepnova/prepnova-preview.png"],
  },

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await auth();
  return (
    <html lang="en">
      <body className={`${sen.className} hide-scrollbar antialiased`}>
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

// 