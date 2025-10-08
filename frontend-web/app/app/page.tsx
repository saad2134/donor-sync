"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext"; // Import user context
import { useRouter } from "next/navigation";

// Import role-based dashboards
import PatDash from "@/components/portals/patientDash";
import DonDash from "@/components/portals/donorDash";
import HosDash from "@/components/portals/hospitalDash";
import OrgDash from "@/components/portals/organisationDash";

// Import role-based onboarding forms
import PatOnb from "@/components/onb-forms/patientOnb";
import DonOnb from "@/components/onb-forms/donorOnb";
import HosOnb from "@/components/onb-forms/hospitalOnb";
import OrgOnb from "@/components/onb-forms/organisationOnb";

import HeartLoading from "@/components/custom/HeartLoading"; // Heart loading animation

const AppPage = () => {
    const { userId, role, onboarded, device, setUser } = useUser(); // Get user data from context
    const router = useRouter();

    const [uiLoaded, setUiLoaded] = useState(false); // Track when UI is ready
    const [isLoading, setIsLoading] = useState(true); // Control HeartLoading visibility
    const [delayedUI, setDelayedUI] = useState(null); // Store delayed UI

    // Redirect guests (userId = null) to home after a short delay
    useEffect(() => {
        if (userId === null) {
            const timeout = setTimeout(() => {
                router.push("/");
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [userId, router]);

    // Step 1: Load UI in the background after 2s
    useEffect(() => {
        const uiTimer = setTimeout(() => {
            setDelayedUI(renderUI());
            setUiLoaded(true); // Mark UI as loaded
        }, 1500); // Delay UI rendering

        return () => clearTimeout(uiTimer);
    }, [onboarded, role]);

    // Step 2: Fade out loading animation after 1s (after UI is loaded)
    useEffect(() => {
        if (uiLoaded) {
            const loadingTimer = setTimeout(() => {
                setIsLoading(false);
            }, 500); // Delay hiding the HeartLoading animation

            return () => clearTimeout(loadingTimer);
        }
    }, [uiLoaded]);

    // Function to select UI based on role
    const renderUI = () => {
        if (onboarded === "yes") {
            switch (role) {
                case "patient": { }
                    {
                        const timeout = setTimeout(() => {
                            router.push("/app/p/dashboard");
                        }, 1000);
                        return; //return <PatDash />;
                    }
                case "donor":
                    {
                        const timeout = setTimeout(() => {
                            router.push("/app/d/dashboard");
                        }, 1000);
                        return; //return <DonDash />;
                    }
                case "hospital":
                    {
                        const timeout = setTimeout(() => {
                            router.push("/app/h/dashboard");
                        }, 1000);
                        return; //return <HosDash />;
                    }
                case "organisation":
                    {
                        const timeout = setTimeout(() => {
                            router.push("/app/o/dashboard");
                        }, 1000);
                        return; //return <OrgDash />;
                    }
                default:
                    return (
                        <div className="flex flex-col items-center justify-center h-screen text-left">
                            <h1 className="text-2xl font-bold">✅ Successfully Logged In:</h1>
                            <h2 className="text-1xl">Your Dashboard is being made.</h2>

                            {/* Display user data when available */}
                            <div className="mt-4">
                                <h2 className="text-lg">Role: {role}</h2>
                                <h2 className="text-lg">Onboarded: {onboarded}</h2>
                                <h2 className="text-lg">Device: {device}</h2>
                            </div>

                            <br />
                            <button
                                type="button"
                                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </div>
                    );
            }
        } else {
            switch (role) {
                case "patient":
                    return <PatOnb />;
                case "donor":
                    return <DonOnb />;
                case "hospital":
                    return <HosOnb />;
                case "organisation":
                    return <OrgOnb />;
            }
        }
    };

    // Handle logout function
    function handleLogout() {
        setUser(null, "guest", "guest");
        router.push("/");
    }

    return (
        <div className="relative">
            {/* UI Container */}
            <div
                className={`absolute inset-0 ${uiLoaded ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-250`}
            >
                {delayedUI || <p></p>}
            </div>

            {/* Smooth Fade-Out Heart Loading */}
            <div
                className={`fixed inset-0 flex items-center justify-center bg-background z-50 transition-opacity duration-250 ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                <HeartLoading />
            </div>
        </div>
    );
};

export default AppPage;
