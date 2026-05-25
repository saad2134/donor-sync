"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, HandHeart, Globe, Users, TrendingUp, Award, Sparkles, ArrowRight, CheckCircle, Target, Gift, Droplets, Shield, FileText, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SponsorDonatePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const donationLevels = [
    {
      name: "Champion",
      amount: "₹50",
      description: "Support rural emergency access",
      period: "one-time",
      features: [
        "Digital thank you certificate",
        "Name on supporter's wall",
        "Monthly impact updates"
      ],
      icon: Heart,
      popular: false
    },
    {
      name: "Hero",
      amount: "₹500",
      description: "Fund blood drive operations",
      period: "one-time",
      features: [
        "Champion tier benefits",
        "Personalized thank you email",
        "Quarterly impact report",
        "Social media shoutout"
      ],
      icon: HandHeart,
      popular: true
    },
    {
      name: "Legend",
      amount: "₹5,000",
      description: "Sponsor a complete blood drive",
      period: "one-time",
      features: [
        "Hero tier benefits",
        "Featured in annual report",
        "VIP event invitation",
        "Meet the team (virtual)"
      ],
      icon: Award,
      popular: false
    }
  ];

  const recurringPlans = [
    {
      name: "Monthly Supporter",
      amount: "₹100",
      period: "/month",
      description: "Sustained monthly support for ongoing operations",
      benefits: [
        "Flexible, cancel anytime",
        "Premium supporter updates",
        "Exclusive community access",
        "Early access to new features",
        "Digital monthly impact card"
      ],
      impact: "Helps 10+ patients/month find blood donors"
    },
    {
      name: "Annual Patron",
      amount: "₹1,000",
      period: "/year",
      description: "Commit to annual support with greater impact",
      benefits: [
        "Monthly Supporter benefits",
        "2 months free value",
        "Physical welcome kit",
        "Annual impact certificate",
        "Tax exemption receipt"
      ],
      impact: "Supports 120+ patients/year access blood"
    }
  ];

  const sponsorshipOpportunities = [
    {
      title: "Sponsor a Blood Drive",
      price: "₹2,000 - ₹10,000",
      description: "Fund a blood donation drive at a school, college, or corporate office.",
      impact: "Collect 50-200 units of blood per drive",
      icon: Droplets,
      highlights: [
        "Branding at the event",
        "Social media shoutout",
        "Impact report with photos",
        "Thank you certificate"
      ]
    },
    {
      title: "Community Sponsor",
      price: "₹25,000",
      description: "Sponsor blood access for an entire community for 6 months.",
      impact: "Support 500+ families with emergency blood access",
      icon: Globe,
      highlights: [
        "Community recognition",
        "Detailed quarterly reports",
        "Community engagement event",
        "Premium impact dashboard"
      ]
    },
    {
      title: "District Partner",
      price: "₹1,00,000+",
      description: "Partner to improve blood availability across an entire district.",
      impact: "Transform healthcare access for 10,000+ people",
      icon: Target,
      highlights: [
        "District-wide recognition",
        "Speaking opportunities",
        "Comprehensive annual report",
        "Customized partnership benefits",
        "Long-term brand visibility"
      ]
    }
  ];

  const impactStats = [
    { icon: Users, label: "Lives Touched", value: "50,000+" },
    { icon: Droplets, label: "Blood Units Facilitated", value: "8,000+" },
    { icon: Globe, label: "Districts Covered", value: "25+" },
    { icon: TrendingUp, label: "Monthly Growth Rate", value: "35%" }
  ];

  const whyDonate = [
    {
      icon: Shield,
      title: "Ethical & Transparent",
      description: "Every rupee is tracked and reported. See exactly how your donation makes an impact."
    },
    {
      icon: Target,
      title: "Direct Impact",
      description: "Your donation directly funds emergency blood access, not administrative overhead."
    },
    {
      icon: Gift,
      title: "Tax Benefits",
      description: "All donations above ₹500 qualify for 80G tax exemption."
    },
    {
      icon: Sparkles,
      title: "Be the Change",
      description: "Join a community of like-minded individuals making healthcare accessible."
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

            <div className="text-center mb-16  pt-12">
              <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                Support Our Mission
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Save Lives Today
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Your support helps connect blood donors with those in need. Every contribution, big or small, makes a difference.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              {impactStats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="p-6 rounded-xl border bg-card text-center hover:border-primary/50 transition-colors">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="mb-20 px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Make a One-Time Donation</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Choose your impact level. Every donation supports emergency blood access.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {donationLevels.map((level, idx) => {
                  const Icon = level.icon;
                  return (
                    <Card key={idx} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${level.popular ? 'border-2 border-primary shadow-lg shadow-primary/10 scale-105' : ''}`}>
                      {level.popular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-primary/80 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                          MOST POPULAR
                        </div>
                      )}
                      <CardHeader className="pb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">{level.name}</CardTitle>
                        <div className="mt-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold">{level.amount}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{level.period}</p>
                        </div>
                        <CardDescription className="text-base mt-3">{level.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-6">
                        <ul className="space-y-3">
                          {level.features.map((feature, fidx) => (
                            <li key={fidx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          className={`w-full h-12 text-base font-medium ${level.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                          variant={level.popular ? 'default' : 'outline'}
                        >
                          Donate {level.amount}
                          <Heart className="w-4 h-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="mb-20  px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Recurring Support</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Make a bigger impact with monthly or annual contributions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {recurringPlans.map((plan, idx) => (
                  <Card key={idx} className="hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className="text-base">{plan.description}</CardDescription>
                      <div className="mt-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">{plan.amount}</span>
                          <span className="text-muted-foreground text-lg">{plan.period}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-sm text-foreground font-medium">Your Impact:</p>
                        <p className="text-sm text-muted-foreground mt-1">{plan.impact}</p>
                      </div>
                      <ul className="space-y-2">
                        {plan.benefits.map((benefit, bidx) => (
                          <li key={bidx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full h-12 text-base font-medium">
                        Start {plan.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mb-20  px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Sponsorship Opportunities</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Organizations can sponsor specific initiatives and see measurable impact.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sponsorshipOpportunities.map((opp, idx) => {
                  const Icon = opp.icon;
                  return (
                    <Card key={idx} className="hover:shadow-xl transition-shadow duration-300">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{opp.title}</CardTitle>
                        <CardDescription className="text-base">{opp.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                          <p className="text-sm text-foreground font-semibold">Impact:</p>
                          <p className="text-sm text-muted-foreground mt-1">{opp.impact}</p>
                          <p className="text-sm font-medium mt-2">{opp.price}</p>
                        </div>
                        <ul className="space-y-2">
                          {opp.highlights.map((highlight, hidx) => (
                            <li key={hidx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full h-12 text-base font-medium">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Why Support Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyDonate.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="text-center space-y-4">
                      <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mb-20">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="text-center lg:text-left space-y-4">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <Heart className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl sm:text-3xl font-bold">Every Drop Counts</h3>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                      Your donation directly funds emergency blood access, blood drives, and community outreach. 100% of your contribution supports our mission.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="h-12 px-8 text-base font-medium">
                      <FileText className="w-4 h-4 mr-2" />
                      View Impact Report
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium">
                      Contact Us
                      <ArrowRight className="w-4 h-4 ml-2" />
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
