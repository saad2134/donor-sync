"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Globe, Heart, Handshake, TrendingUp, ShieldCheck, MapPin, CheckCircle, ArrowRight, FileText, Users, Target, Sparkles, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PartnerPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const governmentPartnerships = [
    {
      title: "State Health Departments",
      description: "Collaborate to create state-wide blood availability networks and emergency response systems.",
      icon: Globe,
      benefits: [
        "Blood availability heatmaps across districts",
        "Real-time emergency preparedness dashboards",
        "Rural healthcare gap analysis",
        "Policy-making data insights"
      ]
    },
    {
      title: "District Hospitals",
      description: "Improve blood management efficiency and reduce wait times for critical patients.",
      icon: MapPin,
      benefits: [
        "Predictive blood shortage alerts",
        "Optimized donor mobilization",
        "Reduced blood wastage",
        "Improved patient outcomes"
      ]
    },
    {
      title: "National Blood Transfusion Councils",
      description: "Standardize blood donation processes and improve national health metrics.",
      icon: ShieldCheck,
      benefits: [
        "National blood inventory tracking",
        "Donor database integration",
        "Compliance reporting tools",
        "Quality assurance systems"
      ]
    }
  ];

  const csrOpportunities = [
    {
      title: "District-Level Sponsorship",
      price: "₹50,000 - 2,00,000",
      period: "annually",
      description: "Sponsor an entire district's blood network and be recognized as a champion of public health.",
      features: [
        "Logo on donation success screens (district-wide)",
        "Featured in monthly impact reports",
        "Social media recognition",
        "Annual CSR impact certificate"
      ],
      badge: "High Impact"
    },
    {
      title: "Network Partnership",
      price: "₹5,00,000 - 15,00,000",
      period: "annually",
      description: "Partner with a network of hospitals to sponsor life-saving blood services for underserved communities.",
      features: [
        "Brand visibility across hospital network",
        "Exclusive impact analytics dashboard",
        "Quarterly business impact report",
        "VIP access to annual health summit"
      ],
      badge: "Enterprise"
    },
    {
      title: "National Health Champion",
      price: "Custom",
      period: "negotiable",
      description: "Become a founding partner in revolutionizing India's public health infrastructure. Get in touch today!",
      features: [
        "National brand recognition",
        "Speaking opportunities at events",
        "Custom impact metrics",
        "Long-term strategic partnership",
        "Media & PR support"
      ],
      badge: "Flagship"
    }
  ];

  const sponsorCategories = [
    { icon: Building2, name: "Pharmaceutical Companies", count: "50+" },
    { icon: Heart, name: "Healthcare Startups", count: "100+" },
    { icon: TrendingUp, name: "Banks & IT Firms", count: "200+" },
    { icon: Users, name: "Hospital Groups", count: "30+" }
  ];

  const whyPartner = [
    {
      icon: Target,
      title: "Align with SDG 3",
      description: "Support Good Health and Well-being as part of UN Sustainable Development Goals."
    },
    {
      icon: TrendingUp,
      title: "Measurable Impact",
      description: "Track real-world impact with transparent dashboards and detailed impact reports."
    },
    {
      icon: ShieldCheck,
      title: "Credibility & Trust",
      description: "Partner with a verified, ethical platform that's making a genuine difference."
    },
    {
      icon: Sparkles,
      title: "Public Recognition",
      description: "Showcase your commitment to social good with prominent brand visibility."
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
                Partnership Opportunities
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Partner for Impact
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join our mission to revolutionize India&apos;s public health infrastructure. Whether you&apos;re a government body or a corporate sponsor, together we can save lives.
              </p>
            </div>

            <Tabs defaultValue="government" className="w-full mb-20">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 p-1 bg-foreground/10">
                <TabsTrigger value="government" className="data-[state=active]:bg-background data-[state=active]:shadow-md">
                  <Globe className="w-4 h-4 mr-2" />
                  Government
                </TabsTrigger>
                <TabsTrigger value="csr" className="data-[state=active]:bg-background data-[state=active]:shadow-md">
                  <Heart className="w-4 h-4 mr-2" />
                  CSR Sponsors
                </TabsTrigger>
              </TabsList>

              <TabsContent value="government" className="mt-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">Government & Public Health Partnerships</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Align perfectly with India&apos;s public health missions and contribute to national health goals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {governmentPartnerships.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <Card key={idx} className="hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <CardDescription className="text-base">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {item.benefits.map((benefit, bidx) => (
                              <li key={bidx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="csr" className="mt-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">CSR Sponsorship Opportunities</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Fund life-saving services while building your brand&apos;s social impact credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {csrOpportunities.map((item, idx) => (
                    <Card key={idx} className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {item.badge}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl pr-16">{item.title}</CardTitle>
                        <CardDescription className="text-base">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-3xl font-bold">{item.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.period}</p>
                        </div>
                        <ul className="space-y-2">
                          {item.features.map((feature, fidx) => (
                            <li key={fidx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <h3 className="text-2xl font-bold mb-6">Who Can Sponsor?</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {sponsorCategories.map((cat, idx) => {
                      const Icon = cat.icon;
                      return (
                        <div key={idx} className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                          <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                          <p className="text-sm font-medium text-center">{cat.name}</p>
                          <p className="text-xs text-muted-foreground text-center">{cat.count} partners</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Why Partner With Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyPartner.map((item, idx) => {
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
                      <Handshake className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl sm:text-3xl font-bold">Ready to Partner?</h3>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                      Let&apos;s discuss how we can work together to improve healthcare access and save lives across India.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="h-12 px-8 text-base font-medium">
                      <FileText className="w-4 h-4 mr-2" />
                      Download Partnership Deck
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium">
                      Schedule Consultation
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
