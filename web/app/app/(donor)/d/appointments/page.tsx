// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CalendarDays, Hospital, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function AppointmentsPage() {
  const { userId } = useUser();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!userId || !db) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const requestsRef = collection(db, "hospital-requests");
        const qSnapshot = await getDocs(requestsRef);
        
        const userBookings = [];
        const todayStr = format(new Date(), "yyyy-MM-dd");

        qSnapshot.docs.forEach(docSnap => {
          const req = docSnap.data();
          const reqId = docSnap.id;
          const myBookings = (req.bookedDonors || []).filter(b => b.userId === userId && b.date >= todayStr);

          myBookings.forEach(booking => {
            userBookings.push({
              requestId: reqId,
              hospitalId: req.hospitalId,
              hospitalName: req.hospitalName || "Partner Hospital",
              hospitalCity: req.hospitalCity || "",
              bloodGroup: req.bloodGroupNeeded,
              isUrgent: req.isUrgent,
              ...booking
            });
          });
        });

        // Sort appointments by date ascending (soonest first)
        userBookings.sort((a: any, b: any) => a.date.localeCompare(b.date));

        setAppointments(userBookings);
      } catch (error) {
        console.error("Error loading donor appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(appointments.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <ContentLayout title="Donation Appointments">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-semibold">Upcoming Donations</h2>
          </div>
          <p className="text-foreground text-md mt-2">
            Below is the list of your scheduled blood donation appointments at hospitals.
          </p>
        </div>
      </div>

      <div className="space-y-4 px-2">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No upcoming blood donation appointments scheduled.</p>
            <p className="text-gray-400 text-sm mt-1">Book an appointment under "Urgent Donations" or "Nearby Donations" to help save lives.</p>
          </Card>
        ) : (
          <>
            {currentAppointments.map((appt, i) => (
              <Card key={i} className="relative overflow-hidden hover:shadow-md transition rounded-2xl">
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-red-500" />

                <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">Appointment #{appt.requestId.split("-").pop()?.replace("h", "")}</h3>
                      {appt.isUrgent === "yes" && <Badge className="bg-red-500 text-white text-[10px]">Urgent</Badge>}
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1.5 text-foreground font-semibold">
                        <Hospital className="h-4 w-4 text-red-500 shrink-0" />
                        <span>{appt.hospitalName}</span>
                      </p>
                      {appt.hospitalCity && (
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{appt.hospitalCity}</span>
                        </p>
                      )}
                      <p>🩸 Donation Group: <span className="font-bold text-red-500">{appt.bloodGroup}</span></p>
                    </div>
                  </div>

                  <div className="bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 shrink-0 w-full sm:w-auto">
                    <CalendarDays className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase">Date &amp; Slot</p>
                      <p className="text-sm font-extrabold text-foreground">{appt.date}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5" /> {appt.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination Controls */}
            {appointments.length > itemsPerPage && (
              <div className="flex justify-center mt-6 space-x-2">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="bg-accent"
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm font-semibold">{currentPage} / {totalPages}</span>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="bg-accent"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </ContentLayout>
  );
}
