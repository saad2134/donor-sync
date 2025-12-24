
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from '@/components/landing-page/BusinessNavbar';
import AceBrandIntroSparkles1 from '@/components/landing-page/AceBrandIntroSparkles1';
import HardToResist from '@/components/landing-page/HardToResist';
import AceBeamCollisonDemo from '@/components/landing-page/AceBeamCollisonDemo';
import AceAuroraBackgroundDemo from '@/components/landing-page/AceAuroraBackgroundDemo';
import Accordion from '@/components/landing-page/faq-accordion';
import Footer from '@/components/landing-page/footer';
import PatientProcess from "@/components/landing-page/PatientProcess";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(<div>
    <ScrollArea className="h-screen">
      <BusinessNavbar />

      <AceBrandIntroSparkles1 />
      <HardToResist />
      {/* <PatientProcess /> */}
      <AceBeamCollisonDemo />
      <AceAuroraBackgroundDemo />
      <Accordion />
      
      <Footer />
    </ScrollArea>
    </div>,
    document.body
  );
}