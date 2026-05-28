"use client"

import * as React from "react"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ArrowLeft, Activity, Heart, Building2, Users as UsersIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Variants } from "framer-motion";
import Image from "next/image"

import HeartLoading from "@/components/custom/HeartLoading"; // <HeartLoading />

import PEPhoneButton from "@/components/custom/PEPhoneButton"
import PEEmailButton from "@/components/custom/PEEmailButton"

//User Account 
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUserDatabase } from "@/firebaseFunctions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { APP_CONFIG } from "@/config/CORE_CONFIG";

async function getOnboardedStatus(role: string, userId: string) {
  if (!db) {
    console.error("Firebase Firestore not initialized");
    return false;
  }

  try {
    const userDocRef = doc(db, role, userId); // Reference to the document
    const userDocSnap = await getDoc(userDocRef); // Fetch the document

    if (userDocSnap.exists()) {
      return userDocSnap.data().onboarded ?? false; // Return onboarded status or default to false
    } else {
      console.error("User document does not exist");
      return false;
    }
  } catch (error) {
    console.error("Error fetching onboarded status:", error);
    return false;
  }
}

// ---------------- PATIENT ROLE LOGIN PAGE CONTENT ----------------------------

const PatientContent: React.FC = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [content, setContent] = useState<React.ReactNode>(null);

  let isProcessing = false;

  const handleVerificationSuccess = async (data: {
    user_country_code: string;
    user_phone_number: string;
    user_first_name: string;
    user_last_name: string;
  }) => {
    if (isProcessing) return;
    isProcessing = true;

    setContent(<HeartLoading />);

    try {
      const userId = await loginUserDatabase("patient", data.user_country_code + data.user_phone_number);
      const onboarded = await getOnboardedStatus("patients", userId);


      if (!userId) {
        console.error("User ID not found, login failed");
        setContent(defaultUI());
        return;
      }

      // Set user context after getting from database
      setUser(userId, "patient", onboarded);

      isProcessing = false;

      // Send user to /app
      router.push("/app");

    } catch (error) {
      console.error("Error during login:", error);
      setContent(defaultUI()); // Restore UI if error occurs
    }
  };

  function defaultUI() {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome, Patient!</h2>
          <p className="text-sm text-muted-foreground">
            Search, match, and request blood access during emergencies.
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-center items-center w-full py-4">
            <PEPhoneButton onVerify={handleVerificationSuccess} />
          </div>
        </form>
      </div>
    )
  }

  useState(() => setContent(defaultUI()));

  return <>{content}</>;
};

// ---------------- DONOR ROLE LOGIN PAGE CONTENT ----------------------------

const DonorContent: React.FC = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [content, setContent] = useState<React.ReactNode>(null);

  let isProcessing = false;

  const handleVerificationSuccess = async (data: {
    user_country_code: string;
    user_phone_number: string;
    user_first_name: string;
    user_last_name: string;
  }) => {
    if (isProcessing) return;
    isProcessing = true;

    setContent(<HeartLoading />);

    try {
      const userId = await loginUserDatabase("donor", data.user_country_code + data.user_phone_number);
      const onboarded = await getOnboardedStatus("donors", userId);

      if (!userId) {
        console.error("User ID not found, login failed");
        setContent(defaultUI());
        return;
      }

      setUser(userId, "donor", onboarded);

      isProcessing = false;

      router.push("/app");

    } catch (error) {
      console.error("Error during login:", error);
      setContent(defaultUI()); // Restore UI if error occurs
    }
  };

  function defaultUI() {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome, Donor!</h2>
          <p className="text-sm text-muted-foreground">
            Register your profile to receive nearby blood requests and track your lifesaving impact.
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-center items-center w-full py-4">
            <PEPhoneButton onVerify={handleVerificationSuccess} />
          </div>
        </form>
      </div>
    );
  }

  useState(() => setContent(defaultUI()));

  return <>{content}</>;
};



// ---------------- HOSPITAL ROLE LOGIN PAGE CONTENT ----------------------------


const HospitalContent: React.FC = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [content, setContent] = useState<React.ReactNode>(null);

  let isProcessing = false;

  const handleVerificationSuccess = async (data: {
    user_email: string;
  }) => {
    if (isProcessing) return;
    isProcessing = true;

    setContent(<HeartLoading />);

    try {
      const userId = await loginUserDatabase("hospital", data.user_email);
      const onboarded = await getOnboardedStatus("hospitals", userId);

      if (!userId) {
        console.error("User ID not found, login failed");
        setContent(defaultUI());
        return;
      }

      setUser(userId, "hospital", onboarded);

      isProcessing = false;

      router.push("/app");

    } catch (error) {
      console.error("Error during login:", error);
      setContent(defaultUI()); // Restore UI if error occurs
    }
  };

  function defaultUI() {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Hospital Registry 🏥</h2>
          <p className="text-sm text-muted-foreground">
            Coordinate inventories and match requests directly with nearby donors.
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-center items-center w-full py-4">
            <PEEmailButton onVerify={handleVerificationSuccess} />
          </div>
        </form>
        <p className="text-muted-foreground text-xs leading-relaxed bg-muted/50 p-3 rounded-lg border border-border/40">
          Only institutional email domains are authorized (e.g. hospital domain). Personal email providers are enabled for preview purposes.
        </p>
      </div>
    );
  }
  useState(() => setContent(defaultUI()));

  return <>{content}</>;
};


