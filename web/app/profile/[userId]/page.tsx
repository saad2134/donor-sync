// --@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from "@/components/landing-page/BusinessNavbar";
import Footer from "@/components/landing-page/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Globe, Heart, Building, Droplets, Calendar, User, ShieldAlert, HeartPulse } from "lucide-react";

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileType, setProfileType] = useState<"donor" | "hospital" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userId || !db) return;

    const fetchPublicProfile = async () => {
      setLoading(true);
      try {
        // Try fetching as donor
        const donorRef = doc(db, "donors", userId);
        const donorSnap = await getDoc(donorRef);

        if (donorSnap.exists()) {
          const data = donorSnap.data();
          if (data.isPublicProfile === "yes") {
            setProfileData(data);
            setProfileType("donor");
            setLoading(false);
            return;
          }
        }

        // Try fetching as hospital
        const hospitalRef = doc(db, "hospitals", userId);
        const hospitalSnap = await getDoc(hospitalRef);

        if (hospitalSnap.exists()) {
          const data = hospitalSnap.data();
          if (data.isPublicProfile === "yes") {
            setProfileData(data);
            setProfileType("hospital");
            setLoading(false);
            return;
          }
        }

        // Default: Not found or not public
        setProfileData(null);
        setProfileType(null);
      } catch (error) {
        console.error("Error fetching public profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]);

  if (!mounted) return null;

  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(" ").filter(Boolean);
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center pt-48 pb-24 px-6 text-center">
          <HeartPulse className="h-16 w-16 text-red-500 animate-pulse mb-4" />
          <h2 className="text-xl font-semibold">Loading Profile...</h2>
        </div>
      );
    }

    if (!profileData) {
      return (
        <div className="flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center space-y-6 max-w-lg mx-auto">
          <Image
            src="/not-found.webp"
            alt="Profile Not Found"
            width={320}
            height={320}
            className="rounded-xl object-contain opacity-80"
            priority
          />
          <h2 className="text-3xl font-extrabold tracking-tight">Profile Private or Not Found</h2>
          <p className="text-muted-foreground text-md leading-relaxed">
            This user’s profile does not exist, has been removed, or the owner has set their visibility preference to private.
          </p>
        </div>
      );
    }

    if (profileType === "donor") {
      return (
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
          <Card className="border border-border/50 bg-card/60 backdrop-blur-lg shadow-xl relative overflow-hidden rounded-3xl">
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />
            
            <CardContent className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/50 text-center sm:text-left">
                <Avatar className="h-24 w-24 border-2 border-red-500/20">
                  <AvatarImage src={profileData.d_logo_url} alt={profileData.d_name} />
                  <AvatarFallback className="bg-red-500/10 text-red-500 text-3xl font-bold">
                    {getInitials(profileData.d_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{profileData.d_name}</h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 font-semibold flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5" />
                      Blood Group: {profileData.d_bloodgroup}
                    </Badge>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 font-semibold">
                      Verified Donor
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground border-b border-border/40 pb-2">About Donor</h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Gender: <strong className="text-foreground capitalize">{profileData.d_gender}</strong></span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Location: <strong className="text-foreground">{profileData.d_city}, {profileData.d_region?.[1] || profileData.d_region?.[0]}</strong></span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Willing regular donor: <strong className="text-foreground capitalize">{profileData.d_willingRegular === "yes" ? "Yes" : "No"}</strong></span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Available for emergency: <strong className="text-foreground capitalize">{profileData.d_availableEmergency === "yes" ? "Yes" : "No"}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground border-b border-border/40 pb-2">Donation History</h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Last donation date: <strong className="text-foreground">{profileData.d_dateLastDonation || "None recorded"}</strong></span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (profileType === "hospital") {
      return (
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
          <Card className="border border-border/50 bg-card/60 backdrop-blur-lg shadow-xl relative overflow-hidden rounded-3xl">
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-sky-500 to-blue-500" />
            
            <CardContent className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/50 text-center sm:text-left">
                <Avatar className="h-24 w-24 border-2 border-blue-500/20">
                  <AvatarImage src={profileData.h_logo_url} alt={profileData.h_name} />
                  <AvatarFallback className="bg-blue-500/10 text-blue-500 text-3xl font-bold">
                    {getInitials(profileData.h_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{profileData.h_name}</h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 font-semibold flex items-center gap-1 capitalize">
                      <Building className="h-3.5 w-3.5" />
                      Type: {profileData.h_type}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 font-semibold">
                      Blood Bank: {profileData.h_bloodbank_available === "yes" ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground border-b border-border/40 pb-2">Location &amp; Contact</h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>Address: <strong className="text-foreground">{profileData.h_city}, {profileData.h_region?.[1] || profileData.h_region?.[0]} - {profileData.h_pincode}</strong></span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>Phone: <a href={`tel:${profileData.h_phone}`} className="text-blue-500 hover:underline">{profileData.h_phone}</a></span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>Email: <a href={`mailto:${profileData.email}`} className="text-blue-500 hover:underline">{profileData.email}</a></span>
                    </p>
                    {profileData.h_website && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4 text-blue-500 shrink-0" />
                        <span>Website: <a href={profileData.h_website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profileData.h_website}</a></span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground border-b border-border/40 pb-2">Hospital Statistics</h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>Admin: <strong className="text-foreground">{profileData.h_admin_name}</strong></span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>Monthly patient flow: <strong className="text-foreground">{profileData.monthly_patient_count}</strong></span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  return createPortal(
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background flex flex-col justify-between">
      <ScrollArea className="h-screen flex flex-col justify-between">
        <div>
          <BusinessNavbar />
          {renderContent()}
        </div>
        <Footer />
      </ScrollArea>
    </div>,
    document.body
  );
}
