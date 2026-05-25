import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface MobilePhoneViewProps {
  heading?: string;
  subheading?: string;
  description?: string;
  image?: {
    lightSrc: string;
    darkSrc: string;
    alt: string;
  };
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  className?: string;
}

const MobilePhoneView = ({
  heading = "Fully Responsive ",
  subheading = " Application",
  description = "Streamline your donor management with our powerful platform. Track contributions, manage relationships, and gain insights to maximize your fundraising impact, now anywhere.",
  buttons = {
    primary: {
      text: "Get Started",
      url: "#",
    },
  },
  image = {
    lightSrc: "responsiveui-light.jpg",
    darkSrc: "responsiveui-dark.jpg",
    alt: "Placeholder",
  },
  className,
}: MobilePhoneViewProps) => {
  const { resolvedTheme } = useTheme();
  return (
    <section className={cn("bg-gradient-to-b from-transparent to-primary/5 py-40 lg:py-40 px-8 relative overflow-hidden", className)}>
      {/* Animated background layers */}
      <div className="absolute inset-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 " />

        {/* Floating orbs */}
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


      {/* <Shader3 /> */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center gap-8 lg:my-0 lg:flex-row lg:gap-12">
        <div className="flex flex-col gap-5 lg:w-1/2 ">
          <h2 className="text-4xl font-semibold text-foreground md:text-5xl lg:text-6xl transition-all duration-300 hover:scale-105">
            <span>{heading}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">{subheading}</span>
          </h2>
          <p className="text-base text-muted-foreground md:text-lg lg:text-lg">
            {description}
          </p>
          <div className="flex flex-wrap items-start gap-4 lg:gap-6">
            <button
              className="relative inline-flex h-[3rem] w-[12rem] md:h-[4rem] md:w-[16rem] overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] rounded-md animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF8787_0%,#f31818_50%,#FF8787_100%)]" />
              <span className="relative inline-flex h-full w-full items-center justify-center rounded-md dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[linear-gradient(110deg,#FFFFFF,45%,#E6E6E6,55%,#FFFFFF)] bg-[length:200%_100%] animate-shimmer px-6 text-base md:text-xl text-slate-800 dark:text-slate-400 transition-colors">
                {buttons.primary?.text}
              </span>
            </button>
            <a
              href={buttons.secondary?.url}
              className="underline text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base pt-3 md:pt-4"
            >
              {buttons.secondary?.text}
            </a>
          </div>
        </div>
        <div className="relative z-10  flex justify-center">
          <div className="relative max-w-xs md:max-w-sm">
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-t from-primary/40 to-transparent blur-2xl rounded-full" />
            <div className="absolute top-2 left-1/2 h-[98%] w-[95%] -translate-x-1/2 overflow-hidden select-none">
              <img
                src={resolvedTheme === "dark" ? image.darkSrc : image.lightSrc}
                alt={image.alt}
                className="size-full object-cover object-[50%] select-none"
              />
            </div>
            <img
              className="relative z-10 w-full h-auto max-w-[350px] md:max-w-[400px] user-select-none"
              src="samsung-galaxy-s24-ultra-2024-medium.png"
              alt="phone"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { MobilePhoneView };
