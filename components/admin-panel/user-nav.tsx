"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//User Imports
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { updateUserData } from "@/firebaseFunctions"
import { getUserDataById } from "@/firebaseFunctions";

function getInitials(name: string): string {
  if (!name) return ""; // Handle empty cases

  const words = name.trim().split(" ").filter(Boolean); // Remove extra spaces

  if (words.length === 1) return words[0][0].toUpperCase(); // Single word → 1 letter
  if (words.length === 2) return (words[0][0] + words[1][0]).toUpperCase(); // Two words → 2 letters
  return (words[0][0] + words[1][0]).toUpperCase(); // Three+ words → First 2 words' initials
}


export function UserNav() {

  const { userId, role, device, setUser } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  function handleLogout() {
    setUser(null, "guest", "guest");
    router.push("/");
  }

  // Fetch data when the component loads
  useEffect(() => {
    if (userId && role == "patient") {
      async function fetchPatientData() {
        const data = await getUserDataById(userId, "patient");
        setProfile(data); // Set Patient data (null if not found)
      }
      fetchPatientData();
    }
    else if (userId && role == "donor") {
      async function fetchDonorData() {
        const data = await getUserDataById(userId, "donor");
        setProfile(data); // Set Donor data (null if not found)
      }
      fetchDonorData();
    }
    else if (userId && role == "hospital") {
      async function fetchHospitalData() {
        const data = await getUserDataById(userId, "hospital");
        setProfile(data); // Set Hospital data (null if not found)
      }
      fetchHospitalData();
    }
    else if (userId && role == "organisation") {
      async function fetchOrganisationData() {
        const data = await getUserDataById(userId, "organisation");
        setProfile(data); // Set Organisation data (null if not found)
      }
      fetchOrganisationData();
    }
  }, [userId]);

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-9 w-9 rounded-md"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      role === "patient" ? "#" :
                        role === "donor" ? profile?.d_logo_url :
                          role === "hospital" ? profile?.h_logo_url :
                            role === "organisation" ? profile?.o_logo_url
                              : "#" // default
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback className="bg-transparent">{
                    role === "patient" ? getInitials(profile?.p_name) :
                      role === "donor" ? getInitials(profile?.d_name) :
                        role === "hospital" ? getInitials(profile?.h_name) :
                          role === "organisation" ? getInitials(profile?.o_name)
                            : "U" // default
                  }
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {
                role === "patient" ? profile?.p_name :
                  role === "donor" ? profile?.d_name :
                    role === "hospital" ? profile?.h_name :
                      role === "organisation" ? profile?.o_name
                        : "User" // default
              }
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {
                role === "patient" ? profile?.phone :
                  role === "donor" ? profile?.phone :
                    role === "hospital" ? profile?.email :
                      role === "organisation" ? profile?.email
                        : "User" // default
              }
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/account" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
