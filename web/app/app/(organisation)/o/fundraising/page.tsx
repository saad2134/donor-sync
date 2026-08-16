// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";
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
import { HeartHandshake, Award, Target, Coins, Plus, Calendar } from "lucide-react";

export default function FundraisingPage() {
  const { toast } = useToast();
  const { userId } = useUser();

  const [profile, setProfile] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // New Campaign Form State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("5000");
  const [description, setDescription] = useState("");

  // Record Donation Form State
  const [donateDialogOpen, setDonateDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    if (!userId || !db) return;

    const fetchCampaignsAndProfile = async () => {
      setLoading(true);
      try {
        const pData = await getUserDataById(userId, "organisation");
        setProfile(pData);

        const fundsRef = collection(db, "fundraisers");
        const q = query(fundsRef, where("organiserId", "==", userId));
        const qSnap = await getDocs(q);
        const fetched = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort descending
        fetched.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
          return dateB - dateA;
        });

        setCampaigns(fetched);
      } catch (err) {
        console.error("Failed to load fundraisers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignsAndProfile();
  }, [userId]);

  const handleLaunchCampaign = async () => {
    if (!db || !userId) return;

    if (!campaignTitle || !goalAmount || !description) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill out all fields to launch fundraiser.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const campId = `fund-${Date.now()}`;
      const newCampaign = {
        organiserId: userId,
        organiserName: profile?.o_name || "NGO Partner",
        title: campaignTitle,
        goalAmount: Number(goalAmount),
        raisedAmount: 0,
        description,
        status: "active",
        createdAt: new Date(),
      };

      await setDoc(doc(db, "fundraisers", campId), newCampaign);

      setCampaigns(prev => [
        { id: campId, ...newCampaign },
        ...prev
      ]);

      toast({
        title: "🎉 Campaign Launched",
        description: `"${campaignTitle}" fundraising campaign is now active.`,
      });

      setCreateDialogOpen(false);
      setCampaignTitle("");
      setDescription("");
      setGoalAmount("5000");
    } catch (err) {
      console.error("Failed to launch fundraiser:", err);
      toast({
        title: "❌ Launch Failed",
        description: "Could not launch fundraiser. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordDonation = async () => {
    if (!db || !selectedCampaign || !donationAmount) return;

    try {
      setLoading(true);
      const docRef = doc(db, "fundraisers", selectedCampaign.id);
      const newRaisedAmount = Number(selectedCampaign.raisedAmount || 0) + Number(donationAmount);

      await updateDoc(docRef, {
        raisedAmount: newRaisedAmount,
      });

      setCampaigns(prev =>
        prev.map(c => (c.id === selectedCampaign.id ? { ...c, raisedAmount: newRaisedAmount } : c))
      );

      toast({
        title: "💰 Donation Recorded",
        description: `Successfully added $${donationAmount} to "${selectedCampaign.title}".`,
      });

      setDonateDialogOpen(false);
      setDonationAmount("");
      setSelectedCampaign(null);
    } catch (err) {
      console.error("Failed to record donation:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (raised: number, goal: number) => {
    return Math.min(100, Math.round((raised / (goal || 1)) * 100));
  };

  return (
    <ContentLayout title="Fundraising Management">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-red-500 shrink-0" />
            <h2 className="text-2xl font-semibold">NGO Fundraisers</h2>
          </div>
          <p className="text-foreground text-md mt-2">
            Launch and monitor donation drives to support blood bank supply lines.
          </p>
        </div>
        <Button className="bg-accent text-white gap-2 shrink-0" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Launch Campaign
        </Button>
      </div>

      <div className="space-y-4 px-2">
        {loading && campaigns.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Loading active campaigns...</div>
        ) : campaigns.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No fundraising campaigns launched yet.</p>
            <p className="text-gray-400 text-sm mt-1">Start a campaign to fund central supply runs.</p>
          </Card>
        ) : (
          campaigns.map((camp) => {
            const pct = getPercentage(camp.raisedAmount, camp.goalAmount);

            return (
              <Card key={camp.id} className="relative overflow-hidden hover:shadow-md transition rounded-2xl">
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-red-500" />

                <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg truncate">{camp.title}</h3>
                      <Badge className="bg-green-500 hover:bg-green-600 capitalize">{camp.status}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {camp.description}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                        <span>💰 Raised: <strong>${camp.raisedAmount}</strong></span>
                        <span>🎯 Goal: <strong>${camp.goalAmount}</strong></span>
                      </div>
                      
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-emerald-600 font-bold">{pct}% Raised</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedCampaign(camp);
                      setDonateDialogOpen(true);
                    }}
                    className="bg-accent text-white gap-1.5 w-full sm:w-auto shrink-0 font-bold"
                  >
                    <Coins className="h-4 w-4" /> Record Donation
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Launch Campaign Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle>Launch Fundraising Campaign</DialogTitle>
              <Button onClick={() => setCreateDialogOpen(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Campaign Title *</Label>
              <Input
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                placeholder="E.g. Summer Blood Drive Sponsorship"
              />
            </div>

            <div>
              <Label>Target Goal Amount ($) *</Label>
              <Input
                type="number"
                min="100"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
              />
            </div>

            <div>
              <Label>Description / Purpose *</Label>
              <textarea
                className="w-full h-24 p-2.5 rounded-lg border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what the funds will be used for..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleLaunchCampaign} disabled={loading} className="w-full bg-accent text-white font-bold">
              {loading ? "Launching..." : "Launch Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Donation Dialog */}
      <Dialog open={donateDialogOpen} onOpenChange={setDonateDialogOpen}>
        <DialogContent className="max-w-xs text-left">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle>Record Donation</DialogTitle>
              <Button onClick={() => setDonateDialogOpen(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-xs text-muted-foreground font-semibold">
              Enter the donation amount received for "{selectedCampaign?.title}".
            </p>
            <div>
              <Label>Donation Amount ($) *</Label>
              <Input
                type="number"
                min="1"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleRecordDonation} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
              Record Donation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
