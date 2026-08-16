// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Phone, Mail, FileText, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function HospitalBloodRequestsPage() {
  const { toast } = useToast();
  const { userId } = useUser();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("urgent");

  // Dialog State for accepting request
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!userId || !db) return;

    const fetchPatientRequests = async () => {
      setLoading(true);
      try {
        const requestsRef = collection(db, "patient-requests");
        const q = query(requestsRef, where("targetHospitalId", "==", userId));
        const qSnapshot = await getDocs(q);
        const fetched = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort descending by date
        fetched.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
          return dateB - dateA;
        });

        setRequests(fetched);
      } catch (err) {
        console.error("Error loading patient-requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientRequests();
  }, [userId]);

  const handleAcceptRequest = async () => {
    if (!db || !selectedRequest || !appointmentDate) return;

    try {
      setLoading(true);
      const reqRef = doc(db, "patient-requests", selectedRequest.id);
      const formattedDate = format(appointmentDate, "PPP");

      await updateDoc(reqRef, {
        status: "accepted",
        appointmentDate: formattedDate,
      });

      setRequests(prev =>
        prev.map(r => (r.id === selectedRequest.id ? { ...r, status: "accepted", appointmentDate: formattedDate } : r))
      );

      toast({
        title: "✅ Request Accepted",
        description: `Transfusion appointment scheduled for ${formattedDate}.`,
      });

      setAcceptDialogOpen(false);
      setAppointmentDate(undefined);
    } catch (err) {
      console.error("Failed to accept request:", err);
      toast({
        title: "❌ Update Failed",
        description: "Failed to accept blood request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (reqId: string) => {
    if (!db) return;

    if (!confirm("Are you sure you want to reject this request?")) return;

    try {
      setLoading(true);
      const reqRef = doc(db, "patient-requests", reqId);

      await updateDoc(reqRef, {
        status: "rejected",
      });

      setRequests(prev =>
        prev.map(r => (r.id === reqId ? { ...r, status: "rejected" } : r))
      );

      toast({
        title: "🚫 Request Rejected",
        description: "The patient request was marked as rejected.",
      });
    } catch (err) {
      console.error("Failed to reject request:", err);
      toast({
        title: "❌ Update Failed",
        description: "Failed to update request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const urgentRequests = requests.filter(r => r.urgency === "urgent" || r.urgency === "critical");
  const regularRequests = requests.filter(r => r.urgency === "regular");

  const getStatusBadgeColor = (stat: string) => {
    switch (stat) {
      case "accepted": return "bg-green-500 hover:bg-green-600";
      case "rejected": return "bg-stone-500 hover:bg-stone-600";
      default: return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  const getUrgencyBadgeColor = (urg: string) => {
    switch (urg) {
      case "critical": return "bg-red-600 hover:bg-red-700";
      case "urgent": return "bg-orange-500 hover:bg-orange-600";
      default: return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const renderRequestList = (reqList: any[]) => {
    if (loading && reqList.length === 0) {
      return <div className="text-center py-12 text-muted-foreground">Loading requests...</div>;
    }

    if (reqList.length === 0) {
      return (
        <Card className="p-8 text-center border-2 border-dashed mt-4">
          <p className="text-gray-500 text-lg">No blood requests matching this urgency category.</p>
        </Card>
      );
    }

    return (
      <div className="space-y-4 mt-4">
        {reqList.map((req) => (
          <Card key={req.id} className="relative overflow-hidden hover:shadow-md transition">
            {req.urgency === "critical" && <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-red-600" />}
            {req.urgency === "urgent" && <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-orange-500" />}

            <CardContent className="p-5 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-lg">{req.patientName}</h3>
                  <Badge className={getUrgencyBadgeColor(req.urgency)}>{req.urgency}</Badge>
                  <Badge className={getStatusBadgeColor(req.status)}>{req.status}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm text-muted-foreground">
                  <p>🩸 Blood Group Needed: <span className="font-bold text-foreground">{req.bloodGroupNeeded}</span></p>
                  <p>📦 Quantity: <span className="font-bold text-foreground">{req.bloodQtyNeeded} unit(s)</span></p>
                  <p className="flex items-center gap-1">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a href={`tel:${req.patientPhone}`} className="hover:underline text-foreground">{req.patientPhone}</a>
                  </p>
                  <p className="flex items-center gap-1">
                    <Mail className="h-4 w-4 shrink-0" />
                    <a href={`mailto:${req.patientEmail}`} className="hover:underline text-foreground">{req.patientEmail}</a>
                  </p>
                  <p>📅 Submitted: <span className="font-semibold text-foreground">{formatDate(req.createdAt)}</span></p>
                </div>

                {req.cause && (
                  <p className="text-sm bg-muted/50 p-2.5 rounded-lg border border-border/40 text-muted-foreground flex items-start gap-1.5">
                    <FileText className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                    <span>Reason: "{req.cause}"</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                {req.status === "open" ? (
                  <>
                    <Button
                      onClick={() => {
                        setSelectedRequest(req);
                        setAcceptDialogOpen(true);
                      }}
                      className="w-full md:w-36 bg-green-600 hover:bg-green-700 text-white gap-1.5"
                    >
                      <CheckCircle className="h-4 w-4" /> Accept Request
                    </Button>
                    <Button
                      onClick={() => handleRejectRequest(req.id)}
                      variant="outline"
                      className="w-full md:w-36 text-red-600 border-red-600 hover:bg-red-500/10 gap-1.5"
                    >
                      <XCircle className="h-4 w-4" /> Reject Request
                    </Button>
                  </>
                ) : req.status === "accepted" && req.appointmentDate ? (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Transfusion Scheduled</p>
                    <p className="text-sm font-semibold text-green-600">{req.appointmentDate}</p>
                  </div>
                ) : (
                  <p className="text-sm text-stone-500 font-semibold italic capitalize">{req.status}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <ContentLayout title="Blood Requests">
      <div className="px-2 pb-4">
        <h2 className="text-2xl font-semibold">Blood Requests from Patients</h2>
        <p className="text-foreground text-md mt-2">
          Evaluate and respond to transfusion requests submitted directly to your hospital.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-2">
        <TabsList className="mb-4 w-full">
          <TabsTrigger className="w-full" value="urgent">
            🚨 Urgent/Critical ({urgentRequests.length})
          </TabsTrigger>
          <TabsTrigger className="w-full" value="regular">
            Regular ({regularRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="urgent">
          {renderRequestList(urgentRequests)}
        </TabsContent>

        <TabsContent value="regular">
          {renderRequestList(regularRequests)}
        </TabsContent>
      </Tabs>

      {/* Accept Appointment Dialog */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle>Schedule Transfusion Appointment</DialogTitle>
              <Button onClick={() => setAcceptDialogOpen(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 text-left">
            <p className="text-sm text-muted-foreground">
              Select an appointment date for the patient, <strong>{selectedRequest?.patientName}</strong>, to receive transfusion units.
            </p>

            <div className="space-y-2 flex flex-col">
              <Label>Select Appointment Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {appointmentDate ? format(appointmentDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={setAppointmentDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleAcceptRequest}
              disabled={!appointmentDate || loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Scheduling..." : "Confirm & Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
