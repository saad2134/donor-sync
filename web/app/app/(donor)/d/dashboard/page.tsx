// --@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GreetingCard from "@/components/portals/common-parts/greeting-card";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { getUserDataById } from "@/firebaseFunctions";
import { Badge } from "@/components/ui/badge";
import { parse, addDays, differenceInDays, format } from "date-fns";
import { Heart, Calendar, Clock, MapPin, Sparkles, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { userId } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [urgentRequests, setUrgentRequests] = useState<any[]>([]);
  const [eligibility, setEligibility] = useState<{ isEligible: boolean; daysRemaining: number; nextDate: string }>({
    isEligible: true,
    daysRemaining: 0,
    nextDate: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !db) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Donor Profile
        const donorData = (await getUserDataById(userId, "donor")) as any;
        setProfile(donorData);

        if (donorData) {
          // Calculate Eligibility
          if (donorData.d_dateLastDonation) {
            try {
              const lastDate = parse(donorData.d_dateLastDonation, "yyyy-MM-dd", new Date());
              const nextDate = addDays(lastDate, 56); // 56 days whole blood interval
              const diff = differenceInDays(nextDate, new Date());
              if (diff > 0) {
                setEligibility({
                  isEligible: false,
                  daysRemaining: diff,
                  nextDate: format(nextDate, "PPP"),
                });
              } else {
                setEligibility({
                  isEligible: true,
                  daysRemaining: 0,
                  nextDate: "",
                });
              }
            } catch (e) {
              console.error("Failed to parse last donation date", e);
            }
          }
        }

        // 2. Fetch Top 3 Urgent Requests
        const reqRef = collection(db, "hospital-requests");
        const q = query(
          reqRef,
          where("status", "==", "open"),
          where("isUrgent", "==", "yes"),
          limit(3)
        );
        const qSnap = await getDocs(q);
        const fetchedReqs = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUrgentRequests(fetchedReqs);
      } catch (error) {
        console.error("Error loading donor dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  return (
    <ContentLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <GreetingCard name={profile?.d_name} role="donor" />
        </div>

        {/* 1. Eligibility Banner */}
        <div>
          {eligibility.isEligible ? (
            <Card className="text-white shadow-lg bg-gradient-to-r from-emerald-500 to-green-600 border-none rounded-2xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Heart className="h-44 w-44" />
              </div>
              <CardHeader className="flex flex-row items-center gap-4">
                <Sparkles className="h-10 w-10 shrink-0 animate-pulse text-white" />
                <div>
                  <CardTitle className="text-2xl font-bold">You are eligible to donate! 🎉</CardTitle>
                  <CardDescription className="text-white/90 text-sm mt-1">
                    Your last donation was over 56 days ago (or not recorded). You can schedule a donation to save lives today!
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <Card className="shadow-lg border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/5 rounded-2xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-5">
                <AlertCircle className="h-44 w-44 text-orange-500" />
              </div>
              <CardHeader className="flex flex-row items-center gap-4">
                <Clock className="h-10 w-10 shrink-0 text-orange-500" />
                <div>
                  <CardTitle className="text-2xl font-bold text-orange-600 dark:text-orange-400">Next Donation in {eligibility.daysRemaining} days ⏳</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm mt-1">
                    You can donate blood again on <strong>{eligibility.nextDate}</strong>. (Min. 56-day gap required between whole blood donations).
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          )}
        </div>

        {/* 2. Urgent Requests Preview */}
        <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Urgent Blood Requests</CardTitle>
              <CardDescription>Urgent requirement postings from nearby hospitals</CardDescription>
            </div>
            <Link href="/app/d/donate/urgent" passHref>
              <Button size="sm" className="bg-accent text-white">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-6 text-muted-foreground text-sm">Loading urgent requests...</div>
            ) : urgentRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No active urgent blood requests reported.
              </div>
            ) : (
              <div className="space-y-3">
                {urgentRequests.map((req) => (
                  <div key={req.id} className="p-4 border border-border/40 rounded-xl bg-muted/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{req.hospitalName}</p>
                        <Badge className="bg-red-500 text-white text-[10px]">Urgent</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0 text-red-500" />
                        {req.hospitalCity || "Nearby Location"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Blood Type</p>
                        <p className="font-extrabold text-red-500 text-sm">{req.bloodGroupNeeded}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Qty Needed</p>
                        <p className="font-extrabold text-foreground text-sm">{req.bloodQtyNeeded} units</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
