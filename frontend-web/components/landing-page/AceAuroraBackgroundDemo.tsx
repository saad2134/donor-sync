"use client";

import { useRouter } from "next/navigation";

//User Context
import { useUser } from "@/context/UserContext";

import { motion } from "framer-motion";
import React from "react";
import AceAuroraBackground from "@/components/landing-page/AceAuroraBackground";
export default function AuroraBackgroundDemo() {
  const router = useRouter()

  const { role } = useUser();
  const isGuest = role === "guest";
  const buttonText = isGuest ? "Get Started" : "Go to Dashboard";
  const redirectPath = isGuest ? "/login" : "/app";
  
  return <div className="relative flex flex-col h-[50vh] items-center justify-center bg-background text-foreground transition-bg pb-20 pt-20">
      <AceAuroraBackground>
        <motion.div initial={{
        opacity: 0.0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1,
        duration: 0.2,
        ease: "easeInOut"
      }} className="relative flex flex-col gap-4 items-center justify-center px-4">
          <div className="text-2xl md:text-4xl font-bold text-foreground text-center ">
          🩸 Are you willing to contribute for a better world?
          </div>
          <div className="font-extralight text-base md:text-2xl text-muted-foreground py-4 pl-20 pr-20 text-center">
          Finding the right blood match shouldn’t be stressful. DonorSync connects you with hospitals and donors quickly, so you get the blood you need when you need it.
          </div>
          
          
          
          {/* Get Started Button */}
          <button
          onClick={() => router.push(redirectPath)}
          className=" relative inline-flex h-[4rem] w-[20rem] overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          {/* Border effect layer */}
          <span className="absolute inset-[-1000%] rounded-md animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF8787_0%,#f31818_50%,#FF8787_100%)]" />
          {/* Inner button with shimmer effect */}
          <span className="relative inline-flex h-full w-full items-center justify-center rounded-md dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[linear-gradient(110deg,#FFFFFF,45%,#E6E6E6,55%,#FFFFFF)]  bg-[length:200%_100%] animate-shimmer px-6 text-2xl text-slate-800 
          dark:text-slate-400 transition-colors">

            
            {buttonText}
          </span>
        </button>
        </motion.div>
      </AceAuroraBackground>
    </div>;
}