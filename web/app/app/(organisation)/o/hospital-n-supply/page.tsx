// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";
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
import { useToast } from "@/hooks/use-toast";
import { Truck, Building, FileText, CheckCircle2, ShieldAlert } from "lucide-react";

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const PARTNERS = ["MedExpress Logistics", "LifeLine Transport", "CriticalCare Couriers"];

export default function HospitalSupplyManagement() {
  const { toast } = useToast();
  const { userId } = useUser();

  const [profile, setProfile] = useState<any>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Delivery Form State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetHospitalId, setTargetHospitalId] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O-");
  const [quantity, setQuantity] = useState("5");
  const [partnerName, setPartnerName] = useState(PARTNERS[0]);
  const [priority, setPriority] = useState("standard");

  useEffect(() => {
    if (!userId || !db) return;

    const fetchSupplyData = async () => {
      setLoading(true);
      try {
        // Fetch NGO Profile
        const pData = await getUserDataById(userId, "organisation");
        setProfile(pData);

        // Fetch Hospitals list
        const hospRef = collection(db, "hospitals");
        const hospSnap = await getDocs(hospRef);
        const hospList = hospSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHospitals(hospList);

        // Fetch Deliveries
        const deliveriesRef = collection(db, "blood-deliveries");
        const q = query(deliveriesRef, where("ngoId", "==", userId));
        const qSnap = await getDocs(q);
        const fetchedDeliveries = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort descending
        fetchedDeliveries.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
          return dateB - dateA;
        });

        setDeliveries(fetchedDeliveries);
      } catch (err) {
        console.error("Failed to load supply records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplyData();
  }, [userId]);

  const handleScheduleDelivery = async () => {
    if (!db || !userId) return;

    if (!targetHospitalId || !bloodGroup || !quantity || !partnerName) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill out all fields to dispatch delivery.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const deliveryId = `dlv-${Date.now()}`;
      const selectedHosp = hospitals.find(h => h.id === targetHospitalId);

      const newDelivery = {
        ngoId: userId,
        ngoName: profile?.o_name || "NGO Partner",
        hospitalId: targetHospitalId,
        hospitalName: selectedHosp?.h_name || "Partner Hospital",
        hospitalCity: selectedHosp?.h_city || "",
        bloodGroup,
        quantity: Number(quantity),
        partner: partnerName,
        priority,
        status: "in-transit",
        createdAt: new Date(),
      };

      await setDoc(doc(db, "blood-deliveries", deliveryId), newDelivery);

      setDeliveries(prev => [
        { id: deliveryId, ...newDelivery },
        ...prev
      ]);

      toast({
        title: "🚚 Delivery Dispatched",
        description: `Dispatched ${quantity} units of ${bloodGroup} to ${selectedHosp?.h_name}.`,
      });

      setDialogOpen(false);
      setQuantity("5");
      setTargetHospitalId("");
    } catch (err) {
      console.error("Failed to schedule delivery:", err);
      toast({
        title: "❌ Dispatch Failed",
        description: "Failed to dispatch delivery. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (deliveryId: string) => {
    if (!db) return;

    try {
      setLoading(true);
      const dRef = doc(db, "blood-deliveries", deliveryId);
      await updateDoc(dRef, { status: "delivered" });

      setDeliveries(prev =>
        prev.map(d => (d.id === deliveryId ? { ...d, status: "delivered" } : d))
      );

      toast({
        title: "✅ Mark Delivered",
        description: "Delivery status successfully updated to Delivered.",
      });
    } catch (err) {
      console.error("Failed to update delivery status:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeColor = (prio: string) => {
    return prio === "emergency" ? "bg-red-600 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600";
  };

  const getStatusBadgeColor = (stat: string) => {
    return stat === "delivered" ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600 animate-pulse";
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ContentLayout title="Hospital &amp; Supply Management">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-red-500 shrink-0" />
            <h2 className="text-2xl font-semibold">Hospital Supply &amp; Logistics</h2>
          </div>
          <p className="text-foreground text-md mt-2">
            Dispatch and track blood bag deliveries and supply levels to partner hospitals.
          </p>
        </div>
        <Button className="bg-accent text-white gap-2 shrink-0" onClick={() => setDialogOpen(true)}>
          <Truck className="h-4 w-4" /> Schedule New Delivery
        </Button>
      </div>

      <div className="space-y-4 px-2">
        <h3 className="font-bold text-lg border-b border-border/40 pb-2 flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" /> Logistics Logs ({deliveries.length})
        </h3>

        {loading && deliveries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Loading supply logs...</div>
        ) : deliveries.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No blood deliveries logged yet.</p>
            <p className="text-gray-400 text-sm mt-1">Plan a blood delivery run using the "Schedule New Delivery" tool.</p>
          </Card>
        ) : (
          deliveries.map((dlv) => (
            <Card key={dlv.id} className="relative overflow-hidden hover:shadow-md transition rounded-2xl">
              <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${dlv.status === "delivered" ? "bg-green-500" : "bg-orange-500 animate-pulse"}`} />

              <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-lg">Delivery #{dlv.id.split("-").pop()}</h3>
                    <Badge className={getPriorityBadgeColor(dlv.priority)}>{dlv.priority}</Badge>
                    <Badge className={getStatusBadgeColor(dlv.status)}>{dlv.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-1.5 text-foreground font-semibold">
                      <Building className="h-4 w-4 text-red-500" />
                      <span>{dlv.hospitalName} ({dlv.hospitalCity})</span>
                    </p>
                    <p>🩸 Blood Group: <strong className="text-foreground">{dlv.bloodGroup}</strong></p>
                    <p>📦 Quantity: <strong className="text-foreground">{dlv.quantity} units</strong></p>
                    <p>🚚 Courier: <strong className="text-foreground">{dlv.partner}</strong></p>
                    <p className="col-span-2">📅 Dispatched: <strong className="text-foreground">{formatDate(dlv.createdAt)}</strong></p>
                  </div>
                </div>

                {dlv.status === "in-transit" ? (
                  <Button
                    onClick={() => handleMarkDelivered(dlv.id)}
                    className="bg-green-600 hover:bg-green-700 text-white gap-1.5 w-full sm:w-auto shrink-0"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark Delivered
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 text-green-500 font-semibold text-sm bg-green-500/10 p-2.5 rounded-xl border border-green-500/20 shrink-0">
                    <CheckCircle2 className="h-4 w-4" /> Delivered successfully
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Schedule Delivery Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle>Schedule Blood Supply Delivery</DialogTitle>
              <Button onClick={() => setDialogOpen(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
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
              <Label>Blood Group *</Label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
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
              <Label>Quantity (units) *</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <Label>Logistics Delivery Partner *</Label>
              <Select value={partnerName} onValueChange={setPartnerName}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Delivery Partner" />
                </SelectTrigger>
                <SelectContent>
                  {PARTNERS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority Level *</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="emergency">Emergency (Rush Dispatch)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleScheduleDelivery} disabled={loading} className="w-full bg-accent text-white font-bold gap-2">
              <Truck className="h-4 w-4 shrink-0 animate-bounce" /> Dispatch Supply Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}