
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from '@/components/landing-page/BusinessNavbar';
import Footer from '@/components/landing-page/footer';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(<div>
    <ScrollArea className="h-screen">
      <BusinessNavbar />
      
      {/* Terms and Conditions Section */}
      <div className="pt-20 p-6 max-w-4xl mx-auto">
        <br></br><br></br>
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Simply send an email to one of us below:
        </p>
        <a 
          href="mailto:csaad.3505@gmail.com" 
          className="text-primary underline hover:text-primary/80"
        >
          csaad.3505@gmail.com
        </a>
        <br></br><br></br><br></br>
      </div>
      
      
      <Footer />
    </ScrollArea>
    </div>,
    document.body
  );
}