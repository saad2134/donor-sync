"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  Activity, 
  Building2, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";

interface ConnectionLineProps {
  from: "left" | "right" | "top" | "bottom";
  delay?: number;
}

const ConnectionLine = ({ from, delay = 0 }: ConnectionLineProps) => {
  const lineVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
    },
  };

  return (
    <motion.svg
      initial="hidden"
      animate="visible"
      transition={{
        duration: 1.5,
        delay: delay,
        ease: "easeInOut",
      }}
      variants={lineVariants}
      className={clsx(
        "absolute w-64 h-1",
        from === "top" ? "left-1/2 top-0 -translate-y-1/2 -rotate-90" :
        from === "bottom" ? "left-1/2 bottom-0 translate-y-1/2 -rotate-90" :
        from === "left" ? "left-0 top-1/2 -translate-x-1/2" :
        "right-0 top-1/2 translate-x-1/2"
      )}
    >
      <motion.path
        d="M 0 64 128"
        fill="none"
        stroke="url(#line-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export default function PlatformProcess() {
  const cards = [
    {
      role: "Patient",
      icon: Activity,
      title: "Request Blood",
      description: "Sign up and request the blood type you need urgently",
      color: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10",
      position: "left",
    },
    {
      role: "Donor",
      icon: Heart,
      title: "Save Lives",
      description: "Get notified when someone nearby needs your blood type",
      color: "from-secondary/20 to-secondary/5",
      iconBg: "bg-secondary/10",
      position: "right",
    },
    {
      role: "Hospital",
      icon: Building2,
      title: "Connect & Manage",
      description: "Access a real-time network of verified blood donors",
      color: "from-accent/20 to-accent/5",
      iconBg: "bg-accent/10",
      position: "left",
    },
    {
      role: "Organization",
      icon: Users,
      title: "Organize Drives",
      description: "Coordinate blood donation events and track inventory",
      color: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10",
      position: "right",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        variants={containerVariants}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold mb-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
                How Our Platform
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                Connects Everyone
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              A seamless network connecting patients, donors, hospitals, and organizations for life-saving blood access.
            </motion.p>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-3xl blur-3xl opacity-20 pointer-events-none"
            />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 py-8">
              {cards.map((card, index) => {
                const Icon = card.icon;
                const isLeft = card.position === "left";
                const isRight = card.position === "right";
                
                return (
                  <motion.div
                    key={card.role}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.15,
                      ease: "easeOut"
                    }}
                    className={clsx(
                      "relative z-10",
                      isLeft ? "md:col-start-1" : isRight ? "md:col-start-2" : ""
                    )}
                  >
                    <div className={clsx(
                      "relative bg-card border border-border/50 rounded-2xl p-8 shadow-xl",
                      "group-hover:border-primary/50 transition-all duration-300"
                    )}>
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.15 + 0.1,
                          ease: "easeOut"
                        }}
                        className="flex items-start gap-6"
                      >
                        <div className={clsx(
                          "relative flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center",
                          card.iconBg
                        )}>
                          <Icon className="w-8 h-8" />
                        </div>
                        
                        <div className="flex-1">
                          <motion.h3
                            initial={{ opacity: 0, y: 5 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className={clsx(
                              "text-2xl font-bold mb-2",
                              card.position === "left" ? "text-primary" : 
                              card.position === "right" ? "text-secondary" : "text-accent"
                            )}
                          >
                            {card.role}
                          </motion.h3>
                          
                          <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-muted-foreground text-sm leading-relaxed"
                          >
                            {card.description}
                          </motion.p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                        className={clsx(
                          "hidden md:block absolute top-1/2 -translate-y-1/2 w-32",
                          isLeft ? "right-full translate-x-4" : 
                          isRight ? "left-full -translate-x-4" : ""
                        )}
                      >
                        {isLeft && index === 1 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 text-xs text-muted-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <ArrowRight className="w-4 h-4" />
                              <span>Request sent</span>
                            </div>
                          </motion.div>
                        )}
                        {isLeft && index === 2 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 text-xs text-muted-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <ArrowRight className="w-4 h-4" />
                              <span>Connects donors</span>
                            </div>
                          </motion.div>
                        )}
                        {isRight && index === 1 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 text-xs text-muted-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <ArrowLeft className="w-4 h-4" />
                              <span>Notified</span>
                            </div>
                          </motion.div>
                        )}
                        {isRight && index === 2 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 text-xs text-muted-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <ArrowLeft className="w-4 h-4" />
                              <span>Receives blood</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}

              <ConnectionLine from="top" delay={1.5} />
              <ConnectionLine from="bottom" delay={1.5} />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="hidden md:flex items-center justify-center mt-12 gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <div className="w-24 h-px bg-gradient-to-r from-primary via-secondary to-accent" />
                <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Real-time synchronization</span> across all platform participants
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="w-24 h-px bg-gradient-to-r from-accent via-secondary to-primary" />
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
