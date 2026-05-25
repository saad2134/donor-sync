//@ts-nocheck
"use client";

import React from "react";
import { useEffect, useState } from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";

import GreetingCard from "@/components/portals/common-parts/greeting-card"


// User Imports
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getUserDataById } from "@/firebaseFunctions";



export default function DashboardPage() {
  const sidebar = useStore(useSidebar, (x) => x);
  const { userId, role, device, setUser } = useUser();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchPatientData() {
      if (!userId) return; // ✅ Safe condition inside useEffect
      const data = await getUserDataById(userId, "patient");
      setProfile(data);
    }
    fetchPatientData();
  }, [userId]);

  // ✅ Sidebar check inside JSX instead of returning early
  if (!sidebar) {
    return <div>Loading Sidebar...</div>;
  }

  return (
    <ContentLayout title="Dashboard">



      <div>
        <GreetingCard name={profile?.p_name} role="patient" />
      </div>

      <div className="pb-10">
        <Card className={`text-foreground transition-all duration-500 shadow-lg`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground ">
              Health & Medical Status (Live Data)
            </CardTitle>
            <CardDescription className="text-lg text-foreground">
              🏥 Current Health Condition: (Stable / Critical / Under Observation)
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="pb-10">
        <Card className={`text-foreground transition-all duration-500 shadow-lg`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground ">
              Blood Request Status
            </CardTitle>
            <CardDescription className="text-lg text-foreground">
              <br></br>
              <ul>
                <li>📌 <strong>Required Blood Type:</strong> O-</li>
                <li>📌 <strong>Units Needed:</strong> 2</li>
                <li>📌 <strong>Urgency:</strong> 🔴 Emergency</li>
                <li>📌 <strong>Matched Donor:</strong> ✔ Yes (1 Available)</li>
                <li>📌 <strong>ETA for Blood Units:</strong> 1 Hour</li>
              </ul>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="pb-10">
        <Card className={`text-foreground transition-all duration-500 shadow-lg`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground ">
              🏥 Latest Health Updates
            </CardTitle>
            <CardDescription className="text-lg text-foreground">
              <br></br>
              <ul>
                <li>💊 <strong>Treatment:</strong> Post-Surgery Recovery</li>
                <li>📝 <strong>Doctor’s Notes:</strong>
                  <blockquote>"Patient requires immediate transfusion. Monitor BP every 30 min."</blockquote>
                </li>
                <li>⚠ <strong>Complications:</strong> None reported so far.</li>
                <li>📈 <strong>Vitals:</strong>
                  <ul>
                    <li><strong>Blood Pressure:</strong> 110/70</li>
                    <li><strong>Oxygen Level:</strong> 98%</li>
                    <li><strong>Heart Rate:</strong> 78 BPM</li>
                  </ul>
                </li>
              </ul>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="pb-10">
        <Card className={`text-foreground transition-all duration-500 shadow-lg`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground ">
              🩺 Blood Bank Availability Nearby
            </CardTitle>
            <CardDescription className="text-lg text-foreground">
              <br></br>
              <ul>
                <li>🏥 <strong>City Blood Bank:</strong> ✅ Available (5 Units)</li>
                <li>🏥 <strong>Metro Blood Center:</strong> ⚠ Low Stock (1 Unit)</li>
                <li>🏥 <strong>Red Cross Bank:</strong> ❌ Out of Stock</li>
              </ul>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

    </ContentLayout>
  );
}
