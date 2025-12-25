import AceSparkles from "@/components/landing-page/AceSparkles";
export default function AceBrandIntroSparkles1() {
  return <div className="pt-10 h-[30rem] relative w-full bg-background flex flex-col items-center justify-center overflow-hidden rounded-md ">
      <div className="w-full absolute inset-0 h-screen">
        <AceSparkles id="tsparticlesfullpage" background="transparent" minSize={0.6} maxSize={1.4} particleDensity={100} className="w-full h-full" speed={1} />
      </div>
      <h1 className="md:text-5xl text-4xl lg:text-6xl font-bold text-center text-foreground relative z-20 px-4">
        Unified platform connecting{" "}
        <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        <span className="inline-block pb-2">blood donors, hospitals, and patients</span>
        </div>in real time.
      </h1>
    </div>;
}