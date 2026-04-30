import StreamVideoCallRender from "@/components/stream/streamVideoRender";

import HomeContent from "@/components/home/home-content";
import Footer from "@/components/home/footer";
import SocialSelector from "@/src/components/smoothui/social-selector";
import BgGradient from "@/components/home/bg-gradient";
import {Screen} from "@/components/home/screen";
import {Navbar} from "@/components/navbar/nav";
import {auth} from "@/utils/auth";
import HeroSection from "@/components/home/hero-section";
import FLoatingInterviewReportPanel from "@/components/home/floating-interview-analysis-panel";

export default async function Home() {
  const user = await auth();

  return (
    <main>
      <BgGradient>
        <div className="w-full mx-auto flex flex-col items-center rounded-b-4xl">
          {/* <HomeContent /> */}
          <HeroSection />
        </div>
      </BgGradient>
      <div className="-mt-92">
        <Screen />
      </div>
      {/* <FLoatingInterviewReportPanel /> */}
      <Footer />
    </main>
  );
}
