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
import { History, Hospital, FileText, CheckCircle2, XCircle } from "lucide-react";

export default function HistoryPage() {
  const { userId } = useUser();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!userId || !db) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const requestsRef = collection(db, "patient-requests");
        const q = query(
          requestsRef,
          where("patientId", "==", userId)
        );
        const qSnapshot = await getDocs(q);
        // Filter out open requests, we only want resolved history (accepted / rejected / closed)
        const fetched = qSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((req: any) => req.status !== "open");

        // Sort descending by date
        fetched.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
          return dateB - dateA;
        });

        setHistory(fetched);
      } catch (error) {
        console.error("Error loading patient history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(history.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistory = history.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const getStatusBadgeColor = (stat: string) => {
    switch (stat) {
      case "accepted": return "bg-green-500 hover:bg-green-600";
      case "rejected": return "bg-stone-500 hover:bg-stone-600";
      default: return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <ContentLayout title="Appointment History">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-semibold">My Transfusion History</h2>
          </div>
          <p className="text-foreground text-md mt-2">
            Review past blood transfusion requests, approval statuses, and schedule records.
          </p>
        </div>
      </div>

      <div className="space-y-4 px-2">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading history...</div>
        ) : history.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed">
            <p className="text-gray-500 text-lg">No transfusion history found.</p>
            <p className="text-gray-400 text-sm mt-1">Your closed and processed blood requests will appear here.</p>
          </Card>
        ) : (
          <>
            {currentHistory.map((item) => (
              <Card key={item.id} className="relative overflow-hidden hover:shadow-md transition rounded-2xl">
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${item.status === "accepted" ? "bg-green-500" : "bg-stone-500"}`} />

                <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-lg">Request #{item.id.split("-").pop()?.replace("pr", "")}</h3>
                      <Badge className={getStatusBadgeColor(item.status)}>{item.status}</Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1.5 text-foreground font-semibold">
                        <Hospital className="h-4 w-4 text-red-500 shrink-0" />
                        <span>{item.targetHospitalName}</span>
                      </p>
                      <p>🩸 Transfusion Group: <span className="font-bold text-foreground">{item.bloodGroupNeeded}</span></p>
                      <p>📦 Quantity: <span className="font-bold text-foreground">{item.bloodQtyNeeded} unit(s)</span></p>
                      <p>📅 Submitted Date: <span className="font-semibold text-foreground">{formatDate(item.createdAt)}</span></p>
                    </div>

                    {item.cause && (
                      <p className="text-xs italic text-muted-foreground">Reason: "{item.cause}"</p>
                    )}
                  </div>

                  <div className="shrink-0 w-full sm:w-auto flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/40">
                    {item.status === "accepted" ? (
                      <>
                        <CheckCircle2 className="h-7 w-7 text-green-500" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold">Transfused / Scheduled</p>
                          <p className="text-sm font-bold text-foreground">{item.appointmentDate}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-7 w-7 text-stone-500" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold">Request Rejected</p>
                          <p className="text-sm font-bold text-foreground">Processed</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination Controls */}
            {history.length > itemsPerPage && (
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