// ---------------- ORGANISATION ROLE LOGIN PAGE CONTENT ----------------------------

const OrganisationContent: React.FC = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [content, setContent] = useState<React.ReactNode>(null);

  let isProcessing = false;

  const handleVerificationSuccess = async (data: {
    user_email: string;
  }) => {
    if (isProcessing) return;
    isProcessing = true;

    setContent(<HeartLoading />);

    try {
      const userId = await loginUserDatabase("organisation", data.user_email);
      const onboarded = await getOnboardedStatus("organisations", userId);

      if (!userId) {
        console.error("User ID not found, login failed");
        setContent(defaultUI());
        return;
      }

      setUser(userId, "organisation", onboarded);

      isProcessing = false;

      router.push("/app");

    } catch (error) {
      console.error("Error during login:", error);
      setContent(defaultUI()); // Restore UI if error occurs
    }
  };

  function defaultUI() {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">NGO &amp; Organisation Registry 👥</h2>
          <p className="text-sm text-muted-foreground">
            Sponsor local events, manage donation drives, and coordinate public health networks.
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-center items-center w-full py-4">
            <PEEmailButton onVerify={handleVerificationSuccess} />
          </div>
        </form>
        <p className="text-muted-foreground text-xs leading-relaxed bg-muted/50 p-3 rounded-lg border border-border/40">
          Only organization domains are authorized. Personal email providers are enabled for preview testing.
        </p>
      </div>
    );
  }
  useState(() => setContent(defaultUI()));

  return <>{content}</>;
}


// --------------------------------
// --------------------------------
// --------------------------------


// ---------------- ROLE SELECTION PAGE CONTENT ----------------------------

// Items for role selection
const items = [
  {
    title: "Continue as Patient",
    description: "Sign up to quickly request blood!",
    image: "/cs_patient.webp",
    icon: Activity,
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/20",
    hoverColor: "hover:border-red-500/30 hover:shadow-red-500/5 hover:bg-red-500/[0.02]"
  },
  {
    title: "Continue as Donor",
    description: "Register to see where your donation saves lives.",
    image: "/cs_donor.webp",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10 border-rose-500/20",
    hoverColor: "hover:border-rose-500/30 hover:shadow-rose-500/5 hover:bg-rose-500/[0.02]"
  },
  {
    title: "Continue as Hospital",
    description: "Connect directly with donors to get the blood your patients need.",
    image: "/cs_hospital.webp",
    icon: Building2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    hoverColor: "hover:border-blue-500/30 hover:shadow-blue-500/5 hover:bg-blue-500/[0.02]"
  },
  {
    title: "Continue as Organisation/NGO",
    description: "Organize donation drives & support those in urgent need.",
    image: "/cs_organisation.webp",
    icon: UsersIcon,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
    hoverColor: "hover:border-emerald-500/30 hover:shadow-emerald-500/5 hover:bg-emerald-500/[0.02]"
  },
]

interface RoleContentProps {
  role: typeof items[0];
}

const RoleContent: React.FC<RoleContentProps> = ({ role }) => {
  switch (role.title) {
    case "Continue as Patient":
      return <PatientContent />
    case "Continue as Donor":
      return <DonorContent />
    case "Continue as Hospital":
      return <HospitalContent />
    case "Continue as Organisation/NGO":
      return <OrganisationContent />

    default:
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">
            You selected: {role.title}
          </h1>
          <p className="mb-4">{role.description}</p>
        </div>
      )
  }
}

// ---------------- DEFAULT FUNCTION THAT BRINGS EVERYTHING TOGETHER AND HANDLES ROLE SELECTION --------------------
// -------------------& TRANSITION TO ROLE LOGIN PAGE CONTENT ----------------------------

