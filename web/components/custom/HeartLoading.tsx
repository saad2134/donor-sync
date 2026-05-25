// @ts-nocheck

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Heart } from "lucide-react";
import { ThemeProvider } from "next-themes";

export default function HeartLoading() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const toggleAnimation = () => setIsVisible(!isVisible);

  return (
    <div className="relative min-h-screen flex items-center justify-center" suppressHydrationWarning>
      <div
          className={ThemeProvider(
            "fixed inset-0 flex items-center justify-center bg-background",
            theme === "dark" ? "bg-black" : "bg-white"
          )}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-accent"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            >
              <Heart className="w-16 h-16 text-accent fill-current" />
            </motion.div>
            <p className="text-accent text-lg mt-2 select-none">Syncing lives, one drop at a time.</p>
          </motion.div>
        </div>
    </div>
  );
}
