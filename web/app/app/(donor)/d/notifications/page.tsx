// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { getUserDataById } from "@/firebaseFunctions";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar, AlertCircle } from "lucide-react";

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

        // 1. Fetch Donor Profile to match city for emergency alerts
        const donorData = (await getUserDataById(userId, "donor")) as any;
        const city = donorData?.d_city || "";

        // 2. Fetch bookings/appointments
        const requestsRef = collection(db, "hospital-requests");
        const qSnap = await getDocs(requestsRef);
        
        qSnap.docs.forEach(docSnap => {
          const req = docSnap.data();
          const myBookings = (req.bookedDonors || []).filter(b => b.userId === userId);
          myBookings.forEach(booking => {
            list.push({
              id: `appt-${docSnap.id}-${booking.bookedAt}`,
              type: "appointment",
              title: "Donation Appointment Booked",
              message: `You have a scheduled donation at ${req.hospitalName || "Partner Hospital"} on ${booking.date} at ${booking.time}.`,
              timestamp: booking.bookedAt ? new Date(booking.bookedAt) : new Date(),
              icon: Calendar,
              iconColor: "text-blue-500",
              bgColor: "bg-blue-500/10 border-blue-500/20"
            });
          });
        });

        // 3. Fetch Emergency Alerts for Donor's City
        if (city) {
          const alertsRef = collection(db, "emergency-alerts");
          const qAlerts = query(alertsRef, where("hospitalCity", "==", city));
          const alertsSnap = await getDocs(qAlerts);
          
          alertsSnap.docs.forEach(docSnap => {
            const alert = docSnap.data();
            list.push({
              id: docSnap.id,
              type: "emergency",
              title: `🚨 Emergency Blood Alert in ${city}`,
              message: `${alert.hospitalName} is in critical need of ${alert.bloodGroupNeeded} blood: "${alert.message}". Callback: ${alert.phone}`,
              timestamp: alert.createdAt ? new Date(alert.createdAt.seconds * 1000) : new Date(),
              icon: AlertCircle,
              iconColor: "text-red-600",
              bgColor: "bg-red-500/10 border-red-500/20"
            });
          });
        }

        // Sort by timestamp descending (newest first)
        list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setNotifications(list);
      } catch (err) {
        console.error("Failed to load donor notifications:", err);
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
          Stay updated on your upcoming blood donation appointments and emergency requests nearby.
        </p>
      </div>

      <div className="space-y-4 px-2">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">All caught up! No new notifications.</p>
            <p className="text-gray-400 text-sm mt-1">We'll alert you when there is an emergency need or scheduled booking updates.</p>
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
