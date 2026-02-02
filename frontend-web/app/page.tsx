
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from '@/components/landing-page/BusinessNavbar';
import HeroSparkles from '@/components/landing-page/HeroSparkles';
import PlatformBenefits from '@/components/landing-page/PlatformBenefits';
import Quote from '@/components/landing-page/Quote';
import FinalCTA from '@/components/landing-page/FinalCTA';
import Footer from '@/components/landing-page/footer';
import { MobilePhoneView } from "@/components/landing-page/MobilePhoneView";
import FAQ from "@/components/landing-page/faq/default";
import MagicBento from '@/components/MagicBento'

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(<div>
    <ScrollArea className="h-screen">
      <BusinessNavbar />


      <HeroSparkles />
      <PlatformBenefits />
      {/* <PlatformProcess /> */}
      <MagicBento
        textAutoHide={true}
        enableStars
        enableSpotlight
        enableBorderGlow={true}
        enableTilt={true}
        enableMagnetism={false}
        clickEffect
        spotlightRadius={400}
        particleCount={12}
        glowColor="255, 0, 0"
        disableAnimations={false}
      />

      <MobilePhoneView />
      <Quote />
      <FAQ />
      <FinalCTA />


      <Footer />
    </ScrollArea>
  </div>,
    document.body
  );
}

/* 

https://www.shadcnblocks.com/block/process1
https://www.shadcnblocks.com/block/compliance1


*/