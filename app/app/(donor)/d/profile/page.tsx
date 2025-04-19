
// --@ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { LockKeyhole, Lock, Pencil, Link, Globe, Loader2, Check, Car, Heart, CalendarDays, Star, Siren, HeartPulse, Cigarette, Pill, Wine, Calendar, Scale, Droplet } from "lucide-react";
import { ContentLayout } from "@/components/admin-panel/content-layout";


import DonPF from "@/components/profile-forms/donorPF";

import { differenceInYears } from "date-fns"



import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge"
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getUserDataById, updateUserData, deleteUserById } from "@/firebaseFunctions"

function getInitials(name: string): string {
  if (!name) return ""; // Handle empty cases

  const words = name.trim().split(" ").filter(Boolean); // Remove extra spaces

  if (words.length === 1) return words[0][0].toUpperCase(); // Single word → 1 letter
  if (words.length === 2) return (words[0][0] + words[1][0]).toUpperCase(); // Two words → 2 letters
  return (words[0][0] + words[1][0]).toUpperCase(); // Three+ words → First 2 words' initials
}

function calculateRegisteredSince(createdAt: any) {
  let createdDate: Date;

  if (createdAt instanceof Date) {
    createdDate = createdAt;
  } else if (createdAt?.seconds) {
    createdDate = new Date(createdAt.seconds * 1000);
  } else {
    createdDate = new Date(createdAt);
  }

  const now = new Date();
  if (isNaN(createdDate.getTime())) {
    return "Invalid date";
  }

  const diff = now.getTime() - createdDate.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;

  let result = "";
  if (years > 0) result += `${years} years `;
  if (remainingDays > 0 || years === 0) result += `${remainingDays} days`;

  return result.trim();
}




