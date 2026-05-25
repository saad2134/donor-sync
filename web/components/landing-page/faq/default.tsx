"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { motion } from "framer-motion";
import { APP_CONFIG, FAQ_CONFIG } from "@/config/CORE_CONFIG";



export function FAQ() {

    return (
        <section id='faqs' className="py-48  relative overflow-hidden">
            {/* Animated background layers */}
            <div className="absolute inset-0">
                {/* Gradient mesh background */}
                <div className="absolute inset-0 " />
                <div className="absolute inset-0 " />
                
                {/* Floating orbs */}
                <motion.div
                    className="absolute top-20 left-10 h-24 w-24 rounded-full bg-primary/15 blur-xl"
                    animate={{
                        x: [0, -25, 0],
                        y: [0, 15, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-secondary/15 blur-xl"
                    animate={{
                        x: [0, 25, 0],
                        y: [0, -15, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/4 h-20 w-20 rounded-full bg-primary/10 blur-lg"
                    animate={{
                        x: [0, -15, 15, 0],
                        y: [0, -10, 10, 0],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 4,
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8">
                
                


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    
                    
                    {/* Left side - Title and description */}
                    <div className="space-y-6">
                        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-primary transition-all duration-300 hover:scale-105 hover:bg-gradient-to-l animate-gradient leading-[1.2] sm:text-4xl md:text-6xl lg:text-7xl">
                            Frequently Asked Questions (FAQs)
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {FAQ_CONFIG.description}
                            <span className="block mt-2 font-medium text-primary">
                                Contact us for personalized assistance:
 
                            </span>
                            <a
                                href={APP_CONFIG.contacts.email}
                                className="text-primary/80 hover:underline font-medium"
                            >
                                {APP_CONFIG.contacts.email.replace('mailto:', '')}
                            </a>
                        </p>
                    </div>

                    {/* Right side - Accordion */}
                    <div className="w-full">
                        <Accordion
                            type="single"
                            collapsible
                            className="space-y-4"
                        >
                            {FAQ_CONFIG.items.map(({ question, answer }, index: number) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="border border-border rounded-lg px-6 bg-gradient-to-br from-card via-background to-card/50 relative w-full shrink-0 hover:shadow-lg transition-all duration-300 from-accent/10 via-background to-accent/10  hover:from-accent/25 hover:via-background hover:to-accent/25 backdrop-blur-sm"
                                >
                                    <AccordionTrigger className="text-left font-medium hover:no-underline py-4 text-foreground">
                                        {question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                                        <div dangerouslySetInnerHTML={{ __html: answer }} />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FAQ;