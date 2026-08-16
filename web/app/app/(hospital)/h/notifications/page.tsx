// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar, ClipboardList, Activity } from "lucide-react";

export default function NotificationsPage() {
  const { userId } = useUser();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !db) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const list = [];

        // 1. Fetch patient requests for this hospital
        const patientReqRef = collection(db, "patient-requests");
        const qPatient = query(patientReqRef, where("targetHospitalId", "==", userId), where("status", "==", "open"));
        const patientSnap = await getDocs(qPatient);
        
        patientSnap.docs.forEach(docSnap => {
          const req = docSnap.data();
          list.push({
            id: `patReq-${docSnap.id}`,
            type: "patient-request",
            title: "New Transfusion Request 🩸",
            message: `Patient ${req.patientName || "Anonymous"} has requested ${req.bloodQtyNeeded || 1} units of ${req.bloodGroupNeeded} blood. Urgency: ${req.urgency || "standard"}.`,
            timestamp: req.createdAt ? new Date(req.createdAt.seconds * 1000) : new Date(),
            icon: ClipboardList,
            iconColor: "text-red-500",
            bgColor: "bg-red-500/10 border-red-500/20"
          });
        });

        // 2. Fetch donor booking slots at this hospital
        const hospitalReqRef = collection(db, "hospital-requests");
        const qHosp = query(hospitalReqRef, where("hospitalId", "==", userId));
        const hospSnap = await getDocs(qHosp);

        hospSnap.docs.forEach(docSnap => {
          const req = docSnap.data();
          const bookings = req.bookedDonors || [];
          bookings.forEach(booking => {
            list.push({
              id: `booking-${docSnap.id}-${booking.bookedAt}`,
              type: "donor-booking",
              title: "Donor Appointment Booked",
              message: `Donor booked a blood donation appointment for ${req.bloodGroupNeeded} blood on ${booking.date} at ${booking.time}.`,
              timestamp: booking.bookedAt ? new Date(booking.bookedAt) : new Date(),
              icon: Calendar,
              iconColor: "text-blue-500",
              bgColor: "bg-blue-500/10 border-blue-500/20"
            });
          });
        });

        // Sort descending
        list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setNotifications(list);
      } catch (err) {
        console.error("Failed to load hospital notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <ContentLayout title="Notifications">
      <div className="flex flex-col gap-2 mb-6 px-2">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-semibold">My Notifications</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Stay updated on incoming patient requests and donor appointments.
        </p>
      </div>

      <div className="space-y-4 px-2">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No notifications right now.</p>
            <p className="text-gray-400 text-sm mt-1">We will alert you when patients submit requests or donors book slots.</p>
          </Card>
        ) : (
          notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <Card key={notif.id} className={`relative overflow-hidden hover:shadow-sm border ${notif.bgColor} rounded-2xl`}>
                <CardContent className="p-5 flex items-start gap-4">
                  <Icon className={`h-6 w-6 shrink-0 mt-0.5 ${notif.iconColor}`} />
                  <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-sm text-foreground">{notif.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground/80 font-medium pt-1">
                      {notif.timestamp.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </ContentLayout>
  );
}