export default function ProfilePage() {
  const { userId, role, device, setUser } = useUser();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (userId && role == "donor") {
      async function fetchDonorData() {
        const data = await getUserDataById(userId, "donor");
        setProfile(data); // Set Donor data (null if not found)
      }
      fetchDonorData();
    }
  }, [userId]);

  const { toast } = useToast()



  const calculateAge = (dob: string) => {
    if (!dob) return "Not provided"
    return differenceInYears(new Date(), new Date(dob))
  }



  // # Public/Private Button Function
  const [isPLoading, setPIsLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  useEffect(() => {
    if (profile) {
      setIsPublic(profile.isPublicProfile === "yes");
      setPIsLoading(false);
    }
  }, [profile]);



  const handleToggle = async () => {
    setPIsLoading(true);
    try {
      const newVisibility = isPublic ? "no" : "yes";

      const response = await updateUserData("donors", userId, {
        isPublicProfile: newVisibility,
      });

      if (response.success) {
        console.log("Profile Visibility updated successfully:", response.message);

        setIsPublic((prev) => !prev); // toggle public/private

        if (newVisibility === "yes") {
          toast({
            title: "🌐 Your profile is now public!",
            description: "Anyone with the link can see your profile.",
          });
        } else {
          toast({
            title: "🔒 Your profile is now private!",
            description: "Only you can see your profile.",
          });
        }

      } else {
        console.error("Error updating Profile Visibility:", response.message);
        toast({
          title: "❌ Failed to update visibility",
          description: "Please try again later.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error toggling:", error);
      toast({
        title: "❌ Something went wrong",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setPIsLoading(false);
    }
  };



  // # Copy Button Function
  const [isCopied, setIsCopied] = useState(false);
  const [isLCLoading, setIsLCLoading] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      alert("Copying not supported in your browser.");
      return;
    }

    setIsLCLoading(true);
    try {
      const { protocol, hostname } = window.location;
      const linkToCopy = `${protocol}//${hostname}/profile/${userId}`;

      await navigator.clipboard.writeText(linkToCopy);

      setIsCopied(true);

      // Show toast AFTER successfully copying
      toast({
        title: "✅ Link Copied!",
        description: "The link has been copied to your clipboard.",
      });

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy the link.");
    } finally {
      setIsLCLoading(false);
    }
  };



  // # EDIT PROFILE MODAL FUNCTION
  const [openPE, setOpenPE] = useState(false)

  const badgeList = [
    'ReliableDonor',
    'OnTimeDonor',
    '20PlusDonations',
    'LoyalDonor',
    'TimelyDonor',
    'ComittedDonor',
    'FrequentDonor',
  ]

  // # DELETE PROFILE MODAL FUNCTION
  const router = useRouter();
  const [openPD, setOpenPD] = useState(false)
  const [confirmationText, setConfirmationText] = useState("");

  const handleDelete = async () => {
    // Wait for the deleteUserById to complete
    const result = await deleteUserById(userId, "donor");

    // Only if the account was deleted successfully, log out and redirect
    if (result) {
      function handleLogout() {
        setUser(null, "guest", "guest");
        router.push("/");
      }
      handleLogout();
    } else {
      alert("Failed to delete the account.");
    }
  };



  return (
    <div>

      <Dialog open={openPE} onOpenChange={setOpenPE}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between px-10">
            <div className="w-[70%]">
              <DialogTitle className="font-bold text-[22px]">Editing Profile Details</DialogTitle>
            </div>
            <div className="w-[30%] flex justify-end">
              <button className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600" onClick={() => setOpenPE(false)}>
                Close
              </button>
            </div>
          </DialogHeader>

          <DonPF />

          <DialogFooter>
            {/* Empty footer */}
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={openPD} onOpenChange={setOpenPD}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-destructive text-2xl">Dangerous Action</DialogTitle>

            {/* This div is needed to wrap ul */}
            <div className="space-y-4 pt-2 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li>All your account data, history, and personal information will be permanently deleted.</li>
                <li>This action is <span className="font-bold text-destructive">irreversible</span>.</li>
                <li>Third parties may still retain some data. See our <a href="/privacy" className="underline text-primary">Privacy Policy</a> for more details.</li>
              </ul>

              <div className="pt-6">
                <p className="font-medium">To confirm, type <span className="font-mono bg-muted px-1 py-0.5 rounded">DELETE MY ACCOUNT</span> below:</p>
                <Input
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Type here..."
                  className="mt-2"
                />
              </div>
            </div>
          </DialogHeader>


          <DialogFooter className="mt-6 flex flex-col gap-3">
            <Button
              variant="destructive"
              disabled={confirmationText !== "DELETE MY ACCOUNT"}
              onClick={() => {
                handleDelete();
                setOpenPD(false);
              }}
              className="w-full"
            >
              Permanently Delete My Account
            </Button>

            <Button
              variant="outline"
              onClick={() => setOpenPD(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <ContentLayout title="My Profile">
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleToggle}
                disabled={isPLoading}
                className="flex items-center gap-2 bg-accent w-full sm:w-auto"
              >
                {isPLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPublic ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                {isPLoading ? "Please wait..." : isPublic ? "Make Private" : "Make Public"}
              </Button>
              <Button
                onClick={handleCopy}
                disabled={isLCLoading}
                className="flex items-center gap-2 bg-accent w-full sm:w-auto"
              >
                {isLCLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Link className="w-4 h-4" />
                )}
                {isLCLoading ? "Copying..." : isCopied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
            <Button
              className="flex items-center gap-2 bg-accent w-full sm:w-auto"
              onClick={() => { setOpenPE(true) }}
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>

          { /* PROFILE PAGE CONTENTS*/}

          <Card className="p-6 w-full max-w-full mx-auto flex flex-col gap-6">
            {/* Row 1 - Title */}
            <h2 className="text-2xl font-bold text-center">Personal Details</h2>

            {/* Row 2 - Profile Pic and Details */}
            {profile ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                {/* Profile Picture */}
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.d_logo_url} />
                  <AvatarFallback>{getInitials(profile.d_name)}</AvatarFallback>
                </Avatar>

                {/* Profile Text Details */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-semibold uppercase break-words">{profile.d_name} ({role})</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-md text-foreground font-bold mt-2">
                    {/* Blood Group */}
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide">Blood Group</p>
                      {profile.d_bloodgroup ? (
                        <p className="font-bold text-red-500 capitalize break-words">{profile.d_bloodgroup}</p>
                      ) : (
                        <p className="text-gray-400">Not provided</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide">Phone</p>
                      {profile.phone ? (
                        <p className="font-semibold text-gray-700 dark:text-gray-400 break-words">{profile.phone}</p>
                      ) : (
                        <p className="text-gray-400">Not provided</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide">Email</p>
                      {profile.email ? (
                        <p className="font-semibold text-gray-700 dark:text-gray-400 break-words">{profile.email}</p>
                      ) : (
                        <p className="text-gray-400">Not provided</p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide">Location</p>
                      {profile.d_region && (profile.d_region[0] || profile.d_region[1]) ? (
                        <p className="font-semibold text-gray-700 dark:text-gray-400 break-words">
                          {profile.d_region[1] ? `${profile.d_region[1]}, ${profile.d_region[0]}` : profile.d_region[0]}
                        </p>
                      ) : (
                        <p className="text-gray-400">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-52" />
                </div>
              </div>
            )}

            {/* Row 3 - Subcards */}
            {profile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                {/* Donations */}
                <Card className="flex items-center gap-4 p-4 w-full">
                  <div className="flex items-center justify-center p-2">
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-sm text-gray-500 truncate">Donations</p>
                    <p className="text-lg font-bold break-words">{profile.totalDonations}</p>
                  </div>
                </Card>

                {/* Registered Since */}
                <Card className="flex items-center gap-4 p-4 w-full">
                  <div className="flex items-center justify-center p-2">
                    <CalendarDays className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-sm text-gray-500 truncate">Registered Since</p>
                    <p className="text-lg font-bold break-words">{calculateRegisteredSince(profile.createdAt)}</p>
                  </div>
                </Card>

                {/* Rating */}
                <Card className="flex items-center gap-4 p-4 w-full">
                  <div className="flex items-center justify-center p-2">
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-sm text-gray-500 truncate">Rating</p>
                    <p className="text-lg font-bold break-words">
                      {profile.rating !== undefined && profile.rating !== null ? `${profile.rating}/5` : "No rating"}
                    </p>
                  </div>
                </Card>

                {/* Emergency Availability */}
                <Card className="flex items-center gap-4 p-4 w-full">
                  <div className="flex items-center justify-center p-2">
                    <Siren className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-sm text-gray-500 truncate">In Emergencies?</p>
                    <p className={`text-lg font-bold break-words ${profile.d_availableEmergency === "yes" ? "text-green-500" : "text-red-500"}`}>
                      {profile.d_availableEmergency === "yes" ? "Available" : "Not Available"}
                    </p>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            )}

          </Card>

          <Card className="w-full max-w mx-auto p-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Health Details</CardTitle>
            </CardHeader>

            {/* Content */}
            {profile ? (
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-600 dark:text-gray-400 font-bold">

                {/* Age */}
                <div className="flex items-center gap-4">
                  <Calendar className="" />
                  <div>
                    <p className="text-xs uppercase">Age</p>
                    <p className="font-semibold">
                      {profile.d_dob ? `${calculateAge(profile.d_dob)} years` : "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Weight */}
                <div className="flex items-center gap-4">
                  <Scale className="" />
                  <div>
                    <p className="text-xs uppercase">Weight</p>
                    <p className="font-semibold">{profile.d_weight_kg ? `${profile.d_weight_kg} kg` : "Not provided"}</p>
                  </div>
                </div>

                {/* Last Donation */}
                <div className="flex items-center gap-4">
                  <HeartPulse className="" />
                  <div>
                    <p className="text-xs uppercase">Donation Cooldown (3 months)</p>
                    <Badge className={profile.d_isLastDonation === "yes" ? "bg-red-500" : "bg-green-600"}>
                      {profile.d_isLastDonation || "Not provided"}
                    </Badge>
                  </div>
                </div>

                {/* Smoker */}
                <div className="flex items-center gap-4">
                  <Cigarette className="" />
                  <div>
                    <p className="text-xs uppercase">Smoker</p>
                    <Badge className={profile.d_isSmoker === "yes" ? "bg-red-500" : "bg-green-600"}>
                      {profile.d_isSmoker || "Not provided"}
                    </Badge>
                  </div>
                </div>

                {/* Alcoholic */}
                <div className="flex items-center gap-4">
                  <Wine className="" />
                  <div>
                    <p className="text-xs uppercase">Alcoholic</p>
                    <Badge className={profile.d_isAlcoholic === "yes" ? "bg-red-500" : "bg-green-600"}>
                      {profile.d_isAlcoholic || "Not provided"}
                    </Badge>
                  </div>
                </div>

                {/* Medication */}
                <div className="flex items-center gap-4">
                  <Pill className="" />
                  <div>
                    <p className="text-xs uppercase ">Medication</p>
                    <Badge className={profile.d_isMedication === "yes" ? "bg-red-500" : "bg-green-600"}>
                      {profile.d_isMedication || "Not provided"}
                    </Badge>
                  </div>
                </div>







              </CardContent>
            ) : (
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </CardContent>
            )}
          </Card>


          <Card className="p-6 w-full max-w mx-auto flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center">Badges</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center">
              <TooltipProvider>
                {badgeList.map((badge) => {
                  const unlocked = profile?.[`${badge}Unlocked`] === 'yes'
                  const imagePath = `/badges/donor/${badge}.svg`

                  const badgeContent = (
                    <div className="relative flex flex-col items-center">
                      {/* Badge Container */}
                      <div className="relative w-[100px] aspect-square rounded-lg overflow-hidden ">
                        <Image
                          src={imagePath}
                          alt={badge}
                          fill
                          className={`object-contain transition-all ${unlocked ? '' : 'grayscale opacity-60'}`}
                        />
                        {!unlocked && (
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-white/70 dark:bg-black/40 rounded-full p-1">
                            <Lock className="w-4 h-4 text-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  )

                  return unlocked ? (
                    <div key={badge}>{badgeContent}</div>
                  ) : (
                    <Tooltip key={badge}>
                      <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
                      <TooltipContent>Unlock this badge by completing the criteria.</TooltipContent>
                    </Tooltip>
                  )
                })}
              </TooltipProvider>
            </div>
          </Card>

          {/* Donation History Card */}
          <Card className="p-6 w-full max-w mx-auto flex flex-col gap-4 items-center text-center">
            <h2 className="text-2xl font-bold">Donation History</h2>
            <Droplet className="w-8 h-8 text-red-400" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              This donor hasn’t made a donation yet. We appreciate their willingness to help when needed.
            </p>
          </Card>


          <div className="w-full mx-auto mt-6 items-center" style={{ maxWidth: "600px" }}>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  🚨 Danger Zone
                  <ChevronDown className="h-4 w-4 ransition-transform duration-200" />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    setOpenPD(true)
                  }}
                >
                  Delete All My Data & Account
                </Button>
              </CollapsibleContent>
            </Collapsible>

          </div>
        </div>
      </ContentLayout>
    </div>
  );
}
