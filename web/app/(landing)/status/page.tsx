// app/status/page.tsx
"use client";

import { useState, useEffect } from "react";
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, Info, Server } from "lucide-react";
import { APP_CONFIG } from "@/config/CORE_CONFIG";

interface ServiceStatus {
  name: string;
  status: boolean;
  timestamp: string;
}

interface StatusResponse {
  status: string;
  services: ServiceStatus[];
  checkedAt: string;
}

export default function StatusPage() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const json = await res.json();
      setData(json);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const allOperational = data?.status === 'operational';
  const hasIssues = data?.status === 'issues';

  const getStatusColor = () => {
    if (loading) return 'border-muted/30 bg-muted/[0.03] text-muted-foreground';
    if (allOperational) return 'border-green-500/20 bg-green-500/[0.03] text-green-500';
    if (hasIssues) return 'border-yellow-500/20 bg-yellow-500/[0.03] text-yellow-500';
    return 'border-red-500/20 bg-red-500/[0.03] text-red-500';
  };

  const getStatusShadow = () => {
    if (loading) return '';
    if (allOperational) return 'shadow-xl shadow-green-500/[0.02] dark:shadow-green-500/[0.03]';
    if (hasIssues) return 'shadow-xl shadow-yellow-500/[0.02] dark:shadow-yellow-500/[0.03]';
    return 'shadow-xl shadow-red-500/[0.02] dark:shadow-red-500/[0.03]';
  };

  const getStatusIcon = () => {
    if (loading) return <RefreshCw className="w-6 h-6 text-muted-500 animate-spin" />;
    if (allOperational) return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    if (hasIssues) return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Checking Status...';
    if (allOperational) return 'All Systems Operational';
    if (hasIssues) return 'Some Services Have Issues';
    return 'System Degraded';
  };

  return (
    <ClientPortal>
      <ScrollArea className="h-screen absolute-0 bg-gradient-to-b from-background via-background/95 to-background">
        <BusinessNavbar />

        {/* Hero Section */}
        <div className="relative overflow-hidden pt-32 pb-12 lg:pt-40 lg:pb-16">
          {/* Background decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <Badge className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300">
              System Status
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent">
              Live Infrastructure Monitor
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real-time checkups of all {APP_CONFIG.appName} microservices, databases, and third-party APIs.
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          
          {/* Overall Health Panel */}
          <Card className={`border ${getStatusColor()} ${getStatusShadow()} transition-all duration-500 mb-8`}>
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
                  <div className={`w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-md relative`}>
                    {getStatusIcon()}
                    {!loading && allOperational && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500"></span>
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                      {getStatusText()}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {lastChecked ? `Last synchronized: ${lastChecked}` : 'Connecting to gateway...'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={fetchStatus}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-card hover:bg-muted/50 border-border/60 hover:border-border transition-all w-full sm:w-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Check Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Individual Service list */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 text-sm font-semibold text-muted-foreground">
              <Server className="w-4 h-4" />
              <span>Service Registry Status</span>
            </div>
            
            {loading && !data ? (
              <Card className="border border-border/40 p-12 text-center">
                <CardContent className="p-0 space-y-4">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Connecting and querying services...</p>
                </CardContent>
              </Card>
            ) : (
              data?.services.map((service, index) => (
                <Card key={index} className="border border-border/40 hover:border-primary/10 bg-card hover:bg-primary/[0.005] transition-all duration-300 relative overflow-hidden">
                  <CardContent className="p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center flex-shrink-0">
                        {service.status ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-500 animate-pulse" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-foreground block leading-none">{service.name}</span>
                        <span className="text-xs text-muted-foreground block">
                          Verified: {new Date(service.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant={service.status ? "default" : "secondary"} 
                      className={`font-semibold transition-all px-3 py-1 ${service.status ? "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20"}`}
                    >
                      {service.status ? "Operational" : "Degraded"}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* About this panel card */}
          <Card className="border border-border/40 bg-muted/30 dark:bg-muted/10 mt-8 relative overflow-hidden">
            <CardContent className="p-6 sm:p-8 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-base">Monitoring Disclosures</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Status variables are updated every 60 seconds automatically. Systems are checked using asynchronous HTTP HEAD calls. If you represent an institution experiencing integration delays, please consult the support team at <a href="mailto:reach.saad@outlook.com" className="text-primary hover:underline font-semibold">reach.saad@outlook.com</a>.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        <Footer />
      </ScrollArea>
    </ClientPortal>
  );
}
