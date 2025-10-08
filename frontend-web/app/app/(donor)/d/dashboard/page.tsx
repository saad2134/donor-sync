// --@ts-nocheck
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
import Link from "next/link"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button";

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
    async function fetchDonorData() {
      if (!userId) return; // ✅ Safe condition inside useEffect
      const data = await getUserDataById(userId, "donor");
      setProfile(data);
    }
    fetchDonorData();
  }, [userId]);

  // ✅ Sidebar check inside JSX instead of returning early
  if (!sidebar) {
    return <div>Loading Sidebar...</div>;
  }

  return (
    <ContentLayout title="Dashboard">



      <div>
        <GreetingCard name={profile?.d_name} role="donor" />
      </div>

      <div className="pb-10">
        <Card className={`text-foreground transition-all duration-500 shadow-lg bg-gradient-to-r from-green-400 to-green-600`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground ">
              You're eligible to donate!
            </CardTitle>
            <CardDescription className="text-lg text-foreground">
              Your donation today will give someone another chance at life.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className={`text-foreground transition-all duration-500 shadow-lg `}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground pb-10">
            Urgent Blood Requests
          </CardTitle>


          <Card className="w-full max-w-md mx-auto p-6  text-center">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                Click here to see Urgent Donations
              </h2>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/app/d/donate/urgent" passHref>
                <Button asChild className="bg-accent">
                  <a>View Requests</a>
                </Button>
              </Link>
            </CardFooter>
          </Card>


          <CardDescription className="text-lg">

          </CardDescription>
        </CardHeader>
        <CardContent>

        </CardContent>
      </Card>

    </ContentLayout>
  );
}
