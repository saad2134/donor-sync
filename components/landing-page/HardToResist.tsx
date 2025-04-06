"use client";

import { motion } from "framer-motion";
export default function HardToResist() {
  const benefits = [{
    title: "Patients",
    description: "Sign up and request the blood you need—we’ll help you find it quickly.",
    icon: "🩸"
  }, {
    title: "Donors",
    description: "Register and discover where your donation can save a life.",
    icon: "❤️"
  }, {
    title: "Hospitals",
    description: "Connect directly with donors to get the blood your patients need.",
    icon: "🏥"
  }, {
    title: "Organisations",
    description: "Organize donation drives and support those in urgent need.",
    icon: "🤝"
  }];
  return <section className="relative pt-24 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.2
      }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              We connect
            </span>{" "}
            People & Hospitals
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A comprehensive web-based platform that connects blood donors directly with hospitals, ensuring quick and efficient blood donation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {benefits.map((benefit, index) => <motion.div key={benefit.title} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.2,
          delay: index * 0.05
        }} className="flex items-start space-x-6 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-lg transition-all duration-500 group-hover:opacity-100 opacity-0" />
                <div className="relative text-4xl bg-background/50 p-4 rounded-full">
                  {benefit.icon}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
}