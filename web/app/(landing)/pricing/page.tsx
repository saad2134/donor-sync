"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight, Zap, Shield, BarChart3, Users, Database, Clock, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const tiers = [
    {
      name: "Free Tier",
      description: "Perfect for small rural hospitals and blood banks",
      price: "₹0",
      period: "forever",
      popular: false,
      features: [
        { text: "Basic dashboard interface", included: true },
        { text: "Email notifications", included: true },
        { text: "Advanced analytics", included: false },
        { text: "Hospital system integration", included: false },
        { text: "Bulk donor communication", included: false },
      ],
      icon: Shield,
      cta: "Get Started Free"
    },
    {
      name: "Premium Tier",
      description: "For private hospitals and city hospitals",
      price: "₹2,999",
      period: "/month",
      popular: true,
      features: [
        { text: "Advanced dashboard with real-time insights", included: true },
        { text: "SMS & WhatsApp notifications", included: true },
        { text: "Advanced blood shortage predictions", included: true },
        { text: "Hospital EMR system integration", included: true },
        { text: "Bulk donor communication tools", included: true },
        { text: "Custom API integrations", included: true },
        { text: "24/7 priority support", included: true },
      ],
      icon: Zap,
      cta: "Start 14-Day Free Trial"
    },
    {
      name: "Enterprise",
      description: "For hospital chains and state-wide networks",
      price: "Custom",
      period: "pricing",
      popular: false,
      features: [
        { text: "Everything in Premium", included: true },
        { text: "Multi-location management", included: true },
        { text: "White-label branding options", included: true },
        { text: "Dedicated account manager", included: true },

        { text: "Advanced data analytics & reports", included: true },

      ],
      icon: BarChart3,
      cta: "Contact Sales"
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Ethical Monetization",
      description: "Hospitals pay, not patients or donors. Emergency access remains free and accessible to everyone."
    },
    {
      icon: Database,
      title: "Data-Driven Insights",
      description: "Make informed decisions with advanced analytics on blood availability trends and seasonal shortages."
    },
    {
      icon: Clock,
      title: "Save Critical Time",
      description: "Priority alerts and smart matching reduce response time during life-threatening emergencies."
    }
  ];

  return createPortal(
    <div>
      <ScrollArea className="h-screen">
        <BusinessNavbar />



        <div className="min-h-screen bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pt-8">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-16">

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Alert className="mt-4 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <AlertDescription>
                    <span className="font-semibold text-foreground">Preview Mode:</span> Pricing, Partnership & Sponsorship opportunities, Donations are currently under development. This page is for display purposes only and does not represent active service offerings or statistics. We appreciate your interest in supporting our mission.
                  </AlertDescription>
                </div>
              </Alert>
            </div>

            <div className="text-center mb-16 pt-12">
              <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                Institutional Pricing
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[2] py-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Pricing That Saves Lives
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Choose the plan that fits your institution&apos;s needs. Emergency blood access is always free for patients and donors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20 px-4">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <Card key={tier.name} className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full ${tier.popular ? 'border-2 border-primary shadow-lg shadow-primary/10 scale-105' : ''}`}>
                    {tier.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-primary/80 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                        MOST POPULAR
                      </div>
                    )}
                    <CardHeader className="pb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                      <CardDescription className="text-base">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-6">
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl sm:text-5xl font-bold">{tier.price}</span>
                          {tier.period && <span className="text-muted-foreground text-lg">{tier.period}</span>}
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            {feature.included ? (
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3.5 h-3.5 text-primary" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                                <X className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            )}
                            <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-0 mt-auto" >
                      <Button
                        className={`w-full h-12 text-base font-medium ${tier.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                        variant={tier.popular ? 'default' : 'outline'}
                      >
                        {tier.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            <div className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={idx} className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="text-center lg:text-left space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-bold">Ready to Get Started?</h3>
                    <p className="text-muted-foreground max-w-2xl">
                      Join the network of hospitals saving lives every day. Start with our free tier or schedule a demo for premium features.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="h-12 px-8 text-base font-medium">
                      Start Free Trial
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium">
                      Schedule Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        <Footer />
      </ScrollArea>
    </div>,
    document.body
  );
}
