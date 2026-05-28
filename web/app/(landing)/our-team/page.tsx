// app/our-team/page.tsx
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { APP_CONFIG } from "@/config/CORE_CONFIG";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Award, Github, Linkedin, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Our Team | ${APP_CONFIG.appName}`,
  description: `Meet the team behind the ${APP_CONFIG.appName} platform.`,
};

export default function TeamPage() {
  const team = [
    { 
      name: "Fareed Ahmed Owais", 
      role: "🎯 Team Lead", 
      initials: "FAO",
      github: "https://github.com/FareedAhmedOwais",
      linkedin: null
    },
    { 
      name: "Mohammed Saaduddin", 
      role: "🚀 Lead Full-stack & AI/ML Developer", 
      initials: "MS",
      github: "https://github.com/saad2134",
      linkedin: "https://linkedin.com/in/saad2134"
    },
    { 
      name: "Abdur Rahman Qasim", 
      role: "🔎 Lead Research Engineer", 
      initials: "ARQ",
      github: "https://github.com/Abdur-rahman-01",
      linkedin: null
    },
    { 
      name: "Mohammed Abdul Rahman", 
      role: "🖼️ Lead Front-end Developer", 
      initials: "MAR",
      github: "https://github.com/Abdul-Rahman26",
      linkedin: null
    },
  ];

  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-b from-background via-background/95 to-background">
        <BusinessNavbar />

        {/* Hero Header */}
        <div className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <Badge className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300">
              Meet The Team
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent">
              The Team Behind <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DonorSync</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We started as a passionate group of students and developers participating in GDG hackathons, motivated by the dream of saving lives using technology.
            </p>
          </div>
        </div>

        {/* Main Content Info */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-gradient-to-br from-primary/[0.02] via-primary/[0.04] to-transparent border-primary/10 mb-16">
            <CardContent className="p-8 sm:p-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Hackathon Origin</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The core of this application was initially developed as a prototype for the <strong>Google Developer Group on Campus Solution Challenge 2025 Hackathon</strong>, organised by <strong>Hack2innovate</strong>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <Card key={i} className="group overflow-hidden border border-border/40 bg-card hover:bg-primary/[0.01] hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                <CardContent className="p-8 text-center flex flex-col flex-grow">
                  {/* Decorative Profile Circle */}
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/10 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300 shadow-md mb-6 flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">
                      {member.initials}
                    </span>
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-0 group-hover:scale-105 transition-transform duration-300" />
                  </div>

                  <div className="space-y-2 mb-6">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>

                  <div className="flex justify-center gap-3 mt-auto pt-4 text-muted-foreground border-t border-border/40">
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Status */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="border border-yellow-500/20 bg-yellow-500/[0.02] dark:bg-yellow-500/[0.01] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-yellow-500" />
            <CardContent className="p-8 sm:p-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-yellow-600 dark:text-yellow-500">Current Development Status</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Development is currently temporarily paused as our team members focus on new academic and industry endeavors. We hope to resume active deployment and additional feature developments in the near future.
              </p>
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Interested in contributing or learning more?
                </span>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:reach.saad@outlook.com" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>reach.saad@outlook.com</span>
                  </a>
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
