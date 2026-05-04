import Footer from "@/components/home/footer";
import BgGradient from "@/components/home/bg-gradient";
import {Screen} from "@/components/home/screen";
import HeroSection from "@/components/home/hero-section";
import PostInterviewTab from "@/components/home/post-interview";
import UsersCarousel from "@/components/home/users-crousel";
import WhyItExists from "@/components/home/why-it-exists";
import HowItWorks from "@/components/home/how-it-works";
import CTA from "@/components/home/cta";
import Technical from "@/components/home/technical";
import ChatBotOpenButton from "@/components/chatbot/chatbot-openButton";
import {Faqs} from "@/components/home/faqs";
import { MobileTechnical } from "@/components/home/mobile-technical";

export default async function Home() {
  return (
    <main>
      <BgGradient>
        <div className="w-full mx-auto flex flex-col items-center rounded-b-4xl">
          <HeroSection />
        </div>
      </BgGradient>
      <div className="mt-8 md:-mt-92">
        <Screen />
      </div>

      <UsersCarousel />
      <div className="w-full mx-auto md:max-w-5xl">
        <WhyItExists />
        <HowItWorks />
      </div>
      <PostInterviewTab />
      <div className="hidden md:block">
        <Technical />
      </div>
      <div className="md:hidden">
        <MobileTechnical />
      </div>
      <Faqs />
      <CTA />
      <Footer />
      <ChatBotOpenButton />
    </main>
  );
}
