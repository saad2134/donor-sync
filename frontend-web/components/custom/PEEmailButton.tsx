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
    // Load the external script
    const script = document.createElement("script");
    script.src = "https://www.phone.email/verify_email_v1.js";
    script.async = true;
    document.querySelector(".pe_verify_email")?.appendChild(script);

    // Define the listener function
    (window as any).phoneEmailReceiver = async (userObj: { user_json_url: string }) => {
      const user_json_url = userObj.user_json_url;

      try {
        const response = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_json_url }),
        });

        const data = await response.json();

        // ✅ Check if email exists before calling `toLowerCase()`
        const email = data.user_email_id?.toLowerCase().trim();
        if (!email) {
          alert("❌ Error: Email not found in response.");
          return;
        }

        // ✅ Pass structured user data to parent component
        onVerify({
          user_email: email,
          user_first_name: data.user_first_name || "Unknown",
          user_last_name: data.user_last_name || "Unknown",
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    return () => {
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
