// --@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GreetingCard from "@/components/portals/common-parts/greeting-card";
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getUserDataById } from "@/firebaseFunctions";
import { Badge } from "@/components/ui/badge";
import { Droplet, Calendar, FileText, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BLOOD_GROUPS = [
  { short: "O+", key: "op" },
  { short: "O-", key: "on" },
  { short: "A+", key: "ap" },
  { short: "A-", key: "an" },
  { short: "B+", key: "bp" },
  { short: "B-", key: "bn" },
  { short: "AB+", key: "abp" },
  { short: "AB-", key: "abn" },
];

export default function DashboardPage() {
  const { userId } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Dashboard metrics
  const [totalUnits, setTotalUnits] = useState(0);
  const [neededGroups, setNeededGroups] = useState<string[]>([]);
  const [openRequestsCount, setOpenRequestsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  useEffect(() => {
    if (!userId || !db) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Hospital Profile
        const data = await getUserDataById(userId, "hospital");
        setProfile(data);

        // 2. Fetch Blood Inventory
        const inventoryRef = doc(db, "hospital-blood-inventory", userId);
        const inventorySnap = await getDoc(inventoryRef);
        if (inventorySnap.exists()) {
          const invData = inventorySnap.data();
          let sum = 0;
          const needed = [];
          BLOOD_GROUPS.forEach(g => {
            const count = invData[`${g.key}_count`] || 0;
            const isNeeded = invData[`${g.key}_needed`] === "yes";
            sum += Number(count);
            if (isNeeded) needed.push(g.short);
          });
          setTotalUnits(sum);
          setNeededGroups(needed);
        }

        // 3. Fetch Hospital requests metrics (open requests & total appointments)
        const requestsRef = collection(db, "hospital-requests");
        const q = query(requestsRef, where("hospitalId", "==", userId));
        const qSnap = await getDocs(q);
        
        let openCount = 0;
        let apptsCount = 0;

        qSnap.docs.forEach(doc => {
          const req = doc.data();
          if (req.status === "open") {
            openCount++;
          }
          apptsCount += (req.bookedDonors || []).length;
        });

        setOpenRequestsCount(openCount);
        setAppointmentsCount(apptsCount);
      } catch (err) {
        console.error("Error loading hospital dashboard metrics:", err);
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
          <GreetingCard name={profile?.h_admin_name} role="hospital" />
        </div>

        {/* Live Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Blood Inventory Total */}
          <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 to-rose-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">Total Stock</CardTitle>
                <CardDescription>Available blood bank units</CardDescription>
              </div>
              <Droplet className="h-8 w-8 text-red-500 shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">{totalUnits}</span>
                <span className="text-muted-foreground text-sm">Units</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {neededGroups.length === 0 ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                    Stock Stable
                  </Badge>
                ) : (
                  neededGroups.map(bg => (
                    <Badge key={bg} variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs flex items-center gap-0.5">
                      <AlertTriangle className="h-3 w-3" /> Needed: {bg}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Donation Appointments */}
          <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-sky-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">Donation Appointments</CardTitle>
                <CardDescription>Total slots booked by donors</CardDescription>
              </div>
              <Calendar className="h-8 w-8 text-blue-500 shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">{appointmentsCount}</span>
                <span className="text-muted-foreground text-sm">Bookings</span>
              </div>
              <Link href="/app/h/donor-management" passHref>
                <Button size="sm" variant="link" className="text-blue-500 hover:text-blue-600 mt-3 p-0 h-auto font-semibold">
                  Manage donor schedules &rarr;
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 3: Active Requests */}
          <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-500 to-amber-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">Active Requests</CardTitle>
                <CardDescription>Open blood requirement listings</CardDescription>
              </div>
              <FileText className="h-8 w-8 text-orange-500 shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">{openRequestsCount}</span>
                <span className="text-muted-foreground text-sm">Active Posts</span>
              </div>
              <Link href="/app/h/donor-management" passHref>
                <Button size="sm" variant="link" className="text-orange-500 hover:text-orange-600 mt-3 p-0 h-auto font-semibold">
                  Post new requirement &rarr;
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Live Vitals Updates */}
        <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl">
          <CardHeader className="flex flex-row items-center gap-3">
            <Activity className="h-8 w-8 text-rose-500 shrink-0" />
            <div>
              <CardTitle className="text-xl font-bold">Operational Statistics</CardTitle>
              <CardDescription>Key clinical status details</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Admin Officer</span>
                <span className="font-semibold text-foreground">{profile?.h_admin_name || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Coordinates</span>
                <span className="font-semibold text-foreground">
                  {profile?.h_lat && profile?.h_lon ? `${profile.h_lat}, ${profile.h_lon}` : "Not mapped"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Regional Zone</span>
                <span className="font-semibold text-foreground">{profile?.h_city ? `${profile.h_city}, ${profile?.h_region?.[1] || profile?.h_region?.[0]}` : "N/A"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Hospital Type</span>
                <span className="font-semibold text-foreground capitalize">{profile?.h_type || "Private"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">On-Site Blood Bank</span>
                <span className="font-semibold text-foreground capitalize">{profile?.h_bloodbank_available === "yes" ? "Yes (Active)" : "No"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Contact Phone</span>
                <span className="font-semibold text-foreground">{profile?.h_phone || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
