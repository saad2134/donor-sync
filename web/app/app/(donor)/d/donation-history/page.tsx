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
import { History, Hospital, CheckCircle2, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function DonationHistoryPage() {
  const { userId } = useUser();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!userId || !db) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const requestsRef = collection(db, "hospital-requests");
        const qSnapshot = await getDocs(requestsRef);
        
        const userBookings = [];
        const todayStr = format(new Date(), "yyyy-MM-dd");

        qSnapshot.docs.forEach(docSnap => {
          const req = docSnap.data();
          const reqId = docSnap.id;
          // Filter bookings that happened in the past
          const myBookings = (req.bookedDonors || []).filter(b => b.userId === userId && b.date < todayStr);

          myBookings.forEach(booking => {
            userBookings.push({
              requestId: reqId,
              hospitalId: req.hospitalId,
              hospitalName: req.hospitalName || "Partner Hospital",
              hospitalCity: req.hospitalCity || "",
              bloodGroup: req.bloodGroupNeeded,
              ...booking
            });
          });
        });

        // Sort history by date descending (most recent first)
        userBookings.sort((a: any, b: any) => b.date.localeCompare(a.date));

        setDonations(userBookings);
      } catch (error) {
        console.error("Error loading donor donation history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(donations.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonations = donations.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <ContentLayout title="Donation History">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-semibold">My Donation History</h2>
          </div>
          <p className="text-foreground text-md mt-2">
            Below is the list of your past completed blood donations. Thank you for being a hero!
          </p>
        </div>
      </div>

      <div className="space-y-4 px-2">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading history...</div>
        ) : donations.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No past donation records found.</p>
            <p className="text-gray-400 text-sm mt-1">Your past appointments and donation records will appear here.</p>
          </Card>
        ) : (
          <>
            {currentDonations.map((item, i) => (
              <Card key={i} className="relative overflow-hidden hover:shadow-md transition rounded-2xl">
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-green-500" />

                <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">Request #{item.requestId.split("-").pop()?.replace("h", "")}</h3>
                      <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1.5 text-foreground font-semibold">
                        <Hospital className="h-4 w-4 text-red-500 shrink-0" />
                        <span>{item.hospitalName}</span>
                      </p>
                      {item.hospitalCity && (
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{item.hospitalCity}</span>
                        </p>
                      )}
                      <p>🩸 Donated Type: <span className="font-bold text-red-500">{item.bloodGroup}</span></p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto flex items-center gap-2.5 p-3.5 rounded-xl bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 className="h-8 w-8 text-green-500 shrink-0" />
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Donated Date</p>
                      <p className="text-sm font-extrabold text-foreground">{item.date}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5" /> Slot: {item.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination Controls */}
            {donations.length > itemsPerPage && (
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
