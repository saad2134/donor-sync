// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CalendarDays, Hospital, Clock, MessageSquareHeart } from "lucide-react";

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
        const requestsRef = collection(db, "patient-requests");
        const q = query(
          requestsRef,
          where("patientId", "==", userId),
          where("status", "==", "accepted")
        );
        const qSnapshot = await getDocs(q);
        const fetched = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort appointments by createdAt descending
        fetched.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
          return dateB - dateA;
        });

        setAppointments(fetched);
      } catch (error) {
        console.error("Error loading patient appointments:", error);
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
    <ContentLayout title="Transfusion Appointments">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-semibold">Upcoming Transfusions</h2>
          </div>
          <p className="text-foreground text-md mt-2">
            Below is the list of your scheduled blood transfusion appointments at hospitals.
          </p>
        </div>
      </div>

      <div className="space-y-4 px-2">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading your appointments...</div>
        ) : appointments.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No upcoming transfusion appointments scheduled.</p>
            <p className="text-gray-400 text-sm mt-1">Submit a request under "Request Blood" to schedule a transfusion.</p>
          </Card>
        ) : (
          <>
            {currentAppointments.map((appt) => (
              <Card key={appt.id} className="relative overflow-hidden hover:shadow-md transition rounded-2xl">
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-green-500" />

                <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">Appointment #{appt.id.split("-").pop()?.replace("pr", "")}</h3>
                      <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1.5 text-foreground font-semibold">
                        <Hospital className="h-4 w-4 text-red-500 shrink-0" />
                        <span>{appt.targetHospitalName}</span>
                      </p>
                      <p>🩸 Transfusion Group: <span className="font-bold text-foreground">{appt.bloodGroupNeeded}</span></p>
                      <p>📦 Quantity: <span className="font-bold text-foreground">{appt.bloodQtyNeeded} unit(s)</span></p>
                    </div>
                  </div>

                  <div className="bg-green-500/10 dark:bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 shrink-0 w-full sm:w-auto">
                    <CalendarDays className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Scheduled Date</p>
                      <p className="text-sm font-extrabold text-green-700 dark:text-green-300">{appt.appointmentDate}</p>
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
