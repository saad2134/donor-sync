//@ts-nocheck
"use client"

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Droplets,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ContentLayout } from "@/components/admin-panel/content-layout"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  Timestamp,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

import { useUser } from "@/context/UserContext";
import { getUserDataById } from "@/firebaseFunctions";

import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type HospitalRequest = {
  id: string,
  hospitalId: string,
  createdAt: Timestamp | null,
  isUrgent: string,
  status: string,
  cause: string | null,
  bloodQtyNeeded: number,
  // Hospital data (to be populated)
  h_name?: string,
  h_logo_url?: string,
  email?: string,
  h_phone?: string,
  h_lat?: number,
  h_lon?: number,
  distance?: number,
}

function getInitials(name: string): string {
  if (!name) return ""
  const words = name.trim().split(" ").filter(Boolean)
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

function formatTimeAgo(timestamp: Timestamp | null) {
  if (!timestamp || !timestamp.toDate) {
    return "Unknown time";
  }

  try {
    const date = timestamp.toDate();
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return "unknown time ago";
  }
}

export default function NearbyDonationsPage() {
  // User data
  const { userId, role } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [hospitalRequests, setHospitalRequests] = useState<HospitalRequest[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [open, setOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<HospitalRequest | null>(null);

  // Appointment booking
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Time slots
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  // Get user location
  const getUserLocation = async () => {
    const geoOptions = { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location", error);
        },
        geoOptions
      );
    } else {
      console.error("Geolocation not supported");
    }
  };

  // Calculate distance between coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Book appointment
  const bookAppointment = async () => {
    if (!selectedHospital || !date || !selectedTime || !userId) {
      alert("Please select a date and time for your appointment");
      return;
    }

    setIsBooking(true);
    try {
      // Format appointment date and time for storage
      const formattedDate = format(date, "yyyy-MM-dd");

      // Update the hospital request document
      const requestRef = doc(db, "hospital-requests", selectedHospital.id);
      await updateDoc(requestRef, {
        bookedDonors: arrayUnion({
          userId: userId,
          date: formattedDate,
          time: selectedTime,
          bookedAt: Timestamp.now()
        })
      });

      alert("Appointment booked successfully!");
      setOpen(false);
      // Reset appointment values
      setDate(undefined);
      setSelectedTime("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  // Fetch user profile
  useEffect(() => {
    if (userId && role === "donor") {
      async function fetchDonorData() {
        try {
          const data = await getUserDataById(userId, "donor");
          setProfile(data);
        } catch (error) {
          console.error("Error fetching donor data:", error);
        }
      }
      fetchDonorData();
    }
  }, [userId, role]);

  // Get user location and fetch hospital requests
  useEffect(() => {
    getUserLocation();
    fetchHospitalRequests();
  }, []);

  // Process hospital requests when user location changes
  useEffect(() => {
    if (userLocation && hospitalRequests.length > 0) {
      const requestsWithDistance = hospitalRequests.map(request => {
        if (request.h_lat && request.h_lon) {
          const calculatedDistance = calculateDistance(
            userLocation.lat,
            userLocation.lon,
            request.h_lat,
            request.h_lon
          );

          return {
            ...request,
            distance: calculatedDistance.toFixed(1)
          };
        }
        return request;
      });

      setHospitalRequests(requestsWithDistance);
      setLoading(false);
    }
  }, [userLocation, hospitalRequests.length]);

  // Fetch hospital requests and related hospital data
  const fetchHospitalRequests = async () => {
    setLoading(true);
    try {
      // Query non urgent and open requests only
      const requestsQuery = query(
        collection(db, "hospital-requests"),
        where("isUrgent", "==", "no"),
        where("status", "==", "open")
      );

      const requestsSnapshot = await getDocs(requestsQuery);

      const requests: HospitalRequest[] = [];

      // Process each request
      for (const requestDoc of requestsSnapshot.docs) {
        const requestData = requestDoc.data();

        // Extract hospital ID from the document ID (format: hospitalId-requestNo)
        const docId = requestDoc.id;
        const hospitalId = docId.split("-").slice(0, -1).join("-");

        // Fetch hospital data
        const hospitalDoc = await getDoc(doc(db, "hospitals", hospitalId));

        if (hospitalDoc.exists()) {
          const hospitalData = hospitalDoc.data();

          requests.push({
            id: docId,
            hospitalId: hospitalId,
            createdAt: requestData.createdAt || null,
            isUrgent: requestData.isUrgent || "no",
            status: requestData.status || "open",
            cause: requestData.cause || null,
            bloodQtyNeeded: requestData.bloodQtyNeeded || 0,
            h_name: hospitalData.h_name || "Unknown Hospital",
            h_logo_url: hospitalData.h_logo_url || "",
            email: hospitalData.email || "",
            h_phone: hospitalData.h_phone || "",
            h_lat: hospitalData.h_lat || 0,
            h_lon: hospitalData.h_lon || 0
          });
        }
      }

      setHospitalRequests(requests);

      if (!userLocation) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching hospital requests:", error);
      setLoading(false);
    }
  };

  // Filter and sort data
  const filteredData = hospitalRequests.filter(hospital =>
    hospital.h_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "distance") {
      const distA = parseFloat(a.distance as string || "999");
      const distB = parseFloat(b.distance as string || "999");
      return distA - distB;
    } else if (sortBy === "quantity") {
      return (b.bloodQtyNeeded || 0) - (a.bloodQtyNeeded || 0);
    } else if (sortBy === "name") {
      return (a.h_name || "").localeCompare(b.h_name || "");
    } else if (sortBy === "recent") {
      // Sort by creation date (most recent first)
      const dateA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <DialogHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 pt-2">
            <Avatar className="h-16 w-16 hidden md:flex">
              <AvatarImage src={selectedHospital?.h_logo_url} alt={selectedHospital?.h_name} />
              <AvatarFallback className="bg-primary/10 text-lg">
                {getInitials(selectedHospital?.h_name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <DialogTitle className="text-xl">
                {selectedHospital?.h_name}
              </DialogTitle>
              
            </div>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <h3 className="font-medium text-lg">Hospital Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{selectedHospital?.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{selectedHospital?.h_phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{selectedHospital?.distance} km away</span>
                </div>

                
              </div>

            </div>
            <div className="grid gap-3">
              <h3 className="font-medium text-lg">Request Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <div className="flex items-center ">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Posted: {selectedHospital?.createdAt ? formatTimeAgo(selectedHospital.createdAt) : "Unknown"}</span>
                </div>

                <div className="flex items-center">
                  <Droplets className="h-4 w-4 mr-2 text-red-500" />
                  <span><span className="font-medium">{selectedHospital?.bloodQtyNeeded} BU</span> needed</span>
                </div>

                {selectedHospital?.cause && (
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Reason: {selectedHospital.cause}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-lg">Book Appointment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Select Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Select Time
                  </label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="default"
              className="bg-red-500 hover:bg-red-600 w-full sm:w-auto"
              onClick={bookAppointment}
              disabled={!date || !selectedTime || isBooking}
            >
              {isBooking ? "Booking..." : "Book Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ContentLayout title="Urgent Donation Requests">
        <div className="w-full">
          <div className="max-w-6xl px-4 py-6">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Blood Requests from Nearby Hospitals</h1>
            <p className="text-md text-gray-700 dark:text-gray-300 mb-3">
              Thank you for being a <span className="font-semibold">potential lifesaver</span>! Below is a list of hospitals currently requesting blood donations.
            </p>
            <p className="text-md text-gray-700 dark:text-gray-300 mb-3">
              <span className="font-semibold">Your blood group: </span>
              <span className="text-red-600 font-bold capitalize">{profile?.d_bloodgroup}</span>
            </p>
            <p className="text-md text-gray-700 dark:text-gray-300 mb-3">
              You’ll only see donation requests that <span className="font-semibold">match your profile</span>, so make sure your information is always up to date.
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              BU = Blood Unit. 1 BU = 450 ml blood.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Find hospitals to donate at..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Nearest first</SelectItem>
                  <SelectItem value="quantity">Most needed first</SelectItem>
                  <SelectItem value="recent">Most recent</SelectItem>
                  <SelectItem value="name">Hospital name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading urgent donation requests...</p>
            </div>
          ) : paginatedData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedData.map((hospital, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={hospital.h_logo_url} alt={hospital.h_name} />
                        <AvatarFallback className="bg-primary/10">
                          {getInitials(hospital.h_name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{hospital.h_name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {hospital.createdAt ? formatTimeAgo(hospital.createdAt) : ""}
                        </p>
                      </div>
                      <Badge variant="destructive" className="ml-auto">Urgent</Badge>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="grid gap-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{hospital.distance ? `${hospital.distance} km away` : "Distance unknown"}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Droplets className="h-4 w-4 mr-2 text-red-500" />
                          <span><span className="font-medium">{hospital.bloodQtyNeeded} BU</span> needed</span>
                        </div>
                        {hospital.cause && (
                          <div className="flex items-center text-sm">
                            <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="truncate">Reason: {hospital.cause}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="default"
                        className="w-full bg-accent"
                        onClick={() => {
                          setSelectedHospital(hospital)
                          setOpen(true)
                          // Reset date and time when opening modal
                          setDate(undefined)
                          setSelectedTime("")
                        }}
                      >
                        More Info & Book
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // Simple pagination logic to show current page and neighbors
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No donation requests that match your profile are open right now.
              </p>
            </div>
          )}
        </div>
      </ContentLayout>
    </div>
  )
}