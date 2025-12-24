"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { GlareCard } from "@/components/ui/glare-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MethodologyItem {
  step: string;
  title: string;
  desc: string;
}

const methodologyItems: MethodologyItem[] = [
  { 
    step: "01", 
    title: "Discovery & Analysis", 
    desc: "Deep dive into your business needs, challenges, and goals to understand your unique requirements." 
  },
  { 
    step: "02", 
    title: "Strategy & Planning", 
    desc: "Create a customized roadmap and solution architecture tailored to your business objectives." 
  },
  { 
    step: "03", 
    title: "Execution & Delivery", 
    desc: "Agile implementation with continuous collaboration and transparent progress updates." 
  },
  { 
    step: "04", 
    title: "Optimization & Growth", 
    desc: "Continuous improvement, performance monitoring, and scaling solutions for future growth." 
  },
];

const Methodology: React.FC = () => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === methodologyItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? methodologyItems.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800  to-neutral-700 dark:from-neutral-800 dark:via-white  leading-tight">
            Our Methodology
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A structured approach to digital transformation that ensures success at every stage of your journey.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {methodologyItems.map((item, index) => (
            <GlareCard 
              key={index} 
              className="flex flex-col py-8 px-6 cursor-pointer group h-full min-h-[280px] "
            >
              <div className="flex flex-col h-full">
                {/* Step Number */}
                <div className="mb-4">
                  <span className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-xl text-foreground mb-4">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-foreground/70 text-sm flex-grow mb-6 leading-relaxed">
                  {item.desc}
                </p>
                
                {/* Progress line for all except last item */}
                {index < methodologyItems.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border group-hover:bg-primary/30 transition-colors duration-300" />
                )}
              </div>
            </GlareCard>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="flex justify-center items-center">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-accent transition-colors duration-200"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="w-full max-w-sm mx-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlareCard className="flex flex-col py-8 px-6 h-full min-h-[320px]">
                    <div className="flex flex-col h-full text-center">
                      {/* Step Number */}
                      <div className="mb-4">
                        <span className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                          {methodologyItems[currentIndex].step}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-bold text-xl text-foreground mb-4">
                        {methodologyItems[currentIndex].title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-foreground/70 text-sm flex-grow mb-6 leading-relaxed">
                        {methodologyItems[currentIndex].desc}
                      </p>
                    </div>
                  </GlareCard>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={nextSlide}
              className="absolute right-0 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-accent transition-colors duration-200"
              aria-label="Next step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Progress Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {methodologyItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-primary scale-125" 
                    : "bg-border hover:bg-primary/50"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;