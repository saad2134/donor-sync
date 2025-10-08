"use client";

import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const individualDash = () => {
    const { userId, role, onboarded, device, setUser } = useUser();
    const router = useRouter();

    function handleLogout() {
        setUser(null, "guest", "guest");
        router.push("/");
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen text-left">
            <h1 className="text-2xl font-bold">✅ Successfully Logged In:</h1>
            <h1 className="text-2xl font-bold">You're in individual dashboard!</h1>
            <h2 className="text-1xl">Your Dashboard is being made.</h2>
            <br />


            {/* Display user data when available */}
            <div className="mt-4">
                <h2 className="text-lg">User Id: {userId ?? "N/A"}</h2>
                <h2 className="text-lg">Role: {role}</h2>
                <h2 className="text-lg">Onboarded: {onboarded}</h2>
                <h2 className="text-lg">Device: {device}</h2>
            </div>

            <br />
            <br />
            <button
                type="button"
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={() => handleLogout()}
            >
                Log Out
            </button>


        </div>
    );
};

export default individualDash;
