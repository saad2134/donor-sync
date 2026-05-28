// app/contact/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { ContactForm } from "@/components/landing-page/contact-form";
import { APP_CONFIG } from "@/config/CORE_CONFIG";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, HeartHandshake } from "lucide-react";

export const metadata = {
  title: `Contact Us | ${APP_CONFIG.appName}`,
  description: `Get in touch with the ${APP_CONFIG.appName} team for support, inquiries, or collaboration opportunities.`,
};

export default function Contact() {
  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-b from-background via-background/95 to-background">
        <BusinessNavbar />

        {/* Hero Section */}
        <div className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
          {/* Background decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <Badge className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300">
              Contact Us
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent">
              Let&apos;s Start a <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Conversation</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Have questions about integrating with your hospital system, partnership options, or need technical support? We&apos;d love to hear from you.
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Side: Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Email Card */}
              <Card className="border border-border/40 bg-card hover:bg-primary/[0.01] transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-[3px] h-full bg-primary" />
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Email Directly</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    For general support, media inquiries, or institutional onboarding questions, drop us an email.
                  </p>
                  <div className="pt-2">
                    <a
                      href="mailto:reach.saad@outlook.com"
                      className="text-lg font-semibold text-primary hover:underline flex items-center gap-2"
                    >
                      reach.saad@outlook.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Card */}
              <Card className="border border-border/40 bg-card hover:bg-primary/[0.01] transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-[3px] h-full bg-yellow-500" />
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold">Typical Response Time</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We typically respond to all inquiries within <strong>24 hours</strong> during business days. For urgent matters, please append &quot;URGENT&quot; to your subject.
                  </p>
                </CardContent>
              </Card>

              {/* Partnership Card */}
              <Card className="border border-border/40 bg-card hover:bg-primary/[0.01] transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-primary to-secondary" />
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <HeartHandshake className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Partnerships &amp; Drives</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Want to coordinate blood donation drives or integrate DonorSync features into your non-profit/NGO portal? Reach out to collaborate!
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Right Side: Contact Form Card */}
            <div className="lg:col-span-7">
              <Card className="border border-border/50 bg-gradient-to-b from-card to-muted/10 shadow-lg shadow-primary/[0.02]">
                <CardContent className="p-8 sm:p-10 space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Send us a Message</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Complete the form below to get in touch. We will review your submission and contact you promptly.
                    </p>
                  </div>
                  
                  <div className="border-t border-border/40 pt-6">
                    <ContactForm />
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>

        <Footer />
      </ScrollArea>
    </ClientPortal>
  );
}