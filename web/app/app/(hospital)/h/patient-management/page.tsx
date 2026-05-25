"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, orderBy, query, where, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Link from "next/link";
import { addDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const today = new Date();
today.setHours(0, 0, 0, 0);


const BLOOD_GROUPS = [
  { short: "O+", full: "O Positive" },
  { short: "O-", full: "O Negative" },
  { short: "A+", full: "A Positive" },
  { short: "A-", full: "A Negative" },
  { short: "B+", full: "B Positive" },
  { short: "B-", full: "B Negative" },
  { short: "AB+", full: "AB Positive" },
  { short: "AB-", full: "AB Negative" },
];

export default function BloodInventoryPage() {

  const [ptab, setpTab] = useState("regular");
  const [rtab, setrTab] = useState("regular-open");
  const [etab, seteTab] = useState("emergency-open");












  return (
    <ContentLayout title="Donor Management">

      <Tabs value={ptab} onValueChange={setpTab} className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger className="w-full" value="regular">Regular Patients</TabsTrigger>
          <TabsTrigger className="w-full" value="emergency">Emergency Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="regular">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">

            <div className="px-2">
              <h2 className="text-2xl font-semibold">Accepted Regular Patients</h2>
              <p className="text-foreground text-md mt-3">
                Here you can, view patient appointments, mark requests as closed, and manage everything easily.
              </p>
              <p className="text-foreground text-md mt-3">
                Accept patient reqeusts in{' '}
                <Link href="/app/h/blood-requests" className="text-accent underline hover:text-accent/80">
                  Blood Requests
                </Link>.
              </p>
            </div>

          </div>



          <Tabs value={rtab} onValueChange={setrTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="regular-open">Open Cases</TabsTrigger>
              <TabsTrigger value="regular-closed">Closed Cases</TabsTrigger>


            </TabsList>

            <TabsContent value="regular-open">
            <Card className="p-2">
              <p className="text-center text-gray-500">No current patients.</p>
              </Card>
              <div className="flex justify-center mt-6 space-x-2">
                <Button

                  disabled
                  className="bg-accent"
                >
                  Previous
                </Button>
                <span className="px-4 py-2">1 / 1</span>
                <Button

                  disabled
                  className="bg-accent"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="regular-closed">
            <Card className="p-2">
              <p className="text-center text-gray-500">No closed patients.</p></Card>
              <div className="flex justify-center mt-6 space-x-2">
                <Button

                  disabled
                  className="bg-accent"
                >
                  Previous
                </Button>
                <span className="px-4 py-2">1 / 1</span>
                <Button

                  disabled
                  className="bg-accent"
                >
                  Next
                </Button>
              </div>
            </TabsContent>
          </Tabs>

        </TabsContent>

        <TabsContent value="emergency">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">
            <div className="px-2 ">
              <h2 className="text-2xl font-semibold text-accent">🚨 Accepted Emergency Patients</h2>
              <p className="text-foreground text-md mt-3">
                Here you can, view patient appointments, mark requests as closed, and manage everything easily.
              </p>
              <p className="text-foreground text-md mt-3">
                Accept patient reqeusts in{' '}
                <Link href="/app/h/blood-requests" className="text-accent underline hover:text-accent/80">
                  Blood Requests
                </Link>.
              </p>
            </div>
          </div>

          <Tabs value={etab} onValueChange={seteTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="emergency-open">Open Cases</TabsTrigger>
              <TabsTrigger value="emergency-closed">Closed Cases</TabsTrigger>


            </TabsList>

            <TabsContent value="emergency-open">
              <Card className="p-2">
                <p className="text-center text-gray-500">No current emergency patients.</p>
              </Card>
              <div className="flex justify-center mt-6 space-x-2">
                <Button

                  disabled
                  className="bg-accent"
                >
                  Previous
                </Button>
                <span className="px-4 py-2">1 / 1</span>
                <Button

                  disabled
                  className="bg-accent"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="emergency-closed">
            <Card className="p-2">
              <p className="text-center text-gray-500">No closed emergency patients.</p> </Card>
              <div className="flex justify-center mt-6 space-x-2">
                <Button

                  disabled
                  className="bg-accent"
                >
                  Previous
                </Button>
                <span className="px-4 py-2">1 / 1</span>
                <Button

                  disabled
                  className="bg-accent"
                >
                  Next
                </Button>
              </div>
            </TabsContent>
          </Tabs>

        </TabsContent>
      </Tabs>


    </ContentLayout>
  );
}
