// app/about/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { APP_CONFIG } from "@/config/CORE_CONFIG";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Target, 
  ShieldAlert, 
  Users, 
  Clock, 
  Building2, 
  Mail, 
  ArrowRight, 
  Activity,
  Layers,
  Smartphone,
  ShieldAlert as ShieldCheck,
  Sparkles,
  HeartHandshake
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: `About | ${APP_CONFIG.appName}`,
  description: `Understand more about the ${APP_CONFIG.appName} platform.`,
};

export default function AboutPage() {
  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-b from-background via-background/95 to-background">
        <BusinessNavbar />

        {/* Hero Section */}
        <div className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24">
          {/* Background decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <Badge className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300">
              About {APP_CONFIG.appName}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent">
              Eliminating Delays in <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Emergency Blood</span> Access
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              <strong>DonorSync</strong> is a digital ecosystem built to bridge the critical gap between blood donors, hospitals, and blood banks. By enabling real-time requests and proximity matching, we make blood donation instant, reliable, and life-saving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="h-12 px-8 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300" asChild>
                <Link href="/login">
                  Get Started Now
                  <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium hover:bg-muted/50 transition-all duration-300" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/40">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-28">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">What Drives Us Every Day</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that no life should be lost due to a delay in blood availability. We leverage cutting-edge matching algorithms to streamline public health communications.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Clock,
                  title: "Minimize Delays",
                  desc: "Connect hospitals and blood banks with donors in real-time, reducing critical search durations from hours to minutes."
                },
                {
                  icon: HeartHandshake,
                  title: "Bridge the Gaps",
                  desc: "Remove systemic communication bottlenecks between donors, medical institutions, and regional blood warehouses."
                },
                {
                  icon: ShieldCheck,
                  title: "Public Health Focus",
                  desc: "Create an accessible, streamlined infrastructure prioritizing patients' well-being and absolute data confidentiality."
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="border border-border/40 bg-card hover:bg-muted/50 transition-all duration-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/40">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="bg-primary/10 text-primary">Key Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for Speed and Reliability</h2>
            <p className="text-muted-foreground">
              Every detail is engineered to ensure high efficiency during medical emergencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldAlert,
                title: "Urgency-Based Requests",
                desc: "Alerts are automatically prioritized based on clinical urgency, instantly reaching compatible nearby donors."
              },
              {
                icon: Building2,
                title: "Hospital Coordination",
                desc: "Medical teams and blood banks can seamlessly manage live inventories, avoiding crucial administrative delays."
              },
              {
                icon: Activity,
                title: "Real-Time Notifications",
                desc: "Matches are calculated using geolocation and blood type compatibility, triggering instant SMS or WhatsApp alerts."
              },
              {
                icon: Layers,
                title: "Secure Data Control",
                desc: "All health data is secured using advanced access parameters compliant with global medical privacy standards."
              },
              {
                icon: Sparkles,
                title: "Public Health Integration",
                desc: "Tailored to supplement existing healthcare networks and emergency medical dispatcher tools."
              },
              {
                icon: Smartphone,
                title: "Mobile-First Design",
                desc: "Clean, ultra-fast web interface optimized to load on mobile browsers even under weak internet connections."
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="group border border-border/40 hover:border-primary/20 bg-card hover:bg-primary/[0.02] hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all duration-300">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Who Can Use Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/40">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="bg-primary/10 text-primary">Target Audience</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Who Can Use {APP_CONFIG.appName}?</h2>
            <p className="text-muted-foreground">
              A unified platform designed to serve three core nodes of the healthcare network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Blood Donors",
                desc: "Individuals eager to save lives. Easily register, receive urgent requests matching your blood type near you, and track your donation impacts.",
                cta: "Become a Donor",
                link: "/login?role=donor"
              },
              {
                icon: Building2,
                title: "Hospitals & Blood Banks",
                desc: "Clinicians and coordinators. Post real-time emergencies, update inventory availability, and connect with willing local donors instantly.",
                cta: "Register Institution",
                link: "/login?role=hospital"
              },
              {
                icon: Users,
                title: "Patients & Recipients",
                desc: "Families facing emergencies. Find verified medical facilities with matching stocks and easily alert the community to find donors.",
                cta: "Find Support",
                link: "/login?role=patient"
              }
            ].map((role, idx) => {
              const Icon = role.icon;
              return (
                <Card key={idx} className="relative flex flex-col justify-between overflow-hidden border border-border/50 bg-gradient-to-b from-card to-muted/30 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/30 to-secondary/30" />
                  <CardContent className="p-8 space-y-6 flex-grow">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{role.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
                  </CardContent>
                  <div className="p-8 pt-0">
                    <Button className="w-full justify-between group" variant="outline" asChild>
                      <Link href={role.link}>
                        <span>{role.cta}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Commitment & Support */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/[0.08] to-secondary/5 border-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <CardContent className="p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Our Unwavering Commitment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We are dedicated to ensuring that <strong>no life is lost due to a delay in blood availability</strong>. Through technology, we bridge the gap between donors and hospitals, building a secure, rapid, and highly accessible network.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <strong>Email:</strong> reach.saad@outlook.com
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <Button size="lg" className="w-full md:w-auto h-12 px-8 text-base shadow-lg shadow-primary/25" asChild>
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </ScrollArea>
    </ClientPortal>
  );
}
