"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//User Imports
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { updateUserData } from "@/firebaseFunctions"


// Fetch a single hospital by userId
export async function getHospitalById(userId: string) {
    try {
        const docRef = doc(db, "hospitals", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Hospital Data:", docSnap.data());
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such hospital found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching hospital:", error);
        return null;
    }
}


const hospitalDash = () => {
    const { userId, role, onboarded, device, setUser } = useUser();
    const router = useRouter();

    function handleLogout() {
        setUser(null, "guest", "guest");
        router.push("/");
    }

    const [hospital, setHospital] = useState<any>(null);

    // Fetch hospital data when the component loads
    useEffect(() => {
        if (userId) {
            async function fetchHospitalData() {
                const data = await getHospitalById(userId);
                setHospital(data); // Set hospital data (null if not found)
            }
            fetchHospitalData();
        }
    }, [userId]);

    return (
        <div className="flex flex-col items-center justify-center h-max text-left pt-10 pb-10 pl-10 pr-10">
            <h1 className="text-2xl font-bold">🏥 Welcome Hospital. </h1>
            <h1 className="text-2xl font-bold">✅ This is your dashboard!</h1>
            <br />
            <br />
            <h1 className="text-1xl">You've submitted all required details!</h1>
            <h1 className="text-1xl">You're Dashboard is being made. When it will be finished you'll be able to do many things like:</h1>

            <br />
            <ul>
                <li>- Connect with Donors</li>
                <li>- Let Patients book appointments with you.</li>
                <li>- Update the blood that is available for patients.</li>
            </ul>
            <br />
            <h2 className="text-1xl">& so much more.</h2>
            <br />
            <br />

            {/* Display user data when available */}
            <h1 className="text-2xl font-bold">These are some of your profile details:</h1>
            <div className="mt-4">
                <h2 className="text-lg">Hospital Name: {hospital?.h_name}</h2>
                <h2 className="text-lg">Hospital Email: {hospital?.email}</h2>
                <h2 className="text-lg">Hospital Type: {hospital?.h_type}</h2>
                <h2 className="text-lg">Hospital Website: {hospital?.h_website}</h2>
                <h2 className="text-lg">Monthly Patient Count: {hospital?.monthly_patient_count}</h2>
                <h2 className="text-lg">Hospital Country: {hospital?.h_region?.[0]}</h2>
                <h2 className="text-lg">Hospital State: {hospital?.h_region?.[1]}</h2>
                <h2 className="text-lg">Hospital City: {hospital?.h_city}</h2>
                <h2 className="text-lg">Hospital Phone: {hospital?.h_phone}</h2>
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

export default hospitalDash;
