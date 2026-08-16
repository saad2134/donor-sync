// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { getUserDataById } from "@/firebaseFunctions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Target, Trash2, Heart, Award } from "lucide-react";

export default function CampsAndEventsPage() {
  const { toast } = useToast();
  const { userId } = useUser();

  const [profile, setProfile] = useState<any>(null);
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Scheduling Form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [campName, setCampName] = useState("");
  const [campDate, setCampDate] = useState("");
  const [campTime, setCampTime] = useState("09:00 AM - 04:00 PM");
  const [venue, setVenue] = useState("");
  const [targetGoal, setTargetGoal] = useState("50");

  useEffect(() => {
    if (!userId || !db) return;

    const fetchCampsAndProfile = async () => {
      setLoading(true);
      try {
        const pData = await getUserDataById(userId, "organisation");
        setProfile(pData);

        const campsRef = collection(db, "donation-camps");
        const q = query(campsRef, where("organiserId", "==", userId));
        const qSnap = await getDocs(q);
        const fetchedCamps = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort descending by date
        fetchedCamps.sort((a: any, b: any) => a.date.localeCompare(b.date));

        setCamps(fetchedCamps);
      } catch (err) {
        console.error("Failed to load donation camps:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampsAndProfile();
  }, [userId]);

  const handleScheduleCamp = async () => {
    if (!db || !userId) return;

    if (!campName || !campDate || !venue || !targetGoal) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill out all fields to schedule a camp.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const campId = `${userId}-camp-${Date.now()}`;
      const newCamp = {
        organiserId: userId,
        organiserName: profile?.o_name || "NGO Partner",
        campName,
        date: campDate,
        time: campTime,
        venue,
        targetGoal: Number(targetGoal),
        status: "scheduled",
        createdAt: new Date(),
      };

      await setDoc(doc(db, "donation-camps", campId), newCamp);

      setCamps(prev => [
        ...prev,
        { id: campId, ...newCamp }
      ].sort((a, b) => a.date.localeCompare(b.date)));

      toast({
        title: "📅 Camp Scheduled",
        description: `"${campName}" was scheduled for ${campDate}.`,
      });

      setDialogOpen(false);
      // Reset form
      setCampName("");
      setCampDate("");
      setVenue("");
      setTargetGoal("50");
    } catch (err) {
      console.error("Failed to schedule camp:", err);
      toast({
        title: "❌ Schedule Failed",
        description: "Failed to schedule the camp. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCamp = async (campId: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to cancel and remove this donation camp?")) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "donation-camps", campId));
      setCamps(prev => prev.filter(c => c.id !== campId));

      toast({
        title: "🗑️ Camp Cancelled",
        description: "The donation camp was successfully cancelled.",
      });
    } catch (err) {
      console.error("Failed to cancel camp:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout title="Camps &amp; Events">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-red-500 shrink-0" />
            <h2 className="text-2xl font-semibold">Camps &amp; Events Management</h2>
          </div>
          <p className="text-foreground text-md mt-2">
            Schedule blood donation drives, manage venues, and track donor turnout.
          </p>
        </div>
        <Button className="bg-accent text-white gap-2 shrink-0" onClick={() => setDialogOpen(true)}>
          <Calendar className="h-4 w-4" /> Schedule New Camp
        </Button>
      </div>

      <div className="space-y-4 px-2">
        <h3 className="font-bold text-lg border-b border-border/40 pb-2 flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" /> Scheduled Drives ({camps.length})
        </h3>

        {loading && camps.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Loading scheduled camps...</div>
        ) : camps.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No blood donation camps scheduled yet.</p>
            <p className="text-gray-400 text-sm mt-1">Plan a donation drive using the "Schedule New Camp" tool.</p>
          </Card>
        ) : (
          camps.map((camp) => (
            <Card key={camp.id} className="relative overflow-hidden hover:shadow-md transition rounded-2xl">
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-red-500" />

              <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{camp.campName}</h3>
                    <Badge className="bg-green-500 hover:bg-green-600 capitalize">{camp.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span>Date: <strong className="text-foreground">{camp.date}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span>Venue: <strong className="text-foreground">{camp.venue}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-red-500" />
                      <span>Goal: <strong className="text-foreground">{camp.targetGoal} units</strong></span>
                    </p>
                    <p>⏰ Time: <strong className="text-foreground">{camp.time}</strong></p>
                  </div>
                </div>

                <Button
                  onClick={() => handleCancelCamp(camp.id)}
                  variant="outline"
                  className="text-red-600 border-red-500/30 hover:bg-red-500/10 gap-1.5 w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4" /> Cancel Camp
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Schedule Camp Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle>Schedule Blood Donation Camp</DialogTitle>
              <Button onClick={() => setDialogOpen(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Camp Name *</Label>
              <Input
                value={campName}
                onChange={(e) => setCampName(e.target.value)}
                placeholder="E.g. Metro Mall Donation Drive"
              />
            </div>

            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={campDate}
                onChange={(e) => setCampDate(e.target.value)}
              />
            </div>

            <div>
              <Label>Time Slot *</Label>
              <Input
                value={campTime}
                onChange={(e) => setCampTime(e.target.value)}
                placeholder="E.g. 09:00 AM - 04:00 PM"
              />
            </div>

            <div>
              <Label>Venue Location / Address *</Label>
              <Input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="E.g. Community Center, 5th Ave"
              />
            </div>

            <div>
              <Label>Target Donation Goal (units) *</Label>
              <Input
                type="number"
                min="10"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleScheduleCamp} disabled={loading} className="w-full bg-accent text-white">
              {loading ? "Scheduling..." : "Schedule Donation Camp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}