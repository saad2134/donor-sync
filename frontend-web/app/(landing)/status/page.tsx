"use client";

import { useState, useEffect } from "react";
import ClientPortal from "@/components/ClientPortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
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
    if (loading) return 'bg-muted-100 dark:bg-muted-900/30';
    if (allOperational) return 'bg-green-100 dark:bg-green-900/30';
    if (hasIssues) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getStatusIcon = () => {
    if (loading) return <RefreshCw className="w-8 h-8 text-muted-600 dark:text-muted-400 animate-spin" />;
    if (allOperational) return <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />;
    if (hasIssues) return <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />;
    return <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />;
  };

  const getStatusText = () => {
    if (loading) return 'Checking Status...';
    if (allOperational) return 'All Systems Operational';
    if (hasIssues) return 'Some Services Have Issues';
    return 'System Degraded';
  };

  return (
    <ClientPortal>
      <ScrollArea className="h-screen bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <BusinessNavbar />

        <div className="max-w-4xl mx-auto p-8 pt-32 pb-20">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">System Status</h1>
            <p className="text-muted-foreground">Real-time status of all {APP_CONFIG.appName} services and dependencies.</p>
          </div>

          <Card className="p-6 mb-6 border-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${getStatusColor()}`}>
                  {getStatusIcon()}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    {getStatusText()}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {lastChecked ? `Last checked: ${lastChecked}` : 'Loading...'}
                  </p>
                </div>
              </div>
              <Button
                onClick={fetchStatus}
                disabled={loading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </Card>

          <div className="space-y-3">
            {loading && !data ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 mx-auto animate-spin text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Checking service status...</p>
              </div>
            ) : (
              data?.services.map((service, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {service.status ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className="font-medium text-foreground">{service.name}</span>
                    </div>
                    <div className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${service.status ? "bg-green-500 hover:bg-green-600 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-white"}`}>
                      {service.status ? "Operational" : "Issues"}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 ml-8">
                    Last checked: {new Date(service.timestamp).toLocaleString()}
                  </p>
                </Card>
              ))
            )}
          </div>

          <Card className="p-4 mt-6 bg-muted/50">
            <h3 className="font-semibold text-foreground mb-2">About This Status Page</h3>
            <p className="text-sm text-muted-foreground">
              This page monitors the status of core services and dependencies used by {APP_CONFIG.appName}.
              Checks are performed every 60 seconds automatically. Services are checked via HTTP HEAD requests
              with a 5-second timeout. If you notice any persistent issues, please contact our support team.
            </p>
          </Card>
        </div>

        <Footer />
      </ScrollArea>
    </ClientPortal>
  );
}
