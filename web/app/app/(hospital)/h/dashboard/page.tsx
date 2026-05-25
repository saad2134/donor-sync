//@ts-nocheck
"use client";
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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
    async function fetchHospitalData() {
      if (!userId) return; // ✅ Safe condition inside useEffect
      const data = await getUserDataById(userId, "hospital");
      setProfile(data);
    }
    fetchHospitalData();
  }, [userId]);

  // ✅ Sidebar check inside JSX instead of returning early
  if (!sidebar) {
    return <div>Loading Sidebar...</div>;
  }

  return (
    <ContentLayout title="Dashboard">



      <div>
        <GreetingCard name={profile?.h_admin_name} role="hospital" />
      </div>

      

    </ContentLayout>
  );
}
