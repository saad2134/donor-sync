"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//User Imports
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { updateUserData } from "@/firebaseFunctions"


// Fetch a single donor by userId
export async function getDonorById(userId: string) {
    try {
        const docRef = doc(db, "donors", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Donor Data:", docSnap.data());
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such donor found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching donor:", error);
        return null;
    }
}


const donorDash = () => {
    const { userId, role, onboarded, device, setUser } = useUser();
    const router = useRouter();

    function handleLogout() {
        setUser(null, "guest", "guest");
        router.push("/");
    }

    const [donor, setDonor] = useState<any>(null);

    // Fetch Donor data when the component loads
    useEffect(() => {
        if (userId) {
            async function fetchDonorData() {
                const data = await getDonorById(userId);
                setDonor(data); // Set Donor data (null if not found)
            }
            fetchDonorData();
        }
    }, [userId]);

    return (
        <div className="flex flex-col items-center justify-center h-max text-left pt-10 pb-10 pl-10 pr-10">
            <h1 className="text-2xl font-bold">❤️ Welcome Donor. </h1>
            <h1 className="text-2xl font-bold">✅ This is your dashboard!</h1>
            <br />
            <br />
            <h1 className="text-1xl">You've submitted all required details!</h1>
            <h1 className="text-1xl">You're Dashboard is being made. When it will be finished you'll be able to do many things like:</h1>

            <br />
            <ul>
                <li>- Connect with hospitals & Save Lives!!!</li>
                <li>- Track your donation history.</li>
                <li>- Update profile if you want to.</li>
            </ul>
            <br />
            <h2 className="text-1xl">& so much more.</h2>
            <br />
            <br />

            {/* Display user data when available */}
            <h1 className="text-2xl font-bold">These are some of your profile details:</h1>
            <div className="mt-4">
                <h2 className="text-lg">Your Phone: {donor?.phone}</h2>
                <h2 className="text-lg">Your Email: {donor?.email}</h2>
                <h2 className="text-lg">Your Name: {donor?.d_name}</h2>
                <h2 className="text-lg">Your Gender: {donor?.d_gender}</h2>
                <h2 className="text-lg">Your Date of Birth: {donor?.d_dob}</h2>
                <h2 className="text-lg">Your Blood Group: {donor?.d_bloodgroup}</h2>
                <h2 className="text-lg">Emergency Contact Name: {donor?.emergency_contact_name}</h2>
                <h2 className="text-lg">Emergency Contact Phone: {donor?.emergency_contact_phone}</h2>
                <h2 className="text-lg">Your Country: {donor?.d_region?.[0]}</h2>
                <h2 className="text-lg">Your State: {donor?.d_region?.[1]}</h2>
                
                <br />
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

export default donorDash;
