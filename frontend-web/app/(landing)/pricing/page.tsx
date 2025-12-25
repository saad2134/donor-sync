
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from '@/components/landing-page/BusinessNavbar';
import Footer from '@/components/landing-page/footer';

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(<div>
    <ScrollArea className="h-screen absolute-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
      <BusinessNavbar />
      
      <div className="pt-20 p-6 max-w-4xl mx-auto">
        <br></br><br></br>
        <h2 className="text-2xl font-bold mb-4">Pricing</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Comming soon. Don't worry, our core features will always be free for everyone.
        </p>
        <br></br><br></br><br></br>
      </div>
      
      
      <Footer />
    </ScrollArea>
    </div>,
    document.body
  );
}