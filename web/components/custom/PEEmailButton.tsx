"use client";

import { useEffect } from "react";

interface PEEmailButtonProps {
  onVerify: (data: {
    user_email: string;
    user_first_name: string;
    user_last_name: string;
  }) => void;
}

const PEEmailButton: React.FC<PEEmailButtonProps> = ({ onVerify }) => {
  useEffect(() => {
    // Intercept window.open to force same-tab redirect instead of popup
    const originalWindowOpen = window.open;
    window.open = function(
      url?: string | URL,
      target?: string,
      features?: string
    ): Window | null {
      const urlStr = url ? url.toString() : "";
      if (urlStr.includes("phone.email") || urlStr.includes("auth.phone.email")) {
        window.location.href = urlStr;
        return window;
      }
      return originalWindowOpen(url, target, features);
    };

    // Load the external script
    const script = document.createElement("script");
    script.src = "https://www.phone.email/verify_email_v1.js";
    script.async = true;
    document.querySelector(".pe_verify_email")?.appendChild(script);

    // Core verification handler
    const verifyHandler = async (user_json_url: string) => {
      try {
        const response = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_json_url }),
        });

        const data = await response.json();

        const email = data.user_email_id?.toLowerCase().trim();
        if (!email) {
          alert("❌ Error: Email not found in response.");
          return;
        }

        // Pass structured user data to parent component
        onVerify({
          user_email: email,
          user_first_name: data.user_first_name || "Unknown",
          user_last_name: data.user_last_name || "Unknown",
        });
      } catch (error) {
        console.error("Error during email verification:", error);
      }
    };

    // Define the listener function (keeps popup flow functional if triggered)
    (window as any).phoneEmailReceiver = async (userObj: { user_json_url: string }) => {
      verifyHandler(userObj.user_json_url);
    };

    // Check if user_json_url is already in URL (handles same-tab redirect callback)
    const searchParams = new URLSearchParams(window.location.search);
    const userJsonUrl = searchParams.get("user_json_url");
    if (userJsonUrl) {
      // Clean up the URL parameter so refreshing doesn't re-trigger verification
      const cleanParams = new URLSearchParams(window.location.search);
      cleanParams.delete("user_json_url");
      const newUrl = window.location.pathname + (cleanParams.toString() ? `?${cleanParams.toString()}` : "");
      window.history.replaceState({}, document.title, newUrl);
      
      // Trigger verification
      verifyHandler(userJsonUrl);
    }

    return () => {
      window.open = originalWindowOpen;
      (window as any).phoneEmailReceiver = null;
    };
  }, [onVerify]);

  return (
    <div
      suppressHydrationWarning
      className="pe_verify_email"
      data-client-id="13006232029048972233"
    ></div>
  );
};

export default PEEmailButton;
