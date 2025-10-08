//@ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

import HeartLoading from "@/components/custom/HeartLoading";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { userId, role, onboarded } = useUser();
  const router = useRouter();

  const [uiLoaded, setUiLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [delayedUI, setDelayedUI] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (role !== "organisation") {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [userId, role, router]);

  useEffect(() => {
    const uiTimer = setTimeout(() => {
      setDelayedUI(children);
      setUiLoaded(true);
    }, 1500);

    return () => clearTimeout(uiTimer);
  }, [onboarded, role, children]);

  useEffect(() => {
    if (uiLoaded) {
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(loadingTimer);
    }
  }, [uiLoaded]);

  return (
    <AdminPanelLayout>
      {/* HeartLoading overlay (with fade effect) */}
      {isLoading && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-background z-50 transition-opacity duration-500 ${uiLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
          <HeartLoading />
        </div>
      )}

      {/* Actual Content */}
      <div
        className={`transition-opacity duration-500 ${uiLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {delayedUI || <p></p>}
      </div>
    </AdminPanelLayout>
  );
}
