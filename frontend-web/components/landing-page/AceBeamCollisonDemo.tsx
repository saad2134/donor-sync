import React from "react";
import AceBeamCollisonBG from "@/components/landing-page/AceBeamCollisonBG";
export default function AceBeamCollisonBGDemo() {
  return <div className={"bg-gradient-to-t from-primary/5 to-primary/5 h-60 md:h-[30rem] relative flex items-center w-full justify-center overflow-hidden"}>
      
        <h2 className="text-3xl sm:text-4xl relative z-20 md:text-5xl lg:text-7xl font-bold text-center text-foreground font-sans tracking-tight">
        Give blood, save lives.{" "}
          <div className="relative mx-auto w-max [filter:drop-shadow(0px_1px_3px_hsl(var(--muted)/.14))]">
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-primary via-secondary to-accent py-4">
              <span className="">Share hope, spread kindness.</span>
            </div>
          </div>
        </h2>
      
    </div>;
}