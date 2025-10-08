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
  const { toast } = useToast()

  const { userId } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [ptab, setpTab] = useState("request");
  const [tab, setTab] = useState("open");

  const [calendarOpen, setCalendarOpen] = useState(false);

  const [isUrgent, setIsUrgent] = useState("no");
  const [bloodGroupNeeded, setBloodGroupNeeded] = useState("O+"); // fixed, non-editable
  const [bloodQtyNeeded, setBloodQtyNeeded] = useState(""); // number of units
  const [requestExpires, setRequestExpires] = useState(addDays(new Date(), 7)); // default 1 week ahead
  const [cause, setCause] = useState("");

  const [patientEmail, setPatientEmail] = useState("");
  const [patientName, setPatientName] = useState("");

  const [loading, setLoading] = useState(false);

  const maxExpiryDate = addDays(new Date(), 30); // 1 month ahead

  useEffect(() => {
    if (!userId) return;

    const fetchRequests = async () => {
      const requestsRef = collection(db, "hospital-requests");
      const q = query(
        requestsRef,
        where("hospitalId", "==", userId),
      );
      const querySnapshot = await getDocs(q);
      const fetchedRequests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort by parsed number from id
      const sortedRequests = fetchedRequests.sort((a, b) => {
        const getReqNo = (id: string) => {
          const parts = id.split("-");
          const lastPart = parts[parts.length - 1]; // "h3", "h4", etc
          return Number(lastPart.replace("h", ""));
        };

        return getReqNo(b.id) - getReqNo(a.id); // Descending order
      });

      setRequests(sortedRequests);
    };

    fetchRequests();
  }, [userId]);




  const handleCreateRequest = async () => {

    if (!bloodGroupNeeded || !bloodQtyNeeded || !requestExpires) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill all the fields marked with *",
        variant: "destructive",
      });
      return;
    }

    const hospitalRequestsRef = collection(db, "hospital-requests");
    const q = query(hospitalRequestsRef, where("hospitalId", "==", userId));
    const querySnapshot = await getDocs(q);
    const requestNo = querySnapshot.size + 1;
    const requestId = `${userId}-h${requestNo}`;

    const newRequest = {
      hospitalId: userId,
      isUrgent,
      bloodGroupNeeded,
      bloodQtyNeeded: Number(bloodQtyNeeded),
      requestExpires: requestExpires,
      cause: cause || null,
      patientEmail: patientEmail || null,
      patientName: patientName || null,
      status: "open",
      createdAt: new Date(),
    };

    await setDoc(doc(db, "hospital-requests", requestId), newRequest);
    setRequests((prev) => {
      const updated = [...prev, { id: requestId, ...newRequest }];
      return updated.sort((a, b) => {
        const getReqNo = (id: string) => {
          const parts = id.split("-");
          const lastPart = parts[parts.length - 1];
          return Number(lastPart.replace("h", ""));
        };
        return getReqNo(b.id) - getReqNo(a.id);
      });
    });
    setDialogOpen(false);

    // Reset fields
    setIsUrgent("no");
    setBloodGroupNeeded("O+");
    setBloodQtyNeeded("");
    setRequestExpires(addDays(new Date(), 7));
    setCause("");
    setPatientEmail("");
    setPatientName("");
  };

  const handleCloseRequest = async (reqId) => {
    try {
      setLoading(true);
      const requestRef = doc(db, "hospital-requests", reqId);
      await updateDoc(requestRef, { status: "closed" });
      setRequests(prev =>
        prev.map(r => (r.id === reqId ? { ...r, status: "closed" } : r))
      );
    } catch (error) {
      console.error("Failed to close request:", error);
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB", { timeZone: "Asia/Kolkata" });
  };

  const filteredRequests = requests.filter(r => r.status === (tab === "open" ? "open" : "closed"));

  return (
    <ContentLayout title="Donor Management">

      <Tabs value={ptab} onValueChange={setpTab} className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger className="w-full" value="request">Request for Blood</TabsTrigger>
          <TabsTrigger className="w-full" value="saved">Saved Donors</TabsTrigger>


        </TabsList>

        <TabsContent value="request">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">

            <div className="px-2">
              <h2 className="text-2xl font-semibold">❤️ Request for Blood from Donors</h2>
              <p className="text-foreground text-md mt-3">
                Here you can:
              </p>

              <ul className="list-disc list-inside text-foreground mt-2 space-y-2">
                <li>
                  Create requests for <span className="text-accent">blood from donors</span>.
                </li>
                <li>
                  Allow donors to book appointments under that request.
                </li>
                <li>
                  View appointments, mark requests as closed, and manage everything easily.
                </li>

              </ul>


              <p className="text-foreground text-md mt-3">
                See your current blood stock in{' '}
                <Link href="/app/h/blood-inventory" className="text-accent underline hover:text-accent/80">
                  Blood Inventory
                </Link>.
              </p>
            </div>
            <div className="flex justify-center w-full md:w-auto px-4 space-x-2">
              <Button className="bg-accent" onClick={() => setDialogOpen(true)}>Create Request</Button>
            </div>
          </div>



          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="open">Open Requests</TabsTrigger>
              <TabsTrigger value="closed">Closed Requests</TabsTrigger>


            </TabsList>



            <TabsContent value="open"> <Card className="p-2">
              {filteredRequests.length === 0 ? (
                <p className="text-center text-gray-500">No open requests.</p>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((req) => (
                    <Card key={req.id} className="relative">
                      <CardContent className="p-4 space-y-2">
                        {/* Request No */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <h4 className="font-bold text-lg">
                            Request #{req.id.split("-").pop()?.replace("h", "")}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`text-xs capitalize ${req.status === "open" ? "bg-green-500" : "bg-gray-500"}`}>
                              {req.status}
                            </Badge>

                            <Badge className="text-xs bg-blue-500">
                              {req.noOfAppointments || 0} Appointments
                            </Badge>

                            {req.isUrgent === "yes" && (
                              <Badge className="text-xs bg-red-500">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1 text-sm">
                          <p>
                            Blood Group Needed:{" "}
                            <span className="font-bold">{req.bloodGroupNeeded}</span>
                          </p>
                          <p>
                            Blood Quantity Needed:{" "}
                            <span className="font-bold">{req.bloodQtyNeeded} unit(s)</span>
                          </p>

                          {req.cause && (
                            <p>
                              Cause: <span className="font-bold text-accent">{req.cause}</span>
                            </p>
                          )}

                          {req.patientName && (
                            <p>
                              Patient Name: <span className="font-bold">{req.patientName}</span>
                            </p>
                          )}

                          {req.patientEmail && (
                            <p>
                              Patient Email:{" "}
                              <span className="font-bold">{req.patientEmail}</span>
                            </p>
                          )}



                          {req.createdAt && (
                            <p>
                              Created At:{" "}
                              <span className="font-semibold">{formatDate(req.createdAt)}</span>
                            </p>
                          )}

                          {req.requestExpires && (
                            <p>
                              Expires At:{" "}
                              <span className="font-semibold">{formatDate(req.requestExpires)}</span>
                            </p>
                          )}
                        </div>

                        {/* Close Button */}
                        {req.status === "open" && (
                          <div className="flex flex-col sm:flex-row sm:gap-4 mt-4 pt-2 gap-2 w-full">
                            <Button
                              onClick={() => handleCloseRequest(req.id)}
                              disabled={loading}
                              className="w-full  bg-accent"
                            >
                              {loading ? "Closing..." : "Close Request"}
                            </Button>
                            <Button
                              onClick={() => { }}
                              className="w-full  bg-blue-500 hover:bg-blue-600"
                            >
                              See Appointments
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )} </Card>
            </TabsContent>

            <TabsContent value="closed"> <Card className="p-2">
              {filteredRequests.length === 0 ? (
                <p className="text-center text-gray-500">No closed requests.</p>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((req) => (
                    <Card key={req.id} className="relative">
                      <CardContent className="p-4 space-y-2">
                        {/* Request No */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <h4 className="font-bold text-lg">
                            Request #{req.id.split("-").pop()?.replace("h", "")}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`text-xs capitalize ${req.status === "open" ? "bg-green-500" : "bg-gray-500"}`}>
                              {req.status}
                            </Badge>

                            <Badge className="text-xs bg-blue-500">
                              {req.noOfAppointments || 0} Appointments
                            </Badge>

                            {req.isUrgent === "yes" && (
                              <Badge className="text-xs bg-red-500">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>



                        {/* Details */}
                        <div className="space-y-1 text-sm">
                          <p>
                            Blood Group Needed:{" "}
                            <span className="font-bold">{req.bloodGroupNeeded}</span>
                          </p>
                          <p>
                            Blood Quantity Needed:{" "}
                            <span className="font-bold">{req.bloodQtyNeeded} unit(s)</span>
                          </p>

                          {req.cause && (
                            <p>
                              Cause: <span className="font-bold text-accent">{req.cause}</span>
                            </p>
                          )}

                          {req.patientName && (
                            <p>
                              Patient Name: <span className="font-bold">{req.patientName}</span>
                            </p>
                          )}

                          {req.patientEmail && (
                            <p>
                              Patient Email:{" "}
                              <span className="font-bold">{req.patientEmail}</span>
                            </p>
                          )}



                          {req.createdAt && (
                            <p>
                              Created At:{" "}
                              <span className="font-semibold">{formatDate(req.createdAt)}</span>
                            </p>
                          )}

                          {req.requestExpires && (
                            <p>
                              Expires At:{" "}
                              <span className="font-semibold">{formatDate(req.requestExpires)}</span>
                            </p>
                          )}

                          {/* Close Button */}
                          {req.status === "closed" && (
                            <div className="flex flex-col sm:flex-row sm:gap-4 mt-4 pt-2 gap-2 w-full">
                              <Button
                                onClick={() => { }}
                                className="w-full  bg-blue-500 hover:bg-blue-600"
                              >
                                See Appointments
                              </Button>
                            </div>
                          )}
                          </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
            </TabsContent>
          </Tabs>

        </TabsContent>

        <TabsContent value="saved">
          <div className="px-2">
            <h2 className="text-2xl font-semibold">💾 Saved Donors</h2>
            <p className="text-foreground text-md mt-3">
              Here you can see your saved donor details, to contact them later.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle>Create New Request</DialogTitle>
              <Button onClick={() => setDialogOpen(false)} variant="outline">
                Close
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Request Details Section */}
            <div>
              <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Request Details</h1>

              <div className="space-y-4 pt-4">

                <div className="flex items-center space-x-2 mt-4">
                  <Switch
                    checked={isUrgent === "yes"}
                    onCheckedChange={(checked) => setIsUrgent(checked ? "yes" : "no")}
                    id="urgent-donation"
                  />
                  <label htmlFor="urgent-donation" className="text-sm font-medium">
                    Is this an Urgent Donation Request?
                  </label>
                </div>

                <div>
                  <Label>Blood Group Needed *</Label>
                  <Select value={bloodGroupNeeded} onValueChange={setBloodGroupNeeded}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group.short} value={group.short}>
                          {group.full}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                <div>
                  <Label>Blood Quantity Needed (units) *</Label>
                  <Input
                    type="number"
                    value={bloodQtyNeeded}
                    onChange={(e) => setBloodQtyNeeded(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Request Expires *</Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {requestExpires ? format(requestExpires, "yyyy-MM-dd") : "Select"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={requestExpires}
                        onSelect={(date) => {
                          if (date) {
                            setRequestExpires(date);
                            setCalendarOpen(false); // 👈 closes after selection
                          }
                        }}
                        disabled={(date) => date < today || date > maxExpiryDate}
                        defaultMonth={requestExpires}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>



                <div>
                  <Label>Cause (Optional)</Label>
                  <Input
                    value={cause}
                    onChange={(e) => setCause(e.target.value)}
                    placeholder="Reason for blood request"
                  />
                </div>
              </div>
            </div>

            {/* Patient Details Section */}
            <div>
              <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">
                Patient Details (Optional)
                <div className="text-sm text-muted-foreground">
                  (Link this to a patient to make it easier to manage)
                </div>
              </h1>

              <div className="space-y-4 pt-4">
                <div>
                  <Label>Registered Patient Email</Label>
                  <Input
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <Label>Registered Patient Name</Label>
                  <Input
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Patient Name"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button onClick={handleCreateRequest}>Create Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </ContentLayout>
  );
}
