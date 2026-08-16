// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Truck, Award, Calendar } from "lucide-react";

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

        // 1. Fetch blood deliveries
        const deliveriesRef = collection(db, "blood-deliveries");
        const qDlv = query(deliveriesRef, where("ngoId", "==", userId));
        const dlvSnap = await getDocs(qDlv);

        dlvSnap.docs.forEach(docSnap => {
          const dlv = docSnap.data();
          if (dlv.status === "delivered") {
            list.push({
              id: `${docSnap.id}-delivered`,
              type: "delivered",
              title: "Delivery Completed successfully ✅",
              message: `Your shipment of ${dlv.quantity} units of ${dlv.bloodGroup} has been delivered to ${dlv.hospitalName}. Sponsoring Courier: ${dlv.partner}.`,
              timestamp: dlv.createdAt ? new Date(dlv.createdAt.seconds * 1000) : new Date(),
              icon: Truck,
              iconColor: "text-green-500",
              bgColor: "bg-green-500/10 border-green-500/20"
            });
          } else if (dlv.status === "in-transit") {
            list.push({
              id: `${docSnap.id}-transit`,
              type: "transit",
              title: "Blood Cargo In Transit 🚚",
              message: `Shipment of ${dlv.quantity} units of ${dlv.bloodGroup} to ${dlv.hospitalName} is in transit via ${dlv.partner}.`,
              timestamp: dlv.createdAt ? new Date(dlv.createdAt.seconds * 1000) : new Date(),
              icon: Truck,
              iconColor: "text-orange-500",
              bgColor: "bg-orange-500/10 border-orange-500/20"
            });
          }
        });

        // 2. Fetch scheduled camps
        const campsRef = collection(db, "donation-camps");
        const qCamps = query(campsRef, where("organiserId", "==", userId));
        const campsSnap = await getDocs(qCamps);

        campsSnap.docs.forEach(docSnap => {
          const camp = docSnap.data();
          list.push({
            id: docSnap.id,
            type: "camp",
            title: "Donation Camp Active",
            message: `"${camp.campName}" is scheduled at ${camp.venue} on ${camp.date} (${camp.time}). Target goal: ${camp.targetGoal} units.`,
            timestamp: camp.createdAt ? new Date(camp.createdAt.seconds * 1000) : new Date(),
            icon: Calendar,
            iconColor: "text-blue-500",
            bgColor: "bg-blue-500/10 border-blue-500/20"
          });
        });

        // Sort descending
        list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setNotifications(list);
      } catch (err) {
        console.error("Failed to load NGO notifications:", err);
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
          Stay updated on shipment statuses, camp coordinates, and volunteer team alerts.
        </p>
      </div>

      <div className="space-y-4 px-2">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No notifications yet.</p>
            <p className="text-gray-400 text-sm mt-1">Schedule a drive or blood shipment to view logistics updates here.</p>
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
