import StreamVideoCallRender from "@/components/stream/streamVideoRender";

import HomeContent from "@/components/home/home-content";
import Footer from "@/components/home/footer";
import SocialSelector from "@/src/components/smoothui/social-selector";
import BgGradient from "@/components/home/bg-gradient";

export default async function Home() {
  return (
    <main>
      <BgGradient>
        <div className="w-full mx-auto flex flex-col items-center">
          <HomeContent />
        </div>
      </BgGradient>
      <SocialSelector />
      <Footer />
    </main>
  );
}
