"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig"; // your firestore init
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { ContentLayout } from "@/components/admin-panel/content-layout";

interface Hospital {
  id: string;
  name: string;
  logoUrl: string;
  lat: number;
  lon: number;
  distance: number;
  phone: string;
  email: string;
}

export default function NearbyHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const itemsPerPage = 9; // 9 cards per page

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchHospitals();
    }
  }, [userLocation]);

  const getUserLocation = async () => {
    setLoading(true);
    const geoOptions = { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting user location", error);
          setLoading(false);
        },
        geoOptions
      );
    } else {
      console.error("Geolocation not supported");
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchHospitals = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "hospitals"));
    const fetchedHospitals: Hospital[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (userLocation) {
        // Skip hospitals that don't have valid coordinates
        if (data.h_lat !== undefined && data.h_lon !== undefined && data.h_lat !== null && data.h_lon !== null) {
          const dist = calculateDistance(userLocation.lat, userLocation.lon, data.h_lat, data.h_lon);
          fetchedHospitals.push({
            id: doc.id,
            name: data.h_name,
            logoUrl: data.h_logo_url,
            lat: data.h_lat,
            lon: data.h_lon,
            distance: dist,
            phone: data.h_phone,
            email: data.email,
          });
        }
      }
    });

    fetchedHospitals.sort((a, b) => a.distance - b.distance); // Sort by nearest
    setHospitals(fetchedHospitals);
    setLoading(false);
  };


  const paginatedHospitals = hospitals.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const totalPages = Math.ceil(hospitals.length / itemsPerPage);

  return (
    <ContentLayout title="Nearby Hospitals">
      <div className="p-4">
        <div className="max-w-6xl pb-6">
          <h1 className="text-3xl font-bold text-red-500 mb-4">List of Nearby Hospitals 🏥</h1>
          <p className="text-md text-gray-700 dark:text-gray-300 mb-3">
            Browse a list of <span className="font-semibold">nearby hospitals</span> based on your location.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <Card key={idx} className="flex flex-col pt-6 shadow-md rounded-2xl">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto">
                  <Skeleton className="w-24 h-24 rounded-full" />
                </div>
                <CardContent className="flex flex-col space-y-4">
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedHospitals.map((hospital) => (
                <Card key={hospital.id} className="flex flex-col pt-6 shadow-md hover:shadow-lg transition rounded-2xl">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto">
                    <img
                      src={hospital.logoUrl}
                      alt={hospital.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold">{hospital.name}</h2>

                    <div className="flex flex-wrap items-center gap-2 text-accent text-sm">
                      <MapPin className="h-4 w-4" />
                      <a
                        href={`https://www.google.com/maps?q=${hospital.lat},${hospital.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        {hospital.distance.toFixed(2)} km away
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {hospital.phone && (
                      <div className="flex flex-wrap items-center gap-2 text-green-600 text-sm">
                        <Phone className="h-4 w-4" />
                        <a
                          href={`tel:${hospital.phone}`}
                          className="text-green-600 hover:underline text-sm font-medium truncate max-w-[150px]"
                        >
                          {hospital.phone}
                        </a>
                      </div>
                    )}

                    {hospital.email && (
                      <div className="flex flex-wrap items-center gap-2 text-blue-600 text-sm">
                        <Mail className="h-4 w-4" />
                        <a
                          href={`mailto:${hospital.email}`}
                          className="text-blue-600 hover:underline text-sm font-medium truncate max-w-[80%]"
                        >
                          {hospital.email}
                        </a>
                      </div>
                    )}

                    {/* Button to open hospital profile */}
                    <Button
                      onClick={() => {
                        const { protocol, hostname } = window.location;
                        const linkToOpen = `${protocol}//${hostname}/profile/${hospital.id}`;
                        window.open(linkToOpen, '_blank');
                      }}
                      className="mt-2 bg-accent text-white hover:bg-accent/90"
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>

              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
              <Button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="bg-accent"
              >
                Previous
              </Button>
              <span className="px-4 py-2">{page} / {totalPages}</span>
              <Button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="bg-accent"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </ContentLayout>

  );
}
