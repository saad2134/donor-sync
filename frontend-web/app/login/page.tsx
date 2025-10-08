"use client"

import * as React from "react"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ArrowLeft } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import RoleCard from "@/components/ui/rolecard"
import { motion, AnimatePresence } from "framer-motion"

import HeartLoading from "@/components/custom/HeartLoading"; // <HeartLoading />

import PEPhoneButton from "@/components/custom/PEPhoneButton"
import PEEmailButton from "@/components/custom/PEEmailButton"

//User Account 
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { loginUserDatabase } from "@/firebaseFunctions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

async function getOnboardedStatus(role: string, userId: string) {
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
  const [content, setContent] = useState<JSX.Element | null>(null);

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
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome, Patient!</h1>
        <p className="mb-4">
          Here you can request/find blood.
        </p>
        <form>
          <div className="flex justify-center items-center w-full h-full">
            <PEPhoneButton onVerify={handleVerificationSuccess} />
          </div>
        </form>
      </div >
    )
  }

  useState(() => setContent(defaultUI()));

  return <>{content}</>;
};

// ---------------- DONOR ROLE LOGIN PAGE CONTENT ----------------------------

const DonorContent: React.FC = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [content, setContent] = useState<JSX.Element | null>(null);

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
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome, Donor!</h1>
        <p className="mb-4">Here you can donate blood.</p>
        <form>
          <div className="flex justify-center items-center w-full h-full">
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
  const [content, setContent] = useState<JSX.Element | null>(null);

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
      <div>
        <h1 className="text-2xl font-bold mb-4">Registering as a Hospital 🏥</h1>
        <p className="mb-4">
          Connect directly with donors to get the blood your patients need.
        </p>
        <form>
          <div className="flex justify-center items-center w-full h-full pb-4">
            <PEEmailButton onVerify={handleVerificationSuccess} />
          </div>
        </form>
        <p className="text-gray-500 text-sm">Only professional emails allowed. No @gmail, @outlook, etc. Personal emails are currently allowed for testing.</p>
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
  const [content, setContent] = useState<JSX.Element | null>(null);

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
      <div>
        <h1 className="text-2xl font-bold mb-4">Registering as an Organisation/NGO 👥</h1>
        <p className="mb-4">
          Organize donation drives and support those in urgent need.
        </p>
        <form>
          <div className="flex justify-center items-center w-full h-full pb-4">
            <PEEmailButton onVerify={handleVerificationSuccess} />
          </div>
        </form>
        <p className="text-gray-500 text-sm">Only professional emails allowed. No @gmail, @outlook, etc. Personal emails are currently allowed for testing.</p>
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
    description:
      "Sign up to quickly request blood!",
    image: "/cs_patient.webp",
  },
  {
    title: "Continue as Donor",
    description:
      "Register to see where your donation saves lives.",
    image: "/cs_donor.webp",
  }
  ,
  {
    title: "Continue as Hospital",
    description:
      "Connect directly with donors to get the blood your patients need.",
    image: "/cs_hospital.webp",
  },
  {
    title: "Continue as Organisation/NGO",
    description:
      "Organize donation drives & support those in urgent need.",
    image: "/cs_organisation.webp",
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

export default function LoginPage() {
  const { setTheme } = useTheme()
  const [selectedRole, setSelectedRole] = useState<null | typeof items[0]>(null)
  const [direction, setDirection] = useState(1)

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
  const roleSelectionVariants = {
    initial: (dir: number) => (dir === -1 ? { x: "-100%" } : { x: 0 }),
    animate: {
      x: 0,
      transition: { type: "tween", duration: 0.1, ease: "easeInOut" },
    },
    exit: {
      x: "-100%",
      transition: { type: "tween", duration: 0.1, ease: "easeInOut" },
    },
  }

  const newScreenVariants = {
    initial: { x: "100%" },
    animate: {
      x: 0,
      transition: { type: "tween", duration: 0.1, ease: "easeInOut" },
    },
    exit: {
      x: "100%",
      transition: { type: "tween", duration: 0.1, ease: "easeInOut" },
    },
  }


  const { setUser } = useUser();

  // Using test data here
  function handleLogin(role: string) {
    const userId = "ABCD-EFGH"
    setUser(userId, "hospital", "no");
    router.push("/app");
  }

  return (<>

    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Theme Toggler at top right */}
      <div className="absolute top-0 right-0 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
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

      {/* Animate between screens */}
      <AnimatePresence mode="wait">
        {selectedRole === null ? (
          // Role selection screen
          <motion.div
            key="role-selection"
            custom={direction}
            variants={roleSelectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute w-full left-0 "
          >
            <div className="max-w-6xl mx-auto p-5 md:p-8 gap-5 md:gap-8 grid grid-cols-1">
              {items.map((item, i) => (
                <RoleCard
                  key={i}
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  onClick={() => handleRoleSelect(item)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          // New screen for the selected role.
          <motion.div
            key="new-screen"
            variants={newScreenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute w-screen flex flex-col items-center justify-center p-10"
          >
            {/* Wrap content in a centered container */}
            <div className="relative max-w-6xl mx-auto">
              <RoleContent role={selectedRole} />
              <div className="absolute top-[-50px] left-0">
                <Button
                  className="text-fg bg-bg border border-border focus:outline-none hover:bg-accent font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-background dark:text-foreground dark:border-border dark:hover:bg-accent"
                  onClick={handleGoBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>

  </>
  )
}
