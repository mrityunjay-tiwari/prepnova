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
import PostInterviewTab from "@/components/home/post-interview";
import { WhoItIsForSection } from "@/components/home/who-it-is-for";
import UsersCarousel from "@/components/home/users-crousel";
import WhyItExists from "@/components/home/why-it-exists";
import HowItWorks from "@/components/home/how-it-works";
import CTA from "@/components/home/cta";

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
      <UsersCarousel />
      <div className="w-full mx-auto md:max-w-5xl">
        <WhyItExists />
        <HowItWorks />
      </div>
      <PostInterviewTab />
      <CTA />
      <Footer />
    </main>
  );
}
