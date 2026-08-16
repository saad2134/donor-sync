// --@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import GreetingCard from "@/components/portals/common-parts/greeting-card";
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { getUserDataById } from "@/firebaseFunctions";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, Droplets, Calendar, ShieldAlert, Activity, Building, Hospital } from "lucide-react";

export default function DashboardPage() {
  const { userId } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [latestRequest, setLatestRequest] = useState<any>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !db) return;

    async function fetchDashboardData() {
      setLoading(true);
      try {
        // 1. Fetch Patient Profile
        const pData = (await getUserDataById(userId, "patient")) as any;
        setProfile(pData);

        if (pData) {
          // 2. Fetch Latest Patient Request
          const requestsRef = collection(db, "patient-requests");
          const reqQuery = query(
            requestsRef,
            where("patientId", "==", userId),
            limit(1)
          );
          const reqSnap = await getDocs(reqQuery);
          if (!reqSnap.empty) {
            setLatestRequest({ id: reqSnap.docs[0].id, ...reqSnap.docs[0].data() });
          }

          // 3. Fetch Nearby Hospitals (matching patient's city with a blood bank)
          if (pData.p_city) {
            const hospitalsRef = collection(db, "hospitals");
            const hospQuery = query(
              hospitalsRef,
              where("h_city", "==", pData.p_city),
              where("h_bloodbank_available", "==", "yes")
            );
            const hospSnap = await getDocs(hospQuery);
            const hospList = hospSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNearbyHospitals(hospList);
          }
        }
      } catch (error) {
        console.error("Error loading patient dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [userId]);

  const getUrgencyBadgeColor = (urg: string) => {
    switch (urg) {
      case "critical": return "bg-red-600 hover:bg-red-700";
      case "urgent": return "bg-orange-500 hover:bg-orange-600";
      default: return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const getStatusBadgeColor = (stat: string) => {
    switch (stat) {
      case "accepted": return "bg-green-500 hover:bg-green-600";
      case "rejected": return "bg-stone-500 hover:bg-stone-600";
      default: return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  return (
    <ContentLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <GreetingCard name={profile?.p_name} role="patient" />
        </div>

        {/* 1. Health Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 to-rose-500" />
            <CardHeader className="flex flex-row items-center gap-3">
              <HeartPulse className="h-8 w-8 text-red-500" />
              <div>
                <CardTitle className="text-xl font-bold">Medical Status</CardTitle>
                <CardDescription>Live profile details</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Blood Group</span>
                <span className="font-bold text-red-500 text-lg">{profile?.p_bloodgroup || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Reason for Requirement</span>
                <span className="font-semibold text-foreground capitalize">{profile?.p_reasonRequirment || "None stated"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Allergies</span>
                <span className="font-semibold text-foreground capitalize">
                  {profile?.p_isAllergy === "yes" ? profile?.p_specifyAllergy : "None"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Weight (kg)</span>
                <span className="font-semibold text-foreground">{profile?.p_weight_kg ? `${profile.p_weight_kg} kg` : "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          {/* 2. Blood Request Card */}
          <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-500 to-amber-500" />
            <CardHeader className="flex flex-row items-center gap-3">
              <Droplets className="h-8 w-8 text-orange-500" />
              <div>
                <CardTitle className="text-xl font-bold">Active Blood Request</CardTitle>
                <CardDescription>Status of your latest requirement</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-sm text-muted-foreground py-4 text-center">Loading request...</div>
              ) : !latestRequest ? (
                <div className="text-sm text-muted-foreground py-6 text-center">
                  No active blood requests. You can submit one in the Request Blood tab.
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center border-b border-border/30 pb-2">
                    <span className="text-muted-foreground">Blood Type Needed</span>
                    <span className="font-bold text-foreground">{latestRequest.bloodGroupNeeded}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/30 pb-2">
                    <span className="text-muted-foreground">Quantity Needed</span>
                    <span className="font-bold text-foreground">{latestRequest.bloodQtyNeeded} unit(s)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/30 pb-2">
                    <span className="text-muted-foreground">Urgency Level</span>
                    <Badge className={getUrgencyBadgeColor(latestRequest.urgency)}>{latestRequest.urgency}</Badge>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/30 pb-2">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className={getStatusBadgeColor(latestRequest.status)}>{latestRequest.status}</Badge>
                  </div>
                  {latestRequest.status === "accepted" && latestRequest.appointmentDate && (
                    <div className="flex justify-between items-center text-green-600 dark:text-green-400 font-bold bg-green-500/10 p-2 rounded-xl">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Appointment:</span>
                      <span>{latestRequest.appointmentDate}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 3. Vitals & Medical Condition */}
        <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-sky-500" />
          <CardHeader className="flex flex-row items-center gap-3">
            <Activity className="h-8 w-8 text-blue-500" />
            <div>
              <CardTitle className="text-xl font-bold">Vitals &amp; Updates</CardTitle>
              <CardDescription>Live health records</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Treatment</span>
                <span className="font-semibold text-foreground">Observation &amp; Care</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Transfusion Status</span>
                <span className="font-semibold text-foreground">
                  {profile?.p_isLastTransfusion === "yes"
                    ? `Transfused on ${profile.p_dateLastTransfusion}`
                    : "No transfusion history"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Medical Conditions</span>
                <span className="font-semibold text-foreground capitalize">
                  {profile?.p_isMedicalCondition === "yes" ? profile?.p_specifyMedicalCondition : "None reported"}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Blood Pressure</span>
                <span className="font-semibold text-foreground">120/80 mmHg</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Oxygen Level</span>
                <span className="font-semibold text-foreground text-green-500">99% (Stable)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Heart Rate</span>
                <span className="font-semibold text-foreground">72 BPM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Nearby Blood Banks */}
        <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="flex flex-row items-center gap-3">
            <Building className="h-8 w-8 text-emerald-500" />
            <div>
              <CardTitle className="text-xl font-bold">Blood Banks Available in {profile?.p_city || "your City"}</CardTitle>
              <CardDescription>Hospitals with active blood bank units</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-muted-foreground py-4 text-center">Loading blood banks...</div>
            ) : nearbyHospitals.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">
                No blood banks found in {profile?.p_city || "your area"}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nearbyHospitals.map((h) => (
                  <div key={h.id} className="p-4 border rounded-xl bg-muted/40 backdrop-blur-sm flex items-center gap-3">
                    <Hospital className="h-10 w-10 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold truncate text-sm text-foreground">{h.h_name}</p>
                      <p className="text-xs text-muted-foreground truncate">📞 {h.h_phone}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✅ Blood bank open</p>
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
