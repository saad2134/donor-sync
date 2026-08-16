// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar, ClipboardCheck, ClipboardX, Clock } from "lucide-react";

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

        // Fetch patient's blood requests
        const requestsRef = collection(db, "patient-requests");
        const q = query(requestsRef, where("patientId", "==", userId));
        const qSnap = await getDocs(q);
        
        qSnap.docs.forEach(docSnap => {
          const req = docSnap.data();
          
          if (req.status === "accepted") {
            list.push({
              id: `${docSnap.id}-accepted`,
              type: "accepted",
              title: "Transfusion Request Approved 🎉",
              message: `${req.targetHospitalName || "Partner Hospital"} has accepted your request for ${req.bloodGroupNeeded} blood (${req.bloodQtyNeeded} units). Appointment scheduled: ${req.appointmentDate || "Pending confirmation"}.`,
              timestamp: req.createdAt ? new Date(req.createdAt.seconds * 1000) : new Date(),
              icon: ClipboardCheck,
              iconColor: "text-green-500",
              bgColor: "bg-green-500/10 border-green-500/20"
            });
          } else if (req.status === "rejected") {
            list.push({
              id: `${docSnap.id}-rejected`,
              type: "rejected",
              title: "Transfusion Request Declined",
              message: `Your request for ${req.bloodGroupNeeded} blood at ${req.targetHospitalName || "Partner Hospital"} has been declined due to inventory levels.`,
              timestamp: req.createdAt ? new Date(req.createdAt.seconds * 1000) : new Date(),
              icon: ClipboardX,
              iconColor: "text-red-500",
              bgColor: "bg-red-500/10 border-red-500/20"
            });
          } else if (req.status === "open") {
            list.push({
              id: `${docSnap.id}-open`,
              type: "open",
              title: "Request Pending Review ⏳",
              message: `Your request for ${req.bloodGroupNeeded} blood has been submitted successfully to ${req.targetHospitalName}. We will notify you once they schedule a transfusion slot.`,
              timestamp: req.createdAt ? new Date(req.createdAt.seconds * 1000) : new Date(),
              icon: Clock,
              iconColor: "text-orange-500",
              bgColor: "bg-orange-500/10 border-orange-500/20"
            });
          }
        });

        // Sort by date descending
        list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setNotifications(list);
      } catch (err) {
        console.error("Failed to load patient notifications:", err);
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
          Monitor updates on your transfusion requests and appointment slot scheduling.
        </p>
      </div>

      <div className="space-y-4 px-2">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No notifications found.</p>
            <p className="text-gray-400 text-sm mt-1">Submit a blood request to view status alerts here.</p>
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