function LoginContent() {
  const { setTheme } = useTheme()
  const [selectedRole, setSelectedRole] = useState<null | typeof items[0]>(null)
  const [direction, setDirection] = useState(1)
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role")

  useEffect(() => {
    if (roleParam) {
      let targetRole = null;
      if (roleParam === "hospital") {
        targetRole = items.find(item => item.title === "Continue as Hospital");
      } else if (roleParam === "donor") {
        targetRole = items.find(item => item.title === "Continue as Donor");
      } else if (roleParam === "patient") {
        targetRole = items.find(item => item.title === "Continue as Patient");
      } else if (roleParam === "organisation" || roleParam === "ngo") {
        targetRole = items.find(item => item.title === "Continue as Organisation/NGO");
      }
      
      if (targetRole) {
        setSelectedRole(targetRole);
      }
    }
  }, [roleParam]);

  const handleRoleSelect = (role: typeof items[0]) => {
    setDirection(1)
    setSelectedRole(role)
  }

  const handleGoBack = () => {
    setDirection(-1)
    setSelectedRole(null)
  }

  // Get user data from context
  const { userId, role, onboarded, device } = useUser();
  const router = useRouter();

  // Redirect loggedins (userId != null) to app
  useEffect(() => {
    if (userId !== null) {
      const timeout = setTimeout(() => {
        router.push("/app");
      }, 1000);

      return () => clearTimeout(timeout); // Cleanup function to avoid memory leaks
    }
  }, [userId, router]);

  // Define variants with explicit transitions.
  const roleSelectionVariants: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  }

  const newScreenVariants: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  }

  const { setUser } = useUser();

  // Using test data here
  function handleLogin(role: string) {
    const userId = "ABCD-EFGH"
    setUser(userId, "hospital", "no");
    router.push("/app");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-8 py-16 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background select-none">
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Theme Toggler at top right */}
      <div className="absolute top-0 right-0 p-4 z-50 flex gap-2">
        {/*GitHub Repo Button*/}
        <Button variant="outline" size="icon" asChild>
          <a
            href="https://github.com/saad2134/donor-sync"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-[1.2rem] w-[1.2rem] transition-all hover:scale-110"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.287-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.495.998.108-.775.42-1.305.763-1.605-2.665-.303-5.467-1.335-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.243 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.624-5.48 5.92.431.372.815 1.102.815 2.222 0 1.606-.015 2.898-.015 3.293 0 .323.216.7.825.58C20.565 21.795 24 17.303 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="hover:bg-muted/50 border-border/60 transition-all">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Centered Glass Container Card */}
      <Card className={`w-full ${selectedRole === null ? 'max-w-6xl' : 'max-w-lg'} border border-border/50 bg-card/60 backdrop-blur-lg shadow-2xl relative z-10 overflow-hidden min-h-[500px] flex flex-col transition-all duration-300 ease-in-out`}>
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-primary via-secondary to-primary/80" />

        <div className="p-8 sm:p-10 flex-grow flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {selectedRole === null ? (
              // Role selection screen
              <motion.div
                key="role-selection"
                variants={roleSelectionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 flex flex-col justify-center h-full w-full"
              >
                {/* Brand Header */}
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-md">
                    <Heart className="w-7 h-7 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                      Continue to {APP_CONFIG.appName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Select your registry type to manage or request blood access.
                    </p>
                  </div>
                </div>

                {/* Role Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => handleRoleSelect(item)}
                        className={`flex flex-col border rounded-2xl cursor-pointer select-none transition-all duration-300 bg-card/50 overflow-hidden ${item.hoverColor} group h-full`}
                      >
                        {/* Card Image Area */}
                        <div className="relative w-full h-44 overflow-hidden bg-muted/20 border-b border-border/10 flex-shrink-0">
                          <div className="absolute inset-4">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-contain group-hover:scale-105 transition-transform duration-500 select-none"
                              draggable={false}
                              onDragStart={(e) => e.preventDefault()}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>
                        </div>

                        {/* Card Content Area */}
                        <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                          <div className="space-y-2 text-left">
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-normal">
                              {item.description}
                            </p>
                          </div>

                          {/* Bottom CTA / Action */}
                          <div className="flex items-center text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors duration-300 mt-auto pt-2 gap-1.5">
                            <span>Continue</span>
                            <ArrowLeft className="w-4 h-4 rotate-180 transform group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              // Form screen for the selected role
              <motion.div
                key="new-screen"
                variants={newScreenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6 flex flex-col justify-center h-full w-full relative"
              >
                {/* Back Button inside the card header */}
                <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-muted/50 text-muted-foreground hover:text-foreground font-medium rounded-lg text-xs gap-1.5 px-3 py-1.5"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Change Role
                  </Button>
                  
                  {/* Miniature Indicator of selected role */}
                  <Badge variant="secondary" className={`font-semibold text-xs px-2.5 py-0.5 border ${selectedRole.bgColor} flex items-center gap-1.5`}>
                    {React.createElement(selectedRole.icon, { className: `w-3 h-3 ${selectedRole.color}` })}
                    <span>{selectedRole.title.replace("Continue as ", "")}</span>
                  </Badge>
                </div>

                <div className="pt-2 text-left">
                  <RoleContent role={selectedRole} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Back to Home button */}
      <Button
        variant="link"
        onClick={() => router.push("/")}
        className="mt-6 text-zinc-700 hover:text-foreground transition-colors duration-200 flex items-center gap-2 text-sm hover:no-underline relative z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Button>
    </div>
  )
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <HeartLoading />
      </div>
    }>
      <LoginContent />
    </React.Suspense>
  )
}
