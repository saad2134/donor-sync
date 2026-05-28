"use client";

import { useEffect } from "react";

interface PEPhoneButtonProps {
  onVerify: (data: {
    user_country_code: string;
    user_phone_number: string;
    user_first_name: string;
    user_last_name: string;
  }) => void;
}

const PEPhoneButton: React.FC<PEPhoneButtonProps> = ({ onVerify }) => {
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
    script.src = "https://www.phone.email/sign_in_button_v1.js";
    script.async = true;
    document.querySelector(".pe_signin_button")?.appendChild(script);

    // Core verification handler
    const verifyHandler = async (user_json_url: string) => {
      try {
        const response = await fetch("/api/verify-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_json_url }),
        });

        const data = await response.json();
        if (data.error) {
          alert(`❌ Error: ${data.error}`);
        } else {
          // Pass the data to the parent component
          onVerify({
            user_country_code: data.user_country_code,
            user_phone_number: data.user_phone_number,
            user_first_name: data.user_first_name,
            user_last_name: data.user_last_name,
          });
        }
      } catch (error) {
        console.error("Error during phone verification:", error);
      }
    };

    // Define the listener function (keeps popup flow functional if triggered)
    (window as any).phoneEmailListener = async (userObj: { user_json_url: string }) => {
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
      (window as any).phoneEmailListener = null;
    };
  }, [onVerify]);

  return (
    <div
      suppressHydrationWarning
      className="pe_signin_button"
      data-client-id="13006232029048972233"
    ></div>
  );
};

export default PEPhoneButton;
