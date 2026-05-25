"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import React from "react";
import AceAuroraBackground from "@/components/landing-page/AceAuroraBackground";
import { APP_CONFIG } from "@/config/CORE_CONFIG";

export default function FinalCTA() {
  const router = useRouter();
  const { role } = useUser();
  const isGuest = role === "guest";
  const buttonText = isGuest ? "Get Started" : "Go to Dashboard";
  const redirectPath = isGuest ? "/login" : "/app";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden py-24 pb-48 overflow-x-hidden ">
      <AceAuroraBackground>
        <div className="absolute inset-0 ">
          <motion.div
            className="absolute top-[15%] left-[5%] h-28 w-28 rounded-full bg-primary/20 blur-2xl"
            animate={{
              x: [0, -40, 20, 0],
              y: [0, 20, -10, 0],
              scale: [1.2, 1.8, 1.4, 1.2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[15%] left-[10%] h-40 w-40 rounded-full bg-secondary/20 blur-2xl"
            animate={{
              x: [0, 35, -15, 0],
              y: [-20, 10, 25, -20],
              scale: [1, 1.5, 1.2, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-[45%] right-[15%] h-24 w-24 rounded-full bg-accent/15 blur-xl"
            animate={{
              x: [0, -25, 30, 0],
              y: [0, -20, 15, 0],
              scale: [1.3, 0.9, 1.6, 1.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative z-10 flex flex-col items-center justify-center gap-6 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto text-center w-full"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground tracking-tight leading-tight"
          >
            <span className="block">Ready to make a</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
              difference?
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-normal px-2"
          >
            Finding the right blood match shouldn&apos;t be stressful.{" "}
            <span className="text-foreground font-semibold">{APP_CONFIG.appName}</span>{" "}
            connects you with hospitals and donors quickly, so you get the blood you need when you need it the most.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-4 w-full flex justify-center">
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

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 sm:gap-8 md:gap-16 lg:gap-24 pt-8 sm:pt-12 w-full px-2"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2 min-w-[80px] sm:min-w-[90px] md:min-w-[100px]"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground">Save Lives</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2 min-w-[80px] sm:min-w-[90px] md:min-w-[100px]"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-secondary/10 flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground">Fast Matching</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2 min-w-[80px] sm:min-w-[90px] md:min-w-[100px]"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground">Secure Platform</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </AceAuroraBackground>
    </div>
  );
}
