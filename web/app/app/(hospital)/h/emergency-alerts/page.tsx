// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { getUserDataById } from "@/firebaseFunctions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Megaphone, Trash2, Calendar, Phone, Eye } from "lucide-react";

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function EmergencyAlertsPage() {
  const { toast } = useToast();
  const { userId } = useUser();

  const [profile, setProfile] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bloodGroupNeeded, setBloodGroupNeeded] = useState("O-");
  const [alertMessage, setAlertMessage] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    if (!userId || !db) return;

    const fetchAlertsAndProfile = async () => {
      setLoading(true);
      try {
        const pData = (await getUserDataById(userId, "hospital")) as any;
        setProfile(pData);
        if (pData?.h_phone) {
          setContactPhone(pData.h_phone);
        }

        const alertsRef = collection(db, "emergency-alerts");
        const q = query(alertsRef, where("hospitalId", "==", userId));
        const qSnap = await getDocs(q);
        const fetchedAlerts = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort descending
        fetchedAlerts.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
          return dateB - dateA;
        });

        setAlerts(fetchedAlerts);
      } catch (err) {
        console.error("Failed to load emergency-alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertsAndProfile();
  }, [userId]);

  const handleBroadcastAlert = async () => {
    if (!db || !userId) return;

    if (!bloodGroupNeeded || !alertMessage || !contactPhone) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill out all fields to dispatch alert.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const alertId = `${userId}-alert-${Date.now()}`;
      const newAlert = {
        hospitalId: userId,
        hospitalName: profile?.h_name || "Partner Hospital",
        hospitalCity: profile?.h_city || "",
        bloodGroupNeeded,
        message: alertMessage,
        phone: contactPhone,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "emergency-alerts", alertId), newAlert);

      setAlerts(prev => [
        { id: alertId, ...newAlert },
        ...prev
      ]);

      toast({
        title: "🚨 Alert Dispatched",
        description: `Emergency alert broadcasted to all nearby ${bloodGroupNeeded} donors.`,
      });

      setDialogOpen(false);
      setAlertMessage("");
    } catch (err) {
      console.error("Failed to dispatch alert:", err);
      toast({
        title: "❌ Broadcast Failed",
        description: "Failed to broadcast emergency alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to stop broadcasting this alert?")) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "emergency-alerts", alertId));
      setAlerts(prev => prev.filter(a => a.id !== alertId));

      toast({
        title: "🗑️ Alert Terminated",
        description: "Emergency alert broadcast stopped successfully.",
      });
    } catch (err) {
      console.error("Failed to delete alert:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ContentLayout title="Emergency Alerts">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500 animate-pulse shrink-0" />
            <h2 className="text-2xl font-semibold">Emergency Alerts</h2>
          </div>
          <p className="text-foreground text-md mt-2">
            Broadcast urgent requirement alerts to all registered donors in your local region immediately.
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 shrink-0" onClick={() => setDialogOpen(true)}>
          <Megaphone className="h-4 w-4" /> Dispatch Emergency Alert
        </Button>
      </div>

      <div className="space-y-4 px-2">
        <h3 className="font-bold text-lg border-b border-border/40 pb-2 flex items-center gap-2">
          <Eye className="h-5 w-5 text-accent" /> Active Broadcasts ({alerts.length})
        </h3>

        {loading && alerts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Loading active alerts...</div>
        ) : alerts.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No active emergency alerts currently broadcasting.</p>
            <p className="text-gray-400 text-sm mt-1">Use the dispatch tool to broadcast critical needs to local donors.</p>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="relative overflow-hidden border border-red-500/20 bg-red-500/5 hover:shadow-md transition rounded-2xl">
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-red-600 animate-pulse" />

              <CardContent className="p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 text-white flex items-center gap-1">
                      🚨 Critical Group: {alert.bloodGroupNeeded}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {formatDate(alert.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-foreground italic">
                    "{alert.message}"
                  </p>

                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3 text-red-500 shrink-0" /> Contact Phone: <strong className="text-foreground">{alert.phone}</strong>
                  </p>
                </div>

                <Button
                  onClick={() => handleDeleteAlert(alert.id)}
                  variant="outline"
                  className="text-red-600 border-red-500/30 hover:bg-red-500/10 gap-1.5 w-full md:w-auto"
                >
                  <Trash2 className="h-4 w-4" /> Stop Broadcast
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dispatch Alert Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 animate-pulse shrink-0" /> Dispatch Emergency Alert
              </DialogTitle>
              <Button onClick={() => setDialogOpen(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Blood Group Needed *</Label>
              <Select value={bloodGroupNeeded} onValueChange={setBloodGroupNeeded}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Alert Message *</Label>
              <textarea
                className="w-full h-24 p-2.5 rounded-lg border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="E.g. Urgent whole blood needed for an emergency surgery. Contact the front desk immediately."
              />
            </div>

            <div>
              <Label>Contact Phone *</Label>
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone number for callbacks"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleBroadcastAlert} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold gap-2">
              <Megaphone className="h-4 w-4 shrink-0 animate-bounce" /> Broadcast Emergency Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
