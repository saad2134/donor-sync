// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { getUserDataById } from "@/firebaseFunctions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SquareUserRound, CalendarDays, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function RequestBloodPage() {
  const { toast } = useToast();
  const { userId } = useUser();

  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bloodGroupNeeded, setBloodGroupNeeded] = useState("O+");
  const [bloodQtyNeeded, setBloodQtyNeeded] = useState("1");
  const [urgency, setUrgency] = useState("regular");
  const [cause, setCause] = useState("");
  const [targetHospitalId, setTargetHospitalId] = useState("");

  useEffect(() => {
    if (!userId || !db) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch patient profile
        const pData = (await getUserDataById(userId, "patient")) as any;
        setProfile(pData);
        if (pData?.p_bloodgroup) {
          setBloodGroupNeeded(pData.p_bloodgroup);
        }

        // Fetch existing requests
        const requestsRef = collection(db, "patient-requests");
        const q = query(requestsRef, where("patientId", "==", userId));
        const qSnapshot = await getDocs(q);
        const fetchedRequests = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort requests by date descending
        fetchedRequests.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
          return dateB - dateA;
        });
        setRequests(fetchedRequests);

        // Fetch hospitals
        const hospitalsRef = collection(db, "hospitals");
        const hSnapshot = await getDocs(hospitalsRef);
        const fetchedHospitals = hSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHospitals(fetchedHospitals);
      } catch (error) {
        console.error("Error loading request-blood data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCreateRequest = async () => {
    if (!db || !userId) return;

    if (!bloodGroupNeeded || !bloodQtyNeeded || !targetHospitalId) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const reqId = `${userId}-pr${requests.length + 1}`;
      const hospitalObj = hospitals.find(h => h.id === targetHospitalId);

      const newRequest = {
        patientId: userId,
        patientName: profile?.p_name || "Unknown Patient",
        patientPhone: profile?.phone || "",
        patientEmail: profile?.email || "",
        bloodGroupNeeded,
        bloodQtyNeeded: Number(bloodQtyNeeded),
        urgency,
        cause: cause || null,
        targetHospitalId,
        targetHospitalName: hospitalObj?.h_name || "Unknown Hospital",
        status: "open",
        createdAt: new Date(),
        appointmentDate: null,
      };

      await setDoc(doc(db, "patient-requests", reqId), newRequest);

      setRequests(prev => [
        { id: reqId, ...newRequest },
        ...prev
      ]);

      toast({
        title: "✅ Request Created",
        description: "Your blood request was submitted to the target hospital.",
      });

      setDialogOpen(false);
      // Reset form
      setUrgency("regular");
      setCause("");
      setTargetHospitalId("");
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "❌ Request Failed",
        description: "Failed to create request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <ContentLayout title="Request Blood">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <SquareUserRound className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-semibold">Request Blood</h2>
          </div>
          <p className="text-foreground text-md mt-2">
            Submit request for blood and track hospital responses and appointment details.
          </p>
        </div>
        <Button className="bg-accent text-white" onClick={() => setDialogOpen(true)}>
          Create New Request
        </Button>
      </div>

      <div className="space-y-4 px-2">
        {loading && requests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Loading your blood requests...</div>
        ) : requests.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No blood requests submitted yet.</p>
            <p className="text-gray-400 text-sm mt-1">Click "Create New Request" to request blood units.</p>
          </Card>
        ) : (
          requests.map((req) => (
            <Card key={req.id} className="relative overflow-hidden hover:shadow-md transition">
              {/* Left red strip for urgent/critical */}
              {req.urgency === "critical" && <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-red-600" />}
              {req.urgency === "urgent" && <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-orange-500" />}

              <CardContent className="p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-lg">Request #{req.id.split("-").pop()?.replace("pr", "")}</h3>
                    <Badge className={getUrgencyBadgeColor(req.urgency)}>{req.urgency}</Badge>
                    <Badge className={getStatusBadgeColor(req.status)}>{req.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-muted-foreground">
                    <p>🩸 Blood Group: <span className="font-bold text-foreground">{req.bloodGroupNeeded}</span></p>
                    <p>📦 Quantity: <span className="font-bold text-foreground">{req.bloodQtyNeeded} unit(s)</span></p>
                    <p>🏥 Target Hospital: <span className="font-semibold text-foreground">{req.targetHospitalName}</span></p>
                    <p>📅 Submitted: <span className="font-semibold text-foreground">{formatDate(req.createdAt)}</span></p>
                  </div>

                  {req.cause && <p className="text-sm italic">Reason: "{req.cause}"</p>}
                </div>

                {req.status === "accepted" && req.appointmentDate && (
                  <div className="bg-green-500/10 dark:bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 shrink-0">
                    <CalendarDays className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase">Transfusion Appointment</p>
                      <p className="text-sm font-bold text-green-700 dark:text-green-300">{req.appointmentDate}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle>Create Blood Request</DialogTitle>
              <Button onClick={() => setDialogOpen(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-left">
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
              <Label>Quantity Needed (units) *</Label>
              <Input
                type="number"
                min="1"
                value={bloodQtyNeeded}
                onChange={(e) => setBloodQtyNeeded(e.target.value)}
              />
            </div>

            <div>
              <Label>Urgency Level *</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Target Hospital *</Label>
              <Select value={targetHospitalId} onValueChange={setTargetHospitalId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Target Hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((h) => (
                    <SelectItem key={h.id} value={h.id}>{h.h_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Reason / Cause (Optional)</Label>
              <Input
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                placeholder="Medical reason for blood transfusion request"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button onClick={handleCreateRequest} disabled={loading} className="w-full bg-accent text-white">
              {loading ? "Submitting..." : "Submit Blood Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
