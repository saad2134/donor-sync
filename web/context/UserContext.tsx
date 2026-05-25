// @ts-nocheck

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const COOKIE_ENCRYPT_KEY = process.env.NEXT_PUBLIC_COOKIE_ENCRYPT_KEY;

// Function to Encrypt Data
export function encryptData(data: string) {
  return CryptoJS.AES.encrypt(data, COOKIE_ENCRYPT_KEY).toString();
}

// Function to Decrypt Data
export function decryptData(ciphertext: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, COOKIE_ENCRYPT_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
}

// Function to Store Encrypted Cookie
export function setEncryptedCookie(name: string, value: string, days: number) {
  const encryptedValue = encryptData(value);
  Cookies.set(name, encryptedValue, { expires: days });
}

// Function to Retrieve and Decrypt Cookie
export function getDecryptedCookie(name: string) {
  const encryptedValue = Cookies.get(name);
  return encryptedValue ? decryptData(encryptedValue) : null;
}


// Define types
export type UserRole = "guest" | "patient" | "donor" | "hospital" | "organisation" | "admin" | "removed";
export type Onboarded = "guest" | "no" | "yes";
export type Device = "desktop" | "mobile";

// Define Context Interface
interface IUserContext {
  userId: string | null;
  role: UserRole;
  onboarded: Onboarded;
  device: Device;
  setUser: (userId: string | null, role: UserRole, onboarded: Onboarded) => void;
  setDevice: (device: Device) => void;
}

// Create Context with default values
const UserContext = createContext<IUserContext>({
  userId: null,
  role: "guest",
  onboarded: "guest",
  device: "desktop",
  setUser: () => { },
  setDevice: () => { },
});

// Provider Component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>("guest");
  const [onboarded, setOnboarded] = useState<Onboarded>("guest");
  const [device, setDevice] = useState<Device>("desktop");

  // Function to update User Context
  function setUser(newUserId: string | null, newRole: UserRole, newStatus: Onboarded) {
    setUserId(newUserId);
    setRole(newRole);
    setOnboarded(newStatus);

    // Store in cookies to persist session
    setEncryptedCookie("userId", newUserId || "", 7);
    setEncryptedCookie("role", newRole, 7);
    setEncryptedCookie("onboarded", newStatus, 7);
  }

  // Function to update device
  function updateDevice(newDevice: Device) {
    setDevice(newDevice);
  }

  // Load stored user data from cookies on mount
  useEffect(() => {
    const storedUserId = getDecryptedCookie("userId") || null;
    const storedRole = (getDecryptedCookie("role") as UserRole) || "guest";
    const storedStatus = (getDecryptedCookie("onboarded") as Onboarded) || "guest";

    setUserId(storedUserId !== "" ? storedUserId : null);
    setRole(storedRole);
    setOnboarded(storedStatus);

    // Detect device on mount (client-side only)
    if (typeof window !== "undefined") {
      setDevice(window.innerWidth < 500 ? "mobile" : "desktop");
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, role, onboarded, device, setUser, setDevice: updateDevice }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to access Context
export function useUser() {
  return useContext(UserContext);
}





// My Notes

/* 

|| States & Variables ||

userid: string

role: { default: guest, patient, donor, hospital, organisation, admin, banned }

onboarded: {default: guest | boolean}

device: { desktop, mobile }

perf: { low, high } 

*/